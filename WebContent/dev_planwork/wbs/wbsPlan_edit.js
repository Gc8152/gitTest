/*********		new		*************/
function initWbs(row){
	var currTab = getCurrentPageObj();
	var project_id = row.PROJECT_ID;
	InitTreeData_add(project_id, row);
	
	//自动获取plan_id
	var autoPlan_id = getPlanId();
	var maxLevel = 3;//最大菜单等级,默认最大为5级
	/**添加根节点*/
	var editingId;//当前编辑id
	/**编辑*/
	var lastEditingId = "0";//最后一次编辑行id
	//显示遮罩层
	startLoading();
	//页面内容收缩
    EciticTitleI();
    //获取参数表中，wbs计划菜单最大等级
    getMaxLevel();
    
    currTab=getCurrentPageObj();
	
	/********** treegrid表格初始化 ***********/
	//初始化表格数据
	function InitTreeData_add(project_id, row){
		var call = getMillisecond();
		var url = dev_planwork + 'Wbs/queryProjectMilestonePlanList.asp?SID=' + SID + "&call=" + call;
		baseAjaxJsonp(url, {project_id : project_id}, function(msg) {
			initTreegrid(msg);
		}, call);
		
		$("#treegridTab_add").attr("project_id",project_id);
		if(row){
			$("#treegridTab_add").attr("project_man",row.PROJECT_MAN_ID);
			$("#treegridTab_add").attr("project_type",row.PROJECT_TYPE);
			$("#treegridTab_add").attr("status",row.STATUS);
			$("#treegridTab_add").attr("title","项目名称：" + row.PROJECT_NAME + "（编号：" + row.PROJECT_NUM + "）");
		}
	}
	/**初始化表格数据*/
	function initTreegrid(jsonDate) {  
		currTab.find('#treegridTab_add').treegrid({  
	    	data : jsonDate,
	        idField:'plan_id',  
	        treeField:'plan_name',  
	        rownumbers:true,//第一列显示序号  
	        fitColumns:false,
	        onDblClickRow:function(row){
	        	edit();
	        },  
	        onLoadSuccess: function(row,data){  
	        	//关闭遮罩层
				endLoading();
				//滚动页面 表格标题固定
				scrollHeadFixed(".wbsPlan_edit");
				
				/*重新给datagrid-view高度*/
	            var mainIframeH=$("#main_iframe").height()*0.68;
	            $(window).resize(function() {
	                mainIframeH=$("#main_iframe").height()*0.68;
	                $(".wbsPlan_edit .datagrid-view").css({"minHeight":mainIframeH,"height":mainIframeH,"maxHeight":mainIframeH});
	            });
	            $(".wbsPlan_edit .datagrid-view").css({"minHeight":mainIframeH,"height":mainIframeH,"maxHeight":mainIframeH});
	            if(data&&data.rows){
					var dataRow=data.rows;
					for(var i=0;i<dataRow.length;i++){
						var tr=$("tr[node-id="+dataRow[i].plan_id+"]");
						if(dataRow[i].type == '01'){
							if(dataRow[i].duty_man_name=="" || dataRow[i].plan_name=="" ){
								tr.find(".datagrid-cell-rownumber").css("color","red");
							}
						}else if (dataRow[i].type == '02'){
							if(dataRow[i].duty_man_name=="" || dataRow[i].plan_name==""  || dataRow[i].is_key_task == ""|| dataRow[i].is_finish_affirm == ""){
								tr.find(".datagrid-cell-rownumber").css("color","red");
							}
						}else {
							if(dataRow[i].duty_man_name=="" || dataRow[i].plan_name=="" || dataRow[i].start_time == "" || dataRow[i].end_time == "" || dataRow[i].task_type == "" || dataRow[i].type == "" || dataRow[i].is_key_task == "" || dataRow[i].is_finish_affirm == ""){
								tr.find(".datagrid-cell-rownumber").css("color","red");
							}
						}
					}
				}
	        }, 
	        frozenColumns :[[
		                {field:'plan_name',title:'名称',resizable : false,editor:"text",width:180,align : 'left',}
			]],
			columns : [[{
				field : 'type',
				title : '类别',
				width : 100,
				resizable : false,
				formatter : typeNameFormatter,
				align : 'center',
				editor : {
					type : 'combobox',
					options : {
						data : P_DIC_PLAN_TYPE,
						valueField : "value",
						textField : "text"
					}
				}
			}, {
				field : 'start_time',
				title : '计划开始日期',
				resizable : false,
				align : 'center',
				editor : { type : 'datebox'},
				width : 105
			}, {
				field : 'end_time',
				title : '计划结束日期',
				resizable : false,
				align : 'center',
				editor : { type : 'datebox'},
				width : 105
			}, {
				field : 'plan_work_day',
				width : 100,
				title : '计划工期（天）',
				resizable : false,
				align : 'center'
			}, {
				field : 'plan_work_hour',
				width : 130,
				title : '计划工作量（小时）',
				resizable : false,
				align : 'center'
			}, {
				field : 'pre_task',
				width : 120,
				title : '前置任务',
				resizable : false,
				align : 'center',
				editor : {
					type : 'text',
				}
			}, {
				field : 'is_key_task',
				width : 95,
				title : '是否关键任务',
				resizable : false,
				formatter : YNFormatter,
				align : 'center',
				editor : {
					type : 'combobox',
					options : {
						data : T_DIC_YN,
						valueField : "value",
						textField : "text"
					}
				}
			}, {
				field : 'duty_man_name',
				title : '责任人',
				resizable : false,
				width : 80,
				align : 'center',
				editor : {
					type : 'text',
				}
			}, {
				field : 'duty_man',
				title : '责任人ID',
				hidden : true,
				align : 'center',
				width : 100,
				editor : {
					type : 'text',
				}
			}, {
				field : 'task_type',
				resizable : false,
				width : 100,
				title : '任务类型',
				formatter : taskTypeNameFormatter,
				align : 'center',
				editor : {
					type : 'combobox',
					options : {
						data : P_DIC_OUTTER_TASK_TYPE,
						valueField : "value",
						textField : "text"
					}
				}
			}, {
				field:'file_id',
				title:'交付物',
				resizable : false,
				editor:{ type: 'text'},
				width:200,align : 'center'
			}, {
				field : 'is_finish_affirm',
				width : 120,
				title : '是否需完成确认',
				resizable : false,
				formatter : YNFormatter,
				align : 'center',
				editor : {
					type : 'combobox',
					options : {
						data : T_DIC_YN,
						valueField : "value",
						textField : "text"
					}
				}
			}, {
				field:'release_status_name',
				resizable : false,
				width : 100,
				title:'状态',
				align : 'center'
			}]]
	    });  
	}
	
	//新建根节点
	currTab.find("#wbsPlan_addRoot").click(function(){
		if (editingId != undefined){  
	        return; 
	    }
		var obj = {
			plan_id : -1*parseInt(autoPlan_id),
			plan_name : '新建阶段',
			type : '01',
			release_status_name : "未发布",
			release_status : "00",
			left : true,
			visible : true,
		};
		currTab.find('#treegridTab_add').treegrid('append', {
			parent : null, 
			data : [ obj ]
		});
		params_data.add.push(currTab.find('#treegridTab_add').treegrid('find', obj.plan_id));
		currTab.find('#treegridTab_add').treegrid('select',obj.plan_id);
		edit();
		autoPlan_id = autoPlan_id + Math.random();
		var chileObj = {  
	     		plan_id: -1*parseFloat(autoPlan_id),
	     		plan_name : '新建里程碑',
	             type : "02",
	             is_key_task : "00",
	             is_finish_affirm : "00",
	             release_status_name : "未发布",
	             release_status : "00",
	             left:true,  
	             visible:true,  
	         }; 
		currTab.find('#treegridTab_add').treegrid('append',{  
	        parent: obj.plan_id, 
	        data: [chileObj]  
	    });  
	    params_data.add.push(currTab.find('#treegridTab_add').treegrid('find', chileObj.plan_id));  
		autoPlan_id = getPlanId();
	});
	
	//新建节点
	currTab.find("#wbsPlan_add").click(function(){
	    var node = currTab.find('#treegridTab_add').treegrid('getSelected');
	    if(node){
	    	var level = currTab.find('#treegridTab_add').treegrid('getLevel',node.plan_id);
	    	if(level == maxLevel){
	    		alert("末级节点不能再添加子节点！");
	    		return;
	    	}
	    	if(node.type == "02"){
	    		alert("里程碑类型不允许添加子节点！");
	    		return;
	    	}
	        var obj = {  
	        		plan_id: -1*parseInt(autoPlan_id),
	                plan_name:'新建菜单', 
	                type : '03',
	                is_key_task : "00",
	                is_finish_affirm : "00",
	                release_status_name : "未发布",
	                release_status : "00",
	                left:true,  
	                visible:true,
	                top_plan_id: node.plan_id,
	                demand_task_id: node.demand_task_id,
	                is_reqtask: "01"
	            }; 
	        //如果是2级阶段，则需要保证里程碑节点在所有工作任务的后边
	        if(level == 1){
	        	var child_row = currTab.find('#treegridTab_add').treegrid('getChildren',node.plan_id);
	        	var milestoneRow = "";
	        	for ( var i = 0; i < child_row.length; i++) {
					if(child_row[i].type == "02"){
						milestoneRow = child_row[i];
					}
				}
	        	if(milestoneRow != ""){
	        		//IE浏览器不兼容这个方法
//	        		$('#treegridTab_add').treegrid('insert',{  
//	                    parent: node.plan_id, 
//	                    before : milestoneRow.plan_id,
//	                    data: [obj]  
//	                });  
	        		currTab.find('#treegridTab_add').treegrid('append',{  
	                    parent: node.plan_id, 
	                    data: [obj]  
	                });  
	        	}else{
	        		currTab.find('#treegridTab_add').treegrid('append',{  
	                    parent: node.plan_id, 
	                    data: [obj]  
	                });  
	        	}
	        }else{
	        	currTab.find('#treegridTab_add').treegrid('append',{  
	                parent: node.plan_id, 
	                data: [obj]  
	            });  
	        }
	        
	        params_data.add.push(currTab.find('#treegridTab_add').treegrid('find', obj.plan_id));  
	        currTab.find('#treegridTab_add').treegrid('select',obj.plan_id);
	    	edit();
	    	autoPlan_id = getPlanId();
	    } else {
	    	alert("请先选择一条数据");
	    }
	});
	
	//删除节点
	currTab.find("#wbsPlan_del").click(function(){
		remove();
	});
	//编辑节点
	currTab.find("#wbsPlan_edit").click(function(){
		edit();
	});
	//取消编辑
	currTab.find("#wbsPlan_edit_cancel").click(function(){
		cancelEdit();
	});
	//保存
	currTab.find("#wbsPlan_save").click(function(){
		saveToDB('01');
	});
	//发布
	currTab.find("#wbsPlan_release").click(function(){
		releaseAll();
	});
	
	currTab.find("#wbsPlan_task_sync").click(function(){
		closeAndOpenInnerPageTab("taskSync_edit","工作任务同步","dev_planwork/taskSync/taskSync_edit.html", function(){
			 initTaskSyncEditLayout(project_id,'edit');
		 });
	});
	/************************/
	function edit(){ 
	    if (editingId != undefined){  
	        save();  
	    }
	    if(lastEditingId == editingId){
			return;
		}
	    
	    var row =currTab.find('#treegridTab_add').treegrid('getSelected');
	    if (row){
	        editingId = row.plan_id; 
	        for (var i = 0; i < P_DIC_PLAN_TYPE.length; i++) {
	            if (P_DIC_PLAN_TYPE[i].text == row.type_name) {
	                  row.type= P_DIC_PLAN_TYPE[i].value;
	            }
	        }
	        currTab.find('#treegridTab_add').treegrid('beginEdit', editingId);  
	    	lastEditingId = row.plan_id;
	    	//点击负责人显示人员POP
	    	var $dutyManName=currTab.find("#treegridTab_add").treegrid("getEditor", {
	            index : row.plan_id,
	            field : "duty_man_name"
	            }).target;
	        $dutyManName.bind('click', function () {
	            $dutyManId =currTab.find("#treegridTab_add").treegrid("getEditor", {
	                  index : row.plan_id,
	                  field : "duty_man"
	              }).target;
	            openUserPop("duty_man_pop",{name:$(this),no:$dutyManId, project_id: project_id});
	        });
	        //阶段，只允许责任人能够编辑，其他字段不允许编辑
	        if(row.type == "01"){
	        	var $type = currTab.find("#treegridTab_add").treegrid("getEditor", {
					index : row.plan_id,
					field : "type",
				}).target.parent();
	        	$type.find(".textbox-addon-right").remove();
	        	$type.find(".textbox-text").css("width","100%").attr("disabled",true);
	        	
	        	var $start_time = currTab.find("#treegridTab_add").treegrid("getEditor", {
					index : row.plan_id,
					field : "start_time",
				}).target.parent();
	        	$start_time.find(".textbox-addon-right").remove();
	        	$start_time.find(".textbox-text").css("width","100%").attr("disabled",true);
	        	
	        	var $end_time = currTab.find("#treegridTab_add").treegrid("getEditor", {
					index : row.plan_id,
					field : "end_time",
				}).target.parent();
	        	$end_time.find(".textbox-addon-right").remove();
	        	$end_time.find(".textbox-text").css("width","100%").attr("disabled",true);
	        	var $task_type = currTab.find("#treegridTab_add").treegrid("getEditor", {
					index : row.plan_id,
					field : "task_type",
				}).target.parent();
	        	$task_type.find(".textbox-addon-right").remove();
	        	$task_type.find(".textbox-text").css("width","100%").attr("disabled",true);
	        	
	        	
	        	var $is_key_task = currTab.find("#treegridTab_add").treegrid("getEditor", {
					index : row.plan_id,
					field : "is_key_task",
				}).target.parent();
	        	$is_key_task.find(".textbox-addon-right").remove();
	        	$is_key_task.find(".textbox-text").css("width","100%").attr("disabled",true);
	        	var $is_finish_affirm = currTab.find("#treegridTab_add").treegrid("getEditor", {
					index : row.plan_id,
					field : "is_finish_affirm",
				}).target.parent();
	        	$is_finish_affirm.find(".textbox-addon-right").remove();
	        	$is_finish_affirm.find(".textbox-text").css("width","100%").attr("disabled",true);
	        	
	        	getCurrentPageObj().find("#treegridTab_add").treegrid("getEditor", {
	        		index : row.plan_id,
	        		field : "pre_task"
				                }).target.attr("disabled",true);
	        	
	        	getCurrentPageObj().find("#treegridTab_add").treegrid("getEditor", {
	        		index : row.plan_id,
	        		field : "file_id"
				                }).target.attr("disabled",true);
	        	
	        }else if(row.type == "02"){
	        	var $type = currTab.find("#treegridTab_add").treegrid("getEditor", {
					index : row.plan_id,
					field : "type",
				}).target.parent();
	        	$type.find(".textbox-addon-right").remove();
	        	$type.find(".textbox-text").css("width","100%").attr("disabled",true);
	        	
	        	var $start_time = currTab.find("#treegridTab_add").treegrid("getEditor", {
					index : row.plan_id,
					field : "start_time",
				}).target.parent();
	        	$start_time.find(".textbox-addon-right").remove();
	        	$start_time.find(".textbox-text").css("width","100%").attr("disabled",true);
	        	
	        	var $end_time = currTab.find("#treegridTab_add").treegrid("getEditor", {
					index : row.plan_id,
					field : "end_time",
				}).target.parent();
	        	$end_time.find(".textbox-addon-right").remove();
	        	$end_time.find(".textbox-text").css("width","100%").attr("disabled",true);
	        	var $task_type = currTab.find("#treegridTab_add").treegrid("getEditor", {
					index : row.plan_id,
					field : "task_type",
				}).target.parent();
	        	$task_type.find(".textbox-addon-right").remove();
	        	$task_type.find(".textbox-text").css("width","100%").attr("disabled",true);
	        }
	        
	        var level = currTab.find('#treegridTab_add').treegrid('getLevel',row.top_plan_id);
	        if(level == 2){
	        	var $task_type = currTab.find("#treegridTab_add").treegrid("getEditor", {
					index : row.plan_id,
					field : "task_type",
				}).target.parent();
	        	$task_type.find(".textbox-addon-right").remove();
	        	$task_type.find(".textbox-text").css("width","100%").attr("disabled",true);
	        }
	        
	      //如果编辑状态下必填项是空，红色背景提示
	        //负责人
	        if($dutyManName.val()=="" && $dutyManName.attr("disabled")!="disabled"){
	            $dutyManName.css("borderColor","red");
	        }
	        //名称
	        var $planName=currTab.find("#treegridTab_add").treegrid("getEditor", {
	            index : row.plan_id,
	            field : "plan_name"
	            }).target;
	        if($planName.val()=="" && $planName.attr("disabled")!="disabled"){
	            $planName.css("borderColor","red");
	        }
	        //类别
	        var $type=currTab.find("#treegridTab_add").treegrid("getEditor", {
	            index : row.plan_id,
	            field : "type"
	            }).target.next("span").children("input").eq(0);
	        if($type.val()=="" && $type.attr("disabled")!="disabled"){
	            $type.css("borderColor","red");
	        }
	        var $isKeyTask=currTab.find("#treegridTab_add").treegrid("getEditor", {
	            index : row.plan_id,
	            field : "is_key_task"
	            }).target.next("span").children("input").eq(0);
	        if($isKeyTask.val()=="" && $isKeyTask.attr("disabled")!="disabled"){
	            $isKeyTask.css("borderColor","red");
	        }
	        //否需完成确认
	        var $isFinishAffirm=currTab.find("#treegridTab_add").treegrid("getEditor", {
	            index : row.plan_id,
	            field : "is_finish_affirm"
	            }).target.next("span").children("input").eq(0);
	        if($isFinishAffirm.val()=="" && $isFinishAffirm.attr("disabled")!="disabled"){
	            $isFinishAffirm.css("borderColor","red");
	        }
	        //计划开始日期
	        var $startTime=currTab.find("#treegridTab_add").treegrid("getEditor", {
	            index : row.plan_id,
	            field : "start_time"
	            }).target.next("span").children("input").eq(0);
	        if($startTime.val()=="" && $startTime.attr("disabled")!="disabled"){
	            $startTime.css("borderColor","red");
	        }
	        //计划结束日期
	        var $endTime=currTab.find("#treegridTab_add").treegrid("getEditor", {
	            index : row.plan_id,
	            field : "end_time"
	            }).target.next("span").children("input").eq(0);
	        if($endTime.val()=="" && $endTime.attr("disabled")!="disabled"){
	            $endTime.css("borderColor","red");
	        }
	        //任务类型
	        var $taskType=currTab.find("#treegridTab_add").treegrid("getEditor", {
	            index : row.plan_id,
	            field : "task_type"
	            }).target.next("span").children("input").eq(0);
	        if($taskType.val()=="" && $taskType.attr("disabled")!="disabled"){
	            $taskType.css("borderColor","red");
	        }
	    } else {
	    	alert("请先选择一条数据");
	    } 
	}
	
	/**保存编辑*/
	function save(){
	    if (editingId != undefined){
	    	var row = currTab.find('#treegridTab_add').treegrid('find', editingId);
	    	currTab.find('#treegridTab_add').treegrid('endEdit', editingId);
	    	var plan_name = row.plan_name;
	    	var type = row.type;
	    	var start_time = row.start_time;
	    	var end_time = row.end_time;
	    	var is_key_task = row.is_key_task;
	    	var is_finish_affirm = row.is_finish_affirm;
	    	var duty_man_name = row.duty_man_name;
	    	var task_type = row.task_type;
	    	var level =currTab.find('#treegridTab_add').treegrid('getLevel',editingId);
	    	
	    	//判断添加阶段时是否合法
	    	if(level > 1 && row.type == "01"){
	    		alert("此处不允许添加阶段！");
	    		row.type = "";
	    		currTab.find('#treegridTab_add').treegrid('select',editingId);
	    		editingId = undefined;
	        	edit();
	        	return false;
	    	}
	    	//判断添加里程碑是否合法
	    	if(row.type == "02"){
	    		if(level != 2){
	    			alert("此处不允许添加里程碑类型！");
	    			row.type = "";
	    			currTab.find('#treegridTab_add').treegrid('select',editingId);
	        		editingId = undefined;
	            	edit();
	            	return false;
	    		}
	    		var top_row = currTab.find('#treegridTab_add').treegrid('getParent',editingId);//获取父节点
	    		var childRow = currTab.find('#treegridTab_add').treegrid('getChildren',top_row.plan_id);
	    		var milestoneTypeArr = new Array();
	    		for ( var i = 0; i < childRow.length; i++) {
					if(childRow[i].type == "02"){
						milestoneTypeArr.push(childRow[i]);
					}
				}
	    		if(milestoneTypeArr.length > 1){
	    			alert("该阶段已经存在里程碑类型，不允许再添加里程碑！");
	    			row.type = "";
	    			currTab.find('#treegridTab_add').treegrid('select',editingId);
	        		editingId = undefined;
	            	edit();
	            	return false;
	    		}
	    	}
	    	//判断添加计划外任务是否合法
	    	if(row.type == "05"){
	    		var top_row = currTab.find('#treegridTab_add').treegrid('getParent',editingId);//获取父节点
	    		if(top_row.type == "01" && top_row.task_type != "13"){
	    			alert("只有计划外阶段才可以添加计划外任务！");
	        		row.type = "";
	        		getCurrentPageObj().find('#treegridTab_add').treegrid('select',editingId);
	        		editingId = undefined;
	            	edit();
	            	return false;
	    		}
	    		if(top_row.type != "01" && top_row.type != "05"){
	    			alert("只有计划外阶段才可以添加计划外任务！");
	        		row.type = "";
	        		currTab.find('#treegridTab_add').treegrid('select',editingId);
	        		editingId = undefined;
	            	edit();
	            	return false;
	    		}
	    	}
	    	
	    	/*if(plan_name == ""){
	    		alert("请填写名称！");
	    		currTab.find('#treegridTab_add').treegrid('select',editingId);
	    		editingId = undefined;
	        	edit();
	    		return false;
	    	}*/
	    	/*if(duty_man_name == ""){
	    		alert("请填写责任人！");
	    		currTab.find('#treegridTab_add').treegrid('select',editingId);
	    		editingId = undefined;
	        	edit();
	        	return false;
	    	}*/
	    	if(row.type != '01'){
	    		/*if(type == ""){
	        		alert("请填写类别！");
	        		currTab.find('#treegridTab_add').treegrid('select',editingId);
	        		editingId = undefined;
	            	edit();
	            	return false;
	        	}*/
	        	/*if(is_key_task == ""){
	        		alert("请填写是否关键任务！");
	        		currTab.find('#treegridTab_add').treegrid('select',editingId);
	        		editingId = undefined;
	            	edit();
	            	return false;
	        	}
	        	if(is_finish_affirm == ""){
	        		alert("请填写是否需完成确认！");
	        		currTab.find('#treegridTab_add').treegrid('select',editingId);
	        		editingId = undefined;
	            	edit();
	            	return false;
	        	}*/
	        	
	    		if(row.type != '02'){
	    			/*if(start_time == ""){
	            		alert("请填写计划开始日期！");
	            		currTab.find('#treegridTab_add').treegrid('select',editingId);
	            		editingId = undefined;
	                	edit();
	                	return false;
	            	}
	            	if(end_time == ""){
	            		alert("请填写计划结束日期！");
	            		currTab.find('#treegridTab_add').treegrid('select',editingId);
	            		editingId = undefined;
	                	edit();
	                	return false;
	            	}
	            	if(task_type == ""){
	            		alert("请填写任务类型！");
	            		currTab.find('#treegridTab_add').treegrid('select',editingId);
	            		editingId = undefined;
	                	edit();
	                	return false;
	            	}*/
	            	var start_time_date = new Date(start_time.replace(/-/g,"/"));
	            	var end_time_date = new Date(end_time.replace(/-/g,"/"));
	            	if(start_time_date > end_time_date){
	            		alert("计划结束日期不能早于计划开始日期！");
	            		currTab.find('#treegridTab_add').treegrid('select',editingId);
	            		editingId = undefined;
	                	edit();
	                	return false;
	            	}
	            	
	            	//修改父节点计划开始结束时间时，必须该父节点的时间包含它所有子节点的时间
	            	var childRowArr = currTab.find('#treegridTab_add').treegrid('getChildren',editingId);
	            	for ( var i = 0; i < childRowArr.length; i++) {
	            		var C_start_time_date = new Date(childRowArr[i].start_time.replace(/-/g,"/"));
	            		var C_end_time_date = new Date(childRowArr[i].end_time.replace(/-/g,"/"));
	            		if(start_time_date > C_start_time_date){
	            			alert("该节点计划开始时间不能晚于子节点计划开始时间！");
	            			currTab.find('#treegridTab_add').treegrid('select',editingId);
	                		editingId = undefined;
	                    	edit();
	                    	return false;
	            		}
	            		if(end_time_date < C_end_time_date){
	            			alert("该节点计划结束时间不能早于子节点计划结束时间！");
	            			currTab.find('#treegridTab_add').treegrid('select',editingId);
	                		editingId = undefined;
	                    	edit();
	                    	return false;
	            		}
	    			}
	            	//添加、修改2级以下子节点计划开始结束时间时，必须子节点开始结束时间在父节点开始结束时间之内
	            	if(level > 2){
	            		var p_row = currTab.find('#treegridTab_add').treegrid('getParent',editingId);//获取父节点
	            		
	            		if(row.start_time==""||row.end_time==""){
	            			alert("开始时间和结束时间不能为空");
	            			editingId = undefined;
            				edit();
            				return false;
	            		} else {
	            			var p_start_time_date = new Date(p_row.start_time.replace(/-/g,"/"));
	            			var p_end_time_date = new Date(p_row.end_time.replace(/-/g,"/"));
	            			if(start_time_date < p_start_time_date){
	            				alert("该节点计划开始时间不能早于父节点计划开始时间！");
	            				getCurrentPageObj().find('#treegridTab_add').treegrid('select',editingId);
	            				editingId = undefined;
	            				edit();
	            				return false;
	            			}
	            			if(end_time_date > p_end_time_date){
	            				alert("该节点计划结束时间不能晚于父节点计划结束时间！");
	            				editingId = undefined;
	            				edit();
	            				return false;
	            			}
	            		}
	            		
	            		if(row.plan_name==""){
	            			alert("计划节点名称不能为空！");
	            			editingId = undefined;
	                    	edit();
	                    	return false;
	            		}
	            		if(row.type==""){
	            			alert("计划节点类型不能为空！");
	            			editingId = undefined;
	                    	edit();
	                    	return false;
	            		}
	            		if(row.type==""){
	            			alert("计划节点类型不能为空！");
	            			editingId = undefined;
	                    	edit();
	                    	return false;
	            		}
	            		if(row.duty_man==""){
	            			alert("责任人不能为空！");
	            			editingId = undefined;
            				edit();
            				return false;
	            		}
	            		if(row.task_type==""){
	            			alert("任务类型不能为空！");
	            			editingId = undefined;
            				edit();
            				return false;
	            		}
	            	}else if(level = 2){
	            		var project_type = currTab.find("#treegridTab_add").attr("project_type");
	            		if(project_type != "SYS_DIC_VERSION_PROJECT"){//“版本项目”类型项目不修改阶段、里程碑时间
	            			//更新阶段的计划开始时间、计划结束时间，更新里程碑的结束时间
	                    	updateParentPlanTime(editingId,start_time, end_time);
	            		}
	            	}
	            	//计算 计划工期、计划工作量
	            	calculationDay(start_time, end_time,row);
	    		}
				
	    	}
	    	
	        if(row.plan_id > 0){
	            params_data.update.push(row);  
	        }
	        editingId = undefined;
	    }  
	    return true;
	}
	
	/**删除*/
	function remove(){  
	    var node = currTab.find('#treegridTab_add').treegrid('getSelected');  
	    if (node){ 
	    	var release_status = node.release_status;
	    	if(release_status != "00"){
	    		alert("任务已发布，不能被删除！");
	    		return;
	    	}
	    	if(node.type == "02"){
	    		alert("里程碑类型不允许被删除！");
	    		return;
	    	}
	    	if(node.type == "01" && node.is_key_task == "00"){
	    		alert("关键任务类型的阶段不允许删除！");
	    		return;
	    	}
	    	if(node.type == "01" && node.task_type == "13"){
	    		alert("计划外阶段不允许被删除！");
	    		return;
	    	}
	    	currTab.find('#treegridTab_add').treegrid('remove', node.plan_id);  
	        if(editingId != undefined && editingId == node.plan_id){  
	            editingId = undefined;  
	        }  
	        if(node.plan_id > 0){
	            params_data.delet.push(node);  
	        }else{  
	            var idx = params_data.add.indexOf(node);
//	            params_data.add.splice(idx, 1);//IE不支持，火狐支持
	            params_data.add.remove(idx);  //火狐不支持，IE支持
	        }  
	    } else {
	    	alert("请先选择一条数据");
	    }
	} 
	/**取消编辑*/
	function cancelEdit(){ 
	    if (editingId != undefined){  
	    	currTab.find('#treegridTab_add').treegrid('cancelEdit', editingId);  
	        editingId = undefined;  
	    }  
	}
	/**保存到数据库*/  
	var params_data = {add: [],update: [],delet: []};  
	function saveToDB(para){ 
	    var flag = save(); 
	    if(!flag){
	    	return;
	    }
	    var req_data = {
	    		add: [],  
	            update: [],  
	            delet: []  
	    };  
	    for(var i=0;i<params_data.add.length;i++){  
	    	delete params_data.add[i].children;
	    	delete params_data.add[i].left;
	    	delete params_data.add[i].visible;
	        delete params_data.add[i].checkState;  
	        delete params_data.add[i].checked;  
	        delete params_data.add[i].state;  
	    }  
	    for(var i=0;i<params_data.update.length;i++){
	    	var start_time = params_data.update[i].start_time;
	    	var end_time = params_data.update[i].end_time;
	    	var plan_work_day = params_data.update[i].plan_work_day;
	    	var plan_work_hour = params_data.update[i].plan_work_hour;
	    	
			req_data.update.push({"plan_id" : "" + params_data.update[i].plan_id + "",
	    		"plan_name":"" + params_data.update[i].plan_name + "",
	    		"type":"" + params_data.update[i].type + "",
	    		"start_time":"" + start_time + "",
	    		"end_time":"" + end_time + "",
	    		"plan_work_day":"" + plan_work_day + "",
	    		"plan_work_hour":"" + plan_work_hour + "",
	    		"pre_task":"" + params_data.update[i].pre_task + "",
	    		"is_key_task":"" + params_data.update[i].is_key_task + "",
	    		"is_finish_affirm":"" + params_data.update[i].is_finish_affirm + "",
	    		"duty_man":"" + params_data.update[i].duty_man + "",
	    		"task_type":"" + params_data.update[i].task_type + "",
	    		"file_id":"" + params_data.update[i].file_id + ""
	    		});
	    }  
	    for(var i=0;i<params_data.delet.length;i++){  
	        req_data.delet.push(params_data.delet[i].plan_id); 
	    }  
	    req_data.add = params_data.add;//JSON.stringify(params_data.add);  
	    req_data.update = req_data.update;//JSON.stringify(req_data.update);
	    req_data.delet = req_data.delet;//JSON.stringify(req_data.delet); 
	    var project_id = getCurrentPageObj().find("#treegridTab_add").attr("project_id");
	    var call = getMillisecond();
		var url = dev_planwork
		+ 'Wbs/saveProjectMilestonePlan.asp?SID=' + SID + "&call=" + call;
		baseAjaxJsonp(url,
				 {
			req_data : JSON.stringify(req_data),
			project_id : project_id
			  },function(msg){
				  if(msg.result=="true"){				
						params_data = {add: [],update: [],delet: []};
						 var project_id = getCurrentPageObj().find("#treegridTab_add").attr("project_id");
	                     if(para == '01'){
	                    	 alert("保存成功");
	    					 InitTreeData_add(project_id);
	                     }else{
	                    	 toReleaseAll();//提交保存后，执行发布
	                     }
						 
					}else{
						alert("系统异常，请稍后！");
					}
		},call);
	}  

	//是否将所有未发布的任务改为已发布
	function releaseAll(){
		if(confirm("是否保存并发布？")==true)
			{
				saveToDB("02");//提交保存后执行发布
				
			}else{
				return;
			}
	}
	//执行发布
	function toReleaseAll(){
		currTab.find('#treegridTab_add').treegrid("selectAll");
		var row = currTab.find('#treegridTab_add').treegrid("getSelections");
		var plan_idArr = new Array();
		if(row.length > 0){
			var j=0;
			for (var i = 0; i < row.length; i++) {
				var plan_id = row[i].plan_id;
				var release_status = row[i].release_status;
				if(release_status == '00'){
					plan_idArr.push(plan_id);
					j++;
				}
			}
			if(j > 0){
				var project_id = currTab.find("#treegridTab_add").attr("project_id");
				var project_status = currTab.find("#treegridTab_add").attr("status");
				var call = getMillisecond();
				var url = dev_planwork
				+ 'Wbs/releaseProjectMilestonePlan.asp?SID=' + SID + "&call=" + call;
				baseAjaxJsonp(url,
						 {
					plan_idArr : plan_idArr,
					project_status : project_status,
					project_id : project_id
					  },function(msg){
						  if(msg.result=="true"){				
								alert("发布成功！");
								var project_id = getCurrentPageObj().find("#treegridTab_add").attr("project_id");
								InitTreeData_add(project_id);
							}else{
								alert("系统异常，请稍后！");
							}
				},call);
			}else{
				alert("没有需要发布的任务！");
			}
		}else{
			alert("没有需要发布的任务！");
		}
	}
	/************************/
	
	//获取参数表中，wbs计划菜单最大等级
	function getMaxLevel(){
		
		baseAjax('SConfig/queryConByConfCode.asp',{
			conf_code : "wbs_max_level"
		},function(data){
			maxLevel = data.CONF_VALUE;
		});
	}


	//初始化类别名称下拉框
	function typeNameFormatter(value,row,index){
		if (value == 0) {  
	        return;  
	    }
		for (var i = 0; i < P_DIC_PLAN_TYPE.length; i++) {
	        if (P_DIC_PLAN_TYPE[i].value == value) {  
	            return P_DIC_PLAN_TYPE[i].text;  
	        }  
	    }  
	}
	//初始化任务类型下拉框
	function taskTypeNameFormatter(value,row,index){
		if (value == "") {  
	        return;  
	    }
		for (var i = 0; i < P_DIC_OUTTER_TASK_TYPE.length; i++) {
	        if (P_DIC_OUTTER_TASK_TYPE[i].value == value) {  
	            return P_DIC_OUTTER_TASK_TYPE[i].text;  
	        }  
	    }  
	}

	//初始化"是否"下拉框
	function YNFormatter(value,row,index){
		if(value == ""){
			return;
		}
		for (var i = 0; i < T_DIC_YN.length; i++) {
	        if (T_DIC_YN[i].value == value) {  
	            return T_DIC_YN[i].text;  
	        }  
	    } 
	}
	
	/**获取plan_id*/
	function getPlanId(){
		var call = getMillisecond();
		var url = dev_planwork
		+ 'Wbs/getPlanIdBySeq.asp?SID=' + SID + "&call=" + call;
		baseAjaxJsonp(url,
				 {
			  },function(msg){
				  if(msg.result=="true"){				
					  autoPlan_id = msg.plan_id;
					}else{
						alert("系统异常，请稍后！");
					}
		},call,false);
		return autoPlan_id;
	};
	
	/*****************/

	/**有开始时间，结束时间计算工期（天）*/
	function calculationDay(start_time, end_time,row) {
		var call = getMillisecond();
		var url = dev_planwork + 'Wbs/calculationDay.asp?SID=' + SID
				+ "&call=" + call;
		baseAjaxJsonp(url, {
			start_time : start_time,
			end_time : end_time
		}, function(msg) {
			if (msg.result == "true") {
				var plan_work_day = msg.plan_work_day;
				var plan_work_hour = plan_work_day * 8;
				row.plan_work_day = plan_work_day;
				row.plan_work_hour = plan_work_hour;
				currTab.find('#treegridTab_add').treegrid('refreshRow',row.plan_id);
			} else {
				alert("系统异常，请稍后！");
			}
		}, call,false);
	}

	//更新阶段的计划开始时间，计划结束时间，更新里程碑的结束时间
	function updateParentPlanTime(plan_id,start_time,end_time){
		var row = currTab.find('#treegridTab_add').treegrid('getParent',plan_id);//获取阶段
		if(row){
			var chuildRow = currTab.find('#treegridTab_add').treegrid('getChildren',row.plan_id);
			var minStartTime = start_time;
			var maxEndTime = end_time;
			if(chuildRow.length > 2){
				var minStartTime_date = new Date(minStartTime.replace(/-/g,"/"));
				var maxEndTime_date = new Date(maxEndTime.replace(/-/g,"/"));
				for ( var i = 0; i < chuildRow.length; i++) {
					var start_time_date = new Date(chuildRow[i].start_time.replace(/-/g,"/"));
		        	var end_time_date = new Date(chuildRow[i].end_time.replace(/-/g,"/"));
					if(chuildRow[i].type != "02"){
						if(start_time_date < minStartTime_date){
			        		minStartTime = chuildRow[i].start_time;
			        	}
			        	if(end_time_date > maxEndTime_date){
			        		maxEndTime = chuildRow[i].end_time;
			        	}
					}
				}
			}
			//更新阶段的计划开始时间，计划结束时间
			row.start_time = minStartTime;
			row.end_time = maxEndTime;
			calculationDay(minStartTime, maxEndTime,row);
			if(row.plan_id > 0){
	            params_data.update.push(row);  
	        }
			currTab.find('#treegridTab_add').treegrid('refreshRow',row.plan_id);
			//更新里程碑的结束时间
			for ( var i = 0; i < chuildRow.length; i++) {
				if(chuildRow[i].type == "02"){
					chuildRow[i].end_time = maxEndTime;
					if(chuildRow[i].plan_id > 0){
			            params_data.update.push(chuildRow[i]);
			        }
					currTab.find('#treegridTab_add').treegrid('refreshRow',chuildRow[i].plan_id);
				}
			}
		}
	}
	/*****************/
	
	//导入WBS计划，选择文件
	function importWbsData(){
		if (editingId != undefined){
			alert("请结束编辑后再导入模板！");
	        return; 
	    }
	    var node =currTab.find('#treegridTab_add').treegrid('getSelected');
	    if(node){
	    	var plan_id = node.plan_id;
	    	var level = currTab.find('#treegridTab_add').treegrid('getLevel',plan_id);
	    	if(level == "5"){
	    		alert("末级节点不能再添加子节点！");
	    		return;
	    	}
	    	if(node.type == "02"){
	    		alert("里程碑类型不允许添加子节点！");
	    		return;
	    	}
	    	if(plan_id < 0){
	    		alert("请先提交，再导入模板！");
	    		return;
	    	}
	    	currTab.find("#fileForm").find("[name='plan_id']").val(plan_id);
	    	var project_id =currTab.find("#treegridTab_add").attr("project_id");
	    	currTab.find("#fileForm").find("[name='project_id']").val(project_id);
	    }else{
	    	alert("请选择父节点！");
	    	return;
	    }
	    
		//触发 文件选择的click事件  
	    currTab.find("#importFile").trigger("click");  
	}
	//导入WBS计划
	function getFilePath(){
		var fileName = currTab.find("#importFile").val();
		fileName=fileName.substring(fileName.lastIndexOf(".")+1,fileName.length);
		if(fileName != "xlsx" && fileName != "xls" && fileName != "mpp"){
			alert("导入文件只能为xlsx,xls,mpp格式,请重新选择");
			return;
		}
		if(!checkFileSize("importFile")){
			alert("不能上传大小为0k或者10M以上的附件,请重新选择！");
	    	return;
		}
		
		var call = getMillisecond();
		var url;
		if(fileName == "xlsx" || fileName == "xls"){
			url = dev_planwork
			+ 'Wbs/importWbsData.asp?SID=' + SID + "&call=" + call;
		}else{
			url = dev_planwork
			+ 'Wbs/importProjectData.asp?SID=' + SID + "&call=" + call;
		}
		
		currTab.find('#fileForm').form({
			    url:url,
			    onSubmit: function(){
					
			    },
			    success:function(data){
//			    	alert("导入成功！");
		    		var project_id = getCurrentPageObj().find("#treegridTab_add").attr("project_id");
	                InitTreeData_add(project_id);
	                
//			    	alert(data.toString());
//			    	if(data.result == "true"){
//			    		alert("导入成功！");
//			    		var project_id = $("#treegridTab_add").attr("project_id");
//	                    InitTreeData_add(project_id);
//			    	}else{
//			    		alert("导入失败！");
//			    	}
			    }
			});
		currTab.find("#submitFile").trigger("click");
	}
	//验证文件大小
	function checkFileSize(fileupload){
		var  browserCfg = {};  
	     var ua = window.navigator.userAgent; 
	     var filesize = 0;
	     var obj_file = document.getElementById(fileupload);
	     if (ua.indexOf("MSIE")>=1){  
	         browserCfg.ie = true;  
	     }else if(ua.indexOf("Firefox")>=1){  
	         browserCfg.firefox = true;  
	     }else if(ua.indexOf("Chrome")>=1){  
	         browserCfg.chrome = true;  
	     }  
	     if(browserCfg.firefox || browserCfg.chrome ){  
	         filesize = obj_file.files[0].size;  
	     }else if(browserCfg.ie){  
	    	 var fso = new ActiveXObject("Scripting.FileSystemObject");
	    	 filesize=fso.GetFile(obj_file.value).size;
	     }else{  
	         alert("您的浏览器暂不支持计算上传文件的大小!");  
	         return;  
	     } 
	     if(filesize>0){
	    	 return true;
	     }else if(filesize/1024/1024>10){
	    	 return false;
	     }else{
	    	 return false;
	     }
	}
	//导出WBS
	function exportWBS(){
		var project_id = currTab.find("#treegridTab_add").attr("project_id");
		var project_man = currTab.find("#treegridTab_add").attr("project_man");
		var call = getMillisecond();
		var url = dev_planwork
		+ 'Wbs/exportWBS.asp?SID=' + SID + "&call=" + call;
		baseAjaxJsonp(url,
				 {
			project_id : project_id,
			project_man : project_man
			  },function(msg){
//				  if(msg.result=="true"){				
//						alert("导出成功！");
//					}else{
//						alert("系统异常，请稍后！");
//					}
		},call);
	}
}