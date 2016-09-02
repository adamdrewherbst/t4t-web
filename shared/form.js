var Form = function() {
	this.scriptActions = [];
};

Form.currentForm = null;
Form.setForm = function(form) {
	Form.currentForm = form;
};
Form.getForm = function() {
	return Form.currentForm;
};

Form.DATE_FORMAT = 'M/D/YYYY';
Form.TIME_FORMAT = 'h:mmA';

Form.prototype.init = function() {
	Form.currentForm = this;

	this.endpoint = 'https://script.google.com/macros/s/' + this.scriptID + '/exec';
	this.source = $('input[name=source]').val();
	this.$overlay = $('#overlay');

	var form = this;
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
		$(this).submit(function() {
			form.submitForm(this);
		});
	});
	
	this.processElements('body');
	
	$('input[name=Date]').val(new Date().toLocaleDateString());

	$('input[name="search_string"]').focus();

	var interactive = Form.prototype.hasOwnProperty('selectRecord');
	if(interactive) {
		form.hideLog();
		$('#hide-log-button').click(function() {
			form.hideLog();
		});
		$('#new-record-button').click(function() {
			form.newRecord();
		});
		$('.record-action-button').click(function() {
			form.recordAction($(this).attr('action'));
		});
	}
};

Form.prototype.callScript = function(options) {
	this.$overlay.show();
	var caller = this;
	$.ajax({
		url: caller.endpoint,
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
			caller.$overlay.hide();
		},
	});
};

Form.prototype.submitForm = function(form) {

	form = $(form)[0];
	if(!$(form).valid()) return;
	if(form.id == 'search-form') {
		if(Form.prototype.hasOwnProperty('doSearch')) this.doSearch(form);
		return;
	}
	
	var data = this.getFormData(form);
	data.source = this.source;
	var dateStr = $('input[name=Date]', form).val();
	data['Timestamp'] = dateStr ? dateStr : moment().format(Form.DATE_FORMAT);
	data[this.title + ' ID'] = data['Record ID'];
	
	if(!this.preSubmit(form, data)) return;
	
	console.info(data);

	var caller = this;
	this.callScript({
		data: data,
		success: function(result) {
			caller.clearFields(form);
			switch(data.action) {
				case 'updateInfo':
					if(caller.source != 'website') {
						caller.displaySearchResults(result.records);
						caller.selectRecord(result.records[0]['Record ID']);
						caller.message('The information has been updated');
					}
					break;
				case 'newRecord':
					if(caller.source != 'website') {
						caller.displaySearchResults(result.records);
						caller.selectRecord(result.records[0]['Record ID']);
					}
					break;
				case 'newEntry':
					if(caller.source != 'website') {
						caller.displaySearchResults(result.records);
						caller.selectRecord(result.records[0]['Record ID']);
					}
					break;
			}
			caller.postSubmit(form, data, result);
		},
	});
};

Form.prototype.preSubmit = function(form, data) { return true; };
Form.prototype.postSubmit = function(form, data, result) {};

Form.prototype.clearFields = function(form) {
	$(form).find('input.form-control:not([disabled])').val('');
};

Form.prototype.recordString = function(record) {
	var str = record['Organization'];
	if(record['Contact Name']) str += ' (' + record['Contact Name'] + ')';
	return str;
};

