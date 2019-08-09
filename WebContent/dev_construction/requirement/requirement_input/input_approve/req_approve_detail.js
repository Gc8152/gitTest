
//初始化附件列表
function initReqDetailFileList(){
 
 var file_id = getCurrentPageObj().find("#file_id_reqRD").val();
 var tablefile = getCurrentPageObj().find("#reqRD_tablefile");
//初始化附件列表
 getSvnFileList(tablefile,getCurrentPageObj().find("#reqRD_fileview_modal"),file_id);	
	
}
//初始化需求收益估算和理由样式
function initReqDetailIncomeCss(){
	var req_income_flag=$('input:radio[name="RD.req_income_flag"]:checked').val();
	if(req_income_flag=='01'){//当需求收益为否时隐藏需求收益估算和理由
		$('#req_income_reqRD').parent().hide();
		$('#req_income_RD').parent().hide();
		$('#req_income_doc_reqRD').parent().parent().hide();
		$('#req_detail_remark').hide();
	}	
	initReqDetailFileList();//初始化附件列表
}

function reqInputApproveOver(req_id,req_state){
	baseAjaxJsonp(dev_construction+"requirement_input/submitToAccept.asp?SID="+SID+"&req_id="+req_id+"&req_state="+req_state, null , function(data) {
		if(data!=null&&data!=""&&data.result=="true"){
			alert("提交成功!");
		}else{
			var mess=data.mess;
			alert("提交失败！"+""+mess);
		}
		});
}

