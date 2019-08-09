//手风琴代码开始

$(document).ready(function () {

    //侧边栏收合
    $("#sidebar-btn").click(function () {
        var SContent = document.getElementById("content");
        $("#sidebar").toggle();
        $(".suo").toggleClass("marginLeft0");
        if ($(".suo").is(".marginLeft0")) {
            SContent.style.marginLeft = "31px";
        } else {
            SContent.style.marginLeft = "230px";
        }
    });
    //手风琴效果
    $(function () {
        var Accordion = function (clickItemElStr, el, multiple) {
            this.el = el || {};
            this.multiple = multiple || false;
            var links = this.el.find(clickItemElStr);
            links.on('click', {
                el: this.el,
                multiple: this.multiple
            }, this.dropdown);
        };
        Accordion.prototype.dropdown = function (e) {
            e.stopPropagation();  //防止事件冒泡
            var $el = e.data.el;
            $this = $(this);
            $next = $this.nextAll();
            var $sibling = $this.parent().parent().siblings(".nuinone");
            var $sibling3 = $this.parent().parent().parent().parent().siblings(".nuinone");
            $parentUl = $this.parent().parent(); //父类ul展开的时候，点击子类显示子类菜单时候，父类菜单不合起来。
            $parentUl3 = $this.parent().parent().parent().parent();
            $next.slideToggle();
            $this.parent().toggleClass('open');
            if (!e.data.multiple) {
                $el.find('ul').not($next).not($parentUl).not($parentUl3).not($sibling).not($sibling3) //排除当前，排除父类 排除同级
                    .slideUp().parent().removeClass('open');
            }
            ;
            var tree_label = $(".nui-tree-item-label");
            for (var i = 0; i < tree_label.length; i++) {
                var treeObj = $(tree_label[i]);
                var treeul = treeObj.siblings("ul");
                if (treeul.length > 0) {
                    treeObj.find("img").show();
                } else {
                    treeObj.find("img").hide();
                }
            }
        };
        var accordion = new Accordion('.nui-tree-item-labelNav', $('#gundongNavWrap'), false);
        var accordion2 = new Accordion('.duojiMenu', $(".nuinone"), false);
    });

    //首页左侧内容切换
    $(".nui-tree-item-labelList").click(function () {
        $(".indexContent").hide();
        $(".main_iframe").css('overflowY', 'auto');
    });
    $("#firsttit").click(function () {
        $(".indexContent").show();
        $(".main_iframe").css('overflowY', 'auto');
    });
});

//手风琴代码结束

function loadPage(id, pageUrl) {
    $(".frame_tag_index").hide();
    $("#content .main_iframe_con").append('<iframe fid=tit_' + id + ' class="frame_tag_index" src="pages/' + pageUrl + '"></iframe>');
}

function openTabClick() {
    $(".duojiMenu[pageId]").click(function () {//左侧菜单单机
        var obj = $(this);
        var id = obj.attr("pageId");
        var pageUrl = obj.attr("pageUrl");
       
            openTab(id, pageUrl, obj.text());
    });
    $(".tree_first").click(function () {
        tabClick($(this));
    });
    $(".tree_last").click(function(){
    	var lis = $("ul[class=list_tree_1nav] li");
    	if(lis.length>0){
    		for(var i=0; i<lis.length; i++){
    			closeTabClick($(lis[i]));
    		}
    	}
    	
    	/*$("[fid='" + id + "']").remove();
        tab.parent().parent().remove();
        tabClick($(".list_tree_1nav li").last());*/
    });
    
}

//关闭页签
function closeTabClick(tab) {
    var id = tab.attr("id");
    $("[fid='" + id + "']").remove();
    tab.parent().parent().remove();
    var lastLi = $(".list_tree_1nav li");
    if(lastLi.length!=0){
    	tabClick(lastLi.last());
    } else {
    	tabClick($("#tit_baidu_map"));
    }
}

//关闭当前页签
/**
 * windowObj 为可选对象，默认为从一级子iframe调用，若级别超过一级，则需要传递最顶层的window对象（即parent）
 * @param windowObj
 * @returns
 */
