function submitForm(form) {

	if(!$(form).valid()) return;
	
	var action = $('input[name=action]', form).val();
	var data = getFormData(form), date = null;
	if(data.Date) date = new Date(data.Date);
	data.Timestamp = getTimestamp(date);
	data['Donor ID'] = data['Record ID'];

	callScript({
		data: data,
		success: function(result) {
			var $forms = $(form);
			$forms.find('input.form-control:not([disabled])').val('');
			switch(data.action) {
				case 'newEntry':
					displaySearchResults(result.records);
					selectRecord(result.records[0]['Donor ID']);
					message('The donation has been recorded');
					break;
				case 'updateInfo':
					displaySearchResults(result.records);
					selectRecord(result.records[0]['Donor ID']);
					message('The information has been updated');
					break;
				case 'newRecord':
					displaySearchResults(result.records);
					selectRecord(result.records[0]['Donor ID']);
					message('The donor has been created');
					break;
				default:
					console.log('Unrecognized action ' + data.action);
					break;
			}
		},
	});
}
