module.exports = function() {
	
	this.getRandomValue = function(arr) {
		if (arr.length == 0) return false;
		return arr[Math.floor(Math.random() * arr.length)];
	}
	
	this.greetings = function(name) {
		return this.getRandomValue(['O que é que você quer, ' + name + '?', 'Putz, ' + name + ', tu não vai me deixar em paz?',
			'Você é um saco, ' + name + '.', 'Lá vem você de novo, ' + name + '.']);
	}
	
	this.getDescription = function() {
		return 'Tá... Ugh duh esse é um bot bem bosta com comandos igualmente bostas.';
	}
	
	this.sendError = function(err) {
		return 'Putz, encontrei um erro. Foi esse aqui: ' + err + '. Conserta aê Abner, seu bosta.';
	}
	
	this.repeatedLabel = function(record) {
		return this.getRandomValue(['Já disseram isso, cara. Olha aê: /' + record.label + '.', 'Você tá se repetindo. Veja, anta: /' + record.label + '.', 
			'Já foi salvo antes. Você é burro? Toma: /' + record.label + '.']);
	}
	
	this.repeatedPhrase = function(record) {
		return this.getRandomValue(['Já disseram isso, cara.', 'Você tá se repetindo.', 'Já foi salvo antes. Você é burro?']);
	}
	
	this.notFound = function(record) {
		return this.getRandomValue(['Não encontrei esse comando, cara.', 'Usa o comando direito, rapá. Isso aí nem existe ainda.', 'Burrão, você. Não existe esse comando.']);
	}
	
	this.notFoundLast = function() {
		return this.getRandomValue(['Você é muito burro, cara. Você tem que usar o comando antes de deletar.']);
	}
	
	this.sendSuccess = function() {
		return this.getRandomValue(['Feito, chefe.', 'OK.', 'Pronto.', 'Belezica.', 'Beleza, chefe.']);
	}
	
	this.sendSuccessPhrase = function(sender) {
		return this.getRandomValue(['Concordo plenamente.', 'HA HA', 'Essa foi boa.', 'Pegou pesado hein, ' + sender + '?', 'Vixe.', 'Verdade.',
			'Tô ligado.', 'Exato.', 'Issoaê.', 'Acho que não, hein.']);
	}
	
	return this;
}();