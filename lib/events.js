/*
 * File: events.js
 * Project: output-logger
 * Created Date: 2022-01-19 15:49:23
 * Author: 3urobeat
 *
 * Last Modified: 2024-12-22 15:43:08
 * Modified By: 3urobeat
 *
 * Copyright (c) 2022 - 2024 3urobeat <https://github.com/3urobeat>
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

    // Stop animation if one is active
    animation.stopAnimation();

    // Call process.exit() on manual exit and let the printManager handle cleaning up and printing the goodbye message afterwards (or directly on automatic exit)
    if (type != "exit") process.exit();
        else printManager.log("exit");
};
