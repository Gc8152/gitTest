var currTab=getCurrentPageObj();  //获取当前页面对象

//初始化项目基本信息
function initProjgramInfoPage(row){
	
	$("#VERSIONS_ID").html(row.VERSIONS_ID);
	$("#VERSIONS_NAME").html(row.VERSIONS_NAME);
	
	var VERSIONS_ID =row.VERSIONS_ID;  	
	var VERSIONS_NAME =row.VERSIONS_NAME;
	
	initProjectDetailTable(VERSIONS_ID);
	initProjectRiskTable(VERSIONS_ID);
	initProjectChangeTable(VERSIONS_ID);
	initProjectQualityTable(VERSIONS_ID);
	initProjectConfigTable(VERSIONS_ID);
		

	initProjectMilestoneTable(VERSIONS_ID,VERSIONS_NAME);

}	
	//查询项目群范围
	function initProjectDetailTable(VERSIONS_ID){
		
		var ProjectDetailCall =getMillisecond();
		var queryParams=function(params){
			var temp={
					limit: params.limit, //页面大小
					offset: params.offset //页码
			};
			return temp;
		};
		getCurrentPageObj().find("#ProjectDetailtable").bootstrapTable({
			url : dev_project+"programQuery/ProjectDetailList.asp?SID="+SID+"&VERSIONS_ID="+VERSIONS_ID+"&call="+ProjectDetailCall,
			method : 'get', //请求方式（*）   
			striped : false, //是否显示行间隔色
			cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
			sortable : true, //是否启用排序
			sortOrder : "asc", //排序方式
			queryParams : queryParams,//传递参数（*）
			sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
			pagination : true, //是否显示分页（*）
			pageList : [5,10,15],//每页的记录行数（*）
			pageNumber : 1, //初始化加载第一页，默认第一页
			pageSize : 10,//可供选择的每页的行数（*）
			clickToSelect : true, //是否启用点击选中行
			uniqueId : "PROJECT_ID", //每一行的唯一标识，一般为主键列
			cardView : false, //是否显示详细视图
			detailView : false, //是否显示父子表
			jsonpCallback:ProjectDetailCall,
			singleSelect: true,
			onLoadSuccess : function(data){
				gaveInfo();
			},
			columns : [ {
				field : 'Number',
				title : '序号',
				align : "center",
				width : "5%",
				formatter: function (value, row, index) {
					return index+1;
				}
/*			}, {
				field : "flag",
				title : "健康标识",
				align : "center",
				width : "8%",
				formatter: function (value, row, index) {
					
					var per = 0;
					if(Number(row.TOTAL)!=0){
						per = Number(row.FINISHED)/Number(row.TOTAL);
					}else{
						per = 1;
					}
					var differday = parseInt(row.DIFFERDAY);
					var notclose = parseInt(row.NOTCLOSE);
					var temp=0;
					
					if(notclose>0 || differday>14 || per<0.8){
						temp=1;
						return "<span onclick='identification(\""+parseFloat(per).toFixed(1)+"\",\""+differday+"\",\""+notclose+"\",\""+temp+"\")' style='color:red;'>问题</span>";
					}else if(per==1 && (differday>=7 && differday<=14) && notclose==0){
						temp=2;
						return "<span onclick='identification(\""+parseFloat(per).toFixed(1)+"\",\""+differday+"\",\""+notclose+"\",\""+temp+"\")' style='color:yellow;'>风险</span>";
					}else if((per>=0.8 && per<1) && (differday>=1 && differday<=14) && notclose==0){
						temp=3;
						return "<span onclick='identification(\""+parseFloat(per).toFixed(1)+"\",\""+differday+"\",\""+notclose+"\",\""+temp+"\")' style='color:yellow;'>风险</span>";
					}else if(per==1 && differday<7  && notclose==0){
						temp=4;
						return "<span onclick='identification(\""+parseFloat(per).toFixed(1)+"\",\""+differday+"\",\""+notclose+"\",\""+temp+"\")' style='color:green;'>正常</span>";
					}
					
				}*/
			}, {
/*				field : "PROJECT_NUM",
				title : "项目编号",
				align : "center",
				width : "12%"
			}, {*/
				field : "PROJECT_NAME",
				title : "项目名称",
				align : "center",
				width : "35%",
				formatter: function (value, row, index) {
					
					return '<span class="hover-view" onclick="GoToProjectDetail(\''+row.PROJECT_NUM+'\')">'+value+'</span>';
				}
			}, {
				field : "STATUS",
				title : "项目状态",
				align : "center",
				width : "13%"
			}, {
				field : "PROJECT_TYPE",
				title : "项目类型",
				align : "center",
				width : "13%"
			}, {
				field : "DUTY_USER_NAME",
				title : "项目经理",
				align : "center", 
				width : "13%"
			}, {
				field : "ORGAN_NAME",
				title : "归属部门",
				align : "center",
				width : "13%"
			}]
		},ProjectDetailCall);
		
	}
	//标识明细提示
	function identification(per,differday,notclose,temp){
		
		if(temp==1){
			if(per<0.8){
				alert("问题  >>>"+"不满足的任务完成率："+per+";");
			}else if(differday>14){
				alert("问题  >>>"+"过大的里程碑偏差："+differday+";");
			}else{
				alert("问题  >>>"+"仍有未关闭的问题条数："+notclose+";");
			}
		}else if(temp==2){							
			alert("风险  >>>"+"较大的里程碑偏差："+differday+";");
		}else if(temp==3){
			alert("风险  >>>"+"较低的任务完成率："+per+";");
		}
		
	}	
	//查询项目明细
	function GoToProjectDetail(PROJECT_NUM){
		
		var GoToCall = getMillisecond();
		
		baseAjaxJsonp(dev_project
				+ "myProject/queryListmyProject.asp?SID=" + SID + "&call=" + GoToCall,null,function(data) {
			if (data != undefined&&data!=null) {
				var z=data.rows;
				for(var i = 0;i<z.length; i++) {
					if(z[i].PROJECT_NUM==PROJECT_NUM){
						
						closePageTab("ProjectTaskView_queryInfo");		
						closeAndOpenInnerPageTab(
								"ProjectTaskView_queryInfo",
								"项目全景视图",
								"dev_project/projectManage/myProject/ProjectTaskView_queryInfo.html",
								function() {	
									initViewProjectInfoPage(z[i]);
						});
					}
						
				}
				
			}
		},GoToCall);
		
			
	}
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> 里程碑信息 >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
	//查询里程碑信息
	function initProjectMilestoneTable(VERSIONS_ID,VERSIONS_NAME){
		
		$("#versionsNameLi").html(VERSIONS_NAME);
		
		var zNodes = new Array();
		var call = getMillisecond();
		
		var setting = {  
	            view: {  
	                selectedMulti: false        //禁止多点选中  
	            },	            
	            async:{dataType:"json"},

	            data: {  
	                simpleData: {  
	                    enable:true,  
	                    idKey: "ID",  
	                    pIdKey: "PID",  
	                    rootPId: ""  
	                }  
	            },  
	            callback: {  
	                onClick: function(treeId, treeNode) { 
	                    var treeObj = $.fn.zTree.getZTreeObj(treeNode);  
	                    var selectedNode = treeObj.getSelectedNodes()[0];
	                    
	                	//查看里程碑按钮事件

	                			var project_id = selectedNode.ID;
	                			var project_name = selectedNode.name;
	                			var project_plan = selectedNode.plan;
	                			
	                			if(project_plan == "项目群"){
	                				alert("此层为项目群，请选择下属项目！");
	                				return false;
	                			}else if(project_plan == "任务编码"){
	                				
	                				getCurrentPageObj().find(".pop").html("");
	                				//后台赋值任务码为显示tree中，将其付给变量project_name，现在变回任务码
	                				var REQ_TASK_CODE=project_name;
	                				openAppPop("treePop",REQ_TASK_CODE);
	                				
	                			}else if(project_plan == "未创建"){
	                				alert("该项目还没有创建计划！");
	                				return false;
	                			}else{
	                			
		                			openProjectMilestone("milestonePageShow", project_id,VERSIONS_ID,
		                			"dev_project/projectManage/programQuery/ProjectMilestoneDiv.html","programQuery_milestoneProgress");
	                			}		
	                    
	                }  
	            }  
	        };  
		
		baseAjaxJsonp(dev_project+'programQuery/queryProjectsTree.asp?VERSIONS_ID='+VERSIONS_ID+'&call='+call+'&SID='+SID,null,function(data) {

			if (data != undefined&&data!=null&&data.result=="true") {
				
				var z=data.ProjectsTree;
				var t=data.TaskTree;
				
				zNodes.push({"ID":VERSIONS_ID,"PID":"","name":VERSIONS_NAME,"plan":"项目群"});
				
				if(z != null && z.length > 0) {
					for(var i = 0;i<z.length; i++) {
						
						var value1 = z[i].PROJECT_ID;
						var value2 = z[i].VERSIONS_ID;
          				var value3 = z[i].PROJECT_NAME;
						var value4 = z[i].PROJECT_PLAN;
          				var arr={"ID":value1,"PID":value2,"name":value3,"plan":value4};
						zNodes.push(arr);
						
					}
				}
				
				if(t != null && t.length > 0) {
					for(var j = 0;j<t.length; j++) {
						
						var value21 = t[j].PROJECT_ID;
						var value22 = t[j].TASK_ID;
          				var value23 = t[j].TASK_CODE;
          				var arr2={"ID":value22,"PID":value21,"name":value23,"plan":"任务编码"};
						zNodes.push(arr2);
						
					}
				}
				
				
				var treeObj = $.fn.zTree.init($("#treeSubject"),setting, zNodes);
				treeObj.expandAll(true);
			}else{
				alert("查询失败");
			}
		},call);		
		
	}
