
function initQualityManageHandleLayout(result){
	
	var currTab = getCurrentPageObj();
	initVlidate(currTab);
	var form = currTab.find("#qualityManage_handle");
	var infoTable = currTab.find("#qualityInfo_table");
	var table = currTab.find("#qualityManageHandle_table");

	//初始化页面信息
	initNoConfirmItemAcceptLayout();
	function initNoConfirmItemAcceptLayout(){
		currTab.find("#work_product_name").hide();
		currTab.find("#process_name").hide();
		for(var i in result){
			if(i=="WORK_PRODUCT_NAME"){
				infoTable.find("div[name="+i+"]").html(result[i]);
				currTab.find("#work_product_name").show();
			}else if(i=="PROCESS_NAME"){
				infoTable.find("div[name="+i+"]").html(result[i]);
				currTab.find("#process_name").show();
			}else{
				infoTable.find("div[name="+i+"]").html(result[i]);
				form.find("input[name="+i+"]").val(result[i]);	
			}
		}
		initNoConfirmItemRecordTable(result.QUALITY_ID);//初始化操作记录列表
	}
	
	
//初始化页面按钮
initNoConfirmItemAcceptBtn();
function initNoConfirmItemAcceptBtn(){	
	//提交按钮操作
	var submit = currTab.find("#qualityManage_handle_submit");
	submit.click(function(e){
		//判断是否为空
        if(!vlidate(currTab)){
        	alert("你还有必填项未填");
			  return ;
		  }
         var params = {};
         params["QUALITY_ID"] = result.QUALITY_ID;
         params["PROBLEM_ANALYSE"] = currTab.find("#problem_analyse").val();
         params["SOLVE_MEASURES"] = currTab.find("#solve_measures").val();
         params["REFUSAL_REASON"] = currTab.find("#refusal_reason").val();
         params["DESCR"] = currTab.find("#descr").val();
         params["DUTY_USER_ID"] = currTab.find("#duty_user_id1").val();
         params["DISPOSE_USER_ID"] = currTab.find("#dispose_user_id").val();
         var status = currTab.find("#h_status").val();
         var QUALITY_STATUS = "";
         var OPT_STATUS = "";
    		if(status=='0'){
    			QUALITY_STATUS = '03';
    			OPT_STATUS = "受理成功";
    		}else if(status=='1'){
    			QUALITY_STATUS = '04'; 
    			 OPT_STATUS = "受理拒绝";
    		}else if(status=='2'){
    			QUALITY_STATUS = '02';
    	        OPT_STATUS = "受理转交";
    		}
    		params["QUALITY_STATUS"] = QUALITY_STATUS;
    		params["OPT_STATUS"] = OPT_STATUS;
    		var call = getMillisecond();
    		baseAjaxJsonp(dev_project+ "qualityManager/updateRaiseStatus.asp?call="+ call + "&SID=" + SID,params, function(data) {
    					if (data != undefined && data != null) {
    						alert(data.msg);
    						if (data.result == "true") {
    							closeCurrPageTab();
    						}
    					} else {
    						alert("未知错误！");
    					}
    				}, call);
    });
	
	//返回
	var back = currTab.find("#qualityManage_handle_back");
	back.click(function(e){
		closeCurrPageTab();
	});
}	

//初始化操作记录列表
function initNoConfirmItemRecordTable(quality_id){
		var queryParams=function(params){
			var temp={
					limit: params.limit, //页面大小
					offset: params.offset //页码
			};
			return temp;
		};
		var call = getMillisecond();
		table.bootstrapTable({
			//请求后台的URL（*）
			url : dev_project+"qualityManager/queryListRecord.asp?call="+call+"&SID="+SID+"&QUALITY_ID="+quality_id,
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
			uniqueId : "RECORD_ID", //每一行的唯一标识，一般为主键列
			cardView : false, //是否显示详细视图
			detailView : false, //是否显示父子表
			jsonpCallback:call,
			singleSelect: true,
			columns : [ {
				field : 'OPT_TIME',
				title : '日期',
				align : "center"
			}, {
				field : "OPT_USER_NAME",
				title : "操作人",
				align : "center"
			}, {
				field : "OPT_STATUS",
				title : "操作",
				align : "center"
			}, {
				field : "REMARK",
				title : "备注",
				align : "center"
			}, {
				field : "INCON_STATUS_NAME",
				title : "不符合项状态",
				align : "center"
			}]
		});	
	}
}

//初始化隐藏文本框
initNoConfirmAcceptHiden();
function initNoConfirmAcceptHiden(){
	getCurrentPageObj().find("#qualityManage_handle").find(".acceptResult").hide();
}

//受理的 状态改变
function  changeNoConfirmAcceptStatus() {
	var currTab = getCurrentPageObj();
	var status  = currTab.find("#h_status").val();
	if(status=="0"){
		currTab.find("#qualityManage_handle").find("#tr4").empty();
		currTab.find("#qualityManage_handle").find("#tr5").empty();
		currTab.find("#qualityManage_handle").find(".acceptResult").hide();
		currTab.find("#qualityManage_handle").find("#tr0").show();
		currTab.find("#qualityManage_handle").find("#tr1").show();
		currTab.find("#qualityManage_handle").find("#tr4").html("指定处理人：");
		currTab.find("#qualityManage_handle").find("#tr5").html("<input type='hidden' id='dispose_user_id' name='DISPOSE_USER_ID'/>" 
				+"<input type='text'name='DISPOSE_USER_NAME' id='dispose_user_name' onclick='showUserPOP(this)' validate='v.required' valititle='该项为必填项'/><strong class='high'>*</strong>");
		
	}
	if(status=="1"){
		currTab.find("#qualityManage_handle").find("#tr4").empty();
		currTab.find("#qualityManage_handle").find("#tr5").empty();
		currTab.find("#qualityManage_handle").find(".acceptResult").hide();
		currTab.find("#qualityManage_handle").find("#tr2").show();
	}
	if(status=="2"){
		currTab.find("#qualityManage_handle").find("#tr4").empty();
		currTab.find("#qualityManage_handle").find("#tr5").empty();
		currTab.find("#qualityManage_handle").find(".acceptResult").hide();
	    //getCurrentPageObj().find("#qualityManage_handle").find("#tr3").show();
		currTab.find("#qualityManage_handle").find("#tr6").show();
		currTab.find("#qualityManage_handle").find("#tr4").html("转交人：");
		currTab.find("#qualityManage_handle").find("#tr5").html("<input type='hidden' id='duty_user_id1' name='DUTY_USER_ID1'/>" 
			+"<input type='text'name='DUTY_USER_NAME1' id='duty_user_name1' onclick='changeUser(this)' validate='v.required' valititle='该项为必填项'/><strong class='high'>*</strong>");
	}
	
};
//处理人修改显示的pop框	
function showUserPOP(obj){
	openUserPop("duty_user_pop",{name:getCurrentPageObj().find("#dispose_user_name"),no:getCurrentPageObj().find("#dispose_user_id")});

}
//责任人修改显示的pop框
function changeUser(obj){
	openUserPop("duty_user_pop",{name:getCurrentPageObj().find("#duty_user_name1"),no:getCurrentPageObj().find("#duty_user_id1")});

}
