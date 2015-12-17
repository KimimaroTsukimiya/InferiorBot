module.exports = function(context, msg, matches) {
	var chatId = msg.chat.id;
	var type = matches[2] ? matches[2].replace(/^\s+/, '') : '.*';
	var keyword = matches[3] ? matches[3].toLowerCase().replace(/^\s+/, '') : '.*';
	context.mongo.label.distinct({
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
