/*
 * File: printManager.js
 * Project: output-logger
 * Created Date: 07.06.2022 10:45:10
 * Author: 3urobeat
 *
 * Last Modified: 08.06.2023 13:10:00
 * Modified By: 3urobeat
 *
 * Copyright (c) 2022 3urobeat <https://github.com/HerrEurobeat>
 *
 * Licensed under the MIT license: https://opensource.org/licenses/MIT
 * Permission is granted to use, copy, modify, and redistribute the work.
 * Full license information available in the project LICENSE file.
 */


const readline = require("readline");

const animation       = require("../animation.js");
const progressBar     = require("../progressBar.js");
const readInput       = require("../readInput.js");
const { printToFile } = require("./printToFile.js");
const { optionsObj }  = require("../options.js");

const colors = require("../data/colors.js");

const hideCursor = "\x1B[?25l";
const showCursor = "\x1B[?25h";

let logCache = ["", "\n", ""]; // Stores the last line, space and progress bar to be able to decide what belongs in which line of stdout without having to jump around with cursor
let removeLastMsg  = false;    // Set to true if next call should overwrite last message
let lastLogReprint = false;    // If animation (which needs to be overwritten) has remove false, this will be set to true to remember to reprint line without animation frame on stop
let firstLogCall   = true;     // Determine if log() call is the first time since lib import to do some one-time stuff


// Internal function that updates stdout
function printCurrentLogToStdout(str = "", remove, cutToWidth, newProgressBar, leaveCursor, ignoreProgressBar) {

    // Cursor management (Note: Our cursor always remains on the last printed line, *not* below it in a new line)
    if (progressBar.getProgressBar() && !newProgressBar && !ignoreProgressBar) {
        readline.clearLine(process.stdout, 0);      // Clear progress bar so that long strings won't get caught inside its ghost chars. It will get reprinted by the logCache loop below
        readline.moveCursor(process.stdout, 0, -2); // Move cursor up if progress bar is active
    }

    if (!removeLastMsg && str) process.stdout.write("\n"); // Create a new line if the last line shouldn't be overwritten and str is defined

    // reset removeLastMsg if call is not a simple update and no progress bar was just created (aka a new message will be shown)
    if (removeLastMsg && str && !newProgressBar) removeLastMsg = false;

    // Set removeLastMsg to true if next call should overwrite this message, otherwise reset
    if (remove) removeLastMsg = true;

    // Add color reset to str
    if (str.length > 0) str += colors.reset;

    // Update logCache if str was provided, otherwise we are probably just instructed to update output
    if (str.length > 0) logCache[0] = str;

    // See if caller wants \r to be disabled (for example readInput)
    let cursorArgument = "\r";

    if (leaveCursor) cursorArgument = "";

    // Print only first line of logCache if no progress bar is active
    logCache.forEach((e, i) => {
        if (i > 0 && (!progressBar.getProgressBar() || ignoreProgressBar)) return; // Ignore line 2 and 3 if no progress bar is active
        if (i == 1 && progressBar.getProgressBar()) process.stdout.write("\n");    // Add empty space after new message if progress bar is active so it won't be cleared instantly

        // Split message by newline characters so we can clear each line
        let split = e.split("\n");

        split.forEach((f, j) => {
            if (j > 0) process.stdout.write("\n"); // Print newline char on iterations > 0 which got lost by split

            // Clear line to prevent ghost characters being left behind from a previous message
            readline.clearLine(process.stdout, 0); // 0 clears entire line

            // Handle remove only in the last line. Ignore if cutStrTo is NaN, caused by stdout.columns being undefined for pm2 for example
            if (((j + 1 == split.length && remove) || cutToWidth || optionsObj.alwaysCutToWidth) && process.stdout.columns) {
                let cutToRegex = new RegExp("(?:(?:\033[[0-9;]*m)*.?){1," + (process.stdout.columns - 1) + "}", "g"); // Regex to slice string without counting escape chars. Credit (modified): https://stackoverflow.com/a/33546712

                process.stdout.write(f.match(cutToRegex)[0] + cursorArgument + colors.reset); // Cut length because auto newlines break the remove functionality and add a reset color code which probably got removed by cutting the string
            } else {
                process.stdout.write(f + cursorArgument);
            }
        });
    });

}


