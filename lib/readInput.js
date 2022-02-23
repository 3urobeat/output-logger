/*
 * File: readInput.js
 * Project: output-logger
 * Created Date: 23.02.2022 12:11:13
 * Author: 3urobeat
 * 
 * Last Modified: 23.02.2022 13:52:13
 * Modified By: 3urobeat
 * 
 * Copyright (c) 2022 3urobeat <https://github.com/HerrEurobeat>
 * 
 * Licensed under the MIT license: https://opensource.org/licenses/MIT
 * Permission is granted to use, copy, modify, and redistribute the work.
 * Full license information available in the project LICENSE file.
 */

const { logger }      = require("./logger");
const { printToFile } = require("./helpers/printToFile");

module.exports.active   = false;
module.exports.logQueue = [];    //Array containing args obj the logger was called with


/**
 * Waits for input from the terminal and returns it in a callback (logger() calls while waiting for input will be queued and logged after callback)
 * @param {String} question Ask user something before waiting for input. Pass a line break manually at the end of your String if user input should appear below this message, it will otherwise appear behind it. Pass empty String to disable.
 * @param {Number} timeout Time in ms after which a callback will be made if user does not respond. Pass 0 to disable (not recommended as your application can get stuck)
 * @param {function} [callback] Called with `input` (String) on completion or `null` if user did not respond in timeout ms.
 */
module.exports.readInput = (question, timeout, callback) => {

    //Disable logging while waiting for input
    module.exports.active = true;
    
    //Print question and log it to output if enabled
    if (question.length > 0) {
        process.stdout.write(question);
        printToFile(question, question);
    }

    var stdin = process.openStdin();

    //Start timeout if enabled
    if (timeout > 0) {
        var noResponseTimeout = setTimeout(() => {
            module.exports.active = false;
            
            stdin.pause();
            callback(null);

            //Log anything that might have been pushed into the queue and clear it
            module.exports.logQueue.forEach((e) => logger(e))
            module.exports.logQueue = [];
        }, timeout);
    }

    //Attach listener for input
    stdin.addListener("data", (text) => {
        if (timeout > 0) clearTimeout(noResponseTimeout); //stop timeout if enabled
        
        module.exports.active = false;
        stdin.pause(); //stop reading
        callback(text.toString().trim())

        //Log anything that might have been pushed into the queue and clear it
        module.exports.logQueue.forEach((e) => logger(e))
        module.exports.logQueue = [];
    })
    
}