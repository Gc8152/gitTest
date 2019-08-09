//初始化下拉了值
var acceptCall = getMillisecond();
function initSelectVal(){
	initSelect(getCurrentPageObj().find("select[name='PHASES']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"P_DIC_QUALITY_PHASES"},'01');
	initSelect(getCurrentPageObj().find("select[name='GRADE']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"P_DIC_QUALITY_GRADE"});
	initSelect(getCurrentPageObj().find("select[name='IS_REAPPEAR']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"P_DIC_QUALITY_IS_REAPPEAR"});
}

//获取页面输入值
function getNotConfigAddPageValue(){
	 var params = {};
	 params["PROJECT_ID"] = getCurrentPageObj().find("#project_id").val();
     params["DESCR"] = getCurrentPageObj().find("#descr").val();
     params["GRADE"] = getCurrentPageObj().find("#grade").val();
     params["FIND_DATE"] = getCurrentPageObj().find("#find_date").val();
     params["IS_REAPPEAR"] = getCurrentPageObj().find("#is_reappear").val();
     params["PROJECT_MAN_ID"] = getCurrentPageObj().find("#project_man_id").val();
     params["CONFIG_ID"] = getCurrentPageObj().find("#config_id").val();
     params["PHASES"] = getCurrentPageObj().find("#phases").val();
     params["AUDIT_CONFIG"] = getCurrentPageObj().find("#audtt_config").val();
     params["SUGGEST_MEASURES"] = getCurrentPageObj().find("#suggest_measures").val();
     params["SUGGEST_SOLVE_TIME"] = getCurrentPageObj().find("#suggest_solve_time").val();
     return params;
}


//页面按钮事件
function initBtnEvent(){
	
	//保存按钮事件
	getCurrentPageObj().find("#notConformConfig_add").click(function(){
		//判断是否为空
        if(!vlidate($("#notConformConfig_add_form"))){
        	alert("您还有必填项未填");
			  return ;
		  }
        var params = getNotConfigAddPageValue();//获取页面的值
		var call1 = getMillisecond();
		//保存操作类型为01
		nconfirm("确定要保存吗？",function(){
		baseAjaxJsonp(dev_project+ "NotconformRaise/notconformRaiseAdd.asp?call="+ call1 + "&SID=" + SID+"&OPT_TYPE=01" ,params, function(data) {
					if (data != undefined && data != null) {
						alert(data.msg);
						if (data.result == "true") {
							closeCurrPageTab();
						}
					} else {
						alert("未知错误！");
					}
				}, call1);
	});});
	
  //提交按钮事件
  getCurrentPageObj().find("#notConformConfig_submit").click(function(){
	//判断是否为空
      if(!vlidate($("#notConformConfig_add_form"))){
      	alert("您还有必填项未填");
			  return ;
		  }
        var params = getNotConfigAddPageValue();//获取页面的值
		var call2 = getMillisecond();
		//提交操作类型为02
		nconfirm("确定要提交吗？",function(){
		baseAjaxJsonp(dev_project+ "NotconformRaise/notconformRaiseAdd.asp?call="+ call2 + "&SID=" + SID+"&OPT_TYPE=02" ,params, function(data) {
					if (data != undefined && data != null) {
						alert(data.msg);
						if (data.result == "true") {
							closeCurrPageTab();
						}
					} else {
						alert("未知错误！");
					}
				}, call2); 
  }); });
  
  //返回按钮事件
  getCurrentPageObj().find("#notConformConfig_add_back").click(function(){
		closeCurrPageTab();
	});
 /*var project_man=getCurrentPageObj().find("#project_man_name");
  var notConformConfig_add_form=getCurrentPageObj().find("#notConformConfig_add_form");
  project_man.click(function(){
			var urls=dev_project+"QuestionRaise/questionRaiseQueryAllUser.asp?SID="+SID;
			questionRaiseopenPmPop(getCurrentPageObj().find("#project_man_pop"),{Zpm_id:notConformConfig_add_form.find("input[name=PROJECT_MAN_ID]"),Zpm_name:notConformConfig_add_form.find("input[name=PROJECT_MAN_NAME]")},urls);
		
		
	});
  */
  var project_man=getCurrentPageObj().find("#project_man_name");
  project_man.click(function(){
	  getCurrentPageObj().find("#duty_user_table").modal('show');
  //POP重置
	var reset_emp = getCurrentPageObj().find("#reset_emp");
	reset_emp.click(function(){
		getCurrentPageObj().find("input[name=EMP_ID]").val("");
		getCurrentPageObj().find("input[name=EMP_NAME]").val("");
	});
	//多条件查询处理人
	var select_emp = getCurrentPageObj().find("#select_emp");
	select_emp.click(function(){
		var USER_NO = getCurrentPageObj().find("input[name=EMP_ID]").val();
		var USER_NAME =  getCurrentPageObj().find("input[name=EMP_NAME]").val();
		getCurrentPageObj().find("#table_duty_userInfo").bootstrapTable('refresh',{url:dev_project+"NotconformRaise/notconformRaiseQueryAllUser.asp?call="+acceptCall+"&SID="+SID
				+"&USER_NO="+USER_NO+"&USER_NAME="+escape(encodeURIComponent(USER_NAME))});
	});
	enterEventRegister(getCurrentPageObj().attr("class"), function(){getCurrentPageObj().find("#select_emp").click();});
	/**处理人模态框结束**/
  
  	openPop("choosePm",{Zpm_id:getCurrentPageObj().find("input[name=PROJECT_MAN_ID]"),Zpm_name:getCurrentPageObj().find("input[name=PROJECT_MAN_NAME]")});
  	
  });

}
//显示项目pop
function showProjectPop(){
	qropenProjectPop("project_pop", {
		PROJECT_NUM : getCurrentPageObj().find("#project_num_add"),
		PROJECT_NAME : getCurrentPageObj().find("#project_name"),
		PROJECT_MAN_NAME : getCurrentPageObj().find("#project_man_name"),
		PROJECT_ID : getCurrentPageObj().find("#project_id"),
		PROJECT_MAN_ID : getCurrentPageObj().find("#project_man_id")
	});
}

//新增页面，初始化事件
function addNotConformConfig_init(){
	getCurrentPageObj().find("#project_num_add").show();
	getCurrentPageObj().find("#project_num_update").hide();
	getCurrentPageObj().find("#project_num_add").attr("validate","v.required");
	getCurrentPageObj().find("#project_num_update").hide("validate","");
	
	
	var find_date = getCurrentYMD();
	getCurrentPageObj().find("#find_date").val(find_date);
	getCurrentPageObj().find("#notConformConfigSpan").html("新增不符合项<em></em>");
	var user_name=$("#currentLoginName").val();
	getCurrentPageObj().find("#present_user_name").val(user_name);
}
//修改页面，初始化事件
function updateConformConfig_init(row){
	getCurrentPageObj().find("#project_num_add").hide();
	getCurrentPageObj().find("#project_num_update").show();
	getCurrentPageObj().find("#project_num_add").attr("validate","");
	getCurrentPageObj().find("#project_num_update").attr("validate","v.required");
	getCurrentPageObj().find("#notConformConfigSpan").html("修改不符合项<em></em>");
	
	getCurrentPageObj().find("#find_date").val(row.FIND_DATE);
	getCurrentPageObj().find("#present_user_name").val(row.PRESENT_USER_NAME);
	getCurrentPageObj().find("#project_num_update").val(row.PROJECT_NUM);
	getCurrentPageObj().find("#project_name").val(row.PROJECT_NAME);
	getCurrentPageObj().find("#project_id").val(row.PROJECT_ID);
	getCurrentPageObj().find("#config_id").val(row.CONFIG_ID);
	getCurrentPageObj().find("#descr").val(row.DESCR);
	//getCurrentPageObj().find("#phases").val(row.PHASES);
	getCurrentPageObj().find("#audtt_config").val(row.AUDIT_CONFIG);
	//getCurrentPageObj().find("#grade").val(row.GRADE);
	//getCurrentPageObj().find("#is_reappear").val(row.IS_REAPPEAR);
	getCurrentPageObj().find("#grade").val(row.GRADE);
	getCurrentPageObj().find("#project_man_id").val(row.DUTY_USER_ID);
	getCurrentPageObj().find("#project_man_name").val(row.DUTY_USER_NAME);
	getCurrentPageObj().find("#suggest_solve_time").val(row.SUGGEST_SOLVE_TIME);
	getCurrentPageObj().find("#suggest_measures").val(row.SUGGEST_MEASURES);
	initSelect(getCurrentPageObj().find("select[name='GRADE']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"P_DIC_QUALITY_GRADE"},row.GRADE);
	initSelect(getCurrentPageObj().find("select[name='PHASES']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"P_DIC_QUALITY_PHASES"},row.PHASES);
	initSelect(getCurrentPageObj().find("select[name='IS_REAPPEAR']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"P_DIC_QUALITY_IS_REAPPEAR"},row.IS_REAPPEAR);
	
}
initSelectVal();
initBtnEvent();
/**处理人模态框开始**/
//点击打开模态框

function openPop(id,callparams){
	//分页
	
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};	
	//查询所有POP框
	getCurrentPageObj().find("#table_duty_userInfo").bootstrapTable("destroy").bootstrapTable({
		//请求后台的URL（*）
		url : dev_project+"NotconformRaise/notconformRaiseQueryAllUser.asp?call="+acceptCall+"&SID="+SID,
		method : 'get', //请求方式（*）   
		striped : true, //是否显示行间隔色
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
		uniqueId : "USER_NO", //每一行的唯一标识，一般为主键列
		cardView : false, //是否显示详细视图
		detailView : false, //是否显示父子表
		jsonpCallback:acceptCall,
		singleSelect: true,
		onDblClickRow:function(row){
			getCurrentPageObj().find('#duty_user_table').modal('hide');
			callparams.Zpm_id.val(row.USER_NO);
			callparams.Zpm_name.val(row.USER_NAME);
		},
		columns :[{
        	field : 'USER_NO',
			title : '用户编号',
			align : "center"
        }, {
        	field : "USER_NAME",
			title : "用户姓名",
			align : "center"
        }, {
        	field : "ROLE_NAME",
			title : "用户角色",
			align : "center",
        }, {
        	field : "ORG_NAME",
			title : "所属部门名称",
			align : "center"
        }]
	});
}