//查看投产条件
function openCheckPop(pop_id,req_task_code){
	getCurrentPageObj().find('#modal_req_approve_and_doc2').remove();	
	getCurrentPageObj().find("#"+pop_id).load("dev_construction/send_produce/sendproduceapply/instancy/check_pop.html",{},function(){
		initCheckPop(req_task_code);
	});
}

function initCheckPop(req_task_code){
	var produce_standard = new Object();
	//紧急版 			通过true和false来判断是否必要
	produce_standard["15"] = [false, false, false, false, false, false, false, false, false, false, true, true, false, false];
	//1618
	produce_standard["other"] = [true, true, true, true, true, true, true, true, true, true, true, true, true, true];

	var detailTable = getCurrentPageObj().find("#sendProContentDetail2");
	detailTable.find("#pop_task_code").val(req_task_code);
	var mill = getMillisecond();
	baseAjaxJsonp(dev_construction+'sendProduceApply/queryTaskAppraiseAndDoc.asp?call='+mill+'&SID='+SID+'&req_task_code='+req_task_code,null, function(result){
		var trArr = detailTable.find("tbody tr");
		var len = trArr.length;
		var ps = produce_standard[result["VERSIONS_TYPE"]];
		if(typeof(ps)=="undefined"){
			ps = produce_standard["other"];
		}
		for(var i=0; i<len;i++){
			var $tr = $(trArr[i]);
			var trName = $tr.attr("name");
			var $phase_td = $tr.find("td[name=phase]");
			var $result_td = $tr.find("td[name=result]");
			var type = $tr.attr("type");
			var valObj = null; 
			if(type=="appr"){
				valObj = result[trName];
			} else if(type=="doc"){
				valObj = result["doc"][trName];
			} else if(type=="test"){
				valObj = result[trName];
			}
			var phase_val = "";
			var result_val = "";
			result_val = "不满足";
			if(typeof(valObj)!="undefined"&&valObj!=null){
				if(type=="appr"){
					switch(valObj){
						case '01':
						  phase_val = "评审发起中";	  break;
						case '02':
						  phase_val = "评审通过";
						  result_val = "满足";		  break;
						case '03':
						  phase_val = "评审不通过";	  break;
						case '04':
						  phase_val = "评审发起中";
						  result_val = "满足";		  break;
						case '05':
						  phase_val = "评审通过";
						  result_val = "满足";		  break;
						case '06':
						  phase_val = "评审不通过";
						  result_val = "满足";		  break;
						case '10':
							  phase_val = "评审结案";
							  result_val = "满足";		  break;
					}
				} else if(type=="doc"){
					phase_val = valObj.FILE_NAME;
					$phase_td.attr("file_id", valObj.FID);
					$phase_td.unbind("click").click(function(){
						verifyFileExit($(this).attr("file_id"));
					});
					result_val = "满足";
				} else if(type=="test"){
					phase_val = valObj=="00"?"通过":"不通过";
					result_val = valObj=="00"?"满足":"不满足";
				}
			} else {
				if(type=="appr"){
					phase_val = "未发起";
				} else if(type="doc"){
					phase_val = "未上传";
				}
				$phase_td.unbind("click");
			}
			$phase_td.html(phase_val);
			$phase_td.css("color","black");
			if(phase_val.indexOf(".")!=-1){
				$phase_td.css("color","blue");
			}
			result_val = ps[i]?result_val:"非必要";
			if(result_val=="不满足"){
				$result_td.css("color","red");
			} else {
				$result_td.css("color","black");
			}
			$result_td.html(result_val);
		}
		getCurrentPageObj().find("#modal_req_approve_and_doc2").modal("show");
	}, mill);
}
