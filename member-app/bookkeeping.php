<html>
	<head>
		<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css">
	
		<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>
		<script type="text/javascript">
		
			function doSearch() {
				var lookback=$('input[name=lookback]').val(), $overlay = $('#overlay').show();
				$.ajax({
					url: 'https://script.google.com/macros/s/AKfycbxVKr9-J7lXnON5uj1HT5r3wI6MubppJtu8voYtbl9Yrrtz4I4/exec',
					type: 'GET',
					data: 'lookback=' + lookback,
					dataType: 'jsonp',
					jsonp: 'prefix',
					success: function(data) {
						console.info(data);
						var members = data.memberships, checkouts = data.checkouts;
						var $memberTable = $('#member-table tbody'), $checkoutTable = $('#checkout-table tbody');
						for(var i = 0; i < 2; i++) {
							var list = i == 0 ? members : checkouts, $table = i == 0 ? $memberTable : $checkoutTable, total = 0,
								$info = i == 0 ? $('#member-info') : $('#checkout-info');
							$table.empty();
							$info.empty();
							if(i == 0) console.log('Memberships:');
							for(var j = 0; j < list.length; j++) {
								if(i == 0) console.info(list[j]);
								var transaction = list[j];
								var time = new Date(transaction['Timestamp']);
								time = time.toLocaleDateString() + ' ' + time.toLocaleTimeString();
								var amount = transaction['Amount Paid'];
								var receipt = 'NONE';
								if(transaction['Receipt URL'] != 'NONE')
									receipt = '<a href="' + transaction['Receipt URL'] + '" target="_blank">View</a>';
								else if(transaction['Receipt Number']) receipt = transaction['Receipt Number'];
								var amountStr = '';
								if(amount) {
									total += parseFloat(amount);
									amountStr = '$' + amount.toFixed(2);
								}
								var timeLink = '<a href="javascript:viewEntry(' + i + ',' + j + ')">' + time + '</a>';
								var values = [timeLink, transaction['Organization'], amountStr, transaction['Payment Method'], receipt];
								if(i == 1) values.splice(2, 0, transaction['Name']);
								var html = '<tr>';
								for(var k = 0; k < values.length; k++) html += '<td>' + values[k] + '</td>';
								html += '</tr>';
								$table.append(html);
								
								//store additional details in a hidden expandable div
								var details = {
									Time: time,
									Organization: transaction['Organization'],
									Phone: transaction['Phone Number'],
									Email: transaction['Email'],
									Amount: amountStr,
									Method: transaction['Payment Method'],
									Receipt: receipt,
								};
								if(i == 0) {
									details['Address'] = transaction['Address'];
									details['City'] = transaction['City'];
									details['ZIP'] = transaction['ZIP'];
									details['Contact'] = transaction['Contact Name'];
								} else {
									details['Name'] = transaction['Name'];
									details['Units Taken'] = transaction['Units Taken Today'];
								}
								var $entry = $('<input id="entry_' + i + '_' + j + '" type="hidden">').val(JSON.stringify(details));
								$info.append($entry);
							}
							var footer = '<tr>', len = i == 0 ? 5 : 6, ind = i == 0 ? 2 : 3;
							for(var j = 0; j < len; j++) {
								footer += '<th>';
								if(j == 0) footer += 'Total';
								else if(j == ind) footer += '$' + total.toFixed(2);
								footer += '</th>';
							}
							footer += '</tr>';
							$table.closest('table').find('tfoot').html(footer);
						}
						$overlay.hide();
					},
					error: function(xhr, status, error) {
						console.log('ajax error - ' + status + ': ' + error);
						console.log(xhr.responseText || xhr.responseXML || xhr.statusText);
						console.info(xhr);
						$overlay.hide();
					}
				});
			}
			
			function viewEntry(table, index) {
				var $info = table == 0 ? $('#member-info') : $('#checkout-info');
				var $entries = $info.find('input[type=hidden]'), n = $entries.length;
				console.log('showing table ' + table + ', index ' + index);
				index = (index + n) % n;
				console.log(' => index ' + index + ' (' + n + ' entries)');
				var $entry = $entries.eq(index), entry = JSON.parse($entry.val()),
					fields = Object.getOwnPropertyNames(entry);
				var $sidebar = $('#info-sidebar'), $details = $sidebar.find('#fields').empty();
				for(var i = 0; i < fields.length; i++) {
					var value = entry[fields[i]];
					if(!value) continue;
					$details.append('<strong>' + fields[i] + '</strong><br>' + value);
					if(i < fields.length-1) $details.append('<p>');
				}
				$sidebar.attr('table', table).attr('index', index).show();
			}
			
			function navInfo(dir) {
				var $sidebar = $('#info-sidebar'), table = parseInt($sidebar.attr('table')) || 0,
					index = parseInt($sidebar.attr('index')) || 0;
				viewEntry(table, index + dir);
			}
			
			function closeInfo() {
				$('#info-sidebar').hide();
			}
			
			function printPDF() {
				var lookback = $('input[name=lookback]').val(), $overlay = $('#overlay').show(), $link = $('#pdf-view').hide();
				$.ajax({
					url: 'https://script.google.com/macros/s/AKfycbwNkEBsEMvJ4GTUNSL8vdQzkjDdeGLxu8Gsszceb7eS5AET7UFP/exec',
					type: 'GET',
					data: 'action=accounting&lookback=' + lookback,
					dataType: 'jsonp',
					jsonp: 'prefix',
					success: function(data) {
						$overlay.hide();
						$link.attr('href', 
						'https://docs.google.com/spreadsheets/d/1hJjFMOU_xmuAhv8C5yzB1ZJbPfBtXL3trzRI207TNGM/export?format=xlsx').show();
					},
					error: function(xhr, status, error) {
						$overlay.hide();
						console.log('ajax error - ' + status + ': ' + error);
						console.log(xhr.responseText);
					},
				});
			}
		</script>
		
		<style>
			body {
				text-align: center;
				background-color: #88ff88;
				font-size: 26px;
			}
			input {
				font-size: 26px;
			}
			input[name=lookback] {
				width: 80px;
				text-align: center;
			}
			table, th, td {
				border: 1px solid black;
				font-size: 20px;
			}
			table {
				border-collapse: collapse;
			}
			th, td {
				padding: 5px 15px;
			}
			#overlay {
				position: fixed;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
				text-align: center;
				background-color: rgba(0, 0, 0, 0.5);
				display: none;
			}
			#overlay-align {
				display: inline-block;
				vertical-align: middle;
				width: 0;
				height: 100%;
			}
			#overlay-spinner {
				color: #ffffff;
				display: inline-block;
				vertical-align: middle;
			}
			
			#info-sidebar {
				position: fixed;
				top: 20;
				left: 20;
				border-radius: 20px;
				background-color: #cccc99;
				font-size: 16;
				padding: 10px;
				display: none;
			}
			.info-nav {
				position: absolute;
				top: 50%;
				color: #ffffff;
			}
			#info-prev {
				left: -5px;
			}
			#info-next {
				right: -5px;
			}
			.info-close {
				position: absolute;
				top: -10px;
				right: -10px;
				color: #bb4444;
			}
			
			#pdf-view {
				display: none;
			}
		</style>
	</head>
	<body>
		<form id="search-form" action="javascript:void" onsubmit="doSearch()">
			<label for="lookback">Muestra las transacciones para los</label>
			<input type="number" name="lookback" value="7">
			<label for="lookback">dias pasados</label>
			<p><input type="submit" value="Busca">
		</form>
		<div id="print-pdf">
			<input type="button" value="Imprime" onclick="printPDF()">
			<a id="pdf-view" target="_blank">View</a>
		</div>
		<div id="results">
			<p>
			<h1>Membrecias Nuevas</h1>
			<table id="member-table" align="center">
				<thead>
					<tr><th>Hora</th><th>Organizacion</th><th>Cantidad Pagada</th><th>Metodo de Pago</th><th>Recibo</tr>
				</thead>
				<tbody></tbody>
				<tfoot></tfoot>
			</table>
			<p>
			<h1>Compras de Materiales</h1>
			<table id="checkout-table" align="center">
				<thead>
					<tr><th>Hora</th><th>Organizacion</th><th>Nombre</th><th>Cantidad Pagada</th><th>Metodo de 
					Pago</th><th>Recibo</th></tr>
				</thead>
				<tbody></tbody>
				<tfoot></tfoot>
			</table>
		</div>
		<div id="overlay">
			<div id="overlay-align">
			</div><i id="overlay-spinner" class="fa fa-spinner fa-spin fa-5x"></i>
		</div>
		<div id="info">
			<div id="member-info"></div>
			<div id="checkout-info"></div>
		</div>
		<div id="info-sidebar" table="0" index="0">
			<div id="fields"></div>
			<a class="info-nav" id="info-prev" href="javascript:navInfo(-1)"><i class="info-nav fa fa-chevron-left fa-3x"></i></a>
			<a class="info-nav" id="info-next" href="javascript:navInfo(1)"><i class="fa fa-chevron-right fa-3x"></i></a>
			<a class="info-close" href="javascript:closeInfo()"><i class="fa fa-close fa-2x"></i></a>
		</div>
	</body>
</html>
