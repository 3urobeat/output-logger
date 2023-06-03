/*
 * File: events.js
 * Project: output-logger
 * Created Date: 19.01.2022 15:49:23
 * Author: 3urobeat
 * 
 * Last Modified: 03.06.2023 11:41:52
 * Modified By: 3urobeat
 * 
 * Copyright (c) 2022 3urobeat <https://github.com/HerrEurobeat>
 * 
 * Licensed under the MIT license: https://opensource.org/licenses/MIT
 * Permission is granted to use, copy, modify, and redistribute the work.
 * Full license information available in the project LICENSE file.
 */


const animation       = require("./animation.js");
const printManager    = require("./helpers/printManager.js");


/**
 * Handles node.js exit events to leave a clean stdout behind
 * @param {string} type The type of exit event
 */
module.exports.handleExit = (type) => {

    //Stop animation if one is active
    animation.stopAnimation();

    //Call process.exit() on manual exit and let the printManager handle cleaning up and printing the goodbye message afterwards (or directly on automatic exit)
    if (type != "exit") process.exit();
        else printManager.log("exit")
}