function submitForm(form) {

	if(!$(form).valid()) return;
	
	var action = $('input[name=action]', form).val();
	var data = getFormData(form), date = null;
	if(data.Date) date = new Date(data.Date);
	data.Timestamp = getTimestamp(date);
	data['Order ID'] = data['Record ID'];

	callScript({
		data: data,
		success: function(result) {
			var $forms = $(form);
			$forms.find('input.form-control:not([disabled])').val('');
			switch(data.action) {
				case 'updateInfo':
					displaySearchResults(result.records);
					selectRecord(result.records[0]['Record ID']);
					message('The information has been updated');
					break;
				case 'newRecord':
					displaySearchResults(result.records);
					selectRecord(result.records[0]['Record ID']);
					message('The order has been created');
					break;
				default:
					console.log('Unrecognized action ' + data.action);
					break;
			}
		},
	});
}

function copyBillingToShipping() {
	$('#record-form [name^="Billing "]').each(function() {
		var $this = $(this), name = $this.attr('name');
		var $shippingField = $('#record-form [name="' + name.replace('Billing', 'Shipping') + '"]');
		$shippingField.val($this.val());
	});
}

function recordString(record) {
	var str = record['Billing Organization'];
	if(record['Billing Name']) str += ' (' + record['Billing Name'] + ')';
	return str;
}

function viewItems() {
	var order = getSelectedRecord();	
}

function itemChange(event) {
	var $target = $(event.target), $item = $target.closest('.invoice-item');
	//set the item description to its title by default
	$item.find('[name="item_description[]"]').val($target.find(':selected').text());
	//if we're setting an item code on the last item in the list, add a new blank item to the list
	var $last = $('.invoice-item').last();
	if($last.find('[name="item_code[]"]').find(':selected').val() != '') {
		$last.find('.item-delete').removeClass('hidden');
		$('#item-wrapper').append($('#item-template').html());
	}
}

function removeItem(button) {
	var $item = $(button).closest('.invoice-item');
	$item.remove();
}
