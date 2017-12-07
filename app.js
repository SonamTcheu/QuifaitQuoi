var restify = require('restify');
var builder = require('botbuilder');

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});
  
// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: process.env.MicrosoftAppId,
    appPassword: process.env.MicrosoftAppPassword,
    stateEndpoint: process.env.BotStateEndpoint,
    openIdMetadata: process.env.BotOpenIdMetadata 
});

// Listen for messages from users 
server.post('/api/messages', connector.listen());

// Create your bot with a function to receive messages from the user
var bot = new builder.UniversalBot(connector);

// Make sure you add code to validate these fields
var luisAppId = process.env.LuisAppId; //68b76f1f-0299-4436-9e5a-e5bdc8ee8d5f
var luisAPIKey = process.env.LuisAPIKey; //
var luisAPIHostName = process.env.LuisAPIHostName || 'westus.api.cognitive.microsoft.com';

const LuisModelUrl = 'https://' + luisAPIHostName + '/luis/v1/application?id=' + luisAppId + '&subscription-key=' + luisAPIKey;

// Main dialog with LUIS
var recognizer = new builder.LuisRecognizer(LuisModelUrl);
var intents = new builder.IntentDialog({ recognizers: [recognizer] })
/*
.matches('<yourIntent>')... See details at http://docs.botframework.com/builder/node/guides/understanding-natural-language/
*/

bot.dialog('/', intents);
bot.dialog('/bienvenu', dialogs.bienvenu);
bot.dialog('/search', dialogs.search);

bot.dialog('/none', function (session, args, next) { 
    session.endDialog(none);
})

//All intents
intents.onBegin(function (session, args, next) {
    next();
})
.matches('bienvenu', function (session, args, next){
    if(args && args.score > 0.6)
    { 
        session.beginDialog('/bienvenu',args, next);
    }
    else{ session.endDialog();}
})
.matches('search', function (session, args, next){   
    if(args && args.score > 0.6)
    { 
        session.beginDialog('/search');
    }
    else{ session.endDialog();}
})
.onDefault((session) => {
    session.send('Sorry, I did not understand \'%s\'.', session.message.text);
});