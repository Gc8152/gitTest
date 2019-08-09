<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
 <%@ page import="com.yusys.entity.SUser"%> 
 <%
		SUser user=(SUser)request.getSession().getAttribute("userinfo");
        String pstandard = user.getStandard();//获取用户密码是否符合规范标识
		String user_no=user.getUser_no();
		String user_name=user.getUser_name();
		String org_no=user.getOrg_no();
		String iscreate=user.getIscreate();
		String org_no_name=user.getOrg_no_name();
		String org_name=user.getOrg_name();		
		if(user.getOrg_name()==null||user.getOrg_name().trim().length()==0){
			org_name=user.getOrg_no_name();
		}
		String email=user.getUser_mail()==null?"":user.getUser_mail();
		String skin_type = user.getSkin_type();
		String is_banker = user.getIs_banker();
		String work_no = user.getWork_no();
		String view_no = user_no;
		String user_roles=user.getUser_roles();
		if("00".equals(is_banker) && null != work_no){
			view_no = work_no;
		}
	%>
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<meta http-equiv="X-UA-Compatible" content="IE=8"/>
<title>研发管理平台</title>
<meta http-equiv="x-ua-compatible" content="IE=7,9,10" >
<!-- <meta http-equiv="Pragma" content="no-cache" > -->
<meta http-equiv="Cache-Control" content="no-cache" >
<link rel="stylesheet" href="bootstrap/css/bootstrap.min.css" />
<link rel="shortcut icon" href="images/x-icon.png" type="image/x-icon" />
<!-- 字体图标 -->
<link rel="stylesheet" href="bootstrap/font-awesome-4.7.0/css/font-awesome.min.css">
<link rel="stylesheet" href="bootstrap/css/select2.css" />
<link rel="stylesheet" href="bootstrap/css/bootstrap-datetimepicker.min.css" />
<link type="text/css" href="bootstrap/css/bootstrap-table.min.css" rel="stylesheet"/>
<link href="ztree3.5.22/css/zTreeStyle/zTreeStyle.css" rel="stylesheet">
<link rel="stylesheet" type="text/css" href="css/zebra_dialog.css"/>
<link rel="stylesheet" href="css/style.css"/>
<script src="js/artTemplate/template.js"></script>
<script src="js/jquery/jquery-1.9.1/jquery.min.js"></script>
<script src="js/commons/index_dispatch.js"></script>
<script src="bootstrap/js/bootstrap.min.js"></script>
<script src="bootstrap/js/select2.min.js"></script>
<script src="bootstrap/js/bootstrap-datetimepicker.min.js"></script>
<script src="bootstrap/js/bootstrap-datetimepicker.zh-CN.js"></script>
<script src="js/My97DatePicker/WdatePicker.js"></script>
<script src="js/commons/placeholders.js"></script>
<script src="js/commons/commons.js"></script>
<script src="js/commons/main.js"></script>
<script type="text/javascript" src="js/zebra_dialog/zebra_dialog.js"></script>
<script src="ztree3.5.22/js/jquery.ztree.core.min.js"></script>
<script src="ztree3.5.22/js/jquery.ztree.excheck.min.js"></script>
<script src="ztree3.5.22/js/jquery.ztree.exedit.min.js"></script>
<script src="js/commons/alertAndConfirm.js"></script>
<script src="bootstrap/js/bootstrap-table.min.js"></script>
<script src="bootstrap/js/bootstrap-table-zh-CN.js"></script>
<script type="text/javascript" src="pages/sfunction/sfunction.js"></script>	
<!-- easyUI -->
<link rel="stylesheet" type="text/css" href="js/jquery-easyui-1.5/themes/default/easyui.css">
<link rel="stylesheet" type="text/css" href="js/jquery-easyui-1.5/themes/icon.css">
<script type="text/javascript" src="js/jquery-easyui-1.5/jquery.easyui.min.js"></script>
<script type="text/javascript" src="js/jquery-easyui-1.5/locale/easyui-lang-zh_CN.js"></script>
<link rel="stylesheet" type="text/css" href="css/form.css"/>
<link rel="stylesheet" type="text/css" href="css/skin_<%=skin_type %>/skin.css" id="css_style"/>
<script type="text/javascript">
var skin_type="<%=skin_type %>";
$(document).ready(function(){
	$("a[rel='skin_<%=skin_type %>']").parent().append("<em></em>");
	face_skin.init();
});
</script>
</head>
<body id="body">
	<!--主页头部部分公共-->
	<input type="hidden" value="<%=iscreate %>" id="isCreate"/>
	<input type="hidden" value="<%=user_name %>" id="currentLoginName"/>
	<input type="hidden" value="<%=user_no %>" id="currentLoginNo"/>
	<input type="hidden" value="<%=org_no %>" id="currentLoginNoOrg_no"/>
	<input type="hidden" value="<%=org_name %>" id="currentLoginNoOrg_name"/>
	<input type="hidden" value="<%=skin_type %>" id="currentLoginskin"/>
	<input type="hidden" value="<%=pstandard %>" id="pstandard"/>
	<input type="hidden" value="<%=user_roles %>" id="currentUser_roles"/>
	<div class="main_header">
		<div class="headerArea">
			<div class="logo">
				<img src="images/login1111.png" /> 
			</div>
			<ul class="rightTopHelp">
				<li class="ecitic-Menu"><div class="cgb-system" id="cgb-system"><i class="fa fa-bars"></i>其他模块<b></b></div><!--系统--></li>
				<li class="ecitic-skin"><div class="change-skin" id="change-skin"><i class="fa fa-bandcamp"></i>选择皮肤<b></b></div><!--系统--></li>
				<li class="ecitic-user"><i class="fa fa-user"></i><%=user_name %><b></b></li>
				<li class="ecitic-set" ><i class="fa fa-question-circle" aria-hidden="true"></i>知识库<b></b></li>
				<li class="ecitic-exit" id="ecitic-exit"><i class="fa fa-power-off" aria-hidden="true"></i>退出</li>
			</ul>
			<!-- 其他模块 -->
			<i class="user-astSYS"></i>
			<div class="cgb-system-content" id="cgb-system-content">
				<ul class="cgb-system-list"></ul>
				<div class="cgb-system-t" id="cgb-system-t" style=""></div>
				<div class="cgb-system-r" id="cgb-system-r" style=""></div>
				<div class="cgb-system-b" id="cgb-system-b" style=""></div>
				<div class="cgb-system-l" id="cgb-system-l" style=""></div>
				<div class="cgb-system-k" id="cgb-system-k" style="width: 470px;"></div>
				<div class="cgb-system-p" id="cgb-system-p" style="height: 216px;"></div>
				<div class="cgb-system-plan" id="cgb-system-plan" style="left: 79px; width: 391px;"></div>
				<div class="cgb-system-research" id="cgb-system-research" style="height: 216px;"></div>
			</div>
			<div class="ecitic-user-content">
				<div class="">
					<div class="user-ast"></div>
					<div class="user-img"><img src="images/renwu.png" /></div>
					<div class="user-Info" >
						<h2>用户名：<%=user_name %></h2>
						<ul>
							<li>工号 : <%=view_no %></li>
							<li title="<%=org_name %>">部门 : <%=org_name %></li>
							<li title="<%=email %>">邮箱 : <%=email %></li>
						</ul>
					</div>
					<div class="clear"></div>
				</div>
				<div class="editCodeand" >
					<span><a onclick="updatePass('<%=user_no %>','<%=user_name %>')"  name="update_pw" id="update_pw" ><font color="blue">修改密码</font></a></span>
					<span><a onclick="queryUser('<%=user_no %>','<%=user_name %>')" name="user_info" id="user_info" ><font color="blue">个人信息</font></a></span> 
				</div>
			</div>
			<div class="ecitic-change-skin theme">
				<div class="user-ast user-skin"></div>
				<div class="user-ast user-skin1"></div>
				<ul>
					<li><a rel="skin_00" title="红色" style="background:#ae0a29;"><i class="red"></i></a></li>
					<li><a rel="skin_01" title="黄色" style="background:#c67c00;"><i class="yellow"></i></a></li>
					<li><a rel="skin_02" title="蓝色" style="background:#0470bc;"><i class="blue"></i></a></li>
					<li><a rel="skin_03" title="绿色" style="background:#00893d;"><i class="green"></i></a></li>
				</ul>
			</div>
		</div>
  		<ul class="list_tree_nav">
	 		<li id="firsttit" class="tree_first" onclick="pageDispatch('my_work_terrace')" tabid="my_work_terrace" id="my_work_terrace_tit">首页</li>
	 		<li>
	 			<ul class="list_tree_1nav"></ul>
	 		</li>
	 		<li id="tree_last" title="全部关闭"></li>
		</ul>
	</div>
	<div class="main_all">
		<div class="main_container" id="ecitic-sidebar">
			<div class="cgb-left-all open">
				<div class="cgb-menu-title"><span></span></div>
					<div class="nui-tree-all">
					<ul class="nui-tree">
						<li>
							<ul level="1" class="gundong" id="gundongNavWrap"></ul>
						</li>
					</ul>
				</div>
			</div>
			
		</div>
		<a href="javascript:;" target="_self" class="suo" id="sidebar-btn" title="展开/折叠"></a>
		<!--主页右侧分公共-->
		<div class="main_iframe" id="main_iframe">
			<!-- <div class="zzc"></div> -->
			<div class="yourLocation">
				<i class="fa fa-home"></i>
				<span>您所在的位置：首页</span>
				<div class="main-add" title="添加常规操作"></div>
	        </div>
	        <div id="contentHtml">
				<div page="menu_my_work_terrace" style="display:block;height: 550px;">
 					 <iframe width="100%" height="150%" src="" scrolling="no" id="workbenchIframe"  name="workbenchIframe" class="citic-iframe" frameborder="no"></iframe>   
				</div>
	        </div>
		</div>
        <div id="myModal_remind" class="modal hide fade" style="top: 25%;  width: 780px; height: 235px" tabindex="-1">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" title="点击关闭">×</button>
                <h3>我的提示</h3>
            </div>
            <div class="modal-body">
                <table id="remindBacklog_info" class="table table-bordered table-hover"></table>
            </div>
        </div>
        <div id="myModal_upPassword" class="modal hide fade" style="top: 15%;  width: 650px; left:50%; margin-left:-325px; height: 450px" tabindex="-1">
            <div class="modal-header">
                <h3>用户密码修改</h3>
            </div>
            <form action="" class="form-inline" id="updatePassword_form">
		      <div class="ecitic-title-table" style = "text-align:center">
		        <div style="align:center;color:red">
                   <h5>您的密码过于简单，请修改密码后重新登录！</h5>
                </div>
			    <table id="updateuser_table" style="align:center; width:90%;margin:0 auto" border="0" cellspacing="0" cellpadding="0" class="table table-bordered tablr-input-text table-bor-paw">
				  <tr>
					<td width="22%" class="table-text">用户编号：</td>
					<td width="78%">
						<input type="text" name="Us.user_no" id="user_no" readonly/>
					</td>
				  </tr>
				  <tr>
					<td class="table-text">用户名称：</td>
					<td>
						<input type="text" name="Us.user_name" id="user_name" readonly/>
					</td>
				  </tr>
				  <tr>
					<td class="table-text">旧密码：</td>
					<td>
						<input type="password" name="Us.old_password" id="old_password" validate="v.required" valititle="该项为必填项"/>
					</td>
				  </tr>
					<tr>
					<td class="table-text">新密码：</td>
					<td>
						<input type="password" name="Us.new_password" id="new_password" validate="v.passwordFp" valititle="该项为必填项" style="display:none"/>
						<input type="text" name="new_password_str" id="new_password_str"  placeholder="请填写以字母开头并至少包含一位数字且长度为8-18位的密码！"/>
						<!-- <span style="align:center;color:red;font-size:12px">
                           (请填写以字母开头并包含数字且长度为8-18位的密码！)
                        </span> -->
					</td>
				   </tr>
				   <tr>
					<td class="table-text">再次输入新密码：</td>
					<td>
						<input type="password" name="Us.password" id="Uspassword"  validate="v.required" valititle="该项为必填项"/>
					</td>
				   </tr>
			    </table>
		    </div>
	      </form>
	      <div class="ecitic-save">
		      <input class="btn btn-ecitic" value="保存" id="save_password" type="button" />
		      <input class="btn btn-ecitic" value="重置" id="pop_passReset" type="button" />
	      </div>
        </div>
	</div>
