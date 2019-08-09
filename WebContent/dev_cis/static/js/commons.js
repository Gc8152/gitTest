var contextpath = parent.dev_cis;

$(function(){
	//点击标题隐藏内容
	$(".ecitic-title i").click(function(){
		if($(this).is(".open")){
			$(this).removeClass("open");
		}else{
			$(this).addClass("open");
		}
		$(this).parent().next().slideToggle();
	});
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
	//多选按钮
	var SinCS_C=$(".ecitic-checkbox span");
	SinCS_C.bind("click",function(){
		if($(this).is(".checkd")){
			$(this).removeClass("checkd");
		}else{
			$(this).addClass("checkd");
		}
	});
	//单选按钮
	var SinCS_R=$(".ecitic-radio span");
	SinCS_R.bind("click",function(){
		var $this = $(this);
		var $t = $this.index();
		SinCS_R.removeClass('checkd');
		$this.addClass('checkd');
	});
	
	//查询条件隐藏显示
	$(".ecitic-more").click(function(){
		var EciticInquire=document.getElementById("ecitic-inquire");
		var EciticTable=document.getElementById("ecitic-table");
		if($(this).is(".open")){
			$(this).removeClass("open");
			EciticInquire.style.height="134px";
			EciticTable.style.height="96px";
		}else{
			$(this).addClass("open");
			EciticInquire.style.height="auto";
			EciticTable.style.height="auto";
		}
	});
})

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
		var validItem=$(this);
		var tipCSS="";
	/*	var absoluteClass="";
		if(!isAbsolute){
			tipCSS=getTipCSS(validItem.siblings(".high"))+zzindex;
		}else{
			tipCSS=getTipCSSAbsolute(validItem.siblings(".high"))+zzindex;
			absoluteClass="-absolute";
		}*/
		
		var uuid=validItem.attr("validateId");
		if(uuid==undefined||uuid==""){
			uuid=Math.uuid();
		}
		validItem.attr("validateId",uuid);
		//$("#"+uuid).remove();
		var validItemVal=$.trim(validItem.val());
		if(validItem.attr("validate")=="v.required"&&(validItemVal==""||validItemVal==validItem.attr("placeholder"))){
			$(this).parent().append('<div  id="'+uuid+'"  class="tag-content" >'+($(this).attr("valititle")||"该项必填")+'</div>'); //然后将它追加到文档中
			result=false;
		}//验证密码
		else if(validItem.attr("validate")=="v.password"&&(validItemVal==""||(validItemVal!=""&&!/^[a-zA-Z]\w{5,30}$/.test(validItemVal)))){
			$(this).parent().append('<div  id="'+uuid+'"  class="tag-content" >'+'密码以字母开头,只能有数字、英文、下划线且长度不得小于6位'+'</div>');
			result=false;
		}//验证邮箱
		else if(validItem.attr("validate")=="v.email"&&(validItemVal==""||(validItemVal!=""&&!/.+@.+\.[a-zA-Z]{2,4}$/.test(validItemVal)))){
			$(this).parent().append('<div  id="'+uuid+'"  class="tag-content" >'+'无效的的邮箱'+'</div>');
				result=false;
		}//验证手机号码
		else if(validItem.attr("validate")=="v.mobile"&&(validItemVal==""||(validItemVal!=""&&!/^1[34578]\d{9}$/.test(validItemVal)))){
			$(this).parent().append('<div  id="'+uuid+'"  class="tag-content" >'+'无效的手机号码'+'</span>');
			result=false;
		}//验证客服电话
		else if(validItem.attr("validate")=="v.tel"&&(validItemVal==""||(validItemVal!=""&&!/^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/.test(validItemVal)))){
			$(this).parent().append('<div  id="'+uuid+'"  class="tag-content" >'+'无效的电话号码'+'</span>');
			result=false;
		}//验证数字--整数
		else if(validItem.attr("validate")=="v.isint"&&(validItemVal==""||(validItemVal!=""&&!/^\d+$/.test(validItemVal)))){
			$(this).parent().append('<div  id="'+uuid+'"  class="tag-content" >'+'无效的数字'+'</span>');
			result=false;
		}//验证数字--浮点
		else if(validItem.attr("validate")=="v.isfloat"&&(validItemVal==""||(validItemVal!=""&&!/^\d+(\.\d+)?$/.test(validItemVal)))){
			$(this).parent().append('<div  id="'+uuid+'"  class="tag-content" >'+'无效的数字'+'</span>');
			result=false;
		}//验证身份证
		else if(validItem.attr("validate")=="v.idcard"&&(validItemVal==""||(validItemVal!=""&&!/^(\d{15}$|^\d{18}$|^\d{17}(\d|X|x))$/.test(validItemVal)))){
			$(this).parent().append('<div  id="'+uuid+'"  class="tag-content" >'+'无效的身份证号码'+'</div>');
			result=false;
		}//验证货币
		else if(validItem.attr("validate")=="v.currency"&&(validItemVal!=""&&!/^d{0,}(\.\d+)?$/.test(validItemVal))){
			$(this).parent().append('<div  id="'+uuid+'"  class="tag-content" >'+'货币格式不正确'+'</div>');
			result=false;
		}//验证qq
		else if(validItem.attr("validate")=="v.qq"&&(validItemVal!=""&&!/^[1-9]\d{4,9}$/.test(validItemVal))){
			$(this).parent().append('<div  id="'+uuid+'"  class="tag-content" >'+'QQ号码格式不正确(正确如：453384319)'+'</div>');
			result=false;
		}//验证中文
		else if(validItem.attr("validate")=="v.chinese"&&(validItemVal==""||(validItemVal!=""&&!/^[\u0391-\uFFE5]+$/.test(validItemVal)))){
			$(this).parent().append('<div  id="'+uuid+'"  class="tag-content" >'+'请输入中文'+'</div>');
			result=false;
		}//验证英文
		else if(validItem.attr("validate")=="v.english"&&(validItemVal==""||(validItemVal!=""&&!/^[A-Za-z]+$/.test(validItemVal)))){
			$(this).parent().append('<div  id="'+uuid+'"  class="tag-content" >'+'请输入英文'+'</div>');
			result=false;
		}//验证用户名
		else if(validItem.attr("validate")=="v.username"&&(validItemVal!=""&&!/^[a-zA-Z][a-zA-Z0-9_]{5,15}$/.test(validItemVal))){
			$(this).parent().append('<div  id="'+uuid+'"  class="tag-content" >'+'用户名不合法（字母开头，允许6-16字节，允许字母数字下划线）'+'</div>');
			result=false;
		}//验证传真
		else if(validItem.attr("validate")=="v.faxno"&&(validItemVal!=""&&!/^((\(\d{2,3}\))|(\d{3}\-))?(\(0\d{2,3}\)|0\d{2,3}-)?[1-9]\d{6,7}(\-\d{1,4})?$/.test(validItemVal))){
			$(this).parent().append('<div  id="'+uuid+'"  class="tag-content" >'+'传真号码不正确'+'</div>');
			result=false;
		}//验证邮政编码
		else if(validItem.attr("validate")=="v.zip"&&(validItemVal!=""&&!/^[0-9]\d{5}$/.test(validItemVal))){
			$(this).parent().append('<div  id="'+uuid+'"  class="tag-content" >'+'邮政编码格式不正确'+'</div>');
			result=false;
		}//验证验证IP地址
		else if(validItem.attr("validate")=="v.ip"&&(validItemVal!=""&&!/((?:(?:25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(?:25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d))))/.test(validItemVal))){
			$(this).parent().append('<div  id="'+uuid+'"  class="tag-content" >'+'IP地址格式不正确'+'</div>');
			result=false;
		}//验证姓名,可以是中文或英文
		else if(validItem.attr("validate")=="v.name"&&(validItemVal!=""&&!/d+.d+.d+.d+/.test(validItemVal))){
			$(this).parent().append('<div  id="'+uuid+'"  class="tag-content" >'+'请输入姓名'+'</div>');
			result=false;
		}//验证车牌号码
		else if(validItem.attr("validate")=="v.carNo"&&(validItemVal!=""&&!/^[\u4e00-\u9fa5]{1}[A-Z]{1}[A-Z_0-9]{5}$/.test(validItemVal))){
			$(this).parent().append('<div  id="'+uuid+'"  class="tag-content" >'+'车牌号码无效（例：粤J12350）'+'</div>');
			result=false;
		}//验证发动机型号
		else if(validItem.attr("validate")=="v.carenergin"&&(validItemVal!=""&&!/d+.d+.d+.d+/.test(validItemVal))){
			$(this).parent().append('<div  id="'+uuid+'"  class="tag-content" >'+'发动机型号无效(例：FG6H012345654584)'+'</div>');
			result=false;
		}//验证msn
		else if(validItem.attr("validate")=="v.msn"&&(validItemVal!=""&&!/d+.d+.d+.d+/.test(validItemVal))){
			$(this).parent().append('<div  id="'+uuid+'"  class="tag-content" >'+'请输入有效的msn账号(例：abc@hotnail(msn/live).com)'+'</div>');
			result=false;
		}
		//50字以内
		else if(validItem.attr("validate")=="v.50_zhi"&&(validItemVal!=""&&!/^(.|\n){0,50}$/.test(validItemVal))){
			validItem.parent().append('<div class="tag-position"><span class="tag-icon"></span><div class="tag-content" style="color:red;">'+'请输入50字以内任意字符'+'</span>');
			result=false;
			return result;
		}
		//50字以内（必填）
		else if(validItem.attr("validate")=="v.50_mzhi"&&(validItemVal==""||(validItemVal!=""&&!/^(.|\n){0,50}$/.test(validItemVal)))){
			validItem.parent().append('<div class="tag-position"><span class="tag-icon"></span><div class="tag-content" style="color:red;">'+'请输入50字以内任意字符'+'</span>');
			result=false;
			return result;
		}
		//100字以内
		else if(validItem.attr("validate")=="v.100_zhi"&&(validItemVal!=""&&!/^(.|\n){0,100}$/.test(validItemVal))){
			validItem.parent().append('<div class="tag-position"><span class="tag-icon"></span><div class="tag-content" style="color:red;">'+'请输入100字以内任意字符'+'</span>');
			result=false;
			return result;
		}
		//100字以内（必填）
		else if(validItem.attr("validate")=="v.100_mzhi"&&(validItemVal==""||(validItemVal!=""&&!/^(.|\n){0,100}$/.test(validItemVal)))){
			validItem.parent().append('<div class="tag-position"><span class="tag-icon"></span><div class="tag-content" style="color:red;">'+'请输入100字以内任意字符'+'</span>');
			result=false;
			return result;
		}
		//150字以内
		else if(validItem.attr("validate")=="v.150_zhi"&&(validItemVal!=""&&!/^(.|\n){0,150}$/.test(validItemVal))){
			validItem.parent().append('<div class="tag-position"><span class="tag-icon"></span><div class="tag-content" style="color:red;">'+'请输入150字以内任意字符'+'</span>');
			result=false;
			return result;
		}
		//150字以内（必填）
		else if(validItem.attr("validate")=="v.150_mzhi"&&(validItemVal==""||(validItemVal!=""&&!/^(.|\n){0,150}$/.test(validItemVal)))){
			validItem.parent().append('<div class="tag-position"><span class="tag-icon"></span><div class="tag-content" style="color:red;">'+'请输入150字以内任意字符'+'</span>');
			result=false;
			return result;
		}
		//200字以内
		else if(validItem.attr("validate")=="v.200_zhi"&&(validItemVal!=""&&!/^(.|\n){0,200}$/.test(validItemVal))){
			validItem.parent().append('<div class="tag-position"><span class="tag-icon"></span><div class="tag-content" style="color:red;">'+'请输入200字以内任意字符'+'</span>');
			result=false;
			return result;
		}
		//200字以内（必填）
		else if(validItem.attr("validate")=="v.200_mzhi"&&(validItemVal==""||(validItemVal!=""&&!/^(.|\n){0,200}$/.test(validItemVal)))){
			validItem.parent().append('<div class="tag-position"><span class="tag-icon"></span><div class="tag-content" style="color:red;">'+'请输入200字以内任意字符'+'</span>');
			result=false;
			return result;
		}
		//1000字以内
		else if(validItem.attr("validate")=="v.1000_zhi"&&(validItemVal!=""&&!/^(.|\n){0,1000}$/.test(validItemVal))){
			validItem.parent().append('<div class="tag-position"><span class="tag-icon"></span><div class="tag-content" style="color:red;">'+'请输入1000字以内任意字符'+'</span>');
			result=false;
			return result;
		}
		//1000字以内（必填）
		else if(validItem.attr("validate")=="v.1000_mzhi"&&(validItemVal==""||(validItemVal!=""&&!/^(.|\n){0,1000}$/.test(validItemVal)))){
			validItem.parent().append('<div class="tag-position"><span class="tag-icon"></span><div class="tag-content" style="color:red;">'+'请输入1000字以内任意字符'+'</span>');
			result=false;
			return result;
		}
		//验证1~100的数字
		else if(validItem.attr("validate")=="v.number"&&(validItemVal==""||(validItemVal!=""&&!/^([1-9]\d?|100)$/.test(validItemVal)))){
			$(this).parent().append('<div  id="'+uuid+'"  class="tag-content" >'+'请填写1~100的数字'+'</div>');
			result=false;
		}else if(validItem.attr("validate")=="v.number50"&&(validItemVal==""||validItemVal!="")){
			var v=parseInt(validItemVal);
			if(isNaN(v)||v>50||v<=0||validItemVal.indexOf(".")!=-1){
				$(this).parent().append('<div  id="'+uuid+'"  class="tag-content" >'+'请填写1~50的数字'+'</div>');
				result=false;
			}
		}
		//两位小数
		else if(validItem.attr("validate")=="v.float2"&&(validItemVal==""||(validItemVal!=""&&!/^[0-9]+(.[0-9]{1,2})?$/.test(validItemVal)))){
			$(this).parent().append('<div  id="'+uuid+'"  class="tag-content" >'+'请填写数字，保留两位小数'+'</div>');
			result=false;
		}//验证为必填项且字符数小于500;
		else if(validItem.attr("validate")=="v.charCountLimit"&&(validItemVal==""||(validItem.val().length>1200))){
			$(this).parent().append('<div  id="'+uuid+'"  class="tag-content" >'+'描述信息为必填项且字数不可大于500! 当前字数：'+validItem.val().length+'</div>'); //然后将它追加到文档中
			result=false;
		}//验证为必填项且字符数;
		if(validItem.attr("validate")=="v.length"){
			var length=$.trim(validItem.val().length);
			if(length==0){
				$(this).parent().append('<div  id="'+uuid+'" class="tag-content" >该项必填</div>'); 
				result=false;
			}
			var maxLength=parseInt(validItem.attr("length"));
			if(length>maxLength){
				$(this).parent().append('<div  id="'+uuid+'" class="tag-content" >'+'最大字符数'+maxLength+'当前字数'+length+'</div>');
				result=false;
			}
		}
	});	
	return result;
}

