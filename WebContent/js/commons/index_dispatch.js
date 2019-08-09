/**
 * 按钮权限
 */
var buttonPermission={};

/**
 * 当前系统的菜单数据
 */
var menuData={};

var menuLevel1="level1";//一级菜单的key
/**
 * index页面数据分配
 * 
 */
var start="";
var content="#contentHtml";
var content_page=$(content);
$(document).ready(function(){
	content_page=$(content);
});

/**
 * 初始化主菜单
 * @param level1
 */
function initMasterMenu(level1,msg){
	var sys=$("#cgb-system-content ul.cgb-system-list");
		sys.empty();
	if(level1!=undefined&&level1.length>0){
		switchLeftMenu(level1[1]["MENU_NAME"],msg[level1[1]["MENU_NO"]]);
		for(var i=0;i<level1.length;i++){
			if(level1[i]["MENU_NAME"]!='首页'){
			var li=$('<li></li>');
			var img=$('<img src="'+level1[i]["MENU_ICON"]+'">');
			var span=$('<span>'+level1[i]["MENU_NAME"]+'</span>');
			li.data("data",{name:level1[i]["MENU_NAME"],data:msg[level1[i]["MENU_NO"]]});
			li.unbind("click").click(function(){
				$(".cgb-tab li").removeClass("current").eq(0).addClass("current");
				$(".cgb-left-all").removeClass("open").eq(0).addClass("open");
				var data=($(this).data("data")||{});
				switchLeftMenu(data["name"],data["data"]);
			});
			li.append(img);
			li.append(span);
			sys.append(li);
				//仪表盘权限
				if(level1[i]["MENU_NO"]=='report'){
					for(var j=0;j<msg.level2.length;j++){
						var k =  msg.level2[j].MENU_NO;
						if(k == 'management_gauge'){
							setTimeout(function(){
								var ipage =  $(window.frames["workbenchIframe"].document);
								ipage.find('#viewTab').show();
							},500);
							break;
						}
					}
					continue;
				}
			}else{		
				var ss=msg[level1[i]["MENU_NO"]];
				var url = ss[0]["MENU_URL"];
				$(window.parent.document).find("#workbenchIframe").attr("src",url); 
			}
		}
	}
//	$(".zzc").click(function(){
//		$("#cgb-system-content").animate({opacity:'hide',height:"0px",display:'none'},800);
//		$(".zzc").hide();
//		$(".user-astSYS").hide(800);
//		$(".ecitic-user-content").slideToggle("fast");
//	});
	$(".cgb-system-content .cgb-system-list li").click(function(){
		$("#cgb-system-content").animate({opacity:'hide',height:"0px",display:'none'},800);
		/*$(".zzc").show();*/
		$(".user-astSYS").hide(800);
	});
	
	
}


/**
 * 切换菜单主菜单
 * @param masterMenu_no
 */
function switchLeftMenu(masterMenu_name,data){
	$(".cgb-menu-title span").text(masterMenu_name);
	initLeftMenu(data);
	dropdownAccordion();//手风琴 效果
}
/**
 * 初始化左侧菜单
 * @param rightMenu
 */
function initLeftMenu(leftMenu){
	if(leftMenu!=undefined&&leftMenu.length>0){
		$("ul[level='1']").empty();
		for(var i=0;i<leftMenu.length;i++){
			menuData[leftMenu[i].MENU_NO]=leftMenu[i];
			if(leftMenu[i].MENU_LEVEL==1){
				var html = template('initLeftMenuLevel1', leftMenu[i]);
				$("ul[level='1']").append(html);
			}else if(leftMenu[i].MENU_LEVEL>=2){
				var parent=$("[menu_no='"+leftMenu[i].SUPMENU_NO+"']");
				if(parent.length==1){//存在父级
					$("#"+leftMenu[i].SUPMENU_NO).removeClass("tit");
					parent.find(".nui-tree-item-symbol:first").html('<b class="nui-ico-rArr"></b>');//给父元素设置收缩按钮
					var parentUl=$("[menu_no='"+leftMenu[i].SUPMENU_NO+"']").find("ul:first-child");
					var level1=template('initLeftMenuLevel2', leftMenu[i]);
					if(parentUl.length>0){
						parentUl.append(level1);
					}else{
						parent.append('<ul class="nuinone">'+level1+'</ul>');
					}
				}
			}
		}
        // IE8下效率低，渲染慢,已经替换解决办法。
//		var labelNav=$(".nui-tree-item-labelNav");
//		for(var i=0;i<labelNav.length;i++){
//			var obj=$(labelNav[i]);
//			if(obj.siblings("ul").length==0){
//				obj.find("img.arrowNav").remove();
//				obj.parents().addClass("open");
//			}
//		}
		leftLevel1MenuTx();
	}
	initButtonPermisData();
}