//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<风险问题<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
		
	//查询项目群范围
	function initProjectRiskTable(VERSIONS_ID){
		
		var ProjectRiskCall=getMillisecond();
		//建立数组存放数据		
		var dataArr=new Array();				
		
		baseAjaxJsonp(dev_project+"programQuery/queryProjectRiskList.asp?SID="+SID+"&VERSIONS_ID="+VERSIONS_ID+"&call="+ProjectRiskCall,null,function(data) {
      		if (data != undefined&&data!=null&&data.result==true) {
      			//得到后台数据
      			var s= data.queryProjectsList;
      			var r= data.queryProjectRiskList;
      			if(s != null && s.length > 0) {
     				
          			for(var i = 0;i<s.length; i++) {
          				
          				var value1 = s[i].PROJECT_ID;
          				var value2 = s[i].PROJECT_NUM;
          				var value3 = s[i].PROJECT_NAME;
          				var value4 = s[i].STATUS;
          				var arr = {"PROJECT_ID":value1,"PROJECT_NUM":value2,"PROJECT_NAME":value3,"STATUS":value4,"one":"0","two":"0","three":"0","four":"0"};
          				
          				dataArr.push(arr);
        				
          			}
	
          		}
              	
      			
      			if(r != null && r.length > 0) {
                  	
          			for(var j = 0;j<r.length; j++) {
          				
          				var value1 = r[j].PROJECT_ID;
          				var value2 = r[j].PONDERANCE;
          				var value3 = r[j].NUM;         				
          				
          				for(var k = 0;k<dataArr.length; k++) {
          					
          					if(dataArr[k].PROJECT_ID==value1){
          						          						
          						switch (value2) {		                         
                                case '严重':
                                	dataArr[k].one=value3;                            
                                    break;
                                case '高':
                                	dataArr[k].two=value3;
                                    break;
                                case '中':
                                	dataArr[k].three=value3;
                                    break;
                                case '低':
                                	dataArr[k].four=value3;
                                    break;                         
                        }
          					}else{
          						continue;
          					}
          						
          				}
          				
          				         				
          			}
	
          		}
      			
      			//每次加载清楚上次统计的数据（放在循环外）dataArr[h].PROJECT_NUM,
              	$("tr[name='projectRiskList']").remove();
              	
              	for(var h = 0;h<dataArr.length; h++){
              		appendprojectRiskTr("ProjectRisktable",h,h+1,dataArr[h].PROJECT_NAME,dataArr[h].STATUS,dataArr[h].one,dataArr[h].two,dataArr[h].three,dataArr[h].four);
              	}
      			 
      		}       		
      		
      	},ProjectRiskCall);
		
	}
 
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> 项目变更 >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

	//查询项目变更
	function initProjectChangeTable(VERSIONS_ID){
		
		var ProjectChangeCall=getMillisecond();
		//建立数组存放数据		
		var dataArr=new Array();				
		
		baseAjaxJsonp(dev_project+"programQuery/queryProjectChangelist.asp?SID="+SID+"&VERSIONS_ID="+VERSIONS_ID+"&call="+ProjectChangeCall,null,function(data) {
      		if (data != undefined&&data!=null&&data.result==true) {	
      			//得到后台数据
      			var s= data.queryProjectReqPlanChangelist;
      			var r= data.queryProjectVerChangelist;

      			if(s != null && s.length > 0) {
     				
          			for(var i = 0;i<s.length; i++) {
          				
          				var value1 = s[i].PROJECT_ID;
          				var value2 = s[i].PROJECT_NUM;
          				var value3 = s[i].PROJECT_NAME;
          				var value4 = s[i].STATUS;
          				var value5 = s[i].REQNUM;
          				var value6 = s[i].VERNUM;
          				var value7 = s[i].PLANNUM;	
          				var arr = {"PROJECT_ID":value1,"PROJECT_NUM":value2,"PROJECT_NAME":value3,"STATUS":value4,"REQNUM":value5,"VERNUM":value6,"PLANNUM":value7,"NOPASS":0,"PASS":0};	
          				dataArr.push(arr);
        				
          			}
	
          		}      			
  				
      			if(r != null && r.length > 0) {
                  	
          			for(var j = 0;j<r.length; j++) {
          				
          				var value1 = r[j].PROJECT_ID;
          				var value2 = r[j].NOPASS;
          				var value3 = r[j].PASS;
          				for(var k = 0;k<dataArr.length; k++) {
          					
          					if(dataArr[k].PROJECT_ID==value1){
          						dataArr[k].NOPASS=dataArr[k].NOPASS+value2;
          						dataArr[k].PASS=dataArr[k].PASS+value3;
          					}else{
          						continue;
          					}		
          				}        				
          				         				
          			}
          			
          			//拼VERNUM列
          			for(var h = 0;h<dataArr.length; h++) {
          				
          				if(dataArr[h].PASS !=0){
          					
          					dataArr[h].VERNUM=dataArr[h].NOPASS+"/"+dataArr[h].PASS;
          					
          				}else{
          					
          					dataArr[h].VERNUM="0";
          				}          				
          			}	
          		}
      			
      			//每次加载清楚上次统计的数据（放在循环外）dataArr[g].PROJECT_NUM,
              	$("tr[name='projectChangeList']").remove();
              	
              	for(var g = 0;g<dataArr.length; g++){
              		appendprojectChangeTr("ProjectChangetable",g,g+1,dataArr[g].PROJECT_NAME,dataArr[g].STATUS,dataArr[g].REQNUM,dataArr[g].VERNUM,dataArr[g].PLANNUM);
              	}               	
      		}       		
      		
      	},ProjectChangeCall);
		
	}
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> 质量保证  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>	
	//查询项目质量保证
	function initProjectQualityTable(VERSIONS_ID){
		
		var ProjectQualityCall =getMillisecond();
		var queryParams=function(params){
			var temp={
					limit: params.limit, //页面大小
					offset: params.offset //页码
			};
			return temp;
		};
		getCurrentPageObj().find("#ProjectQualitytable").bootstrapTable({
			url : dev_project+"programQuery/queryProjectQualitylist.asp?SID="+SID+"&VERSIONS_ID="+VERSIONS_ID+"&call="+ProjectQualityCall,
			method : 'get', //请求方式（*）   
			striped : false, //是否显示行间隔色
			cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
			sortable : true, //是否启用排序
			sortOrder : "asc", //排序方式
			queryParams : queryParams,//传递参数（*）
			sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
			pagination : true, //是否显示分页（*）
			pageList : [5,10,15],//每页的记录行数（*）
			pageNumber : 1, //初始化加载第一页，默认第一页
			pageSize : 10,//可供选择的每页的行数（*）
			clickToSelect : true, //是否启用点击选中行
			uniqueId : "PROJECT_ID", //每一行的唯一标识，一般为主键列
			cardView : false, //是否显示详细视图
			detailView : false, //是否显示父子表
			jsonpCallback:ProjectQualityCall,
			singleSelect: true,
			onLoadSuccess : function(data){
				gaveInfo();
			},
			columns : [ {
				field : 'Number',
				title : '序号',
				align : "center",
				width : "5%",
				formatter: function (value, row, index) {
					return index+1;
				}
			}, {
			/*	field : "PROJECT_NUM",
				title : "项目编号",
				align : "center",
				width : "13%"
			}, {*/
				field : "PROJECT_NAME",
				title : "项目名称",
				align : "center",
				width : "31%"
			}, {
				field : "STATUS",
				title : "项目状态",
				align : "center",
				width : "16%"
			}, {
				field : "TOTAL",
				title : "不符合项总数",
				align : "center",
				width : "16%"
			}, {
				field : "CLOSED",
				title : "已关闭不符合项个数",
				align : "center", 
				width : "16%"
			}, {
				field : "NOTCLOSED",
				title : "未关闭不符合项个数",
				align : "center",
				width : "16%"
			}]
		},ProjectQualityCall);
		
	}	
