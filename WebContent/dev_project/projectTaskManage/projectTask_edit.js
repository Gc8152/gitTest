var fsCall = getMillisecond() + '1';//功能点
function codeTask(seles){
	var project_id = seles.PROJECT_ID;
	var $page = getCurrentPageObj();//当前页
	var ststCall = getMillisecond() + '3';//统计
	var call = getMillisecond() + '4';
	autoInitSelect($page);//初始化下拉选
	var $prjShow = $page.find("#project_tab");
	var $taskShow = $page.find("#reqtask_tab");
	//TODO
	initRefresh();//刷新初始化页面
	function initRefresh(){
		$prjShow.show();
		$taskShow.hide();
		initZtree();//初始化ZTREE
		initFuncSplitTable();//初始化开发任务列表
	}
	
	//初始化树结构
	function initZtree(){
		var zNodes = new Array();
		var setting = {  
	            view: {
	                selectedMulti: false //禁止多点选中  
	            },	            
	            async:{dataType:"application/json"},

	            data: {
	                simpleData: {
	                    enable:true,  
	                    idKey: "ID",  
	                    pIdKey: "PID",  
	                    rootPId: "",
	                    formatterNodeName:function(node){
	                    	return node.name;
	                    } 
	                }  
	            },  
	            callback: {
	                onClick: function(event,treeId,treeNode) {
	                	var lev = treeNode.level;
	                		if(lev == '1'){//点击需求任务
		                		$taskShow.show();
		                		$prjShow.hide();
		                		$page.find("#L2").show();
		                		$page.find("#L3").hide();
		                		$page.find("#L4").hide();
		                		$page.find("#L5").hide();
		                		//$page.find("[vie='LL']").hide();
		                		$page.find(".tab-pane").removeClass("active");
		                		$page.find("#func_point_split").addClass("active");
		                		$page.find("li").removeClass("active");
		                		$page.find("#L2").addClass("active");
		                		initTask(treeId,treeNode);
		                	}else if(lev == '0'){//点击根节点
		                		$prjShow.show();
		                		$taskShow.hide();	                		
		                	}
 	                }
	            }
	        };  
		
		baseAjaxJsonp(dev_project+'projectTaskManager/queryAnalyzeTree.asp?PROJECT_ID='+project_id+'&call='+call+'&SID='+SID,null,function(data) {
			if (data != undefined && data != null && data.result=="true") {
				var task = data.analyzeTree;
				if(task != null && task.length > 0) {
					for(var i = 0;i<task.length; i++) {
          				var arr={"ID":task[i].ID,
          						"PID":task[i].PID,
          						"name":task[i].NAME,
          						"task_id":task[i].TASK_ID,
          						"func_num":task[i].FUNC_NUM};
						zNodes.push(arr);
					}
				}
				var treeObj = $.fn.zTree.init($("#treeTestTask"),setting, zNodes);
				var node = treeObj.getNodeByParam("ID", project_id, null);
				treeObj.expandNode(node);
				//treeObj.expandAll(true);//默认展开或折叠全部节点
			}else{
				alert("查询失败");
			}
		},call);
		
	}//初始化树结构END
		
	//点击需求任务页面
	function initTask(treeId,treeNode){
		
		//初始化需求基本信息
		initReqInfo(treeNode.ID,null);
		//测试功能点表刷新
		refreshFuncTable(treeNode.task_id);
		var task_id=treeNode.task_id;
		//新增开发任务的点击事件
		$page.find("button[name='func_add']").unbind("click").click(function(){
			var system_id = $page.find("#T_SYSTEM_NO").text();
			var system_name = $page.find("#T_SYSTEM_NAME").text();
			//TODO
			var T_REQ_TASK_ID= $page.find("#T_REQ_TASK_ID").text();
			//新增开发任务 打开L3页签
			$page.find("#L3").show();
			$page.find("#L3").addClass("active");
			$page.find("#L2").removeClass("active");
			$page.find(".tab-pane").removeClass("active");
			$page.find("#add_task").addClass("active");
			var projectInfo = getCurrentPageObj().find("#addTask_table");
			var inputs = projectInfo.find("input");
			var selects = projectInfo.find("select");
			var textareas = projectInfo.find("textarea");
			var hiddens = projectInfo.find("hidden");
			inputs.val("");
			textareas.val("");
			selects.val("");
			hiddens.val("");
			add_task_Pop({ SYSTEM_ID: system_id,SYSTEM_NAME: system_name,TYPE:"add",
									PROJECT_ID:project_id,REQ_TASK_ID:T_REQ_TASK_ID,TASK_NUM: treeNode.ID});
		});

		//修改按钮
		$page.find("button[name='func_edit']").unbind("click").click(function(){
			var seles = $page.find("[tb='funcSplitTable']").bootstrapTable("getSelections");
			if(seles.length==0 ||seles.length>1){
				alert("请选择一条数据修改!");
				return;
			}
			if(seles[0].TASK_STATE!=01){
				alert("该任务已发布，不能修改！");
				return;
			}
			var system_id = $page.find("#T_SYSTEM_NO").text();
			var system_name = $page.find("#T_SYSTEM_NAME").text();
			var task_id= $page.find("#T_REQ_TASK_ID").text();
			//新增开发任务 打开L3页签
			$page.find("#L3").show();
			$page.find("#L3").addClass("active");
			$page.find("#L2").removeClass("active");
			$page.find(".tab-pane").removeClass("active");
			$page.find("#add_task").addClass("active");
			add_task_Pop({ SYSTEM_ID: system_id,SYSTEM_NAME: system_name,
									TYPE:"update",	
									SELES:seles[0],
									PROJECT_ID:project_id,				
									REQ_TASK_ID:task_id,
									TASK_NUM: treeNode.ID});		
		});	
		
		//发布	
		$page.find("button[name='func_changeState']").unbind("click").click(function(){
			var seles = $page.find("[tb='funcSplitTable']").bootstrapTable("getSelections");
			if(seles.length==0 ||seles.length>1){
				alert("请选择一条数据发布!");
				return;
			}
			//TODO判断状态，已提交的不能修改
			if(seles[0]["TASK_STATE"]!="01"){
				alert("该任务已发布！");	
				return;
			}
			nconfirm("确定发布？",function(){
				var task_id= $page.find("#T_REQ_TASK_ID").text();
				var params = {};
				for(var val in seles[0]){
					params[val]=seles[0][val];
				}
				params["TASK_STATE"]="02";
				params["TYPE"]="update";
				var saveCall = getMillisecond() + '3';
				baseAjaxJsonp(dev_project+"projectTaskManager/saveAddTask.asp?SID=" + SID + "&call=" + saveCall+"&params="+params, params, function(data) {
					if(data && data.result=="true"){
						alert("发布成功");
						getCurrentPageObj().find("[tb='funcSplitTable']").bootstrapTable('refresh',{						
					url:dev_project+"projectTaskManager/queryQeqByTask.asp?SID=" + SID + "&call=" + fsCall +"&REQ_TASK_ID="+task_id});
						
					}else{
						alert(data.msg);
					}
				},saveCall,false);
			});				

		});	
		//转发：更改执行人
		$page.find("button[name='func_changeExecutor']").unbind("click").click(function(){
			var seles = $page.find("[tb='funcSplitTable']").bootstrapTable("getSelections");
			if(seles.length==0 ||seles.length>1){
				alert("请选择一条数据转发!");
				return;
			}		
			var system_id = $page.find("#T_SYSTEM_NO").text();
			var system_name = $page.find("#T_SYSTEM_NAME").text();
			var task_id= $page.find("#T_REQ_TASK_ID").text();
			//改派开发任务 打开L5页签
			$page.find("#L5").show();
			$page.find("#L5").addClass("active");
			$page.find("#L2").removeClass("active");
			$page.find(".tab-pane").removeClass("active");
			$page.find("#change_task").addClass("active");
			change_task_Pop({ SYSTEM_ID: system_id,SYSTEM_NAME: system_name,
									TYPE:"update",	
									SELES:seles[0],
									PROJECT_ID:project_id,				
									REQ_TASK_ID:task_id,
									TASK_NUM: treeNode.ID});	
		});	
		
		//导入开发任务列表
		//getCurrentPageObj().find("button[name='func_upload']").unbind("click").click(function(){
			importExcel.initImportExcel($page.find("button[name='func_upload']"),"开发任务信息","sfile/downloadFTPFile.asp?id=m_052","projectTask/importTest.asp?PROJECT_ID="+project_id+"&REQ_TASK_ID="+task_id,function(msg){
				if(msg&&msg.result=="false"){
					var error_info=msg.error_info;
					if(error_info&&error_info.length<200){
						alert(msg.error_info||"导入失败！");
					}else{
						alert("导入失败！"+'<div style="display:none;">'+error_info+'</div>');
					}
				}else if(msg&&msg.result=="true"){
					alert("导入成功!");
					getCurrentPageObj().find("[tb='funcSplitTable']").bootstrapTable('refresh',{						
						url:dev_project+"projectTaskManager/queryQeqByTask.asp?SID=" + SID + "&call=" + fsCall +"&REQ_TASK_ID="+task_id});
				}else{
					alert("导入失败!未知错误");
				}
			});
		//});
		
		
	}
	
	//查询需求信息及功能点信息
	function initReqInfo(task_num,func_id){
		var reqCall = getMillisecond();
		baseAjaxJsonp(dev_project+"projectTaskManager/queryReqInfo.asp?SID=" + SID + "&call=" + reqCall + "&TASK_NUM="+task_num + "&FUNC_ID="+func_id, null, function(data) {
			if (data != undefined && data != null && data.result=="true") {
				var reqinfo = data.reqinfo;
				if(reqinfo != null && reqinfo.length > 0) {
		            for(var k in reqinfo[0]){
		            	$page.find("#T_"+k).text(reqinfo[0][k]);
		            	if(k == 'SYSTEM_NAME'){
		            		$page.find("#F_"+k).text(reqinfo[0][k]);
		            	}
		            	if(k == 'REQ_CODE'){
		            		file_id = reqinfo[0][k];
		            	} 
		            }
				}
			}else{
				alert("数据异常");
			}
		},reqCall,false);
	}
	//删除开发任务
	$page.find("button[name='func_delete_btn']").unbind("click").click(function(){

		var rows = getCurrentPageObj().find("[tb='funcSplitTable']").bootstrapTable("getSelections");
		if(rows.length==0){
			alert("请选择一条数据删除!");
			return;
		}
		if(rows[0].TASK_STATE=="02"){
			alert("该任务已发布，不可删除！");
			return;
		}
		if(rows.length>0){
			var ids = "";
			for(var i = 0;i<rows.length;i++){
				ids += "," + rows[i].P_TASK_ID;
			}
			ids = ids.substring(1);
			deleteFunc(rows[0].REQ_TASK_ID,ids,rows);
		}		
	});
	
	//查看开发任务详情
	//查看
	$page.find("button[name='func_show']").unbind("click").click(function(){
		var seles =  $page.find("[tb='funcSplitTable']").bootstrapTable("getSelections");
		if(seles.length!=1){
			alert("请选择一条数据进行查看!");
			return;
		}
		$page.find("[name=SH_ACTUAL_STARTTIME]").text("");
		$page.find("[name=SH_ACTUAL_ENDTIME]").text("");
		$page.find("[name=SH_TASK_DESC]").text("");
		$page.find("[name=SH_DELAY_REASON]").text("");
		for(var item in seles[0]){
			$page.find("[name=SH_"+item+"]").text(seles[0][item]);
		}
		$page.find("#L4").show();
		$page.find("#L4").addClass("active");
		$page.find("#L2").removeClass("active");
		$page.find(".tab-pane").removeClass("active");
		$page.find("#show_task").addClass("active");
	});
	
	//关闭
	$page.find("#close_task").unbind("click").click(function(){
		$page.find("#L2").show();
		$page.find("#L4").hide();
		$page.find("#L2").addClass("active");
		$page.find("#L4").removeClass("active");
		$page.find(".tab-pane").removeClass("active");
		$page.find("#func_point_split").addClass("active");	
		
	});
	
	//根据需求任务编号查询开发任务列表
	function initFuncSplitTable(){
		$page.find("[tb='funcSplitTable']").bootstrapTable({
			url : dev_project+"projectTaskManager/queryQeqByTask.asp?SID=" + SID + "&call="+ fsCall + "&REQ_TASK_ID=",
			method : 'get', // 请求方式（*）
			striped : false, // 是否显示行间隔色
			cache : false, // 是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
			sortable : true, // 是否启用排序
			sortOrder : "asc", // 排序方式
			sidePagination : "server", // 分页方式：client客户端分页，server服务端分页（*）
			pagination : true, // 是否显示分页（*）
			pageList : [ 5, 10, 15 ], // 可供选择的每页的行数（*）
			pageNumber : 1, // 初始化加载第一页，默认第一页
			pageSize : 5, // 每页的记录行数（*）
			clickToSelect : true, // 是否启用点击选中行
			// height: 460, //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
			uniqueId : "P_TASK_ID", // 每一行的唯一标识，一般为主键列
			cardView : false, // 是否显示详细视图
			detailView : false, // 是否显示父子表
			singleSelect : false,// 复选框单选
			jsonpCallback:fsCall,
			onDblClickRow : function(row){
			},onLoadSuccess : function(data){
				gaveInfo();
			},onPostBody :function(data){
			},
			onAll: function(name,args) {
				$page.find("[tb='funcSplitTable']").find("span[name=view_file]").click(function(){
					var index = $(this).attr("index");
					var rowObj = $page.find("[tb='funcSplitTable']").bootstrapTable('getData')[index];
					var spans = view_modal.find("span");
					for(var i=0; i<spans.length; i++){
						var span_name = $(spans[i]).attr("name");
						$(spans[i]).html(rowObj[span_name]);
					}
					view_modal.modal('show');
				});		
			},
			columns : [{
				 field: 'middle',
				 checkbox: true,
				 rowspan: 1,
				 align: 'center',
				 valign: 'middle'
			}, {
				field : "TASK_NAME",
				title : "任务名称",
				align : "center"
			}, {
				field : "TASK_TYPE_NAME",
				title : "任务类型",
				align : "center"
			}, {
				field : "TASK_STATE_NAME",
				title : "任务状态",
				align : "center"
			}, {
				field : "TASK_LEVEL_NAME",
				title : "任务优先级",
				align : "center"
			}, {
				field : "EXECUTOR_NAME",
				title : "执行人",
				align : "center"
			},{
				field : "PLAN_STARTTIME",
				title : "计划开始时间",
				align : "center"
			},{
				field : "PLAN_ENDTIME",
				title : "计划完成时间",
				align : "center"
			},{
				field : "ACTUAL_STARTTIME",
				title : "实际开始时间",
				align : "center"
			},{
				field : "ACTUAL_ENDTIME",
				title : "实际完成时间",
				align : "center"
			}]
		});
	}
}
//开发任务刷新
function refreshFuncTable(task_id){
	id = getCurrentPageObj().find("#T_REQ_TASK_ID");
	getCurrentPageObj().find("[tb='funcSplitTable']").bootstrapTable('refresh',{
			//url:dev_project+"projectTaskManager/queryQeqByTask.asp?SID=" + SID + "&call=" + fsCall +"&TASK_NUM="+task_num});
	url:dev_project+"projectTaskManager/queryQeqByTask.asp?SID=" + SID + "&call=" + fsCall +"&REQ_TASK_ID="+task_id});
	
}
//删除测试功能点
function deleteFunc(task_num,task_id,rows){
	nconfirm("确定删除？",function(){
	baseAjaxJsonpNoCall(dev_project+"projectTaskManager/delByTaskId.asp?P_TASK_ID="+task_id, null, function(data){
		if (data != undefined && data != null && data.result=="true") {
			alert(data.msg);
			getCurrentPageObj().find("[tb='funcSplitTable']").bootstrapTable('refresh',{
				url:dev_project+"projectTaskManager/queryQeqByTask.asp?SID=" + SID + "&call=" + fsCall +"&REQ_TASK_ID="+task_num});
			//refreshFuncTable(task_num);//更新表			
		}else{
			alert("数据异常");
			//initRefresh();//刷新初始化页面
		}
	},false);
	});
}
initVlidate(getCurrentPageObj());