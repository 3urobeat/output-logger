/*
 * File: progressBar.js
 * Project: output-logger
 * Created Date: 13.04.2022 16:29:54
 * Author: 3urobeat
 *
 * Last Modified: 06.06.2023 16:05:20
 * Modified By: 3urobeat
 *
 * Copyright (c) 2022 3urobeat <https://github.com/HerrEurobeat>
 *
 * Licensed under the MIT license: https://opensource.org/licenses/MIT
 * Permission is granted to use, copy, modify, and redistribute the work.
 * Full license information available in the project LICENSE file.
 */


// const animation    = require("./animation.js");
const colors       = require("./data/colors.js");
const Const        = require("./data/constants.json");
const optionsObj   = require("./options").optionsObj;
const printToFile  = require("./helpers/printToFile.js");
const printManager = require("./helpers/printManager.js");

const { removeEmptyParams } = require("./helpers/removeEmptyParams.js");

// Variable for tracking active progress bar
module.exports.activeProgressBar = {};


/**
 * Helper function to print current progress to logfile
 */
function printProgressToLogFile() {
    if (optionsObj.printprogress) {
        let tempStr = optionsObj.msgstructure;

        tempStr = tempStr.replace(Const.TYPE, "PROGRESS");
        tempStr = tempStr.replace(Const.DATE, (new Date(Date.now() - (new Date().getTimezoneOffset() * 60000))).toISOString().replace(/T/, " ").replace(/\..+/, ""));
        tempStr = tempStr.replace(Const.MESSAGE, `Progress: ${module.exports.activeProgressBar.progress}%`);

        tempStr = removeEmptyParams(tempStr);

        printToFile.printToFile(tempStr, tempStr);
    }
}


/**
 * Creates new empty progress bar or overwrites existing one
 * @param {boolean} dontShow Set to true if this function shouldn't immediately call showProgress() (for example if you are doing it yourself right after)
 */
module.exports.createProgressBar = (dontShow) => {

    // Make sure something normal has been printed at least once so the cursor is in the right place, otherwise the terminal line might vanish
    printManager.log("", "", true);

    // Create new progress bar
    this.activeProgressBar = { progress: 0 }; // Currently quite empty, maybe I'll need to add more in the future?

    // Check if caller wants to do this himself
    if (dontShow) return;

    // Print progress to log file if enabled
    printProgressToLogFile();

    this.showProgressBar(true);

};


/**
 * Removes an active progress bar
 */
module.exports.removeProgressBar = () => {
    if (Object.keys(this.activeProgressBar).length == 0) return; // Ignore request if no progress bar is active

    this.activeProgressBar = {};

    printManager.log("progressRemove");
};


/**
 * Set progress of an active progress bar to a specific value
 * @param {number} amount Amount in percent to set the progress bar to
 */
module.exports.setProgressBar = (amount) => {
    let newBar = false;

    // Create new progress bar if none exists
    if (Object.keys(this.activeProgressBar).length == 0) {
        newBar = true;
        this.createProgressBar(true);
    }

    this.activeProgressBar.progress = Math.round(amount);

    // Print progress to log file if enabled
    printProgressToLogFile();

    // Show the bar with the updated progress
    if (newBar) this.showProgressBar(true);
        else this.showProgressBar();
};


/**
 * Increases progress of an active progress bar
 * @param {number} amount Amount in percent to increase the progress bar with
 */
module.exports.increaseProgressBar = (amount) => {
    let newBar = false;

    // Create new progress bar if none exists
    if (Object.keys(this.activeProgressBar).length == 0) {
        newBar = true;
        this.createProgressBar(true);
    }

    // Don't bother if progress already at 100, amount == 0 or not provided
    if (!amount || amount == 0 || this.activeProgressBar.progress >= 100) return;

    // Add amount to progress but make sure it can't go over 100
    if (this.activeProgressBar.progress + Math.round(amount) >= 100) this.activeProgressBar.progress = 100;
        else this.activeProgressBar.progress = this.activeProgressBar.progress + Math.round(amount);

    // Print progress to log file if enabled
    printProgressToLogFile();

    // Show the new and shiny progress
    if (newBar) this.showProgressBar(true);
        else this.showProgressBar();
};


/**
 * Returns information about the active progress bar
 * @returns {{ progress: number } | null} Object containing information about the active progress bar or null if none is active
 */
module.exports.getProgressBar = () => {
    if (Object.keys(this.activeProgressBar).length == 0) return null;
        else return this.activeProgressBar;
};


/**
 * Internal function to handle appearance of progress bar
 * @param {boolean} firstFrame true if this progress bar just got created
 */
module.exports.showProgressBar = (firstFrame) => {

    // Don't bother if none is active
    if (Object.keys(this.activeProgressBar).length == 0) return;

    // Construct beginning of progress bar string
    let barStr = `${colors.brbggreen}${colors.fgblack}Progress: [`;

    // Add current progress as percentage with one empty space if <100, or two if <10
    if (this.activeProgressBar.progress < 100 && this.activeProgressBar.progress < 10) barStr += "  ";
    if (this.activeProgressBar.progress < 100 && this.activeProgressBar.progress >  9) barStr += " ";

    barStr += `${this.activeProgressBar.progress}%]${colors.reset} [`;

    // Get terminal width and subtract 19 for stuff infront and behind the progress hashtags
    let spaceForProgress = process.stdout.columns - 19;

    // Get amount of hashtags we shall print for the current progress
    let amountOfHashtags = Math.round(spaceForProgress * (this.activeProgressBar.progress / 100));

    // Add them all
    for (let i = 0; i < spaceForProgress; i++) {
        // Add hashtags until satisfied and then fill with spaces
        if (i < amountOfHashtags) barStr += "#";
            else barStr += " ";
    }

    // Add bracket to the end
    barStr += "]";

    // Output progress bar
    if (firstFrame) printManager.log("progressCreate", barStr);
        else printManager.log("progressUpdate", barStr);

};