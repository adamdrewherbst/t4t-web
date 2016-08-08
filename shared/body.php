<? extract($_GET); ?>

<div id="search-info">
	<form id="search-form" action="javascript:void(0)" onsubmit="doSearch(this)">
		<input type="hidden" name="action" value="search">
		<label for="search_string" style="display:block">Find your <?=$type?>:</label>
		<input type="text" name="search_string" class="form-control" style="display:inline-block; width:50%"
			placeholder="Enter search text..." width="40">
		<input type="submit" class="btn btn-primary">
	</form>
	<a href="javascript:newRecord()"><button type="button" class="btn btn-primary">New <?=ucwords($type)?></button></a>
	
	<? if($type == 'member') { ?>
	<a href="javascript:nonMemberCheckout()"><button type="button" class="btn btn-primary">Non-Member Purchase</button></a>
	<? } ?>
</div>

<div id="search-results" class="page-section">
	<div id="result-wrapper">
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
			default: break;
		}
		
		foreach($actions as $action => $title) {
		?>
		
		<a href="javascript:recordAction('<?=$action?>')">
			<button id="<?=$action?>-button" type="button" class="btn btn-primary"><?=$title?></button>
		</a>
		
		<? } ?>
	</div>
</div>

<? include_once("${type}_form.php"); ?>

<div id="entry-info" class="page-section record-action">
<form id="entry-form" action="javascript:void(0)" onsubmit="submitForm(this)">
	<input type="hidden" name="action" value="newEntry">
	<input type="hidden" name="Record ID">
	
	<? include('date_field.php'); ?>
	
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
	<button type="button" class="btn btn-primary" onclick="hideLog()">OK</button>
</div>
</div>
