var themecall = getMillisecond();

//加载里程碑
function openProjectMilestone(id,project_id,load_html,progress_id) {
	getCurrentPageObj().find("#" + id).load(load_html,
			function() {
		initProjectViewVersSelect(project_id,progress_id);
			});
}
//初始化版本Select
function initProjectViewVersSelect(project_id,progress_id){
	
	getCurrentPageObj().find("#d_project_id").val(project_id);
	
	var SelectVersCall=getMillisecond();
	var VersArr=new Array();
	baseAjaxJsonp(dev_planwork+'Wbs/queryProjectVersSelect.asp?project_id='+ project_id + "&SID=" + SID + "&call=" +SelectVersCall,null,function(data) {
  		if (data != undefined&&data!=null) {
  			//得到后台数据
  			var r= data.queryProjectVersSelect;

  			if(r != null && r.length > 0) {
      			for(var j = 0;j<r.length; j++) {
      				var value8 = r[j].VERSIONS_NAME;
      				var value9 = r[j].VERSIONS_ID;
      				var arr={"value":value9,"html":value8};
      				VersArr.push(arr);         				
      			}
      			//每次加载清楚上次统计的数据（放在循环外）
      			getCurrentPageObj().find("option[name='ProjectSelectVers']").remove();
      			for(var i = 0;i<VersArr.length; i++) {
      				appendSelectVers("selectVers",VersArr[i]);
      			}
      			//初始化里程碑      			
				queryProjectMilestoneList(project_id,VersArr[0].value,progress_id);
      		}  			  			  			
  			
  		}       		
  	},SelectVersCall);
}

function appendSelectVers(Select,vers){
  	var Obj = getCurrentPageObj().find("#"+Select);
  	var option = "<option name='ProjectSelectVers' value="+vers.value+">"+vers.html+"</option>";
  	Obj.append(option);
  	
 }

function refreshProjectMilestone(){

	var project_id=getCurrentPageObj().find("#d_project_id").val();
	var version_id=getCurrentPageObj().find("#selectVers").val();
	//var params={"project_id":project_id,"version_id":version_id};
	getCurrentPageObj().find("#milestoneListTable").bootstrapTable('refresh',
			{url:dev_planwork
				+ 'Wbs/queryMilestoneByProjectId.asp?project_id='
				+ project_id + "&version_id="+version_id+"&SID=" + SID + "&call=" + themecall});
	
}


function queryProjectMilestoneList(project_id,version_id,progress_id){

	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	getCurrentPageObj().find("#milestoneListTable").bootstrapTable(
			{
				//请求后台的URL（*）
				url : dev_planwork
						+ 'Wbs/queryMilestoneByProjectId.asp?project_id='
						+ project_id + "&version_id="+version_id+"&SID=" + SID + "&call=" + themecall,
				method : 'get', //请求方式（*）   
				striped : false, //是否显示行间隔色
				cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
				sortable : true, //是否启用排序
				sortOrder : "asc", //排序方式
				queryParams : queryParams,//传递参数（*）
				sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
				pagination : true, //是否显示分页（*）
				pageList : [10,15],//每页的记录行数（*）
				pageNumber : 1, //初始化加载第一页，默认第一页
				pageSize : 10,//可供选择的每页的行数（*）
				clickToSelect : true, //是否启用点击选中行
				uniqueId : "PLAN_ID", //每一行的唯一标识，一般为主键列
				cardView : false, //是否显示详细视图
				detailView : false, //是否显示父子表
				jsonpCallback : themecall,
				singleSelect: true,
				onLoadSuccess : function(data){
					var json = eval(data.rows);
					var num = json.length;
					$("#"+progress_id).empty();
					for ( var i = 0; i < json.length; i++) {
						var item = json[i];
						var plan_name = item.PLAN_NAME;
						var myIndex=item.NUM;
						var end_time = "";
						if(item.END_TIME){
							end_time = item.END_TIME;
						}
						var reality_end_time = item.REALITY_END_TIME;
						var lineCla = "";
						var IsFinish = "";
						if(reality_end_time != undefined){
							IsFinish = "on";
						}
						if(num > 1){
							lineCla = "<span class='line_bg lbg-r'></span>" +
							"<span class='line_bg lbg-l'></span>";
							if(i == 0){
								lineCla = "<span class='line_bg lbg-r'></span>";
							}else if(i == (num - 1)){
								lineCla = "<span class='line_bg lbg-l'></span>";
							}else{
								lineCla = "<span class='line_bg lbg-r'></span>" +
										"<span class='line_bg lbg-l'></span>";
							}
						}
						var $li;
						if(num < 6){
							$li = $("<li class='col-xs-4 " + IsFinish + "'>" +
									"<span class='num'><em class='f-r5'></em><i>" + myIndex + "</i></span>" +
									lineCla +
									"<p class='lbg-txt'>" + plan_name + "<span>" + end_time + "</span></p>" +
									"</li>");
						}else{
							$li = $("<li class='" + IsFinish + "' style='width: " + parseInt(90/num) + "%'>" +
									"<span class='num'><em class='f-r5'></em><i>" + myIndex + "</i></span>" +
									lineCla +
									"<p class='lbg-txt'>" + plan_name + "<span>" + end_time + "</span></p>" +
									"</li>");
						}
						$li.appendTo(getCurrentPageObj().find("#"+progress_id));
					}
					
					$Div = $("<div style='clear:both;'></div>");
					$Div.appendTo(getCurrentPageObj().find("#"+progress_id));
				},
				columns : [ {
					field : 'NUM',
					title : '序号',
					align : "center"
				},{
					field : 'PLAN_NAME',
					title : '名称',
					align : "center"
				}, {
					field : "TYPE_NAME",
					title : "类别",
					align : "center"
				}, {
					field : "END_TIME",
					title : "计划结束日期",
					align : "center"
				}, {
					field : "REALITY_END_TIME",
					title : "实际结束日期",
					align : "center",
					formatter : function(value,row,indxt){
						var end_time = row.END_TIME;
						if(end_time == undefined){
							return value;
						}
						if(value == undefined){
							return "";
						}else{
							var calssVal = "";
							var end_time_date = new Date(end_time.replace(/-/g,"/"));
							var reality_end_time_date = new Date(Date.parse(value.replace(/-/g,"/")));
							
							if(end_time_date > reality_end_time_date){
								calssVal = "icon-unfinished";
							}else if(end_time_date < reality_end_time_date){
								calssVal = "icon-finished";
							}else{
								calssVal = "icon-finishing";
							}
							return "<i class='" + calssVal + "'></i>" + value;
						}
					}
				}]
			});
}