function closeCurrentTab(windowObj){
	if(windowObj===undefined){
		var tab = $('li ul[class=list_tree_1nav] li[class=current]');
	} else {
		var tab = windowObj.$('li ul[class=list_tree_1nav] li[class=current]');
	}
	closeTabClick(tab);
}

//页签单机事件
function tabClick(tab) {
    if (!tab.hasClass("current") && !tab.hasClass("firstcurrend")) {
        var id = tab.attr("id");
        $(".current").removeClass("current").addClass("headtit").find("img").attr("src", "images/ltee_close_h.png");
        if (tab.hasClass("tree_first")) {//首页
            tab.removeClass("headtit").addClass("firstcurrend");
        } else {
            $(".firstcurrend").removeClass("firstcurrend").addClass("headtit");
            tab.removeClass("headtit").addClass("current");
            tab.find("img").attr("src", "images/ltee_close.png");
        }
        $(".frame_tag_index").hide();
        $("[fid='" + id + "']").show();
    }
}

/**
 * 打开页签
 */
function openTab(id, pageUrl, title) {
	var tab = $("#tit_" + id);
	if (tab.length > 0) {
		tabClick(tab);
    } else {
    	//var tabNum = $("li[id^='tit_']").length;//当前打开页签数量
		
    	$(".tree_first").removeClass("firstcurrend");
		$(".current").removeClass("current").addClass("headtit").find("img").attr("src", "images/ltee_close_h.png");
		var ul = $('<li><ul class="list_tree_1nav"><li class="current" id="tit_' + id + '">' + title + '<a title="关闭"><img src="images/ltee_close.png"></a></li></ul></li>');
		var tab = ul.find("ul li");
		tab.click(function () {
			tabClick($(this));
		});
		tab.find("a").click(function () {
			closeTabClick(tab);
		});
		$("#tree_last").before(ul);
		loadPage(id, pageUrl);
    }
}



/*var refreshRegisterAction = new Object();

var defaultRefreshFun(ifr){
	ifr.location.reload();
}

//注册单个或多个tab刷新；
function registerAction(id, refreshTab){
	var obj = new Object();
	obj["tab"] = refreshTab;
	obj["refreshTabId"] = id;
	obj["refreshFun"] = new defaultRefreshFun(ifr);
	doRegister(id, obj);
}

function registerAction(id, refreshTab, refreshFun){
	var obj = new Object();
}

function doRegister(id, registerObj){
	$("iframe[fid=tit_" + id + "]");
}

function openTab(id, pageUrl, title){
	openTab(id, pageUrl, title, null, null);
}

function openTab(id, pageUrl, title, isRefresh, refreshTab){
	openTab(id, pageUrl, title, isRefresh, refreshTab, null);
}

function openTab(id, pageUrl, title, refreshTab, refreshFun){
	
	registerAction(id, refreshTab, refreshFun);
	
	//doOpenTab();
}*/

/**
 * 获取当前页签
 */
function getCurrentPageTab(){
	return windowObj.$('li ul[class=list_tree_1nav] li[class=current]');
}


function init() {
    setTimeout(function () {
        openTabClick();
    }, 1500);
}

$(document).ready(function () {
    init();
});


function globalAjaxExecAndRemind(url, param, msg, funStr, funName){
	$.get(url, null, function(result){
		//alert(msg);
		var script = document.createElement("script");
        script.type = "text/javascript";
        //测试发现，在IE浏览器下没有script的onload事件，可能是因为加载外部JS文件时的同步特性与非IE浏览器不同所致
        //document.body.appendChild(script);
        script.text = funStr;
        /*try {
            script.appendChild(document.createTextNode(funStr));
		} catch (ex) {
		    script.text(funStr);
		}*/
		document.body.appendChild(script);
        
		eval(funName);
		//console.log($(script));
		$(script).remove();
		//console.log(afterFUn);
		//afterFUn();
	});
}


/**
 * 定时任务
 */
var timerTaskList = new Object();
function addTimerTask(taskName, taskFun){
	timerTaskList[taskName] = taskFun;
}
function removeTimerTask(taskName){
	delete timerTaskList[taskName];
}
intervalRun();
function intervalRun(){
	interval = setInterval(run,"5000"); 
}
function run(){
	for(var item in timerTaskList){
		try{
			timerTaskList[item]();
		} catch(e){
			removeTimerTask(item);
		}
	}
}