//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< 配置审计  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

	//查询项目配置审计
	function initProjectConfigTable(VERSIONS_ID){
		
		var ProjectConfigCall =getMillisecond();
		var queryParams=function(params){
			var temp={
					limit: params.limit, //页面大小
					offset: params.offset //页码
			};
			return temp;
		};
		getCurrentPageObj().find("#ProjectConfigtable").bootstrapTable({
			url : dev_project+"programQuery/queryProjectConfiglist.asp?SID="+SID+"&VERSIONS_ID="+VERSIONS_ID+"&call="+ProjectConfigCall,
			method : 'get', //请求方式（*）   
			striped : false, //是否显示行间隔色
			cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
			sortable : true, //是否启用排序
			sortOrder : "asc", //排序方式
			queryParams : queryParams,//传递参数（*）
			sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
			pagination : true, //是否显示分页（*）
			pageList : [5,10,15],//每页的记录行数（*）
			pageNumber : 1, //初始化加载第一页，默认第一页
			pageSize : 10,//可供选择的每页的行数（*）
			clickToSelect : true, //是否启用点击选中行
			uniqueId : "PROJECT_ID", //每一行的唯一标识，一般为主键列
			cardView : false, //是否显示详细视图
			detailView : false, //是否显示父子表
			jsonpCallback:ProjectConfigCall,
			singleSelect: true,
			onLoadSuccess : function(data){
				gaveInfo();
			},
			columns : [ {
				field : 'Number',
				title : '序号',
				align : "center",
				width : "5%",
				formatter: function (value, row, index) {
					return index+1;
				}
			}, {
				/*field : "PROJECT_NUM",
				title : "项目编号",
				align : "center",
				width : "13%"
			}, {*/
				field : "PROJECT_NAME",
				title : "项目名称",
				align : "center",
				width : "31%"
			}, {
				field : "STATUS",
				title : "项目状态",
				align : "center",
				width : "16%"
			}, {
				field : "TOTAL",
				title : "不符合项总数",
				align : "center",
				width : "16%"
			}, {
				field : "CLOSED",
				title : "已关闭不符合项个数",
				align : "center", 
				width : "16%"
			}, {
				field : "NOTCLOSED",
				title : "未关闭不符合项个数",
				align : "center",
				width : "16%"
			}]
		},ProjectConfigCall);
		
	}


