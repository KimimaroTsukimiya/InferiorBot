#!/bin/env node
 
// Load modules
var express = require('express');
var app = express();
var http = require('http');
var TelegramBot = require('node-telegram-bot-api');
var mongo = require('./mongo');
require('./bot-manager');

// Initialize connection to MongoDB
mongo.init(function (err) {
	if (err) { 
		console.log(err);
		throw err;
	} else {
		console.log('MongoDB connected successfully.');
	}
});

// Setup telegram bot
var token = process.env.TELEGRAM_TOKEN;
var bot = new TelegramBot(token, {polling: true});
console.log("Connecting to telegram bot with token " + token);

var manager = new BotManager(bot, mongo, require('./vocabulary'), require('./utils'));
manager.setReservedWords('help', 'ajuda', 'grava', 'salva', 'guarda', 'remove', 'deleta', 'lista', 'img', 'mais');
manager.addCommand(/^\/(help|ajuda)(@inferiorbot)?$/i, '/help - Mostra essa lista deplorável.', require('./commands/help'));
manager.addCommand(/^\/(grava|salva|guarda)(@inferiorbot)?\s+(\w+)$/i, '/salva <Rótulo> - Salva a última mensagem enviada sob um rótulo.', require('./commands/save-label'));
manager.addCommand(/^\/(\w+)(@inferiorbot)?(\W.+)$/i, '/<Rótulo> <Frase> - Salva uma frase relacionada a um rótulo.', require('./commands/save-phrase'));
manager.addCommand(/^\/(\w+)(@inferiorbot)?$/i, '/<Rótulo> - Encaminha uma mensagem enviada que foi gravada sob rótulo.', require('./commands/get-label'));
manager.addCommand(/^\/(remove|deleta)(@inferiorbot)?$/i, '/remove - Remove a última mensagem enviada por mim.', require('./commands/delete-label'));
manager.addCommand(/^\/(remove|deleta)(@inferiorbot)?\s+(\w+)(\W.+)$/i, '/remove <Rótulo> <Frase> - Remove uma frase associada a um rótulo.', require('./commands/delete-phrase'));
manager.addCommand(/^\/lista(@inferiorbot)?(\s+frase|\s+conteudo|\s+voz|\s+video|\s+imagem|\s+sticker|\s+texto)?(\s+.+)?$/i, '/lista <frase|conteudo|voz|video|imagem|sticker|texto> <palavra-chave> - Lista os rótulos salvos.', require('./commands/list'));
manager.init();

// Setup express
app.set('port', process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 8082);
app.set('ip', process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1');

http.createServer(app).listen(app.get('port') ,app.get('ip'), function () {
    console.log("✔ Express server listening at %s:%d ", app.get('ip'),app.get('port'));
    app.get('/', function(req, res) {
		res.end('Nothing to see. Move on.');
	});
});
