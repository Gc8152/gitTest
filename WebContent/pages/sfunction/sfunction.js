/**
 * 获取页面的皮肤类型
 * @returns {String}
 */
function parentSkinType(){
	return (parent.skinFlag);
}

function startSwitchSkin(){
	var imgs=$(".word-content li .word-content-div img");//常用功能图片切换
	imgs.each(function(i,o){
		var img=$(o);
		var data=img.parent().parent().parent().data("data");
		img.attr("src","images/index"+parentSkinType()+"/"+data["MENU_IMG"]);
	});
	var imgs2=$(".noticeinfo span img");//通知公告 new图片切换
	imgs2.each(function(i,o){
		var img=$(o);
		var data=img.parent().parent().parent().data("data");
		img.attr("src","images/new"+parentSkinType()+".png");
	});
}
//计算 常规操作的滚动条
function shortcutOverflow(){
	var obj=$(".word-content li");
	if(obj.length>6){
		$(".word-content").css("overflow-y","auto");
	}else{
		$(".word-content").css("overflow-y","hidden");
	}
}
function hoverNormberFunc(){
	$(".word-content li .word-content-div").unbind("hover").hover(function(){
		var img=$(this).find("img");
		var src=img.attr("src");
		if(img.length>0&&src.indexOf("_1.png")==-1){
			img.attr("src",src.replace(".png","_1.png"));
		}
	},function(){
		var img=$(this).find("img");
		if(img.length>0){
			img.attr("src",img.attr("src").replace("_1.png",".png"));
		}
	});
	$(".word-content li .word-content-div").unbind("click").click(function(){
		var img=$(this).find("img");
		if(img.length>0){
			img.attr("src",img.attr("src").replace("_1.png",".png"));
		}
	});
}
//获取常规操作HTML对象
function addShortcutHtmlObj(data){
	var obj=$('<li name="workBench"><div class="word-content-div"><i></i><span class="word-content-img"><img src="images/index'+parentSkinType()+"/"+data["MENU_IMG"]+'"/></span><span class="word-content-text">'+data["MENU_NAME"]+'</span><div></li>');
	obj.data("data",data);
	$("#workul li[class='work-add']").before(obj);	
}
//获取pop框常用功能html对象
function addMoreFunctionHtmlObj(data){
	var obj=$('<li><div class="word-content-div"><i></i><span class="word-content-img"><img src="images/index'+parentSkinType()+'/'+data["MENU_IMG"]+'"/></span><span class="word-content-text">'+data["MENU_NAME"]+'</span></div></li>');
	obj.data("data",data);
	$("#work_more li[class='work-add']").before(obj);	
}
//设置常用功能区域滚动条加载
function wordContentW(){
	var wordContentL = $("[name='workBench']").length;
	if(wordContentL>7){
		$(".word-content").css({"margin-right":"0"});
	}else{
		$(".word-content").css({"margin-right":"-10px"});
	}
}
//工作台显示常用功能
function initWorkbenchFunction(){
	$.ajax({
		type : "post",
		url : "SFunction/queryAllWorkbenchFunctionByUser.asp",
		async :  true,
		data : "",
		dataType : "json",
		success : function(data) {
			if(data&&data.length>0){
				$("li[name='workBench']").remove();
				for(var i=0;i<data.length;i++){
					addShortcutHtmlObj(data[i]);
				}
				shortcutOverflow();
				hoverNormberFunc();
				wordContentW();
			}
		},
		error : function() {				
		}
	});
}
//工作台更多显示常用功能
function initPopWorkbenchFunction(){
	$.ajax({
		type : "post",
		url : "SFunction/queryAllWorkbenchFunctionByUser.asp",
		async :  true,
		data : "",
		dataType : "json",
		success : function(data) {
			var obj=$("#work_more li[class!='work-add']");
			obj.remove();
			if(data&&data.length>0){
				for(var i=0;i<data.length;i++){
					addMoreFunctionHtmlObj(data[i]);
				}
				hoverNormberFunc();
			}
		},
		error : function() {				
		}
	});
}

