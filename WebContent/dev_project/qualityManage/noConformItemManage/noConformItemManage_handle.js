function initQualityManageHandleLayout(result){
	
	var currTab = getCurrentPageObj();
	initVlidate(currTab);
	var form = currTab.find("#qualityManage_handle");
	var infoTable = currTab.find("#qualityInfo_table");
	var table = currTab.find("#qualityManageHandle_table");
    
	
	//初始化页面信息
	initNoConfirmManageLayout();
	function initNoConfirmManageLayout(){
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
		};
		initNoConfirmManageTable(result.QUALITY_ID);//初始化操作记录
		var business_code = result.BUSINESS_CODE;
		var phase = result.PHASES;
		var tablefile = currTab.find("#noConfirmItem_filetable");
		//初始化附件列表
		getFtpFileList(tablefile,currTab.find("#noconfirmManage_filemodel"),business_code,phase);
	 }
	
	
 //初始化按钮	
 initNoConfirmItemManageBtn();	
 function initNoConfirmItemManageBtn(){
	
	var submit = currTab.find("#qualityManage_handle_submit");
	submit.click(function(e){
		//判断是否为空
       if(!vlidate(currTab)){
    	   alert("您还有必填项未填");
			  return ;
		  }
            var params = {};
            params["QUALITY_ID"] = result.QUALITY_ID;
            params["PROBLEM_ANALYSE"] = currTab.find("#problem_analyse").val();
            params["SOLVE_MEASURES"] = currTab.find("#solve_measures").val();
            params["REFUSAL_REASON"] = currTab.find("#refusal_reason").val();
            params["DISPOSE_USER_ID"] = currTab.find("#dispose_user_id").val();
            params["DESCR"] = currTab.find("#descr").val();
    		var QUALITY_STATUS="";
    		var OPT_STATUS = "";
    		var status = currTab.find("#h_status").val();
    		if(status=='0'){
    			QUALITY_STATUS = '05';
    		    OPT_STATUS = "处理成功";
    		}else if(status=='1'){
    			QUALITY_STATUS = '04'; 
    			OPT_STATUS = "处理拒绝";
    		}else if(status=='2'){
    			QUALITY_STATUS = '03';
    			OPT_STATUS = "处理转交";
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
	//文件上传
	var business_code = result.BUSINESS_CODE;
	var phase = result.PHASES;
	var tablefile = currTab.find("#noConfirmItem_filetable");
	var file_model = currTab.find("#noconfirmManage_filemodel");
	//点击打开模态框
	var addfile = getCurrentPageObj().find("#noConfirmAdd_file");
	addfile.click(function(){
		 var paramObj = new Object();
		 paramObj.FILE_DIR = business_code;
		 if(phase=="01"){
	 	   openFileFtpUpload(file_model, tablefile, 'GZ1063',business_code,phase, 'S_DIC_REQ_PUT_FILE', false,false, paramObj);
		 }else if(phase=="03"){
		   openFileFtpUpload(file_model, tablefile, 'GZ1056',business_code,phase, 'S_DIC_REQ_ANL_FILE', false,false, paramObj); 
		 }else if(phase=='05'){
		   openFileFtpUpload(file_model, tablefile, 'GZ1055',business_code,phase, 'S_DIC_SYS_DESIGN_FILE', false,false, paramObj);  
		 }else if(phase=="07"){
			 openFileFtpUpload(file_model, tablefile, 'GZ1057',business_code,phase, 'S_DIC_UNIT_TEST_FILE', false,false, paramObj); 
		 }else if(phase=="08"){
			 openFileFtpUpload(file_model, tablefile, 'GZ1058',business_code,phase, 'S_DIC_JOINT_TEST_FILE', false,false, paramObj); 
		 }else if(phase=="09001"){
			 openFileFtpUpload(file_model, tablefile, 'GZ1059001',business_code,phase, 'S_DIC_SIT_CASE_FILE', false,false, paramObj);
		 }else if(phase=="09002"){
			 openFileFtpUpload(file_model, tablefile, 'GZ1059002',business_code,phase, 'S_DIC_SIT_DEPLOY_FILE', false,false, paramObj);
		 }else if(phase=="09003"){
			 openFileFtpUpload(file_model, tablefile, 'GZ1059003',business_code,phase, 'S_DIC_SIT_TEST_REPORT', false,false, paramObj);
		 }else if(phase=="10"){
			 openFileFtpUpload(file_model, tablefile, 'GZ1061',business_code,phase, 'S_DIC_UAT_TEST_FILE', false,false, paramObj);
		 }else if(phase=="12"){
			 openFileFtpUpload(file_model, tablefile, 'GZ1062',business_code,phase, 'G_DIC_SEND_PRODUCE_FILE', false,false, paramObj);
		 }
	 });

	 //附件删除
	 var delete_file = getCurrentPageObj().find("#noConfirmDelete_file");
	 delete_file.click(function(){
	 	delFtpFile(tablefile, business_code, "01");
	 });
}	
	
//初始化操作记录
function initNoConfirmManageTable(quality_id){
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
initNoConfirmManagerHiden();
function initNoConfirmManagerHiden(){
	getCurrentPageObj().find("#qualityManage_handle").find(".acceptResult").hide();
}

//处理的 状态改变
function  changeNoConfirmManagerStatus() {
	
	var currTab = getCurrentPageObj();
	var status  = currTab.find("#h_status").val();
	
	if(status=="0"){
		currTab.find("#qualityManage_handle").find("#tr4").empty();
		currTab.find("#qualityManage_handle").find("#tr5").empty();
		currTab.find("#qualityManage_handle").find(".acceptResult").hide();
		currTab.find("#qualityManage_handle").find("#tr0").show();
		currTab.find("#qualityManage_handle").find("#tr1").show();
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
		currTab.find("#qualityManage_handle").find("#tr4").html("转交人：");
		currTab.find("#qualityManage_handle").find("#tr5").html("<input type='hidden' id='dispose_user_id' name='DISPOSE_USER_ID'/>" 
				+"<input type='text'name='DISPOSE_USER_NAME' id='dispose_user_name' onclick='changeUser(this)' validate='v.required' valititle='该项为必填项'/><strong class='high'>*</strong>");
		currTab.find("#qualityManage_handle").find("#tr3").show();
	}
	
};
	
//向不符合项跟踪表中插入数据
function initInsertOneRecord(QUALITY_STATUS,OPT_STATUS,QUALITY_ID){
	var call = getMillisecond();
	baseAjaxJsonp(
			dev_project
					+ "qualityManager/insertOneRecord.asp?call="
					+ call + "&SID=" + SID ,
			{
				QUALITY_STATUS:QUALITY_STATUS,
				QUALITY_ID : QUALITY_ID,
				OPT_STATUS:OPT_STATUS,
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
}

//责任人修改显示的pop框
function changeUser(obj){
	openUserPop("duty_user_pop2",{name:getCurrentPageObj().find("#dispose_user_name"),no:getCurrentPageObj().find("#dispose_user_id")});
}

