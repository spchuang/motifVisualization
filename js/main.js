var type1_folder, type2_folder, type3_folder;
var currentData;
var currentCell;


var xAxis_category ={
	'centroidWindow' :['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30']
,
	'template': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99,100]


	
	
}
/*
var centroidWindow = ['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30']

var template = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99,100]
*/
var centroidNubmer = 100;
var motifNumber = 10;
var PROCESSING = false;
var navSelect = -1;

var currentTab = null;
var selectedFolder = null;
//type_1 is fp pattern
//type_2 is motif pattern
var main_navigate = ['type_1', 'type_2', 'type_3'];
var sub_navigate = {
	'type_1':[
		{
			id:'fp_cons', 
			name: 'Footprint vs. Conservation',
			mainFunc: footprint_assignment_graph,
			processed: false
		},
		{
			id:'corr_overview', 
			name: 'Correlation Overview',
			mainFunc: correlation_overview_graph,
			processed: false
		}],
	'type_2':[
		{
			id:'motif_pattern',
			name: 'Motif for each celltypes',
			mainFunc: motif_pattern_graph,
			processed: false
		}],
	'type_3' :[
		{
			id:'motif_across_cell',
			name: 'Motif across celltypes',
			mainFunc: motif_pattern_across_celltypes_graph,
			processed: false
			
		}
	]
};

//GROUP major ajax functions to its own function


function test(){
 	var deffered = $.Deferred();
	console.log("test");
	deffered.resolve();
	return deffered;
}
$(document).ready(function(){
	
	renewDataFolder(function(){
		console.log("data folder renewed!: ");
		console.log(type1_folder);
		console.log(type2_folder);
	});
});


/*
	Side Panel Controller
*/
function loadingSign(block, msg){
	if(!msg)
		msg =""
	if(block){
		//$("#graph_container").append("<div id='loading'><h3>Loading...</h3></div>");
		$.blockUI({ message: '<h3>Loading '+msg+'...</h3>' });
	}else{
		$.unblockUI();
	}
}

function clearProcessedState(){
	if(!currentTab) return;
	console.log("CLEAR");
	console.dir(sub_navigate[currentTab]);
	for(var i=0; i<sub_navigate[currentTab].length; i++){
		sub_navigate[currentTab][i].processed = false;
	}
	
}
function refreshSidePanel(data){
	//refresh sidepanel
	$("#side_panel").append("<li class='nav-header'>fp Assignment</li>");
	for(var i in type1_folder){
		$("#side_panel").append("<li><a class='dataFolder1' href='#' id='"+type1_folder[i]+"'>"+type1_folder[i]+"</a></li>");
	}
	$("#side_panel").append("<li class='nav-header'>motif assignment</li>");
	for(var i in type2_folder){
		$("#side_panel").append("<li><a class='dataFolder2' href='#' id='"+type2_folder[i]+"'>"+type2_folder[i]+"</a></li>");
	}
	$("#side_panel").append("<li class='nav-header'>motif across cells</li>");
	for(var i in type3_folder){
		$("#side_panel").append("<li><a class='dataFolder3' href='#' id='"+type3_folder[i]+"'>"+type3_folder[i]+"</a></li>");
	}
	//dynamically bind click event trigger
	$("#side_panel li a").on('click', function(){
		if(selectedFolder == this.id || PROCESSING) return;
		
		loadingSign(true);
		$("#side_panel li ").removeClass('active');
		$(this).parent().addClass('active');
		selectedFolder = this.id;
		
		clearProcessedState();
		
		if($(this).attr('class') == 'dataFolder1'){
			currentTab = main_navigate[0];	
			loadMainContent(currentTab);
			
			
		}else if($(this).attr('class') == 'dataFolder2'){
			currentTab = main_navigate[1];
			loadMainContent(currentTab);
			
		}else if($(this).attr('class') == 'dataFolder3'){
			currentTab = main_navigate[2];
			loadMainContent(currentTab);
		}
		
		return false;
	
	});
}

function renewDataFolder(callback){
	$("#side_panel").html("");
	$.ajax({
        type: "GET",
        url: 'get_data_folders',
        dataType: "json",
    }).done(function(result) {
    	type1_folder = [];
    	type2_folder = [];
    	type3_folder = [];

		console.log(result);
		for(var i=0; i<result.type1_folders.length;i++){
			type1_folder.push(result.type1_folders[i]);
		}
		for(var i=0; i<result.type2_folders.length;i++){
			type2_folder.push(result.type2_folders[i]);
		}
		for(var i=0; i<result.type3_folders.length;i++){
			type3_folder.push(result.type3_folders[i]);
		}
		
		refreshSidePanel();
		callback();
    }).fail(function(xhr, ajaxOptions, thrownError) {
        alert("Request to get data folders did not work:\n"+xhr.status);
    });

}

