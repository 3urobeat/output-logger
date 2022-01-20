/*
 * File: options.js
 * Project: output-logger
 * Created Date: 19.01.2022 15:49:34
 * Author: 3urobeat
 * 
 * Last Modified: 20.01.2022 13:24:54
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
    animationinterval: 750,
    animationinoutputfile: false
}
