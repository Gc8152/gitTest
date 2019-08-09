
//解决ie8下数组indexof方法不能用的问题
$(function(){
	if (!Array.prototype.indexOf)
	{
	  Array.prototype.indexOf = function(elt /*, from*/)
	  {
	    var len = this.length >>> 0;
	    var from = Number(arguments[1]) || 0;
	    from = (from < 0)
	         ? Math.ceil(from)
	         : Math.floor(from);
	    if (from < 0)
	      from += len;
	    for (; from < len; from++)
	    {
	      if (from in this &&
	          this[from] === elt)
	        return from;
	    }
	    return -1;
	  };
	}
});

var IEVersion=(function(){
	if(navigator.appName=='Microsoft Internet Explorer'&&navigator.appVersion.match(/8./i)=="8."){
		return 8;
	}else if(navigator.appName=='Microsoft Internet Explorer'&&navigator.appVersion.match(/9./i)=="9."){
		return 9;
	}else if(navigator.appName=='Microsoft Internet Explorer'&&navigator.appVersion.match(/10./i)=="10."){
		return 10;
	}else if(navigator.appName=='Microsoft Internet Explorer'&&navigator.appVersion.match(/11./i)=="11."){
		return 11;
	}else {
		return 0;
	}
})();

/**
 * html5 Placeholder提示
 */
function initPlaceholder(){
	if(IEVersion==8||IEVersion==9){
		var objs=$("[placeholder]");
		for(var i=0;i<objs.length;i++){
			var obj=$(objs[i]);
			var pval=obj.attr("placeholder");
			if(pval.indexOf("点击选择")!=-1){
				obj.attr("readonly","readonly");
			}
			obj.val(obj.attr("placeholder"));
			initPlaceholderEvent(obj);
		}
	}
}
/**
 * 获取html5下的有placeholder属性的输入框的值 兼容ie8
 * @param obj
 * @returns
 */
function getPlaceholder(obj){
	var attr=obj.attr("placeholder");
	if(attr&&obj.val()==attr){
		return "";
	}
	return escape(encodeURIComponent(obj.val()));
}
/**
 * 提示事件
 */
function initPlaceholderEvent(obj){
	obj.on("blur",function(){
		if(""==$.trim(obj.val())){
			obj.val(obj.attr("placeholder"));
		}
	});
	obj.on("focus",function(){
		if(obj.attr("placeholder")==$.trim(obj.val())){
			obj.val("");
		}
	});
}
/**
 * 全局的下拉缓存
 */
var globalSelectCache={};
globalSelectCache["count"]=0;
/**
 * 获取url后面的参数
 * @param name
 * @returns
 */
function getParamString(name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
		var r = window.location.search.substr(1).match(reg);
		if (r != null)
			return unescape(r[2]);
		return null;
	}

function baseAjaxNoLoading(url, param, callback, async) {
	$.ajax({
		type : "post",
		url : url,
		async : async == undefined ? true : false,
		data : param,
		dataType : "json",
		success : function(msg) {
			callback(msg);
		},
		error : function() {
			callback();
		}
	});
}

function baseAjax(url, param, callback, async) {
	startLoading();
	$.ajax({
		type : "post",
		url : url,
		async : async == undefined ? true : false,
		data : param,
		dataType : "json",
		success : function(msg) {
			endLoading();
			callback(msg);
		},
		error : function() {
			endLoading();
			callback();
		}
	});
}
/**
 * 代理外包人员的baseAjax
 * @param url
 * @param param
 * @param callback
 * @param async
 */
function baseAjaxProxyOutSource(url, param, callback, async){
	baseAjaxProxy(url,dev_outsource, param, callback, async);
}

/**
 * 代理测试管理模块的Ajax
 * @param url
 * @param param
 * @param callback
 * @param async
 */
function baseAjaxProxyTest(url, param, callback, async){
	baseAjaxProxy("proxy.asp",dev_test+url, param, callback, async);
}
/**
 * 代理需求全流程模块的Ajax
 * @param url
 * @param param={}
 * @param callback
 * @param async
 */
function baseAjaxProxyConstruction(url, param, callback, async){
	baseAjaxProxy("proxy.asp",dev_construction+url, param, callback, async);
}
/**
 * 代理需求全流程模块的Ajax
 * @param url
 * @param param={}
 * @param callback
 * @param async
 */
function baseAjaxProxyWBSPlan(url, param, callback, async){
	baseAjaxProxy("proxy.asp",dev_planwork+url, param, callback, async);
}
/**
 * ajax代理
 * @param url
 * @param proxy_host
 * @param param
 * @param callback
 * @param async
 */
function baseAjaxProxy(url,proxy_host, param, callback, async){
	if(typeof(param)=='string'){
		param+="&proxy_url="+proxy_host;
	}else if(typeof(param)=='object'){
		param["proxy_url"]=proxy_host;
	}
	baseAjax("httpProxy/"+url, param, callback, async);
}


/**
 * 无加载框的ajax
 * @param url
 * @param param
 * @param callback
 * @param async
 */
function baseAjaxNoLoading(url, param, callback, async){
	$.ajax({
		type : "post",
		url : url,
		async : async == undefined ? true : false,
		data : param,
		dataType : "json",
		success : function(msg) {
			callback(msg);
		},
		error : function() {
			callback();
		}
	});
}
/**
 * 无需call和SID参数的jsonp请求函数
 * @param url
 * @param param
 * @param callback
 * @param async
 */
function baseAjaxJsonpNoCall(url, param, callback, async) {
	var call=getMillisecond()+parseInt(Math.random()*100);
	param=(param||{});
	param["call"]=call;
	try{
		param["SID"]=(window.SID||window.parent.SID);
	}catch(e){
		param["SID"]=window.parent.SID;
	}
	baseAjaxJsonp(url,param,callback,call,async);
}
//针对jsonp设计的通用ajax请求
function baseAjaxJsonp(url, param, callback,method, async) {
	startLoading();
	if(method=="" || method==null || method==undefined){
		method = "jsonp_success";
	}
	$.ajax({
		type : "get",
		url : url,
		async : async == undefined ? true : false,
		data : param,
		dataType : "jsonp",
		jsonp: "callback",//服务端用于接收callback调用的function名的参数  
        jsonpCallback: method,//回调函数名称，需要与后台返回的json数据串前缀保持一致
		success : function(msg) {
			callback(msg);
			endLoading();
		},
		error : function(msg) {
			endLoading();
			callback();
		}
	});
}
	/**
	 * 获取当前的年月日
	 * @returns {String}
	 */
	function getCurrentYMD(){  
	   var y,m,D;
	   d = new Date();         // 创建 Date 对象。
	   if(IEVersion==8){
		   y = (d.getYear()); // 获取年份。
	   }else{
		   y = (1900+d.getYear()); // 获取年份。 
	   }
	   m = (d.getMonth() + 1); // 获取月份。
	   D = d.getDate();        // 获取日。
	   return y+'-'+(m<10?"0":"")+m+'-'+(D<10?"0":"")+D;
	}
	
	/**
	 * 获取当前的年月日时分秒
	 * @returns {String}
	 */
	function getCurrentYMDHMS() {
		getCurrentYMDHMSByJoin("-",":"," ");
	}
	function getCurrentYMDHMSByJoin(seperator1,seperator2,seperator3) {
	    var date = new Date();
	    var month = date.getMonth() + 1;
	    var strDate = date.getDate();
	    if (month >= 1 && month <= 9) {
	        month = "0" + month;
	    }
	    if (strDate >= 0 && strDate <= 9) {
	        strDate = "0" + strDate;
	    }
	    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
	            + seperator3 + date.getHours() + seperator2 + date.getMinutes()
	            + seperator2 + date.getSeconds();
	    return currentdate;
	}
	/**
	 * 根据URL做select2
	 * @param obj对象
	 * @param url url
	 * @param item	{code:"",name:""}
	 */
	function initSelectByUrl(obj,url,item,func_call){
		obj.html("");
		obj.empty();
		baseAjaxJsonpNoCall(url,{},function(data){
			if(data){
				for(var i=0;i<data.length;i++){
					obj.append('<option value="'+data[i][item["code"]]+'">'+data[i][item["name"]]+'</option>');	
				}
			}
			obj.select2();
			if(func_call){
				func_call();
			}
		});
	}
/**
 * 根据URl设置下拉框数据
 * @param obj $("#id")
 * @param show {"value":"enname","text":"cnname"}
 * @param url
 * @param arr 数组为需要过滤掉的数据，用于过滤部分字典项 如：["01","02"]
 */
