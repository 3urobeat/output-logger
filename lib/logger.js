/*
 * File: logger.js
 * Project: output-logger
 * Created Date: 19.01.2022 15:47:55
 * Author: 3urobeat
 * 
 * Last Modified: 06.06.2022 14:19:34
 * Modified By: 3urobeat
 * 
 * Copyright (c) 2022 3urobeat <https://github.com/HerrEurobeat>
 * 
 * Licensed under the MIT license: https://opensource.org/licenses/MIT
 * Permission is granted to use, copy, modify, and redistribute the work.
 * Full license information available in the project LICENSE file.
 */


const util        = require("util");
const readline    = require("readline");
const colors      = require("./data/colors");
const Const       = require("./data/constants.json");
const progressBar = require("./progressBar.js");
const readInput   = require('./readInput');
const optionsObj  = require("./options.js").optionsObj;


/**
 * Handles the logging
 * @param {Array} args Array containing arguments passed to the function
 */
module.exports.logger = (args) => {
    
    //map the arguments to the params structure
    var params = {}
    args.map((e, i) => params[optionsObj.paramstructure[i]] = e);


    //Hide debug messages if printdebug is false
    if (params[Const.TYPE] == "debug" && !optionsObj.printdebug) return;

    //Stop execution if readInput is waiting for a response
    if (readInput.active) return readInput.logQueue.push(args);


    //Get color for type and put string together
    var tempStr = optionsObj.msgstructure;

    require("./helpers/typeColor.js").typeColor(params, (colorizedParams) => {
        Object.keys(colorizedParams).forEach((e) => {
            if (e == Const.ANIMATION) return; //animation will be handled by the animation() call below
            if (colorizedParams[e] == "" && typeof colorizedParams[e] == "string") return; //don't replace fields with empty strings (make sure parameter is of type string so we don't ignore 0 and [ null ] and stuff like that)

            //Handle special character $ of replace() function by adding another dollar sign to each dollar sign: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace#specifying_a_string_as_a_parameter
            if (String(colorizedParams[e]).includes("$")) colorizedParams[e] = String(colorizedParams[e]).replace(/\$/g, "$$$$") //4 dollar signs because this replace method will already loose 2

            //colorize and format message parameter like console.log() does if not string, otherwise all messages will appear in quotation marks
            if (e == Const.MESSAGE && typeof colorizedParams[e] != "string") tempStr = tempStr.replace(e, util.inspect(colorizedParams[e], false, 2, true)); //https://nodejs.org/en/knowledge/getting-started/how-to-use-util-inspect/
                else tempStr = tempStr.replace(e, colorizedParams[e]);
        })
    })


    //Add date or don't
    var formattedDate = (new Date(Date.now() - (new Date().getTimezoneOffset() * 60000))).toISOString().replace(/T/, ' ').replace(/\..+/, '');

    if (!params.nodate) tempStr = tempStr.replace(Const.DATE, colors.brfgcyan + formattedDate + colors.reset);

    //store unedited str in seperate value to be able to log string without animation later
    var strWithoutAnimation = tempStr;

    //call animation handler
    tempStr = require("./animation.js").handleAnimation(params, tempStr);
    

    //Check for empty parameters and remove them
    tempStr = require("./helpers/removeEmptyParams.js").removeEmptyParams(tempStr);
    
    //Remove trailing white spaces
    //tempStr = tempStr.trim(); //Disabled for now

    //Add color reset
    tempStr += colors.reset

    
    //move cursor up to jump over one-line gap created by progress bar
    if (Object.keys(progressBar.activeProgressBar).length > 0) {
        process.stdout.moveCursor(0, -1)
    }

    //Clear line to prevent ghost characters being left behind from a previous message
    readline.clearLine(process.stdout, 0) //0 clears entire line
    

    //Finally log string
    if (params.remove || params[Const.ANIMATION]) {
        process.stdout.write(tempStr.slice(0, process.stdout.columns) + "\r"); //cut message to terminal width to prevent spam
    } else {
        console.log(tempStr);
    }


    //log to file
    require("./helpers/printToFile.js").printToFile(tempStr, strWithoutAnimation);


    //move cursor back down again to create one-line gap again between text and progress bar
    if (Object.keys(progressBar.activeProgressBar).length > 0) {
        console.log("");                 //create empty line
        process.stdout.moveCursor(0, 2);
    }

    //show progress bar if one is active
    progressBar.showProgressBar();

    return tempStr;
}