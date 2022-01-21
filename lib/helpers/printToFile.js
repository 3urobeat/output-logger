/*
 * File: printToFile.js
 * Project: output-logger
 * Created Date: 19.01.2022 19:02:21
 * Author: 3urobeat
 * 
 * Last Modified: 21.01.2022 19:58:39
 * Modified By: 3urobeat
 * 
 * Copyright (c) 2022 3urobeat <https://github.com/HerrEurobeat>
 * 
 * Licensed under the MIT license: https://opensource.org/licenses/MIT
 * Permission is granted to use, copy, modify, and redistribute the work.
 * Full license information available in the project LICENSE file.
 */


const fs = require("fs")

const optionsObj = require("../options.js").optionsObj;

/**
 * Handles cleaning the string and appending it to the log file
 * @param {String} str The string to append to the output file
 * @param {String} strWithoutAnimation The str to append to the output file without animation field filled out
 */
module.exports.printToFile = (str, strWithoutAnimation) => {
    
    //either use string with first animation frame or clean string without animation field used
    if (optionsObj.animationinoutputfile) var strToAppend = str;
        else var strToAppend = require("./removeEmptyParams.js").removeEmptyParams(strWithoutAnimation);

    //Remove color codes from the string
    strToAppend = strToAppend.replace(/\x1B\[([0-9]{1,2}(;[0-9]{1,2})?)?[m|K]/g, "").replace(/\x1B\[\?25[lh]/g, ""); //Regex Credit: https://github.com/Filirom1/stripcolorcodes  + my own \x1B\[\?25[lh] to match hide & show cursor

    //Append cleanedStr to the log file
    fs.appendFileSync(optionsObj.outputfile, strToAppend + '\n', (err) => {
        if (err) console.log(`[logger] Error appending log message to ${optionsObj.outputfile}: ${err}`)
    })
    
}