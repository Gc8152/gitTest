/**
 * 打开页面的数组集合
 */
var openPageList=[];
/**
 * 头部导航数据
 */
var headNavList=[];
var menuData=parent.menuData;

var content="#content";
var btnp="btnp";
var start="";
function loadPage(url,callback){
		$.ajax({
			type : "get",
			url : url,
			dataType : "html",
			success : function(data) {
				callback(data);
			},
			error : function() {
			}
		});
	}
/**
 * 设置导航头
 * @param obj
 */
function setHeadNav(obj){ 
	headNavList=[];
	this.loopGetNav=function(obj){
		headNavList[headNavList.length]=$.trim(obj.find("div:eq(0)").text());
		var pobj=$(obj.parents("li")[0]);
		if(pobj.length>0){
			loopGetNav(pobj);
		}
	};
	$("#breadcrumb").empty();
	loopGetNav(obj);
	$("#breadcrumb").append('<a class="tip-bottom" data-original-title="Go to Home"><i class="icon-home"></i>'+headNavList[headNavList.length-1]+'</a> ');
	for(var i=headNavList.length-2;i>=0;i--){//breadcrumb
		if(i==0){
			$("#breadcrumb").append('<a href="#" class="noimage">'+headNavList[i]+'</a>');
		}else{
			$("#breadcrumb").append('<a href="#">'+headNavList[i]+'</a>');
		}
	}
}
/**  
 * 菜单初始化操作
 */
var menuCommons={
		getMenuInfo:function(callback){baseAjax("user/usermenu.asp",{},callback,false);},
		initNavMenu:function(data,leftMenuData){
			$(".navbar-inner ul").append('<li navmenu="'+data["MENU_NO"]+'" id="'+data["MENU_NO"]+'"><a href="#">'+data["MENU_NAME"]+'</a></li>');
			$("#"+data["MENU_NO"]).data("data", leftMenuData);
		},
		initNavMenuEvent:function(){
			$("li[navmenu]").click(function(){
			$("#list .black").text($(this).text());
			$(".navbar-inner li>a").css({"background-color":"royalBlue","color":""});
			$(this).find("a").css({"background-color":"#e5e5e5","color":"black"});
				initLeftMenu($(this).data("data"));
			});
		},
		initLeftMenuEvent:function(){
			$(document).on("click","li[menu_no]",function(){
				var menu_no=$(this).attr("menu_no");
				if($(this).find("ul").length==0){
					startLoading();
					setHeadNav($(this));
					openPageList=[];
					$("div[pageIndex]").attr("pageIndex","0");
					openInnerPageTab(menu_no,$(this).data("name"),$(this).data("url"),function(name){
						$(".header-h3").html('<img class="leftImg" src="images/title_bg2.jpg">'+name);
						endLoading();
					});
				}
			});
		},
		initButtonPermiss:function(){baseAjax("user/usermenuopt.asp",{},function(data){$(content).data(btnp,data); },false);}
};

/**
 * 按钮操作控制
 * @param button
 */
function buttonPermission(key){
	var btns=$(content).data(btnp);
	var btn=btns==undefined?undefined:btns[key];
	if(btn!=undefined&&btn.length>0){
		for(var i=0;i<btn.length;i++){
			$("div[menu_page='"+key+"']").find("#"+btn[i]).remove();
		}
	}
} 
/**
 * 左侧菜单
 * @param leftMenu
 */
function initLeftMenu(leftMenu){
	if(leftMenu!=undefined&&leftMenu.length>0){
		$("ul[level='1']").empty();
		for(var i=0;i<leftMenu.length;i++){
			if(leftMenu[i].MENU_LEVEL==2){
				var html = template('initLeftMenu', leftMenu[i]);
				$("ul[level='1']").append(html);
			}else if(leftMenu[i].MENU_LEVEL>=3){
				var parent=$("[menu_no='"+leftMenu[i].SUPMENU_NO+"']");
				if(parent.length==1){//存在父级
					parent.find(".nui-tree-item-label:first").addClass("parentTag");
					parent.find(".nui-tree-item-symbol:first").html('<i class="icon-chevron-down"></i>');//给父元素设置收缩按钮
					var parentUl=$("[menu_no='"+leftMenu[i].SUPMENU_NO+"']").find("ul:first");
					var level1=template('initLeftMenu', leftMenu[i]);
					if(parentUl.length>0){
						parentUl.append(level1);
					}else{
						parent.append('<ul>'+level1+'</ul>');
					}
				}
			}
			var obj=$("li[menu_no='"+leftMenu[i].MENU_NO+"']");
					obj.data("url",leftMenu[i].MENU_URL);
					obj.data("name",leftMenu[i].MENU_NAME);
		}
	}
}

