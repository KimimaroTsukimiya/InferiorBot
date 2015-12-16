module.exports = function(context, msg, matches) {
	var chatId = msg.chat.id;
	var first_name = msg.from.first_name;
	context.bot.sendMessage(chatId, context.vocabulary.greetings(first_name) + '\n' +
		context.vocabulary.getDescription() + '\n\n' +
		context.getCommandsString());
};
