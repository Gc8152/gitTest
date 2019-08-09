
function initprojectEditBtn(item){
	var currTab = getCurrentPageObj();		//该方法可以获取当前显示的页面对象，通过这个对象可以避免与其他页面的id重复问题
	var table = currTab.find("#table_proDemand");//获取选择的项目需求单
	
	var btableCall = getMillisecond()+"1";
	autoInitSelect(currTab.find("#table_info"));
	var PROJECT_TYPE = currTab.find("select[name='PROJECT_TYPE']");
	PROJECT_TYPE.empty();
	
	var arr = "SYS_DIC_VERSION_PROJECT,SYS_DIC_REQUIREMENT_ANALYSIS_PROJECT,SYS_DIC_URGENT_PROJECT,SYS_DIC_ANNUAL_TASK_PROJECT";
	initSelect(PROJECT_TYPE,{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"SYS_DIC_MILESTONE_PROJECT_TYPE"},null,null,arr);
	
	/**初始化按钮开始**/	
	
	
	//选择应用
	currTab.find("#SYSTEM_NAME").click(function(){
		//选择应用
		var $SYSTEM_NAME = currTab.find("[name='SYSTEM_NAME']");
		var $SYSTEM_ID= currTab.find("[name='SYSTEM_ID']");
		var $PROJECT_MAN_ID= currTab.find("[name='PROJECT_MAN_ID']");
		var $PROJECT_MAN_NAME= currTab.find("[name='PROJECT_MAN_NAME']");
		openSystemPop1(currTab.find("#sendProduceSystemPop"),{
			name : $SYSTEM_NAME,
			id  : $SYSTEM_ID,
			system_man_id:$PROJECT_MAN_ID,
			system_man_name:$PROJECT_MAN_NAME
		});
	});
	
			
	
	/**
	 * 初始化部门下拉框开始
	 */
	//项目业务部门
	currTab.find("#reqAdd_org_name").click(function(){
			$(".drop-ztree").hide();
			openSelectTreeDiv($(this),"reqAdd_tree_id","SOrg/queryOrgTreeWithCenterList.asp",{"margin-top": "2px",width:"88%"},function(node){
				currTab.find("#reqAdd_org_name").val(node.name);
				currTab.find("#BUSINESS_DEP_ID_reqAdd").val(node.id);
				currTab.find("reqAdd_tree_id").hide();
			});
		});	
    //项目实施部门		
	currTab.find("#reqPutAdd_org_name").click(function(){
			$(".drop-ztree").hide();
			openSelectTreeDiv($(this),"reqPutAdd_tree_id","SOrg/queryOrgTreeWithCenterList.asp",{"margin-top": "2px",width:"88%"},function(node){
				currTab.find("#reqPutAdd_org_name").val(node.name);
				currTab.find("#IMPL_DEP_ID_reqAdd").val(node.id);
				currTab.find("#reqPutAdd_tree_id").hide();
			});
		});

	/**
	 * 初始化部门下拉框结束
	 */
	/**
	 * 子表渲染开始
	 */
	//为增加进度安排添加点击事件
	var opt_order = getCurrentPageObj().find("[tb='realOptTable']").bootstrapTable('getData').length;
	var url=dev_project+"draftPro/queryScheduleById.asp?"+"SID=" + SID + "&call=" + btableCall + "&DEFECT_ID="+null;
	//增加进度安排
	currTab.find("[name='addOpt']").click(function(){
		var optInfo = {};
		opt_order = opt_order + 1;
		optInfo["BEGIN_TIME"] = "";
		optInfo["END_TIME"] = "";
		optInfo["SCHEDULE_CONTENT"] = "";
		var tableDate = getCurrentPageObj().find("[tb='realOptTable']").bootstrapTable('getData');
		var num = tableDate.length;
		getCurrentPageObj().find("[tb='realOptTable']").bootstrapTable('endAllEditor');
		getCurrentPageObj().find("[tb='realOptTable']").bootstrapTable('append',optInfo);
		getCurrentPageObj().find("[tb='realOptTable']").bootstrapTable('beginEditor',num);
	});
	initRealOptTable(url);

	//增加协作部门
	var dep_order = getCurrentPageObj().find("[tb='depTable']").bootstrapTable('getData').length;
	var dep_url=dev_project+"draftPro/queryDepartmentById.asp?"+"SID=" + SID + "&call=" + btableCall + "&DEFECT_ID="+null;
	currTab.find("[name='addDep']").click(function(){
		var depInfo = {};
		dep_order = dep_order + 1;
		depInfo["DEPARTMENT_NAME"] = "";
		depInfo["DEPARTMENT_MAN"] = "";
		depInfo["DEPARTMENT_PHONE"] = "";
		depInfo["DEP_ORDER"] = dep_order;
		var tableDate = getCurrentPageObj().find("[tb='depTable']").bootstrapTable('getData');
		var num = tableDate.length;
		getCurrentPageObj().find("[tb='depTable']").bootstrapTable('endAllEditor');
		getCurrentPageObj().find("[tb='depTable']").bootstrapTable('append',depInfo);
		getCurrentPageObj().find("[tb='depTable']").bootstrapTable('beginEditor',num);
	});
	initDepTable(dep_url);
	
	//增加项目经费来源预算
	var source_order = getCurrentPageObj().find("[tb='sourceTable']").bootstrapTable('getData').length;
	var source_url=dev_project+"draftPro/queryBudgetById.asp?"+"SID=" + SID + "&call=" + btableCall + "&DEFECT_ID="+null;
	currTab.find("[name='addSource']").click(function(){
		var sourceInfo = {};
		source_order = source_order + 1;
		sourceInfo["BUDGET_SOURCE"] = "";
		sourceInfo["BUDGET_NUMBER"] = "";
		sourceInfo["SOURCE_ORDER"] = source_order;
		var tableDate = getCurrentPageObj().find("[tb='sourceTable']").bootstrapTable('getData');
		var num = tableDate.length;
		getCurrentPageObj().find("[tb='sourceTable']").bootstrapTable('endAllEditor');
		getCurrentPageObj().find("[tb='sourceTable']").bootstrapTable('append',sourceInfo);
		getCurrentPageObj().find("[tb='sourceTable']").bootstrapTable('beginEditor',num);
	});
	initSourceTable(source_url);
	
	
	/**
	 * 子表渲染结束
	 */
	
	
	//保存
	var save = currTab.find("#save_project");
	save.click(function(){		
		var tableVal = currTab.find("#table_demandInfo");
		if(!vlidate(currTab,"",true)&&tableVal.find("")){
			return ;
		}				
		initsave(false);
	});
	//保存并提交
	var submit = currTab.find("#submit_project");
	submit.click(function(){
		if(!vlidate(currTab,"",true)){
			return ;
		}	
		initsave(true);
	});
	//返回
	var back = currTab.find("#back_project");
	back.click(function(){
		closeCurrPageTab();
	});
	//选择项目类型时触发的事件
	var protype = currTab.find("select[name=PROJECT_TYPE]");
	protype.bind('change', function(e) {
		var typeval = currTab.find("select[name=PROJECT_TYPE]").val();
		if(typeval=="SYS_DIC_INFO_DISCUSS_PROJECT"){
			currTab.find("select[name=PROJECT_SCALE]").prop("disabled",true);
			currTab.find("select[name=PROJECT_SCALE]").val("");
			currTab.find("select[name=PROJECT_SCALE]").select2();
			
		}else if(typeval=="SYS_DIC_NEW_PROJECT"){
			currTab.find("select[name=PROJECT_SCALE]").prop("disabled",false);
			table.bootstrapTable("removeAll");
		}
		else{
			currTab.find("select[name=PROJECT_SCALE]").prop("disabled",false);
		}
	});
	function initsave(isCommit){
		
		//getCurrentPageObj().find("[tb='realOptTable']").bootstrapTable('getData')
		var param = {};
		var projectInfo = currTab.find("#projectInfo");
		var inputs = projectInfo.find("input");
		var selects = projectInfo.find("select");
		var textareas = projectInfo.find("textarea");
		var hiddens = projectInfo.find("hidden");
		for (var i = 0; i < inputs.length; i++) {
			var obj = $(inputs[i]);
			param[obj.attr("name")] = $.trim(obj.val());
		}
		for (var i = 0; i < selects.length; i++) {
			var obj = $(selects[i]);
			param[obj.attr("name")] = $.trim(obj.val());
		}
		for (var i = 0; i < textareas.length; i++) {
			var obj = $(textareas[i]);
			param[obj.attr("name")] = $.trim(obj.val());
		}
		for (var i = 0; i < hiddens.length; i++) {
			var obj = $(hiddens[i]);
			param[obj.attr("name")] = $.trim(obj.val());
		}
		
		param["IS_COMMIT"]=isCommit;
		//新增项目时项目类型为新建应用项目
		param["PROJECT_TYPE"]="SYS_DIC_NEW_PROJECT";
		param["STATUS"]="06";
		/**
		 * param添加协作部门子表信息以及进度安排信息
		 */
		//进度安排
		currTab.find("[tb='realOptTable']").bootstrapTable('endAllEditor');
		
		var tableDate = currTab.find("[tb='realOptTable']").bootstrapTable('getData');	
		if(0 == tableDate.length){
			param["SCHE_OPT"] = '';
		}else{
			var count = 1;
			var scheOpt = new Array();
			for( var k=0; k <tableDate.length; k++){
				if(tableDate[k].BEGIN_TIME==''||tableDate[k].END_TIME==''||tableDate[k].SCHEDULE_CONTENT==''){
				
					alert("请添加完整的进度安排！");
					return;
				}
				scheOpt.push({"OPT_ORDER":count,"BEGIN_TIME":tableDate[k].BEGIN_TIME,
							"END_TIME":tableDate[k].END_TIME,"SCHEDULE_CONTENT":tableDate[k].SCHEDULE_CONTENT});
				count++;
			}
			param["SCHE_OPT"] = JSON.stringify(scheOpt);
		}
		//协作部门
		currTab.find("[tb='depTable']").bootstrapTable('endAllEditor');
		var depTableDate = currTab.find("[tb='depTable']").bootstrapTable('getData');
		if(0 == depTableDate.length){
			param["DEP_OPT"] = '';
		}else{
			var count = 1;
			var depOpt = new Array();
			for( var k=0; k <depTableDate.length; k++){
				if(depTableDate[k].DEPARTMENT_NAME==''||depTableDate[k].DEPARTMENT_MAN==''||depTableDate[k].DEPARTMENT_PHONE==''){
					alert("请添加完整的协作部门！");
					return;
				}
				depOpt.push({"OPT_ORDER":count,"DEPARTMENT_ID":depTableDate[k].DEPARTMENT_ID,"DEPARTMENT_NAME":depTableDate[k].DEPARTMENT_NAME,
							"DEPARTMENT_MAN":depTableDate[k].DEPARTMENT_MAN,"DEPARTMENT_PHONE":depTableDate[k].DEPARTMENT_PHONE});
				count++;
			}
			param["DEP_OPT"] = JSON.stringify(depOpt);
		}
		//经费预算
		currTab.find("[tb='sourceTable']").bootstrapTable('endAllEditor');
		var sourceTableDate = currTab.find("[tb='sourceTable']").bootstrapTable('getData');
		if(0 == sourceTableDate.length){
			param["SOURCE_OPT"] = '';
		}else{
			var count = 1;
			var sourceOpt = new Array();
			for( var k=0; k <sourceTableDate.length; k++){
				if(sourceTableDate[k].BUDGET_SOURCE==''||sourceTableDate[k].BUDGET_NUMBER==''){
					alert("请添加完整的经费来源预算！");
					return;
				}
				sourceOpt.push({"OPT_ORDER":count,"BUDGET_SOURCE":sourceTableDate[k].BUDGET_SOURCE,
							"BUDGET_NUMBER":sourceTableDate[k].BUDGET_NUMBER});
				count++;
			}
			param["SOURCE_OPT"] = JSON.stringify(sourceOpt);
		}
		/**
		 *  param添加协作部门子表信息以及进度安排信息结束
		 */
		var call = getMillisecond();		
		baseAjaxJsonp(dev_project+"draftPro/editDraftPro.asp?call="+call+"&SID="+SID,param, function(data){
			if (data != undefined && data != null && data.result=="true" ) {
	       		alert(data.msg);
	       		closeCurrPageTab();
			}else{ 
				alert(data.msg);
			}
		}, call);
	}
	
	//修改时的赋值
	if(item){
		for (var key in item) {
			currTab.find("input[name="+key+"]").val(item[key]);
			currTab.find("select[name="+key+"]").val(item[key]);
			currTab.find("textarea[name="+key+"]").val(item[key]);		
		}
		if(item.PROJECT_TYPE=="02"){
			currTab.find("select[name=PROJECT_SCALE]").prop("disabled",true);
		}
		initSelect(currTab.find("select[name='PROJECT_SCALE']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"P_DIC_PROJECT_SCALE"},item.PROJECT_SCALE);
		initSelect(currTab.find("select[name='PROJECT_TYPE']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"SYS_DIC_MILESTONE_PROJECT_TYPE"},item.PROJECT_TYPE,null,arr);
		initScheduleTable(item.DRAFT_ID);
		initDepartmentTable(item.DRAFT_ID);
		initBudgetTable(item.DRAFT_ID);
		
		table.bootstrapTable("refresh",{
			url:dev_project+"draftPro/queryListDraftDemandOrder.asp?SID="+SID+'&DRAFT_ID='+item.DRAFT_ID});
								
	} 
	
	/**初始化按钮结束**/
	
	/**项目经理模态框开始**/
	//点击打开模态框
	var pm_name = currTab.find("input[name=PM_NAME]");
	pm_name.click(function(){
		openPmPop(currTab.find("#choosePm"),{Zpm_id:currTab.find("input[name=PM_ID]"),Zpm_name:currTab.find("input[name=PM_NAME]")});
	});
	
	/**项目经理模态框结束**/
	
}
//修改时回填进度安排
function initScheduleTable(DRAFT_ID){
		baseAjaxJsonpNoCall(dev_project+"draftPro/queryScheduleById.asp?PROJECT_ID="+DRAFT_ID, null, function(data) {
			if(data){
				$.each(data.rows,function(k,v){
					getCurrentPageObj().find("[tb='realOptTable']").bootstrapTable('append',v);
				});
			}
		});
	
}
//修改时回填协作部门列表
function initDepartmentTable(DRAFT_ID){
	baseAjaxJsonpNoCall(dev_project+"draftPro/queryDepartmentById.asp?PROJECT_ID="+DRAFT_ID, null, function(data) {
		if(data){
			$.each(data.rows,function(k,v){
				getCurrentPageObj().find("[tb='depTable']").bootstrapTable('append',v);
			});
		}
	});

}
//修改时回填项目经费来源预算
function initBudgetTable(DRAFT_ID){
	baseAjaxJsonpNoCall(dev_project+"draftPro/queryBudgetById.asp?PROJECT_ID="+DRAFT_ID, null, function(data) {
		if(data){
			$.each(data.rows,function(k,v){
				getCurrentPageObj().find("[tb='sourceTable']").bootstrapTable('append',v);
			});
		}
	});

}


//进度安排
function initRealOptTable(url){
	var realOptCall = getMillisecond()+'1';
	getCurrentPageObj().find("[tb='realOptTable']").bootstrapTable("destroy").bootstrapTable({
		url : url,
		method : 'get', // 请求方式（*）
		striped : false, // 是否显示行间隔色
		cache : false, // 是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
		sortable : true, // 是否启用排序
		sortOrder : "asc", // 排序方式
		sidePagination : "server", // 分页方式：client客户端分页，server服务端分页（*）
		pagination : false, // 是否显示分页（*）
		clickToSelect : false, // 是否启用点击选中行
		// height: 460, //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
		uniqueId : "nid", // 每一行的唯一标识，一般为主键列
		cardView : false, // 是否显示详细视图
		detailView : false, // 是否显示父子表
		singleSelect : false,// 复选框单选
		//TODO
		rowAttributes:function(row){
			return "height='200''";
		},
		jsonpCallback:realOptCall,
		//jsonpCallback:getMillisecond(),
		onDblClickRow:function(row){
		},onLoadSuccess : function(data){
			gaveInfo();
		},onClickRow: function(row,tr) {
			var nid=tr.find("a[nid]").attr("nid");
			getCurrentPageObj().find("[tb='realOptTable']").bootstrapTable('beginEditor',{"nid":nid});
		},onPostBody :function(data){
			var bootData = getCurrentPageObj().find("[tb='realOptTable']").bootstrapTable("getData");
			var inputs = getCurrentPageObj().find("[tb='realOptTable']").find("input");
			inputs.unbind("change").bind("change", function(e){
				var index = $(this).attr("index");
				var bootrow = bootData[index];
				bootrow[$(this).attr("name")] = $(this).val();
			});
		},
		columns : [ {
			field : 'SCHEDULE_ID',
			title : '序号',
			align : "center",
			width : "50px",
			formatter:function(value,row,index){
				return index + 1;
			}
		}, {
			field : "BEGIN_TIME",
			title : "开始时间<a style='color:red'>*</a>",
			align : "center",
			edit:{
				type:"text",
				validate:"true",
				click:function(){WdatePicker({});}
			}
		}, {
			field : "END_TIME",
			title : "结束时间<a style='color:red'>*</a>",
			align : "center",
			edit:{
				type:"text",
				click:function(){WdatePicker({});}
			}
		}, {
			field : "SCHEDULE_CONTENT",
			title : "实施内容和目标<a style='color:red'>*</a>",
			align : "center",
			edit:{
				type:"textarea"				
			}
		}, {
			field :	"SCHEDULE_ID",
			title :	"操作",
			align : "center",
			width : "10%",
			formatter: function (value, row, index) {
				if(!row.nid){
					row.nid=Math.Random19()+"ID";
				}
				//return "<a style='color:blue'  href='javascript:void(0)' onclick=deleteOpt('"+row.OPT_ORDER+"')>删除</a>" ;
			
				return "<a style='color:blue'  href='javascript:void(0)' nid='"+row.nid+"' onclick=deleteOpt('"+row.nid+"')>删除</a>" ;}
		}
		]
	});
}
//初始化协作部门列表
function initDepTable(dep_url){
	var realOptCall = getMillisecond()+'1';
	getCurrentPageObj().find("[tb='depTable']").bootstrapTable("destroy").bootstrapTable({
		url : dep_url,
		method : 'get', // 请求方式（*）
		striped : false, // 是否显示行间隔色
		cache : false, // 是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
		sortable : true, // 是否启用排序
		sortOrder : "asc", // 排序方式
		sidePagination : "server", // 分页方式：client客户端分页，server服务端分页（*）
		pagination : false, // 是否显示分页（*）
		clickToSelect : false, // 是否启用点击选中行
		// height: 460, //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
		uniqueId : "did", // 每一行的唯一标识，一般为主键列
		cardView : false, // 是否显示详细视图
		detailView : false, // 是否显示父子表
		singleSelect : false,// 复选框单选
		
		jsonpCallback:realOptCall,
		//jsonpCallback:getMillisecond(),
		onDblClickRow:function(row){
		},onLoadSuccess : function(data){
			gaveInfo();
		},onClickRow: function(row,tr) {
			var did=tr.find("a[did]").attr("did");
			getCurrentPageObj().find("[tb='depTable']").bootstrapTable('beginEditor',{"did":did});
		},onPostBody :function(data){
			var bootData = getCurrentPageObj().find("[tb='depTable']").bootstrapTable("getData");
			var inputs = getCurrentPageObj().find("[tb='depTable']").find("input");
			inputs.unbind("change").bind("change", function(e){
				var index = $(this).attr("index");
				var bootrow = bootData[index];
				bootrow[$(this).attr("name")] = $(this).val();
			});
		},
		columns : [ {
			field : 'PROJECT_DEPARTMENT_ID',
			title : '序号',
			align : "center",
			width : "50px",
			formatter:function(value,row,index){
				return index + 1;
			}
		},{
			field : "DEPARTMENT_NAME",
			title : "部门名称<a style='color:red'>*</a>",
			align : "center",
			name  : "DEPARTMENT_NAME",
			edit:{
				type :"text",
				attr :"id='dep_org_name' name='DEPARTMENT_NAME'",
				click:function(row,html){
					$(".drop-ztree").hide();
					openSelectTreeDiv(html,"dep_tree_id","SOrg/queryOrgTreeWithCenterList.asp",{"margin-top": "2px",width:"88%"},function(node){
						html.val(node.name);
						row.DEPARTMENT_ID=node.id;
						getCurrentPageObj().find("#dep_tree_id").hide();
					});
				}
			}
		}, {
			field : "DEPARTMENT_MAN",
			title : "部门联系人<a style='color:red'>*</a>",
			align : "center",
			edit:{
				type:"text"
			}
		}, {
			field : "DEPARTMENT_PHONE",
			title : "部门联系电话<a style='color:red'>*</a>",
			align : "center",
			edit:{
				type:"text"
			}
		}, {
			field :	"DEP_ORDER",
			title :	"操作",
			align : "center",
			width : "10%",
			formatter: function (value, row, index) {
				if(!row.did){
					row.did=Math.Random19()+"ID";
				}											
				return "<a style='color:blue'  href='javascript:void(0)' did='"+row.did+"' onclick=deleteDep('"+row.did+"')>删除</a>" ;
			}
		}
		]
	});
}


//初始化项目经费来源预算
function initSourceTable(source_url){
	var realOptCall = getMillisecond()+'1';
	getCurrentPageObj().find("[tb='sourceTable']").bootstrapTable("destroy").bootstrapTable({
		url : source_url,
		method : 'get', // 请求方式（*）
		striped : false, // 是否显示行间隔色
		cache : false, // 是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
		sortable : true, // 是否启用排序
		sortOrder : "asc", // 排序方式
		sidePagination : "server", // 分页方式：client客户端分页，server服务端分页（*）
		pagination : false, // 是否显示分页（*）
		clickToSelect : false, // 是否启用点击选中行
		// height: 460, //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
		uniqueId : "did", // 每一行的唯一标识，一般为主键列
		cardView : false, // 是否显示详细视图
		detailView : false, // 是否显示父子表
		singleSelect : false,// 复选框单选
		
		jsonpCallback:realOptCall,
		//jsonpCallback:getMillisecond(),
		onDblClickRow:function(row){
		},onLoadSuccess : function(data){
			gaveInfo();
		},onClickRow: function(row,tr) {
			var did=tr.find("a[did]").attr("did");
			getCurrentPageObj().find("[tb='sourceTable']").bootstrapTable('beginEditor',{"did":did});
		},onPostBody :function(data){
			var bootData = getCurrentPageObj().find("[tb='sourceTable']").bootstrapTable("getData");
			var inputs = getCurrentPageObj().find("[tb='sourceTable']").find("input");
			inputs.unbind("change").bind("change", function(e){
				var index = $(this).attr("index");
				var bootrow = bootData[index];
				bootrow[$(this).attr("name")] = $(this).val();
			});
		},
		columns : [ {
			field : 'BUDGET_ID',
			title : '序号',
			align : "center",
			width : "50px",
			formatter:function(value,row,index){
				return index + 1;
			}
		}, {
			field : "BUDGET_SOURCE",
			title : "科目<a style='color:red'>*</a>",
			align : "center",
			edit:{
				type:"text"
			}
		}, {
			field : "BUDGET_NUMBER",
			title : "预算<a style='color:red'>*</a>",
			align : "center",
			edit:{
				type:"text"
			}
		}, {
			field :	"DEP_ORDER",
			title :	"操作",
			align : "center",
			width : "10%",
			formatter: function (value, row, index) {
				if(!row.did){
					row.did=Math.Random19()+"ID";
				}											
				return "<a style='color:blue'  href='javascript:void(0)' did='"+row.did+"' onclick=deleteSource('"+row.did+"')>删除</a>" ;
			}
		}
		]
	});
}



//删除进度安排子列
function deleteOpt(opt_order){
	getCurrentPageObj().find("[tb='realOptTable']").bootstrapTable('endAllEditor');
	getCurrentPageObj().find("[tb='realOptTable']").bootstrapTable('removeByUniqueId', opt_order);
}
//删除协作部门子列
function deleteDep(dep_order){
	getCurrentPageObj().find("[tb='depTable']").bootstrapTable('endAllEditor');
	getCurrentPageObj().find("[tb='depTable']").bootstrapTable('removeByUniqueId', dep_order);	
}
//删除项目经费来源预算
function deleteSource(source_order){
	getCurrentPageObj().find("[tb='sourceTable']").bootstrapTable('endAllEditor');
	getCurrentPageObj().find("[tb='sourceTable']").bootstrapTable('removeByUniqueId', source_order);	
}

function initDate(){
	WdatePicker({
			dateFmt : 'yyyy-MM-dd',
			minDate : '1990-01-01',
			maxDate : '2050-12-01'
	});
}

initVlidate(getCurrentPageObj());

//页面内容收缩
$(function(){
      EciticTitleI();
});
