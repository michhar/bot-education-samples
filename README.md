# bot-education-samples
Node.js bots built with the MS Bot Framework for basic dialogs and intelligence

## To run

### Get the prereqs (all install links can be found [here](https://github.com/michhar/bot-education/wiki)):
* Node.js (installs with npm now)
* Bot Framework Console Emulator
* Visual Studio Code or similar tool with intellisense and a debugger
* (Recommended) Enhanced commad line tools such as Powershell
* Knowledge of working on the command line in Windows or Unix (pretty much `dir == ls` and `move == mv` and a few others)
* Git to pull down samples

### On command line

```
npm init
npm install --save botbuilder@3.6.0
npm install --save restify
```

Right now I'm using botbuilder 3.6.0.  I'll update this soon, but for compatibility with other samples I chose this version.

If you have the package.json, instead of the above commands then just:
```
npm install
```

### To run

* Open VSCode or whichever code editor
* In VSCode you can select Integrated Terminal under View - to get a terminal window in VSCode
  * Or run on the command line in the bot folder
* Type on command line:

`node server.js`

* Replace server.js which whichever "server\<something\>.js" you'd like to run
* Open the Bot Framework emulator
* Find the right port (should look like: http://localhost:\<port you specified in server.js\>/api/messages)
* Leave fields blank for now and hit Connect
* Enjoy!


### Write an app

Write some bot code in VSCode or your dev env of choice and you may pull down some samples from:
* https://github.com/Microsoft/BotBuilder-Samples
* or this repo you are currently in which has bots


Follow instructions in the lab on this repo [here](https://github.com/michhar/bot-education-ocrbot/blob/master/LabStart.md) for any code you choose to write.
