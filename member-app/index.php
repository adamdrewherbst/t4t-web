<html>
	<head>
		<?
		$type = 'member';
		$interactive = 1;
		include_once('../shared/header.php');
		?>
	</head>
	<body>
		<div id="wrapper">
		<div id="inner-wrapper">
			
			<?
			include_once('../shared/body.php');
			?>

			<div id="payment-info" class="page-section record-action">
			<form id="payment-form" action="javascript:void(0)">
				<input type="hidden" name="action" value="addUnits">
				<input type="hidden" name="Record ID">
				
				<? date_field(); ?>

				<div class="form-group" style="margin-left: 20px">
					<label class="radio">
						<input type="radio" name="Payment Method" value="Cash" id="payment-cash">
						Cash
					</label>
					<label class="radio">
						<input type="radio" name="Payment Method" value="Check" id="payment-cash">
						Check
					</label>
					<label class="radio">
						<input type="radio" name="Payment Method" value="Credit / Debit Card" id="payment-cash">
						Credit / Debit Card
					</label>
					<label class="radio">
						<input type="radio" name="Payment Method" value="PayPal" id="payment-cash">
						PayPal
					</label>
					<label class="radio">
						<input type="radio" name="Payment Method" value="Invoice" id="payment-cash">
						Invoice
					</label>
					<label class="radio">
						<input type="radio" name="Payment Method" value="Gift Certificate" id="payment-cash">
						Gift Certificate
					</label>
				</div>
	
				<label for="Amount Paid">Amount Paid</label>
				<input type="number" min="0" class="form-control" name="Amount Paid" style="width: 600px"
					placeholder="Number of units for a membership/number of dollars for a non-member" required>
				<label for="Receipt Number">Receipt Number</label>
				<input type="text" class="form-control" name="Receipt Number"
					placeholder="Have a staff member enter, if you paid by card">
	
				<input type="submit" value="Submit" class="btn btn-primary" style="margin-top:15px">
			</form>
			</div>
		</div>
		</div>

		<? overlay(); ?>
	</body>
</html>
