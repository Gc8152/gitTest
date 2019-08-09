//按钮方法
function initaddEsbButton(){
	var $page = getCurrentPageObj();//当前页
	initVlidate($page);//渲染必填项
	//增加链接调用方式
	getCurrentPageObj().find("#saveEsb").click(function(){	
		if(!vlidate($page,"",true)){
			return ;
		}
		var appcomm = "";
		getCurrentPageObj().find("#appcomm option:selected").each(function() {
        	var text= $(this).attr("value");
        	//需要将字典号转为字典项
        	text = text.replace(/(^\s*)|(\s*$)/g, "");
        	if(text !== '' && typeof(text) !== undefined && text !== null){
        		if(appcomm == ""){
        			appcomm = text;
        		}else{
        			appcomm += ","+text;
        		}
        	}
        });
		
		var appmsg = "";
		getCurrentPageObj().find("#appmsg option:selected").each(function() {
        	var text= $(this).attr("value");
        	//需要将字典号转为字典项
        	text = text.replace(/(^\s*)|(\s*$)/g, "");
        	if(text !== '' && typeof(text) !== undefined && text !== null){
        		if(appmsg == ""){
        			appmsg = text;
        		}else{
        			appmsg += ","+text;
        		}
        	}
        });
		
		var interWayAddCall = getMillisecond();
        var params = getPageParam("G");		//遍历当前页面的input,text,select
        params['COMMUNICATION'] = appcomm;
        params['MSG_TYPE'] = appmsg;
		baseAjaxJsonp(dev_application+'interWay/addEsbList.asp?call='+interWayAddCall+'&SID='+SID,params, function(data) {
			if (data != undefined&&data!=null&&data.result=="true") {
				if(data.msg == "01"){
					alert("此方式已存在");
				}else{
					closePageTab("addinterWay");
					alert("添加成功");
				}
			}else{
				if(data.msg == "000"){
					alert("必填项不能为空");
				}else{
					alert("添加失败");
				}
			}
		},interWayAddCall);
	});
}
//授权机构模态框
function opeanAppIDPop(){

//	openAppPop("appIDpop",getCurrentPageObj().find("#appname"),getCurrentPageObj().find("#appid"));	
	openTaskSystemPop("appIDpop",{sysno:getCurrentPageObj().find("#appid"),sysname:getCurrentPageObj().find("#appname")});
}

function initPageSelect(){
	//类别下拉初始化

	initSelect($("#appcomm"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_INTER_COMM"},"",""," ");
	initSelect($("#appmsg"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_INTER_MSG"},"",""," ");
	initSelect($("#apptype"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_WAY_TYPE"});
}

initPageSelect();
initaddEsbButton();
//引入验证
initVlidate($("#esbaddortransform"));