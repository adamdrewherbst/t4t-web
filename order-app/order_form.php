<div id="record-info" class="page-section record-action">
<form id="record-form" action="javascript:void(0)" onsubmit="submitForm(this)">
	
	<input type="hidden" name="action" value="updateInfo">
	<input type="hidden" name="Record ID">

	<? include('../shared/site_field.php'); ?>	
	<? include('../shared/date_field.php'); ?>

	<div id="item-template" class="hidden">
		<? include('invoice_item_fields.php'); ?>
	</div>

	<div id="item-wrapper" class="list-wrapper">	
		<label class="column-1">Item</label>
		<label class="column-2">Description</label>
		<? include('invoice_item_fields.php'); ?>
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
		<? include('../shared/US_states.php'); ?>
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
	<a href="javascript:copyBillingToShipping()">
		<button type="button" class="btn btn-primary">Copy Billing Info</button>
	</a>
	<p>

	<label for="Shipping Organization">Organization</label>
	<input type="text" class="form-control" name="Shipping Organization" placeholder="Your organization..." required>
	<label for="Shipping Address">Street Address</label>
	<input type="text" class="form-control" name="Shipping Address" placeholder="Street address..." required>
	<label for="Shipping City">City</label>
	<input type="text" class="form-control" name="Shipping City" placeholder="City..." required>
	<label for="Shipping State">State</label>
	<select class="form-control" name="Shipping State">
		<? include('../shared/US_states.php'); ?>
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
