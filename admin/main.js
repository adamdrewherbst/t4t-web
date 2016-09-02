var Admin = function() {
	Form.call(this);
};
Admin.prototype = Object.create(Form.prototype);

Admin.prototype.init = function() {
	Form.prototype.init.call(this);
	var caller = this;
	$('.toggle-popup').click(function(e) {
		var $this = $(e.target);
		console.info($this);
		var id = $this.attr('id').split('-');
		caller.togglePopup(id[0], id[1] == 'show');
	});
};

Admin.prototype.processElements = function(root) {
	Form.prototype.processElements.call(this, root);
	$('div.datetime', root).each(function(i, el) {
		var picker = $(el).data('DateTimePicker');
		console.log('picker for');
		console.info(el);
		console.info(picker);
		if(picker) {
			console.log('setting side by side');
			picker.sideBySide(true);
		}
	});
};

Admin.prototype.submitForm = function(form) {

	if(!$(form).valid()) return;
	
	var isOpen = $(form).attr('id') == 'open-form';
	var data = this.getFormData(form);
	data.open = isOpen;
	if(isOpen) {
		data.start = moment(data.start, Form.DATE_FORMAT + ' ' + Form.TIME_FORMAT).valueOf();
		data.end = moment(data.end, Form.DATE_FORMAT + ' ' + Form.TIME_FORMAT).valueOf();
	}
	console.log('updating:');
	console.info(data);
	
	this.updateStatus(data);
};

Admin.prototype.updateStatus = function(data) {
	if(!data) data = {open: false};
	
	var caller = this;
	$.ajax({
		url: 'update.php',
		method: 'POST',
		dataType: 'json',
		data: data,
		success: function(data) {
			console.info(data);
			if(data.success) {
				caller.updateStatusMessage(data.fields);
				caller.togglePopups(false);
			} else {
				switch(data.error) {
					case 'DB_CONNECT':
						caller.togglePopups(false);
						alert("Can't connect to the database right now...");
						break;
					case 'NO_SUCH_USER':
						alert("Invalid username");
						$('input[name=username],input[name=password]').val('');
						$('input[name=username]').focus();
						break;
					case 'WRONG_PASSWORD':
						alert("Incorrect password: " + data.hash);
						$('input[name=password]').val('').focus();
						break;
					default: break;
				}
			}
		},
		error: function(xhr, status, error) {
		},
	});
}

Admin.prototype.togglePopups = function(show) {
	this.togglePopup('open', show);
	this.togglePopup('close', show);
}

Admin.prototype.togglePopup = function(id, show) {
	if(show) {
		this.clearForm(id + '-form');
		
		if(id == 'open') {
			var today = Date.now(), start = moment(today - today%300000);
			var startStr = start.format('M/D/YYYY h:mm A');
			$('#open-form input[name=start]').val(startStr);
			var end = moment(start.valueOf() + 3600000);
			var endStr = end.format('M/D/YYYY h:mm A');
			$('#open-form input[name=end]').val(endStr);
		}
	
		$('#' + id + '-wrapper').show();
		$('#overlay').show();
		$('#overlay-spinner').hide();
	} else {
		$('#' + id + '-wrapper').hide();
		$('#overlay').hide();
		$('#overlay-spinner').show();
	}
}

Admin.prototype.timeStr = function(epoch) {
	return moment(parseInt(epoch)).format('h:mmA');
}

Admin.prototype.updateStatusMessage = function(data) {
	var $msg = $('#status-msg');
	var today = Date.now();
	if(data.open && parseInt(data.end) > today) {
		var type = '';
		switch(data.type) {
			case 'shopping': type = 'shopping'; break;
			case 'creating': type = 'creating'; break;
			case 'both': type = 'shopping and creating'; break;
			default: break;
		}
		if(data.start > today) {
			$msg.text('T4T will be open for ' + type + ' from ' + this.timeStr(data.start) + ' to ' + this.timeStr(data.end));
		} else {
			$msg.text('T4T is open for ' + type + ' until ' + this.timeStr(data.end));
		}
		$('#open-button').removeClass('shown').addClass('hidden');
		$('#close-button').removeClass('hidden').addClass('shown');
	} else {
		$msg.text('T4T is currently closed.');
		$('#open-button').removeClass('hidden').addClass('shown');
		$('#close-button').removeClass('shown').addClass('hidden');
	}
}

$(document).ready(function() {
	var form = new Admin();
	Form.setForm(form);
	form.init();
});