function queryWorkbench(){
	//工作台显示常用功能
	initWorkbenchFunction();
	var isRemove=false;
	//移除用户常规操作 

	$(document).on("click",".word-content li .word-content-div i",function(){
		isRemove=true;
		var obj=$(this);
		onconfirm("确定要移除该常规操作?",function(){
			var parent=obj.parent().parent();
			var menu_code=parent.data("data")["MENU_CODE"];
			baseAjax("SFunction/delWorkbenchFunctionByMenucode.asp",{menu_code:menu_code},function(data){
				if(data&&data.result=="true"){
					parent.remove();
					var work_more=$("#workul li[class!='work-add']");
					work_more.remove();
					initWorkbenchFunction();
					shortcutOverflow();
				}else{
					alert("删除失败!");
				}
			});
		});
	});
	//常用功能打开页面
	$(document).on("click",".word-content li[class!='work-add']",function(){
		if(!isRemove){
			var data=$(this).data("data");
			window.parent.iframeOpenTab(data["MENU_CODE"],data["MENU_NAME"],data["MENU_URL"]);
		}
		isRemove=false;
	});
	//隐藏 常规操作增加div
	$(document).on("click",".work-add-popup-all i",function(){
		$(".work-add-popup-all").hide();
	});
	 addWorkBench();
	 myWork_workBench();
};
/**
 * nconfirm函数[确定,取消]
 */
function onconfirm(msg,sureback,cancelback){
	window.parent.nconfirm(msg,sureback,cancelback);
}

