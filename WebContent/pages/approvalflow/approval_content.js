var tableCall = getMillisecond();
//流程实例id
var instance_id="";
//作用于初始化审批列表
function initcontentPop(){
	getCurrentPageObj().find('#apphistoryPop').empty();
	getCurrentPageObj().find('#apphistoryPop').append(
		'<div class="ecitic-title">'+
			'<span>流程审批列表<em></em></span>'+
		'</div>'+
		'<div class="ecitic-new">'+
			'<table id="AFApprovalTableInfo" class="table table-bordered table-hover table-text-show"></table>'+
		'</div>'		
	);
}
/**
 * 审批列表表格初始化列表
 * @param instance_id
 * @returns
 */
function initAFApprovalInfo(instance_id,type) {
	this.instance_id=instance_id;
	initcontentPop();
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	getCurrentPageObj().find('#AFApprovalTableInfo').bootstrapTable({
		url :'AFLaunch/queryAFApprovalLists.asp?instance_id='+instance_id+"&call="+tableCall,
		method : 'get', //请求方式（*）   
		striped : true, //是否显示行间隔色
		cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
		sortable : true, //是否启用排序
		sortOrder : "asc", //排序方式
		queryParams : queryParams,//传递参数（*）
		sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
		pagination : false, //是否显示分页（*）
		pageList : [5,10],//每页的记录行数（*）
		pageNumber : 1, //初始化加载第一页，默认第一页
		pageSize : 10,//可供选择的每页的行数（*）
		clickToSelect : false, //是否启用点击选中行
		uniqueId : "af_id", //每一行的唯一标识，一般为主键列
		cardView : false, //是否显示详细视图
		detailView : false, //是否显示父子表
		jsonpCallback:tableCall,
		singleSelect: true,
		onLoadSuccess:function (){
			setRowspan("AFApprovalTableInfo");
			gaveInfo();
		},
		columns : [{
			field : 'N_ID',
			title : '审批节点id',
			align : "center",
			visible:false
		},{
			field : 'N_NAME',
			title : '审批岗位',
			align : "center",
			valign: "middle"
		}, {
			field : "APP_PERSON",
			title : "工号",
			align : "center",
			visible:false
		}, {
			field : "APP_PERSON_NAME",
			title : "审批人",
			align : "center",
	        width : "30px"
		}, {
			field : "APP_STATE",
			title : "操作",
			align : "center",
			formatter:function(value,row,index){
			  var curr_actorno = row.CURR_ACTORNO;
        	  if(row.STATE_NAME){
        		  return row.STATE_NAME;
        	  }else if(type=='0'){
        		  return '--';
        	  }else if(curr_actorno!=null&&curr_actorno!=undefined){
        		  var userid = $("#currentLoginNo").val();
        		  var str = curr_actorno.split(",");
        		  var flag = false;
        		  $.each(str,function(i){
        			  if(userid==str[i]){
        				  flag=true;
        			  }
        		  })
        		  if("apping" == row.APPING && userid == row.APP_PERSON && flag){
	        			return '<span style="color:#0088cc;cursor: pointer;" onclick="approval(\'00\','+row.N_ID+');" class=pass>批准</span> '+
	        			'| <span style="color:#0088cc;cursor: pointer;" onclick="approval(\'01\','+row.N_ID+');" class=reject>拒绝</span>'+
	        			'| <span style="color:#0088cc;cursor: pointer;" onclick="approval(\'03\','+row.N_ID+');" class=reject>委托</span>';
        		  }else{
        			  return '--';
        		  }
        	  }
        	  return '--';
          },
     
		}, {
			field : "APP_CONTENT",
			title : "审批意见",
			align : "center"
		}, {
			field : "OPT_TIME",
			title : "审批时间",
			align : "center"
		}]
	});
}
//合并单元格
function setRowspan(id){
	var tabledata=getCurrentPageObj().find('#'+id).bootstrapTable('getData');
	var n_name = tabledata[0].N_NAME;
	var j=0;
	var k=1;
	for(var i=1;i<tabledata.length;i++){
		if(n_name!=tabledata[i].N_NAME){
			getCurrentPageObj().find('#'+id).bootstrapTable('mergeCells',{index:j,field:'N_NAME',colspan:1,rowspan:k});
			j=i;
			k=1;
			n_name=tabledata[i].N_NAME;
		}else{
			k++;
		}
	}
	getCurrentPageObj().find('#'+id).bootstrapTable('mergeCells',{index:j,field:'N_NAME',colspan:1,rowspan:k});
}
/**
 * 批准/拒绝/撤回
 * @param state
 * @param n_id 发起人拿回时此参数可以为空
 * @param instance_id1
 */
