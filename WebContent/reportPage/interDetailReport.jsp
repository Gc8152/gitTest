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
<!-- <link rel="stylesheet" href="../bootstrap/css/matrix-style.css" /> -->
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
<title>接口清单表</title>
</head>
<body>
<div class="main_iframe_con">
	<form id ="interdetailedlist_querylistForm" action="" class="form-inline">
		<div class="ecitic-inquire" id="ecitic-inquire">
			<div class="ecitic-table" id="ecitic-table">
				<table width="100%" border="0" cellspacing="0" cellpadding="0" class="table table-bordered table-bor-pad">
					<tr>
						<td width="11%" class="ecitic-right">接口编号：</td>
						<td width="21.333%"><input type="text" name="S.INTER_CODE" id="D_INTER_CODE"/></td>
						<td width="11%" class="ecitic-right">接口名称：</td>
						<td width="21.333%"><input type="text" name="S.INTER_NAME" id="D_INTER_NAME"/></td>
						<td width="11%" class="ecitic-right">接口状态：</td>
						<td width="21.333%">
							<select name="S.INTER_STATUS" id="D_INTER_STATUS">
  							<option value=" ">请选择</option>
							<option value="00">待建</option>
						 	<option value="01">在建</option>
							<option value="02">执行中</option>
							<option value="03">变更中</option>
							</select>
						</td>
					</tr>
					<tr>
						<td class="ecitic-right">服务方应用名称：</td>
						<td><input type="text" name="S.SYSTEM_NAME" id="D_SYSTEM_NAME" onclick="OpeanserSystemPopT()" readonly/>
							<input type="hidden"   name="SYSTEM_ID" id="SYSTEM_ID" >
						</td>
						<td class="ecitic-right">接口描述：</td>
						<td><input type="text" name="S.INTER_DESCR" id="D_INTER_DESCR"/>								
						</td>
						<td></td>						
					</tr>
				</table>
			</div>
			<ul class="ecitic-btn-all">
				<li><input type="button" class="btn btn-ecitic" id="queryDetailedlist" value="查询"/></li>
				<li><input type="button" class="btn btn-ecitic" id="resetDetailedlist" value="重置"/></li>
			</ul>
		</div>
	</form>
	<div mod="sersystemPop"></div>
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
	$("#queryDetailedlist").click(function(){
		report.init(); //初始化报表控件		
		report.setFile("inter_detailed_list.raq");//设置要显示的报表文件   
		report.setSaveAsName("接口清单明细表");
		report.putParam("org_no","<%=org_code%>");
		report.putParam("user_id","<%=suser.getUser_no() %>");
		report.putParam("INTER_CODE",encodeURIComponent($.trim($("#D_INTER_CODE").val())));
		report.putParam("INTER_NAME",encodeURIComponent($.trim($("#D_INTER_NAME").val())));
		report.putParam("INTER_STATU",encodeURIComponent($.trim($("#D_INTER_STATUS").val())));
		report.putParam("SYSTEM_NAME",encodeURIComponent($.trim($("#D_SYSTEM_NAME").val())));
		report.putParam("INTER_DESCR",encodeURIComponent($.trim($("#D_INTER_DESCR").val())));	
		report.display(); //显示报表
	});
	//enter触发查询
	enterEventRegister("demandTaskDetailReport", function(){$("#queryDetailedlist").click();});

	$("#resetDetailedlist").click(function() {
		$("input[name^='S.']").val("");
		//$("#D_INTER_STATUS").Select2();
		$("#D_INTER_STATUS").val(" ").trigger("change");
		initPlaceholder();
	});
});
//下拉框方法
function initDetailedlistSelect(){//初始化字典失效写死下拉菜单配合sql解决//
	initSelect($("#D_INTER_STATUS"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"I_DIC_INTER_STATUS"});
}
function reportInitCallback(params){
	$(".header-h3").css(params);
}
//initDetailedlistSelect();

//服务方 pop
function OpeanserSystemPopT(){
	var $name = $("[name='S.SYSTEM_NAME']");
	var $id = $("[name='SYSTEM_ID']");
	var $systemPop = $("[mod='sersystemPop']");		
	querysystemPopt($systemPop, {id : $id, name : $name});
}

/* **************************重写应用pop框的js适应jsp********************** */

var SID3=window.parent.SID;

function querysystemPopt(obj,callparams){

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
				SID3 + "&call=" + qCall;
		if(callparams.type == "con"){//消费方应用
			sUrl = sUrl + "&app_user=" + SID3;
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
					SID3 + "&call=" + qCall + "&"+param;
			if(callparams.type == "con"){//消费方应用
				sUrl = sUrl + "&app_user=" + SID3;
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