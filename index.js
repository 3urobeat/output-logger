//Source code: https://github.com/HerrEurobeat/output-logger
//This code isn't beautiful, don't expect too much, but it gets the job done for now.

//Define default options to use if the user doesn't provide them
var options = {
    msgstructure: "[animation] [type | origin] [date] message",
    paramstructure: ["type", "origin", "str", "nodate", "remove", "animation"],
    outputfile: "./output.txt",
    animationinterval: 750,
    animationinoutputfile: false
}


//A few default animations
var animations = {
    loading: [" | ", " / ", " - ", " \\ ", " | ", " / ", " - ", " \\ "],
    waiting: ["    ", ".   ", "..  ", "... ", "...."],
    bounce: ["=     ", " =    ", "  =   ", "   =  ", "    = ", "     =", "    = ", "   =  ", "  =   ", " =    "],
    progress: ["     ", "█    ", "██   ", "███  ", "████ ", "█████"],
    arrows: [">    ", ">>   ", ">>>  ", ">>>> ", ">>>>>"],
    bouncearrow: [">    ", " >   ", "  >  ", "   > ", "    >", "    <", "   < ", "  <  ", " <   ", "<    "]
}


var i;
var activeanimation; //stores the active interval
var lastanimation; //stores the last used animation
var lastlogreprint;
var lastanimationrefresh; //save timestamp of when the last animation frame was printed


//logger function has no name to reduce clutter when using and avoid the need of defining an alias or whatever
/**
 * Logs your message to the terminal and to your output file. The order of parameters depends on your paramstructure.  
 * If you are using the default values please see here: https://github.com/HerrEurobeat/output-logger#functions  
 *   
 * Parameter types (in default order):  
 * `type` - `String`: Type of your message. Can be `info`, `warn`, `error`, `debug` or an empty string to not use the field.  
 * `origin` - `String`: Origin file of your message. Can be empty to not use the field.  
 * `str` - `String`: Your message as a string.  
 * `nodate` - `Boolean`: Set to true to remove date from message.  
 * `remove` - `Boolean`: Set to true to let next message erase this one. Doesn't affect output.txt.  
 * `animation` - `Array`: Set an animation that will be shown in the field 'animation'. Will be cleared by your next logger call or by calling logger.stopAnimation().  
 * @returns {String} The finished message  
 */