/**
 * 清空验证 提示信息
 */
function clearVlidateTag(){
	$(".tag-content[id]").remove();
	//$(".tag-position-absolute[id]").remove();
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

function baseAjax(url, param, callback, async) {
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
(function($) {
    $.getUrlParam = function(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null)
            return unescape(r[2]);
        return null;
    };

    $.fn.setform = function (jsonValue,type) {
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
                                if($(this).val()==ival[i]){

                                    $(this).prop("checked", true);
                                }
                            }
                        }
                        else{
                            if($(this).val()==ival){
                                $(this).prop("checked", true);
                            }else{
                                $(this).prop("checked", false);
                            }
                        }
                    });
                }
                else
                {
                    if(type=="1"){
                        var select2Vlaue=obj.find("select[name="+name+"]");
                        if(select2Vlaue.attr("name")=="checkOrg"){
                        }else{
                            if(select2Vlaue.attr("name") == name){
                                setTimeout(function(){obj.find("[name="+name+"]").select2().val(ival).trigger("change");},200);
                            }else{
                                obj.find("[name="+name+"]").val(ival);
                            }
                        }
                    }else{
                        var select2Vlaue=obj.find("select[name="+name+"]");
                        if(select2Vlaue.attr("name") == name){
                            setTimeout(function(){obj.find("[name="+name+"]").select2().val(ival).trigger("change");},200);
                        }else{
                            obj.find("[name="+name+"]").val(ival);
                        }
                    }
                }
            }
        });
    };
})(jQuery);


function reset(){
    $("input[type='text']").val("");
    $("input[type='hidden']").val("");
    $("input[type='date']").val("");
    $("select").val("");
    $("select").select2();
    $("textarea").val("");
    $("input[type='checkbox']").removeAttr("checked");
    $("input[type='radio']").removeAttr("checked");
}

/**
 * jsonp请求
 * @param url
 * @param param
 * @param callback
 * @returns
 */
function baseAjaxJsonp(url,param,callback){
	$.ajax({
		type : "get",
		url : url,
		data : param,
		dataType : "jsonp",
		jsonp: "callback",//服务端用于接收callback调用的function名的参数  
		success : function(msg) {
			callback(msg);
		},
		error : function(msg) { 
			callback();
		}
	});
}