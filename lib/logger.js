/*
 * File: logger.js
 * Project: output-logger
 * Created Date: 19.01.2022 15:47:55
 * Author: 3urobeat
 * 
 * Last Modified: 20.01.2022 16:47:33
 * Modified By: 3urobeat
 * 
 * Copyright (c) 2022 3urobeat <https://github.com/HerrEurobeat>
 * 
 * Licensed under the MIT license: https://opensource.org/licenses/MIT
 * Permission is granted to use, copy, modify, and redistribute the work.
 * Full license information available in the project LICENSE file.
 */


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

    
    //put string together
    var tempStr = optionsObj.msgstructure;

    Object.keys(params).forEach((e) => {
        tempStr = tempStr.replace(e, params[e]);
    })


    //Check for empty parameters and remove them | This is far from dynamic and nice, but I'm not sure how to solve this problem otherwise right now
    Object.values(Const).forEach((e) => {
        tempStr = tempStr.split(`| ${e}] `).join("]");
        tempStr = tempStr.split(` [${e} |`).join("[");
        tempStr = tempStr.split(`[${e}] `).join("");

        tempStr = tempStr.split(`| ${e}) `).join(")");
        tempStr = tempStr.split(` (${e} |`).join("(");
        tempStr = tempStr.split(`(${e}) `).join("");
    })
    
    //Remove trailing white spaces
    tempStr = tempStr.trim();

    //Finally log string
    console.log(tempStr);


    //log to file
    require("./helpers/printToFile.js").printToFile(tempStr);

    return tempStr;
}