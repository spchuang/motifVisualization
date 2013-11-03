var type1_folder, type2_folder;
var currentData;
var currentCell;
var centroidWindow = ['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30']

var template = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99,100]

var centroidNubmer = 100;
var motifNumber = 498;
var PROCESSING = false;
var navSelect = -1;

$(document).ready(function(){
	
	renewDataFolder(function(){
		console.log("data folder renewed!: ");
		console.log(type1_folder);
		console.log(type2_folder);
	});

	
});

var loading = false;
function loadingSing(loadItem){
	loading = !loading;
	if(loading){
		$("#graph_container").append("<div id='loading'><h3>Loading...</h3></div>");
		
	}else{
		
		
	}
}

function renewDataFolder(callback){
	$("#side_panel").html("");
	$.ajax({
        type: "GET",
        url: 'get_data_folders',
        dataType: "json",
        success: function(result) {
        	type1_folder = [];
        	type2_folder = [];

			console.log(result);
			for(var i=0; i<result.type1_folders.length;i++){
				type1_folder.push(result.type1_folders[i]);
			}
			for(var i=0; i<result.type2_folders.length;i++){
				type2_folder.push(result.type2_folders[i]);
			}
			
			
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
				$("#side_panel li ").removeClass('active');
				$(this).parent().addClass('active');
				PROCESSING = true;
				console.log(this.id);
				$("#graph_container").html('');
				$("#graph_nav").html('');
				
				
				if($(this).attr('class') == 'dataFolder1'){
					$.ajax({
				        type: "GET",
				        url: 'get_fp_to_template_assignment',
				        data: {folderName: this.id},
				        dataType: "json",
				        success: function(result){
				        	if(result.error){
					        	alert(result.error);
					        	$("#graph_container").html("");
					        	PROCESSING = false;
					        	return false;
				        	}
				        	currentData = result;
				        	
				        	insertResult_1Nav();
				        	$("#graph_container").append("<div id='graph_1_1' style='width:100%;'></div>");
				        	$("#graph_container").append("<div class='empty' id='graph_1_2' style='width:100%; display:none;'></div>");
				        	insertResult_1CellSelect();
				        	insertResult_1Graph();

					   		//display the screen
					   		$("#loading").remove();
					   		
					        console.log(result);	
					        PROCESSING = false;			        
					        
				        }
				    });
					
					
				}else if($(this).attr('class') == 'dataFolder2'){
					$.ajax({
				        type: "GET",
				        url: 'get_motif_pattern_data',
				        data: {folderName: this.id},
				        dataType: "json",
				        success: function(result){
				        	if(result.error){
					        	alert(result.error);
					        	$("#graph_container").html("");
					        	PROCESSING = false;
					        	return false;
				        	}
				        	currentData = result;
				        	
				        
					   		$("#graph_container").append("<div id='graph_2_1' style='width:100%;'></div>");
				        	$("#graph_container").append("<div class='empty' id='graph_2_2' style='width:100%; display:none;'></div>");
							insertResult_2CellSelect();
					   		insertResult_2Graph();
					   		$("#loading").remove();

					        console.log(result);	
					        PROCESSING = false;			        
					        
				        }
				    });
					
				}
				
				return false;
			
			});
			
			
			
			callback();
        },
        error: function(xhr, ajaxOptions, thrownError) {
            alert("Request to get data folders did not work:\n"+xhr.status);
        }
    });
	
	
	
}

function insertResult_1Nav(){
	$("#graph_nav").html('');
	$("#graph_nav").append("<ul id='graph_1_nav' class='nav nav-pills'><li class='active'><a href='#' id='fp_cons'>Footprint vs. Conservation</a></li><li><a href='#' id='corr_overview'>Correlation Overview</a></li></ul>");
	navSelect = $("#graph_1_nav li.active a").attr('id');

	$("#graph_1_nav li a").on('click', function(){
		if(navSelect == this.id) return false;
		navSelect = this.id;
		
		$("#graph_1_nav li ").removeClass('active');
		$(this).parent().addClass('active');
		if(navSelect == 'fp_cons'){
			$("#graph_1_1").css({"display":"block"});
			$("#graph_1_2").css({"display":"none"});
			
		}else if(navSelect =='corr_overview'){
			$("#graph_1_1").css({"display":"none"});
			 $("#graph_1_2").css('display','block');
			
			
			
		}
		setTimeout( function() {
			   switchResult_1Nav();
			}, 200);
	});
	
}

var cellTypeIndex = {};
function switchResult_1Nav(){
	
	if(navSelect == 'corr_overview'){
		//initialize graph 1-2
		if($("#graph_1_2").hasClass('empty')){
			$("#graph_container #graph_1_2").append("<div id='loading'><h3>Loading...</h3></div>");
			$("#graph_container #graph_1_2").append("<div id='celltypes_checkbox'><h4>Filter celltypes</h4></div><hr>");
			$("#graph_container #graph_1_2").append("<div id='graph_1_2_corr' style='width:2500px; height:750px;'></div>");
			
			setTimeout( function() {
				//insert checkbox
				
			
			   corr_chart = new Highcharts.Chart({
				    chart: {
				        renderTo: 'graph_1_2_corr'
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
					
					$("#graph_1_2 #celltypes_checkbox").append("<label class='checkbox inline'><input type='checkbox' class='graph_1_2_checkbox' checked id='"+key+"'>"+key+"</label>");
					i++;
				});
				
				
				//bind clck events to these checkboxes
				$("#graph_1_2 #celltypes_checkbox .graph_1_2_checkbox").on('change', function() {
					var checked = ($(this).is(':checked')) ? true : false;
					var index = cellTypeIndex[this.id];
					if(checked){
						corr_chart.series[index].show();
					}else{
						
						corr_chart.series[index].hide();
					}
					//alert(checked);
				});
				
				
				$("#graph_container #graph_1_2 #loading").remove();
				$("#graph_1_2").removeClass('empty');
			
			}, 300);
			
			;/*
			$.each(currentData.data[currentCell].conservationLevel[i].data, function(key,val){
				conData.push(parseFloat(val));
	
			});*/
			
			
						
		}
		
	}
	
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