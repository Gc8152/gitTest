var tableCall = getMillisecond();
//流程实例id
var instance_id="";
function initcontentPop(){
	getCurrentPageObj().find('#apphistoryPop').empty();
	getCurrentPageObj().find('#apphistoryPop').append(
		'<div class="ecitic-title">'+
			'<span>流程审批列表<em></em></span>'+
		'</div>'+
		'<div class="ecitic-new">'+
			'<table id="AFApprovalTableInfo" class="table table-bordered table-hover"></table>'+
		'</div>'		
	);

}
/*审批列表表格初始化列表*/
function initAFApprovalInfo(instance_id) {
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
        	  }else if("apping" == row.APPING && $("#currentLoginNo").val() == row.APP_PERSON){
        		  	
        			return '<span style="color:#0088cc;cursor: pointer;" onclick="approval(\'00\','+row.N_ID+');" class=pass>批准</span> '+
        			'| <span style="color:#0088cc;cursor: pointer;" onclick="approval(\'01\','+row.N_ID+');" class=reject>拒绝</span>';
        			/*+
        			'| <span style="color:#0088cc;cursor: pointer;" onclick="approval(\'03\','+row.N_ID+');" class=reject>委托</span>'*/
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
 * @param state,n_id
 */
function approval(state,n_id){
	getCurrentPageObj().find('#approvalPop').remove();
	getCurrentPageObj().find('#appOptPop').empty();
	getCurrentPageObj().find("#appOptPop").load("dev_construction/requirement/requirement_input/input_flow/approval_content.html",{},function(){
		getCurrentPageObj().find("#approvalPop").modal("show");
		getCurrentPageObj().find("#n_id").val(n_id);
		getCurrentPageObj().find("#instance_id").val(instance_id);
		var stateName=(state=='00'?'批准':state=='01'?'拒绝':state=='02'?'撤回':'委托');
		initVlidate(getCurrentPageObj().find("#approvalFlowAuditForm"));
		//显示审批处理模态框
		getCurrentPageObj().find("#approvalPop").modal("show");
		if(state!="03"){
			getCurrentPageObj().find("#userSelect").attr("style","display: none");
		}else{
			getCurrentPageObj().find("#userSelect").removeAttr("style");
			initUserPop();
			initUserSelect();
		}
		//审批意见初始化
		getCurrentPageObj().find("#auditTitle").html(state=='02'?'撤回':state=='03'?'委托':'审批');
		getCurrentPageObj().find("#auditStateName").html(state=='02'?'请填写撤回理由：':state=='03'?'请填写委托理由：':'请填写操作为【<font size=\'4px\'>'+stateName+'</font>】的审批意见：');
		//审批意见
		getCurrentPageObj().find("#auditState").val(state);
	});
}
/**
 * 提交
 */
function doApprovalSubmit(){
	var flag = vlidate(getCurrentPageObj().find("#approvalFlowAuditForm"));
	if(flag){
		var param = {
			//userId:getCurrentPageObj().find("#currentLoginNo").val(),
			userId:SID,
			auditState:getCurrentPageObj().find("#auditState").val(),
			auditContent:getCurrentPageObj().find("#auditContent").val(),
			instance_id:getCurrentPageObj().find("#instance_id").val(),
			n_id:getCurrentPageObj().find("#n_id").val()
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
	    		if(data.mark=='over'){//审批通过
	    			reqInputApproveOver(data.biz_id,"04"); //业务id
	    		}else if(data.mark=='reject'){
	    			reqInputApproveOver(data.biz_id,"012");//审批打回
	    		}else{
	    			alert("操作成功");
	    		}
	    		
			}else{
				alert("操作失败");
			}
		});
	}
}
/**
 * 取消
 */
function doApprovalCancel(){
	reSetForm('approvalFlowAuditForm');
	getCurrentPageObj().find('#approvalPop').modal('hide');
}
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
		getCurrentPageObj().find("#selectParam input").each(function(){
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
		var PopUserName = getCurrentPageObj().find("#pop_username").val();
		var PopUserNo =  getCurrentPageObj().find("#pop_userCode").val();
		var PopUserLoginName = getCurrentPageObj().find("#pop_userLoginName").val();
		var PopUserState =  $.trim(getCurrentPageObj().find("#pop_userState").val());
		var sorg_code =  $.trim(getCurrentPageObj().find("#user_pop_org_code").val());
		getCurrentPageObj().find("#pop_userTable").bootstrapTable('refresh',{url:"SUser/popFindAllUser.asp?1=1"+"&PopUserName="+escape(encodeURIComponent(PopUserName))+"&PopUserNo="+PopUserNo+"&PopUserLoginName="+PopUserLoginName+"&PopUserState="+PopUserState+"&org_code="+sorg_code});
	});
	enterEventRegister(getCurrentPageObj().attr("class"), function(){getCurrentPageObj().find("#pop_userSearch").click();});
}