function addWorkBench(){
	var ishide=true;
	//工作台常用功能添加操作
	$(document).on("click","#workul li[class='work-add']",function(){
		ishide=false;
		baseAjax("SFunction/queryOtherWorkbenchFunctionByUser.asp",{},function(data){
			var popup=$(".work-add-popup-all .work-add-popup");
			popup.empty();
			if(data&&data.length>0){
				var obj={};
				for(var i=0;i<data.length;i++){
					obj=$("<li>"+data[i]["MENU_NAME"]+"</li>");
					popup.append(obj);
					obj.data("data",data[i]);
				}
			}
		});		
		$(".work-add-popup-all").show();
	});
	//更多常用功能添加
	$(document).on("click","#work_more li[class='work-add']",function(){
		ishide=false;
		baseAjax("SFunction/queryOtherWorkbenchFunctionByUser.asp",{},function(data){
			var popup=$(".work-add-popup-all-pop .work-add-popup-pop");
			popup.empty();
			if(data&&data.length>0){
				var obj={};
				for(var i=0;i<data.length;i++){
					obj=$("<li>"+data[i]["MENU_NAME"]+"</li>");
					popup.append(obj);
					obj.data("data",data[i]);
				}
			}
		});		
		$(".work-add-popup-all-pop").show();
	});
	//更多快捷操作 事件
	$(document).on("click","#morefunction",function(){
		$("#morefunctionpop").modal("show");
		initPopWorkbenchFunction();		
	});
	$(document).on("click",".work-add-popup-all",function(){
		ishide=false;
	});
	//增加 常规操作
	$(document).on("click",".work-add-popup-all li",function(){
		ishide=false;
		var obj=$(this);
		baseAjax("SFunction/addUserWorkBenchFunction.asp",{menu_code:obj.data("data")["MENU_CODE"]},function(data){
			if(data&&data.result=="true"){
				addShortcutHtmlObj(obj.data("data"));
				obj.remove();
				shortcutOverflow();
				if($(".work-add-popup-all li").length==0){
					$(".work-add-popup-all").hide();
				}
				wordContentW();
			}else{
				alert("常规操作添加失败!");
			}
			hoverNormberFunc();
		});
	});
	//更多时增加常用功能
	$(document).on("click",".work-add-popup-all-pop li",function(){
		ishide=false;
		var obj=$(this);
		baseAjax("SFunction/addUserWorkBenchFunction.asp",{menu_code:obj.data("data")["MENU_CODE"]},function(data){
			if(data&&data.result=="true"){
				addShortcutHtmlObj(obj.data("data"));
				addMoreFunctionHtmlObj(obj.data("data"));
				obj.remove();
				shortcutOverflow();
				if($(".work-add-popup-all-pop li").length==0){
					$(".work-add-popup-all-pop").hide();
				}
			}else{
				alert("常规操作添加失败!");
			}
			hoverNormberFunc();
		});
	});
	$(document).on("click","body",function(){
		if(ishide){
			$(".work-add-popup-all").hide();
			$(".work-add-popup-all-pop").hide();
		}
		ishide=true;
	});
};
//获取通知HTML对象
function addNoticeHtmlObj(mes,mess){
	var curVal = mes.DAY;
	if (curVal <= 7 ) {
		var obj=$('<li class="noticeinfo"><i></i><span>'+mes["NOTICE_TITLE"]+'<img src="images/new'+parentSkinType()+'.png" width="28"  /></span><b>'+mes["SEND_TIME"]+'</b></li>');
	    obj.data("mes",mes);
		$("#work_inform").append(obj);
	}
	else if (curVal > 7) {
		var obj=$('<li class="noticeinfo"><i></i><span>'+mes["NOTICE_TITLE"]+'</span><b>'+mes["SEND_TIME"]+'</b></li>');
		obj.data("mes",mes);
		$("#work_inform").append(obj);
	}
	/*var obj=$('<li class="noticeinfo"><i></i><span>'+mes["NOTICE_TITLE"]+'</span><b>'+mes["SEND_TIME"]+'</b></li>');
	obj.data("mes",mes);
	$("#work_inform").append(obj);*/	
}
//获取通知popHTML对象
function addNoticePopHtmlObj(mes){
	var obj=$('<li  class="noticeinfo"><i></i><span>'+mes["NOTICE_TITLE"]+'</span><b>'+mes["SEND_TIME"]+'</b></li>');
	obj.data("mes",mes);
	$("#work_informpop").append(obj);	
}
//显示工作台通知
function queryNotice(){
	var SID=window.parent.SID;
	var call=getMillisecond();
	$("li[class='noticeinfo']").remove();
	  baseAjaxJsonp(dev_workbench+'notice/userAllNotice.asp?call='+call+'&SID='+SID+'&limit=5&offset=0',null,function(mes){
		      if(mes){		
		    	  	$("li[class='noticeinfo']").remove();
		    	  	$("span[name='noNotice']").remove();
					if(mes.total==0){
						  var obj=$('<span name="noNotice" style="height: 34px; width: 58%;line-height: 34px;">无通知</span>');
						  $("#work_inform").append(obj);
					  }else{
						  for(var i=0;i<mes.rows.length;i++){
								 addNoticeHtmlObj(mes.rows[i]);
							 } 
					  }
					  $("#noticenum").text("("+mes.total+")");				
		           }
	  }, call);
    //点击查询通知详情
   $(document).one("click","li[class='noticeinfo']",function(){
		var sid=SID;
		var data=$(this).data("mes");
		var NOTICE_ID=data["NOTICE_ID"];
		parent.closeAndOpenInnerPageTab("queryDetail", "查看通知", "dev_workbench/notice/notice_queryInfoFromIndexC.html", function(){
			$("#morenoticepop").modal("hide");
			parent.initNotieDetailInfoFromIndexC(NOTICE_ID,sid);
		});
	});
    //通知更多按钮
   $(document).one("click","#morenotice",function(){
	   openInnerPageTabIndexC("morenotice", "更多通知公告", "dev_workbench/notice/notice_queryListMore.html", function(){	
	   });
	});
   endLoading();
};
//工作台我的工作html对象
function addMyWorkHtmlObj(mes){
	var obj=$('<li><span>'+mes["PLANNAME"]+'<img alt="" title="工作进度延迟" src="images/delayer'+parentSkinType()+'.png"></span><button class="btn btn-ecitic">报工</button></li>');
	obj.data("mes",mes);
	$("#work_wait").append(obj);	
}
//工作台显示我的工作
//{total=7, rows=[{TASKTYPE=工作任务, PLANID=19270.8, ROW_NUM=1, IS_FINISH_AFFIRM=00, PKID=5bc4e1ae8cd04be9bb9ba2142331aaaf, ENDTIME=2017-04-28, STARTTIME=2017-04-01, PLANNAME=老司机},
function myWork_workBench (){
	var SID=window.parent.SID;
	var call=getMillisecond(); 
	var cuttTime=getCurrentTime(10);	
	baseAjaxJsonp(dev_planwork+'workCon/findAll.asp?call='+call+'&SID='+SID+'&limit=5&offset=0'+'&cuttTime='+cuttTime, null,  function(mes){
		if(mes){
			if(mes.total==0){
				  var obj=$('<span style="height: 34px; width: 58%;line-height: 34px;">无待办工作</span>');
				  $("#work_wait").append(obj);
				  endLoading();
			  }else{
				  for(var i=0;i<mes.rows.length;i++){
					  addMyWorkHtmlObj(mes.rows[i]);
					 } 
			  }
			  $("#myWorkNum").text("("+mes.total+")");
		} 	
	}, call);
	//报工按钮点击事件
	$(document).on("click","button[class='btn btn-ecitic']",function(){	
		window.parent.iframeOpenTab("taskwork","任务报工","dev_planwork/work/attendanceCalendar_add.html");

	});
	//更多按钮点击事件
	$(document).on("click","#moreMyWork",function(){	
		window.parent.iframeOpenTab("taskwork","任务报工","dev_planwork/work/attendanceCalendar_add.html");
	});
};

