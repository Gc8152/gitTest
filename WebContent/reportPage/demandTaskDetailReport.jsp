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
<link rel="stylesheet" type="text/css" href="../css/public.css"/>
<script type="text/javascript" src="../js/jquery/jquery-1.9.1/jquery.min.js"></script>
<script src="../bootstrap/js/select2.min.js"></script>
<script src="../js/artTemplate/template.js"></script>
<script src="../js/commons/commons.js"></script>
<script src="../js/commons/menu_commons-wh.js"></script>
<script type="text/javascript" src="../js/My97DatePicker/WdatePicker.js"></script>
<script src="../js/runqianReport_fy.js"></script>
<script src="../bootstrap/js/bootstrap.min.js"></script>
<script src="../bootstrap/js/bootstrap-table.min.js"></script>
<script src="../bootstrap/js/bootstrap-table-zh-CN.js"></script>
<link rel="stylesheet" type="text/css" href="../css/skin_<%=skin_type %>/skin.css" id="report-iframe"/>
 <style type="text/css">
 .popModal input{
 	width: 190px!important;
 }
 #demandTaskDetailReportForm input{height:26px;}
 </style>
</head>
<body id="body">
<div id="test1" style="width:100%;height:1000px;">
	<form id ="demandTaskDetailReportForm" action=""  class="form-inline">
	<div class="ecitic-inquire" id="ecitic-inquire">
		<div class="ecitic-table" id="ecitic-table">
			<table width="100%" border="0" cellspacing="0" cellpadding="0" class="table table-bordered table-bor-pad requirement-table">
				<tr>
					<td class="ecitic-right" style="width:10%">需求任务编号：</td>
					<td style="width:20%">
						<input type="text" name="T.req_task_code" id="req_task_code" class="requirement-ele-width"/>
					</td>
					<td class="ecitic-right"  style="width:10%">任务状态：</td>
					<td style="width:25%">
						<select id="req_task_state"  name="T.req_task_state" class="requirement-ele-width" style="width:100%;">
							<option value="">请选择</option>
							<option value="00">草拟</option>
						 	<option value="01">待受理</option>
							<option value="02">退回</option>
							<option value="03">需求任务分析</option>
							<option value="04">入版待实施</option>
							<option value="05">开发设计</option>
						 	<option value="06">详细设计</option>
							<option value="07">编码开发</option>
							<option value="08">联调测试</option>
							<option value="09">SIT测试</option>
						 	<option value="10">UAT测试</option>
							<option value="11">部署验证</option>
							<option value="12">提交投产</option>
							<option value="13">任务完成</option>
						 	<option value="14">任务无效</option>
						 	<option value="15">任务关闭</option>
						</select>
						<!-- diccode="G_DIC_REQTASK_STATE" -->
					</td>
					<td class="ecitic-right" >任务类型：</td>
					<td style="width:25%">
						<select id="req_task_type"  name="T.req_task_type" class="requirement-ele-width" style="width:100%;">
							<option value="">请选择</option>
							<option value="00">元数据变更任务	</option>
						 	<option value="01">需求任务</option>
							<option value="02">问题单任务</option>
						</select>
						<!-- diccode="G_REQ_TASK_TYPE" -->
					</td>
					
				</tr>
		
				<tr>
					<td class="ecitic-right">纳入版本：</td>
					<td class="positionAb">
						<input type="text" name="T.version_name" id="version_name"  class="requirement-ele-width"/>
						<input type="hidden" name="T.version_id" id="version_id" >
					</td>
					<td class="ecitic-right"  style="width:15%">任务责任人：</td>
					<td class="positionAb">
						<input type="text" name="T.p_owner_name" id="p_owner_name" class="requirement-ele-width" /><!-- onclick="OpenUserPop()" -->
						<!-- <input type="hidden" name="T.p_owner" id="p_owner" > -->
					</td>
					<td class="ecitic-right" >创建时间：</td>
					<td>
						<div style="float:left; width:45%;">
							<input type="text"  name="T.starttime" id="starttime" data-format="yyyy-MM-dd" onClick="WdatePicker({});" class="requirement-ele-width" value="" placeHolder="" readonly/>
						</div>
						<div style="float:left;width:10%;line-height:26px;">&nbsp;至&nbsp;</div>
						<div style="float:left;width:45%;">
							<input type="text" name="T.endtime" id="endtime" data-format="yyyy-MM-dd" class="requirement-ele-width" onClick="WdatePicker({});" value="" placeHolder="" readonly/>
						</div>
					</td>
				</tr>
				<tr>
					<td class="ecitic-right" style="width:10%">应用名称：</td>
					<td style="width:20%">
						<input type="text" name="T.system_name" id="system_name" class="requirement-ele-width"/>
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
	<div id="reportDivUserinfo"></div>
	<div id="test">
			<script  language=javascript>
	             var report = new runqianReport( "100%", "100%" );
	             report.setBorder( "border:1px solid blue" );  //设置控件为兰色细边框
	            <%--  report.setServerURL('<%=url %>'); --%>
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

