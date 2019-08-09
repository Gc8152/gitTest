var k=1;
function initOutPersonRankDetail(op_id,spstate,flag){
	if(op_id!=undefined&&op_id!=null&&op_id!=""){
		var call = getMillisecond();
		baseAjaxJsonp(dev_outsource+"outperson/queryOneOutPersonRankInfo.asp?id="+op_id+'&call='+call+'&SID='+SID,null,function(data){
			if(data["rows"]!=undefined&&data["rows"]!=null&&data["rows"]!=""){
				getCurrentPageObj().find("#rank_id").html(data["rows"][0].ID);
				getCurrentPageObj().find("#apply_group").html(data["rows"][0].APPLY_GROUP);
				getCurrentPageObj().find("#opt_manager").html(data["rows"][0].OPT_MANAGER);
				getCurrentPageObj().find("#rank_apply_time").html(data["rows"][0].RANK_APPLY_TIME);
				getCurrentPageObj().find("#apply_reason").html(data["rows"][0].APPLY_REASON);
				if(data["rows"][0].FILE_ID_SE!=undefined&&data["rows"][0].FILE_ID_SE!=null&&data["rows"][0].FILE_ID_SE!=""){
					if(data["rows"][0].FILE_ID_SE&&$.trim(data["rows"][0].FILE_ID_SE)!=""){
						findFileInfo(data["rows"][0].FILE_ID_SE,function(data){
							if(data.rows.length>0){
								defaultShowFileInfo(data["rows"][0].FILE_ID_SE,getCurrentPageObj().find("#ORD_file_id_SE"),data,false,"queryInfoContractFileDiv");
							}
						});
	   				}
				}
			}
			if(data["rankPerson"]!=undefined&&data["rankPerson"]!=null&&data["rankPerson"]!=""&&flag=="1"){
				getCurrentPageObj().find("#perInfoDiv2").remove();
				getCurrentPageObj().find("#fileStateDiv").remove();
				for(var i=0;i<data["rankPerson"].length;i++){
	    			rankPerson =data["rankPerson"][i];
	    			 var tr="<tr id=\"rankOutperson_"+k+"\" >"+
	    			 //姓名
	    			 "<td ><div type='text' id='op_name"+k+"' name='op_name'   readonly ></div</td>"+
	    			 //特长
	    			 "<td ><div id='op_speciality"+k+"' name='op_speciality'  ></div></td>"+
	    			 //笔试/面试成绩
	    		/*	 "<td ><div id='op_grade"+k+"' name='op_grade'  ></div></td>"+*/
	    			 //拟定资质
	    			 "<td ><div type=\"text\"   name=\"op_protocol_level\" id=\"level_name"+k+"\"  ></div></td>"+
	    			 //拟定级别
	    			 "<td ><div type=\"text\"   name=\"op_protocol_grade\" id=\"grade_name"+k+"\"   ></div></td>"+
	    			 //试用期
	    			 "<td ><div type=\"text\" name=\"op_probation\" id=\"op_probation"+k+"\"    ></div></td>"+
	    			 //公司名称
	    			 "<td ><div type=\"text\" name=\"op_company\" id=\"op_company"+k+"\"    ></div></td>"+
	    			 //评定日期
	    			 "<td ><div type=\"text\" name=\"evaluate_date\" id=\"evaluate_date"+k+"\"  ></div></td>"+
	    			 //实际报到时间
	    			 "<td ><div type=\"text\" name=\"actually_time\" id=\"actually_time"+k+"\" ></div></td></tr>";
	    			getCurrentPageObj().find("#outpersonRankDetailTable").append(tr);
	    			for (var p in rankPerson ){
	    				getCurrentPageObj().find("#"+p.toLowerCase()+k).html(rankPerson[p]);
	    			}
	    			//序号自增
	    			k++;
	    		}
				if(data["rows"][0].FILE_ID_SON!=undefined&&data["rows"][0].FILE_ID_SON!=null&&data["rows"][0].FILE_ID_SON!=""){
					if(data["rows"][0].FILE_ID_SON&&$.trim(data["rows"][0].FILE_ID_SON)!=""){
						findFileInfo(data["rows"][0].FILE_ID_SON,function(data){
							if(data.rows.length>0){
								defaultShowFileInfo(data["rows"][0].FILE_ID_SON,getCurrentPageObj().find("#ORD_file_id_son"),data,false,"queryInfoContractFileDiv");
							}
						});
	   				}
				}
			}
			if(data["rankPerson"]!=undefined&&data["rankPerson"]!=null&&data["rankPerson"]!=""&&flag=="2"){
				getCurrentPageObj().find("#perInfoDiv").remove();
				getCurrentPageObj().find("#fileSonDiv").remove();
				for(var i=0;i<data["rankPerson"].length;i++){
					rankPerson =data["rankPerson"][i];
					var tr="<tr id=\"rankOutperson_"+k+"\"   >"+
					//姓名
					"<td ><div type='text' id='op_name"+k+"' name='op_name'   readonly ></div</td>"+
					//所在项目
					//"<td ><div id='own_project"+k+"' name='own_project'  ></div></td>"+
					//所属应用
					"<td ><div id='op_belongsystem_name"+k+"' name='op_belongsystem_name'  ></div></td>"+
					//考核分数
					/*"<td ><div id='check_score"+k+"' name='check_score'  ></div></td>"+*/
					//申请资质
					"<td ><div type=\"text\"   name=\"op_protocol_level\" id=\"level_name"+k+"\"></div></td>"+
					//原有级别
					"<td ><div id='original_grade"+k+"' name='original_grade'  ></div></td>"+
					//申请级别
					"<td ><div type=\"text\"   name=\"apply_grade\" id=\"apply_grade_name"+k+"\" ></div></td>"+
					//公司名称
					"<td ><div type=\"text\" name=\"op_company\" id=\"op_company"+k+"\" ></div></td>"+
					//评定日期
					"<td ><div type=\"text\" name=\"evaluate_date\" id=\"evaluate_date"+k+"\"  ></div></td></tr>";
					getCurrentPageObj().find("#outpersonRankDetailTable").append(tr);
					for (var p in rankPerson ){
						if(p == 'GRADE_NAME'){
							getCurrentPageObj().find("#apply_grade_name"+k).html(rankPerson[p]);
						}
						getCurrentPageObj().find("#"+p.toLowerCase()+k).html(rankPerson[p]);
					}
					//序号自增
					k++;
				}
				if(data["rows"][0].FILE_ID_STATE!=undefined&&data["rows"][0].FILE_ID_STATE!=null&&data["rows"][0].FILE_ID_STATE!=""){
					if(data["rows"][0].FILE_ID_STATE&&$.trim(data["rows"][0].FILE_ID_STATE)!=""){
						findFileInfo(data["rows"][0].FILE_ID_STATE,function(data){
							if(data.rows.length>0){
								defaultShowFileInfo(data["rows"][0].FILE_ID_STATE,getCurrentPageObj().find("#ORD_file_id_state"),data,false,"queryInfoContractFileDiv");
							}
						});
	   				}
				}
			}
		},call);
	}
	
	getCurrentPageObj()[0].call_func=function(result,mark,biz_id,msg){
		if(mark=='over'){//审批通过
			appUpdateOpRankState("00",biz_id);
		}else if(mark=='reject'){
			appUpdateOpRankState("01",biz_id);
		}else if(mark=='back'){	
			appUpdateOpRankState("01",biz_id);
		}else{
			alert(msg);
		}
	};
	/**
	 * 状态控制
	 * @param state_type
	 * @param biz_id
	 */
	function appUpdateOpRankState(rank_state,biz_id){
		var call_oprank = getMillisecond();
		baseAjaxJsonp(dev_outsource+'outperson/appUpdateOpRankState.asp?call='+call_oprank+'&SID='+SID,{rank_id:biz_id,rank_state:rank_state},function(data){
		},call_oprank);
	}
}