var INCLUSIVE = true;


//Categorical variables
var categories = {
	'material-family': ['Double Perovskite', 'Perovskite', 'Ruddlesden-Popper', 
	'Perovskite/Electrolyte', 'Electrolyte', 'Melilite', 'Other'],

	'sample-type': ['Ceramic', 'Thin Film', 'Single Crystal'],

	'measurement-type': ['IEDP/SIMS', 'ECR', 'EBSP', 'GPA', 'IEDP/MS']

};

var OPTIONS = {
	'material-family':{
		'Double Perovskite':false, 
		'Perovskite':false,
		'Ruddlesden-Popper':false, 
		'Perovskite/Electrolyte':false,
		'Electrolyte':false,
		'Melilite':false,
		'Other':false
	},

	'sample-type': {
		'Ceramic':false,
		'Thin Film':false,
		'Single Crystal':false
	},

	'measurement-type': {
		'IEDP/SIMS':false,
		'ECR':false,
		'EBSP':false,
		'GPA':false,
		'IEDP/MS':false
	}

};



var link_color = "#B81D18";
var TEMP = 600;

var selected_options = [];


$(document).ready(function(){
	
	$("#apply-sort-button").click(function(){
		applyModalOptions();
		drawScatter();
	})



	// SLIDER
	$("#slider").slider({
		range:"min",
		value:600,
		min:400,
		max:1000,
		step:10,
		slide: function( event,ui){
			$("#temp").val("T = " +ui.value + "K");
			TEMP = ui.value;
			drawScatter();
		}
	});
	$("#temp").val("T = " + $("#slider").slider("value") + "K");

	// QUANTITATIVE VARIABLES
	//-----------------------

	$("#x-dstar").click(function(){
		removeStyleX();
		d3.select("#x-dstar").style("font-weight", "bold")
			.style("font-size", "16px").style("color", link_color);
		x_var = 'd_star';
		drawScatter();
	});

	$("#x-kstar").click(function(){
		removeStyleX();
		d3.select("#x-kstar").style("font-weight", "bold")
			.style("font-size", "16px").style("color", link_color);
		x_var = 'k_star';
		drawScatter();
	});
	$("#x-ead").click(function(){
		removeStyleX();
		d3.select("#x-ead").style("font-weight", "bold")
			.style("font-size", "16px").style("color", link_color);
		x_var = 'ead';
		drawScatter();
	});
	$("#x-eak").click(function(){
		removeStyleX();
		d3.select("#x-eak").style("font-weight", "bold")
			.style("font-size", "16px").style("color", link_color);
		x_var = 'eak';
		drawScatter();
	});

	$("#x-mass").click(function(){
		removeStyleX();
		d3.select("#x-mass").style("font-weight", "bold")
			.style("font-size", "16px").style("color", link_color);
		x_var = 'avg_m_no_oxygen';
		drawScatter();
	});
	$("#x-radius").click(function(){
		removeStyleX();
		d3.select("#x-radius").style("font-weight", "bold")
			.style("font-size", "16px").style("color", link_color);
		x_var = 'avg_r_no_oxygen';
		drawScatter();
	});
	$("#x-tol").click(function(){
		removeStyleX();
		d3.select("#x-tol").style("font-weight", "bold")
			.style("font-size", "16px").style("color", link_color);
		x_var = 't_factor';
		drawScatter();
	});
	$("#x-diff").click(function(){
		removeStyleX();
		d3.select("#x-diff").style("font-weight", "bold")
			.style("font-size", "16px").style("color", link_color);
		x_var = 'r_diff';
		drawScatter();
	});



	$("#y-dstar").click(function(){
		removeStyleY();
		d3.select("#y-dstar").style("font-weight", "bold")
			.style("font-size", "16px").style("color", link_color);
		y_var = 'd_star';
		drawScatter();
	});

	$("#y-kstar").click(function(){
		removeStyleY();
		d3.select("#y-kstar").style("font-weight", "bold")
			.style("font-size", "16px").style("color", link_color);
		y_var = 'k_star';
		drawScatter();
	});
	$("#y-ead").click(function(){
		removeStyleY();
		d3.select("#y-ead").style("font-weight", "bold")
			.style("font-size", "16px").style("color", link_color);
		y_var = 'ead';
		drawScatter();
	});
	$("#y-eak").click(function(){
		removeStyleY();
		d3.select("#y-eak").style("font-weight", "bold")
			.style("font-size", "16px").style("color", link_color);
		y_var = 'eak';
		drawScatter();
	});
	$("#y-mass").click(function(){
		removeStyleY();
		d3.select("#y-mass").style("font-weight", "bold")
			.style("font-size", "16px").style("color", link_color);
		y_var = 'avg_m_no_oxygen';
		drawScatter();
	});
	$("#y-radius").click(function(){
		removeStyleY();
		d3.select("#y-radius").style("font-weight", "bold")
			.style("font-size", "16px").style("color", link_color);
		y_var = 'avg_r_no_oxygen';
		drawScatter();
	});
	$("#y-tol").click(function(){
		removeStyleY();
		d3.select("#y-tol").style("font-weight", "bold")
			.style("font-size", "16px").style("color", link_color);
		y_var = 't_factor';
		drawScatter();
	});
	$("#y-diff").click(function(){
		removeStyleY();
		d3.select("#y-diff").style("font-weight", "bold")
			.style("font-size", "16px").style("color", link_color);
		y_var = 'r_diff';
		drawScatter();
	});


	$("#family-sort").click(function(){
		drawModalOptions('material-family', 'Material family');		
	});
	$("#sample-type-sort").click(function(){
		drawModalOptions('sample-type', 'Sample type');
	});	
	$("#measurement-type-sort").click(function(){
		drawModalOptions('measurement-type', 'Measurement type');
	});






	//FUNCTIONS
	//---------

	function removeStyleX(){
		d3.select("#x-dstar").style("font-weight", "")
			.style("font-size", "").style("color", "");
		d3.select("#x-kstar").style("font-weight", "")
			.style("font-size", "").style("color", "");
		d3.select("#x-eak").style("font-weight", "")
			.style("font-size", "").style("color", "");
		d3.select("#x-ead").style("font-weight", "")
			.style("font-size", "").style("color", "");
		d3.select("#x-mass").style("font-weight", "")
			.style("font-size", "").style("color", "");
		d3.select("#x-radius").style("font-weight", "")
			.style("font-size", "").style("color", "");
		d3.select("#x-tol").style("font-weight", "")
			.style("font-size", "").style("color", "");
		d3.select("#x-diff").style("font-weight", "")
			.style("font-size", "").style("color", "");
	};

	function removeStyleY(){

		d3.select("#y-dstar").style("font-weight", "")
			.style("font-size", "").style("color", "");
		d3.select("#y-kstar").style("font-weight", "")
			.style("font-size", "").style("color", "");
		d3.select("#y-eak").style("font-weight", "")
			.style("font-size", "").style("color", "");
		d3.select("#y-ead").style("font-weight", "")
			.style("font-size", "").style("color", "");
		d3.select("#y-mass").style("font-weight", "")
			.style("font-size", "").style("color", "");
		d3.select("#y-radius").style("font-weight", "")
			.style("font-size", "").style("color", "");
		d3.select("#y-tol").style("font-weight", "")
			.style("font-size", "").style("color", "");
		d3.select("#y-diff").style("font-weight", "")
			.style("font-size", "").style("color", "");

	};





	function replaceSortingRow(that){
		//if(d3.select(that)[0][0].style.fontWeight == ""){
		//	d3.select(that).style("font-weight","bold")
		//}
		//else{d3.select(that).style("font-weight","")};

		selected_options = [];
		d3.select("#sort-options").remove();
		d3.select("#sort-row").append("ul").attr("class", "nav nav-pills nav-justified col-sm-12")
			.attr("id", "sort-options");
	};


	function drawModalOptions(cat, name){
		d3.select("#myModalLabel").html(name + " options")
		d3.select("#modal-body-div").remove();
		var div = d3.select("#modal-body")
			.append("div").attr("id", "modal-body-div");
		var all = div.append("div").attr("class", "row")
			.append("center").append("h4").html("All   ")
				.append("input").attr("type", "checkbox")
				.attr("id", cat+"-checkbox")
				.on("click", function(){
					var already_checked = true;
					for(var prop in OPTIONS[cat]){
						if(OPTIONS[cat][prop] == false){
							OPTIONS[cat][prop] = true;
							already_checked = false;
						}
					};
					if(already_checked == true){
						for(var prop in OPTIONS[cat]){
							OPTIONS[cat][prop] = false;
						};
					};


					drawModalOptions(cat,name);
				})


		var all_checked = true;
		for(var i=0; i<categories[cat].length; i++){
			var op = div.append("div").attr("class", "row")
				.append("center").append("h5")
					.html(categories[cat][i] + "   ")
					.attr("id", cat)
						.append("input").attr("type", "checkbox")
						.attr("id", categories[cat][i] + "-checkbox")
						.on("click", function(){
							var n = d3.select(this)[0][0].id.slice(0,-9);
							if(OPTIONS[cat][n] == false){OPTIONS[cat][n]=true}
							else{OPTIONS[cat][n]=false};
							drawModalOptions(cat,name)
						})

	
			if(OPTIONS[cat][ categories[cat][i] ]==true){op[0][0].checked=true}
			else{
				all_checked=false}
		};
		if(all_checked==true){all[0][0].checked=true};
	};

});


function applyModalOptions(){
	var rows = d3.select("#modal-body-div")[0][0].children;
	for(var i=0; i<rows.length; i++){
		var cat = rows[i].children[0].children[0].id
		var node = rows[i].children[0].children[0].children[0]
		//console.log(node.id.slice(0,-9), cat, node.checked);
			
	}

}