function approval(state,n_id,instance_id1){
	getCurrentPageObj().find('#approvalPop').remove();
	getCurrentPageObj().find('#appOptPop').empty();
	getCurrentPageObj().find("#appOptPop").load("pages/approvalflow/approval_content.html",{},function(){
		getCurrentPageObj().find("#approvalPop").modal("show");
		getCurrentPageObj().find("#n_id").val(n_id);
		if(state=='02'){
			getCurrentPageObj().find("#instance_id").val(instance_id1);
		}else{
			getCurrentPageObj().find("#instance_id").val(instance_id);
		}
		var stateName=(state=='00'?'批准':state=='01'?'拒绝':state=='02'?'撤回':'委托');
		initVlidate(getCurrentPageObj().find("#approvalFlowAuditForm"));
		//显示审批处理模态框
		getCurrentPageObj().find("#approvalPop").modal("show");
		if(state!="03"){
			getCurrentPageObj().find("#userSelect").attr("style","display: none");
			if(state=="00")
				initNextPerson(instance_id);
		}else{
			getCurrentPageObj().find("#userSelect").removeAttr("style");
			initUserPop();
			initUserSelect();
		}
		if(state!='01'){
			getCurrentPageObj().find("#dahui").css("display","none");
		}else{
			getCurrentPageObj().find("#dahui").css("display","block");
		}
		//审批意见初始化
		getCurrentPageObj().find("#auditTitle").html(state=='02'?'撤回':state=='03'?'委托':'审批');
		getCurrentPageObj().find("#auditStateName").html(state=='02'?'请填写撤回理由：':state=='03'?'请填写委托理由：':'请填写操作为【<font size=\'4px\'>'+stateName+'</font>】的审批意见：');
		//审批意见
		getCurrentPageObj().find("#auditState").val(state);
		//提交审批意见动作
		getCurrentPageObj().find("#doApprovalSubmitAction").click(function(){
			var state=getCurrentPageObj().find("#auditState").val();
			var contentObj=getCurrentPageObj().find("#auditContent");
		    if(state!="00"&&contentObj.val().length>250){
		    	alert("审批意见至多可输入250汉字！");
		    	return;
		    }
		    if(state=="00"){
		    	contentObj.removeAttr("validate");
		    }else{
		    	contentObj.attr("validate","v.required");
		    }
			doApprovalSubmit((getCurrentPageObj()[0].call_func||call_func));
		});
		//取消审批意见动作
		getCurrentPageObj().find("#doApprovalCancelAction").click(function(){
			reSetForm('approvalFlowAuditForm');
			getCurrentPageObj().find('#approvalPop').modal('hide');
			getCurrentPageObj().find("#historyPop").modal("hide");
		});
	});
}
/**
 * 查找单人审批下一个节点的审批人
 * @param instance_id
 */
function initNextPerson(instance_id){
	var param = {
			instance_id:instance_id
		};
	baseAjax("AFLaunch/queryNextPerson.asp", param, function(data){
		var nextPersonList = data.nextPerson; 
    	if(nextPersonList.length>0){
    		var checkflag = "checked = 'checked'";
    		for(var i=0;i<nextPersonList.length;i++){
    			if(nextPersonList[i]['N_TYPE']=="00"){
    				if(i > 0){
    					checkflag = '';
    				}
    				getCurrentPageObj().find("#nextman").show();
    				getCurrentPageObj().find("#n_type").val(nextPersonList[i]['N_TYPE']);
    				var user_name = nextPersonList[i]['USER_NAME'];
        			var user_no = nextPersonList[i]['APP_PERSON'];
        			getCurrentPageObj().find("#next_person").append("<span  style='margin: 15px' ><input type='radio' "+checkflag+" name='next_person' value="+user_no+">&nbsp;"+user_name+"</span>");
    			}
    		}
		}
	});
}



/**
 * 审批POP框提交动作
 * @param call_func 处理业务的回调函数
 */