function initSelect(obj,show,param,default_v,preStr,arr){
		globalSelectCache["count"]=globalSelectCache["count"]+1;
		if(globalSelectCache[param.dic_code]!=undefined&&globalSelectCache[param.dic_code]["data"]!=undefined){
			initSelectByData(obj,show,globalSelectCache[param.dic_code]["data"],default_v,arr);
			if(new Date().getTime()-globalSelectCache[param.dic_code]["startDate"]>50000){
				globalSelectCache[param.dic_code]={};
			}
			return;
		}
		if(globalSelectCache["count"]>7){
			globalSelectCache={};
			globalSelectCache["count"]=1;
		}
		if(!preStr){
			preStr="";
		}
		baseAjax(preStr+"SDic/findItemByDic.asp",param,function(data){
			if(data!=undefined){
				globalSelectCache[param.dic_code]={};
				globalSelectCache[param.dic_code]["data"]=data;
				globalSelectCache[param.dic_code]["startDate"]=new Date().getTime();
				initSelectByData(obj,show,data,default_v,arr);
			}
		});
}
/**
 * 追加下拉数据
 * @param obj
 * @param show
 * @param param
 * @param default_v
 * @param arr "01,02" 过滤不需要的值
 */
function appendSelect(obj,show,param,default_v,arr){
	baseAjax("SDic/findItemByDic.asp",param,function(data){
		if(data!=undefined){
			selectAppendByData(obj,show,data,default_v,arr);
		}
	});
}
	
/**
 * 根据data设置下拉（数据过滤）  
 * @param obj
 * @param show
 * @param data
 */
