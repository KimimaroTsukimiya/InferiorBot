BotManager = function(bot, mongo, vocabulary, utils) {
	this.bot = bot;
	this.mongo = mongo;
	this.vocabulary = vocabulary;
	this.utils = utils;
	this.commands = [];
	this.lastMessage = [];
	this.lastSent = [];
	this.reservedWords = [];
}

BotManager.prototype.addLastSent = function(chatId, id) {
	this.lastSent[chatId] = id;
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