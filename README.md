# output-logger
A simple but effective node.js logging library with file output & animation support.  
Customizeable behaviour and even parameter structure!  

## Install
> Note: If you are here from GitHub **Packages** please use the npm package with the command below instead of the scoped GitHub command from above. It won't work.  

Open a terminal in your project folder and type:  
`npm install output-logger`

## Usage  
Import it and call it:
```
var logger = require("output-logger")
logger.options({}) //see section 'Options' below on how to configure the behaviour of the library

logger("info", "index.js", "My message", false, true)
```  

This example will output the `info` message `My message` from the file `index.js` with the current date and will get overwritten by the next new line in the terminal (but not replaced in the output.txt). The message will also be written to the file `output.txt` without any color codes:  
`[2021-06-14 23:07:35] [INFO | index.js] My message`  

## Functions
### options({})
- `{}` - Object that contains your custom options. Please see the [Options section](https://github.com/HerrEurobeat/output-logger#options)  

### (type, origin, message, nodate, remove)
- `type` - String that determines the type of the log message. Can be `info`, `warn`, `error`, `debug` or an empty string to not use the field.  
- `origin` - String that will show the origin file of your message. Can be an empty string to not use the field.  
- `message` - String that is your message.  
- `nodate` - Boolean that determines if your message should have no date. If false or undefined the date format will be `YYYY-MM-DD HH:MM:SS`  
- `remove` - Boolean that determines if your message should be removed by the next line. The message will not be removed from the log file.  
- `animation` - Array containing strings for every frame your animation should have or a call to the function animation("name") to use one of the default animations.  

The order of the parameters above can be changed. Take a look at `paramstructure` below in the 'Options' section!  
  
The message and the type & origin brackets will be colored accordingly to `type`. The date bracket will always be colored cyan.  
This function has no name. To call it call the variable name under which you imported the library.  
Example:  
```
var logger = require("output-logger")
logger("info", "index.js", "My message")
```  

### animation(name)
- `name` - Can be `loading`, `waiting`, `bounce`, `progress`, `arrows` or `bouncearrows`.  
  
This function returns the array of the default animation you chose.  
Provide the function call as the animation parameter to easily use it.  
  
Example: `logger("info", "index.js", "my message", false, false, logger.animation("loading"))`  
  
### stopAnimation()
No parameters.  
Clears the current animation (if one is running).  
You can also just call the logger function again and it will clear any current animation.  
  
## Options   
Call the function `options` and pass an options object to configure the behaviour of the library:  
`logger.options({ outputfile: "./test.txt" })`  

If you don't call this function after importing the library or you leave the object then these default options will be used:  
```
defaultOptions = {
    msgstructure: `[${logger.Const.ANIMATION}] [${logger.Const.TYPE} | ${logger.Const.ORIGIN}] [${logger.Const.DATE}] ${logger.Const.MESSAGE}`,
    paramstructure: [logger.Const.TYPE, logger.Const.ORIGIN, logger.Const.MESSAGE, "nodate", "remove", logger.Const.ANIMATION],
    outputfile: "./output.txt",
    animationinterval: 750,
    animationinoutputfile: false
}
```  
If you don't provide a specific value then the corresponding default value will be used.  

### msgstructure
String that contains supported keywords that will be replaced by the value you give them when calling the logging function. Take a look at the example above where I listed the default values to understand.  
This allows you to customize the structure of your log message.  

> Note: Please only use square or round brackets to surround keywords and pipes between keywords inside brackets as of now.  

### paramstructure  
Array that contains logger.Const strings in the order you would like to have the parameters of the logger function. This allows you to prioritize parameters that you use often by being able to call them before others.  
Take a look at the `defaultOptions` above to see all supported parameters. Shift around the array as you like to change the order.  
If you don't provide all supported parameters then you won't be able to use the parameters you left out.  

Example:  
Setting the paramstructure like this: `paramstructure: [logger.Const.MESSAGE, logger.Const.TYPE, logger.Const.ORIGIN]`  
...will now let you call the logger function like this: `logger("My message", "info", "index.js")`

### outputfile  
String which points to the file the library should write the output to (path). Provide the option but leave the string empty to disable the feature.  
  
### animationinterval
Time in ms to wait between animation frames.  
  
### animationinoutputfile
Print the first frame of the used animation to the outputfile.