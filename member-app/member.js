function nonMemberCheckout() {
	$('input[name="Record ID"]').val('');
	var $form = $('#entry-form');
	clearForm($form);
	clearForm('payment-form');
	$form.find('input[name=action]').val('nonMemberCheckout');
	$form.find('input[name=Date]').val(new Date().toLocaleDateString());
	showSection('entry-info');
}

function submitForm(form) {

	if(!$(form).valid()) return;
	
	//make sure we are not overdrawing a membership
	if(form.id == 'checkout-form') {
		var memberId = $('#checkout-form input[name="Record ID"]').val();
		if(memberId) {
			var json = $('#result-info').find('input[name="record-' + memberId + '"]').val();
			var member = JSON.parse(decodeURIComponent(json));
			var balance = parseInt(member['Units Remaining']) || 0,
				debit = parseInt($('#checkout-form input[name="Units Taken Today"]').val());
			if(debit > balance) {
				message("You can only take up to " + balance + " units without adding to your balance.");
				return;
			}
		}
	}

	//see if we need to add payment info to this transaction
	var action = $('input[name=action]', form).val();
	if((form.id == 'record-form' && action == 'newRecord' && source != 'website')
	  || (form.id == 'entry-form' && action == 'nonMemberCheckout')) {
	  	$('#payment-form input[name=action]').val(action);
	  	$('#payment-form input[name=Date]').val($('input[name=Date]', form).val());
	  	showSection('payment-info');
		return;
	}
	var data = getFormData(form);
	data.source = source;
	data['Membership ID'] = data['Record ID'];
	var dateStr = $('input[name=Date]', form).val();
	var date = dateStr ? new Date(dateStr) : new Date();
	data['Timestamp'] = getTimestamp(date);

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
				var data1 = getFormData(form1);
				$.extend(data, data1);
			}
		}
	}

	callScript({
		data: data,
		success: function(result) {
			var $forms = $(form);
			if(form1) $forms = $forms.add(form1);
			$forms.find('input.form-control:not([disabled])').val('');
			if(form1) showSection(form1.parentNode.id);
			switch(data.action) {
				case 'addUnits':
				case 'newEntry':
					if(source != 'website') {
						displaySearchResults(result.records);
						selectRecord(result.records[0]['Record ID']);
					}
					message('Thank you! You now have ' + result.remaining + ' units remaining');
					break;
				case 'updateInfo':
					if(source != 'website') {
						displaySearchResults(result.records);
						selectRecord(result.records[0]['Record ID']);
					}
					message('Thank you! Your information has been updated');
					break;
				case 'newRecord':
					if(source != 'website') {
						displaySearchResults(result.records);
						selectRecord(result.records[0]['Record ID']);
					}
					var msg = 'Thank you! Your membership has been created.';
					if(source == 'website') {
						msg += ' If you would like to pay now via PayPal, close this message and use the button at the bottom of the form.'
						  + ' Otherwise, you can pay over the phone or in person during our open hours at the bottom of the page.';
						var type = data['Membership Type'];
						$('#membership-submit').hide();
						var ppid = type == 'institutional' ? 'LHHRV6ZWMGTVC' : 'BKQT5EY6SGZHE';
						$('#membership-paypal').attr('href', 'https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=' + ppid).show();
					}
					message(msg);
					break;
				case 'nonMemberCheckout':
					message('Thank you for shopping at T4T!');
					break;
				default:
					console.log('Unrecognized action ' + data.action);
					break;
			}
		},
	});
}
