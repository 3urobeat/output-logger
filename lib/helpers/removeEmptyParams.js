/*
 * File: removeEmptyParams.js
 * Project: output-logger
 * Created Date: 2022-01-21 12:48:19
 * Author: 3urobeat
 *
 * Last Modified: 2024-12-22 15:40:37
 * Modified By: 3urobeat
 *
 * Copyright (c) 2022 - 2024 3urobeat <https://github.com/3urobeat>
 *
 * Licensed under the MIT license: https://opensource.org/licenses/MIT
 * Permission is granted to use, copy, modify, and redistribute the work.
 * Full license information available in the project LICENSE file.
 */


const Const = require("../data/constants.json");


/**
 * Removes empty parameters from the string
 * @param {string} tempStr The full string that will be logged afterwards
 * @returns The cleaned string
 */
module.exports.removeEmptyParams = (tempStr) => {

    // This is far from dynamic and nice, but I'm not sure how to solve this problem otherwise right now
    Object.values(Const).forEach((e) => {
        tempStr = tempStr.split(` | ${e}]`).join("]");
        tempStr = tempStr.split(`[${e} | `).join("[");
        tempStr = tempStr.split(`[${e}] `).join("");

        tempStr = tempStr.split(` | ${e})`).join(")");
        tempStr = tempStr.split(`(${e} | `).join("(");
        tempStr = tempStr.split(`(${e}) `).join("");

        tempStr = tempStr.split(` ${e}`).join("");
        tempStr = tempStr.split(e).join("");
    });

    return tempStr;

};
