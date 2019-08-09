$(function(){
	$("#application_purpose").css("height","200px");
	
});

//按钮方法
function initAddExpertButtonEvent(){	
	getCurrentPageObj().find("#reviewer_user_name").click(function(){ 
		openUserPop("addDivExpert",{name:$("#reviewer_user_name"),no:$("#reviewer_user_id")});
	});
	getCurrentPageObj().find("#addExperts").click(function(){
		if(!vlidate(getCurrentPageObj().find("#addExpert_from"))){
			alert("请填写相关必填项");
			return ;
		}
		
		var aaa=getCurrentPageObj().find("#major_desc").val();
	    if(aaa.length>240){
	    	alert("擅长专业方向至多可输入240汉字！");
	    	return;
	    }
		
		var all = "";
		getCurrentPageObj().find("#experts_type option:selected").each(function() {
        	var text= $(this).attr("value");
        	text = text.replace(/(^\s*)|(\s*$)/g, "");
        	if(text !== '' && typeof(text) !== undefined && text !== null){
        		if(all == ""){
        			all = text;
        		}else{
        			all += ","+text;
        		}
        	}
        });
        
		var expertsCall = getMillisecond();
        var params = getPageParam("G");		//遍历当前页面的input,text,select
        params['experts_type'] = all;
		baseAjaxJsonp(dev_construction+'GExperts/insertExperts.asp?call='+expertsCall+'&SID='+SID,params, function(data) {
			if (data != undefined&&data!=null&&data.result=="true") {
				if(data.msg == "01"){
					alert("此评委已存在");
				}else{
					closePageTab("add_experts");
					alert("添加成功");
				}
			}else{
				alert("添加失败");
			}
		},expertsCall);
	});
	
	//加载应用pop
	getCurrentPageObj().find('#system_name').click(function(){
		openTaskSystemPop("addDivExpert",{sysno:getCurrentPageObj().find("#system_id"),sysname:getCurrentPageObj().find("#system_name")});
	});
	
}




//下拉框方法
function initSUserType(){
	//初始化数据,评委类型
	initSelect2($("#experts_type"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_EXPERT_TYPE"});
	//初始化数据,评委级别
	initSelect(getCurrentPageObj().find("#reviewer_grade"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_REVIEWER_GRADE"});

}

//$("#orgDivPop").load("pages/sorg/sorgPop.html");
initAddExpertButtonEvent();
initSUserType();


function initSelectByData2(obj,show,data,default_v){
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
function initSelect2(obj,show,param,default_v,preStr){
		globalSelectCache["count"]=globalSelectCache["count"]+1;
		if(globalSelectCache[param.dic_code]!=undefined&&globalSelectCache[param.dic_code]["data"]!=undefined){
			initSelectByData2(obj,show,globalSelectCache[param.dic_code]["data"],default_v);
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
				initSelectByData2(obj,show,data,default_v);
			}
		});
}
