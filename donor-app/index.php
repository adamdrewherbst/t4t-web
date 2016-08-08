<html>
	<head>
		<?
		$type = 'donor';
		$interactive = 1;
		include_once('../shared/header.php');
		?>

		<script type="text/javascript" src="donor.js"></script>
	</head>
	<body>
		<div id="wrapper">
		<div id="inner-wrapper">
			<? include_once('../shared/body.php'); ?>
		</div>
		</div>

		<div id="overlay">
			<div id="overlay-align">
			</div><i id="overlay-spinner" class="fa fa-spinner fa-spin fa-5x"></i>
		</div>

		<iframe src="" id="hiddenFrm" style="display:none;" frameborder="0"></iframe>
	</body>
</html>
