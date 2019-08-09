/**
 * 初始化人员基本信息
 * @param op_id
 */
function initOpInfo(op_id,sucess_func){
	baseAjaxJsonpNoCall(dev_outsource+'outperson/findOutPersonDetail.asp?SID='+SID,{op_id:op_id},function(data){
		if(data){
			for(var k in data){
				getCurrentPageObj().find("#OPDT_"+k).text(data[k]||"");
			}
			getCurrentPageObj().find("#ETA_idcard_no").val(data["OP_CODE"]||"");
			if(sucess_func){
				sucess_func(data);
			}
		}
	});
}
/**
 * 初始化入离场信息
 * @param op_id
 * @param purchatype
 * @param func_call
 */
function initEpaMessage(op_id,purchatype,func_call,sucess_func){
	baseAjaxJsonpNoCall(dev_outsource+'outperson/findEpaMessage.asp?SID='+SID,{"op_id":op_id,"purch_type":purchatype},function(data){
		if(data!=null&&data.result!=null&&data.result=="true"){
			var item = data.rows;
			if(func_call){
				func_call(data);
			}else{
				for(var k in item){
					getCurrentPageObj().find("#OPDT_"+k).text(item[k]||"");
				}
			}
			var out_resume=getCurrentPageObj().find("#ETA_out_resume");
			if(out_resume.length>0&&item&&item["OUT_RESUME"]){
				findFileInfo(item["OUT_RESUME"],function(data){
					if(data.rows.length>0){
						defaultShowFileInfo(item["OUT_RESUME"],out_resume.parent(),data,true,"outResumeFileDiv");
					}
				});
			}
			if(sucess_func){
				sucess_func(item);
			}
		}
	});
}