<html>
	<head>
		<?
		$type = 'donor';
		include_once('../shared/header.php');
		?>
		<script>
			$(document).ready(function() {
				callScript({
					data: {
						action: 'totals',
					},
					success: function(data) {
						$('#total').text('T4T has diverted ' + data.total + ' pounds of material since 2015');
					},
				});
			});
		</script>
	</head>
	<body>
		<div id="total">Calculating...</div>
	</body>
</html>
