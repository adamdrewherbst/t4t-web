<html>
	<head>
		<?
		$type = 'member';
		include_once('../shared/header.php');
		?>
		<style>
			.page-section {
				display: block !important;
			}
			div#wrapper {
				margin: 0 !important;
			}
			div#inner-wrapper {
				margin: 0 50px !important;
			}
		</style>
		<script type="text/javascript" src="member.js"></script>
		<script type="text/javascript">
			$(document).ready(function() {
				var $date = $('label[for=Date]');
				$date.hide();
				$date.next().hide();
			});
		</script>
	</head>
	<body>
		<div id="wrapper">
		<div id="inner-wrapper">
		<? include_once('member_form.php'); ?>
		<? include_once('../shared/overlay.php'); ?>
		</div>
		</div>
	</body>
</html>
