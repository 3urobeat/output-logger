/*
 * File: progressBar.js
 * Project: output-logger
 * Created Date: 13.04.2022 16:29:54
 * Author: 3urobeat
 * 
 * Last Modified: 30.05.2022 13:11:32
 * Modified By: 3urobeat
 * 
 * Copyright (c) 2022 3urobeat <https://github.com/HerrEurobeat>
 * 
 * Licensed under the MIT license: https://opensource.org/licenses/MIT
 * Permission is granted to use, copy, modify, and redistribute the work.
 * Full license information available in the project LICENSE file.
 */


const readline = require("readline");
const colors   = require("./data/colors.js");

//variable for tracking active progress bar
module.exports.activeProgressBar = {};

const hideCursor = "\x1B[?25l";
const showCursor = "\x1B[?25h";


/**
 * Creates new empty progress bar or overwrites existing one
 */
module.exports.createProgressBar = () => {

    //Create new progress bar
    this.activeProgressBar = { progress: 0 }; //currently quite empty, maybe I'll need to add more in the future?

    //create one-line space between messages and progress bar
    console.log("");
    process.stdout.moveCursor(0, 2);

    this.showProgressBar();

}


/**
 * Removes an active progress bar
 */
module.exports.removeProgressBar = () => {

    this.activeProgressBar = {};
    
    process.stdout.write(showCursor + "\r")
    readline.clearLine(process.stdout, 0) //0 clears entire line
    
}


/**
 * Increases progress of an active progress bar
 * @param {Number} amount Amount in percent to increase the progress bar with
 */
module.exports.increaseProgressBar = (amount) => {

    //create new progress bar if none exists
    if (Object.keys(this.activeProgressBar).length == 0) this.createProgressBar();

    //don't bother if progress already at 100, amount == 0 or not provided
    if (!amount || amount == 0 || this.activeProgressBar.progress >= 100) return;

    //add amount to progress but make sure it can't go over 100
    if (this.activeProgressBar.progress + Math.round(amount) >= 100) this.activeProgressBar.progress = 100
        else this.activeProgressBar.progress = this.activeProgressBar.progress + Math.round(amount);

    //show the new and shiny progress
    this.showProgressBar();

}


/**
 * Returns information about the active progress bar
 * @returns Object containing information about the active progress bar
 */
module.exports.getProgressBar = () => {
    return this.activeProgressBar;
}


/**
 * Internal function to handle appearance of progress bar
 */
module.exports.showProgressBar = () => {

    //Don't bother if none is active
    if (Object.keys(this.activeProgressBar).length == 0) return;

    //construct beginning of progress bar string
    let barStr = `${colors.brbggreen}${colors.fgblack}Progress: [`;

    //add current progress as percentage with one empty space if <100, or two if <10
    if (this.activeProgressBar.progress < 100 && this.activeProgressBar.progress < 10) barStr += "  ";
    if (this.activeProgressBar.progress < 100 && this.activeProgressBar.progress >  9) barStr += " ";

    barStr += `${this.activeProgressBar.progress}%]${colors.reset} [`;

    //get terminal width and subtract 19 for stuff infront and behind the progress hashtags
    let spaceForProgress = process.stdout.columns - 19;

    //get amount of hashtags we shall print for the current progress
    let amountOfHashtags = Math.round(spaceForProgress * (this.activeProgressBar.progress / 100));

    //add them all
    for (let i = 0; i < spaceForProgress; i++) {
        //add hashtags until satisfied and then fill with spaces
        if (i < amountOfHashtags) barStr += "#";
            else barStr += " ";
    }

    //add bracket to the end
    barStr += "]";

    //Output progress bar
    process.stdout.write(hideCursor + barStr + "\r");

}