
function initQualityManageValidateLayout(result){
	var currTab = getCurrentPageObj();
	initVlidate(currTab);
	var form = currTab.find("#qualityManage_validate");
	var infoTable = currTab.find("#qualityInfo_table");
	var table = currTab.find("#qualityManageValidate_table");

    //初始化页面信息
    initNoConfirmValidateLayout();
	function initNoConfirmValidateLayout(){
			for(var i in result){
				if(i=="WORK_PRODUCT_NAME"){
				  infoTable.find("div[name="+i+"]").html(result[i]);
				}else if(i=="PROCESS_NAME"){
				  infoTable.find("div[name="+i+"]").html(result[i]);
				  currTab.find("div[name="+i+"]").show();
				  currTab.find("div[name='WORK_PRODUCT_NAME']").hide();
				}else{
				  infoTable.find("div[name="+i+"]").html(result[i]);
				  form.find("input[name="+i+"]").val(result[i]);
				}
			}
			initNoConfirmValidateRecordTable();//初始化操作记录
			var business_code = result.BUSINESS_CODE;
			var phase = result.PHASES;
			var tablefile = currTab.find("#noConfirmItemVa_filetable");
			//初始化附件列表
			getFtpFileList(tablefile,currTab.find("#noconfirmValidate_filemodel"),business_code,phase);
	}

//初始化页面按钮	
initNoConfirmValidateBtn();
function initNoConfirmValidateBtn(){
	
	//提交
	var submit = currTab.find("#qualityManage_validate_submit");
	submit.click(function(e){
		//判断是否为空
        if(!vlidate(currTab)){
			  return ;
		  }
            var params = {};
            params["QUALITY_ID"] = result.QUALITY_ID;
	    	params["DESCR"] =  currTab.find("#descr").val();
	    	var QUALITY_STATUS="";
	    	var OPT_STATUS = "";
			var status =  currTab.find("#v_status").val();
			if(status=='0'){
				QUALITY_STATUS = '07';
				OPT_STATUS = "验证成功并关闭";
				/*******提醒参数*****/
				params["b_code"] = currTab.find("div[name='BUSINESS_CODE']").text()+currTab.find("div[name='PROJECT_NUM']").text();;
				params["b_name"] = "业务编号为【"+params.b_code+"】的质量不符合项已关闭";
				params["b_id"] = params.b_code;
				params["user_id"] = currTab.find("#duty_user_id").val();
				params["remind_type"] = "PUB2017201";
			}else if(status=='1'){
				QUALITY_STATUS = '06';
				OPT_STATUS = "验证打回";
			}
			    params["QUALITY_STATUS"] = QUALITY_STATUS;
			    params["OPT_STATUS"] = OPT_STATUS;
			var noConfirmValidatecall = getMillisecond();
			baseAjaxJsonp(dev_project+ "qualityManager/updateRaiseStatus.asp?call="+ noConfirmValidatecall + "&SID=" + SID,params, function(data) {
						if (data != undefined && data != null) {
							alert(data.msg);
							if (data.result == "true") {
								closeCurrPageTab();
						    }
					    } else {
						   alert("未知错误！");
				   }
		      }, noConfirmValidatecall);
	   });
	
	//返回
	var back = currTab.find("#qualityManage_validate_back");
	back.click(function(e){
		closeCurrPageTab();
	});
 }	
	
  //初始化操作记录
  function initNoConfirmValidateRecordTable(){
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
			url : dev_project+'qualityManager/queryListRecord.asp?call='+call+'&SID='+SID+'&QUALITY_ID='+result.QUALITY_ID,
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


/*//改变验证结果下拉框的值
function  changeStatus() {
}

//向不符合项跟踪表中插入数据
function initInsertOneRecord(QUALITY_STATUS,OPT_STATUS,QUALITY_ID){
	var call = getMillisecond();
	baseAjaxJsonp(
			dev_project
					+ "qualityManager/insertOneRecord.asp?call="
					+ call + "&SID=" + SID ,
			{
				QUALITY_STATUS:QUALITY_STATUS,
				OPT_STATUS:OPT_STATUS,
				QUALITY_ID : QUALITY_ID,
			}, function(data) {
				if (data != undefined && data != null) {
					alert(data.msg);
					if (data.result == "true") {
						$("#raiseCommit").click();
					}
				} else {
					alert("未知错误！");
				}
		}, call);
}*/