/*
 * File: colors.js
 * Project: output-logger
 * Created Date: 2022-02-23 14:38:33
 * Author: 3urobeat
 *
 * Last Modified: 2024-12-22 15:39:47
 * Modified By: 3urobeat
 *
 * Copyright (c) 2022 - 2024 3urobeat <https://github.com/3urobeat>
 *
 * Licensed under the MIT license: https://opensource.org/licenses/MIT
 * Permission is granted to use, copy, modify, and redistribute the work.
 * Full license information available in the project LICENSE file.
 */


// Color codes sadly can't be saved in a json file

/**
 * Color shortcuts to use color codes more easily in your strings
 */
module.exports = {
    reset: "\x1b[0m",
    bold: "\x1b[1m",
    dim: "\x1b[2m",
    italic: "\x1b[3m",
    underscore: "\x1b[4m",
    blink: "\x1b[5m",
    background: "\x1b[7m",
    hidden: "\x1b[8m",
    crossed: "\x1b[9m",

    fgblack: "\x1b[30m",
    fgred: "\x1b[31m",
    fggreen: "\x1b[32m",
    fgyellow: "\x1b[33m",
    fgblue: "\x1b[34m",
    fgmagenta: "\x1b[35m",
    fgcyan: "\x1b[36m",
    fgwhite: "\x1b[37m",

    bgblack: "\x1b[40m",
    bgred: "\x1b[41m",
    bggreen: "\x1b[42m",
    bgyellow: "\x1b[43m",
    bgblue: "\x1b[44m",
    bgmagenta: "\x1b[45m",
    bgcyan: "\x1b[46m",
    bgwhite: "\x1b[47m",

    brfgblack: "\x1b[90m",
    brfgred: "\x1b[91m",
    brfggreen: "\x1b[92m",
    brfgyellow: "\x1b[93m",
    brfgblue: "\x1b[94m",
    brfgmagenta: "\x1b[95m",
    brfgcyan: "\x1b[96m",
    brfgwhite: "\x1b[97m",

    brbgblack: "\x1b[100m",
    brbgred: "\x1b[101m",
    brbggreen: "\x1b[102m",
    brbgyellow: "\x1b[103m",
    brbgblue: "\x1b[104m",
    brbgmagenta: "\x1b[105m",
    brbgcyan: "\x1b[106m",
    brbgwhite: "\x1b[107m",
};