/**
 * 打开内部页面的页签
 * @param tabNo 页签编号
 * @param title
 * @param url
 */
function openInnerPageTab(tabNo,title,url,callback){
	loadPage(start+url,function(data){
		var objIndex=$("div[pageIndex]");
		var index=0;
		if(objIndex.length!=0){
			index=parseInt(objIndex.attr("pageIndex"))+1;
		}
		openPageList[index]={};
		openPageList[index]={title:title,url:url,tabNo:tabNo,callback:callback};
		$(content).html("<div menu_page='"+tabNo+"' pageIndex="+index+" style='position: absolute; width: 99.9%; height: 100%; overflow: auto;'>"+data+"</div>");
		try{
			getCurrentPageObj().find("select:not([id$='selected'])").select2();
		}catch(e){
		}
		buttonPermission(tabNo);
		if(callback!=undefined){
			var headerObj=$(".header-h3");
			headerObj.html('<img class="leftImg" src="images/title_bg2.jpg">'+headerObj.text());
			initPlaceholder();
			callback(title);
		}
	});
	$(".list_tree_1nav").append("<li class='current' onclick='pageDispatch(\""+tabNo+"\")' tabId='"+tabNo+"' id='"+tabNo+"_tit'>"+title+"<a title='关闭'><img src='images/ltee_close_h.png'/></a></li>");
}


/**
 * 关闭页签
 * @param tabNo
 */
function closePageTab(tabNo,callback){
	$(".list_tree_1nav li[tabid='"+tabNo+"'] a").click();
	if(callback!=undefined){
		callback();
	}
}

/**
 * 获取当前页面jquery对象
 * @returns
 */
function getCurrentPageObj(){
	var obj=$("div[menu_page]:visible");
	if(obj.length==0){
		return $(content);
	}
	return obj;
}

$(document).ready(function(){
//	menuCommons["getMenuInfo"](function(data){
//		if(typeof data=="object"){
//			for(var i=0;i<data["level2"].length;i++){
//				var mno=data["level2"][i]["MENU_NO"];
//				menuCommons["initNavMenu"](data["level2"][i],data[mno+"_2"]);
//			}
//		}
//		menuCommons.initLeftMenuEvent();
//		menuCommons.initButtonPermiss();
//		menuCommons.initNavMenuEvent();
//		var pstr=getParamString("p");
//		if(pstr==""||pstr==undefined||pstr==null){
//			clickLeftMenu("task_sys_index");
//			clickLeftMenu("my_work_terrace");
//		}else{
//			urlSwitchWorkBench(pstr);
//		}
//	});
});

/**
 * 根据url参数切换菜单
 * @param p
 */
function urlSwitchWorkBench(p){
	clickLeftMenu("task_manager");
	if("distribute"==p){//待接收任务
		clickLeftMenu("task_distribute");
	}else if("follow"==p){//待反馈
		clickLeftMenu("task_follow");
	}else if("coordinate_appr"==p){//待审批
		clickLeftMenu("task_coordinate_appr");
	}else if("finish"==p){//待确认完成
		clickLeftMenu("task_finish");
	}else if("add"==p){
		clickLeftMenu("task_create");
	}else if("back_task_finish"==p){
		clickLeftMenu("back_task_finish");
	}else if("assessment"==p){
		clickLeftMenu("assessment");
	}else{//任务详情
		$("#breadcrumb").append('<a class="tip-bottom" data-original-title="Go to Home"><i class="icon-home"></i>任务管理</a> <a href="#" class="noimage">任务查询</a>');
		otherOpenPage("taskdetail_page",p);
	}
}
/**
 * 返回上一个页面
 * @param callback
 */
function backToBeforePage(callback){//parseInt(
	var pageIndex=$("div[pageIndex]");
	var objIndex=parseInt(pageIndex.attr("pageIndex"));
	pageIndex.attr("pageIndex",objIndex-2);
	pageInfo=openPageList[objIndex-1];
	if(pageInfo!=undefined){
		if(pageInfo.callback){
			openInnerPageTab(pageInfo.tabNo,pageInfo.title,pageInfo.url,pageInfo.callback);
		}else if(callback){
			openInnerPageTab(pageInfo.tabNo,pageInfo.title,pageInfo.url,callback);
		}else{
			openInnerPageTab(pageInfo.tabNo,pageInfo.title,pageInfo.url);
		}
	}else{
		clickLeftMenu("taskinfo_querylist");
	}
}
(function(){
	$(document).on("click","button[name='globeBack']",function(){
		backToBeforePage();
	});	
})();

var tstate;

/**
 * 单击左侧的菜单
 * @param mkey
 * @param backParam
 */
