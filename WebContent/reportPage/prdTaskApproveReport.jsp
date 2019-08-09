<%@ page language="java" contentType="text/html; charset=UTF-8"   pageEncoding="UTF-8"%>
<%@ taglib uri="/reportJsp/runqianReport4.tld" prefix="report" %>
<%@ page import="com.yusys.entity.SUser"%>
<%
//StringBuffer s=new StringBuffer();
//String url="http://"+s.append(request.getServerName()).append(":").append(request.getServerPort()).append(request.getContextPath()).toString();
        SUser user=(SUser)request.getSession().getAttribute("userinfo");
		String skin_type = user.getSkin_type();
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<link rel="stylesheet" href="../bootstrap/css/bootstrap-z.css" />
<link rel="stylesheet" href="../bootstrap/css/select2.css" />
<link rel="stylesheet" type="text/css" href="../css/style.css"/>
<link rel="stylesheet" type="text/css" href="../css/form.css"/>
<link rel="stylesheet" type="text/css" href="../css/zebra_dialog.css"/>
<link href="../ztree3.5.22/css/zTreeStyle/zTreeStyle.css" rel="stylesheet"> 
<script type="text/javascript" src="../js/jquery/jquery-1.9.1/jquery.min.js"></script>
<script src="../bootstrap/js/select2.min.js"></script>
<script src="../js/artTemplate/template.js"></script>
<script src="../js/commons/commons.js"></script>
<script src="../js/commons/menu_commons-wh.js"></script>
<link rel="stylesheet" type="text/css" href="../css/public.css"/>
<script type="text/javascript" src="../js/My97DatePicker/WdatePicker.js"></script>
<script language=javascript src="../js/runqianReport_fy.js"></script>
<script src="../bootstrap/js/bootstrap.min.js"></script>
<script src="../bootstrap/js/bootstrap-table.min.js"></script>
<script src="../bootstrap/js/bootstrap-table-zh-CN.js"></script>
<link rel="stylesheet" type="text/css" href="../css/skin_<%=skin_type %>/skin.css" id="report-iframe"/>
<title>投产审批表</title>
</head>
<body>
<div class="main_iframe_con">
	<form id ="interdetailedlist_querylistForm" action="" class="form-inline">
		<div class="ecitic-inquire" id="ecitic-inquire">
			<div class="ecitic-table" id="ecitic-table">
				<table width="100%" border="0" cellspacing="0" cellpadding="0" class="table table-bordered table-bor-pad">
					<tr>
						<td width="11%" class="ecitic-right">应用名称：</td>
						<td width="21.333%">
							<input type="text" name="P.system_name" id="P_system_name" onclick="OpeanSystemPopTR()" readonly/>
							<input type="hidden"   name="P.system_id" id="P_system_id" >
						</td>
						<td width="11%" class="ecitic-right">投产版本：</td>
						<td width="21.333%"><input type="text" name="P.versions_name" id="P_versions_name"/></td>
						<td class="ecitic-right"  style="width:10%">任务状态：</td>
						<td style="width:25%">
							<select id="req_task_state"  name="T.req_task_state" class="requirement-ele-width" style="width:100%;">
								<option value="">请选择</option>
								<!-- <option value="00">草拟</option>
							 	<option value="01">待受理</option>
								<option value="02">退回</option>
								<option value="03">需求任务分析</option> -->
								<option value="04">入版待实施</option>
								<option value="05">开发设计</option>
								<option value="07">编码开发</option>
								<option value="08">联调测试</option>
								<option value="09">SIT测试</option>
							 	<option value="10">UAT测试</option>
								<option value="12">提交投产</option>
								<option value="13">任务完成</option>
							</select>
						</td>
					</tr>
					
				</table>
			</div>
			<ul class="ecitic-btn-all">
				<li><input type="button" class="btn btn-ecitic" id="queryprdPermitDetail" value="查询"/></li>
				<li><input type="button" class="btn btn-ecitic" id="resetprdPermitDetail" value="重置"/></li>
			</ul>
		</div>
	</form>
	<div mod="systemPoptr"></div>
	<div id="test">
			<script  language=javascript>
	             var report = new runqianReport( "100%", "100%" );
	            report.setBorder( "border:1px solid blue" );  //设置控件为兰色细边框//
	            report.setServerURL(dev_report);
	   		</script>
	</div>
</div>
<%
	SUser suser = (SUser) request.getSession().getAttribute("userinfo");
	String org_code=suser.getOrg_no();
	/* if(suser.getUser_no().equals(suser.getOrg_manager())){
		org_code=suser.getOrg_no();
	} */
%>
<script type="text/javascript">
/**
 * enter事件记录集合
 */
var enterEvents= new Object();

/**
 * enter事件注册方法
 */
function enterEventRegister(eventId, event){
	enterEvents[eventId] = event;
}
/**
 * enter事件销毁方法
 */
function enterEventDestroy(eventId){
	delete enterEvents[eventId];
}
/**
 * enter事件执行方法
 */
