function submitForm(form) {

	if(!$(form).valid()) return;
	
	var isOpen = $(form).attr('id') == 'open-form';
	var data = getFormData(form);
	data.open = isOpen;
	data.start = new Date(data.start).getTime();
	data.end = new Date(data.end).getTime();
	console.log('updating:');
	console.info(data);
	
	updateStatus(data);
}

function updateStatus(data) {
	if(!data) data = {open: false};
	
	$.ajax({
		url: 'update.php',
		method: 'POST',
		dataType: 'json',
		data: data,
		success: function(data) {
			if(data.success) {
				updateStatusMessage(data.fields);
				toggleOpenForm(false);
			} else {
				switch(data.error) {
					case 'DB_CONNECT':
						toggleOpenForm(false);
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

function toggleOpenForm(show) {
	if(show) {
		clearForm('open-form');
		var today = Date.now(), start = moment(today - today%300000 + 300000);
		var startStr = start.format('M/D/YYYY h:mm A');
		$('#open-form input[name=start]').val(startStr);
		var end = moment(start.valueOf() + 3600000);
		var endStr = end.format('M/D/YYYY h:mm A');
		$('#open-form input[name=end]').val(endStr);
	
		$('#open-wrapper').show();
		$('#overlay').show();
		$('#overlay-spinner').hide();
	} else {
		$('#open-wrapper').hide();
		$('#overlay').hide();
		$('#overlay-spinner').show();
	}
}

function timeStr(epoch) {
	return moment(parseInt(epoch)).format('h:mmA');
}

function updateStatusMessage(data) {
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
			$msg.text('T4T will be open for ' + type + ' from ' + timeStr(data.start) + ' to ' + timeStr(data.end));
		} else {
			$msg.text('T4T is open for ' + type + ' until ' + timeStr(data.end));
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
});
