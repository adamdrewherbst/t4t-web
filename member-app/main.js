var Member = function() {
	Form.call(this);
	this.type = 'member';
	this.title = 'Membership';
	this.scriptID = 'AKfycbwNkEBsEMvJ4GTUNSL8vdQzkjDdeGLxu8Gsszceb7eS5AET7UFP';
};
Member.prototype = Object.create(Form.prototype);

Member.prototype.init = function() {
	Form.prototype.init.call(this);
	var caller = this;
	$('#non-member-checkout-button').click(function() {
		caller.nonMemberCheckout();
	});
};

Member.prototype.nonMemberCheckout = function() {
	$('input[name="Record ID"]').val('');
	var $form = $('#entry-form');
	this.clearForm($form);
	this.clearForm('payment-form');
	$form.find('input[name=action]').val('nonMemberCheckout');
	$form.find('input[name=Date]').val(new Date().toLocaleDateString());
	this.showSection('entry-info');
};

Member.prototype.preSubmit = function(form, data) {
	//make sure we are not overdrawing a membership
	if(form.id == 'entry-form') {
		var memberId = $('#entry-form input[name="Record ID"]').val();
		if(memberId) {
			var json = $('#result-info').find('input[name="record-' + memberId + '"]').val();
			var member = JSON.parse(decodeURIComponent(json));
			var balance = parseInt(member['Units Remaining']) || 0,
				debit = parseInt($('#entry-form input[name="Units Taken Today"]').val());
			if(debit > balance) {
				message("You can only take up to " + balance + " units without adding to your balance.");
				return false;
			}
		}
	}

	//see if we need to add payment info to this transaction
	var action = $('input[name=action]', form).val();
	if((form.id == 'record-form' && action == 'newRecord' && this.source != 'website')
	  || (form.id == 'entry-form' && action == 'nonMemberCheckout')) {
	  	$('#payment-form input[name=action]').val(action);
	  	$('#payment-form input[name=Date]').val($('input[name=Date]', form).val());
		this.showSection('payment-info');
		return false;
	}

	//if we are submitting payment info, include the data for whatever we are paying for
	var form1 = null;
	if(form.id == 'payment-form' && action != 'addUnits') {
		var formId = '';
		switch(action) {
			case 'newRecord': formId = 'record-form'; break;
			case 'nonMemberCheckout': formId = 'entry-form'; break;
			default: break;
		}
		if(formId) {
			form1 = document.getElementById(formId);
			if(form1) {
				var data1 = this.getFormData(form1);
				$.extend(data, data1);
			}
		}
	}
	return true;
};

Member.prototype.postSubmit = function(form, data, result) {
	switch(data.action) {
		case 'addUnits':
		case 'newEntry':
			if(this.source != 'website') {
				this.displaySearchResults(result.records);
				this.selectRecord(result.records[0]['Record ID']);
				this.message('Thank you! You now have ' + result.remaining + ' units remaining');
			}
			break;
		case 'newRecord':
			this.clearFields('payment-info');
			var msg = 'Thank you! Your membership has been created.';
			if(this.source == 'website') {
				msg += ' If you would like to pay now via PayPal, close this message and use the button at the bottom of the form.'
				+ ' Otherwise, you can pay over the phone or in person during our open hours at the bottom of the page.';
				var type = result.records[0]['Membership Type'];
				$('#membership-submit').hide();
				var ppid = type == 'institutional' ? 'LHHRV6ZWMGTVC' : 'BKQT5EY6SGZHE';
				$('#membership-paypal').attr('href', 'https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=' + ppid).show();
			}
			this.message(msg);
			break;
		case 'nonMemberCheckout':
			this.clearFields('payment-info');
			this.showSection('checkout-info');
			this.message('Thank you for shopping at T4T!');
			break;
	}
};

Member.prototype.postDisplayRecord = function(record) {
	var msg = this.recordString(record) + ' has ' + (record['Units Remaining'] || '0') + ' units remaining.', alert = '';
	var expiration = record['Expiration Date'], expired = expiration && new Date(expiration) < new Date();
	if(expired) {
		//msg = 'Membership for ' + recordStr + ' expired on ' + expiration + '.';
		alert = 'Membership expired on ' + new Date(expiration).toLocaleDateString() + '; please use remaining units ASAP!';
	} else if(expiration) {
		msg += "<p>Membership expires on " + new Date(expiration).toLocaleDateString();
	}
	var empty = !record['Units Remaining'] || parseInt(record['Units Remaining']) <= 0;
	if(empty) {
		alert = 'Please add credit to your record before purchasing material.';
		$('#newEntry-button').attr('disabled', true);
	}
	var users = record['Participating Teachers / Staff'] || 'NONE SPECIFIED';
	users = users.toString().trim().split("\n").join(', ');
	$('#result-users').html('<strong>Authorized Users</strong><br>' + users);
	$('#result-message').html(msg);
	$('#result-alert').html(alert);
};

$(document).ready(function() {
	var form = new Member();
	Form.setForm(form);
	form.init();
});
