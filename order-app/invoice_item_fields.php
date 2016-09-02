<div class="invoice-item multiple-template">

	<input type="hidden" name="Item ID[]" value="">
	<input type="hidden" name="Calendar Event ID[]" value="">

	<select name="Item Code[]" class="item-code form-control column-1 multiple-trigger">
		<option value="" selected>--Select Item--</option>
		<?
		foreach($catalog as $account => $codes) {
			?>
			<option disabled></option>
			<option disabled>
				<span style="font-weight: bold; font-style: italic; text-decoration: underline;">
					<?=$account?>
				</span>
			</option>
			<option disabled></option>
			<?
			foreach($codes as $code => $item) { ?>
				<option value="<?=$item['Item Code']?>" catalog="<?=rawurlencode(json_encode($item))?>">
					<?=$item['Item Description']?>
				</option>
			<? }
		}
		?>
	</select>
		
	<input type="text" name="Item Description[]" class="form-control item-description column-2">
	
	<input type="text" name="Item Price[]" class="form-control item-price column-3">
	
	<a class="item-delete multiple-delete hidden" href="javascript:void(0)"><i class="fa fa-times"></i></a>
	
	<div class="invoice-additional-fields">
		<div class="invoice-fields-product hidden" accounts="P MBTP" accounts-exclude="MBTP-P MBTP-MM MBTP-SM">
			<? date_field('Fulfillment Date', 'Fulfillment Date[]'); ?>
		</div>
		<div class="invoice-fields-event hidden" accounts="OE WE" accounts-exclude="OE-MR">
			<div class="facilitator-wrapper">
				<label for="Facilitators">Facilitators</label>
				<div class="facilitator-field-wrapper multiple-template-wrapper">
					<? include('facilitator_field.php'); ?>
				</div>
			</div>
			<? date_field('Event Date', 'Event Date[]', 'invoice-event-date'); ?>
			<? time_field('Start Time', 'Start Time[]', 'invoice-start-time'); ?>
			<? time_field('End Time', 'End Time[]', 'invoice-end-time'); ?>
		</div>
		<div class="invoice-fields-mileage hidden" accounts="OE-MR">
			<label for="Mileage[]">Number of Miles</label>
			<input class="item-mileage" type="number" name="Mileage[]" value="0">
		</div>
	</div>
		
</div>