/*
	Main content Navigation controller
	pass in the type index so 
		fp assignment = 1
		motif assignment = 2
	and 
		default sub index = 1
*/

function loadMainContent(main_tab, callback){
	//clear content
	$("#graph_container").html('');
	$("#graph_nav").html('');
	chart = [];
	chart2 = [];
	
	//get main content id
	var index = parseInt(main_tab.split("_")[1]);
	/*if(main_tab === 'type_1') index = 1;
	else if(main_tab=== 'type_2') index = 2;
	else if(main_tab=== 'type_3') index=3;*/
	
	//load sub navigation
	var list = ""
	for(var i=0; i<sub_navigate[main_tab].length; i++){
		if(i==0){
			list+="<li class='active'><a href='#' id='"+sub_navigate[main_tab][i].id+"'>"+sub_navigate[main_tab][i].name+"</a></li>";
		}else{
			list+="<li><a href='#' id='"+sub_navigate[main_tab][i].id+"'>"+sub_navigate[main_tab][i].name+"</a></li>";
		}
	}
	
	$("#graph_nav").append("<ul id='graph_"+index+"_nav' class='nav nav-pills'>"+list+"</ul>");
	
	navSelect = $("#graph_"+index+"_nav li.active a").attr('id');
	
	//bind click event to sub navigation
	$("#graph_"+index+"_nav li a").on('click', function(){
		var subNavIndex = -1;
		if(navSelect == this.id) return false;
		navSelect = this.id;
		for(var i=0; i<sub_navigate[main_tab].length; i++){
			if(sub_navigate[main_tab][i].id == navSelect){
				subNavIndex = i;
				break;
			}
		}
		$("#graph_"+index+"_nav li ").removeClass('active');
		$(this).parent().addClass('active');
		$("#graph_container > div").removeClass('show').addClass("hide");
		$("#graph_"+index+"_"+(subNavIndex+1)).removeClass("hide").addClass('show');

		setTimeout( function() {
			//only load the function if it hasn't been processeed  before
			if(!sub_navigate[main_tab][subNavIndex].processed){
			
				PROCESSING = true;
				loadingSign(true);
				sub_navigate[main_tab][subNavIndex].mainFunc("graph_"+index+"_"+(subNavIndex+1))
				.done(function(){
					PROCESSING = false;
					loadingSign(false);
				}).fail(function(error_msg){
					alert(error_msg);
		        	$("#graph_container").html("");
		        	PROCESSING = false;
		        	loadingSign(false);	
		        	return false;
				});
			}
			
		}, 200);
	});

	//first load the correct subnav divs in main container
	for(var i=0; i<sub_navigate[main_tab].length; i++){
		if(i==0){
			$("#graph_container").append("<div class='show' id='graph_"+index+"_"+(i+1)+"' style='width:100%;'></div>");
		}else{
			$("#graph_container").append("<div id='graph_"+index+"_"+(i+1)+"' style='width:100%; '></div>");
		}
	}
	
	//load first graph
	PROCESSING = true;
	loadingSign(true);
	console.log(main_tab);
	
	sub_navigate[main_tab][0].mainFunc("graph_"+index+"_1")
	.done(function(){
		PROCESSING = false;
		loadingSign(false);
	}).fail(function(error_msg){
		alert(error_msg);
    	$("#graph_container").html("");
    	PROCESSING = false;
    	loadingSign(false);	
    	return false;
	});
	
}


function insertResult_1CellSelect(){
	
	//put new select options
	$("#graph_container #graph_1_1").append("<label>pick a cell type</label><select id='select-cell'>");
	$.each(currentData.celltypes, function(k,v) {
		
		$("#graph_container #graph_1_1 #select-cell").append("<option id='"+v+"'>"+v+"</option>");
	});
	$("#graph_container #graph_1_1").append("</select>");
	
	$("#graph_container #graph_1_1 #select-cell").on("change", function(){
		//alert($(this).val());	
		currentCell = $(this).val();
		updateResult_1Graph();
		//change highcharts
		
	});
	
	currentCell = $("#graph_container #select-cell option:selected").attr('id');
}
//define chart list
var chart = [];
var corr_chart;
var chart2 = [];

