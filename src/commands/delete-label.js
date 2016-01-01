module.exports = function(context, msg, matches) {
	var chatId = msg.chat.id;
	var lastMessage = context.lastSent[chatId];
	var firstName = msg.from.first_name.toLowerCase();
	var username = msg.from.username.toLowerCase();
	if (lastMessage && lastMessage.label != firstName && lastMessage.label != username && lastMessage.label.toLowerCase() != 'gleencantor' && lastMessage.label.toLowerCase() != 'vizircantor') {
		var id = lastMessage.id;
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