$(document).keypress(function(e) {  
	// 回车键事件  
	if(e.which == 13) {  
		//先判断是否pop框
		var popDiv = $(".modal.hide.fade.in");
		var event;
		if(popDiv.length>0){
			//当前显示pop框数量为一个时
			if(popDiv.length==1){
				event = enterEvents["popModelQueryLevel1"];
			}
		} else {
			event =  enterEvents["demandTaskDetailReport"];
		}
		if(typeof(event)!=="undefined"){
			event();
		}
	} 
}); 


$(document).ready(function(){	
	initPlaceholder();
	$("#queryprdPermitDetail").click(function(){
		report.init(); //初始化报表控件		
		report.setFile("product_approve_version.raq");//设置要显示的报表文件   
		report.setSaveAsName("投产评审表");
		report.putParam("org_no","<%=org_code%>");
		report.putParam("user_id","<%=suser.getUser_no() %>");
		report.putParam("system_name",encodeURIComponent($.trim($("#P_system_name").val())));
		report.putParam("versions_name",encodeURIComponent($.trim($("#P_versions_name").val())));
		report.putParam("req_task_state",$.trim($("#req_task_state").val()));	
		report.display(); //显示报表
	});
	//enter触发查询
	enterEventRegister("demandTaskDetailReport", function(){$("#queryprdPermitDetail").click();});

	$("#resetprdPermitDetail").click(function() {
		$("input[name^='P.']").val("");
		//$("#D_INTER_STATUS").Select2();
		//$("#D_INTER_STATUS").val("").trigger("change");
		initPlaceholder();
	});
});

function reportInitCallback(params){
	$(".header-h3").css(params);
}
//initDetailedlistSelect();

//服务方 pop
function OpeanSystemPopTR(){
	var $name = $("[name='P.system_name']");
	var $id = $("[name='P.system_id']");
	var $systemPop = $("[mod='systemPoptr']");		
	querysystemPoptr($systemPop, {id : $id, name : $name});
}

/* **************************重写应用pop框的js适应jsp********************** */

var SID5=window.parent.SID;

function querysystemPoptr(obj,callparams){

	$("#useInterfaceApply_systemPoP").remove();
	//加载pop框内容
	obj.load("../dev_application/useInterfaceApply/useInterfaceApply_systemPop.html",{},function(){
		var modObj = $("#useInterfaceApply_systemPop");
		modObj.modal("show");
		var qCall = getMillisecond();//表回调方法
		
		var queryParams = function(params) {
			var temp = {
				limit : params.limit, // 页面大小
				offset : params.offset
			// 页码
			};
			return temp;
		};
		var sUrl = dev_application+"useApplyManage/systemQueryList.asp?SID=" + 
				SID5 + "&call=" + qCall;
		if(callparams.type == "con"){//消费方应用
			sUrl = sUrl + "&app_user=" + SID5;
		}
		modObj.find("[tb='table_system']").bootstrapTable({
			url :sUrl,
			method : 'get', // 请求方式（*）
			striped : false, // 是否显示行间隔色
			cache : false, // 是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
			sortable : true, // 是否启用排序
			sortOrder : "asc", // 排序方式
			queryParams : queryParams,// 传递参数（*）
			sidePagination : "server", // 分页方式：client客户端分页，server服务端分页（*）
			pagination : true, // 是否显示分页（*）
			pageList : [ 5, 10, 15 ], // 可供选择的每页的行数（*）
			pageNumber : 1, // 初始化加载第一页，默认第一页
			pageSize : 5, // 每页的记录行数（*）
			clickToSelect : true, // 是否启用点击选中行
			// height: 460, //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
			uniqueId : "SYSTEM_ID", // 每一行的唯一标识，一般为主键列
			cardView : false, // 是否显示详细视图
			detailView : false, // 是否显示父子表
			singleSelect : true,// 复选框单选
			jsonpCallback:qCall,
			onDblClickRow:function(row){
				callparams.id.val(row.SYSTEM_ID);
				callparams.name.val(row.SYSTEM_NAME);
				modObj.modal("hide");
			},onLoadSuccess : function(data){
				gaveInfo();
			},
			columns : [ {
				field : 'order_id',
				title : '序号',
				align : "center",
				width : "50px",
				formatter:function(value,row,index){
					return index + 1;
				}
			}, {
				field : 'SYSTEM_NAME',
				title : '应用名称',
				align : "center"
			}, {
				field : "SYSTEM_SHORT",
				title : "应用简称",
				align : "center"
			}, {
				field : "PROJECT_MAN_NAME",
				title : "项目经理",
				align : "center"
			}]
		});
		
		//重置按钮
		$("#reset_system").click(function(){
			$("input").not("[type='button']").val("");
		});
		//查询按钮
		$("#query_system").click(function(){
			var param =$("#interSystemForm").serialize();
			var sUrl = dev_application+"useApplyManage/systemQueryList.asp?SID=" + 
					SID5 + "&call=" + qCall + "&"+param;
			if(callparams.type == "con"){//消费方应用
				sUrl = sUrl + "&app_user=" + SID5;
			}
			$("[tb='table_system']").bootstrapTable('refresh',{
				url:sUrl});
		});		
		
	});
}
</script>
<script src="../ztree3.5.22/js/jquery.ztree.core.min.js"></script>
<script src="../ztree3.5.22/js/jquery.ztree.excheck.min.js"></script>
<script src="../ztree3.5.22/js/jquery.ztree.exedit.min.js"></script>
</body>
</html>