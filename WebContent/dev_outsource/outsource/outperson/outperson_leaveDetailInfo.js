function initOutPersonLeaveDetail(op_id,idcard_no){
	var call = getMillisecond();
	baseAjaxJsonp(dev_outsource+'outperson/findOutPersonDetail.asp?call='+call+'&SID='+SID,{op_id:op_id},function(data){
		if(data){
			for(var k in data){
				if(k=="OP_ID"){
					$("#OCLD_op_id").val(data[k]);
				}else{
					$("#OCLD_"+k.toLowerCase()).text(data[k]);
				}
			}
		}
	},call);
	initOutPersonLeaveinfo(idcard_no);
}
function initOutPersonLeaveinfo(idcard_no){
	var call = getMillisecond();
	baseAjaxJsonp(dev_outsource+'outperson/findOutPersonLeaveDetailInfo.asp?call='+call+'&SID='+SID,{idcard_no:idcard_no},function(data){
		if(data){
			for(var k in data){
				var k1 = k.toLowerCase();
				if(k1=="is_handover"){
					initSelect(getCurrentPageObj().find("#OCLD_is_handover"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"T_DIC_YN"},data[k]);
				}else if(k1=="is_device_back"){
					initSelect(getCurrentPageObj().find("#OCLD_is_device_back"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"T_DIC_YN"},data[k]);	
				}else if(k1=="is_entrance_back"){
					initSelect(getCurrentPageObj().find("#OCLD_is_entrance_back"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"T_DIC_YN"},data[k]);
				}else if(k1=="work_handover_info"){
					getCurrentPageObj().find("textarea[name='OCLD.work_handover_info']").text(data[k]);
				}else if(k1=="device_back_info"){
					getCurrentPageObj().find("textarea[name='OCLD.device_back_info']").text(data[k]);
				}else if(k1=="memo"){
					getCurrentPageObj().find("textarea[name='OCLD.memo']").text(data[k]);
				}else{
					$("#OCLD_"+k1).val(data[k]);
				}
			}
		}
	},call);
	
	
	
}
