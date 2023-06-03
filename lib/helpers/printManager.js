/*
 * File: printManager.js
 * Project: output-logger
 * Created Date: 07.06.2022 10:45:10
 * Author: 3urobeat
 * 
 * Last Modified: 03.06.2023 11:55:06
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

const hideCursor = "\x1B[?25l";
const showCursor = "\x1B[?25h";

let logCache = ["", "\n", ""]; //stores the last line, space and progress bar to be able to decide what belongs in which line of stdout without having to jump around with cursor
let removeLastMsg  = false;    //set to true if next call should overwrite last message
let lastLogReprint = false;    //if animation (which needs to be overwritten) has remove false, this will be set to true to remember to reprint line without animation frame on stop
let firstLogCall   = true;     //determine if log() call is the first time since lib import to do some one-time stuff


//Internal function that updates stdout
function printCurrentLogToStdout(str, remove, newProgressBar, leaveCursor, ignoreProgressBar) {
    //cursor management (Note: Our cursor always remains on the last printed line, *not* below it in a new line)
    if (Object.keys(progressBar.activeProgressBar).length > 0 && !newProgressBar && !ignoreProgressBar) readline.moveCursor(process.stdout, 0, -2); //Move cursor up if progress bar is active
    if (!removeLastMsg && str) process.stdout.write("\n");                                                                                //create a new line if the last line shouldn't be overwritten and str is defined

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
        if (i > 0 && (Object.keys(progressBar.activeProgressBar).length == 0 || ignoreProgressBar)) return; //ignore line 2 and 3 if no progress bar is active
        if (i == 1 && Object.keys(progressBar.activeProgressBar).length > 0) process.stdout.write("\n")     //add empty space after new message if progress bar is active so it won't be cleared instantly

        //Clear line to prevent ghost characters being left behind from a previous message
        readline.clearLine(process.stdout, 0) //0 clears entire line

        //print message and move cursor to front for a clean look (use process.stdout.write instead of console.log to not automatically attach a newline)
        if (remove) process.stdout.write(e.slice(0, process.stdout.columns) + cursorArgument); //cut length if remove is true so that no line break will be done by the terminal which prevents remove from working correctly
            else process.stdout.write(e + cursorArgument)
    })
}


/**
 * Manages cursor movement and logs a string to stdout
 * @param {string} type To determine how to handle this string. Leave empty for normal msg. Valid: `animationCreate`, `animationRemove`, `progressCreate`, `progressUpdate`, `progressRemove`, `exit`. 
 * @param {string} str The String to log
 * @param {boolean} remove If this message is supposed to be overwritten by the next message
 */
module.exports.log = (type, str, remove) => {
    //Do some one-time cursor management if not imported from child process
    if (firstLogCall && !optionsObj.required_from_childprocess) {
        printCurrentLogToStdout(hideCursor, true); //handle this via printManager to fix progress bar printed on start glitching into previous terminal line
        readline.moveCursor(process.stdout, 0, -1);
        firstLogCall = false; //track execution
    }

    //Block execution of stdout changing types if readInput is currently active
    if (readInput.active && !["readInputStart", "readInputStop", "animationRemove", "progressRemove"].includes(type)) return;

    //Handle all log types
    switch (type) {
        case "animationCreate":
            //make sure this animation will be reprinted if remove is false on animationRemove
            if (!remove) lastLogReprint = true;

            printCurrentLogToStdout(str, true);

            if (lastLogReprint) printToFile(animation.lastLogReprint, animation.lastLogReprint); // Make sure an animation overwrite appears in log if remove was/is false
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
            readline.moveCursor(process.stdout, 0, -2); //move cursor into last printed line again
            break;
        
        case "readInputStart":
            if (animation.activeAnimation && !animation.activeAnimation._destroyed) this.log("animationRemove"); //temporarily hide animation and progress bar if active
            if (Object.keys(progressBar.activeProgressBar).length > 0) this.log("progressRemove");
            
            printCurrentLogToStdout(showCursor + str, false, false, true, true);
            break;

        case "readInputEnd":
            readline.moveCursor(process.stdout, 0, -1);
            printCurrentLogToStdout(hideCursor, false, true);
            break;

        case "exit":
            //Clean up any active stuff
            animation.stopAnimation();
            progressBar.removeProgressBar();

            //Handle exitmessage, then let the process exit
            if (optionsObj.exitmessage.length == 0) {
                if (!optionsObj.required_from_childprocess) printCurrentLogToStdout(showCursor) //quickly create new line and show cursor before exiting so that the next line in the terminal won't overwrite our last logged line
            } else {
                let cursorArgument = showCursor
                if (optionsObj.required_from_childprocess) cursorArgument = "" //don't show cursor again if a parent process is still active as it will handle showing the cursor again

                printCurrentLogToStdout(cursorArgument + optionsObj.exitmessage + "\n"); //attach newline so that the next line in the terminal won't overwrite our exitmessage
                printToFile(optionsObj.exitmessage, optionsObj.exitmessage);
            }
            break;

        default:
            printCurrentLogToStdout(str, remove);
    }

}