/**
 * 右侧一级菜单 特效
 */
function leftLevel1MenuTx(){
	leftLevel1MenuTxImg();
	$(".pl15").unbind("hover").hover(function(){
		var img=$(this).find(".nui-tree-item-img img");
		if(img.length>0){
			var src=img.attr("src");
			src=src.replace(".png","_1.png");
			img.attr("src",src);
		}
	},function(){
		var img=$(this).find(".nui-tree-item-img img");
		if(img.length>0){
			var src=img.attr("src");
			src=src.replace("_1.png",".png");
			img.attr("src",src);
		}
	});
}
/**
 * 右侧一级菜单图标，根据皮肤值选择
 */
function leftLevel1MenuTxImg(){
	$(".pl15").each(function(index,element){
		var img=$(this).find(".nui-tree-item-img img");
		if(img.length>0){
			var src=img.attr("src");
			var srcArr=src.split("/");
			srcArr[1]="nav"+skinFlag;
			src=srcArr.join("/");
			img.attr("src",src);
		}
	});
}
function initMenu(){
	$.ajax({
		type : "post",
		url : "user/usermenu.asp",
		data : {},
		async:false,
		dataType : "json",
		success : function(msg) {
//			msg=userData;
			if(msg==undefined||msg.level1==undefined){
				alert("用户权限数据异常");
			}else{
				initMasterMenu(msg[menuLevel1],msg);
				//initLeftMenu(msg[msg[menuLevel1][0]["MENU_NO"]]);
				//level1[i]["MENU_NAME"]
				//ResearchSystem();
			}
		},
		error : function() {
			alert("用户权限数据异常");
		}
	});
}

$(".btn_close").click(function(){
	$.ajax({
		type : "post",
		url : "logout.asp",
		data : {},
		dataType : "json",
		success : function(msg) {
			window.location="login.html";
		},
		error : function() {
			window.location="login.html";
		}
	});
});

/**
 * 初始化页面按钮权限
 * @param url
 */
function initButtonPermisData(){
	$.ajax({
		type : "post",
		url : "user/usermenuopt.asp",
		dataType : "json",
		async:false,
		success : function(data) {
			buttonPermission=data;
		},
		error : function() {
		}
	});
}





/****######################################3下面是页面加载 页签切换等操作############################################################****/
/**
 * 加载页面
 * @param url
 */
function loadPage(url,callback){
	$.ajax({
		type : "get",
		url : url,
		dataType : "html",
		success : function(data) {
			callback(data);
			endLoading();
		},
		error : function() {
			endLoading();
		}
	});
}
/**
 * 加载页面到content下
 * @param url
 * @param callback
 */
function loadPageToContent(url,callback){
	loadPage(start+url,function(data){
		content_page.append(data);
		if(callback!=undefined){
			callback();
		}
	});
}

/**
 * 显示当前页面
 * @param key
 */
function showCurrentPage(key){
	clickCurrentTab($("li[tabid='"+key+"']"),key);
}
/**
 * 导航控制
 * @param key
 */
function navigation(key){
	if(menuData[key]&&!menuData[key]["MENU_URL"]){
		return;
	}
	if("my_work_terrace"==key){//首页 导航条 控制
		$(".yourLocation").hide();
	}else{
		$(".yourLocation").show();
		setTimeout(function(){
			$(".yourLocation span").text("您所在的位置："+$(".current[id!='firsttit']").text());
		},50);
	}
}


function pageDispatch(key){
	navigation(key);
	var page=$("div[page='menu_"+key+"']");
	if(page.length>0){
		$("div[page^='menu_']").hide();
		$("div[page='menu_"+key+"']").show();
		showCurrentPage(key);
		return;
	}
   
	if(menuData[key]!=undefined){
		var menu_url=menuData[key]["MENU_URL"];
		if(menu_url!=undefined&&$.trim(menu_url)!=""){
			$("div[page^='menu_']").hide();
			openInnerPageTab(key,menuData[key]["MENU_NAME"],start+menu_url+"?menu_no="+key,function(){
				EciticMore();
				navigation(key);
				showButton(key,buttonPermission[key]);
			});
			return;
		}
	}
}

