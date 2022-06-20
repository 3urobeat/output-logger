/*
 * File: index.js
 * Project: output-logger
 * Created Date: 15.06.2021 15:38:00
 * Author: 3urobeat
 * 
 * Last Modified: 20.06.2022 18:17:37
 * Modified By: 3urobeat
 * 
 * Copyright (c) 2022 3urobeat <https://github.com/HerrEurobeat>
 * 
 * Licensed under the MIT license: https://opensource.org/licenses/MIT
 * Permission is granted to use, copy, modify, and redistribute the work.
 * Full license information available in the project LICENSE file.
 */


/**
 * Logs your message to the terminal and to your output file. The order of parameters depends on your paramstructure.  
 * If you are using the default values please see here: https://github.com/HerrEurobeat/output-logger#functions  
 *   
 * Parameter types (in default order):  
 * `type` - `String`: Type of your message. Can be `info`, `warn`, `error`, `debug` or an empty string to not use the field.  
 * `origin` - `String`: Origin file of your message. Can be empty to not use the field.  
 * `str` - `String`: Your message as a string.  
 * `nodate` - `Boolean`: Set to true to remove date from message.  
 * `remove` - `Boolean`: Set to true to let next message erase this one. Doesn't affect output.txt.  
 * `animation` - `Array`: Set an animation that will be shown in the field 'animation'. Will be cleared by your next logger call or by calling logger.stopAnimation().  
 * @returns {String} The finished message  
 */
module.exports = function () {
    var args = [];
    for (let j = 0; j < arguments.length; ++j) args[j] = arguments[j]; //Use 'arguments' to basically have unlimited parameters. Credit: https://stackoverflow.com/a/6396066

    return require("./lib/logger.js").logger(args);
}


/**
 * Provide custom options if you wish inside an `Object`.  
 * Documentation with default values and examples: https://github.com/HerrEurobeat/output-logger#options-1  
 * 
 * Values that you can customize:  
 * `msgstructure` - `String`: String containing keywords that will be replaced by your parameters when calling the logger function. Allows you to customize the structure of your log message.  
 * `paramstructure` - `Array<String>`: Array containing strings in the order you would like to have the parameters of the logger function. Allows you to prioritize parameters that you use more often.  
 * `outputfile` - `String`: Path to where you want to have your outputfile. Leave the string empty to disable the feature.  
 * `exitmessage` - `String`: A last message that will be printed when the application exits. Leave the string empty to disable the feature.  
 * `animationinterval` - `Number`: Time in ms to wait between animation frames.  
 * `animationinoutputfile` - `Boolean`: Print the first frame of the used animation to the outputfile.  
 * `printdebug` - `Boolean`: Shows or hides log messages of type "debug".  
 * `printprogress` - `Boolean`: Logs progress bar changes to outputfile if set to true.  
 */
module.exports.options = require("./lib/options.js").options;


/**
 * Returns one of the default animations
 * @param {String} animation Valid animations: `loading`, `waiting`, `bounce`, `progress`, `arrows` or `bouncearrows`
 * @returns Array of the chosen animation
 */
module.exports.animation = require("./lib/animation.js").animation;


/**
 * Stops any animation currently active
 */
module.exports.stopAnimation = require("./lib/animation.js").stopAnimation;


/**
 * Waits for input from the terminal and returns it in a callback (logger() calls while waiting for input will be queued and logged after callback)
 * @param {String} question Ask user something before waiting for input. Pass a line break manually at the end of your String if user input should appear below this message, it will otherwise appear behind it. Pass empty String to disable.
 * @param {Number} timeout Time in ms after which a callback will be made if user does not respond. Pass 0 to disable (not recommended as your application can get stuck)
 * @param {function} [callback] Called with `input` (String) on completion or `null` if user did not respond in timeout ms.
 */
module.exports.readInput = require("./lib/readInput.js").readInput;


/**
 * Creates new empty progress bar or overwrites existing one
 */
module.exports.createProgressBar = require("./lib/progressBar.js").createProgressBar;


/**
 * Removes the active progress bar
 */
module.exports.removeProgressBar = require("./lib/progressBar.js").removeProgressBar;


/**
 * Set progress of the active progress bar to a specific value
 * @param {Number} amount Number between 0 and 100 to set the progress bar to
 */
module.exports.setProgressBar = require("./lib/progressBar.js").setProgressBar;


/**
 * Increases progress of the active progress bar
 * @param {Number} amount Number between 0 and 100 to increase the progress bar with
 */
module.exports.increaseProgressBar = require("./lib/progressBar.js").increaseProgressBar;


/**
 * Returns information about the active progress bar
 * @returns Object containing information about the active progress bar
 */
module.exports.getProgressBar = require("./lib/progressBar.js").getProgressBar;



//Attach exit event listeners in order to do some misc stuff before exiting
const handleExit = require("./lib/events.js").handleExit

process.on("SIGUSR1", () => handleExit("SIGUSR1"));
process.on("SIGUSR2", () => handleExit("SIGUSR2"));
process.on("SIGTERM", () => handleExit("SIGTERM"));
process.on("SIGINT", () => handleExit("SIGINT"));
process.on("exit", () => handleExit("exit"));


/**
 * Constants for constructing message structure
 */
module.exports.Const = require("./lib/data/constants.json");


/**
 * Color shortcuts to use color codes more easily in your strings
 */
module.exports.colors = require("./lib/data/colors.js");