/*
 * File: index.js
 * Project: output-logger
 * Created Date: 15.06.2021 15:38:00
 * Author: 3urobeat
 * 
 * Last Modified: 23.02.2022 12:47:04
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
 * Waits for input from the terminal and returns it in a callback (logger() calls while waiting for input will be queued and logged after callback)
 * @param {String} question Ask user something before waiting for input. Pass a line break manually at the end of your String if user input should appear below this message, it will otherwise appear behind it. Pass empty String to disable.
 * @param {Number} timeout Time in ms after which a callback will be made if user does not respond. Pass 0 to disable (not recommended as your application can get stuck)
 * @param {function} [callback] Called with `input` (String) on completion or `null` if user did not respond in timeout ms.
 */
module.exports.readInput = require("./lib/readInput.js").readInput;


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
 * Provide custom options if you wish inside an `Object`.  
 * Documentation with default values and examples: https://github.com/HerrEurobeat/output-logger#options-1  
 * 
 * Values that you can customize:  
 * `msgstructure` - `String`: String containing keywords that will be replaced by your parameters when calling the logger function. Allows you to customize the structure of your log message.  
 * `paramstructure` - `Array<String>`: Array containing strings in the order you would like to have the parameters of the logger function. Allows you to prioritize parameters that you use more often.  
 * `outputfile` - `String`: Path to where you want to have your outputfile. Leave the string empty to disable the feature.  
 * `animationinterval` - `Number`: Time in ms to wait between animation frames.  
 * `animationinoutputfile` - `Boolean`: Print the first frame of the used animation to the outputfile.
 * `printdebug` - `Boolean`: Shows or hides log messages of type "debug".
 */
module.exports.options = require("./lib/options.js").options;



//Attach exit event listeners in order to show cursor again if it was hidden by an animation
const handleExit = require("./lib/events.js").handleExit

process.on("SIGTERM", () => handleExit(true)  );
process.on("SIGINT",  () => handleExit(true)  );
process.on("exit",    () => handleExit(false) );


/**
 * Constants for constructing message structure
 */
module.exports.Const = require("./lib/data/constants.json");