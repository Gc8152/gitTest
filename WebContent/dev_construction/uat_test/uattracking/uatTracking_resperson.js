//初始化子需求信息
function initSubReqInfo_person(param) {
	var p = param;
	var call = getMillisecond()+'1';
	var url = dev_construction+'UatReview/queryonereqsubinfo.asp?call='+call+'&SID='+SID+'&sub_req_id='+p;
	baseAjaxJsonp(url, null, function(data){
		getCurrentPageObj().find("[name='sub_req_id']").val(data.subreq["sub_req_id"]);
		if (data != undefined&&data!=null&&data.result=="true") {
			for(var k in data.subreq){
				if(k=="sub_req_code" || k=="req_code") {
					getCurrentPageObj().find("#"+k).text(data.subreq[k].toUpperCase());
					continue;
				}
				getCurrentPageObj().find("#"+k).text(data.subreq[k]);
			}
		}
	},call);
	
}


//----------------------------------------------
/**
 * 记录UAT联系人的行数
 */
var resPRowNum = 1;
/**
 * 初始化UAT负责人
 * @param param
 */
function initUatResperson(param) {
	var p = param;
	var call = getMillisecond()+'2';
	var url = dev_construction+'UatTracking/queryallresperson.asp?call='+call+'&SID='+SID+'&sub_req_id='+p;
	baseAjaxJsonp(url, null, function(data){
		if (data != undefined&&data!=null&&data.result=="true") {
			var resPerson = data.resperson;
			//UAT负责人信息展现
			if(resPerson!="" && resPerson!=null){
				for(var i=0;i<resPerson.length;i++){
					var trStr =
					'<tr id="resP_'+resPRowNum+'">'+
						'<td width="8%">'+resPRowNum+'<input type="hidden" name="id_'+resPRowNum+'" id="id_'+resPRowNum+'" /></td>' +
						'<td width="13%"><input type="text" id="uat_resperson_'+resPRowNum+'" name="uat_resperson_'+resPRowNum+'"/></td>'+
						'<td width="12%"><input type="text" id="tel_'+resPRowNum+'" name="tel_'+resPRowNum+'" /></td>'+
						'<td width="12%"><input type="text" id="explain_'+resPRowNum+'" name="explain_'+resPRowNum+'" /></td>'+
						'<td><a onclick="delUatResPRow('+resPRowNum+');" name="resPdel_'+resPRowNum+'" id="resPdel_'+resPRowNum+'">删除</a></td>'+
					'</tr>';
					//添加UAT负责人信息
					 getCurrentPageObj().find("#resPersonTable").append(trStr);//拼一行
					 for(var subKey in resPerson[i]){ //给这一行赋值
						 var subKeyLow = subKey.toLowerCase();
						 getCurrentPageObj().find("[name='"+subKeyLow+"_"+resPRowNum+"']").val(resPerson[i][subKey]);
					 }
					//序号自增
					resPRowNum ++;
				}
			}
		}	
	}, call);	
}

/**
 * 页面保存按钮初始化
 */
function saveUatResperson(p){
	//保存按钮
	var obj= getCurrentPageObj().find("#saveResPerson");
	obj.unbind("click");
	obj.click(function(){
		var params = {};
		//取值
		var inputs = getCurrentPageObj().find("#uatResPDiv input");
		for(var i=0; i<inputs.length; i++) {
			var obj = $(inputs[i]);
			if( $.trim(obj.val()) ) {
				params[obj.attr("name")] = obj.val();
			}
		}
		params["resPRowNum"] = resPRowNum;
		params["sub_req_id"] = p;
		var call = getMillisecond()+'3';
		var url = dev_construction+'UatTracking/assignresperson.asp?call='+call+'&SID='+SID;
		baseAjaxJsonp(url, params, function(data){
			if (data != undefined&&data!=null&&data.result=="true") {
				alert("保存成功!",function(){
					getCurrentPageObj().find("#reqSubsInfoTable").bootstrapTable('refresh');
					//getCurrentPageObj().find("#reqSubsInfoTable").bootstrapTable("refresh",{url:queryReqSubsUrl()});
					closeCurrPageTab();
				});
			} else {
				alert("保存失败！");
			}
		}, call);
	});
	
	
	//新增一行
	getCurrentPageObj().find("#addResPRow").click(function() {
		var trStr =
			'<tr id="resP_'+resPRowNum+'">'+
				'<td width="8%">'+resPRowNum+'</td>' +
				'<td width="13%"><input type="text" id="uat_resperson_'+resPRowNum+'" name="uat_resperson_'+resPRowNum+'"/></td>'+
				'<td width="12%"><input type="text" id="tel_'+resPRowNum+'" name="tel_'+resPRowNum+'" /></td>'+
				'<td width="12%"><input type="text" id="explain_'+resPRowNum+'" name="explain_'+resPRowNum+'" /></td>'+
				'<td><a onclick="delUatResPRow('+resPRowNum+');" name="resPdel_'+resPRowNum+'" id="resPdel_'+resPRowNum+'">删除</a></td>'+
			'</tr>';
		getCurrentPageObj().find("#resPersonTable").append(trStr);
		//序号自增
		resPRowNum ++;
	});
}

//删除一行
function delUatResPRow(row){
	var delResPObj = getCurrentPageObj().find("#id_"+row);
	if(delResPObj){
		var delResPId = delResPObj.val();
		//添加删除的UAT负责人id的隐藏框
		getCurrentPageObj().find("#resPersonTable").append('<input type="hidden" name="del_id_'+row+'" value="'+delResPId+'" />');
	}
	getCurrentPageObj().find("#resP_"+row).remove();
}


