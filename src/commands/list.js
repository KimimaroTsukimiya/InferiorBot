module.exports = function(context, msg, matches) {
	var chatId = msg.chat.id;
	var type = '.*';
	if (matches[2]) {
		type = matches[2].toLowerCase().replace(/^\s+/, '');
		type = context.utils.escapeRegExp(type);
	}
	var keyword = '.*';
	if (matches[3]) {
		keyword = matches[3].toLowerCase().replace(/^\s+/, '');
		keyword = context.utils.escapeRegExp(keyword);
	}
	bot.sendMessage(chatId, chatId + ' ' + type + ' ' + keyword);
	context.mongo.label.find({
		'chatId': chatId,
		'type' : new RegExp(type, 'i'),
		'label' : new RegExp(keyword, 'i')
	}).toArray(function(err, arr) {
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
