/*
 * File: logger.js
 * Project: output-logger
 * Created Date: 2022-01-19 15:47:55
 * Author: 3urobeat
 *
 * Last Modified: 2024-12-22 15:43:32
 * Modified By: 3urobeat
 *
 * Copyright (c) 2022 - 2024 3urobeat <https://github.com/3urobeat>
 *
 * Licensed under the MIT license: https://opensource.org/licenses/MIT
 * Permission is granted to use, copy, modify, and redistribute the work.
 * Full license information available in the project LICENSE file.
 */


const util        = require("util");
const colors      = require("./data/colors");
const Const       = require("./data/constants.json");
const progressBar = require("./progressBar.js");
const readInput   = require("./readInput");
const optionsObj  = require("./options.js").optionsObj;

const { typeColor }     = require("./helpers/typeColor.js");
const animation         = require("./animation.js");
const printManager      = require("./helpers/printManager.js");
const printToFile       = require("./helpers/printToFile.js");
const removeEmptyParams = require("./helpers/removeEmptyParams.js");


/**
 * Handles the logging
 * @param {array} args Array containing arguments passed to the function
 */
module.exports.logger = (args) => {

    // Map the arguments to the params structure
    let params = {};
    args.map((e, i) => params[optionsObj.paramstructure[i]] = e);


    // Hide debug messages if printdebug is false
    if (params[Const.TYPE] == "debug" && !optionsObj.printdebug) return;

    // Stop execution if readInput is waiting for a response
    if (readInput.active) {
        let indexOfTimestamp = optionsObj.paramstructure.indexOf("customTimestamp"); // Get index in paramstructure of customTimestamp
        if (indexOfTimestamp != -1) args[indexOfTimestamp] = Date.now(); // Add current timestamp at the correct position if found

        return readInput.logQueue.push(args);
    }


    // Get color for type and put string together
    let tempStr = optionsObj.msgstructure;

    typeColor(params, (colorizedParams) => {
        Object.keys(colorizedParams).forEach((e) => {
            if (e == Const.ANIMATION) return; // Animation will be handled by the animation() call below
            if (e == "cutToWidth" || e == "customTimestamp") return; // CutToWidth & custom Timestamp will be handled later
            if (colorizedParams[e] == "" && typeof colorizedParams[e] == "string") return; // Don't replace fields with empty strings (make sure parameter is of type string so we don't ignore 0 and [ null ] and stuff like that)
            if (e == "remove" || e == "nodate") return; // Ignore remove and nodate params as remove does not modify the msg and nodate is handled below

            // Handle special character $ of replace() function by adding another dollar sign to each dollar sign: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace#specifying_a_string_as_a_parameter
            if (String(colorizedParams[e]).includes("$")) colorizedParams[e] = String(colorizedParams[e]).replace(/\$/g, "$$$$"); // 4 dollar signs because this replace method will already loose 2

            // colorize and format message parameter like console.log() does if not string, otherwise all messages will appear in quotation marks
            if (e == Const.MESSAGE && typeof colorizedParams[e] != "string") tempStr = tempStr.replace(e, util.inspect(colorizedParams[e], false, 2, true) + colors.reset); // https://nodejs.org/en/knowledge/getting-started/how-to-use-util-inspect/
                else tempStr = tempStr.replace(e, colorizedParams[e] + colors.reset);
        });
    });


    // Add current date, custom date or nothing at all
    if (params.customTimestamp != undefined) { // Explicitly check for undefined as passing the number 0 would otherwise fail
        let formattedDate = (new Date(params.customTimestamp - (new Date().getTimezoneOffset() * 60000))).toISOString().replace(/T/, " ").replace(/\..+/, "");

        tempStr = tempStr.replace(Const.DATE, colors.brfgcyan + formattedDate + colors.reset);

    } else if (!params.nodate) {

        let formattedDate = (new Date(Date.now() - (new Date().getTimezoneOffset() * 60000))).toISOString().replace(/T/, " ").replace(/\..+/, "");

        tempStr = tempStr.replace(Const.DATE, colors.brfgcyan + formattedDate + colors.reset);
    }

    // Store unedited str in seperate value to be able to log string without animation later
    let strWithoutAnimation = tempStr;

    // Call animation handler
    tempStr = animation.handleAnimation(params, tempStr);


    // Check for empty parameters and remove them
    tempStr = removeEmptyParams.removeEmptyParams(tempStr);

    // Remove trailing white spaces
    // tempStr = tempStr.trim(); // Disabled for now


    // Finally log string using printManager but make sure printManager knows if we just started a new animation
    if (params[Const.ANIMATION]) printManager.log("animationCreate", tempStr, params.remove, params.cutToWidth);
        else printManager.log("", tempStr, params.remove, params.cutToWidth);


    // Log to file
    printToFile.printToFile(tempStr, strWithoutAnimation);


    // Show progress bar if one is active
    progressBar.showProgressBar();

    return tempStr;
};
