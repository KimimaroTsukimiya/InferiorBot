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
	context.mongo.label.aggregate([
		{ $match : doc },
		{ $group : { _id : "$label", label : { $sum : 1 } } },
		{ $sort : { label : -1 } }
	], function(err, arr) {
		if (err) {
			context.bot.sendMessage(chatId, context.vocabulary.sendError(err));
		} else {
			if (arr.length == 0) {
				context.bot.sendMessage(chatId, context.vocabulary.notFound());
			} else {
				for (var i = 0; i < arr.length; i++) {
					arr[i] = {
						'label' : arr[i]._id,
						'count' : arr[i].label
					};
				}
				context.addLastResult(chatId, {
					'content' : arr,
					'offset' : 0
				});
				context.sendResults(chatId);
			}
		}
	});
};
