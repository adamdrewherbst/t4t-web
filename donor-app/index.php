<html>
	<head>
		<?
		$type = 'donor';
		$interactive = 1;
		include_once('../shared/header.php');
		?>
	</head>
	<body>
		<div id="wrapper">
		<div id="inner-wrapper">
			<? include_once('../shared/body.php'); ?>
		</div>
		</div>

		<? overlay(); ?>

		<iframe src="" id="hiddenFrm" style="display:none;" frameborder="0"></iframe>
	</body>
</html>
