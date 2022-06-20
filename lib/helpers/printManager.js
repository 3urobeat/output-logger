/*
 * File: printManager.js
 * Project: output-logger
 * Created Date: 07.06.2022 10:45:10
 * Author: 3urobeat
 * 
 * Last Modified: 20.06.2022 22:49:14
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
const { printToFile } = require("./printToFile.js");
const { optionsObj }  = require("../options.js");

const hideCursor = "\x1B[?25l";
const showCursor = "\x1B[?25h";

var logCache = ["", "\n", ""]; //stores the last line, space and progress bar to be able to decide what belongs in which line of stdout without having to jump around with cursor
var removeLastMsg  = false;    //set to true if next call should overwrite last message
var lastLogReprint = false;    //if animation (which needs to be overwritten) has remove false, this will be set to true to remember to reprint line without animation frame on stop


//Internal function that updates stdout
function printCurrentLogToStdout(str, remove, newProgressBar, leaveCursor) {
    //cursor management (Note: Our cursor always remains on the last printed line, *not* below it in a new line)
    if (Object.keys(progressBar.activeProgressBar).length > 0 && !newProgressBar) process.stdout.moveCursor(0, -2); //Move cursor up if progress bar is active
    if (!removeLastMsg && str) process.stdout.write("\n");                                                          //create a new line if the last line shouldn't be overwritten and str is defined

    //reset removeLastMsg if call is not a simple update and no progress bar was just created (aka a new message will be shown)
    if (removeLastMsg && str && !newProgressBar) removeLastMsg = false;

    //set removeLastMsg to true if next call should overwrite this message, otherwise reset
    if (remove) removeLastMsg = true;

    //update logCache if str was provided, otherwise we are probably just instructed to update output
    if (str) logCache[0] = str;

    //see if caller wants \r to be disabled (for example readInput)
    let cursorArgument = "\r"

    if (leaveCursor) cursorArgument = ""

    //print only first line of logCache if no progress bar is active
    logCache.forEach((e, i) => {
        if (i > 0 && Object.keys(progressBar.activeProgressBar).length == 0) return;                    //ignore line 2 and 3 if no progress bar is active
        if (i == 1 && Object.keys(progressBar.activeProgressBar).length > 0) process.stdout.write("\n") //add empty space after new message if progress bar is active so it won't be cleared instantly

        //Clear line to prevent ghost characters being left behind from a previous message
        readline.clearLine(process.stdout, 0) //0 clears entire line

        //print message and move cursor to front for a clean look (use process.stdout.write instead of console.log to not automatically attach a newline)
        if (remove) process.stdout.write(e.slice(0, process.stdout.columns) + cursorArgument); //cut length if remove is true so that no line break will be done by the terminal which prevents remove from working correctly
            else process.stdout.write(e + cursorArgument)
    })
}


/**
 * Manages cursor movement and logs a string to stdout
 * @param {String} type To determine how to handle this string. Leave empty for normal msg. Valid: `animationCreate`, `animationRemove`, `progressCreate`, `progressUpdate`, `progressRemove`, `exit`. 
 * @param {String} str The String to log
 * @param {Boolean} remove If this message is supposed to be overwritten by the next message
 */
module.exports.log = (type, str, remove) => {
    switch (type) {
        case "animationCreate":
            //make sure this animation will be reprinted if remove is false on animationRemove
            if (!remove) lastLogReprint = true;
            break;

        case "animationRemove":
            //check if animationCreate told us to reprint, otherwise clear line
            if (lastLogReprint) {
                printCurrentLogToStdout(animation.lastLogReprint);
                lastLogReprint = false; //reset value
            } else {
                readline.clearLine(process.stdout, 0);
            }
            break;

        case "progressCreate":
            logCache[2] = str;

            printCurrentLogToStdout("", false, true);
            break;

        case "progressUpdate":
            logCache[2] = str;

            printCurrentLogToStdout(); //print without args so that only the progress bar is getting changed and the last message stays the same
            break;

        case "progressRemove":            
            readline.clearLine(process.stdout, 0) //0 clears entire line
            process.stdout.moveCursor(0, -2); //move cursor into last printed line again
            break;
        
        case "readInputStart":
            printCurrentLogToStdout(showCursor + str, false, false, true)
            break;

        case "readInputEnd":
            process.stdout.write(hideCursor + "\r");
            break;

        case "exit":
            //Clean up any active stuff
            animation.stopAnimation();
            progressBar.removeProgressBar();

            //Handle exitmessage, then let the process exit
            if (optionsObj.exitmessage.length == 0) {
                printCurrentLogToStdout(showCursor) //quickly create new line and show cursor before exiting so that the next line in the terminal won't overwrite our last logged line
            } else {
                printCurrentLogToStdout(showCursor + optionsObj.exitmessage + "\n"); //attach newline so that the next line in the terminal won't overwrite our exitmessage
                printToFile(optionsObj.exitmessage, optionsObj.exitmessage);
            }
            break;

        default:
            printCurrentLogToStdout(str, remove);
    }

}


//Hide cursor the first time the lib (and therefore this module) is loaded and move cursor up as first print will otherwise create a one line gap
process.stdout.write(hideCursor);
process.stdout.moveCursor(0, -1);