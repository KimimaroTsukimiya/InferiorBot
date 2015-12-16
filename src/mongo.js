var mongo = require('mongodb');

module.exports.init = function(callback) {
	new mongo.Db(process.env.OPENSHIFT_MONGODB_DB_NAME || "inferiorbot2", new mongo.Server(process.env.OPENSHIFT_MONGODB_DB_HOST || "localhost", process.env.OPENSHIFT_MONGODB_DB_PORT || 27017, {auto_reconnect: false, poolSize: 4}), {w:0, native_parser: false}).open(function(err, client) {
		if (!err) {
			client.authenticate(process.env.OPENSHIFT_MONGODB_DB_USERNAME || "admin", process.env.OPENSHIFT_MONGODB_DB_PASSWORD || "admin", function(err, res) {
				if (err) {
					callback(err);
				} else {
					module.exports.client = client;
					client.collection('label', function(err, collection) {
						if (err) callback(err);
						module.exports.label = collection;
					});
					callback();
				}
			});
		} else {
			callback(err);
		}
	});
};