function initSelectByData(obj,show,data,default_v,arr){
	if(obj!=undefined&&show!=undefined&&data!=undefined){
		obj.empty();
		if(arr==undefined){
			obj.append('<option id="removeOption" value=" " >请选择</option>');	
		}else if(arr.indexOf(" ")==-1){
			obj.append('<option id="removeOption" value=" " >请选择</option>');
		}
		for(var i=0;i<data.length;i++){
			if(arr!=undefined&&arr.indexOf(data[i][show.value])!=-1){
				continue;
			}
			if(default_v==undefined||default_v==""){
				default_v=data[i]["IS_DEFAULT"]=="00"?data[i][show.value]:"";
			}
			obj.append('<option value="'+data[i][show.value]+'">'+data[i][show.text]+'</option>');	
		}
		if(default_v!=undefined&&default_v!=""){
			obj.val(default_v);
		}else{
			obj.val(" ");
		}
		obj.select2();
		//$("#removeOption").remove();//神奇的将select 设置为空
		//alert(obj.val());
	}
}
	/**
	 * 根据data设置下拉    
	 * @param obj         下拉框元素
	 * @param show      显示的字段
	 * @param data       字典类的值
	 * @param arr "01,02"过滤不需要的值
	 */
	function selectAppendByData(obj,show,data,default_v,arr){
		if(obj!=undefined&&show!=undefined&&data!=undefined){
			for(var i=0;i<data.length;i++){
				if(arr!=undefined&&arr.indexOf(data[i][show.value])!=-1){
					continue;
				}
				obj.append('<option value="'+data[i][show.value]+'">'+data[i][show.text]+'</option>');	
			}
			if(default_v!=undefined&&default_v!=""){
				obj.val(default_v);
			}
			obj.select2();
		}
	}
	/**
	 * 设置选中值
	 */
	function setSelected(obj,value){
		obj.val(value);
		obj.select2();
	}
	/**
	 * 根据diccode标签初始化下拉框
	 * @param parentObj jquery obj
	 */
	function autoInitSelect(parentObj,preStr){
		var code=parentObj.attr("diccode");
		if(code!=""&&code!=undefined){
			var defaultV=parentObj.attr("value");
			initSelect(parentObj,{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:code},(defaultV==""?undefined:defaultV),preStr);
			return;
		}
		var objs=parentObj.find("[diccode]");
		for(var i=0;i<objs.length;i++){
			var obj=$(objs[i]);
			var diccode=obj.attr("diccode");
			var defaultV=obj.attr("value");
			initSelect(obj,{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:diccode},(defaultV==""?undefined:defaultV),preStr);
		}
	}
	/**
	 * 根据dic_code初始化下拉数据
	 * @param obj
	 * @param dic_code
	 */
	function autoInitSelectByDic(obj,dic_code){
		if(dic_code!=""&&dic_code!=undefined){
			var defaultV=obj.attr("value");
			initSelect(obj,{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:dic_code},(defaultV==""?undefined:defaultV));
			return;
		}
	}
	
	/**
	 * 根据data设置下拉（数据过滤）  
	 * @param obj
	 * @param show
	 * @param data
	 */
	function initSelectByData(obj,show,data,default_v,arr){
		if(obj!=undefined&&show!=undefined&&data!=undefined){
			obj.empty();
			if(arr==undefined){
				obj.append('<option id="removeOption" value=" " >请选择</option>');	
			}else if(arr.indexOf(" ")==-1){
				obj.append('<option id="removeOption" value=" " >请选择</option>');
			}
			for(var i=0;i<data.length;i++){
				if(arr!=undefined&&arr.indexOf(data[i][show.value])!=-1){
					continue;
				}
				if(default_v==undefined||default_v==""){
					default_v=data[i]["IS_DEFAULT"]=="00"?data[i][show.value]:"";
				}
				obj.append('<option value="'+data[i][show.value]+'">'+data[i][show.text]+'</option>');	
			}
			if(default_v!=undefined&&default_v!=""){
				obj.val(default_v);
			}else{
				obj.val(" ");
			}
			obj.select2();
			//$("#removeOption").remove();//神奇的将select 设置为空
			//alert(obj.val());
		}
	}
	/**
	 *下拉多选
	 */
	function initSelectByDataMore(obj,show,data,default_v){
		if(obj!=undefined&&show!=undefined&&data!=undefined){
			obj.empty();
			for(var i=0;i<data.length;i++){
				if(default_v==undefined||default_v==""){
					default_v=data[i]["IS_DEFAULT"]=="00"?data[i][show.value]:"";
				}
				obj.append('<option value="'+data[i][show.value]+'">'+data[i][show.text]+'</option>');	
			}
			if(default_v!=undefined&&default_v!=""){
				var mycars=default_v.split(",");
				obj.val(mycars).trigger('change');
			}else{
				obj.val(" ");
			}
			obj.select2();
		}
	}
	/**
	 * 下拉多选
	 * @param obj
	 * @param show
	 * @param param
	 * @param default_v
	 * @param preStr
	 */
	function initSelectByMore(obj,show,param,default_v,preStr){
		globalSelectCache["count"]=globalSelectCache["count"]+1;
		if(globalSelectCache[param.dic_code]!=undefined&&globalSelectCache[param.dic_code]["data"]!=undefined){
			initSelectByDataMore(obj,show,globalSelectCache[param.dic_code]["data"],default_v);
			if(new Date().getTime()-globalSelectCache[param.dic_code]["startDate"]>50000){
				globalSelectCache[param.dic_code]={};
			}
			return;
		}
		if(globalSelectCache["count"]>7){
			globalSelectCache={};
			globalSelectCache["count"]=1;
		}
		if(!preStr){
			preStr="";
		}
		baseAjax(preStr+"SDic/findItemByDic.asp",param,function(data){
			if(data!=undefined){
				globalSelectCache[param.dic_code]={};
				globalSelectCache[param.dic_code]["data"]=data;
				globalSelectCache[param.dic_code]["startDate"]=new Date().getTime();
				initSelectByDataMore(obj,show,data,default_v);
			}
		});
	}
	/**
	 * 展开ztree树的前两层节点
	 * @param treeId=不带#号的treeID
	 * 在ztree加载完成后使用[onAsyncSuccess: function(){}]
	 */
	function expandNode(treeId){
		var treeObj = $.fn.zTree.getZTreeObj(treeId);
		treeObj.expandNode(treeObj.getNodeByTId("c_workplace_tree"+"_1"), true, false, true);//展开第一级
		var level1=$("#"+treeId+" li.level1");
		for(var i=0;i<level1.length;i++){
			var id=$(level1[i]).attr("id");
			treeObj.expandNode(treeObj.getNodeByTId(id), true, false, true);//展开第二级
		}
	}
	/**
	 * 
	 * @param obj 输入框对象
	 * @param url 后台请求数据的URL
	 * @param treeId 为了避免 多个页面同时使用 相同的下拉树，所以需要传一个唯一的treeId来区分
	 * @param topY 给自动计算的top像素增加一个数值 数值类型 是数字 (这种事错误的'30')
	 * @param callback 选择数据时的回调函数
	 */
	function openSelectTreeDivToBody(obj,treeId,url,topY,callback,selectMore){
		var offset=obj.offset();
		var left=offset.left;
		var top=offset.top+topY;
		if($("#"+treeId).length<=0){
			$("body:eq(0)").append('<div id="'+treeId+'" style="top:'+top+'px;left:'+left+'px;z-index:10;" class="org_select_tree ztree"></div>');
		}else{
			$("#"+treeId).css({top:top,left:left});
		}
		$("#"+treeId).css({"width":obj.width()});
		initObjSelectTree(treeId,url,callback,selectMore);
	}
	/**
	 * 
	 * @param obj=$("#input")
	 * @param treeId=树形下拉的ID
	 * @param url
	 * @param callback
	 */
	function openSelectTreeDiv(obj,treeId,url,css,callback,selectMore){
		if(!openSelectTreeDiv[treeId]||$("#"+treeId).length==0){
			var style=""; if(css["margin-left"]){style="margin-left:"+css["margin-left"]+";";};
			 if(css["margin-top"]){style+="margin-top:"+css["margin-top"]+";";};
			var width=""; if(css.width){width="width:"+css.width+";";};
			var height="height:auto;min-height:130px;max-height:300px;"; if(css.height){height="height:"+css.height+";";};
			obj.after('<div id="'+treeId+'" class="ztree drop-ztree" style="'+style+' overflow-y: auto;z-index: 1000;background-color: white;border:1px solid #CDCDCD;'+height+'position:absolute;'+width+'">&nbsp;aaa&nbsp;</div>');
			openSelectTreeDiv[treeId]="11";
		}else{
			if(css.width){
				$("#"+treeId).css("width",css.width);
			}
			$("#"+treeId).show();
		}
		initObjSelectTree(treeId,url,callback,selectMore);
	}
	/**
	 * 初始化选择树
	 * @param treeId
	 * @param url
	 */
	function initObjSelectTree(treeId,url,callback,selectMore){
		var isvisable=true;
		$("#"+treeId).unbind("click");
		$("#"+treeId).click(function(){
			isvisable=false;
		});
		
		$("body:eq(0)").unbind("click");
		$("body:eq(0)").click(function(){
			if(isvisable){
				$("#"+treeId).hide();
			}
			isvisable=true;
		});
		var setting = {
				async : {
					enable : true,
					url : url,
					contentType : "application/json",
					type : "get",
					autoParam: ["id"]
				},
				view : {
					dblClickExpand : false,
					showLine : true,
					selectedMulti : false
				},
				data : {
					simpleData : {
						enable : true,
						idKey : "id",
						pIdKey : "pid",
						rootPId : ""
					}
				},
				callback : {
					onAsyncSuccess: function(){
						$("#"+treeId).show();
						var treeObj = $.fn.zTree.getZTreeObj(treeId);
						treeObj.expandNode(treeObj.getNodeByTId(treeId+"_1"), true, false, false);
					},
					onClick : function(event, treeId, treeNode) {
						if(callback){
							var c=callback(treeNode);
							if(selectMore!=true){
								if(c==undefined||c==true){
									$("#"+treeId).hide();
								}
							}
						}else{
							$("#"+treeId).hide();
						}
					}
				}
			};
		try{
			$.fn.zTree.init($("#"+treeId), getCurrentPageObj()[0].setting||setting);
		}catch(e){
			$.fn.zTree.init($("#"+treeId),setting);
		}
	}

	/**
	 * 初始化验证
	 * @param obj
	 * <input type="text" validate="v.required" valititle="该项为必填123" name="M.menu_no" class="span11" placeholder="菜单编号 "> 
	 * initVlidate($("#menu_form")); vlidate($("#menu_form"));
	 */
	function initVlidate(obj){
		obj.find("[validate^='v.']").each(function(){
			$(this).siblings("strong[class^='high']").remove();
		});
		obj.find("[validate^='v.']").each(function(){
			var obj=$(this).parent().parent();
			if("TD"==obj[0].nodeName){
				obj.append($("<strong class='high'>*</strong>"));
			}else{
				$(this).parent().append($("<strong class='high'>*</strong>")); //然后将它追加到文档中
			}
		});
		hideVlidate();
	}
	var ttop=0;
	/**
	 * 计算并返回tip提示的css样式
	 * @param t
	 * @returns {String}
	 */
	function getTipCSS(t){
		if(t.length==0){
			return "";
		}
		var left=t.offset().left;
		var top=t.offset().top;
		left+=t.outerWidth()-10;
		return "left:"+left+"px;top:"+(top+24)+"px;";
	}
	function getTipCSSAbsolute(t){
		if(t.length==0){
			return "";
		}
		var left=t.offset().left;
		var top=t.offset().top+$(content).scrollTop()+getCurrentPageObj().scrollTop();
		left+=t.outerWidth()-$("div.main_container").outerWidth()-10;
		return "left:"+left+"px;top:"+(top-9-ttop-65)+"px;";
	}
	$(document).on("click","a[data-toggle='tab']",function(){
		$(".tag-position").remove();
	});	
	/**
	 * 清空验证 提示信息
	 */
	function clearVlidateTag(){
		$(".tag-content[id]").remove();
		//$(".tag-position-absolute[id]").remove();
	}
	$(document).on("click",".nav-tabs,.modal-backdrop,[data-dismiss='modal']",function(){
		clearVlidateTag();
	});
	/**
	 * 给一个对象增加提示
	 * @param obj
	 * @param title
	 * @param zindex
	 * @param isAbsolute
	 */
	function oneObjTip(tobj,title,style){
		var sstyle="";
		if(style){
			sstyle=style;
		}
		tobj.parent().append('<div class="tag-position" style="'+sstyle+'"><div class="tag-content" >'
				+title+'</div></div>'); //然后将它追加到文档中
	}
	function removeOneTip(tobj){
		tobj.siblings(".tag-position").remove();
	}
	/**
	 * valititle=提示信息
	 * validate=验证标记
	 * 验证
	 * @param obj
	 */
	function vlidate(obj,zindex,isAbsolute){
		clearVlidateTag();
		var zzindex="";
		if(zzindex!=undefined){
			zzindex="z-index:"+zindex+";";
		}
		var result=true;
		var parent=$('div[page^="menu"]:visible');
		ttop=0;
		if(parent.length==0){
			ttop=40;
			parent=$("[menu_page]:visible");
		}
		parent.find(".tag-position[id]").remove();
		obj.find("[validate^='v.']").each(function(){
			var tobj=$(this);
			if(tobj.parent("td:hidden").length>0){
				return;
			}
			$(this).parent().find("br").remove();
			var form=$(this);
		//	var tipCSS="";
		/*	var absoluteClass="";
			if(!isAbsolute){
				tipCSS=getTipCSS(form.siblings(".high"))+zzindex;
			}else{
				tipCSS=getTipCSSAbsolute(form.siblings(".high"))+zzindex;
				absoluteClass="-absolute";
			}*/
			
			var uuid=form.attr("validateId");
			if(uuid==undefined||uuid==""){
				uuid=Math.uuid();
			}
			form.attr("validateId",uuid);
			//$("#"+uuid).remove();
			var formVal=$.trim(form.val());
			if(form.attr("validate")=="v.required"&&(formVal==""||formVal==form.attr("placeholder"))){
				$(this).parent().append('<div  id="'+uuid+'"  class="tag-content" >'+($(this).attr("valititle")||"该项必填")+'</div>'); //然后将它追加到文档中
				result=false;
			}//验证密码
			else if(form.attr("validate")=="v.password"&&(formVal==""||(formVal!=""&&!/^[a-zA-Z]\w{7,17}$/.test(formVal)))){
				$(this).parent().append('<div  id="'+uuid+'"  class="tag-content" >'+'密码以字母开头,包含字母、数字或下划线且长度为8-18位'+'</div>');
				result=false;
			}//验证密码(首页登录)
			else if(form.attr("validate")=="v.passwordFp"&&(formVal==""||(formVal!=""&&!/^[a-zA-Z](?=.*[0-9])[a-zA-Z0-9]{7,17}$/.test(formVal)))){
				$(this).parent().append('<div  id="'+uuid+'"  class="tag-content" >'+'密码以字母开头并至少包含一个数字且长度为8-18位'+'</div>');
				result=false;
			}//验证邮箱
			else if(form.attr("validate")=="v.email"&&(formVal==""||(formVal!=""&&!/.+@.+\.[a-zA-Z]{2,4}$/.test(formVal)))){
				$(this).parent().append('<div  id="'+uuid+'"  class="tag-content" >'+'无效的的邮箱'+'</div>');
					result=false;
			}//验证手机号码
			else if(form.attr("validate")=="v.mobile"&&(formVal==""||(formVal!=""&&!/^1[34578]\d{9}$/.test(formVal)))){
				$(this).parent().append('<div  id="'+uuid+'"  class="tag-content" >'+'无效的手机号码'+'</span>');
				result=false;
			}//验证客服电话
			else if(form.attr("validate")=="v.tel"&&(formVal==""||(formVal!=""&&!/^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/.test(formVal)))){
				$(this).parent().append('<div  id="'+uuid+'"  class="tag-content" >'+'无效的电话号码'+'</span>');
				result=false;
			}//验证数字--整数
			else if(form.attr("validate")=="v.isint"&&(formVal==""||(formVal!=""&&!/^\d+$/.test(formVal)))){
				$(this).parent().append('<div  id="'+uuid+'"  class="tag-content" >'+'无效的数字'+'</span>');
				result=false;
			}//验证数字--浮点
			else if(form.attr("validate")=="v.isfloat"&&(formVal==""||(formVal!=""&&!/^\d+(\.\d+)?$/.test(formVal)))){
				$(this).parent().append('<div  id="'+uuid+'"  class="tag-content" >'+'无效的数字'+'</span>');
				result=false;
			}//验证身份证
			else if(form.attr("validate")=="v.idcard"&&(formVal==""||(formVal!=""&&!/^(\d{15}$|^\d{18}$|^\d{17}(\d|X|x))$/.test(formVal)))){
				$(this).parent().append('<div  id="'+uuid+'"  class="tag-content" >'+'无效的身份证号码'+'</div>');
				result=false;
			}//验证货币
			else if(form.attr("validate")=="v.currency"&&(formVal!=""&&!/^d{0,}(\.\d+)?$/.test(formVal))){
				$(this).parent().append('<div  id="'+uuid+'"  class="tag-content" >'+'货币格式不正确'+'</div>');
				result=false;
			}//验证qq
			else if(form.attr("validate")=="v.qq"&&(formVal!=""&&!/^[1-9]\d{4,9}$/.test(formVal))){
				$(this).parent().append('<div  id="'+uuid+'"  class="tag-content" >'+'QQ号码格式不正确(正确如：453384319)'+'</div>');
				result=false;
			}//验证中文
			else if(form.attr("validate")=="v.chinese"&&(formVal==""||(formVal!=""&&!/^[\u0391-\uFFE5]+$/.test(formVal)))){
				$(this).parent().append('<div  id="'+uuid+'"  class="tag-content" >'+'请输入中文'+'</div>');
				result=false;
			}//验证英文
			else if(form.attr("validate")=="v.english"&&(formVal==""||(formVal!=""&&!/^[A-Za-z]+$/.test(formVal)))){
				$(this).parent().append('<div  id="'+uuid+'"  class="tag-content" >'+'请输入英文'+'</div>');
				result=false;
			}//验证用户名
			else if(form.attr("validate")=="v.username"&&(formVal!=""&&!/^[a-zA-Z][a-zA-Z0-9_]{5,15}$/.test(formVal))){
				$(this).parent().append('<div  id="'+uuid+'"  class="tag-content" >'+'用户名不合法（字母开头，允许6-16字节，允许字母数字下划线）'+'</div>');
				result=false;
			}//验证传真
			else if(form.attr("validate")=="v.faxno"&&(formVal!=""&&!/^((\(\d{2,3}\))|(\d{3}\-))?(\(0\d{2,3}\)|0\d{2,3}-)?[1-9]\d{6,7}(\-\d{1,4})?$/.test(formVal))){
				$(this).parent().append('<div  id="'+uuid+'"  class="tag-content" >'+'传真号码不正确'+'</div>');
				result=false;
			}//验证邮政编码
			else if(form.attr("validate")=="v.zip"&&(formVal!=""&&!/^[0-9]\d{5}$/.test(formVal))){
				$(this).parent().append('<div  id="'+uuid+'"  class="tag-content" >'+'邮政编码格式不正确'+'</div>');
				result=false;
			}//验证验证IP地址
			else if(form.attr("validate")=="v.ip"&&(formVal!=""&&!/((?:(?:25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(?:25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d))))/.test(formVal))){
				$(this).parent().append('<div  id="'+uuid+'"  class="tag-content" >'+'IP地址格式不正确'+'</div>');
				result=false;
			}//验证姓名,可以是中文或英文
			else if(form.attr("validate")=="v.name"&&(formVal!=""&&!/d+.d+.d+.d+/.test(formVal))){
				$(this).parent().append('<div  id="'+uuid+'"  class="tag-content" >'+'请输入姓名'+'</div>');
				result=false;
			}//验证车牌号码
			else if(form.attr("validate")=="v.carNo"&&(formVal!=""&&!/^[\u4e00-\u9fa5]{1}[A-Z]{1}[A-Z_0-9]{5}$/.test(formVal))){
				$(this).parent().append('<div  id="'+uuid+'"  class="tag-content" >'+'车牌号码无效（例：粤J12350）'+'</div>');
				result=false;
			}//验证发动机型号
			else if(form.attr("validate")=="v.carenergin"&&(formVal!=""&&!/d+.d+.d+.d+/.test(formVal))){
				$(this).parent().append('<div  id="'+uuid+'"  class="tag-content" >'+'发动机型号无效(例：FG6H012345654584)'+'</div>');
				result=false;
			}//验证msn
			else if(form.attr("validate")=="v.msn"&&(formVal!=""&&!/d+.d+.d+.d+/.test(formVal))){
				$(this).parent().append('<div  id="'+uuid+'"  class="tag-content" >'+'请输入有效的msn账号(例：abc@hotnail(msn/live).com)'+'</div>');
				result=false;
			}
			//50字以内
			else if(form.attr("validate")=="v.50_zhi"&&(formVal!=""&&!/^(.|\n){0,50}$/.test(formVal))){
				form.parent().append('<div class="tag-position"><span class="tag-icon"></span><div class="tag-content" >'+'请输入50字以内任意字符'+'</span>');
				result=false;
				return result;
			}
			//50字以内（必填）
			else if(form.attr("validate")=="v.50_mzhi"&&(formVal==""||(formVal!=""&&!/^(.|\n){0,50}$/.test(formVal)))){
				form.parent().append('<div class="tag-position"><span class="tag-icon"></span><div class="tag-content" >'+'请输入50字以内任意字符'+'</span>');
				result=false;
				return result;
			}
			//100字以内
			else if(form.attr("validate")=="v.100_zhi"&&(formVal!=""&&!/^(.|\n){0,100}$/.test(formVal))){
				form.parent().append('<div class="tag-position"><span class="tag-icon"></span><div class="tag-content" >'+'请输入100字以内任意字符'+'</span>');
				result=false;
				return result;
			}
			//100字以内（必填）
			else if(form.attr("validate")=="v.100_mzhi"&&(formVal==""||(formVal!=""&&!/^(.|\n){0,100}$/.test(formVal)))){
				form.parent().append('<div class="tag-position"><span class="tag-icon"></span><div class="tag-content" >'+'请输入100字以内任意字符'+'</span>');
				result=false;
				return result;
			}
			//150字以内
			else if(form.attr("validate")=="v.150_zhi"&&(formVal!=""&&!/^(.|\n){0,150}$/.test(formVal))){
				form.parent().append('<div class="tag-position"><span class="tag-icon"></span><div class="tag-content" >'+'请输入150字以内任意字符'+'</span>');
				result=false;
				return result;
			}
			//150字以内（必填）
			else if(form.attr("validate")=="v.150_mzhi"&&(formVal==""||(formVal!=""&&!/^(.|\n){0,150}$/.test(formVal)))){
				form.parent().append('<div class="tag-position"><span class="tag-icon"></span><div class="tag-content" >'+'请输入150字以内任意字符'+'</span>');
				result=false;
				return result;
			}
			//200字以内
			else if(form.attr("validate")=="v.200_zhi"&&(formVal!=""&&!/^(.|\n){0,200}$/.test(formVal))){
				form.parent().append('<div class="tag-position"><span class="tag-icon"></span><div class="tag-content" >'+'请输入200字以内任意字符'+'</span>');
				result=false;
				return result;
			}
			//200字以内（必填）
			else if(form.attr("validate")=="v.200_mzhi"&&(formVal==""||(formVal!=""&&!/^(.|\n){0,200}$/.test(formVal)))){
				form.parent().append('<div class="tag-position"><span class="tag-icon"></span><div class="tag-content" >'+'请输入200字以内任意字符'+'</span>');
				result=false;
				return result;
			}	//500字以内（必填）
			else if(form.attr("validate")=="v.500_mzhi"&&(formVal==""||(formVal!=""&&!/^(.|\n){0,500}$/.test(formVal)))){
				form.parent().append('<div class="tag-position"><span class="tag-icon"></span><div class="tag-content" >'+'请输入500字以内任意字符'+'</span>');
				result=false;
				return result;
			}
			//1000字以内
			else if(form.attr("validate")=="v.1000_zhi"&&(formVal!=""&&!/^(.|\n){0,1000}$/.test(formVal))){
				form.parent().append('<div class="tag-position"><span class="tag-icon"></span><div class="tag-content" >'+'请输入1000字以内任意字符'+'</span>');
				result=false;
				return result;
			}
			//1000字以内（必填）
			else if(form.attr("validate")=="v.1000_mzhi"&&(formVal==""||(formVal!=""&&!/^(.|\n){0,1000}$/.test(formVal)))){
				form.parent().append('<div class="tag-position"><span class="tag-icon"></span><div class="tag-content" >'+'请输入1000字以内任意字符'+'</span>');
				result=false;
				return result;
			}
			//验证1~100的数字
			else if(form.attr("validate")=="v.number"&&(formVal==""||(formVal!=""&&!/^([1-9]\d?|100)$/.test(formVal)))){
				$(this).parent().append('<div  id="'+uuid+'"  class="tag-content" >'+'请填写1~100的数字'+'</div>');
				result=false;
			}else if(form.attr("validate")=="v.number50"&&(formVal==""||formVal!="")){
				var v=parseInt(formVal);
				if(isNaN(v)||v>50||v<=0||formVal.indexOf(".")!=-1){
					$(this).parent().append('<div  id="'+uuid+'"  class="tag-content" >'+'请填写1~50的数字'+'</div>');
					result=false;
				}
			}
			//两位小数
			else if(form.attr("validate")=="v.float2"&&(formVal==""||(formVal!=""&&!/^[0-9]+(.[0-9]{1,2})?$/.test(formVal)))){
				$(this).parent().append('<div  id="'+uuid+'"  class="tag-content" >'+'请填写数字，保留两位小数'+'</div>');
				result=false;
			}//验证为必填项且字符数小于500;
			else if(form.attr("validate")=="v.charCountLimit"&&(formVal==""||(form.val().length>1200))){
				$(this).parent().append('<div  id="'+uuid+'"  class="tag-content" >'+'描述信息为必填项且字数不可大于500! 当前字数：'+form.val().length+'</div>'); //然后将它追加到文档中
				result=false;
			}//验证为必填项且字符数;
			if(form.attr("validate")=="v.length"){
				var length=$.trim(form.val().length);
				if(length==0){
					$(this).parent().append('<div  id="'+uuid+'" class="tag-content" >该项必填</div>'); 
					result=false;
				}
				var maxLength=parseInt(form.attr("length"));
				if(length>maxLength){
					$(this).parent().append('<div  id="'+uuid+'" class="tag-content" >'+'最大字符数'+maxLength+'当前字数'+length+'</div>');
					result=false;
				}
			}
		});	
		return result;
	}

