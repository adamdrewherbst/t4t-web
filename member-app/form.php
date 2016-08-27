<?
if(!isset($action)) $action = 'updateInfo';
if(!isset($type)) $type = 'personal';
?>

<div id="record-info" class="page-section record-action">
<form id="record-form" action="javascript:void(0)">
	
	<input type="hidden" name="action" value="<?=$action?>">
	<input type="hidden" name="Record ID">

	<? site_field(); ?>
	<? date_field(); ?>
	
	<label for="Membership Type">Membership Type</label>
	<select class="form-control" name="Membership Type">
		<option value="personal"<?= $type=='personal' ? ' selected="selected"' : '' ?>>Personal ($100)</option>
		<option value="institutional"<?= $type=='institutional' ? ' selected="selected"' : '' ?>>Institutional ($1000)</option>
	</select>
	<label for="Organization">Organization Name</label>
	<input type="text" class="form-control" name="Organization" placeholder="Your organization, or your name if independent..." required>
	<label for="Address">Street Address</label>
	<input type="text" class="form-control" name="Address" placeholder="Street address..." required>
	<label for="City">City</label>
	<input type="text" class="form-control" name="City" placeholder="City..." required>
	<label for="ZIP">ZIP Code</label>
	<input type="zipcodeUS" class="form-control" name="ZIP" placeholder="ZIP Code..." required>
	<label for="Contact Name">Contact Name</label>
	<input type="text" class="form-control" name="Contact Name" placeholder="Name of primary contact for this membership..."
		required>
	<label for="Contact Title">Contact Title</label>
	<input type="text" class="form-control" name="Contact Title" placeholder="eg. Teacher, Artist..." required>
	<label for="Phone Number">Phone Number</label>
	<input type="phoneUS" class="form-control" name="Phone Number" placeholder="Phone number..." required>
	<label for="Email">Email Address</label>
	<input type="email" class="form-control" name="Email" placeholder="Email..." required>
	<label for="Referred by">Referred By</label>
	<input type="text" class="form-control" name="Referred by" placeholder="Let us know if someone told you about us...">
	<label for="Number of students served">Number of Students Served</label>
	<input type="number" class="form-control" name="Number of students" placeholder="About how many teachers you serve..."
		min="0">
	<label for="Number of teachers served">Number of Teachers Served</label>
	<input type="number" class="form-control" name="Number of teachers" placeholder="About how many students you serve..."
		min="0">
	<label for="Participating Teachers">Participating Staff Members</label>
	<input type="text" class="form-control" name="Participating Teachers / Staff"
		placeholder="Tell us who is allowed to use your account, or put 'All'..." required>

	<input id="membership-submit" type="submit" value="Submit" class="btn btn-primary" style="margin-top:15px">
</form>
	<a id="membership-paypal" style="display:none" target="_blank">
		<button class="btn btn-primary" style="margin-bottom:15px">Pay Now with PayPal</button>
	</a>
</div>

