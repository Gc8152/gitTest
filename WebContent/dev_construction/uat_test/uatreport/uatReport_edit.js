////初始化字典项
(function(){
	initSelect(getCurrentPageObj().find("#accept_result"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_ACCEPT_RESULT"});
	initSelect(getCurrentPageObj().find("#putin_result"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_PUTIN_RESULT"});
})();

//初始化上传报告页面子需求的一些基本信息
function initUatReportInfo(data) {
	getCurrentPageObj().find("#sub_req_id").val(data["SUB_REQ_ID"]);
	for(var k in data){
		var key = k.toLowerCase();
		if(key=="sub_req_name"||key=="req_name"||key=="system_name") {
			getCurrentPageObj().find("#"+key).text(data[key.toUpperCase()]);
		} else if(key=="sub_req_code"||key=="req_code") {
			getCurrentPageObj().find("#"+key).text(data[key.toUpperCase()]);
		}	
	}
	
	var currTab = getCurrentPageObj();		//该方法可以获取当前显示的页面对象，通过这个对象可以避免与其他页面的id重复问题
	//点击文件上传模态框
	var tablefile = currTab.find("#table_file");
	var business_code = "";
	business_code = data["REQ_TASK_CODE"];
	//构建文件上传路径拼接所需参数
	var addfile = currTab.find("#add_file");
	var paramObj = null;
	addfile.click(function(){
		if(paramObj==null){
			baseAjax("SFilePath/getSystemNameAndVersionNameBySubReq.asp?sub_req_code="+getCurrentPageObj().find("#sub_req_code").html(), null, function(result){
				paramObj = result;
			}, false);
		}
		/*paramObj.REQ_TASK_CODE = getCurrentPageObj().find("#sub_req_code").html();*/
		openFileSvnUpload(currTab.find("#file_modal"), tablefile, 'GZ1061',business_code, '10', 'S_DIC_UAT_TEST_FILE', false, true, paramObj);
	});
	 //附件删除
	 var delete_file = currTab.find("#delete_file");
	 delete_file.click(function(){
		 delSvnFile(tablefile, business_code, "10");
	 });
	 getSvnFileList(tablefile, currTab.find("#fileview_modal"), business_code, "10");
}

//初始化页面按钮事件
(function(){
	//保存按钮
	getCurrentPageObj().find("#saveUatReprot").unbind("click");
	getCurrentPageObj().find("#saveUatReprot").click(function() {
		if(!vlidate(getCurrentPageObj(),"",true)){
			alert("您有必填项未填");
			return ;
		}
		
		var aaa=getCurrentPageObj().find("#test_memo").val();
	    if(aaa.length>230){
	    	alert("备注至多可输入230汉字！");
	    	return;
	    }
		
		var param = {};
		var values=	getCurrentPageObj().find("[name^='A.']");
		for(var i=0; i<values.length; i++) {
			var obj = $(values[i]);
			param[obj.attr("name").substring(2)] = obj.val();
		}
		param["sub_req_id"] = getCurrentPageObj().find("#sub_req_id").val();
		param["report_state"] = "01";//报告状态置为“草拟”
		//保存，这里应该判断附件中有无数据，有则文档已经上传，无则文件没有上传，这里暂且置为没有上传
		var rows = getCurrentPageObj().find("#table_file").bootstrapTable("getData");
		if(rows.length>0){
			param["upload_state"] = "00";//“已上传”
		}else{
			param["upload_state"] = "01";//“未上传”
		}
		var call = getMillisecond()+'1';
		var url = dev_construction+'UatReport/saveOrSubmitUatReportInfo.asp?call='+call+'&SID='+SID+'&flag=0';
		baseAjaxJsonp(url, param, function(data){
			if (data != undefined&&data!=null&&data.result=="true") {
				alert("保存成功!",function(){
					//$("#reqTaskInfoTable").bootstrapTable('refresh');
					closeCurrPageTab();
				});
			} else {
				alert("保存失败！");
			}
		}, call);
	});
	//保存&提交按钮
	getCurrentPageObj().find("#submitUatReprot").unbind("click");
	getCurrentPageObj().find("#submitUatReprot").click(function() {
		if(!vlidate(getCurrentPageObj(),"",true)){
			alert("您还有必填项未填");
			return ;
		}
		
		var aaa=getCurrentPageObj().find("#test_memo").val();
	    if(aaa.length>230){
	    	alert("备注至多可输入230汉字！");
	    	return;
	    }
		
		var param = {};
		var values=	getCurrentPageObj().find("[name^='A.']");
		for(var i=0; i<values.length; i++) {
			var obj = $(values[i]);
			param[obj.attr("name").substring(2)] = obj.val();
		}
		param["sub_req_id"] = getCurrentPageObj().find("#sub_req_id").val();
		param["report_state"] = "02";//报告状态置为“审核中”
		//可以提交，则文档“已上传”，这里应该判断附件表中的数据不为空；为空，则不能提交
		var rows = getCurrentPageObj().find("#table_file").bootstrapTable("getData");
		if(rows.length>0){
			//var test_case = false;//测试案例
			var test_report = false;//测试报告
			for(var i=0;i<rows.length;i++){
				/*if(rows[i].FILE_TYPE == 'sj_01'){
					test_case = true;
				}*/
				if(rows[i].FILE_TYPE == 'sj_02'){
					test_report = true;
				}
			}
		/*	if(!test_case&&!test_report){//测试报告和测试案例都没上传
				alert("文档类型为测试案例和测试报告的文件未上传");
				return;
			}else if(!test_case){
				alert("文档类型为测试案例的文件未上传");
				return;
			}else */if(!test_report){
				alert("文档类型为测试报告的文件未上传");
				return;
			}
			param["upload_state"] = "00";
		}else{
			alert("还未上传测试报告，不能提交");
			return;
		}
		var uuid = Math.uuid();
		param["uuid"]=uuid;
		nconfirm("确定提交UAT测试报告吗？",function(){
			var items = {};
			items["af_id"] = '161';//流程id
			items["systemFlag"] = '03'; //systemFlag：系统标识（合同系统：00，项目系统：01，报销系统：02，工程管理：03）
			items["biz_id"] = uuid;//业务id
			approvalProcess(items,function(data){
				submitToApp(uuid,param);
			});
		});
	});
	function submitToApp(uuid,param){
		var call = getMillisecond()+'2';
		var param2 = {};
		param2["b_code"] = getCurrentPageObj().find("#sub_req_code").text();
		param2["b_id"] = getCurrentPageObj().find("#sub_req_id").val();
		param2["b_name"] = getCurrentPageObj().find("#sub_req_name").text()+"（编号："+param2["b_code"]+"）UAT报告已上传";
		var url = dev_construction+'UatReport/saveOrSubmitUatReportInfo.asp?call='+call+'&SID='+SID+'&flag=1';
		baseAjaxJsonp(url, param, function(data){
			if (data != undefined&&data!=null&&data.result=="true") {
				alert("提交成功!",function(){
						var uatReportCall = getMillisecond()+'1';
			       		baseAjaxJsonp(dev_construction+"UatReport/queryRemindUser.asp?SID="+SID+"&call="+uatReportCall+"&sub_req_id="+param2["b_id"],
			                       null, function(mes){
			       			//插入提醒
						/*	var uatReportCall2 = getMillisecond()+'2';
				       		baseAjaxJsonp(dev_workbench+"Remind/remindAdd.asp?SID="+SID+"&call="+uatReportCall2+"&remind_type=PUB2017147"+
				                      "&user_id="+mes.ids,param2, function(mes2){
				    			//UAT测试报告插入提醒成功
				    		}, uatReportCall2);*/
			    		}, uatReportCall);		       		
					closeCurrPageTab();
				});
			} else {
				alert("提交失败！");
			}
		}, call);
	}
	//初始化验证
	initVlidate(getCurrentPageObj());
	
})();

//测试案例中输入框的失去焦点事件
(function(){
	getCurrentPageObj().find("#unpass_num").blur(function() {
		autoCalculateCaseEdit();
	});
	getCurrentPageObj().find("#pass_num").blur(function() {
		autoCalculateCaseEdit();
	});
	getCurrentPageObj().find("#unuse_num").blur(function() {
		autoCalculateCaseEdit();
	});
	getCurrentPageObj().find("#untest_num").blur(function() {
		autoCalculateCaseEdit();
	});
})();

//测试缺陷中输入框的失去焦点事件
(function(){
	getCurrentPageObj().find("#bug_table [name^='A.']").blur(function() {
		autoCalculateBug();
	});

})();

//测试案例中的数字自动计算
function autoCalculateCaseEdit(){
	var unpass_num = parseInt(getCurrentPageObj().find("#unpass_num").val());
	var pass_num = parseInt(getCurrentPageObj().find("#pass_num").val());
	var unuse_num = parseInt(getCurrentPageObj().find("#unuse_num").val());
	var untest_num = parseInt(getCurrentPageObj().find("#untest_num").val());
	if(unpass_num>=0 && pass_num>=0 && unuse_num>=0 && untest_num>=0) {
		var sum=pass_num+unuse_num+untest_num;
		/*if(case_num<sum){ 
			alert("测试通过数+不适用条数+未测试条数不能大于案例条数");
			getCurrentPageObj().find("#pass_num").val("");
			getCurrentPageObj().find("#case_num").val("");
			getCurrentPageObj().find("#pass_rate").val("");	
			getCurrentPageObj().find("#unuse_num").val("");
			getCurrentPageObj().find("#untest_num").val("");
			return;
		};*/
		var case_num = unpass_num+pass_num+unuse_num+untest_num;
		getCurrentPageObj().find("#case_num").val(case_num);
		if(unpass_num==0&&pass_num==0){
			getCurrentPageObj().find("#pass_rate").val("100.00");
			return;
		}
		var pass_rate = pass_num/case_num * 100;
		getCurrentPageObj().find("#pass_rate").val(pass_rate.toFixed(2));//转为字符串，保留两位小数		
	} else {
		getCurrentPageObj().find("#case_num").val("");
		getCurrentPageObj().find("#pass_rate").val("");	
	}
};

function aCalculateBug(){
	var adefect_num = parseInt(getCurrentPageObj().find("[name='A.adefect_num']").val());
	var adefect_passnum = parseInt(getCurrentPageObj().find("[name='A.adefect_passnum']").val());
	if(adefect_num>=0 && adefect_passnum>=0) {
		if(adefect_num<adefect_passnum){ 
			alert("A级修复验证通过数大于缺陷");
			getCurrentPageObj().find("[name='A.adefect_passnum']").val("");
			return;
		};
		getCurrentPageObj().find("[name='aleave']").val(adefect_num-adefect_passnum);
	}else {
		getCurrentPageObj().find("[name='aleave']").val("");
	}
}
function bCalculateBug(){
	var bdefect_num = parseInt(getCurrentPageObj().find("[name='A.bdefect_num']").val());
	var bdefect_passnum = parseInt(getCurrentPageObj().find("[name='A.bdefect_passnum']").val());
	if(bdefect_num>=0 && bdefect_passnum>=0) {
		if(bdefect_num<bdefect_passnum){ 
			alert("B级修复验证通过数大于缺陷");
			getCurrentPageObj().find("[name='A.bdefect_passnum']").val("");
			return;
		};
		getCurrentPageObj().find("[name='bleave']").val(bdefect_num-bdefect_passnum);
	} else {
		getCurrentPageObj().find("[name='bleave']").val("");
	}
}
function cCalculateBug(){
	var cdefect_num = parseInt(getCurrentPageObj().find("[name='A.cdefect_num']").val());
	var cdefect_passnum = parseInt(getCurrentPageObj().find("[name='A.cdefect_passnum']").val());
	if(cdefect_num>=0 && cdefect_passnum>=0) {
		if(cdefect_num<cdefect_passnum){ 
			alert("C级修复验证通过数大于缺陷");
			getCurrentPageObj().find("[name='A.cdefect_passnum']").val("");
			return;
		};
		getCurrentPageObj().find("[name='cleave']").val(cdefect_num-cdefect_passnum);
	} else {
		getCurrentPageObj().find("[name='cleave']").val("");
	}
}
function dCalculateBug(){
	var ddefect_num = parseInt(getCurrentPageObj().find("[name='A.ddefect_num']").val());
	var ddefect_passnum = parseInt(getCurrentPageObj().find("[name='A.ddefect_passnum']").val());
	if(ddefect_num>=0 && ddefect_passnum>=0) {
		if(ddefect_num<ddefect_passnum){ 
			alert("D级修复验证通过数大于缺陷");
			getCurrentPageObj().find("[name='A.ddefect_passnum']").val("");
			return;
		};
		getCurrentPageObj().find("[name='dleave']").val(ddefect_num-ddefect_passnum);
	} else {
		getCurrentPageObj().find("[name='dleave']").val("");
	}
}

//测试缺陷中的数字自动计算
function autoCalculateBug() {
	var adefect_num = parseInt(getCurrentPageObj().find("[name='A.adefect_num']").val());
	var adefect_passnum = parseInt(getCurrentPageObj().find("[name='A.adefect_passnum']").val());
	var bdefect_num = parseInt(getCurrentPageObj().find("[name='A.bdefect_num']").val());
	var bdefect_passnum = parseInt(getCurrentPageObj().find("[name='A.bdefect_passnum']").val());
	var cdefect_num = parseInt(getCurrentPageObj().find("[name='A.cdefect_num']").val());
	var cdefect_passnum = parseInt(getCurrentPageObj().find("[name='A.cdefect_passnum']").val());
	var ddefect_num = parseInt(getCurrentPageObj().find("[name='A.ddefect_num']").val());
	var ddefect_passnum = parseInt(getCurrentPageObj().find("[name='A.ddefect_passnum']").val());
	if(adefect_num>=0 && bdefect_num>=0 && cdefect_num>=0 && ddefect_num>=0) {
		getCurrentPageObj().find("[name='A.alldefect_num']").val(parseInt(adefect_num)
				+parseInt(bdefect_num)+parseInt(cdefect_num)+parseInt(ddefect_num));
	} else {
		getCurrentPageObj().find("[name='A.alldefect_num']").val("");
	}
	if(adefect_passnum>=0 && bdefect_passnum>=0 && cdefect_passnum>=0 && ddefect_passnum>=0) {
		getCurrentPageObj().find("[name='allpass']").val(parseInt(adefect_passnum)
				+parseInt(bdefect_passnum)+parseInt(cdefect_passnum)+parseInt(ddefect_passnum));
	} else {
		getCurrentPageObj().find("[name='allpass']").val("");
	}
	if(adefect_num>=0 && bdefect_num>=0 && cdefect_num>=0 && ddefect_num>=0 && adefect_passnum>=0 && bdefect_passnum>=0 && cdefect_passnum>=0 && ddefect_passnum>=0) {
		getCurrentPageObj().find("[name='A.allleftdefect_num']").val(parseInt(adefect_num-adefect_passnum)+parseInt(bdefect_num-bdefect_passnum)
				+parseInt(cdefect_num-cdefect_passnum)+parseInt(ddefect_num-ddefect_passnum));
	} else {
		getCurrentPageObj().find("[name='A.allleftdefect_num']").val("");
	}
}