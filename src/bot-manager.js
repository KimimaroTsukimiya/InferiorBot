BotManager = function(bot, mongo, vocabulary, utils, responseProbability) {
	this.bot = bot;
	this.mongo = mongo;
	this.vocabulary = vocabulary;
	this.utils = utils;
	this.responseProbability = responseProbability;
	this.commands = [];
	this.lastMessage = [];
	this.lastSent = [];
	this.lastResult = [];
	this.reservedWords = [];
	this.permanentCommands = [];
	this.adminPowers = [];
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
			str += '/' + this.lastResult[chatId].content[i].label + ' (' + this.lastResult[chatId].content[i].count + ')\n';
		}
		if (min != this.lastResult[chatId].content.length) {
			str += '\nDigite /mais para mostrar mais resultados (mostrando ' + min + ' de ' + this.lastResult[chatId].content.length + ' resultados).';
			this.lastResult[chatId].offset += 10;
		}
		this.bot.sendMessage(chatId, str);
	}
}

BotManager.prototype.getNumOccurrences = function(word, chatId) {
	this.mongo.label.aggregate([
		{ $match : { 'label' : new RegExp(this.utils.escapeRegExp(keyword), 'i'), 'chatId' : chatId } },
		{ $group : { _id : "$label", label : { $sum : 1 } } }
	], function(err, arr) {
		if (err || arr.length == 0) return 0;
		return arr[0]['label'];
	}
}

BotManager.prototype.talk = function(msg) {
	var message = msg.message;
	var chatId = msg.chat.id;
	var words = message.split(' ');
	var allOccurrences = [];
	for (var i = 0; i < words.length; i++) {
		var occurrences = this.getNumOccurrences(words[i], chatId);
		for (var j = 0; j < occurrences; j++) {
			allOccurrences.push(words[i]);
		}
	}
	// There are words to say!
	if (allOccurrences.length > 0) {
		// Get a random word, where words with most occurrence have more probability to be picked (roullete like schema)
		var word = this.vocabulary.getRandomValue(allOccurrences);
		// Say command label with word
		this.commands['get-label'].callback(this, msg, [word]);
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
			if (msg.message && Math.random() <= BotManager.responseProbability) {
				this.talk(msg);
			}
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

BotManager.prototype.setPermanentCommands = function() {
	this.permanentCommands = arguments;
}

BotManager.prototype.setAdminPowers = function() {
	this.adminPowers = arguments;
}

BotManager.prototype.isReserved = function(word) {
	return this.utils.contains(this.reservedWords, word);
}

BotManager.prototype.addCommand = function(name, pattern, description, callback) {
	this.commands[name] = {
		'pattern' : pattern,
		'description' : description,
		'callback' : callback
	};
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
