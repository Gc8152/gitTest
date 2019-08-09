var tableCall=getMillisecond();
//初始化频率配置
function initMessStrategy(category_code){
	$("#closePageMessstrategy_cfg").click(function(){
		nconfirm("确定离开该页面?",function(){
			closeCurrPageTab();
		});
	});
	var call=getMillisecond();
	$("#category_code_cfg").val(category_code);
	var url = dev_workbench+"PucTMesscategory/findMessCategoryByCode.asp?category_code="+category_code+"&call="+call+"&SID="+SID;
	baseAjaxJsonp(url,null,function(data){
		for(var k in data){
			$("#"+k).text(data[k]);
		}
	},call);
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	$("#messstrategy_Table").bootstrapTable(	{
		//请求后台的URL（*）
		url : dev_workbench+'PucTMessstrategy/queryAllMessstrategy.asp?category_code='+category_code+"&call="+tableCall+"&SID="+SID,
		method : 'get', //请求方式（*）   
		striped : true, //是否显示行间隔色
		cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
		sortable : true, //是否启用排序
		sortOrder : "asc", //排序方式
		queryParams : queryParams,//传递参数（*）
		sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
		pagination : true, //是否显示分页（*）
		pageList : [5,10],//每页的记录行数（*）
		pageNumber : 1, //初始化加载第一页，默认第一页
		pageSize : 10,//可供选择的每页的行数（*）
		clickToSelect : true, //是否启用点击选中行
		uniqueId : "PID", //每一行的唯一标识，一般为主键列
		cardView : false, //是否显示详细视图
		detailView : false, //是否显示父子表
		jsonpCallback:tableCall,
		singleSelect: true,
		onLoadSuccess:function(data){
		},
		columns : [ {
			field: 'middle',
			checkbox: true,
			rowspan: 2,
			align: 'center',
		},{
			field : 'PID',
			title : '频率ID',
			align : "center",
			visible:false
		},{
			field : 'ROLE_CODE',
			title : '角色编号',
			align : "center"
//			visible:false
		},{
			field : 'ROLE_NAME',
			title : '角色名称',
			align : "center"
		}, {
			field : "IS_SENDMESSAGENAME",
			title : "是否发送短信",
			align : "center"
		}, {
			field : "IS_SENDMAILNAME",
			title : "是否发送邮件",
			align : "center"
		}, {
			field : "FREQUENCY_NAME",
			title : "执行频率",
			align : "center"
		}, {
			field : "DAYANDWEEKNAME",
			title : "执行日期",
			align : "center"
		} ,{
			field : "SEND_TIME",
			title : "执行时间点",
			align : "center"
		}]
	});
};
//返回，POP关闭，POP角色弹出框
function MessStrategy_Button(){
	//POP框关闭
	$("#messStrategy_popButtonClose").click(function(){
		onModalCloseEvent("myModal_addStrategy");
		$("#myModal_addStrategy").modal("hide");
	});
	//POP角色
	$("#MTRRoleName").click(function(){	
		var operation=$("#operationState").val();
		if(operation=='add'){
			openAllRolePop("addmesssTrategyCFGRolePop",{name:$("#MTRRoleName"),no:$("#MTRRole_code")},"","add");
		}else if(operation=='update'){
			openAllRolePop("addmesssTrategyCFGRolePop",{name:$("#MTRRoleName"),no:$("#MTRRole_code")},"","update");
		}else{
			openAllRolePop("addmesssTrategyCFGRolePop",{name:$("#MTRRoleName"),no:$("#MTRRole_code")},"","add");
		}
	});
}
//初始化新增、修改频率
function messstrategy_AddInit(){
	//新增按钮
	$("#messstrategy_add").click(function(){
		$("#operationState").val("add");
		$("#MTRRoleName").val("");
		$("#MTRMessage_content").val("");
		$("#MTRMail_content").val("");
		$("#myModal_addStrategy").modal("show");
		
		$("#addstrategy").show();
		$("#updatestrategy").hide();
		$("#messStrategy_popButtonAdd").show();
		$("#messStrategy_popButtonupdate").hide();
		autoInitSelect($("#myModal_addStrategy"));		
		$("#category_code").val($("#category_code_cfg").val());
		//节假日是否发送
/*		$("#MTRis_holiday").empty();
		$("#MTRis_holiday").append("<label class='taskLabel'>假期是否发送：</label>");
		autoInitRadio("dic_code=T_DIC_YN",$("#MTRis_holiday"),"MTR.is_holiday",{labClass:"",type:"add"});*/
		//是否发送短信
/*		$("#MTRis_sendmessageTD").empty();
		baseAjax("SDic/findItemByDic.asp?dic_code=T_DIC_YN","",function(result){
			for(var i=0;i<result.length;i++){
				if(result[i].IS_DEFAULT=='00'){
					$("#MTRis_sendmessageTD").append("<td width='11%' class='table-text'>发送短信：</td><td><input type='radio' name=MTR.is_sendmessage  value="+result[i].ITEM_CODE+" checked>&nbsp;"+result[i].ITEM_NAME+"</td>");
				}else{
					$("#MTRis_sendmessageTD").append("<label><input type='radio' name=MTR.is_sendmessage value="+result[i].ITEM_CODE+">&nbsp;"+result[i].ITEM_NAME+"</label>");
				}						
			}
		});*/
		//是否发送邮件
/*		$("#MTRis_sendmailTD").empty();
		baseAjax("SDic/findItemByDic.asp?dic_code=T_DIC_YN","",function(result){
			for(var i=0;i<result.length;i++){
				if(result[i].IS_DEFAULT=='00'){
					$("#MTRis_sendmailTD").append("<label class=taskLabel>发送邮件：</label><label><input type='radio' name=MTR.is_sendmail  value="+result[i].ITEM_CODE+" checked>&nbsp;"+result[i].ITEM_NAME+"</label>");
				}else{
					$("#MTRis_sendmailTD").append("<label><input type='radio' name=MTR.is_sendmail value="+result[i].ITEM_CODE+">&nbsp;"+result[i].ITEM_NAME+"</label>");
				}						
			}
		});	*/		
		//发送频率
		Assorti();
	});
	//初始化修改
	$("#messstrategy_update").click(function(){
		var call=getMillisecond();
		var id = $("#messstrategy_Table").bootstrapTable('getSelections');
		if (id.length != 1) {
			alert("请选择一条数据进行修改!");
			return;
		}
		var pid = $.map(id, function(row) {
			return (row.PID);
		});		
		$("#myModal_addStrategy").modal("show");
		$("#addstrategy").hide();
		$("#updatestrategy").show();
		$("#messStrategy_popButtonAdd").hide();
		$("#messStrategy_popButtonupdate").show();
		$("#pid").val(pid);
		$("#operationState").val("update");

		var url = dev_workbench+"PucTMessstrategy/findMessstrategyByID.asp?pid="+pid+"&call="+call+"&SID="+SID;
		baseAjaxJsonp(url,null,function(dicData){
			for(var v in dicData){
				$("input[name='MTR."+v.toLowerCase()+"']").val(dicData[v]);
				$("select[name='MTR."+v.toLowerCase()+"']").val(dicData[v]).select2();
				$("textarea[name='MTR."+v.toLowerCase()+"']").val(dicData[v]);
				if(v=="FREQUENCY_VALUE"){
					initSelect($("#MTRfrequency_value"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"T_DIC_FREQUENCY"},dicData[v]);	
					if(dicData[v]=='00'){//发送频率为月
						$("#MTRDay").empty();
						$("#MTRDayTDHoliday .MTRDayTD").remove();
						$("#MTRDayTDHoliday").append("<td class='MTRDayTD'><label class='taskLabel'>执行日期：</label></td> <td class='MTRDayTD'> <select  id='MTRDay'         name = 'MTR.day' style='width:220px;'   validate='v.required' valititle='发送日期必填'></select></td>");
						$("#MTRDay").append("<option selected>请选择</option>");
						for(var i=1;i<29;i++){
							$("#MTRDay").append("<option value="+i+">"+i+"号</option>");
						}
						$("#MTRDay").select2();
						setSelected($("#MTRDay"),dicData["DAY"]);
					}else if(dicData[v]=='01'){//发送频率为周
						$("#MTRDay").empty();
						$("#MTRDayTDHoliday .MTRDayTD").remove();
						$("#MTRDayTDHoliday").append("<td class='MTRWeekTD'><label class='taskLabel'>执行日期：</label></td> <td class='MTRWeekTD'> <select  id='MTRWeek'         name = 'MTR.week' style='width:220px;'   validate='v.required' valititle='发送日期必填'></select></td>");
						initSelect($("#MTRWeek"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"M_DIC_WEEK"},dicData[v]);		
					}else{//发送频率为日
						$("#MTRDay").empty();
						$("#MTRDayTDHoliday .MTRDayTD").remove();						
					}
				}
				//发送短信单选框
				if(v=="IS_SENDMESSAGE"){
					$("#MTRis_sendmessageTD").empty();
					var dicData1 = dicData[v];
					baseAjax("SDic/findItemByDic.asp?dic_code=T_DIC_YN","",function(result){
						$("#MTRis_sendmessageTD").append("<label class=taskLabel>发送短信：</label>");
						for(var i=0;i<result.length;i++){
							if(result[i].ITEM_CODE==dicData1){
								$("#MTRis_sendmessageTD").append("<label><input type='radio' name=MTR.is_sendmessage  value="+result[i].ITEM_CODE+" checked>&nbsp;"+result[i].ITEM_NAME+"</label>");
							}else{
								$("#MTRis_sendmessageTD").append("<label><input type='radio' name=MTR.is_sendmessage value="+result[i].ITEM_CODE+">&nbsp;"+result[i].ITEM_NAME+"</label>");
							}						
						}
					});
				}
				//发送Emai单选框
				if(v=="IS_SENDMAIL"){
					$("#MTRis_sendmailTD").empty();
					var dicData2 = dicData[v];
					baseAjax("SDic/findItemByDic.asp?dic_code=T_DIC_YN","",function(result){
						$("#MTRis_sendmailTD").append("<label class=taskLabel>发送邮件：</label>");
						for(var i=0;i<result.length;i++){
							if(result[i].ITEM_CODE==dicData2){
								$("#MTRis_sendmailTD").append("<label><input type='radio' name=MTR.is_sendmail  value="+result[i].ITEM_CODE+" checked>&nbsp;"+result[i].ITEM_NAME+"</label>");
							}else{
								$("#MTRis_sendmailTD").append("<label><input type='radio' name=MTR.is_sendmail value="+result[i].ITEM_CODE+">&nbsp;"+result[i].ITEM_NAME+"</label>");
							}						
						}
					});
				}
				//假日是否发送单选框
				if(v=="IS_HOLIDAY"){
					$("#MTRis_holiday").empty();
					$("#MTRis_holiday").append("<label class='taskLabel'>假期是否执行：</label>");
					autoInitRadio("dic_code=T_DIC_YN",$("#MTRis_holiday"),"MTR.is_holiday",{labClass:"",type:"update",value:dicData[v]});
				}
			}
		},call);
//		//发送频率
		Assorti();
	});
	$("#messstrategy_delete").click(function(){
		var call=getMillisecond();
		var id = $("#messstrategy_Table").bootstrapTable('getSelections');
		if (id.length != 1) {
			alert("请选择一条数据进行删除!");
			return;
		}
		nconfirm("删除后,不可恢复.是否删除?",function(){
			var pid = $.map(id, function(row) {
				return (row.PID);
			});		
			var url = dev_workbench+"PucTMessstrategy/puctMessstrategyDelete.asp?pid="+pid+"&call="+call+"&SID="+SID;
			baseAjaxJsonp(url,null,function(data){
				if(data.result=="true"){
					alert("删除成功！");
					$("#messstrategy_Table").bootstrapTable('refresh');
				}else{
					alert("删除失败！");
				}			
			},call);
			});
		});
		
	//发送频率发生改变
	$("#MTRfrequency_value").change(function(){
		Assorti();
	});		
}	
//发送频率
function Assorti(){
	if($("#MTRSend_time option").length==0){
		for(var i=1;i<25;i++){
			$("#MTRSend_time").append("<option   value="+i+":00>"+i+":00</option>");
		}
		$("#MTRSend_time").select2();
	}
	if($("#MTRfrequency_value option:selected").val()=="00"){//月频率
		$("#MTRDay").empty();	
		$("#MTRDayTDHoliday .MTRDayTD").remove();
		$("#MTRDayTDHoliday .MTRWeekTD").remove();
		$("#MTRDayTDHoliday").append("<td class='MTRDayTD'><label class='taskLabel'>发送日期：</label></td>  <td class='MTRDayTD'><select  id='MTRDay'         name = 'MTR.day' style='width:220px;'   validate='v.required' valititle='发送日期必填'></select></td>");
		$("#MTRDay").append("<option selected>请选择</option>");
		for(var i=1;i<29;i++){
			$("#MTRDay").append("<option value="+i+"号>"+i+"号</option>");
		}
		$("#MTRDay").select2();
		//给必填项添加*
		initVlidate($("#myModal_addStrategy"));
	}else if($("#MTRfrequency_value option:selected").val()=="02"){//日频率
		$("#MTRWeek").empty();
		$("#MTRDayTDHoliday .MTRWeekTD").remove();
		$("#MTRDay").empty();
		$("#MTRDayTDHoliday .MTRDayTD").remove();
	}else{//周频率
		$("#MTRDay").empty();
		$("#MTRDayTDHoliday .MTRDayTD").remove();
		$("#MTRDayTDHoliday").append("<td class='MTRDayTD'><label class='taskLabel'>执行日期：</label></td > <td class='MTRDayTD'><select  id='MTRWeek'         name = 'MTR.week' style='width:220px;'   validate='v.required' valititle='发送日期必填'></select></td>");
		initSelect($("#MTRWeek"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"M_DIC_WEEK"});
		//给必填项添加*
		initVlidate($("#myModal_addStrategy"));
	}
}	
//保存频率
function messstrategy_add(){
	$("#messStrategy_popButtonAdd").click(function(){
		//取值
		var inputs = $("input[name^='MTR.']");
		var selects = $("select[name^='MTR.']");
		var textareas = $("textarea[name^='MTR.']");
//		if(($("input[name='MTR.is_sendmessage']:checked").val()=='01')&&($("input[name='MTR.is_sendmail']:checked").val()=="01")){
//			alert("发端短信、发送邮件 必须选择其一！");
//			return;
//		}
		//必填项验证
		if(!vlidate($("#myModal_addStrategy"),99999)){
			return ;
		}		
		var params = {};
		inputs.each(function(){
			if($(this).attr("name").substr(4)=="is_sendmessage"){
				params[$(this).attr("name").substr(4)] = $("input[name='MTR.is_sendmessage']:checked").val();
			}else if($(this).attr("name").substr(4)=="is_sendmail"){
				params[$(this).attr("name").substr(4)] = $("input[name='MTR.is_sendmail']:checked").val();
			}else{
				params[$(this).attr("name").substr(4)] = $(this).val();				
			}
		});
		selects.each(function(){
			params[$(this).attr("name").substr(4)] = $(this).val();
		});
		textareas.each(function(){
			params[$(this).attr("name").substr(4)] = $(this).val();
		});
       params['opt_type'] = 'add';
       var call=getMillisecond();
		var url = dev_workbench+"PucTMessstrategy/puctMessstrategyAdd.asp?category_code="+$("#category_code_cfg").val()+"&call="+call+"&SID="+SID;
		baseAjaxJsonp(url,params,function(data){
			if(data.result=="true"){
				alert("添加成功！");
				onModalCloseEvent("myModal_addStrategy");
				$("#myModal_addStrategy").modal("hide");
				$("#messstrategy_Table").bootstrapTable('refresh');
			}else{
				alert("添加失败！");
			}
		},call);
	});		
}
//修改频率
function messstrategy_update(){
	var call=getMillisecond();
	$("#messStrategy_popButtonupdate").click(function(){
		//取值
		var inputs = $("input[name^='MTR.']");
		var selects = $("select[name^='MTR.']");
		var textareas = $("textarea[name^='MTR.']");
//		if(($("input[name='MTR.is_sendmessage']:checked").val()=='01')&&($("input[name='MTR.is_sendmail']:checked").val()=="01")){
//			alert("发端短信、发送邮件 必须选择其一！");
//			return;
//		}
		//必填项验证
		if(!vlidate($("#myModal_addStrategy"),99999)){
			return ;
		}		
		var params = {};
		inputs.each(function(){
			if($(this).attr("name").substr(4)=="is_sendmessage"){
				params[$(this).attr("name").substr(4)] = $("input[name='MTR.is_sendmessage']:checked").val();
				var a=$("input[name='MTR.is_sendmessage']:checked").val();
				
			}else if($(this).attr("name").substr(4)=="is_sendmail"){
				params[$(this).attr("name").substr(4)] = $("input[name='MTR.is_sendmail']:checked").val();
			}else if($(this).attr("name").substr(4)=="is_holiday"){
				params[$(this).attr("name").substr(4)] = $("input[name='MTR.is_holiday']:checked").val();
			}else{
				params[$(this).attr("name").substr(4)] = $(this).val();				
			}
		});
		selects.each(function(){
			params[$(this).attr("name").substr(4)] = $(this).val();
		});
		textareas.each(function(){
			params[$(this).attr("name").substr(4)] = $(this).val();
		});
       params['opt_type'] = 'update';
		var url = dev_workbench+"PucTMessstrategy/puctMessstrategyAdd.asp?pid="+$("#pid").val()+"&call="+call+"&SID="+SID;
		baseAjaxJsonp(url,params,function(data){
			if(data.result=="true"){
				alert("修改成功！");
				onModalCloseEvent("myModal_addStrategy");
				$("#myModal_addStrategy").modal("hide");
				$("#messstrategy_Table").bootstrapTable('refresh');
			}else{
				alert("修改失败！");
			}
		},call);
	});		
};
//POP框 单选框变更功能
function changeRadioStrategy(){
	//短信模板
	$("#MTRis_sendmessageTD").change(function(){
		if($("input[name='MTR.is_sendmessage']:checked").val()=="01"){
			$("#MTRMessage_content").attr("readonly","readonly");
			$("#MTRMessage_content").val("");
			$("#MTRMessage_content").parent().find("[validate^='v.']").each(function(){
				$(this).siblings("strong[class^='high']").remove();
			});
			$("#MTRMessage_content").removeAttr("validate");
		}else{
			$("#MTRMessage_content").removeAttr("readonly");
			$("#MTRMessage_content").attr("validate","v.required");
			//给必填项添加*
			initVlidate($("#myModal_addStrategy"));
		};
	});
	//邮件模板
	$("#MTRis_sendmailTD").change(function(){
		if($("input[name='MTR.is_sendmail']:checked").val()=="01"){
			$("#MTRMail_content").attr("readonly","readonly");
			$("#MTRMail_content").val("");
			$("#MTRMail_content").parent().find("[validate^='v.']").each(function(){
				$(this).siblings("strong[class^='high']").remove();
			});
			$("#MTRMail_content").removeAttr("validate");
		}else{
			$("#MTRMail_content").removeAttr("readonly");
			$("#MTRMail_content").attr("validate","v.required");
			//给必填项添加*
			initVlidate($("#myModal_addStrategy"));
		};
	});
}
function initMessstrategyDicCode(){
	autoInitRadio({dic_code:"T_DIC_YN"},getCurrentPageObj().find("#MTRis_sendmessageTD"),"MTR.is_sendmessage",{labClass:"ecitic-radio-inline",value:"03"});
	autoInitRadio({dic_code:"T_DIC_YN"},getCurrentPageObj().find("#MTRis_sendmailTD"),"MTR.is_sendmessage",{labClass:"ecitic-radio-inline",value:"03"});
	autoInitRadio({dic_code:"T_DIC_YN"},getCurrentPageObj().find("#MTRis_holiday"),"MTR.is_sendmessage",{labClass:"ecitic-radio-inline",value:"03"});
}
initMessstrategyDicCode();
//返回，POP关闭，POP角色弹出框
MessStrategy_Button();
//初始化新增、修改频率
messstrategy_AddInit();
//保存频率
messstrategy_add();
//修改频率
messstrategy_update();
//POP框单选框变更
changeRadioStrategy();
$.fn.modal.Constructor.prototype.enforceFocus = function () {};