</body>
</html>
<script type="text/javascript">
    var SID = $("#currentLoginNo").val();//全局变更SID
    var skinFlag = $("#currentLoginskin").val();//用户皮肤值;
    var lastPage="";//记录上次打开的页签
    var stopInterval=true;//停止计时器的标志
	//内容
	//$(".main_iframe").load("/yxms/pages/query.html");
	//点击 用户信息、 系统模块、 皮肤切换 时显示隐藏  当点击body其他地方 隐藏 
	(function(){
		/* openIndexC("index","首页","indexC.html",function(){}); */
		var pstandard = $("#pstandard").val();
		if(pstandard=="notNormal"){//用户密码不符合规范
			$("#myModal_upPassword").modal({
				backdrop:"static"
			});
		    $("#user_no").val($("#currentLoginNo").val());
		    $("#user_name").val($("#currentLoginName").val());
			initVlidate($("#updatePassword_form"));
		}
		var ishow=false;
		$(".ecitic-user").click(function(){
			$(".ecitic-change-skin").hide();//隐藏皮肤 
			systemHide();//隐藏系统 
			$("#cgb-system-content").animate({opacity:'hide',height:"0px",display:'none'},800);
			ishow=true;
			$(".ecitic-user-content").slideToggle("fast");//显示和隐藏切换
		});
		
		/* 选择皮肤事件 */
		$(".ecitic-skin").click(function(){
			$(".ecitic-user-content").hide();//隐藏用户信息
			systemHide();//隐藏系统 
			$("#cgb-system-content").animate({opacity:'hide',height:"0px",display:'none'},800);
			ishow=true;//显示时 不隐藏
			$(".ecitic-change-skin").slideToggle("fast");//显示和隐藏切换
		});
		
		$(".ecitic-user-content").on("click",function(){
			ishow=true;//显示时 不隐藏
		});
		function systemHide(){
			$(".cgb-system-content").stop(true, true);
			$(".cgb-system").removeClass("cgb-system-current");
			$(".cgb-system-content").animate({top:'40px',opacity:'hide',height:"0",display:'none'},800);
			$(".user-astSYS").hide();
		}
		function systemShow(){
			$(".ecitic-change-skin").hide();
			$(".ecitic-user-content").hide();
			if($(".cgb-system-content:visible").length>0){
				systemHide();
			}else{
				var reSysList_W=$(".cgb-system-list").outerWidth();
				var reSysList_Hh=$(".cgb-system-list").outerHeight();
				var reSysList_Hli=$(".cgb-system-list li").outerHeight();
				var reSystem=$(".cgb-system").outerWidth()+1;
				
				var reSysT = document.getElementById("cgb-system-k");
				var reSysR = document.getElementById("cgb-system-p");
				var reSysB = document.getElementById("cgb-system-plan");
				var reSysL = document.getElementById("cgb-system-research");
				
				var reSysList_Len=Math.ceil($(".cgb-system-list li").length/4);//判断li有多少行
				var reSysList_H40=reSysList_Hli*reSysList_Len+reSysList_Hh;
				var reSysList_H404=reSysList_H40;
				//边框大小
				reSysT.style.width=reSysList_W+"px";
				reSysR.style.height=reSysList_H404+"px";
				reSysB.style.left=reSystem+"px";
				reSysB.style.width=reSysList_W-reSystem+"px";
				reSysL.style.height=reSysList_H404+"px";
				$(".cgb-system-content").stop(true, true);
				$(".cgb-system").addClass("cgb-system-current");
				$(".cgb-system-content").width(reSysList_W).animate({top:'40px',opacity:'show',height:reSysList_H40,display:'block'},500);
				$(".user-astSYS").delay(250).show(250);
			}
		}
		$(".cgb-system").click(function(){
			systemShow();
			ishow=true;//显示时 不隐藏
		});
		$(document).on("click","body:eq(0)",function(){//点击body其的地方 根据 isshow判断是否隐藏
			if(!ishow){
				$(".ecitic-user-content").hide();
				$(".ecitic-change-skin").hide();
				systemHide();
			}
			ishow=false;
		});
		initPasswordUpdateBtn();//密码修改按钮事件
        remindDialo();//查找与当前登录人相关的待投产和待受理的任务
        endLoading();
	})();
    function  remindDialo(){
        $("#remindBacklog_info").bootstrapTable({
            method : 'get', //请求方式（*）
            striped : false, //是否显示行间隔色
            cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
            sortable : true, //是否启用排序
            sortOrder : "asc", //排序方式
            queryParams : {},//传递参数（*）
            sidePagination : "client", //分页方式：client客户端分页，server服务端分页（*）
            pagination : true, //是否显示分页（*）
            pageList : [10,15],//每页的记录行数（*）
            pageSize : 10,//可供选择的每页的行数（*）
            uniqueId : "P_BACKLOG", //每一行的唯一标识，一般为主键列
            cardView : false, //是否显示详细视图
            detailView : false, //是否显示父子表
            jsonpCallback:call,
            singleSelect: true,
            responseHandler: function(data){
                return data.rows;
            },
            columns : [{
                field : 'P_BACKLOG',
                title : '待办项名称',
                align : "center"
            }, {
                field : "P_NUM",
                title : "待办项条数",
                align : "center"
            }, {
                field : "OPT",
                title : "操作",
                align : "center",
                formatter:function(value,row,index){
                    var cfi_edit=   cfi_edit="<a id='notice_info' style='color:#0088cc; cursor:pointer;'  onclick=remindOpenTab('"+row.P_BACKLOG+"')>查看详情</a>";
                    return cfi_edit;
                }
            }]
        });

        var call=getMillisecond();
        baseAjaxJsonp(dev_workbench+'Backlog/remindDialog.asp?call='+call+'&SID='+SID,"", function(data){
        	if(data!=null&&data!=undefined){//判断后台已经启动，请求正常发送
              if (data.isShow != "Y" || data.rows.length < 1) {
                return;
              }
              $("#remindBacklog_info").bootstrapTable("load", data.rows);
              $("#myModal_remind").modal("show");
        	}
        },call);
    }
    function remindOpenTab(P_BACKLOG){
        $("#myModal_remind").modal("hide");
        $('#myModal_remind').remove();
        if(P_BACKLOG=="任务待受理"){
           //iframeOpenTab('task_accept_unreceived','任务受理','dev_construction/requirement/requirement_analyze/task_accept/taskAcceptUnreceived_querylist.html');
        	iframeOpenTab('task_accept','任务受理','dev_construction/requirement/requirement_analyze/task_accept/taskAccept_querylist.html?menu_no=task_accept');
        }else if(P_BACKLOG=="待提交投产"){
           iframeOpenTab('sendproapply','投产申请','dev_construction/send_produce/sendproduceapply/sendProduceApply.html');
        }
    }
	//侧边栏收合
	$("#sidebar-btn").click(function(){
		var MainIframe=document.getElementById("main_iframe");
		$("#ecitic-sidebar").toggle();
		$(".suo").toggleClass("marginLeft0");
		if($(".suo").is(".marginLeft0")){
			MainIframe.style.marginLeft="16px";
		}else{
			MainIframe.style.marginLeft="215px";
		}
	});
	
	//手风琴效果
	function dropdownAccordion() {
		var Accordion = function(clickItemElStr,el, multiple){
			this.el = el || {};
			this.multiple = multiple || false;
			var links = this.el.find(clickItemElStr);
			links.off("click").on('click',{
				el: this.el,
				multiple: this.multiple
			},this.dropdown);
		};
		Accordion.prototype.dropdown = function(e){
			e.stopPropagation();  //防止事件冒泡
			var $el = e.data.el;
			$this = $(this);
			$next = $this.nextAll();
			var $sibling=$this.parent().parent().siblings(".nuinone");
			var $sibling3=$this.parent().parent().parent().parent().siblings(".nuinone");
			$parentUl = $this.parent().parent(); //父类ul展开的时候，点击子类显示子类菜单时候，父类菜单不合起来。
			$parentUl3 = $this.parent().parent().parent().parent();
			$next.slideToggle();
			$this.parent().toggleClass('open');
			if (!e.data.multiple){
		 	   $el.find('ul').not($next).not($parentUl).not($parentUl3).not($sibling).not($sibling3) //排除当前，排除父类 排除同级
		  	  .slideUp().parent().removeClass('open');
			};
			var tree_label=$(".nui-tree-item-label");
			for(var i=0;i<tree_label.length;i++){
				var treeObj=$(tree_label[i]);
				var treeul=treeObj.siblings("ul");	
				/* if(treeul.length>0){
					treeObj.find("img").show();
				}else{
					treeObj.find("img").hide();
				} */
			}
		};
		var accordion = new Accordion('.nui-tree-item-labelNav',$('#gundongNavWrap'), false); 
		var accordion2 =  new Accordion('.duojiMenu',$(".nuinone"), false);
	};
	dropdownAccordion();
	
	//密码修改按钮事件
	function initPasswordUpdateBtn(){
		initPlaceholder();
		//重置
		$("#pop_passReset").click(function(){
			$("#old_password").val("");
			$("#new_password").val("");
			$("#Uspassword").val("");
		});
		
		//保存
		$("#save_password").click(function(){
			if(!vlidate($("#updatePassword_form"))){
				return ;
			}
			//首先判断旧密码是否正确
			oldPassworkBlurFunc(function(){
				var old_pwd_el = $("#old_password");
				if(old_pwd_el.parent().find(".tag-content").length>0){
					return;
				}
				var new_password = $("#new_password").val();
				var password = $("#Uspassword").val();
				if(new_password!=password){
					alert("两次输入密码不同");
					return ;
				}
				var user_no = $("#user_no").val();
				var old_pwd=old_pwd_el.val();
				var params ={"user_no":user_no,"password":password,"old_pwd":old_pwd};
				 baseAjax("SUser/updatepass.asp",params, function(data) {
					if (data != undefined&&data!=null&&data.result=="true") {
						alert("密码修改成功",function(){
							toLoginPage();
						});
					}else{
						alert("密码修改失败");
					}
				}); 
			});
		});
		
		var old_password=$("#old_password");
		//原密码输入框聚焦事件
		old_password.focus(function(){
			//清除原密码错误class标识
			oldPassworkFocusFunc();
		});
		//原密码输入框失焦事件
		old_password.blur(function(){
			//判断旧密码是否正确，并增加提示
			oldPassworkBlurFunc();
		});
		var new_password = $("#new_password");//新密码输入框
		var new_password_str = $("#new_password_str");//placeholder提示专用框（因ie8下placeholder显示为黑点，且无法通过临时切换type属性实现）
		//新密码提示框聚焦事件
		new_password_str.focus(function(){
			new_password_str.hide();//提示框隐藏
			new_password.show();//输入框显示
			new_password.focus();//获得焦点
		});
		//新密码输入框失焦事件
		new_password.blur(function(){
			if(new_password.val()==""){//如果没有输入值，隐藏输入框，显示placeholder提示框
				new_password.hide();
				new_password_str.show();	
			}
		});
	}
	
	//判断旧密码是否正确
	function oldPassworkBlurFunc(func){
		var user_no = $("#user_no").val();
		var password = $("#old_password").val();
		if($.trim(password).length==0){
			return;
		}
		var params = {"user_no":user_no,"password":password};
		baseAjaxNoLoading("SUser/finduserpass.asp",params, function(data) {
			if (data != undefined&&data!=null&&data.result=="false") {
				//alert("旧密码错误,请再次输入旧密码");
				$("#old_password").parent().append('<div  id="'+Math.uuid()+'"  class="tag-content" >旧密码错误,请再次输入旧密码</div>');
			}
			if(func){
				func();
			}
		});
	}
	
	//清除密码错误class标识
	function oldPassworkFocusFunc(){
		$("#old_password").parent().find(".tag-content").remove();
	}
	//获取iframe高度
	/* $(".citic-iframe").load(function(){
		var iframe_h=$(this).contents().find("body").height()+30;
		$(this).height(iframe_h);
	}); */
