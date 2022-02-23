/*
 * File: options.js
 * Project: output-logger
 * Created Date: 19.01.2022 15:49:34
 * Author: 3urobeat
 * 
 * Last Modified: 23.02.2022 14:24:57
 * Modified By: 3urobeat
 * 
 * Copyright (c) 2022 3urobeat <https://github.com/HerrEurobeat>
 * 
 * Licensed under the MIT license: https://opensource.org/licenses/MIT
 * Permission is granted to use, copy, modify, and redistribute the work.
 * Full license information available in the project LICENSE file.
 */


const Const = require("./data/constants.json")

module.exports.optionsObj = {
    msgstructure: `[${Const.ANIMATION}] [${Const.TYPE} | ${Const.ORIGIN}] [${Const.DATE}] ${Const.MESSAGE}`,
    paramstructure: [Const.TYPE, Const.ORIGIN, Const.MESSAGE, "nodate", "remove", Const.ANIMATION],
    outputfile: "./output.txt",
    exitmessage: "",
    animationinterval: 750,
    animationinoutputfile: false,
    printdebug: false
}


module.exports.options = (customOptions) => { //Export the options function to make it call-able but under a different name to not conflict with options Object
    if (!customOptions) return;

    Object.keys(customOptions).forEach(e => {
        if (customOptions[e] && typeof(customOptions[e]) == typeof(this.optionsObj[e])) this.optionsObj[e] = customOptions[e] //overwrite the default option if not undefined and has the same data type
    });
}