/**
 * 隐藏表单验证信息
 */
function hideVlidate(){
	$("input").focus(function(){
		$("#"+$(this).attr("validateId")).remove();
		//$(this).siblings("div[class^='tag-position']").remove();
	});
	$("select").change(function(){
		$("#"+$(this).attr("validateId")).remove();
		//$(this).siblings("div[class^='tag-position']").remove();
	});
	$("textarea").focus(function(){
		$("#"+$(this).attr("validateId")).remove();
		//$(this).siblings("div[class^='tag-position']").remove();
	});
}
/**
 * 去登录页面
 */
function toLoginPage(){
	baseAjax("logout.asp", {}, function(){});
	window.location="login.html";
	//window.parent.reLog();
}
var isloginTip=false;
/**
 * 重写原生的ajax,在重写的ajax上做通用操作。
 * @param $
 */
(function(jq){  
    var _ajax=jq.ajax;  
      
    jq.ajax=function(opt){
        var fn = {  
            error:function(XMLHttpRequest, textStatus, errorThrown){},  
            success:function(data, textStatus){}  
        };
        if(opt.error){  
            fn.error=opt.error;  
        }  
        if(opt.success){  
            fn.success=opt.success;  
        }  
        //扩展增强处理  
        var _opt = jq.extend(opt,{
            error:function(XMLHttpRequest, textStatus, errorThrown){  
                fn.error(XMLHttpRequest, textStatus, errorThrown);  
            },  
            success:function(data, textStatus){
            	if(data!=null&&("object"== typeof data&&data["logintimeout"]==true&&isloginTip==false)){
            		isloginTip=true;
            		nconfirm("登录超时,请重新登录!",function(){
            			toLoginPage();
            		});
            		return;
            	}
                fn.success(data, textStatus);  
            }  
        });  
        return _ajax(_opt);  
    };  
})(jQuery);

