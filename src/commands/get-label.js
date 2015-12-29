module.exports = function(context, msg, matches) {
	var label = matches[1].toLowerCase();
	var verbose = matches[2] ? true : false;
	if (!context.isReserved(label)) {
		var chatId = '-6391848';//msg.chat.id;
		context.mongo.label.find({
			'chatId' : chatId,
			'label' : label
		}).toArray(function(err, arr) {
			if (err) {
				context.bot.sendMessage(chatId, context.vocabulary.sendError(err));
			} else {
				if (arr.length > 0) {
					var response = context.vocabulary.getRandomValue(arr);
					context.addLastSent(chatId, { 
						'id' : response.id,
						'label' : label
					});
					if (response.type == 'frase') { 
						context.bot.sendMessage(chatId, context.utils.capitalizeFirstLetter(label) + response.content);
					} else {
						context.bot.forwardMessage(chatId, chatId, response.id);
					}
				} else if (verbose) {
					context.bot.sendMessage(chatId, context.vocabulary.notFound(label));
				}
			}
		});
	}
};
