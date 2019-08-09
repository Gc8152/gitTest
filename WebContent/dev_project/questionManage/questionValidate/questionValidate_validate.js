
function initViladateLayout(){
	var currTab=getCurrentPageObj();
    var validateInfoCall = getMillisecond();
    var qValidateForm=currTab.find("#questionValidatevalidateForm");
    var return_explain=getCurrentPageObj().find("#return_explain");
	initVlidate(currTab);
	initSelect(getCurrentPageObj().find("#question_verify_result"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"P_DIC_RISK_VERIFY_RESULT"});
	var question_verify_result = currTab.find("#question_verify_result");
	question_verify_result.bind('change',function(){
		if(question_verify_result.val()=='01'){
			
			return_explain.hide();
			
		} else  if (question_verify_result.val()=='02') {
			return_explain.show();
			
			
		}
	});
	
	
	//提交操作
	var submit_viladate = currTab.find("#submit_questionValidate");
	submit_viladate.click(function(e){
		if(!vlidate(getCurrentPageObj(),"",true)){
			return ;
		}
		var params=qValidateForm.serialize();
		var isComplete = vlidate(qValidateForm,"",true);
			if(isComplete){
				
			} else {
				return;
			}
		var validatesubmitCall = getMillisecond()+1;
		var risk_name=getCurrentPageObj().find("#risk_name").text();
		nconfirm("确定完成验证问题吗？",function(){
		baseAjaxJsonp(dev_project+"QuestionValidate/updateQuestionValidateInfo.asp?SID="+SID+"&call="+validatesubmitCall+"&"+params+"&risk_name="+escape(encodeURIComponent(risk_name)), null, function(data){
			if (data != undefined && data != null) {
				alert(data.msg);
				if(data.result=="true"){
					closeCurrPageTab();
				}
			}else{
				alert("验证错误！");
			}
		},validatesubmitCall);});
		

    });
	//返回操作
	var back = currTab.find("#return_questionRaiseAdd");
	back.click(function(e){
		closeCurrPageTab();
	});

	
	

}
function initqVOperateLogList(risk_id){
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	 var voperateCall = getMillisecond()+1;
	getCurrentPageObj().find("#qValidateOperateLogTable").bootstrapTable("destroy").bootstrapTable({
		//请求后台的URL（*）
		url : dev_project+"QuestionValidate/queryValidateOperateLog.asp?SID="+SID+"&call="+voperateCall+"&risk_id="+risk_id,
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
		jsonpCallback : voperateCall,
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
		},{
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
function initqVHandelLogList(risk_id){
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	 var handleCall = getMillisecond()+1;
	getCurrentPageObj().find("#qValidateHandleLogTable").bootstrapTable("destroy").bootstrapTable({
		//请求后台的URL（*）
		url : dev_project+"QuestionHandle/queryHandleHandleLog.asp?SID="+SID+"&call="+handleCall+"&risk_id="+risk_id,
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
		jsonpCallback : handleCall,
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
		},{
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
function initquestionValidate_viladateInfo(item){
	for(var k in item){
		k1 = k.toLowerCase();
       var select= getCurrentPageObj().find("[name='"+ k1 +"']");
       if((k1=="risk_grade")&&(item[k]!="01")){
    	   getCurrentPageObj().find("#qVv_project_tr").hide();
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
//处理操作处理状态
	