(function() {
	var CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split(''),
	    random;

	try {
	    random = Xorshift;
	} catch (err) {
	    random = Math.random;
	}

	// A more performant, but slightly bulkier, RFC4122v4 solution.  We boost performance
	// by minimizing calls to random()
	function Math_uuid() {
	  var _chars = CHARS, _random = random,
	      i = 0, uuid = new Array(36), rnd = 0;
	  
	  uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
	  uuid[14] = '4';
	  
	  for (; i < 36; ++i) {
	    if (i !== 8 && i !== 13 && i !== 18 && i !== 14 && i !== 23) {
	      if (rnd <= 0x02) {
	          rnd = 0x2000000 + (_random() * 0x1000000) | 0;
	      }
	      rnd >>= 4;
	      uuid[i] = _chars[(i === 19) ? ((rnd & 0xf) & 0x3) | 0x8 : rnd & 0xf];
	    }
	  }
	  return uuid.join('');
	}
	Math.uuid = Math_uuid;
	})();

/**
 * 模态框关闭事件
 */
function onModalCloseEvent(id,callback){
	$("#"+id).on("hidden.bs.modal",function(){
		$(".tag-position").remove();
		if(callback){
			callback();
		}
	});
}

(function(){
	$(document).on("click",".detailTitle",function(){
		if($(this).find("div>img").attr("src").indexOf("up.jpg")!=-1){
			$(this).find("div>img").attr("src","images/arr_down.jpg");
			$(this).parents("table").find("tr:gt(0)").hide();
		}else{
			$(this).find("div>img").attr("src","images/arr_up.jpg");
			$(this).parents("table").find("tr:gt(0)").show();
		}
	});
})();
//radio初始化
function autoInitRadio(dic_code,RadioTdId,RadioName,params){
	baseAjax("SDic/findItemByDic.asp",dic_code,function(data){
		if(data!=undefined){
			for(var i=0;i<data.length;i++){
				var disabled = "";
				if(params.disabled=="true"){
					disabled = "disabled";
				}
				if(params.type=="add"){
					if(data[i].IS_DEFAULT=='00'){
						RadioTdId.append("<label class="+params.labClass+"><input type='radio' "+disabled+" name="+RadioName+" value="+data[i].ITEM_CODE+" checked>&nbsp;"+data[i].ITEM_NAME+"</label>");
					}else{
						RadioTdId.append("<label class="+params.labClass+"><input type='radio' "+disabled+" name="+RadioName+" value="+data[i].ITEM_CODE+">&nbsp;"+data[i].ITEM_NAME+"</label>");
					}					
				}else{
					if(data[i].ITEM_CODE==params.value){
						RadioTdId.append("<label class="+params.labClass+"><input type='radio' "+disabled+" name="+RadioName+" value="+data[i].ITEM_CODE+" checked>&nbsp;"+data[i].ITEM_NAME+"</label>");
					}else{
						RadioTdId.append("<label class="+params.labClass+"><input type='radio' "+disabled+" name="+RadioName+" value="+data[i].ITEM_CODE+">&nbsp;"+data[i].ITEM_NAME+"</label>");
					}										
				}
			}
		}
	},false);				
}
//开始等待
function startLoading(disabledId) {
	if(disabledId != undefined && disabledId != ""){
		var $page = getCurrentPageObj();//当前页
		$page.find("#"+disabledId).attr("disabled","disabled");
	}
	$("<div class=\"datagrid-mask\" style='z-index:100000'></div>").css({
		display : "block", 
		width : "100%",
		height : $(document.body).height()
	}).appendTo("body");
	$("<div class=\"datagrid-mask-msg\" style='z-index:100002'></div>").html("正在处理，请稍等...").appendTo("body").css({
		display : "block",
		left : ($(document.body).outerWidth(true) - 190) / 2,
		top : ($(document.body).height() - 45) / 2
	});
}
// 结束等待
function endLoading(disabledId) {
	if(disabledId != undefined && disabledId != ""){
		var $page = getCurrentPageObj();//当前页
		$page.find("#"+disabledId).removeAttr("disabled");
	}
	$("div.datagrid-mask-msg").remove();
	$("div.datagrid-mask").remove();
}

/**
 * 显示隐藏控制
 */
function showHideByDetail(pre,task_type){
	var trs=getCurrentPageObj().find(pre+".ecitic-title-table tr");
	if(trs.length==0){
		trs=$(pre+".ecitic-title-table tr");
	}
	for(var i=0;i<trs.length;i++){
		var obj=$(trs[i]);
		var wu=obj.find("td:contains('无')");
		if((wu.length==2)||(obj.find("td").length==2&&wu.length==1)){
			obj.remove();
		}else{
		}
	}

	if(task_type&&"02"==task_type){//会议任务DETTASK_EXECUTOR_NAME
		getCurrentPageObj().find(pre+"#startendDate").hide();
		getCurrentPageObj().find(pre+"#DETTASK_EXECUTOR_NAME").parent().hide();
		getCurrentPageObj().find(pre+"#DETTASK_EXECUTOR_NAME").parent().next().attr("colspan","2");
		var range_name=getCurrentPageObj().find(pre+"#DETTASK_RANGE_NAME").prev();
		range_name.text("");
		range_name.attr("colspan","2");
		getCurrentPageObj().find(pre+"#DETTASK_RANGE_NAME").remove();
		getCurrentPageObj().find(pre+"#DETTASK_CONTENT").prev().text("会议主要内容：");
	}else if(task_type&&"03"==task_type){//协同任务
		$(pre+"#normalORassist").parent().hide();
		$(pre+"#normalORassist").parent().next().attr("colspan","2");
	}
} 
/**
 * 完成比动态展现
 */
function initExecRatio(){
	var obj=$("div[ratioBar]");
	obj.each(function(i){
		var rb=$(this).attr("ratioBar");
		$(this).css({"width":rb+"%"});
		if(rb>67){
			$(this).text(rb+"%");
		}else{
			var pobj=$(this).parent();
			if($.trim(pobj.text())==""){
				pobj.append(rb+"%");
			}
		}
	});
}

