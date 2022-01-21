/*
 * File: animation.js
 * Project: output-logger
 * Created Date: 19.01.2022 15:49:47
 * Author: 3urobeat
 * 
 * Last Modified: 21.01.2022 13:32:14
 * Modified By: 3urobeat
 * 
 * Copyright (c) 2022 3urobeat <https://github.com/HerrEurobeat>
 * 
 * Licensed under the MIT license: https://opensource.org/licenses/MIT
 * Permission is granted to use, copy, modify, and redistribute the work.
 * Full license information available in the project LICENSE file. 
 */


const readline = require("readline")

const Const      = require("./data/constants.json")
const animations = require("./data/animations.json")
const optionsObj = require("./options").optionsObj;

const hideCursor = "\x1B[?25l";
const showCursor = "\x1B[?25h";

var lastLogReprint;
var frame;
var activeAnimation;
var lastAnimation;
var lastAnimationRefresh;

module.exports.lastLogReprint = lastLogReprint; //export this value to be able to use it from events.js

/**
 * Keeps the animation running between logger calls
 * @param {String} tempStr The string the that will be logged later with the animation field still untouched
 * @param {*} animation 
 */
function animationUpdateInterval(tempStr, animation) {
    activeAnimation = setInterval(() => {

        frame++;
        if (frame > animation.length - 1) frame = 0; //reset animation if last frame was reached

        let modStr = require("./helpers/removeEmptyParams.js").removeEmptyParams(tempStr.replace(Const.ANIMATION, animation[frame]));
        process.stdout.write(hideCursor + modStr + "\r");

        lastAnimationRefresh = Date.now();

    }, optionsObj.animationinterval);
}


/**
 * Handles everything regarding animations
 * @param {Object} params The parameters the user called logger with
 * @param {String} tempStr The current string that will be logged later
 * @returns {String} The modified string
 */
module.exports.handleAnimation = (params, tempStr) => {

    //Clear line and reprint if last message lastlogreprint is true
    process.stdout.write("\x1B[?25h\r") //show the cursor again
    readline.clearLine(process.stdout, 0) //0 clears entire line
    clearInterval(activeAnimation) //clear any old interval


    //reprint last message if we are instructed to do so
    if (lastLogReprint && lastLogReprint != "") {
        console.log(lastLogReprint)
        lastLogReprint = ""
    }

    //make copy of tempStr
    var modStr = tempStr;
    

    //Get correct animation frame, replace animation field and start interval
    var animation = params[Const.ANIMATION];

    if (params[Const.ANIMATION]) {
        if (lastAnimation && lastAnimation == animation) { //if the last animation is the same as this one, then continue with the next frame instead of restarting the animation

            //Skip to next frame if last refresh is older than animationinterval to prevent animation frame getting stuck when this function is called more often than the interval would need to run at least once
            if (Date.now() - lastAnimationRefresh >= optionsObj.animationinterval) {
                frame++;
                if (frame > animation.length - 1) frame = 0; //reset animation if last frame was reached

                lastAnimationRefresh = Date.now();
            }
        } else {
            frame = 0;
            lastAnimationRefresh = 0;
        }

        //Remember which animation was last used
        lastAnimation = animation;

        //Put correct animation frame into the string and hide cursor so that it won't block the animation
        modStr = hideCursor + tempStr.replace(Const.ANIMATION, animation[frame]) + "\r";

        //if this message should not be removed then we need to reprint it on the next call without the animation field
        if (!params.remove) lastLogReprint = require("./helpers/removeEmptyParams.js").removeEmptyParams(tempStr);

        //start interval that keeps the animation running between logger calls
        animationUpdateInterval(tempStr, animation);
    }

    //Update exported lastLogReprint value
    this.lastLogReprint = lastLogReprint;

    //Return our modified version of the string
    return modStr;
}


/**
 * Returns the array of frames for the provided animation name
 * @param {String} animation The name of the animation
 */
module.exports.animation = (animation) => {
    return animations[animation]
}


/**
 * Stops any currently running animation
 */
module.exports.stopAnimation = () => {
    clearInterval(activeAnimation);

    //reprint last message if we are instructed to do so
    if (lastLogReprint && lastLogReprint != "") {
        console.log(lastLogReprint)
        lastLogReprint = ""
        
        //Update exported lastLogReprint value
        this.lastLogReprint = lastLogReprint;
    }

    lastAnimation = null //clear last animation so that the next animation always starts from index 0

    process.stdout.write(showCursor + "\r")
    readline.clearLine(process.stdout, 0) //0 clears entire line
}
