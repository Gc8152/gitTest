function initProblemHandleLayout(row){//传过来的一行数据
	var currTab=getCurrentPageObj();  //获取当前页面对象
	//赋值
	for(var key in row){
		if (key=="PROJECT_NUM") {
			currTab.find("#PROJECT_NUM").html(row[key]);
		}else if (key=="PROJECT_NAME") {
			currTab.find("#PROJECT_NAME").html(row[key]);
		}else if (key=="PROJECT_ID") {
			currTab.find("#PROJECT_ID").val(row[key]);
		}
	}
	var PROJECT_ID=currTab.find("#PROJECT_ID").val();
	var PROJECT_TYPE = currTab.find("#PROJECT_TYPE").val();
	//var form = currTab.find("#problem_basic_table");
	//----------------------------------------------------------------------项目基本信息--tb1分割线
	initMyProjectQuenyOne();//项目基本信息的查找
	function initMyProjectQuenyOne(){
		$("#wbsPlanSelect_li").hide();
		var call =getMillisecond();
		baseAjaxJsonp(dev_project+"myProject/queryOnemyProject.asp?call="+call+"&SID="+SID+"&PROJECT_ID="+PROJECT_ID, null, function(result){

			if (result != undefined && result != null) {
				for(var i in result){
					currTab.find("div[name="+i+"]").html(result[i]);
					currTab.find("input[name="+i+"]").val(result[i]);
				}
			}else{
				alert("初始化项目基本信息失败!");
			}
		},call);
		
	}
	
	//返回
	currTab.find("#back_problemInfo").click(function(){
		closeCurrPageTab();
	});
	//项目基本信息
	currTab.find("#projectInfo").click(function(){
		$("#wbsPlanSelect_li").hide();
	});
	//----------------------------------------------------------------------项目人员管理--tb2分割线
	var ProjectManInt=0;
	currTab.find("#ProjectManInt_li").click(function(){
		$("#wbsPlanSelect_li").hide();
		if(ProjectManInt<1){
			$.getScript("dev_project/myProject/projectMan/projectMan_queryList.js",function(){
				  initProjectManInfo(row);
				  ProjectManInt++;
				});
		}
	});
	//----------------------------------------------------------------------项目WBS--tab3分割线
	var wbsPlanInt=0;
	currTab.find("#wbsPlan").click(function(){
		$("#wbsPlanSelect_li").show();
		if(wbsPlanInt<1){
			tab3Layout(PROJECT_ID,PROJECT_TYPE);
		wbsPlanInt++;
		}
	});
	//----------------------------------------------------------------------风险--tab4分割线
	var Risk_managerInt=0;
	currTab.find("#Risk_manager").click(function(){
		$("#wbsPlanSelect_li").hide();
		if(Risk_managerInt<1){
			initRiskQuestionLayout(PROJECT_ID);
			Risk_managerInt++;
		}
	});
	//----------------------------------------------------------------------质量不符合项--tab5分割线
	var quality_managerInt=0;
	currTab.find("#quality_manager").click(function(){
		$("#wbsPlanSelect_li").hide();
		if(quality_managerInt<1){
		initQualityManageListLayout(PROJECT_ID);
		quality_managerInt++;
		}
	});
	//----------------------------------------------------------------------配置不符合项--tb6分割线
	var config_managerInt=0;
	currTab.find("#config_manager").click(function(){
		$("#wbsPlanSelect_li").hide();
		if(config_managerInt<1){
		initPQConfigManageListLayout(PROJECT_ID);
		config_managerInt++;
		}
	});
	//----------------------------------------------------------------------项目变更--tb7分割线
	var project_changeInt=0;
	currTab.find("#project_change_li").click(function(){
		$("#wbsPlanSelect_li").hide();
		if(project_changeInt<1){
			initproChangeInfo(row);
			project_changeInt++;
		}
	});
	//----------------------------------------------------------------------项目结项申请--tb8分割线
	var project_endInt=0;
	currTab.find("#project_end_li").click(function(){
		$("#wbsPlanSelect_li").hide();
		if(project_endInt<1){
			var call = getMillisecond();
		    var PROJECT_ID = row.PROJECT_ID;
		    baseAjaxJsonp(dev_project+"myProject/queryOneProEnd.asp?call="+call+"&SID="+SID,{"PROJECT_ID":PROJECT_ID}, function(data){
		    	var endInfo=data.row;
		    	if (endInfo.length!=0) {
		       		initprojectEndApplyInfo(row,endInfo[0]);
				}else{
					initprojectEndApplyInfo(row,null);
				}
			}, call);
			project_endInt++;
		}
	});
	




//tab3  项目WBS  js--------------------------------------------------
function  tab3Layout(project_id,project_type){
	
	$("#treegridTab_add").attr("project_id",project_id);
	currTab.find("#tab3").empty();
	$( "#tab3" ).load( "dev_planwork/wbs/wbsPlan_edit.html", function() {
		InitTreeData_add(project_id);
		});
	
	$("#wbsPlan_view").bind("change",function(){
		var viewVal = $(this).val();
		currTab.find("#tab3").empty();
		if(viewVal == "01"){
			$( "#tab3" ).load( "dev_planwork/wbs/wbsPlan_edit.html", function() {
				InitTreeData_add(project_id);
				});
		}else if(viewVal == "02"){
			$( "#tab3" ).load( "dev_planwork/wbs/wbsPlan_track.html", function() {
				InitTreeData_track(project_id);
				});
		}else if(viewVal == "03"){
			$( "#tab3" ).load( "dev_planwork/wbs/wbsPlan_show.html", function() {
				InitTreeData_show(project_id);
				});
		}else if(viewVal == "04"){
			$( "#tab3" ).load( "dev_planwork/wbs/wbsPlan_milestone.html", function() {
				queryMilestoneList(project_id);
				});
		}
		
	});
	
	
	/*$("#treegridTab_add").attr("project_id",project_id);
	$.getScript("dev_planwork/wbs/wbsPlan_edit.js",function(){
		  InitTreeData_add(project_id);
		});*/
}


//tab4  风险js--------------------------------------------------

function initRiskQuestionLayout(PROJECT_ID){
	var currTab = getCurrentPageObj();
	
	var form = currTab.find("#riskQuestionManage_query");
	var table = currTab.find("#riskQuestionManage_table");
	var call = getMillisecond();
	
	var commit = currTab.find("#commit");
	
	var firstSelect = form.find("select[name=FIRST_CLASSIFY]");
	firstSelect.bind('change',function(){
		var obj = form.find("select[name=SECOND_CLASSIFY]");
		var type = firstSelect.val();
		obj.empty();
		if(type=='01'){
			initSelect(obj,{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"P_DIC_RISK_TYPE2"},"", "","09,10,11,12,13");
		} else if(type='02'){
			initSelect(obj,{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"P_DIC_RISK_TYPE2"},"", "","01,02,03,04,05,06,07,08");
		}
	});
	
	//查询操作
	commit.click(function(){
		inittablerisk();
	});
	//重置按钮
	var reset = currTab.find("#reset");
	reset.click(function(){
		form[0].reset();
		currTab.find("select").select2();
	});
	
	/**		初始化按钮跳转	**/
	/*新建*/
	var riskManage_add = currTab.find("#riskManage_add");
	riskManage_add.click(function(){
		/*var rows = table.bootstrapTable('getSelections');
		if(rows.length!=1){
			alert("请选择一条数据进行修改!");
			return ;
		}*/
		openInnerPageTab("MyProjectriskQuestionManage_add","新建风险问题","dev_project/myProject/riskQuestionManage/riskQuestionManage_add.html",function(){
			initRiskQuestionSaveLayout(PROJECT_ID);
		});
	});
	/*风险跟踪*/
	var riskManage_follow = currTab.find("#riskManage_follow");
	riskManage_follow.click(function(){
		var rows = table.bootstrapTable('getSelections');
		if(rows.length!=1){
			alert("请选择一条数据进行跟踪!");
			return ;
		}
		var status =rows[0].RISK_STATUS; 
		if(status!='05' && status!='06' &&status!='04'){
			openInnerPageTab("MyProjectriskManage_follow","风险跟踪","dev_project/myProject/riskQuestionManage/riskQuestionManage_record.html",function(){
				initRiskQuestionRecordLayout(rows[0].RISK_ID, rows[0].FIRST_CLASSIFY);
			});
		} else {
			alert("请选择一条非处理完状态的数据进行跟踪!");
			return ;
		}
	});
	/*风险验证*/
	var riskManage_validate = currTab.find("#riskManage_validate");
	riskManage_validate.click(function(){
		var rows = table.bootstrapTable('getSelections');
		if(rows.length!=1){
			alert("请选择一条数据进行验证!");
			return ;
		}
		var status =rows[0].RISK_STATUS; 
		if(status=='04'){
			openInnerPageTab("MyProjectriskManage_validate","风险验证","dev_project/myProject/riskQuestionManage/riskQuestionRecord_validate.html",function(){
				initRiskQuestionValidateLayout(rows[0].RISK_ID, rows[0].FIRST_CLASSIFY, rows[0].RISK_STATUS);
			});
		} else {
			alert("请选择一条待验证状态的数据进行验证!");
			return ;
		}
	});
	/*风险详情*/
	var riskManage_queryInfo = currTab.find("#riskManage_queryInfo");
	riskManage_queryInfo.click(function(){
		var rows = table.bootstrapTable('getSelections');
		if(rows.length!=1){
			alert("请选择一条数据进行验证!");
			return ;
		}
		var status =rows[0].RISK_STATUS;
		openInnerPageTab("MyProjectriskManage_queryInfo","风险详情","dev_project/myProject/riskQuestionManage/riskQuestionManage_detail.html",function(){
			initRiskQuestionDetailLayout(PROJECT_ID,rows[0].RISK_ID, rows[0].FIRST_CLASSIFY);
		});
		/*var rows = table.bootstrapTable('getSelections');
		if(rows.length!=1){
			alert("请选择一条数据进行修改!");
			return ;
		}
		newOpenTab("configManage","配置管理","dev_project/myProject/configManage/configManage_qeryList.html",function(){
			initLayout(rows);
		});*/
	});
inittablerisk();
function inittablerisk(){
	/**		初始化table	**/
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	var param = form.serialize();
	table.bootstrapTable("destroy").bootstrapTable({
		//请求后台的URL（*）
		url : dev_project+"riskQuestionManage/queryListProjectRisk.asp?SID="+SID+"&call="+call+"&PROJECT_ID="+PROJECT_ID+"&"+param,
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
		uniqueId : "RISK_ID", //每一行的唯一标识，一般为主键列
		cardView : false, //是否显示详细视图
		jsonpCallback : call,
		detailView : false, //是否显示父子表
		singleSelect: true,
		columns : [ {
			field: 'middle',
			checkbox: true,
			rowspan: 2,
			align: 'center',
			valign: 'middle'
		},{
			field : 'aa',
			title : '序号',
			align : "center",
			formatter : function(value, row, index){
				return index+1;
			}
		}, {
			field : "flag",
			title : "标识",
			align : "center"
		}, {
			field : "RISK_FROM_ID",
			title : "风险出处",
			align : "center"
		}, {
			field : "RISK_DESC",
			title : "风险描述",
			align : "center"
		}, {
			field : "FIRST_CLASSIFY_NAME",
			title : "一级分类",
			align : "center"
		}, {
			field : "SECOND_CLASSIFY_NAME",
			title : "二级分类",
			align : "center"
		}, {
			field : "PRIORITY_NAME",
			title : "优先级",
			align : "center"
		}, {
			field : "RISK_GRADE_NAME",
			title : "风险级别",
			align : "center"
		}, {
			field : "DUTY_USER_NAME",
			title : "责任人",
			align : "center"
		}, {
			field : "RISK_STATUS_NAME",
			title : "风险状态",
			align : "center"
		}, {
			field : "PRESENT_TIME",
			title : "提出日期",
			align : "center"
		}, {
			field : "CLOSE_DATE",
			title : "关闭日期",
			align : "center"
		}]
	});
}	
	autoInitSelect(form);
	
	//initSelect(form.find("select[name=RISK_STATUS]"),[{01,02}],param,default_v,preStr)
	
}

//tab5  质量不符合项js--------------------------------------------------
function initQualityManageListLayout(id){
	
	var currTab = getCurrentPageObj();
	
	currTab.find("input[name=PROJECT_ID]").val(id);
	
	var form = currTab.find("#qualityManage_query");
	
	var table = currTab.find("#qualityManage_table");
	autoInitSelect(form);//初始化下拉框
	/*查询*/
	var commit = currTab.find("#commit");
	commit.click(function(){
		var param = form.serialize();
		table.bootstrapTable('refresh',{url:dev_project+'quality/queryListQuality.asp?call='+call+'&SID='+SID+"&"+param});
	});
	enterEventRegister(getCurrentPageObj().attr("class"), function(){getCurrentPageObj().find("#commit").click();});
	/*重置*/
	var reset = currTab.find("#reset");
	reset.click(function(){
		form[0].reset();
		currTab.find("select").select2();
	});
	
	/*导入*/
	var qualityManage_import = currTab.find("#qualityManage_import");
	qualityManage_import.click(function(){
		openInnerPageTab("myqualityManage_import","导入不符合项","dev_project/myProject/qualityManage/qualityManage_import.html",function(){
			initQualityManageImportLayout(id);
		});
	});
	
	/*新增*/
	var qualityManage_add = currTab.find("#qualityManage_add");
	qualityManage_add.click(function(){
		openInnerPageTab("myqualityManage_add","新增不符合项","dev_project/myProject/qualityManage/qualityManage_add.html",function(){
			initQualityManageAddLayout(id, null);
		});
	});
	
	/*修改*/
	var qualityManage_update = currTab.find("#qualityManage_update");
	qualityManage_update.click(function(){
		var rows = table.bootstrapTable('getSelections');
		if(rows.length!=1){
			alert("请选择一条数据进行修改!");
			return ;
		}
		if(rows[0].STATUS_NAME !== "待受理"){
			alert("这条数据不是待受理状态，不能进行修改!");
			return ;
		}
		openInnerPageTab("myqualityManage_update","修改不符合项","dev_project/myProject/qualityManage/qualityManage_add.html",function(){
			initQualityManageAddLayout(id, rows[0].QUALITY_ID);
		});
	});
	
	/*删除*/
	var qualityManage_delete = currTab.find("#qualityManage_delete");
	qualityManage_delete.click(function(){
		var rows = table.bootstrapTable('getSelections');
		if(rows.length!=1){
			alert("请选择一条数据进行删除!");
			return ;
		}
		if(rows[0].STATUS !== "01"){
			alert("这条数据不是待受理状态，不能进行删除!");
			return ;
		} 
		nconfirm("确定要删除该数据吗？",function(){
			var call = getMillisecond();
			baseAjaxJsonp(dev_project+"quality/deleteQuality.asp?call="+call+"&SID="+SID+"&QUALITY_ID="+rows[0].QUALITY_ID, null, function(data){
				if (data != undefined && data != null) {
					alert(data.msg);
					if(data.result=="true"){
						commit.click();
					}
				}else{
					alert("未知错误！");
				}
			},call);
		});
	});
	
	/*受理*/
	var qualityManage_accept = currTab.find("#qualityManage_accept");
	qualityManage_accept.click(function(){
		var rows = table.bootstrapTable('getSelections');
		if(rows.length!=1){
			alert("请选择一条数据进行受理!");
			return ;
		}
		if(rows[0].STATUS !== "01"){
			alert("这条数据不是待受理状态，不能进行受理!");
			return ;
		}
		openInnerPageTab("myqualityManage_accept","受理不符合项","dev_project/myProject/qualityManage/qualityManage_accept.html",function(){
			initQualityManageAcceptLayout(rows[0].QUALITY_ID);
		});
	});
	
	/*处理*/
	var qualityManage_handle = currTab.find("#qualityManage_handle");
	qualityManage_handle.click(function(){
		var rows = table.bootstrapTable('getSelections');
		if(rows.length!=1){
			alert("请选择一条数据进行处理!");
			return ;
		}
		if(rows[0].STATUS !== "04" && rows[0].STATUS !== "05" && rows[0].STATUS !== "08" && rows[0].STATUS !== "09"){
			alert("这条数据不是待处理或处理中状态，不能进行处理!");
			return ;
		}
		openInnerPageTab("myqualityManage_handle","处理不符合项","dev_project/myProject/qualityManage/qualityManage_handle.html",function(){
			initQualityManageHandleLayout(rows[0].QUALITY_ID);
		});
	});
	
	/*验证*/
	var qualityManage_validate = currTab.find("#qualityManage_validate");
	qualityManage_validate.click(function(){
		var rows = table.bootstrapTable('getSelections');
		if(rows.length!=1){
			alert("请选择一条数据进行验证!");
			return ;
		}
		if(rows[0].STATUS !== "06" && rows[0].STATUS !== "02"  && rows[0].STATUS !== "03"){
			alert("这条数据不是待验证状态，不能进行验证!");
			return ;
		}
		openInnerPageTab("myqualityManage_validate","验证不符合项","dev_project/myProject/qualityManage/qualityManage_validate.html",function(){
			initQualityManageValidateLayout(rows[0].QUALITY_ID);
		});
	});
	
	//仲裁
	/*var qualityManage_arbitrate = currTab.find("#qualityManage_arbitrate");
	qualityManage_arbitrate.click(function(){
		var rows = table.bootstrapTable('getSelections');
		if(rows.length!=1){
			alert("请选择一条数据进行修改!");
			return ;
		}
		openInnerPageTab("proEmpManage","项目人员管理","dev_project/myProject/proEmpManage/proEmpManage_qeryList.html",function(){
			initLayout(rows);
		});
	});*/
	
	/*详情*/
	var qualityManage_detail = currTab.find("#qualityManage_detail");
	qualityManage_detail.click(function(){
		var rows = table.bootstrapTable('getSelections');
		if(rows.length!=1){
			alert("请选择一条数据进行查看!");
			return ;
		}
		openInnerPageTab("myqualityManage_queryInfo","查看不符合项","dev_project/myProject/qualityManage/qualityManage_queryInfo.html",function(){
			initQualityManageInfoLayout(rows[0].QUALITY_ID);
		});
	});
	
	function daysBetween(sDate1,sDate2){
	    //Date.parse() 解析一个日期时间字符串，并返回1970/1/1 午夜距离该日期时间的毫秒数
	    var time1 = Date.parse(new Date(sDate1));
	    var time2 = Date.parse(new Date(sDate2));
	    var nDays = Math.abs(parseInt((time2 - time1)/1000/3600/24));
	    return  nDays;
	};
	
	/**		初始化table	**/
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	var param = form.serialize();
	var call = getMillisecond();
	table.bootstrapTable({
		//请求后台的URL（*）
		url : dev_project+'quality/queryListQuality.asp?call='+call+'&SID='+SID+"&"+param,
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
		uniqueId : "QUALITY_ID", //每一行的唯一标识，一般为主键列
		cardView : false, //是否显示详细视图
		detailView : false, //是否显示父子表
		jsonpCallback:call,
		singleSelect: true,
		columns : [{
			field: 'middle',
			checkbox: true,
			rowspan: 2,
			align: 'center',
			valign: 'middle',
		},{
			field : 'QUALITY_ID',
			title : '编号',
			align : "center",
		}, {
			field : "RULE_CORRECT_TIME",
			title : "标识",
			align : "center",
			formatter: function (value, row, index) {
				if(row.STATUS == '01'){
					return "*";//待受理
				}else if(row.STATUS == '06' && daysBetween(getCurrentYMD(),row.FIND_DATE)<=parseInt(row.RULE_CORRECT_DAY)){
					return "△";//待验证
				}else if(row.STATUS !='07' && daysBetween(getCurrentYMD(),row.FIND_DATE)>parseInt(row.RULE_CORRECT_DAY)){
					return ""+'<div class="text-red">!</div>';//延期未关闭
				}else{
					return "";
				}
			}
		}, {
			field : "PROJECT_NUM",
			title : "项目编号",
			align : "center",
		}, {
			field : "PROJECT_NAME",
			title : "项目名称",
			align : "center"
		},{
			field : "QUALITY_DESC",
			title : "不符合项描述",
			align : "center",
		}, {
			field : "TYP_NAME",
			title : "不符合项分类",
			align : "center",
		}, {
			field : "GRADE_NAME",
			title : "不符合项等级",
			align : "center",
		}, {
			field : "STATUS_NAME",
			title : "不符合项状态",
			align : "center",
		}, {
			field : "CURRENT_USER_NAME",
			title : "当前环节处理人",
			align : "center",
		},{
			field : "FIND_DATE",
			title : "发现日期",
			align : "center",
		} ]
	});
};
//tb6  配置不符合项js--------------------------------------------------
function initPQConfigManageListLayout(id){
	var currTab = getCurrentPageObj();
	currTab.find("input[name=PROJECT_ID]").val(id);
	
	var form = currTab.find("#configManage_query");
	var table = currTab.find("#configManage_table");
	autoInitSelect(form);
	
	var commit = currTab.find("#commit");
	commit.click(function(){
		initTable();
	});
	//重置
	var reset = currTab.find("#reset");
	reset.click(function(){
		form[0].reset();
		currTab.find("select").select2();
	});
    
	/*导入*/
	var configManage_import = currTab.find("#configManage_import");
	configManage_import.click(function(){
		openInnerPageTab("MyconfigManage_import","导入配置管理","dev_project/myProject/configManage/configManage_import.html",function(){
			initconfigManageImportLayout(id);
		});
	});
	
	/*新增*/
	var configManage_add = currTab.find("#configManage_add");
	configManage_add.click(function(){
		openInnerPageTab("MyconfigManage_add","新增不符合项","dev_project/myProject/configManage/configManage_add.html",function(){
			initconfigManageAddLayout(id, null);
		});
	});
	/*修改*/
	var configManage_add = currTab.find("#configManage_update");
	configManage_add.click(function(){
		var rows = table.bootstrapTable('getSelections');
		if(rows.length!=1){
			alert("请选择一条数据进行修改!");
			return ;
		}
		if(rows[0].STATUS_NAME !== "待受理"){
			alert("这条数据不是待受理状态，不能进行修改!");
			return ;
		}
		openInnerPageTab("MyconfigManage_add","修改不符合项","dev_project/myProject/configManage/configManage_add.html",function(){
			initconfigManageAddLayout(id, rows[0].CONFIG_ID);
		});
	});
	/*删除*/
	var configManage_add = currTab.find("#configManage_delete");
	configManage_add.click(function(){
		var rows = table.bootstrapTable('getSelections');
		if(rows.length!=1){
			alert("请选择一条数据进行删除!");
			return ;
		}
		if(rows[0].STATUS !== "01"){
			alert("这条数据不是待受理状态，不能进行删除!");
			return ;
		}  
		var call =getMillisecond();
		var msg="是否删除此申请？";
		nconfirm(msg,function(){
			baseAjaxJsonp(dev_project+"Confignotconform/confignotconformDelete.asp?call="+call+"&SID="+SID+"&CONFIG_ID="+rows[0].CONFIG_ID, null, function(data){
				if (data != undefined && data != null) {
					alert(data.msg);
					if(data.result=="true"){
						commit.click();
					}
				}else{
					alert("未知错误！");
				}
			},call);
		});
	});
	
	/*受理*/
	var configManage_accept = currTab.find("#configManage_accept");
	configManage_accept.click(function(){
		var rows = table.bootstrapTable('getSelections');
		if(rows.length!=1){
			alert("请选择一条数据进行受理!");
			return ;
		}
		if(rows[0].STATUS_NAME !== "待受理"){
			alert("这条数据不是待处理状态，不能进行处理!");
			return ;
		}
		openInnerPageTab("MyconfigManage_accept","受理不符合项","dev_project/myProject/configManage/configManage_accept.html",function(){
			initconfigManageAcceptLayout(id, rows[0].CONFIG_ID);
		});
	});
	
	/*处理*/
	var configManage_handle = currTab.find("#configManage_handle");
	configManage_handle.click(function(){
		var rows = table.bootstrapTable('getSelections');
		if(rows.length!=1){
			alert("请选择一条数据进行处理!");
			return ;
		}
		if(rows[0].STATUS_NAME !== "已受理-待处理"&& rows[0].STATUS_NAME !== "处理中"&& rows[0].STATUS_NAME !== "打回处理中"&& rows[0].STATUS_NAME !== "挂起"){
			alert("这条数据不是待处理状态，不能进行处理!");
			return ;
		}
		openInnerPageTab("MyconfigManage_handle","处理不符合项","dev_project/myProject/configManage/configManage_handle.html",function(){
			initconfigManageHandleLayout(id, rows[0].CONFIG_ID);
		});
	});
	
	/*验证*/
	var configManage_validate = currTab.find("#configManage_validate");
	configManage_validate.click(function(){
		var rows = table.bootstrapTable('getSelections');
		if(rows.length!=1){
			alert("请选择一条数据进行验证!");
			return ;
		}
		if(rows[0].STATUS_NAME !== "待验证"&&rows[0].STATUS_NAME !== "已受理-拒绝"){
			alert("这条数据不是待验证状态，不能进行验证!");
			return ;
		}
		openInnerPageTab("MyconfigManage_validate","验证不符合项","dev_project/myProject/configManage/configManage_validate.html",function(){
			initconfigManageValidateLayout(rows[0].CONFIG_ID);
		});
	});
	
	function daysBetween(sDate1,sDate2){
	    var time1 = Date.parse(new Date(sDate1));
	    var time2 = Date.parse(new Date(sDate2));
	    var nDays = Math.abs(parseInt((time2 - time1)/1000/3600/24));
	    return  nDays;
	};
	
	/*详情*/
	var configManage_info = currTab.find("#configManage_info");
	configManage_info.click(function(){
		var rows = table.bootstrapTable('getSelections');
		if(rows.length!=1){
			alert("请选择一条数据进行查看!");
			return ;
		}
		openInnerPageTab("MyconfigManage_QueryIn","不符合项详细","dev_project/myProject/configManage/configManage_queryInfo.html",function(){
			initconfigManageQueryInfoLayout(rows[0].CONFIG_ID);
		});
	});
	
	
	/*返回*/
	var configManage_back = currTab.find("#configManage_back");
	configManage_back.click(function(){
		closeCurrPageTab();
	});
	
	/**		初始化table	**/
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	
	initTable();
	
	function initTable(){
		var param = form.serialize();
		var call = getMillisecond();
		table.bootstrapTable('destroy').bootstrapTable({
			//请求后台的URL（*）
			url : dev_project+'Confignotconform/confignotconformQueryList.asp?call='+call+'&SID='+SID+"&"+param+"&PROJECT_ID="+id,
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
			uniqueId : "CONFIG_ID", //每一行的唯一标识，一般为主键列
			cardView : false, //是否显示详细视图
			detailView : false, //是否显示父子表
			jsonpCallback:call,
			singleSelect: true,
			columns : [ {
				field: 'middle',
				checkbox: true,
				rowspan: 2,
				align: 'center',
				valign: 'middle'
			}, /*{
				field : 'CONFIG_ID',
				title : '编号',
				align : "center"
			},*/ {
				field : "RULE_CORRECT_DAY",
				title : "标识",
				align : "center",
				formatter: function (value, row, index) {
					if(row.STATUS == '01'){
						return "*";//待受理
					}else if(row.STATUS == '06' && daysBetween(getCurrentYMD(),row.FIND_DATE)<parseInt(row.RULE_CORRECT_DAY)){
						return "△";//待验证
					}else if(row.STATUS !='07' && row.STATUS !='02' && row.STATUS !='03'
							&& daysBetween(getCurrentYMD(),row.FIND_DATE)>parseInt(row.RULE_CORRECT_DAY)){
						return "!";//延期未关闭
					}else{
						return "";
					}
				}
			}, {
				field : "PROJECT_NUM",
				title : "项目编号",
				align : "center"
			}, {
				field : "PROJECE_NAME",
				title : "项目名称",
				align : "center"
			}, {
				field : "DESCR",
				title : "不符合项描述",
				align : "center"
			}, {
				field : "AUDIT_CONFIG",
				title : "审计配置库",
				align : "center"
			}, {
				field : "GRADE_NAME",
				title : "不符合项等级",
				align : "center"
			}, {
				field : "STATUS_NAME",
				title : "不符合项状态",
				align : "center"
			}, {
				field : "PRESENT_USER_NAME",
				title : "提出人",
				align : "center"
			}, {
				field : "DUTY_USER_NAME",
				title : "(执行人)责任人",
				align : "center"
			},{
				field : "FIND_DATE",
				title : "发现日期",
				align : "center"
			}]
		});
	}
	
}
//tb7  项目变更申请js--------------------------------------------------
function initproChangeInfo(row){
	var currTab = getCurrentPageObj();		//该方法可以获取当前显示的页面对象，通过这个对象可以避免与其他页面的id重复问题
	//初始化下拉选
	autoInitSelect(currTab.find("#table_select"));
	
	var tableCall = getMillisecond();
	
	var table = currTab.find("#table_proChange");
	var form = currTab.find("#proChange");
	
	//查询
	var query = currTab.find("#select");
	query.click(function(){
		var param = form.serialize();
		table.bootstrapTable('refresh',{
			url:dev_project+'proChange/queryListProChange.asp?call='+tableCall+'&SID='+SID+"&"+param});
	});
	
	//重置
	var reset = currTab.find("#reset");
	reset.click(function(){
		form[0].reset();
		currTab.find("select").select2();
	});
	
	//列表显示
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	table.bootstrapTable({
		//请求后台的URL（*）
		url : dev_project+'proChange/queryListProChange.asp?call='+tableCall+'&SID='+SID+'&PROJECT_NUM='+row.PROJECT_NUM,
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
		uniqueId : "CHANGE_ID", //每一行的唯一标识，一般为主键列
		cardView : false, //是否显示详细视图
		detailView : false, //是否显示父子表
		jsonpCallback:tableCall,
		singleSelect: true,
		columns : [ {
			field: 'middle',
			checkbox: true,
			rowspan: 2,
			align: 'center',
			valign: 'middle'
		}, {
			field : 'Number',
			title : '序号',
			align : "center",
			/*sortable: true,*/
			formatter: function (value, row, index) {
				return index+1;
			}
		}, {
			field : 'aa',
			title : '标识',
			align : "center"
		}, {
			field : "CHANGE_CODE",
			title : "变更编号",
			align : "center"
		}, {
			field : "REQ_TASK_CODE",
			title : "需求任务编号",
			align : "center"
		}, {
			field : "REQ_TASK_NAME",
			title : "需求任务名称",
			align : "center"
		}, {
			field : "CHANGE_TYPE_NAME",
			title : "变更类型",
			align : "center"
		}, {
			field : "PRESENT_USER_NAME",
			title : "发起人",
			align : "center"
		}, {
			field : "RESPON_USER_NAME",
			title : "责任人",
			align : "center"
		}, {
			field : "APP_STATUS_NAME",
			title : "变更状态",
			align : "center"
		}, {
			field : "HOPE_SOLVE_DATE",
			title : "期望解决日期",
			align : "center"
		}, {
			field : "APP_TIME",
			title : "关闭日期",
			align : "center"
		}, {
			field : "PROJECT_NUM",
			title : "项目编号",
			align : "center"
		}, {
			field : "PROJECT_NAME",
			title : "项目名称",
			align : "center"
		}]
	});
	//发起变更按钮
	var add = currTab.find("#add_proChange");
	add.click(function(){
		openInnerPageTab("add_proChange","发起变更","dev_project/projectChangeManage/projectChangeApply/projectChange_edit.html", function(){
			initproChangeEditBtn(null);
		});
	 });
	//修改按鈕
	var update = currTab.find("#update_proChange");
	update.bind('click', function(e) {
		var seles = table.bootstrapTable("getSelections");
		if(seles.length!=1){
			alert("请选择一条数据进行修改!");
			return;
		}
		var state = seles[0].APP_STATUS;                    
		if(state!="00"){
			alert("该信息不是草拟状态，不能修改");
			return ;
		}
		openInnerPageTab("update_proChange","修改变更","dev_project/projectChangeManage/projectChangeApply/projectChange_edit.html", function(){
			initproChangeEditBtn(seles[0]);
		});
	});
	//查看
	var view = currTab.find("#view_proChange");
	view.bind('click', function(e) {
		var seles = table.bootstrapTable("getSelections");
		if(seles.length!=1){
			alert("请选择一条数据进行查看!");
			return;
		}
		openInnerPageTab("view_proChange","查看变更","dev_project/projectChangeManage/projectChangeApply/projectChange_queryInfo.html", function(){
			initviewproChange(seles[0]);
		});
	});
	//跟踪按鈕
	var follow = currTab.find("#follow_proChange");
	follow.bind('click', function(e) {
		var seles = table.bootstrapTable("getSelections");
		if(seles.length!=1){
			alert("请选择一条数据进行跟踪!");
			return;
		}
		openInnerPageTab("follow_proChange","变更跟踪","dev_project/projectChangeManage/projectChangeApply/projectChange_follow.html", function(){
			initfollow_proChange(seles[0]);
		});
	});
	//刪除按鈕
	var del = currTab.find("#delete_proChange");
	del.click(function(){
		var seles = table.bootstrapTable('getSelections');
		if(seles.length!=1){
			alert("请选择一条数据进行删除!");
			return;
		}
		var state = seles[0].APP_STATUS;                    
		if(state!="00"){
			alert("该信息不是草拟状态，不能删除");
			return ;
		}
		var call = getMillisecond();
		var msg="是否删除此申请？";
		nconfirm(msg,function(){
			var CHANGE_ID = seles[0].CHANGE_ID;  
			baseAjaxJsonp(dev_project+"proChange/deleteProChange.asp?call="+call+"&SID="+SID,{"CHANGE_ID":CHANGE_ID}, function(data){
				if (data != undefined && data != null && data.result=="true") {
					alert(data.msg);
					query.click();
				}else{
					alert(data.msg);
				}
			}, call);
		});
	});	
	//审批通过按鈕
	var approved = currTab.find("#approved");
	approved.click(function(){
		var seles = table.bootstrapTable('getSelections');
		if(seles.length!=1){
			alert("请选择一条数据审批通过!");
			return;
		}
		var state = seles[0].APP_STATUS;                    
		if(state!="01"){
			alert("该信息不是审批中状态，不能审批通过");
			return ;
		}
		var call = getMillisecond();
		var msg="是否通过此申请？";
		nconfirm(msg,function(){
			var CHANGE_ID = seles[0].CHANGE_ID;  
			var CHANGE_TYPE = seles[0].CHANGE_TYPE;  
			var PROJECT_ID = seles[0].PROJECT_ID; 
			baseAjaxJsonp(dev_project+"proChange/approveProChange.asp?call="+call+"&SID="+SID,{"CHANGE_ID":CHANGE_ID,"CHANGE_TYPE":CHANGE_TYPE,"PROJECT_ID":PROJECT_ID}, function(data){
				if (data != undefined && data != null && data.result=="true") {
					alert(data.msg);
					query.click();
				}else{
					alert(data.msg);
				}
			}, call);
		});
	});	
}


//tb8  项目结项申请js--------------------------------------------------
function initprojectEndApplyInfo(item,endInfo){
	var currTab = getCurrentPageObj();		//该方法可以获取当前显示的页面对象，通过这个对象可以避免与其他页面的id重复问题
	//赋值
	if(endInfo){
		for (var k in endInfo) {
			currTab.find("input[name="+k+"]").val(endInfo[k]);
			currTab.find("textarea[name="+k+"]").val(endInfo[k]);
		}
		if(row.STATUS != "01" && row.STATUS != "06"){
			currTab.find("textarea[name='PROJECT_DESC']").attr("disabled",true);
			apply_hide = currTab.find("[hid='apply_hide']");//初始化
			apply_hide.hide();
		}
	}
	for (var key in item) {
		currTab.find("div[name="+key+"]").html(item[key]);
	}
	
	initVlidate(getCurrentPageObj());
	/**初始化按钮开始**/	
	//保存
	var save = currTab.find("#save_Apply");
	save.click(function(){
		if(!vlidate(currTab,"",true)){
			return ;
		}
		initApplysave(false);
	});
	//保存并提交
	var submit = currTab.find("#submit_Apply");
	submit.click(function(){
		if(!vlidate(currTab,"",true)){
			return ;
		}
		initApplysave(true);
	});
	//返回
	var back = currTab.find("#back_Apply");
	back.click(function(){
		closeCurrPageTab();
		//openInnerPageTab("back_project","返回","dev_project/projectEstablishManage/projectEstablish/projectEstablish_queryList.html");
	});
	  
	function initApplysave(isCommit){
		var param = {};
		var selecttInfo = currTab.find("#apply_select");
		var inputs = selecttInfo.find("input");
		var textareas = selecttInfo.find("textarea");
		for (var i = 0; i < inputs.length; i++) {
			var obj = $(inputs[i]);
			param[obj.attr("name")] = $.trim(obj.val());
		}
		for (var i = 0; i < textareas.length; i++) {
			var obj = $(textareas[i]);
			param[obj.attr("name")] = $.trim(obj.val());
		}
		param["PROJECT_ID"]=item.PROJECT_ID;
		param["IS_COMMIT"]=isCommit;
		var call = getMillisecond();
		baseAjaxJsonp(dev_project+"proEnd/editProEndApply.asp?call="+call+"&SID="+SID,param, function(data){
			if (data != undefined && data != null && data.result=="true" ) {
	       		alert(data.msg);
	       		closeCurrPageTab();
			}else{ 
				alert(data.msg);
			}
		}, call);
	}
	/**初始化按钮结束**/
	//点击打开模态框
	var add_file = currTab.find("#add_file");
	add_file.click(function(){
		$("#file_modal").modal('show');
	});
	var table_file = currTab.find("#table_file");
	//附件列表显示
	table_file.bootstrapTable('destroy').bootstrapTable({
		//请求后台的URL（*）
		method : 'get', //请求方式（*）   
		striped : false, //是否显示行间隔色
		cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
		sortable : true, //是否启用排序
		sortOrder : "asc", //排序方式
		//queryParams : queryParams,//传递参数（*）
		sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
		pagination : false, //是否显示分页（*）
		pageList : [10,15],//每页的记录行数（*）
		pageNumber : 1, //初始化加载第一页，默认第一页
		pageSize : 10,//可供选择的每页的行数（*）
		clickToSelect : true, //是否启用点击选中行
		uniqueId : "FILE_ID", //每一行的唯一标识，一般为主键列
		cardView : false, //是否显示详细视图
		detailView : false, //是否显示父子表
		singleSelect: true,
		columns : [ {
			field: 'middle',
			checkbox: true,
			rowspan: 2,
			align: 'center',
			valign: 'middle'
		}, {
			field : 'Number',
			title : '序号',
			align : "center",
			sortable: true,
			width: 50,
			formatter: function (value, row, index) {
				return index+1;
			}
		}, {
			field : 'FILE_NAME',
			title : '文档名称',
			align : "center"
		}, {
			field : 'FILE_TYPE',
			title : '文档类型',
			align : "center"
		}, {
			field : "OPT_PERSON",
			title : "上传人",
			align : "center"
		}, {
			field : "OPT_TIME",
			title : "上传时间",
			align : "center"
		}, {
			field : "DID",
			title : "操作",
			align : "center",
			formatter: function (value, row, index) {
				return '<span class="hover-view" '+
				'onclick="viewInfo('+index+')">查看</span>';
			}
		}]
	});
}


}/*最外层包裹*/