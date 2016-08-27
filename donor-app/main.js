var Donor = function() {
	Form.call(this);
	this.type = 'donor';
	this.title = 'Donor';
	this.entryTitle = 'donation';
	this.scriptID = 'AKfycbx6Cg4w_GCxV6yhZLg2I4j_aTqk9pcO7SS0h90ppUMzV8WmMLo5';
};
Donor.prototype = Object.create(Form.prototype);

Donor.prototype.postDisplayRecord = function(record) {
	var msg = this.recordString(record) + ' has donated ' + (record['Units Donated'] || '0') + ' units to date.', alert = '';
	$('#result-message').html(msg);
	$('#result-alert').html(alert);
};

$(document).ready(function() {
	var form = new Donor();
	Form.setForm(form);
	form.init();
});
