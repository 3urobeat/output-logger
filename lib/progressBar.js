/*
 * File: progressBar.js
 * Project: output-logger
 * Created Date: 13.04.2022 16:29:54
 * Author: 3urobeat
 * 
 * Last Modified: 13.04.2022 19:48:47
 * Modified By: 3urobeat
 * 
 * Copyright (c) 2022 3urobeat <https://github.com/HerrEurobeat>
 * 
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License along with this program. If not, see <https://www.gnu.org/licenses/>. 
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

    //add current progress as percentage with one empty space if <100
    if (this.activeProgressBar.progress < 100) barStr += " ";
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