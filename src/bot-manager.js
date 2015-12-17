BotManager = function(bot, mongo, vocabulary, utils) {
	this.bot = bot;
	this.mongo = mongo;
	this.vocabulary = vocabulary;
	this.utils = utils;
	this.commands = [];
	this.lastMessage = [];
	this.lastSent = [];
	this.lastResult = [];
	this.reservedWords = [];
}

BotManager.prototype.addLastSent = function(chatId, id) {
	this.lastSent[chatId] = id;
}

BotManager.prototype.addLastResult = function(chatId, result) {
	this.lastResult[chatId] = result;
}

BotManager.prototype.sendResults = function(chatId) {
	if (this.lastResult[chatId] && this.lastResult[chatId].offset < this.lastResult[chatId].content.length) {
		var str = '';
		var min = Math.min(this.lastResult[chatId].offset + 10, this.lastResult[chatId].content.length);
		for (var i = this.lastResult[chatId].offset; i < min; i++) {
			str += '/' + this.lastResult[chatId].content[i] + '\n';
		}
		if (min != this.lastResult[chatId].content.length) {
			str += '\nDigite /mais para mostrar mais resultados.';
			this.lastResult[chatId].offset += 10;
		}
		this.bot.sendMessage(chatId, str);
	}
}

BotManager.prototype.init = function() {
	var self = this;
	this.bot.on('message', function(msg) {
		if (!msg.text || (msg.text.charAt(0) != '\/' && msg.from.username.toLowerCase() != 'inferiorbot')) {
			self.lastMessage[msg.chat.id] = {
				'chatId' : msg.chat.id,
				'id' : msg.message_id,
				'type' : (msg.audio ? 'audio' : msg.voice ? 'voz' : msg.video ? 'video' : msg.photo ? 'imagem' : msg.sticker ? 'sticker' : 'texto')
			};
		}
	});
	this.bot.onText(/^\/mais(@inferiorbot)?$/i, function(msg) {
		var chatId = msg.chat.id;
		self.sendResults(chatId);
	});
}

BotManager.prototype.setReservedWords = function() {
	this.reservedWords = arguments;
}

BotManager.prototype.isReserved = function(word) {
	return this.utils.contains(this.reservedWords, word);
}

BotManager.prototype.addCommand = function(pattern, description, callback) {
	this.commands.push({
		'pattern' : pattern,
		'description' : description,
		'callback' : callback
	});
	var self = this;
	this.bot.onText(pattern, function(msg, matches) {
		callback(self, msg, matches);
	});
}

BotManager.prototype.getCommandsString = function() {
	var str = '';
	for (var i = 0; i < this.commands.length; i++) {
		str += this.commands[i].description + '\n';
	}
	return str;
}