/**
* 获取当前时间 value: 时间格式
*/

function getCurrentTime(value) {
	var num = parseInt(value);
	var date = new Date();
	var year = date.getFullYear();
	var month = (date.getMonth() + 1) < 10 ? ("0" + (date.getMonth() + 1))
			: (date.getMonth() + 1);
	var day = date.getDate() < 10 ? ("0" + date.getDate()) : date.getDate();
	var hours = date.getHours() < 10 ? ("0" + date.getHours()) : date
			.getHours();
	var minutes = date.getMinutes() < 10 ? ("0" + date.getMinutes()) : date
			.getMinutes();
	var seconds = date.getSeconds() < 10 ? ("0" + date.getSeconds()) : date
			.getSeconds();
	// 年月日时分YYYY-MM-DD-HH-MM
	if (num == 16) {
		return year + "-" + month + "-" + day + " " + hours + ":" + minutes;
	}
	// 年月日时分秒YYYY-MM-DD-HH-MM-SS
	if (num == 19) {
		return year + "-" + month + "-" + day + " " + hours + ":" + minutes
				+ ":" + seconds;
	}
	// 年月日YYYY-MM-DD
	if (num == 10) {
		return year + "-" + month + "-" + day;
	}
	// 年月日YYYY年MM月DD日（页面展示日期使用）
	if (num == 101) {
		return year + "年" + month + "月" + day+"日";
	}
}
//工作台我的提醒html对象
function addMyRemindHtmlObj(mes){
	var obj=$('<li class="myRemind"><i></i><span>'+mes["REMIND_TYPE_NAME"]+'</span><em class="project-backlog-num-special">'+mes["REMIND_NUM"]+'</em>');
	obj.data("mes",mes);
	$("#work_remind").append(obj);	
 }	
//工作台更多我的提醒pop框html对象
function addMyRemindPopHtmlObj(mes){
	var obj=$('<li class="myRemind"><i></i><span>'+mes["REMIND_TYPE_NAME"]+'</span><em class="project-backlog-num-special">'+mes["REMIND_NUM"]+'</em>');
	obj.data("mes",mes);
	$("#work-remindpop").append(obj);	
 }	
