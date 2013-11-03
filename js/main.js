var type1_folder, type2_folder;
var currentData;
var currentCell;
var centroidWindow = ['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30']

var template = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99,100]

var centroidNubmer = 10;
var motifNumber = 498;
var PROCESSING = false;
var navSelect = -1;

var currentTab = null;
//type_1 is fp pattern
//type_2 is motif pattern
var main_navigate = ['type_1', 'type_2'];
var sub_navigate = {
	'type_1':[
		{
			id:'fp_cons', 
			name: 'Footprint vs. Conservation',
			mainFunc: footprint_assignment_graph
		},
		{
			id:'corr_overview', 
			name: 'Correlation Overview',
			mainFunc: correlation_overview_graph
		}]
};

//GROUP major ajax functions to its own function


function test(){
	console.log("test");
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
function loadingSign(block){

	if(block){
		//$("#graph_container").append("<div id='loading'><h3>Loading...</h3></div>");
		$.blockUI({ message: '<h3>Loading ...</h3>' });
	}else{
		$.unblockUI();
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
	//dynamically bind click event trigger
	$("#side_panel li a").on('click', function(){
		if(PROCESSING) return;
		loadingSign(true);
		$("#side_panel li ").removeClass('active');
		$(this).parent().addClass('active');
		PROCESSING = true;
		console.log(this.id);
		//TODO: ajax should not be here. they should have their own function
		
		if($(this).attr('class') == 'dataFolder1'){
			$.ajax({
		        type: "GET",
		        url: 'get_fp_to_template_assignment',
		        data: {folderName: this.id},
		        dataType: "json", 
		    }).done(function(result){
	        	if(result.error){
		        	alert(result.error);
		        	$("#graph_container").html("");
		        	PROCESSING = false;
		        	return false;
	        	}
	        	currentTab = main_navigate[0];	
	        	currentData = result;
	        	
	        	
	        	loadMainContent(currentTab);
	        	

		   		//display the screen
		   		loadingSign(false);				   		
		        console.log(result);	
		        PROCESSING = false;	
		        	        
		        
	        });
			
			
		}else if($(this).attr('class') == 'dataFolder2'){
			$.ajax({
		        type: "GET",
		        url: 'get_motif_pattern_data',
		        data: {folderName: this.id},
		        dataType: "json",
			}).done(function(result){
	        	if(result.error){
		        	alert(result.error);
		        	$("#graph_container").html("");
		        	PROCESSING = false;
		        	return false;
	        	}
	        	currentTab = main_navigate[1];
	        	currentData = result;
	        	loadMainContent(currentTab);
		   		insertResult_2CellSelect();
		   		insertResult_2Graph();
		   		
		   		//display the screen
		   		loadingSign(false);				   		
		        console.log(result);	
		        PROCESSING = false;			        
		        
		    });
			
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

		console.log(result);
		for(var i=0; i<result.type1_folders.length;i++){
			type1_folder.push(result.type1_folders[i]);
		}
		for(var i=0; i<result.type2_folders.length;i++){
			type2_folder.push(result.type2_folders[i]);
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

function loadMainContent(main_tab){
	//clear content
	$("#graph_container").html('');
	$("#graph_nav").html('');
	
	//get main content id
	var index=-1;
	if(main_tab === 'type_1') index = 1;
	else if(main_tab=== 'type_2') index = 2;
	
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
		$("#graph_1_nav li ").removeClass('active');
		$(this).parent().addClass('active');
		$("#graph_container div").removeClass('show').addClass("hide");
		$("#graph_"+index+"_"+(subNavIndex+1)).removeClass("hide").addClass('show');

		setTimeout( function() {
			loadingSign(true);
			sub_navigate[main_tab][subNavIndex].mainFunc("graph_"+index+"_"+(subNavIndex+1))
			.done(function(){
				loadingSign(false);
			})

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
	
	//load the first graph
	loadingSign(true);
	sub_navigate[main_tab][0].mainFunc("graph_"+index+"_1")
	.done(function(){
		loadingSign(false);
	})
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

var chart = [];
var corr_chart;
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

		var c = new Highcharts.Chart({
		    chart: {
		        renderTo: 'graph_centroid_'+i
		    },
		     title: {
	            text: (i+1)+': fp signal vs. cons'
	        },
	        xAxis: {
	            categories: centroidWindow
	        },
	        yAxis: [{ // Primary yAxis

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
            }],
            
            tooltip: {
                shared: true
            },
	        legend: {
	            layout: 'vertical',
	            align: 'right',
	            verticalAlign: 'middle',
	            borderWidth: 0
	        },
	        series: [{
                name: 'footprint signal',
                data: [],
                color: '#4572A7'
      
            },{
                name: 'conservation level',
                yAxis: 1,
                data: [],
                color: '#AA4643'
            
            }]
		});
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
				
				
				//$("#graph_container #graph_2_1_name_"+i+" span").html(currentData.data[currentCell].motif[i]);
				//$("#graph_container #graph_2_1_corr_"+i+" span").html(currentData.data[currentCell].correlation[i]);
				//console.log(currentData.data[currentCell].fpSignal[i].data);
				
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
		$("#graph_container #graph_2_1").append("<div id='graph_motif_"+i+"' style='width:100%; height:300px; float=left;'></div>");
		//$("#graph_container #graph_1_1").append("<div id='graph_template_"+i+"' style='width:50%; height:300px; float=left;;></div>");
		$("#graph_container #graph_2_1").append("<div id='clear_float'><hr id='graph_hr_"+i+"'>");
	

		var c = new Highcharts.Chart({
		    chart: {
		        renderTo: 'graph_motif_'+i
		    },
		     title: {
	            text: (i+1)+': fp signal vs. cons'
	        },
	        xAxis: {
	            categories: centroidWindow
	        },
	        yAxis: [{ // Primary yAxis

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
            }],
            
            tooltip: {
                shared: true
            },
	        legend: {
	            layout: 'vertical',
	            align: 'right',
	            verticalAlign: 'middle',
	            borderWidth: 0
	        },
	        series: [{
                name: 'footprint signal',
                data: [],
                color: '#4572A7'
      
            },{
                name: 'conservation level',
                yAxis: 1,
                data: [],
                color: '#AA4643'
            
            }]
		});
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





/* Graphing Logic */
function footprint_assignment_graph(div_id){
	var deferred = new $.Deferred();

	insertResult_1CellSelect();
	insertResult_1Graph();

	return deferred;
	
}

	
function correlation_overview_graph(div_id){
	var cellTypeIndex = {};
	var deferred = new $.Deferred();
	$("#graph_container #"+div_id).append("<div id='celltypes_checkbox'><h4>Filter celltypes</h4></div><hr>");
	$("#graph_container #"+div_id).append("<div id='corr' style='width:2500px; height:750px;'></div>");
	
	setTimeout( function() {
		//insert checkbox
		
	   corr_chart = new Highcharts.Chart({
		    chart: {
		        renderTo: 'corr'
		    },
		     title: {
	            text: 'Template Correlation'
	        },
	        xAxis: {
	            categories: template
	        },
	        yAxis: { // Primary yAxis

                title: {
                    text: 'correlation Level',
                    style: {color: '#4572A7'}
                }
            },
            tooltip: {
                shared: true
            },
	        legend: {
	            layout: 'vertical',
	            align: 'right',
	            verticalAlign: 'middle',
	            borderWidth: 0
	        },
	        series: []
		});
		
		var i=0;
		$.each(currentData.data, function(key, val){
	if(i<1){
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
		
			corr_chart.addSeries(series);
			
			$("#"+div_id+" #celltypes_checkbox").append("<label class='checkbox inline'><input type='checkbox' class='checkbox' checked id='"+key+"'>"+key+"</label>");
		}
			i++;
		});
	
		//bind clck events to these checkboxes
		/*$("#"+div_id+" #celltypes_checkbox .checkbox").on('change', function() {
			var checked = ($(this).is(':checked')) ? true : false;
			var index = cellTypeIndex[this.id];
			if(checked){
				corr_chart.series[index].show();
			}else{
				
				corr_chart.series[index].hide();
			}
			//alert(checked);
		});
		*/
		
		//loadingSign(false);
		//DONE:
		deferred.resolve();
		//$("#graph_1_2").removeClass('empty');
	
	}, 300);
	return deferred;

}
