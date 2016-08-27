<div id="record-info" class="page-section record-action">
<form id="record-form" action="javascript:void(0)">
	
	<input type="hidden" name="action" value="updateInfo">
	<input type="hidden" name="Record ID">

	<? site_field(); ?>
	<? date_field(); ?>
	
	<label for="Organization">Organization Name</label>
	<input type="text" class="form-control" name="Organization" placeholder="Your organization..." required>
	<label for="Address">Street Address</label>
	<input type="text" class="form-control" name="Address" placeholder="Street address..." required>
	<label for="City">City</label>
	<input type="text" class="form-control" name="City" placeholder="City..." required>
	<label for="ZIP">ZIP Code</label>
	<input type="zipcodeUS" class="form-control" name="ZIP" placeholder="ZIP Code..." required>
	<label for="Contact Name">Contact Name</label>
	<input type="text" class="form-control" name="Contact Name" placeholder="Name of primary contact for this donor..."
		required>
	<label for="Contact Title">Contact Title</label>
	<input type="text" class="form-control" name="Contact Title" placeholder="eg. Teacher, Artist...">
	<label for="Phone Number">Phone Number</label>
	<input type="phoneUS" class="form-control" name="Phone Number" placeholder="Phone number...">
	<label for="Email">Email Address</label>
	<input type="email" class="form-control" name="Email" placeholder="Email...">
	<label for="Referred by">Referred By</label>
	<input type="text" class="form-control" name="Referred by" placeholder="Let us know if someone told you about us...">
	<label for="Material">Material Available</label>
	<input type="text" class="form-control" name="Material">
	<label for="Notes">Additional Notes</label>
	<input type="text" class="form-control" name="Notes">

	<input type="submit" value="Submit" class="btn btn-primary" style="margin-top:15px">
</form>
</div>
