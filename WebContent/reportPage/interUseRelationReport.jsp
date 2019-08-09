<%@ page language="java" contentType="text/html; charset=UTF-8"   pageEncoding="UTF-8"%>
<%@ taglib uri="/reportJsp/runqianReport4.tld" prefix="report" %>
<%@ page import="com.yusys.entity.SUser"%>
<%
//StringBuffer s=new StringBuffer();
//String url="http://"+s.append(request.getServerName()).append(":").append(request.getServerPort()).append(request.getContextPath()).toString();
        SUser user=(SUser)request.getSession().getAttribute("userinfo");
		String skin_type = user.getSkin_type();
%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
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
	<form id ="interUseReportForm" action=""  class="form-inline">
		<div class="ecitic-inquire" id="ecitic-inquire">
			<div class="ecitic-table" id="ecitic-table">
				<table width="100%" border="0" cellspacing="0" cellpadding="0" class="table table-bordered table-bor-pad requirement-table">
					<tr>
						<td width="13%" class="ecitic-right">接口编号：</td>
						<td width="30%">
							<input type="text" name="I.inter_code" id="inter_code" class="requirement-ele-width"/>
						</td>
						<td width="13%" class="ecitic-right" >接口名称：</td>
						<td width="30%">
							<input type="text" name="I.inter_name" id="inter_name" class="requirement-ele-width"/>
						</td >
						<td width="13%" class="ecitic-right" >接口状态：</td>
						<td width="30%">						
							<select id="inter_status"  name="I.inter_status" class="requirement-ele-width" style="width:100%;">
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
						<td>
							<input type="text" name="I.ser_system_name" id="ser_system_name"  class="requirement-ele-width" onclick="OpeanserSystemPop()" readonly/>
							<input type="hidden"   name="ser_system_id" id="ser_system_id" >
						</td>
						<td class="ecitic-right" >消费方应用名称：</td>
						<td>
							<input type="text" name="I.con_system_name" id="con_system_name"  class="requirement-ele-width" onclick="OpeanconSystemPop()" readonly/>
							<input type="hidden"   name="con_system_id" id="con_system_id" >
						</td>
						<td class="ecitic-right" >接口描述：</td>
						<td>						
							<input type="text"  name="I.inter_descr" id="inter_descr" class="requirement-ele-width" />
						</td>
					</tr>
					
				</table>
			</div>
			<ul class="ecitic-btn-all">
				<li><button type="button" id="query" class="btn btn-ecitic">查询</button></li>
				<li><button type="button" id="reset" class="btn btn-ecitic">重置</button></li>
				<!-- <li class="ecitic-more"></li> -->
			</ul>
		</div>	
	</form>
		<div mod="systemPop"></div>
	<div id="test">
			<script  language=javascript>
	             var report = new runqianReport( "100%", "100%" );
	             report.setBorder( "border:1px solid blue" );  //设置控件为兰色细边框
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
		$("#query").click(function(){
			report.init(); //初始化报表控件
			report.setFile("interUseRelation_queryList.raq");//设置要显示的报表文件   
			report.setSaveAsName("接口调用关系表");
			report.putParam("user_id","<%=suser.getUser_no() %>");
			report.putParam("inter_name",encodeURIComponent($.trim($("#inter_name").val())));
			report.putParam("inter_code",encodeURIComponent($.trim($("#inter_code").val())));
			report.putParam("inter_statu",$.trim($("#inter_status").val()));
			report.putParam("ser_system_id",$.trim($("#ser_system_id").val()));
			report.putParam("con_system_id",$.trim($("#con_system_id").val()));
			report.putParam("inter_descr",encodeURIComponent($.trim($("#inter_descr").val())));
			report.display(); //显示报表
		});
		//enter触发查询
		enterEventRegister("demandTaskDetailReport", function(){$("#query").click();});

		$("#reset").click(function() {
			$("input[name^='I.']").val("");
			$("select[name^='I.']").val("");
			$("#ser_system_id").val("");
			$("#con_system_id").val("");
			$("#inter_status").val(" ").trigger("change");
			initPlaceholder();
		});

	});
	function reportInitCallback(params){
		$(".header-h3").css(params);
	}

	//消费方 pop
	function OpeanconSystemPop(){
		var $name = $("[name='I.con_system_name']");
		var $id = $("[name='con_system_id']");
		var $systemPop = $("[mod='systemPop']");
		querysystemPop($systemPop, {id : $id, name : $name});
	}
	//服务方 pop
	function OpeanserSystemPop(){
		var $name = $("[name='I.ser_system_name']");
		var $id = $("[name='ser_system_id']");
		var $systemPop = $("[mod='systemPop']");		
		querysystemPop($systemPop, {id : $id, name : $name});
	}

/* **************************重写应用pop框的js适应jsp********************** */

var SID2=window.parent.SID;

function querysystemPop(obj,callparams){
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
				SID2 + "&call=" + qCall;
		if(callparams.type == "con"){//消费方应用
			sUrl = sUrl + "&app_user=" + SID2;
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
					SID2 + "&call=" + qCall + "&"+param;
			if(callparams.type == "con"){//消费方应用
				sUrl = sUrl + "&app_user=" + SID2;
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