Form.prototype.entryString = function(entry) {
	var str = new Date(entry['Timestamp']).toLocaleDateString() + ' - ';
	switch(this.type) {
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
};

Form.prototype.clearForm = function(form) {
	if(typeof form == 'string') form = document.getElementById(form);
	$('input', form).attr('disabled', false);
	$('input[type="text"], input[type="number"], input[type="email"]'
		+ ', input[type="zipcodeUS"], input[type="phoneUS"]', form).val('');
	$('input[type="hidden"]', form).not('[name="Site"]').val('');
	$('input[type="radio"]', form).prop('checked', false);
	$('input[name="Date"]', form).val(new Date().toLocaleDateString());
	
	//leave only one blank entry in any multiple item field
	var caller = this;
	$('.multiple-template-copy > .multiple-template', form).each(function() {
		var $this = $(this), className = $this.attr('class').split(' ')[0], $clone = $this.clone();
		$('.' + className + '-wrapper', form).empty().append($clone);
		caller.processElements($clone);
	});
};

Form.prototype.getFormData = function(form) {
	var data = {};
	$('input,select', form).each(function() {
		var $this = $(this), name = $this.attr('name'), unselected = $this.attr('type') == 'radio' && !$this.is(':checked');
		if(String.prototype.hasOwnProperty('endsWith') && typeof name == 'string' && name.endsWith('[]')) return;
		if(name && !unselected) data[name] = $this.val();
	});
	$('.multiple-template-copy', form).each(function() {
		var className = $('.multiple-template', this).attr('class').split(' ')[0];
		var $wrappers = $('.' + className + '-wrapper', form), n = $wrappers.length, wrapperCount = 0;
		$wrappers.each(function() {
			if($(this).parents('.multiple-template-copy').length > 0) return;
			var itemCount = 0;
			$('.multiple-template.' + className, this).each(function() {
				var $template = $(this);
				$('input[name],select[name]', this).each(function() {
					if(!$(this).closest('.multiple-template').is($template)) return;
					var name = $(this).attr('name');
					//if(!data.hasOwnProperty(name)) data[name] = [];
					//if(n > 1) {
					//	if(!data[name].hasOwnProperty(wrapperCount)) data[name][wrapperCount] = [];
					//	data[name][wrapperCount][itemCount] = $(this).val();
					//}
					//else data[name][itemCount] = $(this).val();
					var prefix = n > 1 ? '[' + wrapperCount + ']' : '';
					var newName = name.replace('[]', prefix + '[' + itemCount + ']');
					data[newName] = $(this).val();
				});
				itemCount++;
			});
			wrapperCount++;
		});
	});
	return data;
};

Form.prototype.message = function(msg) {
	this.$overlay.hide();
	alert(msg);
};

Form.prototype.processElements = function(root) {
	$('div.date,div.time,div.datetime', root).each(function() {
		var $this = $(this);
		$this.datetimepicker({
			format: $this.hasClass('date') ? Form.DATE_FORMAT :
					$this.hasClass('time') ? Form.TIME_FORMAT :
					Form.DATE_FORMAT + ' ' + Form.TIME_FORMAT,
		})
		$this.on('dp.show', function() {
			var datepicker = $('body').find('.bootstrap-datetimepicker-widget:last').detach().appendTo('body');
			if (datepicker.hasClass('bottom')) {
				var top = $(this).offset().top + $(this).outerHeight();
				var left = $(this).offset().left;
				datepicker.css({
					'top': top + 'px',
					'bottom': 'auto',
					'left': left + 'px'
				});
			} else if (datepicker.hasClass('top')) {
				var top = $(this).offset().top - datepicker.outerHeight();
				var left = $(this).offset().left;
				datepicker.css({
					'top': top + 'px',
					'bottom': 'auto',
					'left': left + 'px'
				});
			}
		});
	});
	var caller = this;
	$('.multiple-trigger', root).change(function(event) {
		var $target = $(event.target), $parent = $target.closest('.multiple-template');
		var className = $target.attr('class').split(' ')[0];
		var templateName = $parent.attr('class').split(' ')[0];
		if($parent.is(':last-child') && $target.val() != '') {
			var $delete = Form.findShallowest($parent, '.multiple-delete');
			if($delete) $delete.removeClass('hidden');
			var $newItem = $('#' + templateName + '-template').children().first().clone().appendTo($parent.parent());
			caller.processElements($newItem);
		}
	});
	$('.multiple-delete', root).click(function(event) {
		var $item = $(event.target).closest('.multiple-template');
		var $template = caller.findMultipleTemplate($item);
		var callback = $template.data('deleteCallback');
		if(callback) callback($item);
		$item.remove();
	});
};

Form.prototype.findMultipleTemplate = function($el) {
	var $item = $el.closest('.multiple-template'), className = $item.attr('class').split(' ')[0];
	var $wrapper = $('#' + className + '-template');
	return $wrapper.find('.multiple-template');
};

Form.findShallowest = function(root, sel) {
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
};
                                                                                
Form.pad = function(num) {
	return (num > 9 ? '' : '0') + num;
};

Form.getTimestamp = function(date) {
	if(!date) date = new Date();
	var str = (date.getMonth()+1) + '/' + date.getDate() + '/' + date.getFullYear() + ' '
		+ date.getHours() + ':' + pad(date.getMinutes()) + ':' + pad(date.getSeconds());
	return str;
};

