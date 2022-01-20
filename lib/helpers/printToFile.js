/*
 * File: printToFile.js
 * Project: output-logger
 * Created Date: 19.01.2022 19:02:21
 * Author: 3urobeat
 * 
 * Last Modified: 20.01.2022 16:54:28
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
 */
module.exports.printToFile = (str) => {
    
    //Remove color codes from the string
    var cleanedStr = str.replace(/\x1B\[([0-9]{1,2}(;[0-9]{1,2})?)?[m|K]/g, ''); //Regex Credit: https://github.com/Filirom1/stripcolorcodes

    //Append cleanedStr to the log file
    fs.appendFileSync(optionsObj.outputfile, cleanedStr + '\n', (err) => {
        if (err) console.log(`[logger] Error appending log message to ${options.outputfile}: ${err}`)
    })
    
}