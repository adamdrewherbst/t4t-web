<label for="Site">Site</label>
<select class="form-control" name="Site">
	<option value="Gardena"<?=!isset($site) || $site == '' || $site == 'Gardena' ? ' selected' : ''?>>Gardena</option>
	<option value="Fresno"<?=$site == 'Fresno' ? ' selected' : ''?>>Fresno</option>
</select>
