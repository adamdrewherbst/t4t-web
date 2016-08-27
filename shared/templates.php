<?

function date_field($title = 'Date', $name = 'Date', $classes = '') {
	?>
	<div class="datetime-field date-field <?=$classes?>">
		<label for="<?=$name?>"><?=$title?></label>
		<div class="form-group">
			<div class='input-group date'>
				<input type='text' class="form-control" name="<?=$name?>" />
				<span class="input-group-addon">
					<span class="glyphicon glyphicon-calendar"></span>
				</span>
			</div>
		</div>
	</div>
	<?
}

function time_field($title = 'Time', $name = 'Time', $classes = '') {
	?>
	<div class="datetime-field time-field <?=$classes?>">
		<label for="<?=$name?>"><?=$title?></label>
		<div class="form-group">
			<div class='input-group time'>
				<input type='text' class="form-control" name="<?=$name?>" />
				<span class="input-group-addon">
					<span class="glyphicon glyphicon-time"></span>
				</span>
			</div>
		</div>
	</div>
	<?
}

function overlay() {
	?>
	<div id="overlay">
		<div id="overlay-align">
		</div><i id="overlay-spinner" class="fa fa-spinner fa-spin fa-5x"></i>
	</div>
	<?
}

function site_field() {
	?>
	<label for="Site">Site</label>
	<select class="form-control" name="Site">
		<option value="Gardena"<?=!isset($site) || $site == '' || $site == 'Gardena' ? ' selected' : ''?>>Gardena</option>
		<option value="Fresno"<?=$site == 'Fresno' ? ' selected' : ''?>>Fresno</option>
	</select>
	<?
}

function US_states() {
	?>
	<option value="AL">Alabama</option>
	<option value="AK">Alaska</option>
	<option value="AZ">Arizona</option>
	<option value="AR">Arkansas</option>
	<option value="CA" selected>California</option>
	<option value="CO">Colorado</option>
	<option value="CT">Connecticut</option>
	<option value="DE">Delaware</option>
	<option value="DC">District Of Columbia</option>
	<option value="FL">Florida</option>
	<option value="GA">Georgia</option>
	<option value="HI">Hawaii</option>
	<option value="ID">Idaho</option>
	<option value="IL">Illinois</option>
	<option value="IN">Indiana</option>
	<option value="IA">Iowa</option>
	<option value="KS">Kansas</option>
	<option value="KY">Kentucky</option>
	<option value="LA">Louisiana</option>
	<option value="ME">Maine</option>
	<option value="MD">Maryland</option>
	<option value="MA">Massachusetts</option>
	<option value="MI">Michigan</option>
	<option value="MN">Minnesota</option>
	<option value="MS">Mississippi</option>
	<option value="MO">Missouri</option>
	<option value="MT">Montana</option>
	<option value="NE">Nebraska</option>
	<option value="NV">Nevada</option>
	<option value="NH">New Hampshire</option>
	<option value="NJ">New Jersey</option>
	<option value="NM">New Mexico</option>
	<option value="NY">New York</option>
	<option value="NC">North Carolina</option>
	<option value="ND">North Dakota</option>
	<option value="OH">Ohio</option>
	<option value="OK">Oklahoma</option>
	<option value="OR">Oregon</option>
	<option value="PA">Pennsylvania</option>
	<option value="RI">Rhode Island</option>
	<option value="SC">South Carolina</option>
	<option value="SD">South Dakota</option>
	<option value="TN">Tennessee</option>
	<option value="TX">Texas</option>
	<option value="UT">Utah</option>
	<option value="VT">Vermont</option>
	<option value="VA">Virginia</option>
	<option value="WA">Washington</option>
	<option value="WV">West Virginia</option>
	<option value="WI">Wisconsin</option>
	<option value="WY">Wyoming</option>
	<?
}
?>