/**
 * 显示操作按钮
 * @param button
 */
function showButton(key,button){
	if(button!=undefined&&button.length>0){
		for(var i=0;i<button.length;i++){
			$("div[page='menu_"+key+"']").find("#"+button[i]).remove();
		}
	}
} 
/**
 * 隐藏页面
 * @param key
 */
function hidePage(key){
	$("div[page='menu_"+key+"']").hide();
}
/**
 * 移除页面
 * @param key
 */
function removePage(key){
	$("div[page^='menu_"+key+"']").remove();
}

/**
 * 关闭页签
 * @param tabNo
 */
function closePageTab(tabNo,callback){
	var tabPage=$(".list_tree_1nav li[tabid='"+tabNo+"'] a");
	if(tabPage.length>0){
		tabPage.click();
	}
	if(callback!=undefined){
		callback();
	}
}
/**
 * 先关闭再打开
 * @param tabNo
 * @param title
 * @param url
 * @param callback
 */
function closeAndOpenInnerPageTab(tabNo,title,url,callback){
	closePageTab(tabNo,function(){
		openInnerPageTab(tabNo,title,url,callback);
	});
}
/**
 * 关闭当前页签
 */
function closeCurrPageTab(){
	$("li.current a").click();
}
/**
 * 给Iframe 页面 使用的打开页签的函数 
 * @param tabNo
 * @param title
 * @param url
 */
function iframeOpenTab(tabNo,title,url){
	var page=$("[tabid='"+tabNo+"']");
	if(page.length==1){
		page.click();
		return;
	}
	if(menuData[tabNo]!=undefined){
		pageDispatch(tabNo);
	}else{
		openInnerPageTab(tabNo,title,url);
	}
}
/**
 * 打开内部页面的页签
 * @param tabNo 页签编号
 * @param title
 * @param url
 */
function openInnerPageTab(tabNo,title,url,callback){
	$("div[page^='menu_']").hide();
	if ($("#" + tabNo+"_tit").length != 0){
		lastPage=$(".list_tree_1nav li.current").prop("id");
    	$(".list_tree_1nav li").removeClass("current");
        $(".list_tree_1nav li").addClass("headtit");
        $(".list_tree_1nav li a").html("<img src='images/ltee_close.png'/>");
        $("#"+tabNo+"_tit a").html("<img src='images/ltee_close_h.png'/>");
        $("#"+tabNo+"_tit").removeClass("headtit");
        $("#"+tabNo+"_tit").addClass("current");
        $("div[page='menu_"+tabNo+"']").show();
        return;
    }
    //限制选项卡数量不得超过8个
    var titlength=$(".list_tree_1nav li").length;
    if(titlength==8){
    	var pageTab=$(".list_tree_1nav li:first-child");
    	removePage(pageTab.attr("tabId"));
    	pageTab.remove();
    }
    //显示全部关闭按钮
    if(titlength==1){
    	$("#tree_last").addClass("tree_last");
    	$("#tree_last").removeClass("tree_lastnone");
    }
    //改变其他选项卡的样式
    if ($("#firsttit").hasClass("current_click")){
		lastPage="firsttit";
	}else {
    	  lastPage=$(".list_tree_1nav li.current").prop("id");
    }
    $("#firsttit").addClass("firstcurrend");
    $("#firsttit").removeClass("current_click");
    var list_tree_1nav=$(".list_tree_1nav");
    list_tree_1nav.find("li a").html("<img src='images/ltee_close.png'/>");
    list_tree_1nav.find("li").removeClass("current").addClass("headtit");
    list_tree_1nav.append("<li class='current' tabId='"+tabNo+"' id='"+tabNo+"_tit' title="+title+">"+"<span>"+title+"</span>"+"<a title='关闭'><img src='images/ltee_close_h.png'/></a></li>");
	startLoading();
	var tabPage;
	if(tabNo=="wbsPlan_edit"||tabNo=="wbsPlan_track"||tabNo=="wbsPlan_show"){
		tabPage=$("<div page='menu_"+tabNo+"' class='wbsPlana-all "+ tabNo+"' style='height:90%;'></div>");
	}else {
		tabPage=$("<div page='menu_"+tabNo+"' class='"+ tabNo+"' url='"+url+"' style='height:90%;'></div>");
	}
	content_page.append(tabPage);
	loadPage(start+url,function(data){
		endLoading();
		tabPage.html(data);
		getCurrentPageObj().find("select:not([id$='selected'])").select2();
		EciticTitleI();//自动折叠
		if(callback!=undefined){
			callback();
			navigation(tabNo);
		}
	});
}
/**
 * 打首页的页签
 * @param tabNo 页签编号
 * @param title
 * @param url
 */
