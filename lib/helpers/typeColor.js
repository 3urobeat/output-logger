/*
 * File: typeColor.js
 * Project: output-logger
 * Created Date: 20.01.2022 17:03:09
 * Author: 3urobeat
 *
 * Last Modified: 30.06.2023 09:50:13
 * Modified By: 3urobeat
 *
 * Copyright (c) 2022 3urobeat <https://github.com/3urobeat>
 *
 * Licensed under the MIT license: https://opensource.org/licenses/MIT
 * Permission is granted to use, copy, modify, and redistribute the work.
 * Full license information available in the project LICENSE file.
 */


const colors = require("../data/colors");
const Const = require("../data/constants.json");

/**
 * Gets the corresponding color for the provided type and colorizes the parameters type, origin and message (if type is error)
 * @param {object} params The parameters the user called logger with
 * @param {function} [callback] Called with `colorizedParams` (Object) on completion
 */
module.exports.typeColor = (params, callback) => {
    let typeColor;

    if (params[Const.TYPE]) {
        switch (params[Const.TYPE].toLowerCase()) {
            case "info":
                typeColor = colors.brfgcyan;

                params[Const.TYPE] = `${typeColor}INFO`;
                break;
            case "warn":
            case "warning":
                typeColor = colors.fgred;

                params[Const.TYPE] = `${typeColor}WARN`;
                break;
            case "err":
            case "error":
                typeColor = colors.fgred;

                params[Const.TYPE] = `${typeColor}${colors.background}ERROR`;
                if (params[Const.MESSAGE] != "")  params[Const.MESSAGE] = `${typeColor}${params[Const.MESSAGE]}`;
                break;
            case "debug":
                typeColor = colors.brfgcyan;

                params[Const.TYPE] = `${typeColor}${colors.background}DEBUG`;
                break;
            default:
                typeColor = colors.reset;
        }

        if (params[Const.ORIGIN] != "") params[Const.ORIGIN] = `${typeColor}${params[Const.ORIGIN]}`;
    }

    callback(params);

};


/**
 * Internal: Removes all color and cursor escape characters from a string and returns it
 * @param {string} str Input string
 * @returns {string} Output string
 */
module.exports._removeColorCodesFromString = (str) => {
    return str.replace(/\x1B\[([0-9]{1,2}(;[0-9]{1,2})?)?[m|K]/g, "").replace(/\x1B\[\?25[lh]/g, ""); // Regex Credit: https://github.com/Filirom1/stripcolorcodes  + my own \x1B\[\?25[lh] to match hide & show cursor
};