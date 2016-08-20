<div class="invoice-item">

	<select name="item_code[]" class="form-control column-1" onchange="itemChange(event)">
		<option value="" selected>--Select Item--</option>
		<option disabled>_____________</option>
		<option value="MBTP - P">Materials Purchase</option>
		<option value="MBTP - MM">$100 Materials Membership</option>
		<option value="MBTP - SM">School Membership (in excess of $100)</option>
		<option value="MBTP - CR">Cart Refill</option>
		<option disabled>_____________</option>
		<option value="OE - CUS">Customized Outreach Program/Event</option>
		<option value="OE - TT">Teacher Training (Professional Development)</option>
		<option value="OE - WGW">What Goes Where</option>
		<option value="OE - EV">Eco-Vehicle</option>
		<option value="OE - RS">Reach for the Sky</option>
		<option value="OE - URM">Ultimate Recycling Machine</option>
		<option value="OE - BBM">Beats By Me</option>
		<option value="OE - MR">Mileage Reimbursement</option>
		<option disabled>_____________</option>
		<option value="P - NASA">NASA Cart</option>
		<option value="P - SC">STEAM Cart</option>
		<option value="P - CP">Custom Project</option>
		<option value="P - SL">STEAM Lab</option>
		<option value="P - O">Other</option>
		<option disabled>_____________</option>
		<option value="WE - SC">Spontaneous Creations</option>
		<option value="WE - FT">Field Trip</option>
		<option value="WE - PP">Private Party (Birthday or Other)</option>
		<option value="WE - TT">Teacher Training (Professional Development)</option>
		<option value="WE - O">Other (Corporate Team-Building, etc.)</option>
		<option disabled>_____________</option>
		<option value="GR">Grant</option>
		<option value="DON">Donations</option>
		<option value="CDON">Corporate Donations</option>
	</select>
		
	<input type="text" name="item_description[]" class="form-control column-2">
	
	<a class="item-delete hidden" href="#" onclick="removeItem(this)"><i class="fa fa-times"></i></a>
		
</div>
