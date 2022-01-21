/*
 * File: removeEmptyParams.js
 * Project: output-logger
 * Created Date: 21.01.2022 12:48:19
 * Author: 3urobeat
 * 
 * Last Modified: 21.01.2022 12:50:30
 * Modified By: 3urobeat
 * 
 * Copyright (c) 2022 3urobeat <https://github.com/HerrEurobeat>
 * 
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License along with this program. If not, see <https://www.gnu.org/licenses/>. 
 */


const Const = require("../data/constants.json");


/**
 * Removes empty parameters from the string
 * @param {String} tempStr The full string that will be logged afterwards
 * @returns The cleaned string
 */
module.exports.removeEmptyParams = (tempStr) => {

    //This is far from dynamic and nice, but I'm not sure how to solve this problem otherwise right now
    Object.values(Const).forEach((e) => {
        tempStr = tempStr.split(`| ${e}] `).join("]");
        tempStr = tempStr.split(` [${e} |`).join("[");
        tempStr = tempStr.split(`[${e}] `).join("");

        tempStr = tempStr.split(`| ${e}) `).join(")");
        tempStr = tempStr.split(` (${e} |`).join("(");
        tempStr = tempStr.split(`(${e}) `).join("");
    })

    return tempStr;
}