function doApprovalSubmit(call_func){
	var flag = vlidate(getCurrentPageObj().find("#approvalFlowAuditForm"));
	
	var n_type = getCurrentPageObj().find("#n_type").val();
	var next_person = "";
	if(n_type != ""){
		next_person = getCurrentPageObj().find("input[name='next_person']:checked").val();
		if(next_person == "" || next_person == undefined){
			alert("请选择下一个审批人");
			return;
		}
	}
	if(flag){
		var param = {
			backType:getCurrentPageObj().find("input[name='backType']:checked").val(),
			userId:$("#currentLoginNo").val(),
			auditState:getCurrentPageObj().find("#auditState").val(),
			auditContent:getCurrentPageObj().find("#auditContent").val(),
			instance_id:getCurrentPageObj().find("#instance_id").val(),
			n_id:getCurrentPageObj().find("#n_id").val(),
			next_person:next_person
		};
		if(getCurrentPageObj().find("#auditState").val()=='03'){
			var selRow = getCurrentPageObj().find('#pop_userTable').bootstrapTable("getSelections");
			if(selRow.length>0){
				var new_app_person=selRow[0].USER_NO;
			}else{
				alert("请选择委托人！");
				return;
			}
			param["new_app_person"]=new_app_person;
		}
		baseAjax("AFLaunch/doSaveApprSubmit.asp", param, function(data){
	    	if(data.result){
	    		doApprovalCancel();//关闭模态窗
	    		getCurrentPageObj().find('#AFApprovalTableInfo').bootstrapTable('refresh');
	    		if(data.mark=='over'){//流程结束
	    			call_func(data.result,data.mark,data.biz_id,data.msg);
	    		}else if(data.mark=='reject'){//打回至发起人
	    			call_func(data.result,data.mark,data.biz_id,data.msg);
	    		}else if(data.mark=='back'){//撤回（拿回）
	    			call_func(data.result,data.mark,data.biz_id,data.msg);
	    		}else{
	    			call_func(data.result,'','',data.msg);
	    		}
			}else{
				call_func(data.result,'','',data.msg);
				doApprovalCancel();//关闭模态窗
				getCurrentPageObj().find('#AFApprovalTableInfo').bootstrapTable('refresh');
			}
		});
	}
}
/**
 * POP中的关闭按钮
 */
function doApprovalCancel(){
	reSetForm('approvalFlowAuditForm');
	getCurrentPageObj().find('#approvalPop').modal('hide');
	getCurrentPageObj().find("#historyPop").modal("hide");
}
/**
 * 审批POP弹窗里面的取消按钮动作函数
 * @param id
 */
function reSetForm(id){
	getCurrentPageObj().find("#"+id+" input").val("");
	getCurrentPageObj().find("#"+id+" textarea").val("");
	getCurrentPageObj().find("#"+id+" select").val("");
	getCurrentPageObj().find("#"+id+" select").select2();
}
//初始化人员列表
function initUserPop() {
	var queryParams=function(params){
		var temp={
			limit: params.limit, //页面大小
			offset: params.offset //页码
		};
		return temp;
	};
	getCurrentPageObj().find('#pop_userTable').bootstrapTable("destroy").bootstrapTable({
		url : 'SUser/popFindAllUser.asp',			
		method : 'get', //请求方式（*）   
		striped : false, //是否显示行间隔色
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
		uniqueId : "instance_id", //每一行的唯一标识，一般为主键列
		cardView : false, //是否显示详细视图
		detailView : false, //是否显示父子表
		singleSelect: true,
		columns : [ {
			field: 'middle',
			checkbox: true,
			rowspan: 2,
			align: 'center',
			valign: 'middle'
		},{
			field : 'USER_NO',
			title : '用户编号',
			align : "center"
		},{
			field : "USER_NAME",
			title : "用户名称",
			align : "center"
		},{
			field : "LOGIN_NAME",
			title : "登陆名",
			align : "center"
		},{
			field : "STATE",
			title : "用户状态",
			align : "center",
			formatter:function(value,row,index){if(value=="00"){return "启用";}return "停用";}
		},{
			field : "ORG_NO_NAME",
			title : "所属部门",
			align : "center"
		}]
	});
};
//初始化人员选择按钮和部门菜单
function initUserSelect(){
	getCurrentPageObj().find("#user_pop_org_name").unbind("click");//user_pop_org_code
	getCurrentPageObj().find("#user_pop_org_name").click(function(){
		openSelectTreeDiv($(this),"entrust_apppeople","SOrg/queryorgtreelist.asp",{"margin-left":"130px",width:'180px'},function(node){
			getCurrentPageObj().find("#user_pop_org_name").val(node.name);
			getCurrentPageObj().find("#user_pop_org_code").val(node.id);
		});
	});
	//用户POP重置
	getCurrentPageObj().find("#pop_userReset").click(function(){
		$("#selectParam input").each(function(){
			$(this).val("");
		});
		if(userParam.name){
			userParam.name.removeData("node");
		}
		getCurrentPageObj().find("#pop_userState").val(" ");
		getCurrentPageObj().find("#pop_userState").select2();
	});
	//多条件查询用户
	getCurrentPageObj().find("#pop_userSearch").click(function(){
		var currTab=getCurrentPageObj();
		var PopUserName1 = currTab.find("#pop_username").val();
		var PopUserName=PopUserName1==currTab.find("#pop_username").attr("placeHolder")?"":PopUserName1;
		/*var PopUserNo1 =  currTab.find("#pop_userCode").val();
		var PopUserNo=PopUserNo1==currTab.find("#pop_userCode").attr("placeHolder")?"":PopUserNo1;*/
		var PopUserLoginName1 = currTab.find("#pop_userLoginName").val();
		var PopUserLoginName=PopUserLoginName1== currTab.find("#pop_userLoginName").attr("placeHolder")?"":PopUserLoginName1;
		var PopUserState =  $.trim(getCurrentPageObj().find("#pop_userState").val());
		var sorg_code =  $.trim(getCurrentPageObj().find("#user_pop_org_code").val());
		getCurrentPageObj().find("#pop_userTable").bootstrapTable('refresh',{url:"SUser/popFindAllUser.asp?1=1"+"&PopUserName="+escape(encodeURIComponent(PopUserName))+"&PopUserLoginName="+escape(encodeURIComponent(PopUserLoginName))+"&PopUserState="+PopUserState+"&org_code="+sorg_code});
	});
}
/**
 * 查看历史审批记录
 * @param biz_id 业务ID
 * @param systemFlag：系统标识（合同系统：00，项目系统：01，报销系统：02，工程管理：03...）
 */
