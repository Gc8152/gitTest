<%@ page language="java" contentType="text/html; charset=UTF-8"   pageEncoding="UTF-8"%>
<%@ taglib uri="/reportJsp/runqianReport4.tld" prefix="report" %>
<%@ page import="com.yusys.entity.SUser"%>
<%
        SUser user=(SUser)request.getSession().getAttribute("userinfo");
		String skin_type = user.getSkin_type();
%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
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
<link rel="stylesheet" type="text/css" href="../css/skin_<%=skin_type %>/skin.css" id="report-iframe"/>
 <style type="text/css">
 .popModal input{
 	width: 190px!important;
 }
 #demandDetailReportForm input{
 	height:26px;
 }
 </style>
</head>
<body id="body">
<div id="test1" style="width:100%;height:1000px;">
	<form id ="systemDetailReportForm" action=""  class="form-inline">
		<div class="ecitic-inquire" id="ecitic-inquire">
			<div class="ecitic-table" id="ecitic-table">
				<table width="100%" border="0" cellspacing="0" cellpadding="0" class="table table-bordered table-bor-pad requirement-table">
					<tr>
						<td class="ecitic-right" style="width:10%">应用名称：</td>
						<td style="width:20%">
						<input type="text" name="SYS.system_name" id="system_name" class="requirement-ele-width"/>
						</td>
						<td class="ecitic-right"  style="width:10%">应用简称：</td>
						<td style="width:20%">
						<input type="text" name="SYS.system_short" id="system_short" class="requirement-ele-width"/>
						</td >
						<td class="ecitic-right" >项目经理：</td>
						<td style="width:20%">
						<input type="text" name="SYS.project_man_name" id="project_man_name" class="requirement-ele-width"/>
						</td >				
					    </tr>			
					<tr>
						<td class="ecitic-right">产品经理：</td>
						<td style="width:20%">
						<input type="text" name="SYS.product_man_name" id="product_man_name" class="requirement-ele-width"/>
						</td >
						<td class="ecitic-right"  style="width:15%">测试经理：</td>
						<td style="width:20%">
						<input type="text" name="SYS.test_man_name" id="test_man_name" class="requirement-ele-width"/>
						</td>
						<td class="ecitic-right" >应用状态：</td>
						<td style="width:20%">						
							<select id="system_status"  name="SYS.system_status" class="requirement-ele-width" style="width:100%;">
								<option value=" ">请选择</option>
								<option value="01">未上线</option>
								<option value="02">运行中</option>
								<option value="03">待下线</option>
								<option value="04">已废弃</option>	
							</select>
						
						</td>			
					</tr>
					
					
				</table>
			</div>
			<ul class="ecitic-btn-all">
				<li><button type="button" id="system_query" class="btn btn-ecitic">查询</button></li>
				<li><button type="button" id="system_reset" class="btn btn-ecitic">重置</button></li>
				<!-- <li class="ecitic-more"></li> -->
			</ul>
		</div>	
	</form>
	<div id="test">
			<script  language=javascript>
	             var report = new runqianReport( "100%", "100%" );
	             report.setBorder( "border:1px solid blue" );  //设置控件为兰色细边框
	            report.setServerURL(dev_report);
	   		</script>
	</div>
</div>
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
		$("#system_query").click(function(){
			report.init(); //初始化报表控  
			report.setFile("system_detail.raq");//设置要显示的报表文件   
			report.setSaveAsName("应用明细表");
			report.putParam("system_name",encodeURIComponent($.trim($("#system_name").val())));
			report.putParam("system_short",$.trim($("#system_short").val()));
			report.putParam("project_man_name",encodeURIComponent($.trim($("#project_man_name").val())));
			report.putParam("product_man_name",encodeURIComponent($.trim($("#product_man_name").val())));
			report.putParam("test_man_name",encodeURIComponent($.trim($("#test_man_name").val())));
			report.putParam("system_status",$.trim($("#system_status").val()));
			report.display(); //显示报表
		});
		//enter触发查询
		enterEventRegister("demandTaskDetailReport", function(){$("#system_query").click();});

		$("#system_reset").click(function() {
			$("input[name^='SYS.']").val("");
			$("select[name^='SYS.']").val("");
			initPlaceholder();
		});
	});
	function reportInitCallback(params){
		$(".header-h3").css(params);
	}
</script>
<script src="../ztree3.5.22/js/jquery.ztree.core.min.js"></script>
<script src="../ztree3.5.22/js/jquery.ztree.excheck.min.js"></script>
<script src="../ztree3.5.22/js/jquery.ztree.exedit.min.js"></script>
</body>
</html>
