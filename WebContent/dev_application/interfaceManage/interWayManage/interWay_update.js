
//按钮方法
function initupdateEsbButton(){
	var $page = getCurrentPageObj();//当前页
	initVlidate($page);//渲染必填项
	//增加链接调用方式
	getCurrentPageObj().find("#updateEsb").click(function(){
		if(!vlidate($page,"",true)){
			return ;
		}
		var communication = "";
		getCurrentPageObj().find("#communication option:selected").each(function() {
        	var text= $(this).attr("value");
        	//需要将字典号转为字典项
        	text = text.replace(/(^\s*)|(\s*$)/g, "");
        	if(text !== '' && typeof(text) !== undefined && text !== null){
        		if(communication == ""){
        			communication = text;
        		}else{
        			communication += ","+text;
        		}
        	}
        });
		
		var msg_type = "";
		getCurrentPageObj().find("#msg_type option:selected").each(function() {
        	var text= $(this).attr("value");
        	//需要将字典号转为字典项
        	text = text.replace(/(^\s*)|(\s*$)/g, "");
        	if(text !== '' && typeof(text) !== undefined && text !== null){
        		if(msg_type == ""){
        			msg_type = text;
        		}else{
        			msg_type += ","+text;
        		}
        	}
        });
		
		var interWayupdateCall = getMillisecond();

        var params = getPageParam("G");		//遍历当前页面的input,text,select

        params['COMMUNICATION'] = communication;
        params['MSG_TYPE'] = msg_type;
		baseAjaxJsonp(dev_application+'interWay/updateEsbList.asp?call='+interWayupdateCall+'&SID='+SID,params, function(data) {
			if (data != undefined&&data!=null&&data.result=="true") {
				if(data.msg == "01"){
					alert("此方式已存在");
				}else{
					closePageTab("updateinterWay");
					if(data.msg == "02"){
						alert("修改成功");
					}else{
						alert("修改失败"+data.msg);
					}
				}
			}else{
				if(data.msg == "00"){
					alert("必填项不能为空");
				}else{
					alert("修改失败");
				}
			}
		},interWayupdateCall);
	});
}

//授权机构模态框
function opeanAppIDPop(){
//	openAppPop("updateIDpop",getCurrentPageObj().find("#system_name"),getCurrentPageObj().find("#system_id"));	
	openTaskSystemPop("updateIDpop",{sysno:getCurrentPageObj().find("#system_id"),sysname:getCurrentPageObj().find("#system_name")});

}
//输入框初始化
function initPageway_id(way_id){
	getCurrentPageObj().find("#way_id").val(way_id);
}
function initPagesystem_id(system_id){
	getCurrentPageObj().find("#system_id").val(system_id);
}
function initPagesystem_name(system_name){

	getCurrentPageObj().find("#system_name").val(system_name);
}
//类别下拉初始化
function initPagecommunication(communication){
	initSelect($("#communication"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_INTER_COMM"},communication,null,"");
	 $("#communication").select2().val(communication.split(",")).trigger("change");
}
function initPagemsg_type(msg_type){
	initSelect($("#msg_type"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_INTER_MSG"},msg_type,null,"");	
	 $("#msg_type").select2().val(msg_type.split(",")).trigger("change");
}
function initPageway_type(way_type){
	initSelect($("#way_type"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_WAY_TYPE"},way_type);
}

initupdateEsbButton();
//引入验证
initVlidate($("#esbupdateortransform"));