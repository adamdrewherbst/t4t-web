<? extract($_GET); ?>

<div id="search-info">
	<form id="search-form" action="javascript:void(0)">
		<input type="hidden" name="action" value="search">
		<label for="search_string" style="display:block">Find your <?=$type?>:</label>
		<input type="text" name="search_string" class="form-control" style="display:inline-block; width:50%"
			placeholder="Enter search text..." width="40">
		<input type="submit" class="btn btn-primary">
	</form>
	<button id="new-record-button" type="button" class="btn btn-primary">New <?=ucwords($type)?></button>
	
	<? if($type == 'member') { ?>
	<button id="non-member-checkout-button" type="button" class="btn btn-primary">Non-Member Purchase</button>
	<? } ?>
</div>

<div id="search-results" class="page-section">
	<div id="result-wrapper" class="list-wrapper">
		<label for="result-list">Search Results:</label>
		<div id="result-list"></div>
	</div>
	<div id="result-info"></div>
	<div id="result-message"></div>
	<div id="result-alert"></div>
	<div id="result-users"></div>
	<div id="result-actions">
	
		<?
		$actions = array('newEntry' => '', 'updateInfo' => 'Update Info', 'sendReceipt' => 'Send Receipt', 'viewLog' => 'View Log');
		switch($type) {
			case 'member':
				$actions['newEntry'] = 'Checkout';
				$actions['addUnits'] = 'Add Units';
				break;
			case 'donor':
				$actions['newEntry'] = 'Add Donation';
				$actions['generateReceipt'] = 'Generate Receipt';
				break;
			case 'order':
				$actions = array('updateInfo' => 'Update Info', 'generateInvoice' => 'Generate Invoice');
				break;
			default: break;
		}
		
		foreach($actions as $action => $title) {
		?>
		
		<button id="<?=$action?>-button" type="button" class="btn btn-primary record-action-button" action="<?=$action?>"><?=$title?></button>
		
		<? } ?>
	</div>
</div>

<? include_once("form.php"); ?>

<div id="entry-info" class="page-section record-action">
<form id="entry-form" action="javascript:void(0)">
	<input type="hidden" name="action" value="newEntry">
	<input type="hidden" name="Record ID">
	
	<? date_field(); ?>
	
	<? if($type == 'member') { ?>
	
	<label for="Organization">Organization Name</label>
	<input type="text" class="form-control" name="Organization"
		placeholder="Your organization name, or your name if none..." required>
	<label for="Name">Your Name</label>
	<input type="text" class="form-control" name="Name" placeholder="Your name..." required>
	<label for="Phone Number">Phone Number</label>
	<input type="phoneUS" class="form-control" name="Phone Number" placeholder="Phone number (optional)...">
	<label for="Email">Email Address</label>
	<input type="email" class="form-control" name="Email" placeholder="Email (optional)...">
	<label for="Number of Visitors Today">Number of Visitors Today</label>
	<input type="number" min="1" class="form-control" name="Number of Visitors Today"
		placeholder="Number of visitors today, including you..." required>
	<label for="Units Taken Today">Units Taken Today</label>
	<input type="number" min="0" class="form-control" name="Units Taken Today"
		placeholder="Number of units you are taking today..." required>
		
	<? } else if($type == 'donor') { ?>
	
	<label for="Organization">Organization Name</label>
	<input type="text" class="form-control" name="Organization"
		placeholder="Organization name..." required>
	<label for="Units Donated">Units Donated</label>
	<input type="number" min="0" class="form-control" name="Units Donated"
		placeholder="Number of units donated today..." required>
	<label for="Material">Material</label>
	<input type="text" class="form-control" name="Material">
	<label for="Notes">Additional Notes</label>
	<input type="text" class="form-control" name="Notes">
	
	<? } ?>

	<input type="submit" value="Submit" class="btn btn-primary" style="margin-top:15px">
</form>
</div>

<div id="record-log-wrapper">
<div id="record-log">
	<ul>
	</ul>
	<button id="hide-log-button" type="button" class="btn btn-primary">OK</button>
</div>
</div>
