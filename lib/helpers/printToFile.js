/*
 * File: printToFile.js
 * Project: output-logger
 * Created Date: 19.01.2022 19:02:21
 * Author: 3urobeat
 *
 * Last Modified: 06.06.2023 11:40:39
 * Modified By: 3urobeat
 *
 * Copyright (c) 2022 3urobeat <https://github.com/HerrEurobeat>
 *
 * Licensed under the MIT license: https://opensource.org/licenses/MIT
 * Permission is granted to use, copy, modify, and redistribute the work.
 * Full license information available in the project LICENSE file.
 */


const fs = require("fs");

const typeColor  = require("./typeColor.js");
const optionsObj = require("../options.js").optionsObj;

let lastPrint = "";

/**
 * Handles cleaning the string and appending it to the log file
 * @param {string} str The string to append to the output file
 * @param {string} strWithoutAnimation The str to append to the output file without animation field filled out
 */
module.exports.printToFile = (str, strWithoutAnimation) => {

    // Either use string with first animation frame or clean string without animation field used
    let strToAppend;

    if (optionsObj.animationinoutputfile) strToAppend = str;
        else strToAppend = require("./removeEmptyParams.js").removeEmptyParams(strWithoutAnimation);

    // Remove color codes from the string
    strToAppend = typeColor._removeColorCodesFromString(strToAppend);

    // Avoid duplicate lines spamming log file when this is an animation that got refreshed
    if (strWithoutAnimation != str && strToAppend == lastPrint) return;

    // Update lastPrint
    lastPrint = strToAppend;

    // Append cleanedStr to the log file
    fs.appendFileSync(optionsObj.outputfile, strToAppend + "\n", (err) => {
        if (err) console.log(`[logger] Error appending log message to ${optionsObj.outputfile}: ${err}`);
    });

};