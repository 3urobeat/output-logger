/*
 * File: typeColor.js
 * Project: output-logger
 * Created Date: 20.01.2022 17:03:09
 * Author: 3urobeat
 * 
 * Last Modified: 20.01.2022 18:33:00
 * Modified By: 3urobeat
 * 
 * Copyright (c) 2022 3urobeat <https://github.com/HerrEurobeat>
 * 
 * Licensed under the MIT license: https://opensource.org/licenses/MIT
 * Permission is granted to use, copy, modify, and redistribute the work.
 * Full license information available in the project LICENSE file.
 */


const Const = require("../data/constants.json")

/**
 * Gets the corresponding color for the provided type and colorizes the parameters type, origin and message (if type is error)
 * @param {Object} params The parameters the user called logger with
 * @param {function} [callback] Called with `colorizedParams` (Object) on completion
 */
module.exports.typeColor = (params, callback) => {

    const reset = "\x1b[0m";
    const bg    = "\x1b[7m"

    var typeColor;

    switch (params[Const.TYPE].toLowerCase()) {
        case "info":
            typeColor = "\x1b[96m";

            params[Const.TYPE] = `${typeColor}INFO${reset}`
            break;
        case "warn":
        case "warning":
            typeColor = "\x1b[31m";

            params[Const.TYPE] = `${typeColor}WARN${reset}`
            break;
        case "err":
        case "error":
            typeColor = "\x1b[31m";

            params[Const.TYPE] = `${typeColor}${bg}ERROR${reset}`
            params[Const.MESSAGE] = `${typeColor}${params[Const.MESSAGE]}${reset}`
            break;
        case "debug":
            typeColor = "\x1b[96m";

            params[Const.TYPE] = `${typeColor}${bg}DEBUG${reset}`
            break;
        default:
            typeColor = reset;
    }

    params[Const.ORIGIN] = `${typeColor}${params[Const.ORIGIN]}${reset}`

    callback(params);

}