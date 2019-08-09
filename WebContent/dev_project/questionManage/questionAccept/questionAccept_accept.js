
function initAcceptInfoLayout(){
	var currTab=getCurrentPageObj();
 var submitacceptInfoCall = getMillisecond();
    var qAacceptForm=currTab.find("#questionAcceptacceptForm");
    var refusal_reason= currTab.find("#refusal_reason");
    var affect_anlyse= currTab.find("#affect_anlyse");
    var opt_user= currTab.find("#opt_user_id_name");
    var qa_opthide_tr= currTab.find("#qa_opthide_tr");
    var project_tr=getCurrentPageObj().find("#project_tr");
    var handle_suggestion = currTab.find("#handle_suggestion");
    
   
	initVlidate(currTab);
	 initSelect(handle_suggestion,{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"P_DIC_RISK_HANDLE_SUGGESTION"},'01');
	var  dispose_measure = currTab.find("#dispose_measure");
	
	var risk_grade= currTab.find("#risk_grade");
	risk_grade.bind('change',function(){
		if(risk_grade.val()=='01')
{	       
			project_tr.show();
		} else   {
			project_tr.hide();
		}
	});
	//提交操作
	var submit = currTab.find("#submit_questionAcceptaccept");
	submit.click(function(e){
		if(!vlidate(getCurrentPageObj(),"",true)){
			return ;
		}
		var params=qAacceptForm.serialize();
		var isComplete = vlidate(qAacceptForm,"",true);
			if(isComplete){
				
			} else {
				return;
			}
		 var risk_name = getCurrentPageObj().find("#risk_name").text();
			nconfirm("确定提交受理问题吗？",function(){
		baseAjaxJsonp(dev_project+"QuestionAccept/updateQuestionAcceptInfo.asp?SID="+SID+"&call="+submitacceptInfoCall+"&"+params+"&risk_name="+escape(encodeURIComponent(risk_name)), null, function(data){
			if (data != undefined && data != null) {
				alert(data.msg);
				if(data.result=="true"){
					closeCurrPageTab();
				}
			}else{
				alert("受理失败！");
			}
		},submitacceptInfoCall);});

    });
	//处理人pop
	var opt_man = qAacceptForm.find("input[name=opt_user_id_name]");
	opt_man.click(function(){
		var urls=dev_project+"QuestionRaise/questionRaiseQueryAllUser.asp?SID="+SID;
		questionRaiseopenPmPop(currTab.find("#opt_user_pop"),{Zpm_id:qAacceptForm.find("input[name=opt_user_id]"),Zpm_name:qAacceptForm.find("input[name=opt_user_id_name]")},urls);
	});
	//选择问题级别为项目时，视图变化

	handle_suggestion.bind('change',function(){
		if(handle_suggestion.val()=='01'){
			refusal_reason.hide();
			affect_anlyse.show();
			dispose_measure.show();
			opt_user.attr("validate","v.required");
			qa_opthide_tr.show();
			currTab.find("#opt_user_id+strong").show();
			
		} else  if (handle_suggestion.val()=='02') {
			refusal_reason.show();
			affect_anlyse.hide();
			dispose_measure.hide();
			opt_user.attr("validate","");
			qa_opthide_tr.hide();
			currTab.find("#opt_user_id+strong").hide();
			
		}
			
		
	});
//初始化操作日志
//初始化处理日志
//initHandleLogList();
//initOperateLogList();
}
function initqAOperateLogList(risk_id){
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	 var acceptLogCall = getMillisecond()+1;
	getCurrentPageObj().find("#qAacceptOperateLogTable").bootstrapTable("destroy").bootstrapTable({
		//请求后台的URL（*）
		url : dev_project+"QuestionAccept/queryAcceptOperateLog.asp?SID="+SID+"&call="+acceptLogCall+"&risk_id="+risk_id,
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
		jsonpCallback : acceptLogCall,
		detailView : false, //是否显示父子表
		singleSelect: true,
		onLoadSuccess:function(data){
			gaveInfo();
		},
		columns : [ /*{
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
function initquestionAccept_Acceptinfo(item){

	for(var k in item){
		k1 = k.toLowerCase();
       var select= getCurrentPageObj().find("[name='"+ k1 +"']");
       if((k1=="risk_grade")&&(item[k]!="01")){
    	   getCurrentPageObj().find("#project_tr").hide();
       }
       if(select.attr("tagName")=='div')
       {  select.text(item[k]);}
       else  if(select.attr("tagName")=='input'){
    	   select.val(item[k]);
       }
       else if(select.attr("tagName")=='select') {
    	   select.val(item[k]);
    	   var code=select.attr("diccode");
  		 if((code!=null)&&(code!='')){
        initSelect(select,{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:code},item[k]);
        
  		 }
  		 }
       else if(select.attr("tagName")=='textarea') {
    	   select.val(item[k]);
       }
       else{
    	   select.text(item[k]); 
       }
       }
         
		 
}