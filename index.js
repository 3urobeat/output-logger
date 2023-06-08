/*
 * File: index.js
 * Project: output-logger
 * Created Date: 15.06.2021 15:38:00
 * Author: 3urobeat
 *
 * Last Modified: 08.06.2023 11:13:49
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
 * `cutToWidth` - `Boolean`: Set to true to force cut each line of `str` to the current terminal width. Setting will be ignored if terminal is not a TTY.  
 * `customTimestamp` - `Number`: Changes the timestamp of the message being logged from now to a specific point in time. Overwrites `nodate`. Local timezone offset will be added to this timestamp.  
 * @returns {String} The finished message  
 */
module.exports = function () {
    let args = [];
    for (let j = 0; j < arguments.length; ++j) args[j] = arguments[j]; // Use 'arguments' to basically have unlimited parameters. Credit: https://stackoverflow.com/a/6396066

    return require("./lib/logger.js").logger(args);
};


/**
 * Provide custom options if you wish inside an `Object`.  
 * Documentation with default values and examples: https://github.com/HerrEurobeat/output-logger#options-1  
 * 
 * Values that you can customize:  
 * `required_from_childprocess` - Boolean: Set this to true if you are requiring the library in a child process and the parent process also already required the library.  
 * `msgstructure` - `String`: String containing keywords that will be replaced by your parameters when calling the logger function. Allows you to customize the structure of your log message.  
 * `paramstructure` - `Array<String>`: Array containing strings in the order you would like to have the parameters of the logger function. Allows you to prioritize parameters that you use more often.  
 * `outputfile` - `String`: Path to where you want to have your outputfile. Leave the string empty to disable the feature.  
 * `exitmessage` - `String`: A last message that will be printed when the application exits. Leave the string empty to disable the feature.  
 * `alwaysCutToWidth` - `Boolean`: Setting this to true will always cut every message to the width of the terminal. This setting only works when the terminal is a TTY!  
 * `animationinterval` - `Number`: Time in ms to wait between animation frames.  
 * `animationinoutputfile` - `Boolean`: Print the first frame of the used animation to the outputfile.  
 * `printdebug` - `Boolean`: Shows or hides log messages of type "debug".  
 * `printprogress` - `Boolean`: Logs progress bar changes to outputfile if set to true.  
 * @param {{ required_from_childprocess: boolean, msgstructure: string, paramstructure: array.<string>, outputfile: string, exitmessage: string, alwaysCutToWidth: boolean, animationinterval: number, animationinoutputfile: boolean, printdebug: boolean, printprogress: boolean }} customOptions Object containing key & value pairs of the setting you'd like to change
 */
module.exports.options = require("./lib/options.js").options;


/**
 * Returns the array of frames for the provided animation name
 * @param {string} animation Valid animation names: `loading`, `waiting`, `bounce`, `progress`, `arrows` or `bouncearrows`
 * @returns {array.<string>} Array containing all frames as strings of the chosen animation
 */
module.exports.animation = require("./lib/animation.js").animation;


/**
 * Stops any animation currently active
 */
module.exports.stopAnimation = require("./lib/animation.js").stopAnimation;


/**
 * Waits for input from the terminal and returns it in a callback (logger() calls while waiting for input will be queued and logged after callback)
 * @param {string} question Ask user something before waiting for input. Pass a line break manually at the end of your String if user input should appear below this message, it will otherwise appear behind it. Pass empty String to disable.
 * @param {number} timeout Time in ms after which a callback will be made if user does not respond. Pass 0 to disable (not recommended as your application can get stuck)
 * @param {function} [callback] Called with `input` (String) on completion or `null` if user did not respond in timeout ms.
 */
module.exports.readInput = require("./lib/readInput.js").readInput;


/**
 * Stops an active readInput() prompt and optionally logs text into the running prompt
 * @param {string} text Optional: Text that should be logged into the existing input prompt
 */
module.exports.stopReadInput = require("./lib/readInput.js").stopReadInput;


/**
 * Creates new empty progress bar or overwrites existing one
 * @param {boolean} dontShow Set to true if this function shouldn't immediately call showProgress() (for example if you are doing it yourself right after)
 */
module.exports.createProgressBar = require("./lib/progressBar.js").createProgressBar;


/**
 * Removes an active progress bar
 */
module.exports.removeProgressBar = require("./lib/progressBar.js").removeProgressBar;


/**
 * Set progress of an active progress bar to a specific value
 * @param {number} amount Amount in percent to set the progress bar to
 */
module.exports.setProgressBar = require("./lib/progressBar.js").setProgressBar;


/**
 * Increases progress of an active progress bar
 * @param {number} amount Amount in percent to increase the progress bar with
 */
module.exports.increaseProgressBar = require("./lib/progressBar.js").increaseProgressBar;


/**
 * Returns information about the active progress bar
 * @returns {{ progress: number } | null} Object containing information about the active progress bar or null if none is active
 */
module.exports.getProgressBar = require("./lib/progressBar.js").getProgressBar;



// Attach exit event listeners in order to do some misc stuff before exiting
const handleExit = require("./lib/events.js").handleExit;
const events = {"SIGUSR1": null, "SIGUSR2": null, "SIGTERM": null, "SIGINT": null, "exit": null}; // Attach loop below will store references to event function where the nulls currently are to make detaching possible

Object.keys(events).forEach((e) => process.on(e, events[e] = () => handleExit(e))); // Attach handleExit() to all events and store reference of attached function as value of event name key in obj above


// Provide detach function for example if user needs to clear cache and reimport lib without causing duplicate listeners
module.exports.detachEventListeners = () => Object.keys(events).forEach((e) => process.removeListener(e, events[e])); // Detach all our listeners using name and its corresponding function reference


/**
 * Constants for constructing message structure
 */
module.exports.Const = require("./lib/data/constants.json");


/**
 * Color shortcuts to use color codes more easily in your strings
 */
module.exports.colors = require("./lib/data/colors.js");