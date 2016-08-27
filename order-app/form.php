<div id="record-info" class="page-section record-action">
<form id="record-form" action="javascript:void(0)">
	
	<input type="hidden" name="action" value="updateInfo">
	<input type="hidden" name="Record ID">

	<? site_field(); ?>
	<? date_field(); ?>
	
	<?
	//read in the prices from the catalog file (downloaded nightly)
	$lines = file('catalog.csv', FILE_IGNORE_NEW_LINES);
	$titleArr = explode(',', $lines[0]);
	$titles = array();
	foreach($titleArr as $ind => $title) {
		$titles[$title] = $ind;
	}
	$allValues = array_map(function($line) {
		if(str_replace(',', '', $line) == '') return 0;
		$arr = explode(',', $line);
		global $titleArr;
		return array_combine($titleArr, $arr);
	}, $lines);
	$values = array_filter($allValues, function($row) { return $row != 0; });
	
	$catalog = array();
	foreach($values as $ind => $row) {
		if($ind == 0) continue;
		$account = $row['Account ID'] ?: $account;
		if(!$account) continue;
		if(!isset($catalog[$account])) $catalog[$account] = array();
		if($row['Item Code']) $catalog[$account][$row['Item Code']] = $row;
	}
	error_log(var_export($catalog,true));
	?>

	<div id="invoice-item-template" class="multiple-template-copy hidden">
		<? include('invoice_item_fields.php'); ?>
	</div>
	
	<div id="facilitator-field-template" class="multiple-template-copy hidden">
		<? include('facilitator_field.php'); ?>
	</div>

	<div id="item-wrapper" class="list-wrapper">
		<div class="invoice-titles">
			<label class="column-1">Item</label>
			<label class="column-2">Description</label>
			<label class="column-3">Price</label>
		</div>
		<div class="invoice-item-wrapper multiple-template-wrapper">	
			<? include('invoice_item_fields.php'); ?>
		</div>
	</div>
	
	<label for="Notes">Additional Notes</label>
	<input type="text" class="form-control" name="Notes">

	<p><p>
	<label>BILLING INFORMATION</label>
	<p>
	
	<label for="Billing Organization">Organization</label>
	<input type="text" class="form-control" name="Billing Organization" placeholder="Your organization..." required>
	<label for="Billing Address">Street Address</label>
	<input type="text" class="form-control" name="Billing Address" placeholder="Street address..." required>
	<label for="Billing City">City</label>
	<input type="text" class="form-control" name="Billing City" placeholder="City..." required>
	<label for="Billing State">State</label>
	<select class="form-control" name="Billing State">
		<? US_states(); ?>
	</select>
	<label for="Billing ZIP">ZIP Code</label>
	<input type="zipcodeUS" class="form-control" name="Billing ZIP" placeholder="ZIP Code..." required>
	<label for="Billing Name">Contact Name</label>
	<input type="text" class="form-control" name="Billing Name" placeholder="Name of primary contact..." required>
	<label for="Billing Title">Contact Title</label>
	<input type="text" class="form-control" name="Billing Title" placeholder="eg. Teacher, Artist...">
	<label for="Phone Number">Phone Number</label>
	<input type="phoneUS" class="form-control" name="Billing Phone Number" placeholder="Phone number...">
	<label for="Email">Email Address</label>
	<input type="email" class="form-control" name="Billing Email" placeholder="Email...">

	<p><p>
	<label>SHIPPING INFORMATION</label>
	<button id="copy-billing-button" type="button" class="btn btn-primary">Copy Billing Info</button>
	<p>

	<label for="Shipping Organization">Organization</label>
	<input type="text" class="form-control" name="Shipping Organization" placeholder="Your organization..." required>
	<label for="Shipping Address">Street Address</label>
	<input type="text" class="form-control" name="Shipping Address" placeholder="Street address..." required>
	<label for="Shipping City">City</label>
	<input type="text" class="form-control" name="Shipping City" placeholder="City..." required>
	<label for="Shipping State">State</label>
	<select class="form-control" name="Shipping State">
		<? US_states(); ?>
	</select>
	<label for="Shipping ZIP">ZIP Code</label>
	<input type="zipcodeUS" class="form-control" name="Shipping ZIP" placeholder="ZIP Code..." required>
	<label for="Shipping Name">Contact Name</label>
	<input type="text" class="form-control" name="Shipping Name" placeholder="Name of primary contact..." required>
	<label for="Shipping Title">Contact Title</label>
	<input type="text" class="form-control" name="Shipping Title" placeholder="eg. Teacher, Artist...">
	<label for="Phone Number">Phone Number</label>
	<input type="phoneUS" class="form-control" name="Shipping Phone Number" placeholder="Phone number...">
	<label for="Email">Email Address</label>
	<input type="email" class="form-control" name="Shipping Email" placeholder="Email...">

	<input type="submit" value="Submit" class="btn btn-primary" style="margin-top:15px">
</form>
</div>