function openIndexC(tabNo,title,url,callback){
	$("div[page^='menu_']").hide();
	if ($("#" + tabNo+"_tit").length != 0){
    	$(".list_tree_1nav li").removeClass("current");
        $(".list_tree_1nav li").addClass("headtit");
        $(".list_tree_1nav li a").html("<img src='images/ltee_close.png'/>");
        $("#"+tabNo+"_tit a").html("<img src='images/ltee_close_h.png'/>");
        $("#"+tabNo+"_tit").removeClass("headtit");
        $("#"+tabNo+"_tit").addClass("current");
        $("div[page='menu_"+tabNo+"']").show();
        return;
    }
	$("#firsttit").addClass("firstcurrend");
    //限制选项卡数量不得超过8个
    var titlength=$(".list_tree_1nav li").length;
    if(titlength==8){
    	var pageTab=$(".list_tree_1nav li:first-child");
    	removePage(pageTab.attr("tabId"));
    	pageTab.remove();
    }
    //显示全部关闭按钮
    if(titlength==1){
    	$("#tree_last").addClass("tree_last");
    	$("#tree_last").removeClass("tree_lastnone");
    }
    //改变其他选项卡的样式
	startLoading();
	loadPage(start+url,function(data){
		endLoading();
		if(tabNo=="wbsPlan_edit"||tabNo=="wbsPlan_track"||tabNo=="wbsPlan_show"){
			content_page.append("<div page='menu_"+tabNo+"' class='wbsPlana-all' style='height:90%;'>"+data+"</div>");
		}else {
			content_page.append("<div page='menu_"+tabNo+"' style='height:90%;'>"+data+"</div>");
		}
		getCurrentPageObj().find("select:not([id$='selected'])").select2();
		if(callback!=undefined){
			callback();			
		}
	});
}

//修改密码
 function updatePass(obj,key){
	 $(".ecitic-user-content").slideUp("fast");//隐藏
	openInnerPageTab("update_pw","修改密码","pages/suser/suser_updatePass.html",function(){			
		$("#user_no_op").val(obj);
		$("#user_name_op").val(key);
	});
}
//个人信息
function queryUser(obj){
	$(".ecitic-user-content").slideUp("fast");//隐藏
	openInnerPageTab("user_info","个人信息","pages/suser/suser_queryUser.html",function(){
		initQueryUser(obj);
	});
}
/**
 * $_("update","#id")
 * @param no
 */
function $_(no,c){
	return $("div[page='menu_"+no+"']").find(c);
}
function $_find(no){
	return $("div[page='menu_"+no+"']");
}

/**
 * 获取当前页面jquery对象
 * @returns
 */
function getCurrentPageObj(){
	var obj=$("div[page^='menu']:visible");
	if(obj.length==0){
		return content_page;
	}
	return obj;
}
/**
 * body的单击事件 提供给 iframe页面用
 */
function bodyClick(){
	$("body:eq(0)").click();
}
/**
 * 其他方式打开页面
 * @param key
 * @param callback
 */
function otherOpenPage(key,dataId,callback){
	var pageMap={"taskdetail_page":"task/detail_page/taskdetail_page.html"};
	
	if(key=="taskdetail_page"){
		closeAndOpenInnerPageTab(key,"任务详情",pageMap[key],function(){//先关闭再打开
			detailTaskInfo(dataId,pageMap[key]);
			if(callback){
				callback();
			}
		});
	}
}
/**
 * 打开知识库页面
 */
$(document).on("click",".ecitic-set",function(){
	openInnerPageTab("repository_list","知识库查看","dev_repository/repository_user/user_repository_queryList.html",function(){
		
	});
});	

