const builder = require('botbuilder');

module.exports = [
 function (session, args, next) {
  builder.Prompts.text(session, 'Bonjour'); 
 },

]