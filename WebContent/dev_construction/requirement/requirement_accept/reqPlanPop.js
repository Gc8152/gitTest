function openReqPlanPop(id,type,planid){
	if(type=="add"){
	$('#myModal_reqplan').remove();
	getCurrentPageObj().find("#"+id).load("dev_construction/requirement/requirement_accept/reqPlanPop.html",{},function(){
		$("#myModal_reqplan").modal("show");
		summitReqPlan();
	});

	}else{
		getCurrentPageObj().find("#"+id).load("dev_construction/requirement/requirement_accept/reqPlanPop.html",{},function(){
			$("#myModal_reqplan").modal("show");
			baseAjaxJsonp(dev_construction+"requirement_accept/queryReqPlanById.asp?SID="+SID+"&req_plan_id="+planid,null , function(data) {
				if(data != undefined && data != null && data.result=="true"){
				for(var k in data){
					var str=data[k];
					k = k.toLowerCase();//大写转换为小写
				  if(k=="plan_content"){
					  getCurrentPageObj().find('#PLplan_content').val(str);
				  }else{
					  getCurrentPageObj().find("input[name='PL."+k+"']").val(str);
				  }	
				}
				}else{
					alert("获取实施计划信息失败");
					$("#myModal_reqplan").modal("hide");
				}
			});
			summitReqPlan();
		});	
	}
}

function summitReqPlan(){
//新增或更新
getCurrentPageObj().find('#reqPlan_summit').click(function(){


	      if(!vlidate($("#g_req_plan"),"",true)){
		      alert("请按要求填写图表中的必填项！");
		      return ;

	       }
		   var params = {};
		   var plan_starttime=getCurrentPageObj().find('#PLplan_starttime').val();
	       var plan_endtime=getCurrentPageObj().find('#PLplan_endtime').val();
	       var plan_endtime1=plan_endtime.replace(/\-/gi,"/");
	       var plan_starttime1=plan_starttime.replace(/\-/gi,"/");
	       var time1=new Date(plan_endtime1).getTime();
	       var time2=new Date(plan_starttime1).getTime();
	       if(time1<time2){
	    	   alert("计划结束日期不能小于开始时间");
	    	   return;
	       }
	        params["plan_starttime"]=plan_starttime;
	    	params["plan_endtime"]=plan_endtime;
		    params["req_plan_name"]=getCurrentPageObj().find('#PLreq_plan_name').val();
		    var plan_content=getCurrentPageObj().find('#PLplan_content').val();
		    var plan_content1=getCurrentPageObj().find('#PLplan_content').attr("placeHolder");
		    params["plan_content"]=plan_content==plan_content1?"":plan_content;
		    //params["plan_content"]=plan_content;
		var req_id=getCurrentPageObj().find('#req_id_reqDA').val();
		    if(req_id==null||req_id==""){
		    	alert("获取需求id失败，无法生成实施计划");
		    	return;
		    }
	        params["req_id"]=req_id;
	    
		var req_plan_id=getCurrentPageObj().find('#PLreq_plan_id').val();
		
		if(req_plan_id!=null&&req_plan_id!=""){//当主键id不为空时更新计划，否则插入
		   params["req_plan_id"]=req_plan_id;
		   baseAjaxJsonp(dev_construction+"requirement_accept/updateReqPlan.asp?SID="+SID, params , function(data) {
				if (data != undefined && data != null && data.result=="true") {
					$("#myModal_reqplan").modal("hide");
					$('#gRequirermentPlan').bootstrapTable('refresh');
				}else{
					var mess=data.mess;
					alert("修改保存失败："+mess);
				}
			});
		  }else{
		   baseAjaxJsonp(dev_construction+"requirement_accept/insertReqPlan.asp?SID="+SID, params , function(data) {
			if (data != undefined && data != null && data.result=="true") {
				$("#myModal_reqplan").modal("hide");
				$('#gRequirermentPlan').bootstrapTable('refresh');
			}else{
				var mess=data.mess;
				alert("保存失败："+mess);
			}
		});
	  }
  });
}

//结束时间失去焦点事件
/*function comparePlanTime(){
	var plan_starttime=getCurrentPageObj().find('#PLplan_starttime').val();
    var plan_endtime=getCurrentPageObj().find('#PLplan_endtime').val();
       if(plan_starttime>plan_endtime){
    	  alert("开始时间不能大于结束时间");
    	  return;
       }
}*/


			
		
		