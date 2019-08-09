
var currTab=getCurrentPageObj();
function initReqDetailLayout(ids){
	var reqdetailCall=getMillisecond();
	baseAjaxJsonp(dev_construction+"requirement_input/queryRequirementInfoByID.asp?SID="+SID+"&req_id="+ids+"&call="+reqdetailCall, null , function(data) {
		for ( var k in data) {
			var str=data[k];
			k = k.toLowerCase();//大写转换为小写
	    if(k=="req_datatable_flag"||k=="req_income_flag"){
	    	currTab.find("input[name='RD."+k+"']"+"[value="+str+"]").attr("checked",true);
	    }else if(k=="req_level"){
	    	autoInitRadio({dic_code:"G_DIC_REQUIREMENT_LEVEL"},getCurrentPageObj().find("#req_level_reqRD"),"RD.req_level",{labClass:"ecitic-radio-inline",value:str});
		}else if(k=="req_income_doc"){
			currTab.find("span[name='RD." + k + "']").text(str);
		}else if(k=="req_description"){	
			currTab.find("span[name='RD." + k + "']").text(str);
		}else if(k=="file_id"){
			currTab.find("#file_id_reqRD").val(str);
		}else if(k=="assfile_id"){
			currTab.find("#assfile_id_reqRD").val(str);
		}else{
			currTab.find("span[name='RD." + k + "']").text(str);
		}	
		}
		initReqDetailIncomeCss();//初始化需求收益评估样式
		//初始化附件列表
		//需求申请书 
		var tablefile = getCurrentPageObj().find("#reqRD_tablefile");
		var req_state = parseInt(data.REQ_STATE);
		if(req_state>=10){
			getSvnFileList(tablefile, getCurrentPageObj().find("#reqRD_fileview_modal"), data.REQ_CODE, "0101");	
		}else{
			getSvnFileList(tablefile, getCurrentPageObj().find("#reqRD_fileview_modal"), data.FILE_ID, "0101");
		}
		//业务需求说明书 
		var tablefile2 = getCurrentPageObj().find("#reqAss_detailfile");
		if(req_state>=10){
			getSvnFileList(tablefile2, getCurrentPageObj().find("#reqAss_detail_modal"), data.REQ_CODE, "0102");	
		}else{
			getSvnFileList(tablefile2, getCurrentPageObj().find("#reqAss_detail_modal"), data.ASSFILE_ID, "0102");
		}
		
	},reqdetailCall);
}

  function initReqDetailLayout2(ids){
	  var reqdetailCall=getMillisecond();
	  baseAjaxJsonp(dev_construction+"requirement_input/queryRequirementInfoByID.asp?SID="+SID+"&req_id="+ids+"&call="+reqdetailCall, null , function(data) {
		 for ( var k in data) {
			 var str=data[k];
			 k = k.toLowerCase();//大写转换为小写
	      if(k=="req_datatable_flag"||k=="req_income_flag"){
	    	  currTab.find("input[name='RD."+k+"']"+"[value="+str+"]").attr("checked",true);
	      }else if(k=="req_level"){
	    	  autoInitRadio({dic_code:"G_DIC_REQUIREMENT_LEVEL"},getCurrentPageObj().find("#req_level_reqRD"),"RD.req_level",{labClass:"ecitic-radio-inline",value:str});
		  }else if(k=="req_income_doc"){
			 currTab.find("span[name='RD." + k + "']").text(str);
		  }else if(k=="req_description"){	
			 currTab.find("span[name='RD." + k + "']").text(str);
		  }else if(k=="file_id"){
			  currTab.find("#file_id_reqRD").val(str);
		  }else{
			  currTab.find("span[name='RD." + k + "']").text(str);
		  }	
		  }
		  initReqDetailIncomeCss();//初始化需求收益评估样式
		  
		  //初始化附件列表
		  var tablefile = getCurrentPageObj().find("#reqRD_tablefile");
		  getSvnFileList(tablefile, getCurrentPageObj().find("#reqRD_fileview_modal"), data.REQ_CODE, "0101");
		//record = data;
	   },reqdetailCall);
    }

	//初始化需求收益估算和理由样式
	function initReqDetailIncomeCss(){
		/*var req_income_flag=$('input:radio[name="RD.req_income_flag"]:checked').val();
		if(req_income_flag=='01'){//当需求收益为否时隐藏需求收益估算和理由
			$('#req_income_reqRD').parent().hide();
			$('#req_income_RD').parent().hide();
			$('#req_income_doc_reqRD').parent().parent().hide();
			$('#req_detail_remark').hide();
		}*/
	}
