//页面div调用pop的id，操作类型，子需求编号
function openReqSubPop(id,type,reqSubCode){
	if(type=="add"){
	$('#myModal_reqSub').remove();
	getCurrentPageObj().find("#"+id).load("dev_construction/requirement/requirement_analyze/split_subreq/reqSubPop.html",{},function(){
		$("#myModal_reqSub").modal("show");
		saveReqSub();
	});

	}else{
		getCurrentPageObj().find("#"+id).load("dev_construction/requirement/requirement_analyze/split_subreq/reqSubPop.html",{},function(){
			$("#myModal_reqSub").modal("show");
			baseAjaxJsonp(dev_construction+"requirement_splitreq/queryReqSubById.asp?SID="+SID+"&sub_req_code="+reqSubCode,null , function(data) {
				if(data != undefined && data != null && data.result=="true"){
//					if(data.sub_req_state!="01"){
//						alert("该需求点不是草拟状态，不能修改");
//						$("#myModal_reqSub").modal("hide");
//					}else{
				      for(var k in data){
					    var str=data[k];
					     k = k.toLowerCase();//大写转换为小写
				        if(k=="sub_req_code"||k=="sub_req_name"||k=="plan_onlinetime"){
				        	getCurrentPageObj().find("input[name='SPP."+k+"']").val(str);
				        }else{
				        	getCurrentPageObj().find('#SPPsub_req_content').val(str);
				        }	
				       }
				      getCurrentPageObj().find("#SPPsub_req_content").val(data["SUB_REQ_CONTENT"]);
				      //
					   //}
				}else{
					alert("获取子需求信息失败");
					$("#myModal_reqSub").modal("hide");
				}
			});
			saveReqSub();
		});	
	}
}

function saveReqSub(){
//新增或更新
$('#subReq_save').click(function(){
	
	   if(!vlidate($("#g_req_sub"),"",true)){
		   alert("请按要求填写图表中的必填项！");
		   return ;
	    }
		var inputs = $("input:text[name^='SPP.']");
		var textareas = $("textarea[name^='SPP.']");
		var params = {};
		
		for(var i=0;i<inputs.length;i++){
			params[$(inputs[i]).attr("name").substr(4)] = $(inputs[i]).val();	 
		}
		for(var i=0;i<textareas.length;i++){
			params[$(textareas[i]).attr("name").substr(4)] = $(textareas[i]).val();
		}
		var req_code=getCurrentPageObj().find('#req_code_reqSP').text();//拿到需求编号用于生产子需求编号
		var req_id=getCurrentPageObj().find('#req_id_reqSP').val();//需求id,用于关联关系
		var sub_req_code=$('#SPPsub_req_code').val();//pop页面获取隐藏的子需求编号（其实是可以直接从列表传进来的）
		
		if(sub_req_code!=null&&sub_req_code!=""){//当子需求编号不为空时更新，否则新增
		   params["sub_req_code"]=sub_req_code;
		   baseAjaxJsonp(dev_construction+"requirement_splitreq/updateReqSub.asp?SID="+SID, params , function(data) {
				if (data != undefined && data != null && data.result=="true") {
					alert("修改保存成功");
					$("#myModal_reqSub").modal("hide");
					$('#gRequirementSub').bootstrapTable('refresh');
				}else{
					var mess=data.mess;
					alert("修改保存失败："+mess);
				}
			});
		  }else{
			  if(req_code!=null&&req_code!=""){
				  params["req_code"]=req_code;
			  }else{
				  alert("获取需求编号失败");
				  return;
			  }
			  if(req_id!=null&&req_id!=""){
				  params["req_id"]=req_id;
			  }else{
				  alert("获取需求id失败");
				  return;
			  }
		   baseAjaxJsonp(dev_construction+"requirement_splitreq/insertReqSub.asp?SID="+SID, params , function(data) {
			if (data != undefined && data != null && data.result=="true") {
				alert("保存成功");
				$("#myModal_reqSub").modal("hide");
				$('#gRequirementSub').bootstrapTable('refresh');
			}else{
				alert("保存失败");
			}
		});
	  }
  });
}



			
		
		