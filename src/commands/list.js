module.exports = function(context, msg, matches) {
	var chatId = msg.chat.id;
	var type = matches[2] ? matches[2].replace(/^\s+/, '') : '.*';
	var keyword = matches[3] ? matches[3].toLowerCase().replace(/^\s+/, '') : '.*';
	var doc;
	if (type == "conteudo") {
		doc = {
			'chatId': chatId,
			'content' : new RegExp(keyword, 'i')
		};
	} else {
		doc = {
			'chatId': chatId,
			'type' : new RegExp(type, 'i'),
			'label' : new RegExp(keyword, 'i')
		};
	}
	context.mongo.label.distinct('label', doc, function(err, arr) {
		if (err) {
			context.bot.sendMessage(chatId, context.vocabulary.sendError(err));
		} else {
			if (arr.length == 0) {
				context.bot.sendMessage(chatId, context.vocabulary.notFound());
			} else {
				context.addLastResult(chatId, {
					'content' : arr,
					'offset' : 0
				});
				context.sendResults(chatId);
			}
		}
	});
};
