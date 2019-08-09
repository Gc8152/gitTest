$(document).ready(function() {
	initMenu();
	//单击弹出个人信息框
	$("#userConcent").click(function(event){
		event.stopPropagation();
		$('#usershow').slideToggle('slow');
	});
	$("#main_list").click(function(event){
		event.stopPropagation();
		$('.list_tree_tc').slideToggle('slow');
	});
	$(document).click(function (event) {
		$('#usershow').slideUp('slow');
		$('.list_tree_tc').slideUp('slow');
	});
	//单击修改密码，弹出新的选项卡
	$("#usernews").click(function(){
		if ($("#usernews_current").length != 0){
			$("#firsttit").addClass("firstcurrend");
			$(".list_tree_1nav li a").html("<img src='images/ltee_close_g.png'/>");
			$(".list_tree_1nav li").removeClass("current");
			$(".list_tree_1nav li").addClass("headtit");
			$("#usernews_current a").html("<img src='images/ltee_close_h.png'/>");
			$("#usernews_current").removeClass("headtit");
			$("#usernews_current").addClass("current");
			return;
		}
		//限制选项卡数量不得超过8个
		var titlength=$(".list_tree_1nav li").length;
		if(titlength==8){
			$(".list_tree_1nav li:first-child").remove();
		}
		//显示全部关闭按钮
		if(titlength==1){
			$("#tree_last").addClass("tree_last");
			$("#tree_last").removeClass("tree_lastnone");
			$("#tree_last").unbind("click");
			$("#tree_last").bind("click",function(){
	    		//通知
				workbenchIframe.window.queryNotice();
	    		//提醒
				workbenchIframe.window.queryRemind();
	    		//待办
				workbenchIframe.window.queryBacklog();
	    	});
		}
		$("#firsttit").addClass("firstcurrend");
		$(".list_tree_1nav li a").html("<img src='images/ltee_close_g.png'/>");
		$(".list_tree_1nav li").removeClass("current");
		$(".list_tree_1nav li").addClass("headtit");
		$(".list_tree_1nav").append("<li class='current' id='usernews_current'>个人信息<a title='关闭'><img src='images/ltee_close_h.png'/></a></li>");
	});
	//单击首页事件
	$("#firsttit").unbind("click");
	$("#firsttit").bind("click",function(){
		//通知
		workbenchIframe.window.queryNotice();
		//提醒
		workbenchIframe.window.queryRemind();
		//待办
		workbenchIframe.window.queryBacklog();
		//其他选项卡改变样式
		$(".list_tree_1nav li").removeClass("current");
		$(".list_tree_1nav li").addClass("headtit");
		$(".list_tree_1nav li a").html("<img src='images/ltee_close_g.png'/>");
		//为首页选项卡添加样式
		$("#firsttit").removeClass("firstcurrend");
		$("#firsttit").removeClass("current");
		$("#firsttit").addClass("current_click");
		var ifr = document.getElementById('workbenchIframe');
		var win = ifr.window || ifr.contentWindow; // 考虑兼容性问题
//		win.initMyWorkCount();
		return;
	});
	
	(function(){
		var isClose=false;
		//单击当前项时事件
		$(document).on('click','.list_tree_1nav li', function() {
			if(isClose){
				isClose=false;
				
				return;
			}
			$("#firsttit").addClass("firstcurrend");
			pageDispatch($(this).attr("tabid"));
		});
		//关闭选项卡事件
		$(document).on('click','.list_tree_1nav li a', function() {
			var parentLi=$(this).parent();
			$("#firsttit").removeClass("firstcurrend");
			var tabid=parentLi.attr("tabid");
			parentLi.remove();
			$("div[page='menu_"+tabid+"']").remove();
			var last=$(".list_tree_1nav li:last");
			var l=$(".list_tree_1nav li").length;
			if(!parentLi.hasClass("current")){
				$(".list_tree_1nav li.current").click();
				isClose=true;
				return;
			}
			if($("#"+lastPage).length!=0){
				$("#"+lastPage).click();
				lastPage=tabid+"_tit";
				isClose=true;
				return;
			}
			if(l<=1){
				$("#tree_last").removeClass("tree_last");
				$("#tree_last").addClass("tree_lastnone");
			}
			if(last.length>0){
				last.click();
			}else{
				$("#firsttit").click();
			}
			isClose=true;
		});
	})();
	//左侧导航栏操作
	$(document).on('click','.nui-tree-item-label',function(){
    	var classname=$(this).nextAll('ul').attr("class");
    	if(classname=="nuinone"){
    		$(this).nextAll('ul').removeClass("nuinone");
    		$(this).find('b').addClass("nui-ico-rArr1");
    	}else{
    		$(this).nextAll('ul').addClass("nuinone");
    		$(this).find('b').removeClass("nui-ico-rArr1");
    	}
    	//获取当前单击的ID
    	var conid=$(this).attr("id");
    	if(conid==null||conid==""){
    	}else{
    		$(".gundong").addClass("nuinone");
    		$("#"+conid).nextAll('ul').removeClass("nuinone");
    	}
	});
	//关闭所有选项卡
	$("#tree_last").click(function(){
		var close=$("#contentHtml>div[page]:gt(0)");
		close.remove();
		$("#contentHtml>div[page]:eq(0)").show();
		$(".list_tree_1nav li").remove();
		$("#tree_last").addClass("tree_lastnone");
		$("#firsttit").removeClass("firstcurrend");
		$("#firsttit").click();
	});
	//退出的单击事件
	$('#ecitic-exit').bind('click', function(e) {
		e.preventDefault();
        $.Zebra_Dialog('是否退出？', {
            'type':     'close',
            'title':    '提示',
            'buttons':  ['确定','取消'],
            'onClose':  function(caption) {
                if (caption=="确定") {
                	toLoginPage();
        		}else{
        		}
            }
        });
	});
});

//去除其他选项卡的样式
function clickCurrentTab(obj,tabid){
	if ($("#firsttit").hasClass("current_click")){
		lastPage="firsttit";
	}else {
		lastPage=$(".list_tree_1nav li.current").prop("id");
	}
	 if("my_work_terrace"!=tabid){//如果点击的不是首页
		$("#firsttit").addClass("firstcurrend");
		$("#firsttit").removeClass("current_click");
	 }
     $(".list_tree_1nav li").removeClass("current");
     $(".list_tree_1nav li").addClass("headtit");
     $(".list_tree_1nav li a").html("<img src='images/ltee_close_g.png'/>");
     //为当前选项卡添加样式
     var Closeiocn=obj.attr("id");
     $("#"+Closeiocn+" a").html("<img src='images/ltee_close_h.png'/>");
     obj.removeClass("headtit");
     obj.addClass("current");
     try{
     	var tabid=obj.attr("tabid");
     	var table=$("div[page='menu_"+tabid+"'] [class^='table table-bordered table-hover']");
     	if(table.length>0){
     		table.bootstrapTable("refresh");
     		return;
     	}
     	var iframe_Tag=$("div[page='menu_"+tabid+"']").find("iframe:visible");
     	if(iframe_Tag.length>0){
     		iframe_Tag[0].contentWindow.refreshTable();
     		return;
     	}
     }catch(e){
     	 e.message;
     }
}

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
			var currTab = getCurrentPageObj();
			event =  enterEvents[currTab.attr("class")];
		}
		if(typeof(event)!=="undefined"){
			event();
		}
	}  
}); 