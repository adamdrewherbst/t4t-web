var source = '';

switch(type) {
	case 'member': scriptID = 'AKfycbwNkEBsEMvJ4GTUNSL8vdQzkjDdeGLxu8Gsszceb7eS5AET7UFP'; break;
	case 'donor': scriptID = 'AKfycbx6Cg4w_GCxV6yhZLg2I4j_aTqk9pcO7SS0h90ppUMzV8WmMLo5'; break;
	default: scriptID = ''; break;
}
var endpoint = 'https://script.google.com/macros/s/' + scriptID + '/exec';
var $overlay = $();

function callScript(options) {
	$overlay.show();
	$.ajax({
		url: endpoint,
		method: 'POST',
		dataType: 'jsonp',
		jsonp: 'prefix',
		data: options.data,
		success: options.success,
		error: function(xhr, status, error) {
			console.log('ajax error - ' + status + ': ' + error);
			console.log(xhr.responseText);
			console.info(xhr);
		},
		complete: function(xhr, status) {
			$overlay.hide();
		},
	});
}

function getTimestamp(date) {
	if(!date) date = new Date();
	var str = (date.getMonth()+1) + '/' + date.getDate() + '/' + date.getFullYear() + ' '
		+ date.getHours() + ':' + pad(date.getMinutes()) + ':' + pad(date.getSeconds());
	return str;
}

function recordString(record) {
	var str = record['Organization'];
	if(record['Contact Name']) str += ' (' + record['Contact Name'] + ')';
	return str;
}

function entryString(entry) {
	var str = new Date(entry['Timestamp']).toLocaleDateString() + ' - ';
	switch(type) {
		case 'member':
			var isCredit = entry.hasOwnProperty('Amount Paid');
			if(isCredit) {
				str += 'added ' + entry['Amount Paid'] + ' units via ' + entry['Payment Method'];
				if(entry['Payment Received?'] != 'Yes') str += ' - NOT RECEIVED';
			} else {
				str += 'took ' + entry['Units Taken Today'] + ' units [' + entry['Name'] + ']';
			}
			break;
		case 'donor':
			str += entry['Units Donated'] + ' [' + entry['Material'] + ']';
			break;
		default: break;
	}
	return str;
}

function clearForm(form) {
	if(typeof form == 'string') form = document.getElementById(form);
	$('input', form).attr('disabled', false);
	$('input[type="text"], input[type="number"], input[type="email"]'
		+ ', input[type="zipcodeUS"], input[type="phoneUS"]', form).val('');
	$('input[type="hidden"]', form).not('[name="Site"]').val('');
	$('input[type="radio"]', form).prop('checked', false);
	$('input[name="Date"]', form).val(new Date().toLocaleDateString());
}

function getFormData(form) {
	var data = {};
	$('input', form).each(function() {
		var $this = $(this), name = $this.attr('name'), unselected = $this.attr('type') == 'radio' && !$this.is(':checked');
		if(name && !unselected) data[name] = $this.val();
	});
	$('select', form).each(function() {
		var $this = $(this), name = $this.attr('name');
		if(name) data[name] = $this.val();
	});
	return data;
}

function pad(num) {
	return (num > 9 ? '' : '0') + num;
}

function message(msg) {
	$overlay.hide();
	alert(msg);
}

$(document).ready(function() {
	source = $('input[name=source]').val();
	$overlay = $('#overlay');
	$('form').each(function() {
		$(this).validate({
			errorClass: 'invalid',
			errorPlacement: function(error, element) {
				var label = element.prev();
				console.log('inserting after');
				console.info(label);
				error.insertAfter(label);
			},
		});
	});
	
	$('div.date').datetimepicker({
		format: 'M/D/YYYY',
	});
	$('div.datetime').datetimepicker({
		format: 'M/D/YYYY h:mm A',
	});
	$('input[name=Date]').val(new Date().toLocaleDateString());

	$('input[name="search_string"]').focus();
});
