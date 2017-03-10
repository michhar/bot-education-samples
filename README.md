# bot-education-samples
Node.js bots built with the MS Bot Framework for basic dialogs and intelligence

## To run

### Get the prereqs

You'll be using Node.js, the Bot Framework Emulator, VSCode or similar editor, and the command line.  Get the prereqs listed here:

https://github.com/Azure/bot-education/wiki/Syllabus-for-2-Day-Workshop#prerequisites

### On command line

Right now I'm using botbuilder 3.6.0.  I'll update this soon, but for compatibility with other samples I chose this version.

If you have the package.json (which you should in these folders),  then just:
```
npm install
```

If you don't have a package.json do the following in the bot folder of your choosing:

```
npm install --save botbuilder@3.6.0
npm install --save restify
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


You could also follow instructions in the lab on this repo [here](https://github.com/michhar/bot-education-ocrbot/blob/master/LabStart.md) for any code you choose to write.

### Write an app

Write some bot code in VSCode or your dev env of choice and you may pull down some samples from:
* https://github.com/Microsoft/BotBuilder-Samples
* or this repo you are currently in which has bots