//this is graph for 1_1, which is footpritn vs conservation and template
function insertResult_1Graph()
{
	
	//push 100 graph containers first
	for(var i=0; i<centroidNubmer; i++){
		
		$("#graph_container #graph_1_1").append("<h5 id='graph_1_1_per_"+i+"' >Percentage: <span></span>%</h3>");
		$("#graph_container #graph_1_1").append("<h5 id='graph_1_1_corr_"+i+"'>Correlation: <span></span></h3>");
		$("#graph_container #graph_1_1").append("<div id='graph_centroid_"+i+"' style='width:100%; height:300px; float=left;'></div>");
		//$("#graph_container #graph_1_1").append("<div id='graph_template_"+i+"' style='width:50%; height:300px; float=left;;></div>");
		$("#graph_container #graph_1_1").append("<div id='clear_float'><hr>");

		
		var c = get_chart('graph_centroid_'+i, (i+1)+': fp signal vs. cons', 'centroidWindow', true);		
		chart.push(c);

	}
	updateResult_1Graph();
}

function updateResult_1Graph(){
	console.log("update graph to "+currentCell);
	for(var i=0; i<centroidNubmer; i++){
		console.log("processing "+i);
		var fpData = [];
		var conData = [];
		$.each(currentData.data[currentCell].fpSignal[i].data, function(key,val){
			fpData.push(parseFloat(val));

		});
		$.each(currentData.data[currentCell].conservationLevel[i].data, function(key,val){
			conData.push(parseFloat(val));

		});

		chart[i].series[0].setData(fpData);
		chart[i].series[1].setData(conData);
		
		$("#graph_container #graph_1_1_per_"+i+" span").html(currentData.data[currentCell].count[i]);
		$("#graph_container #graph_1_1_corr_"+i+" span").html(currentData.data[currentCell].correlation[i]);
		//console.log(currentData.data[currentCell].fpSignal[i].data);
		
	}
	
	

	
	
}
/*MOTIF */
function insertResult_2CellSelect(){
	
	//put new select options
	$("#graph_container #graph_2_1").append("<label>pick a cell type</label><select id='select-cell'>");
	$.each(currentData.celltypes, function(k,v) {
		
		$("#graph_container #graph_2_1 #select-cell").append("<option id='"+v+"'>"+v+"</option>");
	});
	$("#graph_container #graph_2_1").append("</select>");
	$("#graph_container #graph_2_1").append("<label>correlation filter</label><input id='filter-corr' type='textbox'></input>");
	
	$("#graph_container #graph_2_1 #select-cell").on("change", function(){
		//alert($(this).val());	
		currentCell = $(this).val();
		updateResult_2Graph();
		//change highcharts
		
	});

	
	$("#graph_container #graph_2_1 #filter-corr").on('keyup',function(e){
		if(e.keyCode == 13)
	    {
	    	var filter_corr = parseFloat($(this).val());
	        //filter out the correlation less than... $(this).val()
	        for(var i=0; i<motifNumber; i++){
				var this_corr = parseFloat($("#graph_container #graph_2_1_corr_"+i+" span").html());
				
				if(this_corr > filter_corr){
					$("#graph_container #graph_2_1 #graph_2_1_name_"+i).css("display","none");
					$("#graph_container #graph_2_1 #graph_2_1_corr_"+i).css("display","none");
					$("#graph_container #graph_2_1 #graph_motif_"+i).css("display","none");
					$("#graph_container #graph_2_1 #graph_hr_"+i).css("display","none");

				}else{
					$("#graph_container #graph_2_1 #graph_2_1_name_"+i).css("display","block");
					$("#graph_container #graph_2_1 #graph_2_1_corr_"+i).css("display","block");
					$("#graph_container #graph_2_1 #graph_motif_"+i).css("display","block");
					$("#graph_container #graph_2_1 #graph_hr_"+i).css("display","none");
					
				}
				
			}
	    }
		
	});
	
	currentCell = $("#graph_container #select-cell option:selected").attr('id');
}

function insertResult_2Graph(){
	
	//push 100 graph containers first
	for(var i=0; i<motifNumber; i++){

		$("#graph_container #graph_2_1").append("<h5 id='graph_2_1_name_"+i+"' >Motif: <span></span></h3>");
		$("#graph_container #graph_2_1").append("<h5 id='graph_2_1_corr_"+i+"'>Correlation: <span></span></h3>");
		$("#graph_container #graph_2_1").append("<div id='graph_2_1_motif_"+i+"' style='width:100%; height:300px; float=left;'></div>");
		//$("#graph_container #graph_1_1").append("<div id='graph_template_"+i+"' style='width:50%; height:300px; float=left;;></div>");
		$("#graph_container #graph_2_1").append("<div id='clear_float'><hr id='graph_hr_"+i+"'>");
	
		var c = get_chart('graph_2_1_motif_'+i, (i+1)+': fp signal vs. cons', 'centroidWindow', true);
		
		chart.push(c);

	}
	updateResult_2Graph();
}