/**
 * ztree中展开部分一级树
 * @param obj
 * @param tid
 */
function expandNodeLevel1(treeObj,tid){
	treeObj.expandNode(treeObj.getNodeByTId(tid+"_1"), true, false, true);
	var level1s=$("#"+tid).find("li[tabindex][class='level1']");
	for(var i=0;i<level1s.length;i++){
		treeObj.expandNode(treeObj.getNodeByTId($(level1s[i]).attr("id")), true, false, true);
		if(i>1){
			break;
		}
	}
}

(function(){
	$(document).on("keydown",".number",function(e){
		var v=$(this).val();
		if(v.indexOf(".")!=-1&&e.keyCode==190){
			return false;
		}
		if(e.keyCode==190||e.keyCode==8||e.keyCode==46||(e.keyCode>=48 && e.keyCode<=57)||(e.keyCode>=35 && e.keyCode<=40)||(e.keyCode>=96 && e.keyCode<=105)){
			return true;
		}else{
			event.returnValue=false;
			return false;
		}
	});
	$(document).on("keyup",".number",function(e){
		var v=$(this).val();
		if(v.substring(0,1)=="0"&&v.substring(1,2)!="."&&e.keyCode!=8){
			$(this).val("0."+v.substring(1));
		}
		if(e.keyCode==190||e.keyCode==8||e.keyCode==46||(e.keyCode>=48 && e.keyCode<=57)||(e.keyCode>=35 && e.keyCode<=40)||(e.keyCode>=96 && e.keyCode<=105)){
			return true;
		}else{
			event.returnValue=false;
			return false;
		}
	});
	$(document).on("blur",".number",function(e){
		var v=$(this).val();
		if(v.substring(v.length-1,v.length)=="."){
			$(this).val(v+"0");
		}		
	});
})();
$(document).on("click",".delPreTaskPng",function(){
	$(this).siblings("input").val("");
	initPlaceholder();
});

/**
 * 获取对象数组里面的中文值和编码值 
 * @param array
 * @param k
 * @param v
 * @returns {Array}
 */
function arrayObjToStr2(obj,array,k,v,org_k){
	var map=obj.data("data");
	if(""==$.trim(obj.val())){
		obj.removeData("data");
		map=undefined;
	}else{
		var arrays=obj.val().split(",");
		map=(map||{});
		for(var i=0;i<arrays.length;i++){
			map[arrays[i]]="a";
		}
	}
	if(!array||!array.length){
		return ["","",""];
	}else if(array.length==1&&map==undefined){
		map={};
		map[array[0][k]]="a";
		obj.data("data",map);
		return [array[0][k],array[0][v],array[0][org_k]];
	}
	var keys="";
	var values="";
	var org_ks="";
	if(map==undefined){
		map={};
		keys=array[0][k];
		values=array[0][v];
		org_ks=array[0][org_k];
		
		map[array[0][k]]="a";
		for(var i=1;i<array.length;i++){
			map[array[i][k]]="a";
			keys+=","+array[i][k];
			values+=","+array[i][v];
			org_ks+=","+array[i][org_k];
		}
	}else{
		for(var i=0;i<array.length;i++){
			if(map[array[i][k]]==undefined&&keys!=""){
				map[array[i][k]]="a";
				keys+=","+array[i][k];
				values+=","+array[i][v];
				org_ks+=","+array[i][org_k];
			}else if(map[array[i][k]]==undefined){
				map[array[i][k]]="a";
				keys=array[i][k];
				values=array[i][v];
				org_ks=array[i][org_k];
			}
		}
	}
	obj.data("data",map);
	return [keys,values,org_ks];
}
/**
 * 页面的关闭按钮 
 */
(function(){
	$(document).on("click","input[name='closeCurrentPageTab']",function(){
		closeCurrPageTab();
	});
	$(document).on("click","input[name='closePageTabConfirm']",function(){
		closePageConfirm("确定离开该页面?",function(){
			closeCurrPageTab();
		});
	});
})();
/**
 * 页面内容收缩
 */
$(function(){
	EciticTitleI();
});
function EciticTitleI(){
	var citicTitle=getCurrentPageObj().find(".ecitic-title i");
	if(citicTitle.length>0){
		getCurrentPageObj().find(".ecitic-title i").click(function(){
			if($(this).is(".open")){
				$(this).removeClass("open");
			}else{
				$(this).addClass("open");
			}
			$(this).parent().next().slideToggle();
		});
	}
}
/**
 * 初始化任务关注事件
 */
function initAttentTaskEvent(){
	var objs=getCurrentPageObj().find(".attentionpng");
	objs.unbind("click");
	objs.click(function(){
		var selector="img";
		var obj=$(this).find(selector);
		var opting=obj.attr("opting");
		if(opting=="opting"){
			return;
		}
		obj.attr("opting","opting");
		var src=obj.attr("src");
		if(src.indexOf("unattention")!=-1){
			obj.attr("src","images/attentioned.png");
			obj.attr("title","点击取消关注");
			baseAjax("TaskAttention/attentionTask.asp",{task_id:$(this).attr("atttId")},function(dt){obj.attr("opting","");});
		}else{
			obj.attr("src","images/unattention.png");
			obj.attr("title","点击关注");
			baseAjax("TaskAttention/cancelAttentionTask.asp",{task_id:$(this).attr("atttId")},function(dt){obj.attr("opting","");});
		}
	});
}

/**
 * 表单赋值
 */
(function ($) {
    $.fn.setform = function (jsonValue) {
        var obj = this;
        $.each(jsonValue, function (name, ival) {
        	if(ival !=null){
            var $oinput = obj.find("[name=" + name + "]");
            if ($oinput.attr("type")== "radio" || $oinput.attr("type")== "checkbox") {
            	 if($oinput.attr("type")== "checkbox"){
          		   ival = ival.split(',');
          	   }
               $oinput.each(function(){
                 if(Object.prototype.toString.apply(ival) == '[object Array]'){//是复选框，并且是数组
                    for(var i=0;i<ival.length;i++){
                    	$('input[name='+name+']').each(function(){ 
                            if($(this).val()==ival[i])
                               $(this).attr("checked", "checked");
                    	});
                    	
                    }
                 }
                 else{
                 if($(this).val()==ival)
                    $(this).attr("checked", "checked");
                    }
               });
            }
            else
            {
            	var select2Vlaue=obj.find("select[name="+name+"]");
            	if(select2Vlaue.attr("name") == name){
            		setTimeout(function(){
            			select2Vlaue.val(ival);
            			select2Vlaue.select2();
            		},200);
            	}else{
            		obj.find("[name="+name+"]").val(ival); 
            	}
             }
        }	
        });
    };
})(jQuery);
/**
 * POP框垂直居中
 */
function initModal(){
	var ModalMarginTop=-$(".modal").outerHeight()/2;
	var ModalMarginLeft=-$(".modal").outerWidth()/2;
	document.getElementById($(".modal").attr("id")).style.marginTop=ModalMarginTop+"px";
	document.getElementById($(".modal").attr("id")).style.marginLeft=ModalMarginLeft+"px";
}

//查询条件隐藏显示
/*$(document).on("click",".ecitic-more",function(){
	var EciticInquire=getCurrentPageObj().find("#ecitic-inquire");
	var EciticTable=getCurrentPageObj().find("#ecitic-table");
	if($(this).is(".open")){
		$(this).removeClass("open");
		EciticInquire.css({"height":"95px"});
		EciticTable.css({"height":"95px"});
	}else{
		$(this).addClass("open");
		EciticInquire.css({"height":"145px"});
		EciticTable.css({"height":"145px"});
	}
});*/

/**
 * 列表页面更多筛选条件，收起展开选择事件（通用事件）
 */
//function eciticMore(){
//	$(".ecitic-more").unbind("click").click(function(){
//		var $page = getCurrentPageObj();
//		var EciticInquire=$page.find("#ecitic-inquire");
//		var EciticTable=$page.find("#ecitic-table");
//		var count = $page.find(".table-bor-pad tr").length;
//		if($(this).is(".open")){
//			$(this).removeClass("open");
//			EciticInquire.style.height="95px";
//			EciticTable.style.height="95px";
//		}else{
//			$(this).addClass("open");
//			EciticInquire.style.height=count*48+"px";
//			EciticTable.style.height=count*48+"px";
//		}
//	});
//	eciticMore();
//}


function EciticMore(){
	var input=getCurrentPageObj().find(".ecitic-inquire").find("td");
	if(getCurrentPageObj().find(".ecitic-inquire").length>0){
		if(input.length<=4){
			getCurrentPageObj().find(".ecitic-inquire").css("height","46px");
		}else if(input.length<=12){
			getCurrentPageObj().find(".ecitic-inquire").css("height","auto");
		}else{
			getCurrentPageObj().find(".ecitic-inquire").css("height","auto");
		}
	}
	//列表页面更多筛选条件，收起展开选择事件（通用事件）
	getCurrentPageObj().find(".ecitic-more").unbind("click").click(function(){
		var $page = getCurrentPageObj();
		var EciticInquire=$page.find("#ecitic-inquire");
		var EciticTable=$page.find("#ecitic-table");
		var count = $page.find(".table-bor-pad tr").length;
		if($(this).is(".open")){
			$(this).removeClass("open");
			EciticInquire.css({height:"95px"});
			EciticTable.css({height:"95px"});
		}else{
			$(this).addClass("open");
			EciticInquire.css({height:count*48+"px"});
			EciticTable.css({height:count*48+"px"});
		}
	});
}
/**
 * 窗口 发生变动隐藏 div
 */
