module.exports = function(context, msg, matches) {
	var label = matches[3].toLowerCase();
	var firstName = msg.from.first_name.toLowerCase();
	var username = msg.from.username.toLowerCase();
	if (!context.isReserved(label) && label != firstName && label != username && (label != "gleencantor" || label != "vizircantor" || label != "zanescantor" || username == "abnerhihi")) {
		var chatId 	= msg.chat.id;
		var id 		= context.lastMessage[chatId].id;
		var type 	= context.lastMessage[chatId].type;
		context.mongo.label.find({
			'chatId' : chatId,
			'id' : id
		}).toArray(function(err, arr) {
			if (err) {
				context.bot.sendMessage(chatId, context.vocabulary.sendError(err));
			} else {
				if (arr.length != 0) {
					context.bot.sendMessage(chatId, context.vocabulary.repeatedLabel(arr[0]));
				} else {
					context.mongo.label.insert({
						'chatId' : chatId,
						'id' : id,
						'label' : label,
						'type' : type,
						'content': ''
					}, function(err) {
						if (err) {
							context.bot.sendMessage(chatId, context.vocabulary.sendError(err));
						} else {
							context.addLastSent(chatId, {
								'id' : id,
								'label' : label
							});
							context.bot.sendMessage(chatId, context.vocabulary.sendSuccess());
						}
					});
				}
			}
		});
	}
};
