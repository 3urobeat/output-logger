//Source code: https://github.com/HerrEurobeat/output-logger

//Define default options to use if the user doesn't provide them
var options = {
    msgstructure: "",
    outputfile: "./output.txt"
}


//logger function has no name to reduce clutter when using and avoid the need of defining an alias or whatever
/**
 * Logs your message to the terminal and to the output.txt file.
 * @param {String} type Type of your message. Can be `info`, `warn`, `error`, `debug` or an empty string to not use the field.
 * @param {String} origin Origin file of your message. Can be empty to not use the field.
 * @param {String} str Your message as a string.
 * @param {Boolean} nodate Set to true to remove date from message.
 * @param {Boolean} remove Set to true to let next message erase this one. Doesn't affect output.txt.
 * @returns 
 */
module.exports = function (type, origin, str, nodate, remove) {

    const readline = require("readline")
    const fs       = require("fs")

    var str = String(str)

    //Define type
    switch (type.toLowerCase()) {
        case 'info':
            var typestr = `\x1b[96mINFO`
            break;
        case 'warn':
            var typestr = `\x1b[31mWARN`
            break;
        case 'error':
            var typestr = `\x1b[31m\x1b[7mERROR\x1b[0m\x1b[31m`
            break;
        case 'debug':
            var typestr = `\x1b[36m\x1b[7mDEBUG\x1b[0m`
            break;
        default:
            var typestr = ''
    }

    //Define origin
    if (origin != "") {
        if (typestr == "") var originstr = `\x1b[96m${origin}`
            else var originstr = `${origin}` 
    } else {
        var originstr = ''
    }

    //Add date or don't
    if (nodate) var date = '';
        else var date = `\x1b[96m[${(new Date(Date.now() - (new Date().getTimezoneOffset() * 60000))).toISOString().replace(/T/, ' ').replace(/\..+/, '')}]\x1b[0m `

    //Add filers
    var filler1 = ""
    var filler2 = ""
    var filler3 = ""

    if (typestr != "" || originstr != "") { 
        filler1 = "["
        filler3 = "\x1b[0m] " 
    }

    if (typestr != "" && originstr != "") {
        filler2 = " | " 
    }

    //Put it together
    var string = `${filler1}${typestr}${filler2}${originstr}${filler3}${date}${str}`

    //Print message with remove or without
    if (remove) {
        readline.clearLine(process.stdout, 0) //0 clears entire line
        process.stdout.write(`${string}\r`)
    } else {
        readline.clearLine(process.stdout, 0)
        console.log(`${string}`) 
    }
    
    if (options.outputfile && options.outputfile != "") { //only write to file if the user didn't turn off the feature
        //Remove color codes from the string which we want to write to the text file
        fs.appendFileSync(options.outputfile, string.replace(/\x1B\[([0-9]{1,2}(;[0-9]{1,2})?)?[m|K]/g, '') + '\n', err => { //Regex Credit: https://github.com/Filirom1/stripcolorcodes
            if(err) console.log(`[logger] Error appending log message to ${options.outputfile}: ${err}`) 
        }) 
    }

    return string; //Return String, maybe it is useful for the caller
}


//Define function that can be called to let the user define options
/**
 * Provide custom options if you wish
 * @param {Object} customOptions Please see the docs: https://github.com/HerrEurobeat/output-logger#options
 */
module.exports.options = function optionsFunc(customOptions) { //Export the options function to make it call-able but under a different name to not conflict with options Object
    if (customOptions) {
        Object.keys(customOptions).forEach(e => {
            if (customOptions[e] != undefined && typeof(customOptions[e]) == typeof(options[e])) options[e] = customOptions[e] //overwrite the default option if not undefined and has the same data type
        });
    }
}
