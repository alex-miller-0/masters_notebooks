/*
	x_var, y_var refer to the column titles, which can currently be:

	'D* (cm^2/s)'
	'k* (cm/s)'
	'nO M(amu)' //non-oxygen avg mass
	'nO R(pm)' //non-oxygen avg radius


*/

function process_data( v, datum){

	//Define variable strings
	var dstar = 'log ( D* (cm^2/s) )', kstar = 'log ( k* (cm/s) )', 
	avg_m = 'Average Mass (amu)', avg_r = 'Average Radius (pm)',
	ea_dstar = 'Ea(D*) (eV)', ea_kstar = 'Ea(k*) (eV)', tol = 'T-factor',
	r_diff = 'avg_r_diff';

	// DSTAR
	//------
	if(v == 'd_star'){
		var t0 = parseFloat(datum['T']);

		// lnD* = (-Ea/R)(1/t0 - 1/t) + lnD0*
		// D* = exp( [-Ea/R]*[1/t0-1/t]  ) + D0*

		// -Ea/R is in kJ/mol => 0.0104 eV = 1 kJ/mol

		var mx = ( (-datum['ead']*96.487) / 8.314 )  * ( (1000/TEMP) - (1000/t0)  )
		var b = Math.log( parseFloat(datum['d_star']) )/Math.LN10;

		//var v = Math.log(mx+b);
		var v = mx+b;
		if( isNaN(v) == true){v = 0}
		
		return v;
	};

	// KSTAR
	//------
	if(v == 'k_star'){
		var t0 = datum['T'];

		// lnk* = (-Ea/R)(1/t0 - 1/t) + lnk0*
		// k* = exp( [-Ea/R]*[1/t0-1/t]  ) + k0*

		// -Ea/R is in kJ/mol => 0.0104 eV = 1 kJ/mol

		var mx = ( (-datum['eak']*96.487) / 8.314 )  * ( (1000/TEMP) - (1000/t0)  )
		var b = Math.log( parseFloat(datum['k_star']) )/Math.LN10;

		var v = mx+b;

		if( isNaN(v) == true){v = 0}

		return v;

	};

	//Activation energies
	if(v == 'ead'){
		return parseFloat(datum['ead'])
	}
	if(v == 'eak'){
		return parseFloat(datum['eak'])
	}


	// Non-Oxygen average atomic mass
	//-------------------------------
	if(v == 'avg_m_no_oxygen'){
		return parseFloat(datum['avg_m_no_oxygen']);
	};

	// Non-Oxygen average atomic radius
	//---------------------------------
	if(v == 'avg_r_no_oxygen'){
		return parseFloat(datum['avg_r_no_oxygen']);
	};

	// Tolerance factor
	//-----------------
	if(v == 't_factor'){
		var t = parseFloat(datum['t_factor']);
		return t;
	}

	// Difference in dopant/parent radii
	//-----------------
	if(v == 'r_diff'){
		var d = parseFloat(datum['avg_r_diff']);
		return d;
	}


};//end process_data



//Populate the object sort_options with options in a sorting category
function process_sorting(option){
	for(var i =0; i<sort_options.length; i++){
		if(sort_options[i] == option){return}
	};

	sort_options.push(option);


	return
}




















