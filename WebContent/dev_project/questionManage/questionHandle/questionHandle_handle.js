initHandleLayout();
function initHandleLayout(){
	var currTab=getCurrentPageObj();
 var handleInfoCall = getMillisecond();
    var qHandleForm=currTab.find("#questionHandlehandleForm");
    var project_tr=getCurrentPageObj().find("#project_tr");
	initVlidate(currTab);
	
	
	//保存&提交操作
	var handing = currTab.find("#saveSubmit_questionHandlehandle");
	handing.click(function(e){
		handleQuestion("02");
    });
	/*//提交操作
	var handled = currTab.find("#handled_questionHandlehandle");
	handled.click(function(e){
		handleQuestion("03");

    });*/
	//返回操作
	var back = currTab.find("#return_questionRaiseAdd");
	back.click(function(e){
		closeCurrPageTab();
	});
//处理问题操作
	function handleQuestion(opt_type){
		if(!vlidate(getCurrentPageObj(),"",true)){
			return ;
		}
		var params=qHandleForm.serialize();
		var isComplete = vlidate(qHandleForm,"",true);
			if(isComplete){
				
			} else {
				return;
			}
		var type= opt_type;
		var handleInfoCall = getMillisecond()+1;
		nconfirm("确定提交处理问题吗？",function(){
		baseAjaxJsonp(dev_project+"QuestionHandle/updateQuestionHandleInfo.asp?SID="+SID+"&call="+handleInfoCall+"&"+params+"&opt_type="+type, null, function(data){
			if (data != undefined && data != null) {
				alert(data.msg);
				if(data.result=="true"){
					closeCurrPageTab();
				}
			}else{
				alert("保存&提交失败！");
			}
		},handleInfoCall);});
		}
	

}
function initqHOperateLogList(risk_id){
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	 var handleoperateLogCall = getMillisecond()+1;
	getCurrentPageObj().find("#qHandleOperateLogTable").bootstrapTable("destroy").bootstrapTable({
		//请求后台的URL（*）
		url : dev_project+"QuestionHandle/queryHandleOperateLog.asp?SID="+SID+"&call="+handleoperateLogCall+"&risk_id="+risk_id,
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
		jsonpCallback : handleoperateLogCall,
		detailView : false, //是否显示父子表
		singleSelect: true,
		onLoadSuccess:function(data){
			gaveInfo();
		},
		columns : [ /*{
			field: 'middle',
			checkbox: true,
			rowspan: 2,
			align: 'center',
			valign: 'middle'
		},*//*{
			field : 'aa',
			title : '序号',
			align : "center",
			formatter : function(value, row, index){
				return index+1;
			}
		},*/
		{
			field : "OPERATE_USER_NAME",
			title : "操作人",
			align : "center"
		},
		{
			field : "OPERATE_STATUS",
			title : "操作",
			align : "center"
		},{
			field : "OPERATE_TIME",
			title : "操作时间",
			align : "center"
		},  {
			field : "DESCR",
			title : "备注",
			align : "center"
		}]
	});
}
function initqHHandelLogList(risk_id){
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	 var handleLogCall = getMillisecond()+1;
	getCurrentPageObj().find("#qHandleHandleLogTable").bootstrapTable("destroy").bootstrapTable({
		//请求后台的URL（*）
		url : dev_project+"QuestionHandle/queryHandleHandleLog.asp?SID="+SID+"&call="+handleLogCall+"&risk_id="+risk_id,
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
		jsonpCallback : handleLogCall,
		detailView : false, //是否显示父子表
		singleSelect: true,
		onLoadSuccess:function(data){
			gaveInfo();
		},
		columns : [ /*{
			field: 'middle',
			checkbox: true,
			rowspan: 2,
			align: 'center',
			valign: 'middle'
		},*//*{
			field : 'aa',
			title : '序号',
			align : "center",
			formatter : function(value, row, index){
				return index+1;
			}
		},*/
		{
			field : "OPERATE_USER_NAME",
			title : "操作人",
			align : "center"
		},
		{
			field : "OPERATE_STATUS",
			title : "操作",
			align : "center"
		},{
			field : "OPERATE_TIME",
			title : "操作时间",
			align : "center"
		},  {
			field : "DESCR",
			title : "备注",
			align : "center"
		}]
	});
}
/****************************初始化页面信息**********************************/	
//初始化受理信息
function initquestionHandle_Handleinfo(item){
	for(var k in item){
		k1 = k.toLowerCase();
       var select= getCurrentPageObj().find("[name='"+ k1 +"']");
       if((k1=="risk_grade")&&(item[k]!="01")){
    	   getCurrentPageObj().find("#qHh_project_tr").hide();
       }
       if(select.attr("tagName")=='div')
       {  select.text(item[k]);}
       else  if(select.attr("tagName")=='input'){
    	   select.val(item[k]);
       }
       else if(select.attr("tagName")=='select') {
    	   select.val(item[k]);
    	   var code= select.attr("diccode");
  		 if((code!=null)&&(code!='')){
        initSelect(select,{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:code},item[k]);}
  		 }
       else if(select.attr("tagName")=='textarea') {
    	   select.val(item[k]);
       }
       else{
    	   select.text(item[k]); 
       }
       }
	
	
}
//文件上传功能
initqHupLoadFile();
function initqHupLoadFile(){
	 /**初始化按钮结束**/
	 //附件上传
	 var tablefile = getCurrentPageObj().find("#qeshandle_filetable");
	 var business_code = "";
	 business_code = getCurrentPageObj().find("#risk_file_id").val();
	 
	 if((typeof(business_code)=="undefined")||(business_code=='')||(business_code==null)){
		 business_code = Math.uuid();
		 getCurrentPageObj().find("#risk_file_id").val(business_code);
	 }

	 //点击打开模态框
	 var qhaddfile = getCurrentPageObj().find("#qeshandle_addfile");
	 qhaddfile.click(function(){
		 var risk_grade =getCurrentPageObj().find("#risk_grade").val();
		 var project_typ=getCurrentPageObj().find("#project_type").val();
		 if((risk_grade=="01")&&(project_typ=='SYS_DIC_VERSION_PROJECT')){
			 var paramObj = new Object();
			 paramObj.VERSIONS_NAME=getCurrentPageObj().find("#versions_name").val();
			 paramObj.SYSTEM_NAME=getCurrentPageObj().find("#system_name").val();
	 	openFileFtpUpload(getCurrentPageObj().find("#qhadd_modalfile"), tablefile, 'GZ1073',business_code, '01', 'S_DIC_QUESTION_HANDLE_FILE', false,false, paramObj);}
		 else{
			 var param = new Object();
	  openFileFtpUpload(getCurrentPageObj().find("#qhadd_modalfile"), tablefile, 'GZ1074',business_code, '01', 'S_DIC_QUESTION_HANDLE_FILE', false,false,param);}
		 
		 
	 });

	 //附件删除
	 var delete_file = getCurrentPageObj().find("#qeshandle_deletefile");
	 delete_file.click(function(){
	 	delFtpFile(tablefile, business_code, "01");
	 });
	 
	 getFtpFileList(tablefile, getCurrentPageObj().find("#qhadd_fileview_modal"), business_code, "01");
}





	