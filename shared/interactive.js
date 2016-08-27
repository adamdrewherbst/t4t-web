Form.prototype.doSearch = function(form) {
	var text = $('input[name=search_string]', form).val();
	var caller = this;
	this.callScript({
		data: 'action=search&text=' + text,
		success: function(result) {
			caller.displaySearchResults(result.records);
		},
	});
};

Form.prototype.displaySearchResults = function(records) {
	var $section = $('#search-results'), $results = $section.find('#result-list').empty(),
		$info = $section.find('#result-info').empty();
	for(var i = 0; i < records.length; i++) {
		var str = this.recordString(records[i]),
			id = records[i]['Record ID'], idStr = 'record-' + id;
		var $record = $('<div class="form-control radio">'
			+ '<label for="' + idStr + '">'
			+ '<input type="radio" name="record"' + ' value="' + id + '" id="' + idStr + '">'
			+ str + '</label></div>');
		$results.append($record);
		var form = this;
		$record.find('input').click(function() {
			var id = $(this).val();
			form.selectRecord(id);
		});
		var json = encodeURIComponent(JSON.stringify(records[i]));
		$info.append('<input type="hidden" name="' + idStr + '" value="' + json + '">');
	}
	$section.find('#result-message').text('Select a record above.');
	$section.find('#result-alert').text('');
	$section.find('#result-actions button').attr('disabled', true);
	this.showSection('search-results');
};

Form.prototype.showSection = function(id) {
	$('.page-section').hide();
	$('#' + id).show();
};

Form.prototype.selectRecord = function(option) {
	var id = typeof option == 'string' || typeof option == 'number' ? 'record-' + option : option.id;
	var json = $('#result-info').find('input[name="' + id + '"]').val();
	var record = JSON.parse(decodeURIComponent(json)), recordStr = this.recordString(record);
	console.info(record);
	
	var $log = $('#record-log ul'), entries = '';
	if(record.log) {
		for(var i = 0; i < record.log.length; i++) {
			var entry = record.log[i];
			var entryStr = this.entryString(entry);
			entries += '<li>' + entryStr + '</li>';
		}
	}
	$log.html(entries);

	$('#result-list #' + id).attr('checked', true);
	$('#result-actions button').attr('disabled', false);
	
	this.clearForm('entry-form');
	this.clearForm('record-form');
	this.clearForm('payment-form');

	$('#entry-info input[name=Organization]').val(recordStr).attr('disabled', true);

	$('input[name="Record ID"]').val(record['Record ID']);
	
	$('input[name=Date]').val(new Date().toLocaleDateString());
	
	var $form = $('#record-info form');
	for(var field in record) if(record.hasOwnProperty(field)) {
		$form.find('input[name="' + field + '"]').val(record[field]);
	}
	
	this.postDisplayRecord(record);
};

//display handle for subclasses
Form.prototype.postDisplayRecord = function(record) {};

Form.prototype.getSelectedRecord = function() {
	var id = $('#result-list [checked]').val();
	var json = $('#result-info').find('input[name="' + id + '"]').val();
	var record = JSON.parse(decodeURIComponent(json)), recordStr = this.recordString(record);
	console.info(record);
};

Form.prototype.recordAction = function(action) {
	var sectionId = '';
	if(action == 'receipt') {
		this.callScript({
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
		case 'generateReceipt': this.generateReceipt();
		case 'sendReceipt': this.sendReceipt();
		case 'viewLog': this.viewLog();
		case 'generateInvoice': this.generateInvoice();
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
};

Form.prototype.newRecord = function() {
	$('input[name="Record ID"]').val('');
	var $form = $('#record-form');
	this.clearForm($form);
	this.clearForm('payment-form');
	$form.find('input[name=action]').val('newRecord');
	$form.find('input[name=Date]').val(new Date().toLocaleDateString());
	this.showSection('record-info');
};

Form.prototype.viewLog = function() {
	$('#record-log-wrapper').show();
};

Form.prototype.hideLog = function() {
	$('#record-log-wrapper').hide();
};

Form.prototype.generateReceipt = function() {
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
};

Form.prototype.sendReceipt = function() {
	this.callScript({
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
};