//增加列表行（循环调用）
function appendprojectRiskTr(Table,ID,name,value2,value3,value4,value5,value6,value7){
	var Obj = $("#"+Table);
	var tr = "<tr name='projectRiskList' id='pr"+ID+"'>" 
				+"<td>"+name+"</td>"
				+"<td >" +value2+"</td>"
				+"<td >" +value3+"</td>"
				+"<td >" +value4+"</td>"
				+"<td >" +value5+"</td>"
				+"<td >" +value6+"</td>"
				+"<td >" +value7+"</td>"
			+"</tr>";
	Obj.append(tr);
	
}

//增加列表行（循环调用）
function appendprojectChangeTr(Table,ID,name,value2,value3,value4,value5,value6){
	var Obj = $("#"+Table);
	var tr = "<tr name='projectChangeList' id='ch"+ID+"'>" 
				+"<td>"+name+"</td>"				
				+"<td >" +value2+"</td>"
				+"<td >" +value3+"</td>"
				+"<td >" +value4+"</td>"
				+"<td >" +value5+"</td>"
				+"<td >" +value6+"</td>"
			+"</tr>";
	Obj.append(tr);
	
}

//增加列表行（循环调用）
function appendprojectLi(UI,ID,value1){
	var Obj = $("#"+UI);
	var Li = "<li name='projectLi'><div id='pl"+ID+"' style='font-weight:bold;font-size:10px;color:#c00;'>"+value1+"</div></li>";
	Obj.append(Li);
	
}
/*
//加载里程碑
function openProjectMilestone(id, project_id) {
	getCurrentPageObj().find("#" + id).load("dev_project/projectManage/programQuery/ProjectMilestoneDiv.html", {},
			function() {
		
		initMilestoneList(project_id);
			});
}
//里程碑初始化
function initMilestoneList(project_id){
	
	var themecall = getMillisecond();
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	getCurrentPageObj().find("#milestoneListTab").bootstrapTable(
			{
				//请求后台的URL（*）
				url : dev_planwork
						+ 'Wbs/queryMilestoneByProjectId.asp?project_id='
						+ project_id + "&SID=" + SID + "&call=" + themecall,
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
					$("#milestone_progress").empty();
					for ( var i = 0; i < json.length; i++) {
						var item = json[i];
						var plan_name = item.PLAN_NAME;
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
									"<span class='num'><em class='f-r5'></em><i>" + (i + 1) + "</i></span>" +
									lineCla +
									"<p class='lbg-txt'>" + plan_name + "<span>" + end_time + "</span></p>" +
									"</li>");
						}else{
							$li = $("<li class='" + IsFinish + "' style='width: " + parseInt(90/num) + "%'>" +
									"<span class='num'><em class='f-r5'></em><i>" + (i + 1) + "</i></span>" +
									lineCla +
									"<p class='lbg-txt'>" + plan_name + "<span>" + end_time + "</span></p>" +
									"</li>");
						}
						$li.appendTo(getCurrentPageObj().find("#milestone_progress"));
					}
					
					$Div = $("<div style='clear:both;'></div>");
					$Div.appendTo(getCurrentPageObj().find("#milestone_progress"));
				},
				columns : [ {
					field : '',
					title : '序号',
					align : "center",
					formatter : function(value,row,index){
						return (index + 1);
					}
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


}*/