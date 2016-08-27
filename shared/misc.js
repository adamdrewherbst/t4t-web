var source = '';

switch(type) {
	case 'member': scriptID = 'AKfycbwNkEBsEMvJ4GTUNSL8vdQzkjDdeGLxu8Gsszceb7eS5AET7UFP'; break;
	case 'donor': scriptID = 'AKfycbx6Cg4w_GCxV6yhZLg2I4j_aTqk9pcO7SS0h90ppUMzV8WmMLo5'; break;
	case 'order': scriptID = 'AKfycbwvVU0gACktGPgO5C_gt9bsGVuYZBwCEWZ9rjOfycGOmT7b-uw'; break;
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
	
	if(type == 'order' && form.id == 'record-form') {
		var $wrapper = $('#item-wrapper'), $template = $('#item-template');
		$wrapper.empty().append($template.html());
	}
}

function getFormData(form) {
	var data = {};
	$('input,select', form).each(function() {
		var $this = $(this), name = $this.attr('name'), unselected = $this.attr('type') == 'radio' && !$this.is(':checked');
		if(String.prototype.hasOwnProperty('endsWith') && typeof name == 'string' && name.endsWith('[]')) {
			var ind = 0, newName = '';
			do {
				newName = name.replace('[]', '[' + ind + ']');
				ind++;
			} while(data.hasOwnProperty(newName));
			name = newName;
		}
		if(name && !unselected) data[name] = $this.val();
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

function processElements(root) {
	$('div.date', root).datetimepicker({
		format: 'M/D/YYYY',
	});
	$('div.time', root).datetimepicker({
		format: 'h:mm A',
	});
	$('div.datetime', root).datetimepicker({
		format: 'M/D/YYYY h:mm A',
	});
	$('.multiple-trigger', root).change(function(event) {
		var $target = $(event.target), $parent = $target.closest('.multiple-template');
		var className = $target.attr('class').split(' ')[0];
		var templateName = $parent.attr('class').split(' ')[0];
		if($parent.is(':last-child') && $target.val() != '') {
			var $delete = findShallowest($parent, '.multiple-delete');
			if($delete) $delete.removeClass('hidden');
			var $newItem = $('#' + templateName + '-template').children().first().clone().appendTo($parent.parent());
			processElements($newItem);
		}
	});
	$('.multiple-delete', root).click(function(event) {
		var $item = $(event.target).closest('.multiple-template');
		$item.remove();
	});
	switch(type) {
		case 'order':
			$('.item-code', root).change(function(event) {
				//set the item description to its title by default
				var $target = $(event.target), $item = $target.closest('.invoice-item');
				$item.find('.item-description').val($target.find(':selected').text());
				//show the additional fields corresponding to the item code
				var code = $target.find(':selected').val(), account = code.split(' ')[0];
				code = code.replace(/ /g, '');
				var $fields = $item.find('.invoice-additional-fields > div');
				$fields.each(function() {
					var $this = $(this), codes = $this.attr('accounts'), exclude = $this.attr('accounts-exclude');
					codes = codes ? codes.split(' ') : [];
					exclude = exclude ? exclude.split(' ') : [];
					if(codes.indexOf(code) >= 0 || (codes.indexOf(account) >= 0 && exclude.indexOf(code) < 0)) $this.removeClass('hidden');
					else $this.addClass('hidden');
				});
			});
			break;
		default: break;
	}
}

function findShallowest( root, sel ) {
	var children = root.children();
	if( children.length ) {
		var matching = children.filter( sel );
		if( matching.length ) {
			return matching.first();
		} else {
			return findShallowest( children, sel );
		}
	} else {
		return null;
	}
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
	
	processElements('body');
	
	$('input[name=Date]').val(new Date().toLocaleDateString());

	$('input[name="search_string"]').focus();
});