$(window).resize(function() {
	$(".org_select_tree:visible").hide();
	$(".moreFileInfo:visible").hide();
});

/**
 *点击 验证提示 自动删除提示，并设置光标 
 **/
$(document).on("click",".tag-content",function(){
	$(this).siblings("input:visible").click();
	$(this).siblings("input:visible").focus();
	$(this).remove();
});
/**
 *点击输入框 验证提示 自动删除
 **/
$(document).on("click","[validate]",function(){
	$(this).parent().find(".tag-content:eq(0)").remove();
});


/**
 * 校验两位小数的数字
 * @param obj
 * @returns {Boolean}
 */
function checkFloatNum(obj){
	var reg = new RegExp("^[0-9]+(.[0-9]{1,2})?$");
	if(!reg.test(obj.value)){
		var form=$(obj);
		var uuid=form.attr("validateId");
		if(uuid==undefined||uuid==""){
			uuid=Math.uuid();
		}
		form.attr("validateId",uuid);
		$(obj).parent().append('<div  id="'+uuid+'"  class="tag-content" >'+'请填写数字，保留两位小数'+'</div>');
        obj.value='';
    	return false;
    }
	return true;
}

//给金额添加千位分隔符
function formatNumber(num){
	if(!/^(\+|-)?(\d+)(\.\d+)?$/.test(num)){  
		return num;  
	}  
	var a = RegExp.$1,b = RegExp.$2,c = RegExp.$3;  
	//var re = new RegExp().compile("(\\d)(\\d{3})(,|$)")
	var re = new RegExp("(\\d)(\\d{3})(,|$)");  
	while(re.test(b)){  
		b = b.replace(re,"$1,$2$3");  
	}  
	return a +""+ b +""+ c;  
}
/**金额补全**/
function formatNumber2(num){
	var n=formatNumber(num)+"";
	if(n.indexOf(".")==-1){
		return n+".00";
	}
}

//获取当前毫秒值
function getMillisecond(){
	var myData = new Date(); 
	return "jq_"+myData.getTime();
}


function getPageParam(str){
	var inputs = getCurrentPageObj().find("input[name^='"+str+".']");
	var texts = getCurrentPageObj().find("textarea[name^='"+str+".']");
	var select = getCurrentPageObj().find("select[name^='"+str+".']");
	var params = {};
	var preLength = str.length + 1;//前缀长度(包含".")
	for (var i = 0; i < inputs.length; i++) {
		
		var obj = $(inputs[i]);
		var t = obj.attr("type");
		if(t=="radio"){
			params[obj.attr("name").substr(preLength)]=$("input[name='"+obj.attr("name")+"']:checked").val();
		}else{
			params[obj.attr("name").substr(preLength)] = obj.val();
		}
	}
	for (var i = 0; i < texts.length; i++) {
		var obj = $(texts[i]);
		params[obj.attr("name").substr(preLength)] = obj.val();
	}
	for(var i = 0; i < select.length; i++){
		var obj = $(select[i]);
		params[obj.attr("name").substr(preLength)] = obj.val();
	}
	return params;
}
//获取去空的页面值
function getPageParamRA(str){
	var inputs = getCurrentPageObj().find("input[name^='"+str+".']");
	var texts = getCurrentPageObj().find("textarea[name^='"+str+".']");
	var select = getCurrentPageObj().find("select[name^='"+str+".']");
	var params = {};
	var preLength = str.length + 1;//前缀长度(包含".")
	for (var i = 0; i < inputs.length; i++) {
		
		var obj = $(inputs[i]);
		var t = obj.attr("type");
		if(t=="radio"){
			params[obj.attr("name").substr(preLength)]=$("input[name='"+obj.attr("name")+"']:checked").val();
		}else{
			params[obj.attr("name").substr(preLength)] = obj.val().replace(/(^\s*)|(\s*$)/g,'');
		}
	}
	for (var i = 0; i < texts.length; i++) {
		var obj = $(texts[i]);
		params[obj.attr("name").substr(preLength)] = obj.val().replace(/(^\s*)|(\s*$)/g,'');
	}
	for(var i = 0; i < select.length; i++){
		var obj = $(select[i]);
		params[obj.attr("name").substr(preLength)] = obj.val();
	}
	return params;
}


//多选框
function initCheck(obj,param,checkName,method,default_v){
	baseAjax("SDic/findItemByDic.asp",param,function(data){
		if(obj!=undefined&&data!=undefined){
			obj.empty();
			var mycars = new Array(); 
			if(default_v!=undefined&&default_v!=""){
				mycars=default_v.split(",");
			}
			for(var i=0;i<data.length;i++){
				var flag = false;
				for(var j=0;j<mycars.length;j++){
					if(mycars[j] == data[i].ITEM_CODE){
						flag = true;
					}
				}
				if(flag){
					obj.append("<span class='check_dic'><input type='checkbox' checked='checked' name="+checkName+" onclick="+method+"(this) value="+data[i].ITEM_CODE+"><span>"+data[i].ITEM_NAME+"</span></span>");	
				}else{
					obj.append("<span class='check_dic'><input type='checkbox' name="+checkName+" onclick="+method+"(this) value="+data[i].ITEM_CODE+"><span>"+data[i].ITEM_NAME+"</span></span>");				
				}
			}
		}
	});				
}
//不可点击多选框
function initCheckVis(obj,param,checkName,method,default_v,visible){
	baseAjax("SDic/findItemByDic.asp",param,function(data){
		if(obj!=undefined&&data!=undefined){
			obj.empty();
			var mycars = new Array(); 
			if(default_v!=undefined&&default_v!=""){
				mycars=default_v.split(",");
			}
			for(var i=0;i<data.length;i++){
				var flag = false;
				for(var j=0;j<mycars.length;j++){
					if(mycars[j] == data[i].ITEM_CODE){
						flag = true;
					}
				}
				if(visible="N"){
					if(flag){
						obj.append("<span class='check_dic'><input type='checkbox' disabled checked='checked' name="+checkName+" onclick="+method+"(this) value="+data[i].ITEM_CODE+"><span>"+data[i].ITEM_NAME+"</span></span>");	
					}else{
						obj.append("<span class='check_dic'><input type='checkbox' disabled name="+checkName+" onclick="+method+"(this) value="+data[i].ITEM_CODE+"><span>"+data[i].ITEM_NAME+"</span></span>");				
					}
				}else{
					
					if(flag){
						obj.append("<span class='check_dic'><input type='checkbox' checked='checked' name="+checkName+" onclick="+method+"(this) value="+data[i].ITEM_CODE+"><span>"+data[i].ITEM_NAME+"</span></span>");	
					}else{
						obj.append("<span class='check_dic'><input type='checkbox' name="+checkName+" onclick="+method+"(this) value="+data[i].ITEM_CODE+"><span>"+data[i].ITEM_NAME+"</span></span>");				
					}
				}
			}
		}
	});				
}

/**
 * 重置方法
 * @param resetID
 * 注意:一定不要将重置按钮的id和name值设置为reset;
 */
function resetFrom(resetID){
	$('#'+resetID).form('reset');
	$('#'+resetID).find("select").each(function(){
		$(this).val("");
		$(this).select2();
	});
	//$(':input:radio')取到所有的radio，然后each遍历，通过$(this).is(':checked')判断是否选中。
	$('#'+resetID).find(':input:radio').each(function(){
		if($(this).is(':checked')){
			$(this).parent().addClass('checkd');
		}
		else{
			//默认不是被选中的，去掉checkd样式
			$(this).parent().removeClass('checkd');
		}
	});
};

/**
 * 提示信息框
 * */
function gaveInfo(){
    var x="";
    var y="";
    $('.table-text-show tr td').unbind("mouseover");
    $('.table-text-show td').mouseover(function(event){
        var event=event||wiondow.event;
        if($(this).text() == "" || $(this).text() == "-"){
            return;
        }
        var offset=$(this).offset();
        x=event.pageX+5;
        y=event.pageY+5;
        var htmll= '<div class="flag-v587">'+$(this).text()+'</div>';
        if($(".flag-v587")){
            $(".flag-v587").remove();
        }
        $("body").append(htmll);
        var ClientWidth=parseInt(document.documentElement.clientWidth);
        var ClientWidthX=ClientWidth-parseInt(event.clientX);
        var FlagPromptX= $(".flag-v587").outerWidth();

        var ClientHeight=parseInt(document.documentElement.clientHeight);
        var ClientHeightY=ClientHeight-parseInt(event.clientY);
        var FlagPromptY=$(".flag-v587").outerHeight();

        if(ClientHeightY<FlagPromptY){
            if(ClientWidthX<FlagPromptX){
                $(".flag-v587").css({'top':(y-FlagPromptY)+'px','right':0});
            }else {
                $(".flag-v587").css({'left':x+'px','top':(y-FlagPromptY)+'px'});
            }
        }else{
            if(ClientWidthX<FlagPromptX){
                $(".flag-v587").css({'right':0,'top':y+'px'});
            }else {
                $(".flag-v587").css({'top':y+'px','left':x+'px'});
            }
        }
    });
    $('.table-text-show tr td').mouseout(function(){
        $("div[class^='flag-v587']").remove();
    });
};


