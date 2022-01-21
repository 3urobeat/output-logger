/*
 * File: events.js
 * Project: output-logger
 * Created Date: 19.01.2022 15:49:23
 * Author: 3urobeat
 * 
 * Last Modified: 21.01.2022 13:20:29
 * Modified By: 3urobeat
 * 
 * Copyright (c) 2022 3urobeat <https://github.com/HerrEurobeat>
 * 
 * Licensed under the MIT license: https://opensource.org/licenses/MIT
 * Permission is granted to use, copy, modify, and redistribute the work.
 * Full license information available in the project LICENSE file.
 */


const readline = require("readline");

const animation = require("./animation.js");

const showCursor = "\x1B[?25h";


module.exports.handleExit = (callExit) => {
    process.stdout.write(showCursor + "\r")
    readline.clearLine(process.stdout, 0) //0 clears entire line

    //reprint last message if we are instructed to do so
    if (animation.lastLogReprint && animation.lastLogReprint != "") {
        console.log(animation.lastLogReprint);
        animation.lastLogReprint = ""; //set to nothing so that the exit event, called by process.exit() below, doesn't attempt to do this again 
    }

    if (callExit) process.exit();
}