/* function OpenUserPop(){
	openUserPop("reportDivUserinfo",{name:$("#p_owner_name"),no:$("#p_owner")});	
} */
	$(document).ready(function(){
		initPlaceholder();
		$("#query").click(function(){
			report.init(); //初始化报表控件
			report.setFile("demand_task_detail.raq");//设置要显示的报表文件   
			report.setSaveAsName("需求任务明细表");
			report.putParam("org_no","<%=org_code%>");
			report.putParam("user_id","<%=suser.getUser_no() %>");
			report.putParam("system_name",encodeURIComponent($.trim($("#system_name").val())));
			report.putParam("req_task_code",encodeURIComponent($.trim($("#req_task_code").val())));
			report.putParam("req_task_state",$.trim($("#req_task_state").val()));
			report.putParam("req_task_type",$.trim($("#req_task_type").val()));
			//report.putParam("system_no",$.trim($("#system_no").val()));
			report.putParam("versions_name",encodeURIComponent($.trim($("#version_name").val())));
			report.putParam("p_owner_name",encodeURIComponent($.trim($("#p_owner_name").val())));
			var starttime = $.trim($("#starttime").val());
			var endtime = $.trim($("#endtime").val());
			//时间格式兼容
			if(starttime == null || starttime ==""){
				starttime="1970-01-01";
			}
			if(endtime == null || endtime ==""){
				endtime="2099-01-01";
			}
			report.putParam("start_date",starttime);
			report.putParam("end_date",endtime);
			report.display(); //显示报表
		});
		//enter触发查询
		enterEventRegister("demandTaskDetailReport", function(){$("#query").click();});

		$("#reset").click(function() {
			$("input[name^='T.']").val("");
			$("select[name^='T.']").val("");
			$("#req_task_state").val(" ");
			$("#req_task_type").val(" ");
/* 			$("#req_task_type").select2();
			$("#req_task_state").select2(); */
			$("#req_task_state").val("").trigger("change");
			$("#req_task_type").val("").trigger("change");
			initPlaceholder();
		});
	});
var curDate=new Date();
var curTime=curDate.getFullYear()+"-"+((curDate.getMonth()+1)<10?"0":"")+(curDate.getMonth()+1)+"-"+(curDate.getDate()<10?"0":"")+curDate.getDate();
var t=getlastmonth(curDate);
var startcurTime=t.getFullYear()+"-"+((t.getMonth()+1)<10?"0":"")+(t.getMonth()+1)+"-"+(t.getDate()<10?"0":"")+t.getDate();
$("#starttime").val(startcurTime);
$("#starttime").attr("placeHolder",startcurTime);
$("#endtime").val(curTime);
$("#endtime").attr("placeHolder",curTime);
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
		$("#starttime").focus(function() {
			WdatePicker({
				dateFmt : 'yyyy-MM-dd',
				minDate : '1990-01-01',
				maxDate : '2050-12-01'
			});
			window.parent.calendarSkinAnalysisIframeCss();
		});
		$("#endtime").focus(function() {
			WdatePicker({
				dateFmt : 'yyyy-MM-dd', 
				minDate : '1990-01-01',
				maxDate : '2050-12-01'
			});
			window.parent.calendarSkinAnalysisIframeCss();
		});
	}
/* 	 function initOrgTreeEvent(org_name,org_code){
		$("#"+org_name).click(function(){
			openSelectTreeDiv($(this),org_name+"ree_id","../SOrg/queryorgtreelist.asp",{width:'208px'},function(node){
				$("#"+org_name).val(node.name);
				$("#"+org_code).val(node.id);
			});
		});
		$("#"+org_name).focus(function(){
			$("#"+org_name).click();
		});
	} */
	function initTaskReportPopEvent(){
		$("#task_executor_name").click(function(){
			window.parent.reportOpenUserPop({name:$("#task_executor_name"),no:$("#task_executor")});
		});
		initOrgTreeEvent("execute_dept_name","execute_dept");
	} 
	//下拉框方法
/* 	function initTaskDetailReportType(){
		autoInitSelect($("#demandTaskDetailReportForm"),"../");
	} */
	function reportInitCallback(params){
		$(".header-h3").css(params);
	}
	initDate();
	//initTaskReportPopEvent();
	//initTaskDetailReportType();
	
//**************************重写用户pop框的js适应jsp**********************

