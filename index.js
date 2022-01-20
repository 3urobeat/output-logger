/*
 * File: index.js
 * Project: output-logger
 * Created Date: 15.06.2021 15:38:00
 * Author: 3urobeat
 * 
 * Last Modified: 20.01.2022 13:23:57
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
 * Constants for constructing message structure
 */
module.exports.Const = require("./lib/data/constants.json");