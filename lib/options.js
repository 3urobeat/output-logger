/*
 * File: options.js
 * Project: output-logger
 * Created Date: 2022-01-19 15:49:34
 * Author: 3urobeat
 *
 * Last Modified: 2024-12-22 15:44:05
 * Modified By: 3urobeat
 *
 * Copyright (c) 2022 - 2024 3urobeat <https://github.com/3urobeat>
 *
 * Licensed under the MIT license: https://opensource.org/licenses/MIT
 * Permission is granted to use, copy, modify, and redistribute the work.
 * Full license information available in the project LICENSE file.
 */


const Const = require("./data/constants.json");


module.exports.optionsObj = {
    required_from_childprocess: false, // eslint-disable-line
    msgstructure: `[${Const.ANIMATION}] [${Const.TYPE} | ${Const.ORIGIN}] [${Const.DATE}] ${Const.MESSAGE}`,
    paramstructure: [Const.TYPE, Const.ORIGIN, Const.MESSAGE, "nodate", "remove", Const.ANIMATION, "cutToWidth", "customTimestamp"],
    outputfile: "./output.txt",
    exitmessage: "",
    alwaysCutToWidth: false,
    animationinterval: 750,
    animationinoutputfile: false,
    printdebug: false,
    printprogress: false
};


/**
 * Provide custom options if you wish inside an `Object`.  
 * Documentation with default values and examples: https://github.com/3urobeat/output-logger#options-1  
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
module.exports.options = (customOptions) => {
    if (!customOptions) return;

    Object.keys(customOptions).forEach(e => {
        // Overwrite the default option if not undefined (explicit check to prevent empty string triggering) and has the same data type
        if (customOptions[e] != undefined && typeof(customOptions[e]) == typeof(this.optionsObj[e])) {
            this.optionsObj[e] = customOptions[e];
        }
    });
};