function initUserPopOrgEvent(callback){
	$("#user_pop_org_name").unbind("click");//user_pop_org_code
	$("#user_pop_org_name").click(function(){
		openSelectTreeDiv($(this),"userPop_ree_id","../SOrg/queryorgtreelist.asp",{"margin-left":"130px",width:'180px'},function(node){
			$("#user_pop_org_name").val(node.name);
			$("#user_pop_org_code").val(node.id);
			if(callback){
				callback(node);
			}
		});
	});
	$("#user_pop_org_name").focus(function(){
		$("#user_pop_org_name").click();
	});
}
function openUserPop(id,callparams){
	$('#myModal_user').remove();
	$("#"+id).load("../pages/suser/suserPop.html",{},function(){
		$("#myModal_user").modal("show");
		autoInitSelect($("#pop_userState"));
		var url = "../SUser/popFindAllUser.asp?1=1";
		if(callparams.condition!=undefined){
			if("login_no"==callparams.condition){
				url = "../SUser/popFindAllUser.asp?login_no="+$("#currentLoginNo").val();
			}else{
				url = "../SUser/popFindAllUser.asp?login_no="+callparams.condition;
			}
		}
		if(callparams.notLoginNo_org!=undefined){
			if("notLoginNo_org"==callparams.condition){
				url = "../SUser/popFindAllUser.asp?notLoginNo_org="+$("#currentLoginNo").val();
			}else{
				url = "../SUser/popFindAllUser.asp?notLoginNo_org="+callparams.notLoginNo_org;
			}
		}
		if(callparams.role!=undefined&&callparams.role!="null"){
			url = url+"&role="+callparams.role;
		}
		if(callparams.org_no!=undefined){
			url = url+"&org_nos="+callparams.org_no;
		}
		userPop("#pop_userTable",url,callparams);
		initUserPopOrgEvent(function(node){
			if(callparams.name){
				callparams.name.data("node",node);
			}
		});
	});
}

