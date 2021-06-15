# output-logger
A simple but effective node.js logging library with file output.  

Currently very basic to fit my needs across my projects but will be improved in the near future.  

## Install
Open a terminal in your project folder and type:  
`$ npm install output-logger`

## Usage  
Import it and call it:
```
var { logger } = require("output-logger")

logger("info", "index.js", "My message", false, true)
```  

This example will output the `info` message `My message` from the file `index.js` with the current date and will get overwritten by the next new line in the terminal (but not replaced in the output.txt). The message will also be written to the file `output.txt` without any color codes:  
`[2021-06-14 23:07:35] [INFO | index.js] My message`  

## Syntax
### logger(type, origin, message, nodate, remove)
- `type` - String that determines the type of the log message. Can be `info`, `warn`, `error` or an empty string to not use the field.  
- `origin` - String that will show the origin file of your message. Can be an empty string to not use the field.  
- `message` - String that is your message.  
- `nodate` - Boolean that determines if your message should have no date. If false or undefined the date format will be `YYYY-MM-DD HH:MM:SS`  
- `remove` - Boolean that determines if your message should be removed by the next line. The message will not be removed from the log file.  
  
The message and the type & origin brackets will be colored accordingly to `type`. The date bracket will always be colored cyan.  