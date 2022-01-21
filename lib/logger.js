/*
 * File: logger.js
 * Project: output-logger
 * Created Date: 19.01.2022 15:47:55
 * Author: 3urobeat
 * 
 * Last Modified: 21.01.2022 13:35:58
 * Modified By: 3urobeat
 * 
 * Copyright (c) 2022 3urobeat <https://github.com/HerrEurobeat>
 * 
 * Licensed under the MIT license: https://opensource.org/licenses/MIT
 * Permission is granted to use, copy, modify, and redistribute the work.
 * Full license information available in the project LICENSE file.
 */


const readline = require("readline");

const Const       = require("./data/constants.json")
const optionsObj  = require("./options.js").optionsObj;


/**
 * Handles the logging
 * @param {Array} args Array containing arguments passed to the function
 */
module.exports.logger = (args) => {
    
    //map the arguments to the params structure
    var params = {}
    args.map((e, i) => params[optionsObj.paramstructure[i]] = e);


    //Get color for type and put string together
    var tempStr = optionsObj.msgstructure;

    require("./helpers/typeColor.js").typeColor(params, (colorizedParams) => {
        Object.keys(colorizedParams).forEach((e) => {
            tempStr = tempStr.replace(e, colorizedParams[e]);
        })
    })


    //Add date or don't
    var formattedDate = (new Date(Date.now() - (new Date().getTimezoneOffset() * 60000))).toISOString().replace(/T/, ' ').replace(/\..+/, '');

    if (!params.nodate) tempStr = tempStr.replace(Const.DATE, `\x1b[96m${formattedDate}\x1b[0m`)


    //Check for empty parameters and remove them
    tempStr = require("./helpers/removeEmptyParams.js").removeEmptyParams(tempStr);
    
    //Remove trailing white spaces
    tempStr = tempStr.trim();

    //Finally log string
    if (params.remove) process.stdout.write(tempStr.slice(0, process.stdout.columns) + "\r") //cut message to terminal width to prevent spam
        else console.log(tempStr)


    //log to file
    require("./helpers/printToFile.js").printToFile(tempStr);

    return tempStr;
}