var queryParams=function(params){
	var temp={
			limit: params.limit, //页面大小
			offset: params.offset //页码
	};
	return temp;
};	
	/**
	 * 用户POP框
	 */
	function userPop(userTable,userUrl,userParam){

		var singleSelect=true;
		if(userParam.singleSelect==false){
			singleSelect=false;
		}
		if(!singleSelect){
			$("#userPOPSureSelected").parent().show();
			$("#userPOPSureSelected").unbind("click");
			$("#userPOPSureSelected").click(function(){
				var ids = $(userTable).bootstrapTable('getSelections');
				if(userParam.name&&userParam.no){
					var kvs=arrayObjToStr2(userParam.no,ids,"USER_NO","USER_NAME","ORG_NO");
					if(""==userParam.name.val()||userParam.name.attr("placeholder")==userParam.name.val()){
						userParam.no.val(kvs[0]);
						userParam.name.val(kvs[1]);
						if(userParam.dept){ userParam.dept.val(kvs[2]);}
					}else if(""!=kvs[0]&&""!=kvs[1]){
						userParam.no.val(userParam.no.val()+","+kvs[0]);
						userParam.name.val(userParam.name.val()+","+kvs[1]);
						if(userParam.dept){userParam.dept.val(userParam.dept.val()+","+kvs[2]);}
					}
					$('#myModal_user').modal('hide');
				}
			});
		}else{
			$("#userPOPSureSelected").parent().hide();
		}
		var columns=[ 
            {
				field: 'middle',
				checkbox: true,
				rowspan: 2,
				align: 'center',
				valign: 'middle',
				visible:!singleSelect
			},
			/*{
				field : 'USER_NO',
				title : '用户编号',
				align : "center"
			},*/ {
				field : "USER_NAME",
				title : "用户名称",
				align : "center"
			}, {
				field : "LOGIN_NAME",
				title : "登陆名",
				align : "center"
			}, {
				field : "STATE",
				title : "用户状态",
				align : "center",
				 formatter:function(value,row,index){if(value=="00"){return "启用";}return "停用";}
					
			}, {
				field : "ORG_NO_NAME",
				title : "所属部门",
				align : "center"
			}, {
				field : "USER_MAIL",
				title : "用户邮箱",
				align : "center"
			}];
		var orgcode="";
		if(userParam.name&&userParam.name.data("node")){
			var node=userParam.name.data("node");
			orgcode="&org_code="+node.id;
			$("#user_pop_org_name").val(node.name);
			$("#user_pop_org_code").val(node.id);
		}
		
		//查询所有用户POP框 
		$(userTable).bootstrapTable("destroy").bootstrapTable({
					//请求后台的URL（*）
					url : userUrl+orgcode,
					method : 'get', //请求方式（*）   
					striped : true, //是否显示行间隔色
					cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
					sortable : true, //是否启用排序
					sortOrder : "asc", //排序方式
					queryParams : queryParams,//传递参数（*）
					sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
					pagination : true, //是否显示分页（*）
					pageList : [5,10,15],//每页的记录行数（*）
					pageNumber : 1, //初始化加载第一页，默认第一页
					pageSize : 5,//可供选择的每页的行数（*）
					clickToSelect : true, //是否启用点击选中行
					uniqueId : "user_no", //每一行的唯一标识，一般为主键列
					cardView : false, //是否显示详细视图
					detailView : false, //是否显示父子表
					singleSelect: singleSelect,
					onDblClickRow:function(row){
						if(singleSelect){
						$('#myModal_user').modal('hide');
						if(userParam.type=="appendPersons"){
							if(userParam.name.val()==""){
								userParam.name.val(row.USER_NAME);
								userParam.no.val(row.USER_NO);											
							}else{
								var codes = userParam.no.val();
								var code = codes.split(",");
								for(var i=0;i<code.length;i++){
									if(code[i]==row.USER_NO){alert("参会人员不可重复选择");return;}
								}
								var placeholder=userParam.name.attr("placeholder");
								if(userParam.name.val()==placeholder){
									userParam.name.val("");
								}
								var names = userParam.name.val();
								if($.trim(names)==""){
									userParam.name.val(row.USER_NAME);
									userParam.no.val(row.USER_NO);
								}else{
									userParam.name.val(names+","+row.USER_NAME);
									userParam.no.val(codes+","+row.USER_NO);
								}
							}
						}else{
							userParam.name.val(row.USER_NAME);
							userParam.no.val(row.USER_NO);			
							userParam.dept.val(row.ORG_NO);		
						}
						//根据用户编号查询关联角色
						if(userParam.role=="auth"){
					        $.ajax({
						           url:"../SRole/findAllRoleById.asp",
						           type:"post",
						           async: false,
						           data:{"user_no":row.USER_NO},
						           dataType:"json",
						           success:function(msg){
						        	   userParam.cascade.role_no.text("");
						        	   userParam.cascade.role_no.append("<option value=''  selected>-- 请选择 --</option>");
						        	   for(var i=0;i<msg.total;i++){
						        		   if(msg.rows[i].ROLE_NAME==undefined)break;
						        		   var option = "<option value="+msg.rows[i].ROLE_NO+">"+msg.rows[i].ROLE_NAME+"</option>";
						        		   userParam.cascade.role_no.append(option);
						        	   }
						        	   userParam.cascade.role_no.select2();
						           }
						      });
						}
						//根据用户编号查询关联机构 
						if(userParam.role=="auth"){
					        $.ajax({
						           url:"../SOrg/findAllOrgById.asp",
						           type:"post",
						           async: false,
						           data:{"user_no":row.USER_NO},
						           dataType:"json",
						           success:function(msg){
						        	   userParam.cascade.org_no.text("");
						        	   userParam.cascade.org_no.append("<option value=''  selected>-- 请选择 --</option>");
						        	   for(var i=0;i<msg.total;i++){
						        		   if(msg.rows[i].ORG_NAME==undefined)return;
						        		   var option = "<option value="+msg.rows[i].ORG_CODE+">"+msg.rows[i].ORG_NAME+"</option>";
						        		   userParam.cascade.org_no.append(option);
						        	   }
						        	   userParam.cascade.org_no.select2();
						           }
						      });
						}
						}
					},
					columns : columns
				});
			
		
		//用户POP重置
		$("#pop_userReset").click(function(){
			$("#myModal_userForm input").each(function(){
				$(this).val("");
			});
			
			if(userParam.name){
				userParam.name.removeData("node");
			}
			$("#pop_userState").val(" ");
			$("#pop_userState").select2();
		});
		//多条件查询用户
		$("#pop_userSearch").click(function(){
			var PopUserName = $("#pop_username").val();
			//var PopUserNo =  $("#pop_userCode").val();
			var PopUserLoginName = $("#pop_userLoginName").val();
			var PopUserState =  $.trim($("#pop_userState").val());
			var sorg_code =  $.trim($("#user_pop_org_code").val());
			$(userTable).bootstrapTable('refresh',{url:userUrl+"&PopUserName="+escape(encodeURIComponent(PopUserName))+"&PopUserLoginName="+PopUserLoginName+"&PopUserState="+PopUserState+"&org_code="+sorg_code});
		});
		enterEventRegister("popModelQueryLevel1", function(){getCurrentPageObj().find("#pop_userSearch").click();});
	}
</script>
<script src="../ztree3.5.22/js/jquery.ztree.core.min.js"></script>
<script src="../ztree3.5.22/js/jquery.ztree.excheck.min.js"></script>
<script src="../ztree3.5.22/js/jquery.ztree.exedit.min.js"></script>
</body>
</html>
