module.exports = function(context, msg, matches) {
	var chatId = msg.chat.id;
	var id = context.lastSent[chatId];
	if (id) {
		context.mongo.label.remove({
			'chatId' : chatId,
			'id' : id
		}, function(err) {
			if (err) {
				context.bot.sendMessage(chatId, context.vocabulary.sendError(err));
			} else {
				context.bot.sendMessage(chatId, context.vocabulary.sendSuccess());
				context.addLastSent(chatId, false);
			}
		});
	}  else {
		context.bot.sendMessage(chatId, context.vocabulary.notFoundLast());
	}
};