</script>
<!-- 初始化主菜单 -->
<script id="initLeftMenuLevel1" type="text/html">
	<li menu_no={{MENU_NO}}  class="gundongNav">
		<div class="nui-tree-item-label nui-tree-item-labelNav pl{{15*MENU_LEVEL}}" onclick=pageDispatch('{{MENU_NO}}')>
			<span class="nui-tree-item-img"><img src="{{MENU_ICON}}" /></span>
			<span class="tit" id="{{MENU_NO}}">{{MENU_NAME}}</span>
        {{if CONNECT_BY_ISLEAF=='0'}}
			 <img src="images/21.png" class="arrowNav">
        {{/if}}
        </div>
	</li>
</script>
<!-- 初始化主菜单 -->
<script id="initLeftMenuLevel2" type="text/html">
	<li menu_no={{MENU_NO}}  class="gundongNav">
		<div class="nui-tree-item-label nui-tree-item-labelNav pl{{15*MENU_LEVEL}}" onclick=pageDispatch('{{MENU_NO}}')>
			<span class="tit" id="{{MENU_NO}}">{{MENU_NAME}}</span>
        {{if CONNECT_BY_ISLEAF=='0'}}
          <img src="images/21.png" class="arrowNav">
        {{/if}}
		</div>
	</li>