function updateResult_2Graph(){
	console.log("update graph to "+currentCell);
	for(var i=0; i<motifNumber; i++){
		console.log("processing "+i);
		var fpData = [];
		var conData = [];
		$.each(currentData.data[currentCell].fpSignal[i].data, function(key,val){
			fpData.push(parseFloat(val));
		});
		
		$.each(currentData.data[currentCell].conservationLevel[i].data, function(key,val){
			conData.push(parseFloat(val));

		});

		chart[i].series[0].setData(fpData);
		chart[i].series[1].setData(conData);
		
		$("#graph_container #graph_2_1_name_"+i+" span").html(currentData.data[currentCell].motif[i]);
		$("#graph_container #graph_2_1_corr_"+i+" span").html(currentData.data[currentCell].correlation[i]);
		//console.log(currentData.data[currentCell].fpSignal[i].data);
		
	}
	
}

//Compare motifs across different celltypes
var currentMotif;
function insertResult_3CellSelect(){
	
	//put new select options
	$("#graph_container #graph_3_1").append("<label>pick a Motif Name</label><select id='select-motif'>");
	$.each(currentData.motifs, function(k,v) {
	
		$("#graph_container #graph_3_1 #select-motif").append("<option id='"+v+"'>"+v+"</option>");
	});
	$("#graph_container #graph_3_1").append("</select>");
	//$("#graph_container #graph_2_2").append("<label>correlation filter</label><input id='filter-corr' type='textbox'></input>");
	
	$("#graph_container #graph_3_1 #select-motif").on("change", function(){
		
		currentMotif = $(this).val();
		loadingSign(true, currentMotif);
		
		updateResult_3Graph();
		loadingSign(false);
		
	});
	currentMotif = $("#graph_container #select-motif option:selected").attr('id');

	
}
function insertResult_3Graph(){

	$("#graph_container #graph_3_1").append("<h5 id='graph_3_motif_name' >Motif: <span></span></h3>");
	$("#graph_container #graph_3_1").append("<div id='graph_3_signal' style='width:100%; height:450px; float=left;'></div><br><br>"); 
	
	$("#graph_container #graph_3_1").append("<div id='graph_3_corr' style='width:100%; height:450px; float=left;'></div>");
	 
	console.log("LOADING");
	chart2.push(get_chart("graph_3_signal", "Comparison of signal ", "centroidWindow", false));
	chart2.push(get_chart("graph_3_corr", "comparison of correlation", "centroidWindow", false));
	//loadingSign(true, currentMotif);
	updateResult_3Graph();
	//loadingSign(false);
	
}

function updateResult_3Graph(){
	console.log(currentData);
	console.log("update graph to "+currentMotif);
	
	while(chart2[0].series.length > 0)
		chart2[0].series[0].remove(true);
	while(chart2[1].series.length > 0)
		chart2[1].series[0].remove(true);
	
	for(var i=0; i<currentData.data[currentMotif].length; i++){

		var series = {
			lineWidth: 1,
	        id: 'series',
	        name: currentData.data[currentMotif][i].celltype,
	        data: [],
	        marker: {radius:2}
	        }
	    $.each(currentData.data[currentMotif][i].fpSignal, function(key,val){
			series.data.push(parseFloat(val));

		});
		//update signal
		
		chart2[0].addSeries(series,false);
		
		
		series.data = [];
		$.each(currentData.data[currentMotif][i].conservationLevel, function(key,val){
			series.data.push(parseFloat(val));

		});
		
		//update corr
		
		chart2[1].addSeries(series,false);

		$("#graph_container #graph_3_motif_name span").html(currentMotif);
		
		
		
	}
	chart2[0].redraw();
	chart2[1].redraw();
	
	//loadingSign(false);
}

/* Graphing Logic */