module.exports = function () {
    const readline = require("readline")
    const fs       = require("fs")


    var args = [];
    for (let j = 0; j < arguments.length; ++j) args[j] = arguments[j]; //Use 'arguments' to basically have unlimited parameters. Credit: https://stackoverflow.com/a/6396066


    //map function parameters to paramstructure
    var params = {}
    args.forEach((e, i) => {
        if (i + 1 > options.paramstructure.length) return; //should probably print error message later on

        params[options.paramstructure[i]] = e
    })


    var str = String(params.str)


    //Modify msgstructure to be able to differentiate between keyword and content when replacing later
    options.msgstructure = options.msgstructure.replace("animation", "${#animation#}").replace("type", "${#type#}").replace("origin", "${#origin#}").replace("message", "${#message#}") //needs to be made modular with a loop later on


    //Define type
    if (!params.type) params.type = "" //set type to empty string if it wasn't defined so that .toLowerCase() doesn't fail

    switch (params.type.toLowerCase()) {
        case 'info':
            var typecolor = "\x1b[96m"
            var typestr = `${typecolor}INFO\x1b[0m`
            break;
        case 'warn':
        case 'warning':
            var typecolor = "\x1b[31m"
            var typestr = `${typecolor}WARN\x1b[0m`
            break;
        case 'err':
        case 'error':
            var typecolor = "\x1b[31m\x1b[7m"
            var typestr = `${typecolor}ERROR\x1b[0m`
            str = `\x1b[31m${str}\x1b[0m` //make the message red
            break;
        case 'debug':
            var typecolor = "\x1b[36m\x1b[7m"
            var typestr = `${typecolor}DEBUG\x1b[0m`
            break;
        default:
            var typecolor = "\x1b[96m" //let's use this as default color
            var typestr = ''
    }


    //Define origin
    if (params.origin && params.origin != "") {
        var originstr = `${typecolor}${params.origin}\x1b[0m` 
    } else {
        var originstr = ''
    }


    //Add date or don't
    if (params.nodate) var date = '';
        else var date = `\x1b[96m${(new Date(Date.now() - (new Date().getTimezoneOffset() * 60000))).toISOString().replace(/T/, ' ').replace(/\..+/, '')}\x1b[0m`  

    
    if (params.animation && typeof params.animation == "object") {
        var animation = params.animation
    } else {
        var animation = ""
    }


    //Put it together
    var string = options.msgstructure.replace("${#type#}", typestr).replace("${#origin#}", originstr).replace("date", date).replace("${#message#}", str) //this is shitty code and needs to be changed in the a future version when introducing custom options


    //Remove animation keyword if no animation was set
    if (animation == "") var string = string.replace("${#animation#}", "")


    //Check for empty brackets and remove them
    var string = string.replace(/ \| ]/g, "]").replace(/\[ \| /g, "[").replace(/\[\] /g, "").replace(/ \[\]/g, "") //this probably needs to be updated in a future version to work better for edge cases
    var string = string.replace(/ \| \)/g, ")").replace(/\( \| /g, "(").replace(/\(\) /g, "").replace(/ \(\)/g, "")


    //Clear line and reprint if last message lastlogreprint is true
    process.stdout.write("\x1B[?25h\r") //show the cursor again
    readline.clearLine(process.stdout, 0) //0 clears entire line
    clearInterval(activeanimation) //clear any old interval

    //reprint last message if we are instructed to do so
    if (lastlogreprint && lastlogreprint != "") {
        console.log(lastlogreprint)
        lastlogreprint = ""
    }


    //Print message and start animation
    if (animation != "") {
        if (lastanimation && lastanimation == animation) { //if the last animation is the same then continue with the last used index to make the transition seamless

            //Skip to next frame if last refresh is older than animationinterval to prevent animation frame getting stuck when this function is called more often than the interval would need to run at least once
            //console.log(Date.now() - lastanimationrefresh)
            if (Date.now() - lastanimationrefresh >= options.animationinterval) {
                i++;

                if (i > params.animation.length - 1) i = 0; //reset animation if last frame was reached

                lastanimationrefresh = Date.now();
            }

        } else {
            i = 0

            lastanimationrefresh = Date.now();
        }

        lastanimation = animation

        var thisstr = `\x1B[?25l${string.replace("animation", animation[i])}`
        process.stdout.write(thisstr.slice(0, process.stdout.columns) + "\r") //print with 'hide cursor' ascii code at the beginning and cut message to terminal width to prevent spam

        //if this message should not be removed then we need to reprint it on the next call without the animation field
        if (!params.remove) lastlogreprint = string.replace("[animation] ", "")


        activeanimation = setInterval(() => {
            i++

            if (i > params.animation.length - 1) i = 0; //reset animation if last frame was reached
            
            let thisstr = `\x1B[?25l${string.replace("animation", animation[i])}`
            process.stdout.write(thisstr.slice(0, process.stdout.columns) + "\r") //cut message to terminal width to prevent spam

            lastanimationrefresh = Date.now();
            
        }, options.animationinterval);

    } else {
        if (params.remove) {

            let thisstr = `${string}`
            process.stdout.write(thisstr.slice(0, process.stdout.columns) + "\r") //cut message to terminal width to prevent spam

        } else {
            console.log(`${string}`)
        }
    }
    
        
    //Write message to file
    if (options.outputfile && options.outputfile != "") { //only write to file if the user didn't turn off the feature
        if (options.animationinoutputfile) {
            var outputstring = string.replace("animation", animation[0])
        } else {
            var outputstring = string.replace("[animation] ", "")
        }

        //Remove color codes from the string which we want to write to the text file
        fs.appendFileSync(options.outputfile, outputstring.replace(/\x1B\[([0-9]{1,2}(;[0-9]{1,2})?)?[m|K]/g, '') + '\n', err => { //Regex Credit: https://github.com/Filirom1/stripcolorcodes
            if(err) console.log(`[logger] Error appending log message to ${options.outputfile}: ${err}`) 
        }) 
    }

    return string; //Return String, maybe it is useful for the caller
}


/**
 * Returns one of the default animations
 * @param {String} animation Valid animations: `loading`, `waiting`, `bounce`, `progress`, `arrows` or `bouncearrows`
 * @returns Array of the chosen animation
 */
module.exports.animation = (animation) => {
    return animations[animation]
}


/**
 * Stops any animation currently active
 */
module.exports.stopAnimation = () => {
    const readline = require("readline")

    clearInterval(activeanimation);

    //reprint last message if we are instructed to do so
    if (lastlogreprint && lastlogreprint != "") {
        console.log(lastlogreprint)
        lastlogreprint = ""
    }

    lastanimation = null //clear last animation so that the next animation always starts from index 0

    process.stdout.write("\x1B[?25h\r")
    readline.clearLine(process.stdout, 0) //0 clears entire line
}


//Define function that can be called to let the user define options
/**
 * Provide custom options if you wish inside an `Object`.  
 * Documentation with default values and examples: https://github.com/HerrEurobeat/output-logger#options-1  
 *   
 * Values that you can customize:  
 * `msgstructure` - `String`: String containing keywords that will be replaced by your parameters when calling the logger function. Allows you to customize the structure of your log message.  
 * `paramstructure` - `Array<String>`: Array containing strings in the order you would like to have the parameters of the logger function. Allows you to prioritize parameters that you use more often.  
 * `outputfile` - `String`: Path to where you want to have your outputfile. Leave the string empty to disable the feature.  
 * `animationinterval` - `Number`: Time in ms to wait between animation frames.  
 * `animationinoutputfile` - `Boolean`: Print the first frame of the used animation to the outputfile.
 */
module.exports.options = function optionsFunc(customOptions) { //Export the options function to make it call-able but under a different name to not conflict with options Object
    if (customOptions) {
        Object.keys(customOptions).forEach(e => {
            if (customOptions[e] != undefined && typeof(customOptions[e]) == typeof(options[e])) options[e] = customOptions[e] //overwrite the default option if not undefined and has the same data type
        });
    }
}


//Attach exit event listeners in order to show cursor again if it was hidden by an animation
process.on("SIGTERM", () => {
    process.stdout.write("\x1B[?25h\r")

    //reprint last message if we are instructed to do so
    if (lastlogreprint && lastlogreprint != "") {
        console.log(lastlogreprint)
        lastlogreprint = ""
    }

    process.exit()
});

process.on("SIGINT", () => {
    process.stdout.write("\x1B[?25h\r")

    //reprint last message if we are instructed to do so
    if (lastlogreprint && lastlogreprint != "") {
        console.log(lastlogreprint)
        lastlogreprint = ""
    }

    process.exit()
});

process.on("exit", () => {
    process.stdout.write("\x1B[?25h\r")

    //reprint last message if we are instructed to do so
    if (lastlogreprint && lastlogreprint != "") {
        console.log(lastlogreprint)
        lastlogreprint = ""
    }
});