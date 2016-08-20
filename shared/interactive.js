function doSearch(form) {
	var text = $('input[name=search_string]', form).val();
	callScript({
		data: 'action=search&text=' + text,
		success: function(result) {
			displaySearchResults(result.records);
		},
	});
}

function displaySearchResults(records) {
	var $section = $('#search-results'), $results = $section.find('#result-list').empty(),
		$info = $section.find('#result-info').empty();
	for(var i = 0; i < records.length; i++) {
		var str = recordString(records[i]),
			id = records[i]['Record ID'], idStr = 'record-' + id;
		$results.append('<div class="form-control radio">'
			+ '<label for="' + idStr + '">'
			+ '<input type="radio" name="record"' + ' value="' + id + '" id="' + idStr + '"'
			+ ' onclick="selectRecord(this)">'
			+ str + '</label></div>');
		var json = encodeURIComponent(JSON.stringify(records[i]));
		$info.append('<input type="hidden" name="' + idStr + '" value="' + json + '">');
	}
	$section.find('#result-message').text('Select a record above.');
	$section.find('#result-alert').text('');
	$section.find('#result-actions button').attr('disabled', true);
	showSection('search-results');
}

function showSection(id) {
	$('.page-section').hide();
	$('#' + id).show();
}

function selectRecord(option) {
	var id = typeof option == 'string' || typeof option == 'number' ? 'record-' + option : option.id;
	var json = $('#result-info').find('input[name="' + id + '"]').val();
	var record = JSON.parse(decodeURIComponent(json)), recordStr = recordString(record);
	console.info(record);
	
	var $log = $('#record-log ul'), entries = '';
	if(record.log) {
		for(var i = 0; i < record.log.length; i++) {
			var entry = record.log[i];
			var entryStr = entryString(entry);
			entries += '<li>' + entryStr + '</li>';
		}
	}
	$log.html(entries);

	$('#result-list #' + id).attr('checked', true);
	$('#result-actions button').attr('disabled', false);
	
	var msg = '', alert = '';
	switch(type) {
		case 'member':
			msg = recordStr + ' has ' + (record['Units Remaining'] || '0') + ' units remaining.', alert = '';
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
			break;
		case 'donor':
			msg = recordStr + ' has donated ' + (record['Units Donated'] || '0') + ' units to date.';
			break;
		default: break;
	}
	$('#result-message').html(msg);
	$('#result-alert').html(alert);
	
	clearForm('entry-form');
	clearForm('record-form');
	clearForm('payment-form');

	$('#entry-info input[name=Organization]').val(recordStr).attr('disabled', true);

	$('input[name="Record ID"]').val(record['Record ID']);
	
	$('input[name=Date]').val(new Date().toLocaleDateString());
	
	var $form = $('#record-info form');
	for(var field in record) if(record.hasOwnProperty(field)) {
		$form.find('input[name="' + field + '"]').val(record[field]);
	}
}

function getSelectedRecord() {
	var id = $('#result-list [checked]').val();
	var json = $('#result-info').find('input[name="' + id + '"]').val();
	var record = JSON.parse(decodeURIComponent(json)), recordStr = recordString(record);
	console.info(record);
}

function recordAction(action) {
	var sectionId = '';
	if(action == 'receipt') {
		callScript({
			data: 'action=receipt&Record ID=' + $('input[name="Record ID"]').val(),
			success: function(data) {
				console.log(data.url);
			}
		});
	}
	switch(action) {
		case 'newEntry': sectionId = 'entry-info'; break;
		case 'updateInfo': sectionId = 'record-info'; break;
		case 'addUnits': sectionId = 'payment-info'; break;
		case 'generateReceipt': generateReceipt();
		case 'sendReceipt': sendReceipt();
		case 'viewLog': viewLog();
		case 'viewItems': viewItemized();
		case 'generateInvoice': generateInvoice();
		default: break;
	}
	if(sectionId) {
		$('.record-action').hide();
		var $section = $('#' + sectionId);
		$section.find('input[name=action]').val(action);
		$section.show();
		window.location.hash = '';
		window.location.hash = 'result-actions';
	}
}

function newRecord() {
	$('input[name="Record ID"]').val('');
	var $form = $('#record-form');
	clearForm($form);
	clearForm('payment-form');
	$form.find('input[name=action]').val('newRecord');
	$form.find('input[name=Date]').val(new Date().toLocaleDateString());
	showSection('record-info');
}

function viewLog() {
	$('#record-log-wrapper').show();
}

function hideLog() {
	$('#record-log-wrapper').hide();
}

function generateReceipt() {
	callScript({
		data: {
			action: 'generateReceipt',
			'Record ID': $('input[name="Record ID"]').val(),
		},
		success: function(data) {
			if(data.success) {
				var link = document.createElement('a');
				link.download = data.name;
				link.href = data.url;
				var event = document.createEvent("MouseEvents");
				event.initMouseEvent("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
                link.dispatchEvent(event);
				//link.click();
			} else {
				alert('Receipt could not be generated');
			}
		}
	});
}

function sendReceipt() {
	callScript({
		data: {
			action: 'sendReceipt',
			'Record ID': $('input[name="Record ID"]').val(),
		},
		success: function(data) {
			if(data.success) {
				alert('Receipt sent.');
			} else {
				alert('Receipt could not be sent.');
			}
		},
	});
}

$(document).ready(function() {
	hideLog();
});
