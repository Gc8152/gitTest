//初始化数据
function initConfigSystemAddrInfo(item){
	for(var k in item){
		var kl = k.toLowerCase();
		if(kl == 'addr_type'){
			initCheck(getCurrentPageObj().find("#addrType"),{dic_code:"G_DIC_SYSTEM_CONFIG_TYPE"},"addrTypeName","addrType",item[k]);
		}else if(kl == 'system_id'){
			getCurrentPageObj().find("input[name='"+ kl +"']").val(item[k]);
			getCheckedAddr(item[k]);
		}else{
			getCurrentPageObj().find("span[name='"+ kl +"']").text(item[k]);
		}
	}
}
//加载地址信息
function getCheckedAddr(systemId){
	var sysCall = getMillisecond();
	var url = dev_application+'applicationManager/querySystemAddrList.asp?call='+sysCall+'&SID='+SID+'&system_id='+systemId;
	baseAjaxJsonp(url, null, function(data){
		if (data != undefined&&data!=null&&data.result=="true") {
			for(var n = 0; n < data.rows.length; n++){
				var dataMap = data.rows[n];
				for(var m in dataMap){
					var str = dataMap[m];
					m = m.toLowerCase();
					if(m == 'attr_type'){
						var tname = str;
					}else if(m == 'config_dic_code'){
						var tvalue = str;
					}else if(m == 'config_address'){
						var taddr = str;
					}
				}
				if(!(tname=='SIT环境' || tname=='UAT环境' || tname=='1618_SIT环境')){
					appendAddrHtml(tname,tvalue,taddr);
				}
			}
		} else {
			alert("无数据！");
		}
	},sysCall);
	
	
}

//增加地址信息
function appendAddrHtml(tname,tvalue,taddr){
	var tbObj = getCurrentPageObj().find("#testAddrConfigTable");
	var tr = "<tr name='dataInfoList' id='t"+tvalue+"'>" 
				+"<td class='table-text'>"+tname+"：</td>"
				+"<td colspan = '3'><input type='hidden' name='addr_type' value='"+tvalue+"'/>" 
				+"<textarea name='addr' placeHolder='请填写与该应用所选择环境对应的地址'  validate='v.required' >"+taddr+"</textarea></td>"
			+"</tr>";
	tbObj.append(tr);
	initVlidate(getCurrentPageObj());
}
//checkbox click事件 
function addrType(obj){
	var check_status = obj.checked;
		if(check_status){
			var tvalue = obj.value;
			var tname = obj.parentNode.innerText;
				appendAddrHtml(tname,tvalue,"");
		}else{
			var tvalue = obj.value;
			getCurrentPageObj().find("#t"+tvalue).remove();
		};
}

//保存按钮
function saveTestAddr(){
	if(!vlidate(getCurrentPageObj(),"",true)){
		alert("你还有必填项未填");
		return ;
	}
	var params = {};
	var test_addr = new Array();
	params["system_id"] = getCurrentPageObj().find("#system_id").val();
	getCurrentPageObj().find("[name='dataInfoList']").each(//获取每条数据的所有值
			function() {
				var obj = new Object();
				var addrtype = $(this).find("input[name='addr_type']");
				var addrtext = $(this).find("textarea[name='addr']");
				obj.addr_type = addrtype.val();
				obj.addr = addrtext.val();
				test_addr.push(obj);
			}
	);
	params["test_addr"] = JSON.stringify(test_addr);
	var spCall = getMillisecond();
	var url = dev_application+'applicationManager/saveSystemAddrConfig.asp?call='+spCall+'&SID='+SID;
	baseAjaxJsonp(url,params, function(data){
		if (data != undefined&&data!=null&&data.result=="true") {
			alert("保存成功！",function(){
				closeCurrPageTab();
			});
		} else {
			alert("保存失败！");
		}
	},spCall);
}

initPlaceholder();