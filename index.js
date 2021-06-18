//Source code: https://github.com/HerrEurobeat/output-logger

const readline = require("readline")
const fs       = require("fs")


//Define default options to use if the user doesn't provide them
var options = {
    msgstructure: "[type | origin] [date] message",
    paramstructure: ["type", "origin", "str", "nodate", "remove"],
    outputfile: "./output.txt"
}


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
 * @returns {String} The finished message  
 */
module.exports = function () {
    var args = [];
    for (var i = 0; i < arguments.length; ++i) args[i] = arguments[i]; //Use 'arguments' to basically have unlimited parameters. Credit: https://stackoverflow.com/a/6396066

    //map function parameters to paramstructure
    var params = {}
    args.forEach((e, i) => {
        if (i + 1 > options.paramstructure.length) return; //should probably print error message later on

        params[options.paramstructure[i]] = e
    })

    var str = String(params.str)

    //Define type
    switch (params.type.toLowerCase()) {
        case 'info':
            var typecolor = "\x1b[96m"
            var typestr = `${typecolor}INFO\x1b[0m`
            break;
        case 'warn':
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

    //Put it together
    var string = options.msgstructure.replace("type", typestr).replace("origin", originstr).replace("date", date).replace("message", str) //this is shitty code and needs to be changed in the a future version when introducing custom options

    //Check for empty brackets and remove them
    var string = string.replace(/ \| ]/g, "]").replace(/\[ \| /g, "[").replace(/\[\] /g, "").replace(/ \[\]/g, "") //this probably needs to be updated in a future version to work better for edge cases
    var string = string.replace(/ \| \)/g, ")").replace(/\( \| /g, "(").replace(/\(\) /g, "").replace(/ \(\)/g, "")

    //Clear line and print message with remove or without
    readline.clearLine(process.stdout, 0) //0 clears entire line

    if (params.remove) process.stdout.write(`${string}\r`)
        else console.log(`${string}`) 
       
    //Write message to file
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