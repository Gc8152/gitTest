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
<title>投产计划跟踪表</title>
</head>
<body>
<div id="test1" style="width:100%;height:1000px;">
	<form id ="prdPlanFowllerForm" action="" class="form-inline">
		<div class="ecitic-inquire" id="">
			<div class="ecitic-table" id="ecitic-table">
				<table width="100%" border="0" cellspacing="0" cellpadding="0" class="table table-bordered table-bor-pad requirement-table">
					<tr>
						<td class="ecitic-right" style="width:10%">应用名称：</td>
						<td style="width:20%"><input type="text" name="D.system_name" id="D_system_name" class="requirement-ele-width" onclick="OpeanMainSystemPop()" readonly/>
							<input type="hidden"   name="D.system_id" id="D_system_id" >
						</td>										
						<td  class="ecitic-right" style="width:10%">投产版本：</td>
						<td style="width:20%"><input type="text" name="D.versions_name" id="D_versions_name" class="requirement-ele-width"/></td>
						<td class="ecitic-right" style="width:10%">受理时间：</td>
					<td style="width:30%">
						<div style="float:left;width:45%; ">
							<input type="text"  name="D.summit_time_start" id="sum_time_start" data-format="yyyy-MM-dd" onClick="WdatePicker({});" value="" placeHolder="" class="requirement-ele-width" readonly/>					
						</div>
						<div style="float:left;width:10%;line-height:26px;">&nbsp;至&nbsp;</div>
						<div style="float:left;width:45%;">
							<input type="text" name="D.summit_time_end" id="sum_time_end" data-format="yyyy-MM-dd" class="requirement-ele-width" value="" placeHolder="" onClick="WdatePicker({});" readonly/>
						</div>
					</td>
					</tr>
				</table>
			</div>
			<ul class="ecitic-btn-all">
				<li><input type="button" class="btn btn-ecitic" id="queryprdPlanFowller" value="查询"/></li>
				<li><input type="button" class="btn btn-ecitic" id="resetprdPlanFowller" value="重置"/></li>
			</ul>
		</div>
	</form>
	<br/><br/>
	<div mod="mainsystemPop"></div>
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
	$("#queryprdPlanFowller").click(function(){
		report.init(); //初始化报表控件		
		report.setFile("prd_plan_fowllor.raq");//设置要显示的报表文件   
		report.setSaveAsName("投产计划跟踪表");
		report.putParam("org_no","<%=org_code%>");
		report.putParam("user_id","<%=suser.getUser_no() %>");
		report.putParam("system_name",encodeURIComponent($.trim($("#D_system_name").val())));
		report.putParam("versions_name",encodeURIComponent($.trim($("#D_versions_name").val())));	
		var start_date = $.trim($("#sum_time_start").val());
		var end_date = $.trim($("#sum_time_end").val());
		//时间格式兼容
		if(start_date == null || start_date ==""){
			start_date="1970-01-01";
		}
		if(end_date == null || end_date ==""){
			end_date="2099-01-01";
		}
		report.putParam("start_date",start_date);
		report.putParam("end_date",end_date);
		report.display(); //显示报表
	});
	//enter触发查询
	enterEventRegister("demandTaskDetailReport", function(){$("#queryprdPlanFowller").click();});


	$("#resetprdPlanFowller").click(function() {
		$("input[name^='D.']").val("");
		//$("#D_INTER_STATUS").Select2();
		//$("#D_INTER_STATUS").val("").trigger("change");
		initPlaceholder();
	});
});
var curDate=new Date();
var curTime=curDate.getFullYear()+"-"+((curDate.getMonth()+1)<10?"0":"")+(curDate.getMonth()+1)+"-"+(curDate.getDate()<10?"0":"")+curDate.getDate();
var t=getlastmonth(curDate);
var startcurTime=t.getFullYear()+"-"+((t.getMonth()+1)<10?"0":"")+(t.getMonth()+1)+"-"+(t.getDate()<10?"0":"")+t.getDate();
$("#sum_time_start").val(startcurTime);
$("#sum_time_start").attr("placeHolder",startcurTime);
$("#sum_time_end").val(curTime);
$("#sum_time_end").attr("placeHolder",curTime);
function getlastmonth(date){
	var lastmonth = new Date(date.getFullYear(),date.getMonth()+1,date.getDate(),date.getHours(),date.getMinutes(),date.getSeconds());
	var curdate = date.getDate();
	lastmonth.setDate(-1);//上一月，当前月为一月时这种写法会退到上一年十二月
	lastmonth.setDate(0);//上月最后一天
	var lastmax = lastmonth.getDate();
	if(curdate <= lastmax){//天值不大于上月最大一天，天值同步
	lastmonth.setDate(curdate);
	}
	return lastmonth;
	}
//时间控件
function initDate(){
	$("#summit_time_start").focus(function() {
		WdatePicker({
			dateFmt : 'yyyy-MM-dd',
			minDate : '1990-01-01',
			maxDate : '2050-12-01'
		});
		window.parent.calendarSkinAnalysisIframeCss();
	});
	$("#summit_time_end").focus(function() {
		WdatePicker({
			dateFmt : 'yyyy-MM-dd', 
			minDate : '1990-01-01',
			maxDate : '2050-12-01'
		});
		window.parent.calendarSkinAnalysisIframeCss();
	});
}
function reportInitCallback(params){
	$(".header-h3").css(params);
}
//initDetailedlistSelect();

//主线应用pop

function OpeanMainSystemPop(){
	var $name = $("[name='D.system_name']");
	var $id = $("[name='D.system_id']");
	var $systemPop = $("[mod='mainsystemPop']");		
	queryMainsystemPop($systemPop, {id : $id, name : $name});
}

/* **************************重写应用pop框的js适应jsp********************** */

var SID4=window.parent.SID;

function queryMainsystemPop(obj,callparams){
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
				SID4 + "&call=" + qCall;
		if(callparams.type == "con"){//消费方应用
			sUrl = sUrl + "&app_user=" + SID4;
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
					SID4 + "&call=" + qCall + "&"+param;
			if(callparams.type == "con"){//消费方应用
				sUrl = sUrl + "&app_user=" + SID4;
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