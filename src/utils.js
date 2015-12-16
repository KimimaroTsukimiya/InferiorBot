module.exports = function() {

	// Upper case the first letter of a string
	this.capitalizeFirstLetter = function(string) {
		if (!string) return "";
		return string.charAt(0).toUpperCase() + string.slice(1);
	}

	this.contains = function(a, obj) {
		for (var i = 0; i < a.length; i++) {
			if (a[i] === obj) {
				return true;
			}
		}
		return false;
	}
	
	this.escapeRegExp = function(str) {
	  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
	}

	return this;
}();