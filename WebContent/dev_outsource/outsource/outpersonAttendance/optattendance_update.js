var objPOP = getCurrentPageObj();
initVlidate(objPOP);
var calls = getMillisecond();
/**
 * 初始化人员考勤信息信息 
 */
function initUptOptAttendance(acc_id){
	var call = getMillisecond();
	//考勤类型
	baseAjaxJsonp(dev_outsource+"optattendance/queryOptAttendanceDetail.asp?acc_id="+acc_id+"&SID="+SID+"&call="+call,null,function(data){
		if(data){
			for(var key in data.optatt){
				getCurrentPageObj().find("#"+key.toLowerCase()+"RU").val(data.optatt[key]);
				if(key == "ACC_TYPE"){
					initSelect(getCurrentPageObj().find("#acc_typeRU"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_ATTENDANCE_TYPE"},data.optatt[key]);
				}else if(key == "ACC_STATUS"){
					initSelect(getCurrentPageObj().find("#acc_statusRU"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_ATTENDANCE_STATUS"},data.optatt[key]);
				}
			}
		}
	},call);
	//外包人员pop框
	obj=getCurrentPageObj().find("#op_nameRU");
	obj.unbind("click");
	obj.click(function(){
		openOptPop("outPersonInfoPop",{singleSelect:true,op_name:getCurrentPageObj().find("#op_nameRU"),no:getCurrentPageObj().find("input[name='RU.op_code']")});
	});
	getCurrentPageObj().find("#acc_idRU").val(acc_id);
}
 /**
  * 人员考勤信息修改
  */
(function(){
	 var obj=getCurrentPageObj().find("#update_optattendance");
	 obj.unbind("click");
	 obj.click(function(){
		 var v = $('#work_hoursRU').val();
	        var reg = /^(([0-8]{1}))$/gi;
	        if(reg.test(v)){
	        
	        }else{
	        	alert('标准工时输入不符合规范！');
	        	return;
	        }
	   /*  var overtime=getCurrentPageObj().find("#work_overhoursRU");
	       if(overtime!=""||overtime!=undefined){
	        	var o= $('#work_overhoursRU').val();
	            var o_reg =/^(([0-9]{1})|([1]{1}[0-9]{1})|([2]{1}[0-4]{1}))$/gi;
	            if(o_reg.test(o)){
	            }else{
	            	alert('加班工时输入不符合规范！');
	            	return;
	            }
	        }*/
		 if(vlidate(getCurrentPageObj(),"",false)){
			 var params={};
			 var inputs = $("input[name^='RU.']");
			 var select = $("select[name^='RU.']");
			 var textarea = $("textarea[name^='RU.']");
			 for (var i = 0; i < inputs.length; i++) {
				var obj = $(inputs[i]);
				params[obj.attr("name").substr(3)] = obj.val();
			}
			for(var i = 0; i < select.length; i++){
				var obj = $(select[i]);
				params[obj.attr("name").substr(3)] = obj.val();
			}
			for(var i = 0; i < textarea.length; i++){
				var obj = $(textarea[i]);
				params[obj.attr("name").substr(3)] = obj.val();
			}
			baseAjaxJsonp(dev_outsource+"optattendance/updateOptAttendance.asp?SID="+SID+"&call="+calls,params,function(data){
			if(!data||!data.result||data.result=="false"){
				alert("修改失败!");
			}else{
				closeCurrPageTab();
				alert("修改成功!");
				//$("#optAttendanceTableInfo").bootstrapTable('refresh', {url : dev_outsource+'optattendance/queryOptAttendanceList.asp?call=jq_1520840212928&SID='+SID});
			}
		},calls);
	 }
 });	 	
})();

//时间比较
function ocheckupdTimeCompare(){
	WdatePicker({onpicked:function(){
		var check_starttime = getCurrentPageObj().find("#check_starttime").val();
		var check_endtime = getCurrentPageObj().find("#check_endtime").val();
		if(check_starttime!=""&&check_endtime!=""){
			if(check_starttime>check_endtime){
				alert('开始时间不能大于结束时间!',function(){
					getCurrentPageObj().find("#check_starttime").val("");
					getCurrentPageObj().find("#check_endtime").val("");
				});
			}
		}
	}});
}