//TAB1: 
function footprint_assignment_graph(){

	var deferred = new $.Deferred();
	sub_navigate['type_1'][0].processed = true;
	$.ajax({
        type: "GET",
        url: 'get_fp_to_template_assignment',
         headers: { "Accept-Encoding" : "gzip" },
        data: {folderName: selectedFolder},
        dataType: "json", 
    }).done(function(result){
    	if(result.error){
    		deferred.reject(result.error);
    	}
    	console.log(result);
    	currentData = result;
    	insertResult_1CellSelect();
		insertResult_1Graph();
					
        deferred.resolve();
    }).fail(function(e){
		deferred.reject(e.statusText);
    });
	return deferred;
	
}

	
function correlation_overview_graph(div_id){
	var cellTypeIndex = {};
	var deferred = new $.Deferred();
	sub_navigate['type_1'][1].processed = true;
	$("#graph_container #"+div_id).append("<div id='celltypes_checkbox'><h4>Filter celltypes</h4></div><hr>");
	$("#graph_container #"+div_id).append("<div id='corr' style='width:2500px; height:750px;'></div>");
	
	setTimeout( function() {
		//insert checkbox
		//get_chart(renderDivID, title, category, hasSeries)
		corr_chart = get_chart("corr", "Template Correlation", "template", false);
	 
	var i=0;

		$.each(currentData.data, function(key, val){
			console.log(key);
			cellTypeIndex[key] = i;
			var series = {
				lineWidth: 1,
		        id: 'series',
		        name: key,
		        data: [],
		        marker: {radius:2}
		        }
			$.each(currentData.data[key].correlation, function(key,val){
				series.data.push(parseFloat(val));
	
			});
		
			corr_chart.addSeries(series,false);
			
			$("#"+div_id+" #celltypes_checkbox").append("<label class='checkbox inline'><input type='checkbox' class='checkbox' checked id='"+key+"'>"+key+"</label>");
		
			i++;
		
			
		});
		corr_chart.redraw();
	
		//bind clck events to these checkboxes
		$("#"+div_id+" #celltypes_checkbox .checkbox").on('change', function() {
			var checked = ($(this).is(':checked')) ? true : false;
			var index = cellTypeIndex[this.id];
			if(checked){
				corr_chart.series[index].show();
			}else{
				
				corr_chart.series[index].hide();
			}
			//alert(checked);
		});
		
		
		//loadingSign(false);
		//DONE:
		deferred.resolve();
		//$("#graph_1_2").removeClass('empty');
	
	}, 300);
	return deferred;

}

//TAB2:
function motif_pattern_graph(){
	var deferred = $.Deferred();
	sub_navigate['type_2'][0].processed = true;

	$.ajax({
        type: "GET",
        url: 'get_motif_pattern_data',
         headers: { "Accept-Encoding" : "gzip" },
        data: {folderName: selectedFolder},
        dataType: "json",
	})
    .done(function(result){
    	if(result.error){
        	deferred.reject(result.error);
    	}
    	currentData = result;
   		insertResult_2CellSelect();
   		insertResult_2Graph();
   		
   		deferred.resolve();	        
        
    }).fail(function(e){
		deferred.reject(e.statusText);
    });
    return deferred;
	
}

function motif_pattern_across_celltypes_graph(){
	var deferred = $.Deferred();
	sub_navigate['type_3'][0].processed = true;

	$.ajax({
        type: "GET",
        url: 'get_motif_pattern_across_cell',
        headers: { "Accept-Encoding" : "gzip" },
        data: {folderName: selectedFolder},
        dataType: "json",
	})
    .done(function(result){
    	if(result.error){
        	deferred.reject(result.error);
    	}
    	currentData = result;
		insertResult_3CellSelect();
		insertResult_3Graph();
    	/*currentData = result;
   		insertResult_2CellSelect();
   		insertResult_2Graph();
   		*/
   		console.log(result);
   		deferred.resolve();	        
        
    }).fail(function(e){
		deferred.reject(e.statusText);
    });
    return deferred;
	
}


/////HELPER FUNCTION
//series: boolean
function get_chart(renderDivID, title, category, hasSeries){

	var series = [];
	var yAxis = { 
                title: {
                    text: 'Level',
                    style: {color: '#4572A7'}
                }
            };
	if(hasSeries){
		series = [{
                name: 'footprint signal',
                data: [],
                color: '#4572A7'
      
            },{
                name: 'conservation level',
                yAxis: 1,
                data: [],
                color: '#AA4643'
            }];
        yAxis = [{ // Primary yAxis
                title: {
                    text: 'Signal Level',
                    style: {color: '#4572A7'}
                }
            }, { // Secondary yAxis
                title: {
                    text: 'Conservation Level',
                    style: {color: '#AA4643'}
                },
                opposite: true
            }];
	}
	
	return new Highcharts.Chart({
		    chart: {
		        renderTo: renderDivID
		    },
		     title: {
	            text: title
	        },
	        xAxis: {
	            categories: xAxis_category[category]
	        },
	        yAxis: yAxis,
            tooltip: {
                shared: true
            },
	        legend: {
	            layout: 'vertical',
	            align: 'right',
	            verticalAlign: 'middle',
	            borderWidth: 0
	        },
	        series: series
		});
	
	
}