</script>
<script type="text/javascript">
	//常用功能分类切换
	Tag_tab($(".cgb-tab li"),$(".cgb-left-all"));
	//标签切换(注解：变量tab_li是点击的元素,变量tab_ul切换的主题内容元素)
	function Tag_tab(tab_li,tab_ul){
		tab_li.click(function(){
			var $this = $(this);
			var $t = $this.index();
			tab_li.removeClass("current");
			$this.addClass("current");
			tab_ul.removeClass("open");
			tab_ul.eq($t).addClass("open");
		});
	};


	//为首页的iframe 添加皮肤颜色
    function IframeSkinChange(skinFlag){
  	  var iframeSkin="<link rel='stylesheet' type='text/css' href='css/skin_"+skinFlag+"/skin.css' id='css_style_iframe'/>";
  	  if($(window.frames["workbenchIframe"].document).find("#css_style_iframe").length!=0){
  		  $(window.frames["workbenchIframe"].document).find("#css_style_iframe").remove();
  		  $(window.frames["workbenchIframe"].document).find("head").append(iframeSkin);
  	  }else {
  		  $(window.frames["workbenchIframe"].document).find("head").append(iframeSkin); 
  	  }
    }
	/* 修改MY97日历框的颜色 */
	function calendarSkin(skin_type){
		var myIframe=$("#_my97DP iframe");
		var head=$(myIframe[0].contentWindow.document).find("head");
		var browser;
		var b_version=navigator.appVersion; 
		var version; 		
		var trim_Version;
		var indexTridentStar=window.navigator.userAgent.indexOf("Trident")+8;
		var indexTridentEnd;
		try{
			browser=navigator.appName;
			version=b_version.split(";"); 
			trim_Version=version[1].replace(/[ ]/g,"");
			indexTridentEnd=window.navigator.userAgent.substring(indexTridentStar,indexTridentStar+3);
		}catch(e){
			browser="Microsoft Internet Explorer1";
			trim_Version="MSIE8.0";
			indexTridentEnd="4.0";	
		}
		var iframeSkin;
		if(browser=="Microsoft Internet Explorer" && trim_Version=="MSIE8.0" && indexTridentEnd==4.0) 
		{ 
			iframeSkin="<link rel='stylesheet' type='text/css' href='css/skin_"+skinFlag+"/skin.css' id='my97_css_style_iframe'/>";
		}else{
			iframeSkin="<link rel='stylesheet' type='text/css' href='../../css/skin_"+skinFlag+"/skin.css' id='my97_css_style_iframe'/>";
		} 
	  	if(head.find("#my97_css_style_iframe").length!=0){
	  		head.find("#my97_css_style_iframe").remove();
	  		head.append(iframeSkin);
	  	}else {
	  		head.append(iframeSkin); 
	  	}
		stopInterval=false;
	};
	/*换肤添加标识*/
	$(".theme ul li").click(function(){
		$(".theme ul li em").remove();
    	$(this).append("<em></em>");
    	skinFlag=$(this).find("a").attr("rel").split("_")[1];
    	$("#workbenchIframe")[0].contentWindow.startSwitchSkin();
    });
	/* 网站护肤 */
	 (function(face_skin){
		 var e=".theme li";
		 var b = "#css_style";
		 var a = function (g) {
	       	 var ff = jQuery(b).attr("href").split("/")[jQuery(b).attr("href").split("/").length - 2]; 
	                if (jQuery(b).size() != 0) {
	                    jQuery(b).attr("href", jQuery(b).attr("href").replace(ff, g.find("a").attr("rel")));
	                    skinFlag=g.find("a").attr("rel").split("_")[1];
	                    IframeSkinChange(skinFlag);
	                    calendarSkin(skinFlag);
	                    changeStatisticAnalysisIframeCss();
	                }
	        };
	        face_skin.init=function(){
        		jQuery(e).click(function (g) {
                	a(jQuery(this));
	                calendarSkinAnalysisIframeCss();
	                $(".ecitic-change-skin").hide();
	                var skin_type=skinFlag;
	                baseAjax("SUser/updateSkinType.asp",{
	                	user_no : SID,
	                	skin_type : skin_type
	                }, function(data) {
	                			endLoading();
	                			if (data.result=="true") {
	                				/* alert("修改成功"); */
	                				
	                			}else{
	                				alert("修改失败");
	                			}
	                		});
	                leftLevel1MenuTxImg();
	                g.stopPropagation();
	            });
        	};
	})(face_skin={});
	 window.onresize=function(){
//	     changeFrameHeight();
	};
   $("#workbenchIframe").load(function(){
// 	 	changeFrameHeight();//为首页的iframe 添加皮肤颜色
   		IframeSkinChange(skinFlag);
   });
    var MY97setInterval=setInterval(function(){
       var my97DPIframe=$("#_my97DP iframe");
	   if(!stopInterval){
		   clearInterval(MY97setInterval);
	   }else if(my97DPIframe.length!=0 && $(my97DPIframe[0].contentWindow.document).find("head").length!=0){
		   calendarSkin(skinFlag);
	   }
	},500);
    
