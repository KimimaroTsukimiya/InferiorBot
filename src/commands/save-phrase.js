module.exports = function(context, msg, matches) {
	var label = matches[1].toLowerCase();
	var phrase = matches[3];
	var firstName = msg.from.first_name.toLowerCase();
	var username = msg.from.username.toLowerCase();
	if (!context.isReserved(label) && phrase.charAt(0) != '@' && label != firstName && label != username) {
		var chatId 	= msg.chat.id;
		var id 		= msg.message_id;
		context.mongo.label.find({
			'chatId' : chatId,
			'content': new RegExp('^' + context.utils.escapeRegExp(phrase.toLowerCase()) + '$', 'i')
		}).toArray(function(err, arr) {
			if (err) {
				context.bot.sendMessage(chatId, context.vocabulary.sendError(err));
			} else {
				if (arr.length != 0) {
					context.bot.sendMessage(chatId, context.vocabulary.repeatedPhrase(arr[0]));
				} else {
					context.mongo.label.insert({
						'chatId' : chatId,
						'id' : id,
						'label' : label,
						'type' : 'frase',
						'content' : phrase
					}, function(err) {
						if (err) {
							context.bot.sendMessage(chatId, context.vocabulary.sendError(err));
						} else {
							context.addLastSent(chatId, {
								'id' : id,
								'label' : label
							});
							context.bot.sendMessage(chatId, context.vocabulary.sendSuccessPhrase(msg.from.first_name));
						}
					});
				}
			}
		});
	}
};