//查询工作台我的提醒
function queryRemind(){
	 $("li[class='myRemind']").remove();
	 baseAjax("myRemind/findMyRemindByUserid.asp?limit=5&offset=0",{}, function(mes){
		 if(mes){
			 $("li[class='myRemind']").remove();
				if(mes.total==0){
					$("span[name='noMyRemind']").remove();
					  var obj=$('<span name="noMyRemind" style="height: 34px; width: 58%;line-height: 34px;">无提醒项</span>');
					  $("#work_remind").append(obj);
				  }else{
					  for(var i=0;i<mes.rows.length;i++){
						  addMyRemindHtmlObj(mes.rows[i]);
						 } 
				  }
				  //$("#myRemindNum").text("("+mes.total+")");
			} 
	 });
	 //点击事件
	 $(document).off("click","#work_remind li").on("click","#work_remind li",function(){
		 var data=$(this).data("mes");
		 var CATEGORY_CODE=data["REMIND_TYPE"];
		 if(CATEGORY_CODE=='PUB201701'){
			 window.parent.iframeOpenTab(data["RCODE"],data["REMIND_EXPLAIN"],data["REMIND_URL"]);
		 }else{
			 	window.parent.closePageTab("queryremind", function(){});
				openInnerPageTabIndexC("queryremind", "查看提醒详情", "supervision/remind/remind_info.html", function(){
					initRemindinfo(CATEGORY_CODE);
				});
		 }
		 
	});
	//更多我的提醒
	 $("#moreremind").unbind("click");
	 $("#moreremind").click(function(){
		 var pop=$(".modal-body #work-remindpop");
		 pop.empty();
		 $("#moreremindpop").modal("show");
		 baseAjax("myRemind/findMyRemindByUserid.asp",{}, function(mes){
			 if(mes){
				 pop.empty();
					if(mes.rows.length==null){
						  var obj=$('<span>无提醒项</span>');
						  $("#work-remindpop").append(obj);
					  }else{
						  for(var i=0;i<mes.rows.length;i++){
							  addMyRemindPopHtmlObj(mes.rows[i]);
							 } 
					  }
				} 
		 });
	});
	 //pop框点击事件
	 $(document).one("click","#work-remindpop li",function(){
		 $("#moreremindpop").modal("hide");
		 var data=$(this).data("mes");
		// window.parent.iframeOpenTab(data["RCODE"],data["REMIND_EXPLAIN"],data["REMIND_URL"]);
		 if(data["REMIND_TYPE"]=='PUB201701'){
			 window.parent.iframeOpenTab(data["RCODE"],data["REMIND_EXPLAIN"],data["REMIND_URL"]);
		 }else{
			 window.parent.closePageTab("queryremind", function(){});
				openInnerPageTabIndexC("queryremind", "查看提醒详情", "supervision/remind/remind_info.html", function(){
					initRemindinfo(data["REMIND_TYPE"]);
				});
		 }
	});
};
//我的待办html对象
function addWorkbacklogHtmlObj(mes,state){
	if(mes["CATEGORY_NAME"]!=undefined&&mes["projectBacklogNum"]!=undefined){
		var obj = $("");
		if((mes['projectBacklogNum']>0)&&(mes['projectBacklogNum']<=99)){
			obj=$('<li class="work_backlogInfo"><i></i><span>'+mes["CATEGORY_NAME"]+'</span><em class="project-backlog-num-special">'+mes["projectBacklogNum"]+'</em></li>');
		}else if(mes["projectBacklogNum"]>99){
			obj=$('<li class="work_backlogInfo"><i></i><span>'+mes["CATEGORY_NAME"]+'</span><em class="project-backlog-num-special">'+'...'+'</em></li>');
		}
		obj.data("mes",mes);
		if(mes["projectBacklogNum"]<=0){
			//var obj=$('<li class="work_backlogInfo"><i></i><span>'+mes["CATEGORY_NAME"]+'</span><em>'+mes["projectBacklogNum"]+'</em></li>');
			obj = "";
		}
		if(state=='pop'){		
			$("#work_backlogpop").append(obj);
		}else{
			$("#work_backlog").append(obj);	
		}
	}
}
//查询我的待办
function queryBacklog(){
	var SID=window.parent.SID;
	var call=getMillisecond(); 
	$("li[class='work_backlogInfo']").remove();
	baseAjaxJsonp(dev_workbench+"PucTMesscategory/queryAllMesscategoryTotal.asp?SID="+SID+"&call="+call+"&category_type=01&category_state=00&limit=5&offset=0", null, function(mes){
		if(mes){	
			$("li[class='work_backlogInfo']").remove();
			if(mes.total==0){
				  $("span[name='noWork_backlogInfo']").remove();
				  var obj=$('<span name="noWork_backlogInfo" style="height: 34px; width: 58%;line-height: 34px;">无待办项</span>');
				  $("#work_backlog").append(obj);
				  endLoading();
			  }else{
				  for(var i=0;i<mes.rows.length;i++){
					  addWorkbacklogHtmlObj(mes.rows[i]);
					 } 
			  }
			  //$("#work-backlogNum").text("("+mes.total+")");
		}
	}, call);
	
	//我的待办点击事件
	$(document).off("click","li[class='work_backlogInfo']").on("click","li[class='work_backlogInfo']",function(){
		$("#morebacklogpop").modal("hide");
		var data=$(this).data("mes");
		var CATEGORY_CODE=data["CATEGORY_CODE"];
		if(CATEGORY_CODE=='PUB201701'){
			 window.parent.iframeOpenTab(data["RCODE"],data["REMIND_EXPLAIN"],data["REMIND_URL"]);
		 }else{
			 window.parent.closePageTab("querybacklog", function(){});
			openInnerPageTabIndexC("querybacklog", "查看待办详情", "supervision/backlog/backlog_info.html", function(){
				initBackloginfo(CATEGORY_CODE);
			});
		 }
	});
	//更多我的待办点击事件
	$("#morebacklog").unbind("click");
	$("#morebacklog").click(function(){
		 var pop=$(".modal-body #work_backlogpop");
		 pop.empty();
		 $("#morebacklogpop").modal("show");
		 baseAjaxJsonp(dev_workbench+"PucTMesscategory/queryAllMesscategoryTotal.asp?SID="+SID+"&call="+call+"&category_type=01&category_state=00",null, function(mes){
			 if(mes){
				 pop.empty();
					if(mes.rows.length==null){
						  var obj=$('<span>无待办项</span>');
						  $("#work_backlogpop").append(obj);
					  }else{
						  for(var i=0;i<mes.rows.length;i++){
							  addWorkbacklogHtmlObj(mes.rows[i],'pop');
							 } 
					  }
				} 
		 },call);
		 
	});
	endLoading();
};
$.fn.modal.Constructor.prototype.enforceFocus = function () {};

