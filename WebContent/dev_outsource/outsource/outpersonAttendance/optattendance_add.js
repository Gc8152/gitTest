var objPOP = getCurrentPageObj(); //获取页面对象
var call_op = getMillisecond();
function initaddOptAttendance(){//初始化保存按钮
	//考勤类型
	initSelect(getCurrentPageObj().find("#acc_typeAD"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_ATTENDANCE_TYPE"});
	//考勤状态
	initSelect(getCurrentPageObj().find("#acc_statusAD"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_ATTENDANCE_STATUS"});
	//外包人员pop框
	obj=getCurrentPageObj().find("#op_nameAD");
	obj.unbind("click");
	obj.click(function(){
		proManPop1("outPersonInfoPop",{singleSelect:true,op_name:getCurrentPageObj().find("#op_nameAD"),op_code:getCurrentPageObj().find("input[name='AD.op_code']"),user_no:getCurrentPageObj().find("input[name='AD.user_no']")});
	});
	initVlidate(objPOP);
	var obj=getCurrentPageObj().find("#add_optattendance");
	obj.unbind("click");
	obj.click(function(){
		var v = $('#work_hoursAD').val();
        var reg = /^(([0-8]{1}))$/gi;
        if(reg.test(v)){
        
        }else{
        	alert('标准工时输入不符合规范！');
        	return;
        }
      /*  var overtime=getCurrentPageObj().find("#work_overhoursAD");
        if(overtime!=""||overtime!=undefined){
        	var o= $('#work_overhoursAD').val();
            var o_reg =/^(([0-9]{1})|([1]{1}[0-9]{1})|([2]{1}[0-4]{1}))$/gi;
            if(o_reg.test(o)){
            }else{
            	alert('加班工时输入不符合规范！');
            	return;
            }
        }*/
		if(vlidate(getCurrentPageObj(),"",false)){
			var param = {};
			var vals=getCurrentPageObj().find("[name^='AD.']");
			for(var i=0;i<vals.length;i++){
				var val=$(vals[i]);
				if($.trim(val.val())!=""){
					param[val.attr("name").substr(3)]=val.val();
				}
			}
			var berw_time = param.berw_time;//上班时间
			var aftw_time = param.aftw_time;//下班时间
			if(berw_time>aftw_time){
				alert("下班时间不能小于上班时间！");
				return;
			}
			var  call_op = getMillisecond();
			baseAjaxJsonp(dev_outsource+'optattendance/addOptAttendance.asp?call='+call_op+'&SID='+SID,param,function(data){
				if(!data||!data.result||data.result=="false"){
					alert((data.msg||"保存失败!"));
				}else{
					alert("保存成功!");
					obj.unbind("click");
					closeCurrPageTab();
					//$("#optAttendanceTableInfo").bootstrapTable('refresh', {url : dev_outsource+'optattendance/queryOptAttendanceList.asp?call=jq_1520840212928&SID='+SID});
				}
			},call_op);
		}
	});
}