//修改统计分析各页面皮肤色
function changeStatisticAnalysisIframeCss(){
	  var iframeArry=document.getElementsByTagName('iframe');
	  var browser;
		var b_version=navigator.appVersion; 
		var version; 		
		var trim_Version;
		var indexTridentStar=window.navigator.userAgent.indexOf("Trident")+8;
		var indexTridentEnd;
		try{
			browser=navigator.appName;
			version=b_version.split(";"); 
			trim_Version=version[1].replace(/[ ]/g,"");
			indexTridentEnd=window.navigator.userAgent.substring(indexTridentStar,indexTridentStar+3);
		}catch(e){
			browser="Microsoft Internet Explorer1";
			trim_Version="MSIE8.0";
			indexTridentEnd="4.0";	
		}
		var iframeSkin;
	  if(browser=="Microsoft Internet Explorer" && trim_Version=="MSIE8.0" && indexTridentEnd==4.0){ 
		  iframeSkin="<link rel='stylesheet' type='text/css' href='css/skin_"+skinFlag+"/skin.css' id='report-iframe'/>";
	  }else{
		  iframeSkin="<link rel='stylesheet' type='text/css' href='../css/skin_"+skinFlag+"/skin.css' id='report-iframe'/>";
	  } 
	  for(var i=0;i<iframeArry.length;i++){
		  if(iframeArry[i].id=="reportIframe"){
			  var head=$(iframeArry[i].contentWindow.document).find("head");
			  var reportIframeCss=head.find("#report-iframe");
				 if(reportIframeCss.length!=0){
			  		  reportIframeCss.remove();
			  		  head.append(iframeSkin);
			  	  }else {
			  		head.append(iframeSkin); 
			  	  }
		  }
	  }
}
/* 修改统计分析各页面MY97日历框的颜色 */
function calendarSkinAnalysisIframeCss(){
	    var iframeArry=document.getElementsByTagName('iframe');
	    var browser;
		var b_version=navigator.appVersion; 
		var version; 		
		var trim_Version;
		var indexTridentStar=window.navigator.userAgent.indexOf("Trident")+8;
		var indexTridentEnd;
		try{
			browser=navigator.appName;
			version=b_version.split(";"); 
			trim_Version=version[1].replace(/[ ]/g,"");
			indexTridentEnd=window.navigator.userAgent.substring(indexTridentStar,indexTridentStar+3);
		}catch(e){
			browser="Microsoft Internet Explorer1";
			trim_Version="MSIE8.0";
			indexTridentEnd="4.0";	
		}
		var iframeSkin;
		if(browser=="Microsoft Internet Explorer" && trim_Version=="MSIE8.0" && indexTridentEnd==4.0) 
		{ 
			 iframeSkin="<link rel='stylesheet' type='text/css' href='css/skin_"+skinFlag+"/skin.css' id='my97_css_style_iframe'/>";
		}else{
			 iframeSkin="<link rel='stylesheet' type='text/css' href='../../css/skin_"+skinFlag+"/skin.css' id='my97_css_style_iframe'/>";
		} 
	    for(var i=0;i<iframeArry.length;i++){
		  if(iframeArry[i].id=="reportIframe"){
			  var my97IframeReport=$(iframeArry[i].contentWindow.document).find("#_my97DP iframe");
				  var head=$(my97IframeReport[0].contentWindow.document).find("head");
				  	if(head.find("#my97_css_style_iframe").length!=0){
				  		head.find("#my97_css_style_iframe").remove();
				  		head.append(iframeSkin);
				  	}else {
				  		head.append(iframeSkin); 
				  	}
		  }
	  }
	
};
</script>