function showHistoryDetail(biz_id,systemFlag){
	getCurrentPageObj().find('#historyPop').remove();
	getCurrentPageObj().find('#appOptPop').empty();
	getCurrentPageObj().find("#appOptPop").load("pages/approvalflow/approval_content.html",{},function(){
		getCurrentPageObj().find("#historyPop").modal("show");
		initHistoryPop(biz_id,systemFlag);
	});
}
/**
 * 初始化历史记录
 * @param biz_id
 * @param system_flag
 */
function initHistoryPop(biz_id,system_flag) {
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	getCurrentPageObj().find('#table_history').bootstrapTable({
		url :'AFLaunch/queryAFAppHisLists.asp?biz_id='+biz_id+"&system_flag="+system_flag+"&call="+tableCall,
		method : 'get', //请求方式（*）   
		striped : true, //是否显示行间隔色
		cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
		sortable : true, //是否启用排序
		sortOrder : "asc", //排序方式
		queryParams : queryParams,//传递参数（*）
		sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
		pagination : false, //是否显示分页（*）
		pageList : [5,10],//每页的记录行数（*）
		pageNumber : 1, //初始化加载第一页，默认第一页
		pageSize : 10,//可供选择的每页的行数（*）
		clickToSelect : false, //是否启用点击选中行
		uniqueId : "af_id", //每一行的唯一标识，一般为主键列
		cardView : false, //是否显示详细视图
		detailView : false, //是否显示父子表
		jsonpCallback:tableCall,
		singleSelect: true,
		onLoadSuccess:function (){
			setRowspan("table_history");
		},
		columns : [{
			field : 'N_ID',
			title : '审批节点id',
			align : "center",
			visible:false
		},{
			field : 'N_NAME',
			title : '审批岗位',
			align : "center",
			valign: "middle"
		}, {
			field : "APP_PERSON",
			title : "工号",
			align : "center",
			visible:false
		}, {
			field : "APP_PERSON_NAME",
			title : "审批人",
			align : "center"
		}, {
			field : "APP_STATE",
			title : "操作",
			align : "center",
			formatter:function(value,row,index){
        	  if(row.STATE_NAME){
        		  return row.STATE_NAME;
        	  }
        	  return '--';
          }
		}, {
			field : "APP_CONTENT",
			title : "审批意见",
			align : "center"
		}, {
			field : "OPT_TIME",
			title : "审批时间",
			align : "center"
		}]
	});
};
