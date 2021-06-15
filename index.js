/**
 * Logs your message to the terminal and to the output.txt file.
 * @param {String} type Type of your message. Can be 'info', 'warn', 'error' or an empty string to not use the field.
 * @param {String} origin Origin file of your message. Can be empty to not use the field.
 * @param {String} str Your message as a string.
 * @param {Boolean} nodate Set to true to remove date from message.
 * @param {Boolean} remove Set to true to let next message erase this one. Doesn't affect output.txt.
 * @returns 
 */
function logger(type, origin, str, nodate, remove) {

    const readline = require("readline")
    const fs       = require("fs")

    var str = String(str)
    if (str.toLowerCase().includes("error")) { 
        var str = `\x1b[31m${str}\x1b[0m`
    }

    //Define type
    if (type == 'info') {
        var typestr = `\x1b[96mINFO`
    } else if (type == 'warn') {
        var typestr = `\x1b[31mWARN`
    } else if (type == 'error') {
        var typestr = `\x1b[31m\x1b[7mERROR\x1b[0m\x1b[31m`
    } else {
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
    
    //Remove color codes from the string which we want to write to the text file
    fs.appendFileSync(`./output.txt`, string.replace(/\x1B\[([0-9]{1,2}(;[0-9]{1,2})?)?[m|K]/g, '') + '\n', err => { //Regex Credit: https://github.com/Filirom1/stripcolorcodes
        if(err) console.log('[logger] appendFileSync error: ' + err) 
    }) 

    return string; //Return String, maybe it is useful for the calling file
}

module.exports.logger = logger; //Export our function so that the user can import the library