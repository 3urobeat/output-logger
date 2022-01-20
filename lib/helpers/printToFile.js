/*
 * File: printToFile.js
 * Project: output-logger
 * Created Date: 19.01.2022 19:02:21
 * Author: 3urobeat
 * 
 * Last Modified: 20.01.2022 16:50:10
 * Modified By: 3urobeat
 * 
 * Copyright (c) 2022 3urobeat <https://github.com/HerrEurobeat>
 * 
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License along with this program. If not, see <https://www.gnu.org/licenses/>. 
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