function clickLeftMenu(mkey,backParam){
	var menu={"taskinfo_querylist":"taskinfo_querylist","task_manager":"task_manager","my_work_terrace":"my_work_terrace","task_sys_index":"task_sys_index"};
		menu["task_distribute"]="task_distribute";			menu["task_follow"]="task_follow";
		menu["task_coordinate_appr"]="task_coordinate_appr";menu["task_finish"]="task_finish";
		menu["back_task_finish"]="task_finish";
		menu["task_create"]="task_create";		menu["assessment"]="assessment";
		menu["task_maintenance"]="task_maintenance";
	if(menu[mkey]){
		var callback=function(){};
		var bparam={};
		if(backParam&&menucallback[mkey]){
			bparam=backParam;
			callback=menucallback[mkey];
		}
		if("back_task_finish"==mkey){
			tstate="09";
		}
		$("#"+menu[mkey]).click();
		if(callback){
			callback(bparam);
		}
	}
}

/**
 * 其他方式打开页面
 * @param key
 * @param callback
 */
function otherOpenPage(key,dataId,callback){
	$("#toCreantTask").remove();
	
	var pageMap={"taskdetail_page":"task/detail_page/taskdetail_page.html","task_update":"task/taskinfo/updateTaskInfo.html"};
	
	if(key=="taskdetail_page"){
		openInnerPageTab(key,"任务详情",pageMap[key],function(){
			detailTaskInfo(dataId,pageMap[key]);
			if(callback){
				callback();
			}
		});
	}else if(key=="task_update"){
		openInnerPageTab(key,"任务维护",pageMap[key],function(){
			if(callback){
				callback();
			}
		});
	}
	
}

/**
 * 打开首页内部页面的页签
 * @param tabNo 页签编号
 * @param title
 * @param url
 */
var contentHtml=parent.document.getElementById("contentHtml");
function openInnerPageTabIndexC(tabNo,title,url,callback){
	$("div[page^='menu_']",parent.document).hide();
	if ($("#" + tabNo+"_tit",parent.document).length != 0){
    	$(".list_tree_1nav li",parent.document).removeClass("current");
        $(".list_tree_1nav li",parent.document).addClass("headtit");
        $(".list_tree_1nav li a",parent.document).html("<img src='images/ltee_close.png'/>");
        $("#"+tabNo+"_tit a",parent.document).html("<img src='images/ltee_close_h.png'/>");
        $("#"+tabNo+"_tit",parent.document).removeClass("headtit");
        $("#"+tabNo+"_tit",parent.document).addClass("current");
        $("div[page='menu_"+tabNo+"']",parent.document).show();
        return;
    }
    //限制选项卡数量不得超过8个
    var titlength=$(".list_tree_1nav li",parent.document).length;
    if(titlength==8){
    	var pageTab=$(".list_tree_1nav li:first-child",parent.document);
    	removePage(pageTab.attr("tabId"));
    	pageTab.remove();
    }
    //显示全部关闭按钮
    if(titlength==1){
    	$("#tree_last",parent.document).addClass("tree_last");
    	$("#tree_last",parent.document).removeClass("tree_lastnone");
    }
    //改变其他选项卡的样式
    $("#firsttit",parent.document).addClass("firstcurrend");
    $(".list_tree_1nav li a",parent.document).html("<img src='images/ltee_close.png'/>");
    $(".list_tree_1nav li",parent.document).removeClass("current");
    $(".list_tree_1nav li",parent.document).addClass("headtit");
	$(".list_tree_1nav",parent.document).append("<li class='current' tabId='"+tabNo+"' id='"+tabNo+"_tit' title="+title+">"+"<span>"+title+"</span>"+"<a title='关闭'><img src='images/ltee_close_h.png'/></a></li>");
	startLoading();
	loadPage(start+url,function(data){
		endLoading();
		$(contentHtml).append("<div page='menu_"+tabNo+"' style='height:90%;'>"+data+"</div>");
		$(contentHtml).find("div[page='menu_"+tabNo+"']").find("select:not([id$='selected'])").select2();
		if(callback!=undefined){
			callback();
			navigation1Menu(tabNo);
		}
	});
}

/**
 * 导航控制
 * @param key
 */
function navigation1Menu(key){
      if(menuData[key]&&!menuData[key]["MENU_URL"]){
            return;
      }
      if("my_work_terrace"==key){//首页 导航条 控制
            $(".yourLocation",parent.document).hide();
      }else{
            $(".yourLocation",parent.document).show();
            setTimeout(function(){
                  $(".yourLocation span",parent.document).text("您所在的位置："+$(".current[id!='firsttit']",parent.document).text());
            },50);
      }
}
