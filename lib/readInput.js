/*
 * File: readInput.js
 * Project: output-logger
 * Created Date: 23.02.2022 12:11:13
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


const { logger }   = require("./logger");
const printManager = require("./helpers/printManager.js");

let stdin;

module.exports.active   = false;
module.exports.logQueue = [];    // Array containing args obj the logger was called with


/**
 * Waits for input from the terminal and returns it in a callback (logger() calls while waiting for input will be queued and logged after callback)
 * @param {string} question Ask user something before waiting for input. Pass a line break manually at the end of your String if user input should appear below this message, it will otherwise appear behind it. Pass empty String to disable.
 * @param {number} timeout Time in ms after which a callback will be made if user does not respond. Pass 0 to disable (not recommended as your application can get stuck)
 * @param {function} [callback] Called with `input` (String) on completion or `null` if user did not respond in timeout ms.
 */
module.exports.readInput = (question, timeout, callback) => {

    // Disable logging while waiting for input
    module.exports.active = true;

    // Print question and log it to output if enabled
    printManager.log("readInputStart", question);

    stdin = process.openStdin();


    // Start timeout if enabled
    let noResponseTimeout;

    if (timeout > 0) {
        noResponseTimeout = setTimeout(() => {

            // Stop reading
            module.exports.active = false;
            stdin.pause();

            // Move cursor to the correct position
            printManager.log("readInputEnd");

            // Log anything that might have been pushed into the queue and clear it. We do this before the callback to keep a chronological order
            module.exports.logQueue.forEach((e) => logger(e));
            module.exports.logQueue = [];

            // Make callback indicating the timeout triggered now
            callback(null);

        }, timeout);
    }

    // Define callback function separately to be able to remove the listener again afterwards
    function cbFunc(text, stopped) {
        if (timeout > 0) clearTimeout(noResponseTimeout); // Stop timeout if enabled

        // Stop reading
        module.exports.active = false;
        stdin.pause();

        // Move cursor to the correct position and add timeout text if stopped is true
        if (stopped) printManager.log("readInputEnd", text);
            else printManager.log("readInputEnd");

        // Log anything that might have been pushed into the queue and clear it. We do this before the callback to keep a chronological order
        module.exports.logQueue.forEach((e) => logger(e));
        module.exports.logQueue = [];

        // Make callback with content now
        callback(text.toString().trim());

        // Remove this listener again to prevent duplicate callbacks
        stdin.removeListener("data", cbFunc);
    }

    // Attach listener for input
    stdin.addListener("data", cbFunc);

};


/**
 * Stops an active readInput() prompt and optionally logs text into the running prompt
 * @param {string} text Optional: Text that should be logged into the existing input prompt
 */
module.exports.stopReadInput = (text) => {

    // Ignore request if readInput is not active
    if (!module.exports.active) return;

    // Make sure we pass an empty string if text is undefined to not confuse readInput()
    if (!text) text = "";

    stdin.emit("data", text, true); // This is really hacky, but it works!

};