function initSelectMoreByData(obj,show,data,default_v){
	if(obj!=undefined&&show!=undefined&&data!=undefined){
		obj.empty();
		for(var i=0;i<data.length;i++){
			if(default_v==undefined||default_v==""){
				default_v=data[i]["IS_DEFAULT"]=="00"?data[i][show.value]:"";
			}
			obj.append('<option value="'+data[i][show.value]+'">'+data[i][show.text]+'</option>');	
		}
		if(default_v!=undefined&&default_v!=""){
			var mycars=default_v.split(",");
			obj.val(mycars).trigger('change');
		}else{
			obj.val(" ");
		}
		obj.select2();
		//$("#experts_type").val(['01','02']).trigger('change');
		//$("#removeOption").remove();//神奇的将select 设置为空
		//alert(obj.val());
	}
}


/**
 * 根据URl设置下拉框数据
 * @param obj $("#id")
 * @param show {"value":"enname","text":"cnname"}
 * @param url
 */
function initMoreSelect(obj,show,param,default_v,preStr){
	globalSelectCache["count"]=globalSelectCache["count"]+1;
	if(globalSelectCache[param.dic_code]!=undefined&&globalSelectCache[param.dic_code]["data"]!=undefined){
		initSelectMoreByData(obj,show,globalSelectCache[param.dic_code]["data"],default_v);
		if(new Date().getTime()-globalSelectCache[param.dic_code]["startDate"]>50000){
			globalSelectCache[param.dic_code]={};
		}
		return;
	}
	if(globalSelectCache["count"]>7){
		globalSelectCache={};
		globalSelectCache["count"]=1;
	}
	if(!preStr){
		preStr="";
	}
	baseAjax(preStr+"SDic/findItemByDic.asp",param,function(data){
		if(data!=undefined){
			globalSelectCache[param.dic_code]={};
			globalSelectCache[param.dic_code]["data"]=data;
			globalSelectCache[param.dic_code]["startDate"]=new Date().getTime();
			initSelectMoreByData(obj,show,data,default_v);
		}
	});
}
//时间比较
function checkTimeSupCompare_common(startTimeId,endTimeId){
	WdatePicker({onpicked:function(){
		var check_starttime = getCurrentPageObj().find("#"+startTimeId).val();
		var check_endtime = getCurrentPageObj().find("#"+endTimeId).val();
		if(check_starttime!=""&&check_endtime!=""){
			if(check_starttime>check_endtime){
				alert('开始时间不能大于结束时间!',function(){
					getCurrentPageObj().find("#"+startTimeId).val("");
					getCurrentPageObj().find("#"+endTimeId).val("");
				});
			}
		}
	}});
}

/**
 * 定义树的常用回调事件
 * @param $ztreeObj
 * @param data
 * @param beforeClickFun
 * @param onClickFun
 * @param beforeCheckFun
 * @param onCheckFun
 * @param beforeDbClickFun
 * @param onDbClickFu
 * @returns treeObj
 */
function iniZtreeByDataAndClickFun($treeObj, data, beforeClickFun, onClickFun, beforeCheckFun, onCheckFun, beforeDbClickFun, onDbClickFu){
	var callFun = {
		beforeClick : beforeClickFun,
		onClick : onClickFun,
		beforeCheck : beforeCheckFun,
		onCheck : onCheckFun,
		beforeDbClick : beforeDbClickFun,
		onDbClick : onDbClickFu
	};
	return initZtreeByDataWithCall($treeObj, data, callFun);
}

/**
 * z-tree数据初始化(无配置)
 * @param $treeObj
 * @param data
 * @param callFun
 */
function initZtreeByDataWithCall($treeObj, data, callFun){
	var setting = {
		view : {
			showIcon : true
		},
		check : {
			enable : false,
			chkStyle : "checkbox",
			radioType : "level"
		},
		data : {
			simpleData : {
				enable : true,
				idKey : "id",
				pIdKey : "pid",
				rootPId : ""
			}
		},
		callback : callFun
	};
	return doInitZtreeByData($treeObj, data, setting);
}

/**
 * z-tree跨域数据ztree加载
 * @param $treeObj
 * @param data
 * @param setting
 */
function doInitZtreeByData($treeObj, data, setting){
	return $.fn.zTree.init($treeObj, setting, data);
}

/**
 * z-tree下拉菜单跨域数据加载
 */
function openSelectTreeDivByDataToBody(clickObj, treeId, data, topY, onClickFun){
	var offset=clickObj.offset();
	var left=offset.left;
	var top=offset.top+topY;
	if($("#"+treeId).length<=0){
		$("body:eq(0)").append('<div id="'+treeId+'" style="top:'+top+'px;left:'+left+'px;z-index:10;" class="org_select_tree ztree"></div>');
	}else{
		$("#"+treeId).css({top:top,left:left});
	}
	$("#"+treeId).css({"width":clickObj.width()});
	
	var isvisable=true;
	$("#"+treeId).unbind("click").click(function(){
		isvisable=false;
	});
	
	$("body:eq(0)").unbind("click").click(function(e){
		if(isvisable){
			$("#"+treeId).hide();
			$("#"+treeId).remove();
		}
		isvisable=true;
		/*if($(e.target)[0]===clickObj[0]){
			$("#"+treeId).show();
		}*/
	});
	
	onClickFunB = function(event, treeId, treeNode){
		if(onClickFun!=null){
			onClickFun(treeNode);
			$("#"+treeId).hide();
		}
	};
	return iniZtreeByDataAndClickFun($("#"+treeId), data, null, onClickFunB);
}

//处理键盘事件 禁止后退键（Backspace）密码或单行、多行文本框除外
function banBackSpace(e){ 
	 var ev = e || window.event;//获取event对象 
	 var obj = ev.target || ev.srcElement;//获取事件源 
	 var t = obj.type || obj.getAttribute('type');//获取事件源类型 
	 //获取作为判断条件的事件类型
	 var vReadOnly = obj.getAttribute('readonly');
	 //处理null值情况
	 vReadOnly = (vReadOnly == "") ? false : vReadOnly;
	 //当敲Backspace键时，事件源类型为密码或单行、多行文本的，
	 //并且readonly属性为true或enabled属性为false的，则退格键失效
	 var flag1=(ev.keyCode == 8 && (t=="password" || t=="text" || t=="textarea") 
	    && vReadOnly=="readonly")?true:false;
	 //当敲Backspace键时，事件源类型非密码或单行、多行文本的，则退格键失效
	 var flag2=(ev.keyCode == 8 && t != "password" && t != "text" && t != "textarea")
	    ?true:false;  
	 //判断
	 if(flag2){
	  return false;
	 }
	 if(flag1){ 
	  return false; 
	 } 
}
window.onload=function(){
	//禁止后退键 作用于Firefox、Opera
	document.onkeypress=banBackSpace;
	//禁止后退键 作用于IE、Chrome
	document.onkeydown=banBackSpace;
};
/**
 * 需求名称自动换行
 */
function req_namformatter(size,value,css_str,event_func){
	var height="auto";//(value.length/size)*25+6;
	if(height<20&&value.length<size){
		height="20px";
	}
	return '<div '+(event_func||"")+' style="height:'
		+height+';line-height:20px;word-wrap: break-word;text-align: center;margin-left: -5px;width:100%;word-break: break-all;white-space: pre-wrap;'
		+(css_str||"")+'">'+value+'</div>';
}
///////////////////////////////
//跨域请求url配置说明
///////////////////////////////192.168.1.109
var dev_application="/dev_application/";//应用及工单管理
var dev_background="";//后台管理
var dev_construction="http://"+location.hostname+":8081/dev_construction/";//工程管理
var dev_planwork="http://"+location.hostname+":8082/dev_planwork/";//计划及报工管理
var dev_project="http://"+location.hostname+":8083/dev_project/";//项目管理
var dev_report ="http://"+location.hostname+":8084/dev_report/";//报表及监控管理
//var dev_resource="http://"+location.hostname+":8085/dev_resource/";//资源管理
var dev_test="http://"+location.hostname+":8087/dev_test/";//测试管理
var dev_workbench="http://"+location.hostname+":8086/dev_workbench/";//督办及工作台管理
var dev_outsource="http://"+location.hostname+":8085/dev_outsource/";//外包管理
var dev_cis="http://"+location.hostname+":8089/dev_cis/";//持续集成