/**
 * Manages cursor movement and logs a string to stdout
 * @param {string} type To determine how to handle this string. Leave empty for normal msg. Valid: `animationCreate`, `animationRemove`, `progressCreate`, `progressUpdate`, `progressRemove`, `exit`.
 * @param {string} str The String to log
 * @param {boolean} remove If this message is supposed to be overwritten by the next message
 * @param {boolean} cutToWidth Cuts every line of this message to the width of the terminal
 */
module.exports.log = (type, str, remove, cutToWidth) => {
    // Do some one-time cursor management if not imported from child process
    if (firstLogCall && !optionsObj.required_from_childprocess) {
        process.stdout.write(hideCursor + "\r");
        readline.moveCursor(process.stdout, 0, -1);
        firstLogCall = false; // Track execution
    }

    // Block execution of stdout changing types if readInput is currently active
    if (readInput.active && !["readInputStart", "readInputStop", "animationRemove", "progressRemove"].includes(type)) return;

    // Handle all log types
    switch (type) {
        case "animationCreate":
            // Make sure this animation will be reprinted if remove is false on animationRemove
            if (!remove) lastLogReprint = true;

            printCurrentLogToStdout(str, true);

            if (lastLogReprint) printToFile(animation.lastLogReprint, animation.lastLogReprint); // Make sure an animation overwrite appears in log if remove was/is false
            break;

        case "animationRemove":
            // Check if animationCreate told us to reprint, otherwise clear line
            if (lastLogReprint) {
                printCurrentLogToStdout(animation.lastLogReprint);
                lastLogReprint = false; // Reset value
            } else {
                if (progressBar.getProgressBar()) readline.moveCursor(process.stdout, 0, -2); // Make sure to move up where the animation actually is if a progress bar is active
                readline.clearLine(process.stdout, 0);
                if (progressBar.getProgressBar()) readline.moveCursor(process.stdout, 0, 2);
            }
            break;

        case "progressCreate":
            logCache[2] = str;

            process.stdout.write("\n\n" + str + "\r");
            break;

        case "progressUpdate":
            logCache[2] = str;

            // Only overwrite the progress bar, leave everything else unchanged
            readline.clearLine(process.stdout, 0); // 0 clears entire line
            process.stdout.write(logCache[2] + "\r");
            break;

        case "progressRemove":
            readline.clearLine(process.stdout, 0); // 0 clears entire line
            readline.moveCursor(process.stdout, 0, -2); // Move cursor into last printed line again
            break;

        case "readInputStart":
            if (animation.activeAnimation && !animation.activeAnimation._destroyed) this.log("animationRemove"); // Temporarily hide animation and progress bar if active
            if (progressBar.getProgressBar()) this.log("progressRemove");

            printCurrentLogToStdout(showCursor + str, false, false, false, true, true);
            break;

        case "readInputEnd":
            readline.moveCursor(process.stdout, 0, -1);
            printCurrentLogToStdout(hideCursor, false, false, true);
            break;

        case "exit":
            // Clean up any active stuff
            animation.stopAnimation();
            progressBar.removeProgressBar();

            // Handle exitmessage, then let the process exit
            if (optionsObj.exitmessage.length == 0) {
                if (!optionsObj.required_from_childprocess) printCurrentLogToStdout(showCursor); // Quickly create new line and show cursor before exiting so that the next line in the terminal won't overwrite our last logged line
            } else {
                let cursorArgument = showCursor;
                if (optionsObj.required_from_childprocess) cursorArgument = ""; // Don't show cursor again if a parent process is still active as it will handle showing the cursor again

                printCurrentLogToStdout(cursorArgument + optionsObj.exitmessage + "\n"); // Attach newline so that the next line in the terminal won't overwrite our exitmessage
                printToFile(optionsObj.exitmessage, optionsObj.exitmessage);
            }
            break;

        default:
            printCurrentLogToStdout(str, remove, cutToWidth);
    }

};
