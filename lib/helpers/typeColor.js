/*
 * File: typeColor.js
 * Project: output-logger
 * Created Date: 20.01.2022 17:03:09
 * Author: 3urobeat
 *
 * Last Modified: 03.06.2023 11:54:40
 * Modified By: 3urobeat
 *
 * Copyright (c) 2022 3urobeat <https://github.com/HerrEurobeat>
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

                params[Const.TYPE] = `${typeColor}INFO${colors.reset}`;
                break;
            case "warn":
            case "warning":
                typeColor = colors.fgred;

                params[Const.TYPE] = `${typeColor}WARN${colors.reset}`;
                break;
            case "err":
            case "error":
                typeColor = colors.fgred;

                params[Const.TYPE] = `${typeColor}${colors.background}ERROR${colors.reset}`;
                if (params[Const.MESSAGE] != "")  params[Const.MESSAGE] = `${typeColor}${params[Const.MESSAGE]}${colors.reset}`;
                break;
            case "debug":
                typeColor = colors.brfgcyan;

                params[Const.TYPE] = `${typeColor}${colors.background}DEBUG${colors.reset}`;
                break;
            default:
                typeColor = colors.reset;
        }

        if (params[Const.ORIGIN] != "") params[Const.ORIGIN] = `${typeColor}${params[Const.ORIGIN]}${colors.reset}`;
    }

    callback(params);

};