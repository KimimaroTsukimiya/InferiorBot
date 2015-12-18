module.exports = function(context, msg, matches) {
	var chatId = msg.chat.id;
	var label = matches[3].toLowerCase();
	var phrase = matches[4].toLowerCase();
	var verbose = matches[2] ? true : false;
	var firstName = msg.from.first_name.toLowerCase();
	var username = msg.from.username;
	if (label != firstName && label != username) {
		context.mongo.label.find({
			'chatId' : chatId,
			'label' : label,
			'content' : new RegExp('^' + context.utils.escapeRegExp(phrase.toLowerCase()) + '$', 'i')
		}).toArray(function(err, arr) {
			if (err) { 
				context.bot.sendMessage(chatId, context.vocabulary.sendError(err));
			} else {
				if (arr.length > 0) {
					context.mongo.label.remove({
						'chatId' : chatId,
						'label' : label,
						'content' : new RegExp('^' + context.utils.escapeRegExp(phrase.toLowerCase()) + '$', 'i')
					}, function(err) {
						if (err) { 
							context.bot.sendMessage(chatId, context.vocabulary.sendError(err));
						} else {
							context.bot.sendMessage(chatId, context.vocabulary.sendSuccess());
						}
					});
				} else if (verbose) {
					context.bot.sendMessage(chatId, context.vocabulary.notFound());
				}
			}
		});
	}
};
