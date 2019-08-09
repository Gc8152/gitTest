
initRequirementApproveBtn();
//初始化页面信息
function initReqAprInformationlayout(ids){
	var reqAprCall=getMillisecond();
	baseAjaxJsonp(dev_construction+"requirement_splitreq/querySplitSubReqById.asp?SID="+SID+"&req_id="+ids+"&call="+reqAprCall, null , function(data) {
		for ( var f in data) {
			var map=data[f];
			   if(f=="1"||f=="2"){
			     for(var k in map){
					var str=map[k];
					k = k.toLowerCase();//大写转换为小写
			    if(k=="req_dis_result"||k=="req_acc_result"){
			    	getCurrentPageObj().find("input[name='APR."+k+"']"+"[value="+str+"]").attr("checked",true);
			    }else if(k=="req_level"){
			    	baseAjax("SDic/findItemByDic.asp",{dic_code:"G_DIC_REQUIREMENT_LEVEL"},function(data){
			    		if(data!=undefined){
			    			for(var i=0;i<data.length;i++){
			    				if(data[i].ITEM_CODE==str){
		    						getCurrentPageObj().find("#APR_req_level").append("<label class='ecitic-radio-inline'><input type='radio' name='APR.req_level'  value="+data[i].ITEM_CODE+" checked disabled/>&nbsp;"+data[i].ITEM_NAME+"</label>");
		    					}else{
		    						getCurrentPageObj().find("#APR_req_level").append("<label class='ecitic-radio-inline'><input type='radio' name='APR.req_level'  value="+data[i].ITEM_CODE+" disabled/>&nbsp;"+data[i].ITEM_NAME+"</label>");
		    					}					
			    			}
			    		}
			    	},false);	
			    }else if(k=="req_feasibility_result"){
			    	//autoInitRadio({dic_code:"G_DIC_REQ_FEASIBILITY"},getCurrentPageObj().find("#APR_acc_feasibility"),"APR.req_feasibility_result",{labClass:"ecitic-radio-inline",value:"01"});
			    	baseAjax("SDic/findItemByDic.asp",{dic_code:"G_DIC_REQ_FEASIBILITY"},function(data){
			    		if(data!=undefined){
			    			for(var i=0;i<data.length;i++){
			    				if(data[i].ITEM_CODE==str){
		    						getCurrentPageObj().find("#APR_acc_feasibility").append("<label class='ecitic-radio-inline'><input type='radio' name='APR.req_feasibility_result'  value="+data[i].ITEM_CODE+" checked disabled/>&nbsp;"+data[i].ITEM_NAME+"</label>");
		    					}else{
		    						getCurrentPageObj().find("#APR_acc_feasibility").append("<label class='ecitic-radio-inline'><input type='radio' name='APR.req_feasibility_result'  value="+data[i].ITEM_CODE+" disabled/>&nbsp;"+data[i].ITEM_NAME+"</label>");
		    					}					
			    			}
			    		}
			    	},false);
			    }else if(k=="req_id"){
			    	getCurrentPageObj().find('#req_id_reqAPR').val(str);
 				}else if(k=="req_acc_classify"){
			    	getCurrentPageObj().find('#req_acc_classifyAPR').val(str);
			
			    }else if(k=="file_id"){
			    	getCurrentPageObj().find('#file_id_reqAPR').val(str);
			    }else if(k=="file_id_assess"){
			    	getCurrentPageObj().find('#file_id_reqAssAPR').val(str);
				/*}else if(k=="req_assess_level"){
					var num=str.split(",");
					for(var i=0;i<num.length;i++){
						$("input[name='APR."+k+"']"+"[value="+num[i]+"]").attr("checked",true);
						}*/
					}else if(k=="req_type1"){
						if(str=='02'){
							getCurrentPageObj().find('#business_org_hide').hide();
							getCurrentPageObj().find('#APRproject_id_display').hide();
						}
			    	}else{
						$("span[name='APR."+k+"']").text(str);
					}
			     }
			  }
			   if(f==1){
				 //初始化流程数据
					initTitle(map["INSTANCE_ID"]);
					initAFApprovalInfo(map["INSTANCE_ID"]);
					if(map["CURR_ACTORNO"]==map["CREATE_PERSON"]){
						
						getCurrentPageObj().find('#myTab a[href="#requirementInfo1"]').tab('show')
						alert("提示：若需求的提出部门或业务主管部门为多个的，需上传会签记录表！");
					}else{
						getCurrentPageObj().find("#add_reqBook").hide();
						
					}
			   }
		    }
		getCurrentPageObj().find("#APRreq_analysis1").hide();
		getCurrentPageObj().find("#req_product_manager").hide();
		getCurrentPageObj().find("#req_create_personAPR").hide();
		initReqApproveCss();//收益估算样式初始化
		initReqApprovePlanList();//实施计划初始化
	},reqAprCall);
	
}

//初始化按钮
function initRequirementApproveBtn(){
	//提交审批
	$('#submitApprove').click(function(){
	   var req_id=getCurrentPageObj().find('#req_id_reqAPR').val();
	   var approve_result=getCurrentPageObj().find('input:radio[name="APR.approve_result"]:checked').val();
	   baseAjaxJsonp(dev_construction+"requirement_accept/reqApprove.asp?SID="+SID+"&req_id="+req_id+"&approve_result="+approve_result, null , function(data) {
			if (data != undefined && data != null && data.result=="true") {
						   alert("提交成功!", function(){
							closeCurrPageTab();
						});
			}else{
				     alert("提交失败");
				     
			}
		});   
	  });
}

//初始化需求收益估算样式
function initReqApproveCss(){
	var req_income_flag=getCurrentPageObj().find('input:radio[name="APR.req_income_flag"]:checked').val();
	if(req_income_flag=="01"){//收益评估为否时隐藏收益估算和理由
		getCurrentPageObj().find('#req_income_hide').hide();
		getCurrentPageObj().find('#req_income_APR').hide();
		getCurrentPageObj().find('#remark_apr').hide();
		getCurrentPageObj().find('#req_income_doc_reqAPR').parent().parent().hide();
	}
	//初始化附件列表
	initReqDetailFileList();
}

//初始化附件列表
function initReqDetailFileList(){
	
 //初始化需求信息附件列表
 var file_id = getCurrentPageObj().find("#file_id_reqAPR").val();
 var tablefile = getCurrentPageObj().find("#reqAPR_tablefile");
 getSvnFileList(tablefile,getCurrentPageObj().find("#reqAPR_fileview_modal"),file_id,"0101",function(){
	 appendAss_tablefile();
 });	
 
 
 //--------------------------
 //附件上传
 //var tablefile = getCurrentPageObj().find("#reqadd_filetable");
 var business_code = file_id; //赋值



 //点击打开模态框
 var addfile = getCurrentPageObj().find("#reqadd_file");
 addfile.click(function(){
	 var paramObj = new Object();
	 paramObj.FILE_DIR = business_code;
	//var req_id=getCurrentPageObj().find('#req_id_reqAdd').val();
	 openFileSvnUpload(getCurrentPageObj().find("#reqadd_modalfile"), tablefile, 'GZ1063',business_code, '0101', 'S_DIC_REQ_PUT_FILE', false,false, paramObj);
 });
 //附件删除
 var delete_file = getCurrentPageObj().find("#reqdelete_file");
 delete_file.click(function(){
	 delSvnFile(tablefile, business_code, "0101");
 });
 

//--------------------------
 
 
//初始化需求工作量评估信息附件列表
 /*var ass_file_id = getCurrentPageObj().find("#file_id_reqAssAPR").val();
 var ass_tablefile = getCurrentPageObj().find("#reqAssAPR_tablefile");
 getSvnFileList(ass_tablefile,getCurrentPageObj().find("#reqAprAss_fileview_modal"),ass_file_id,"0102");	*/
}

function appendAss_tablefile(){
	var tablefile = getCurrentPageObj().find("#reqAPR_tablefile");
	var ass_file_id = getCurrentPageObj().find("#file_id_reqAssAPR").val();
	baseAjax("sfile/queryFTPFileByBusinessCode.asp",{business_code:ass_file_id, phase:'0102'},function(data){
		tablefile.bootstrapTable("append",data);
	},false);
}


//初始化实施计划列表
function initReqApprovePlanList(){
	var req_id=getCurrentPageObj().find('#req_id_reqAPR').val();
	if(req_id==null||req_id==""){
		alert('实施计划获取需求id失败');
		return;
		
	}
	var queryParams = function(params) {
		var temp = {
			limit : params.limit, // 页面大小
			offset : params.offset
		// 页码
		};
		return temp;
	};
	var reqPlanCall = getMillisecond();
	$('#gReqPlanTable').bootstrapTable("destroy").bootstrapTable({
				url :dev_construction+"requirement_accept/queryReqPlanList.asp?SID="+SID+"&req_id="+req_id+"&call="+reqPlanCall,
				method : 'get', // 请求方式（*）
				striped : false, // 是否显示行间隔色
				cache : false, // 是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
				sortable : true, // 是否启用排序
				sortOrder : "asc", // 排序方式
				queryParams : queryParams,// 传递参数（*）
				sidePagination : "server", // 分页方式：client客户端分页，server服务端分页（*）
				pagination : true, // 是否显示分页（*）
				pageList : [ 5, 10, 15 ], // 可供选择的每页的行数（*）
				pageNumber : 1, // 初始化加载第一页，默认第一页
				pageSize : 10, // 每页的记录行数（*）
				clickToSelect : true, // 是否启用点击选中行
				// height: 460, //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
				uniqueId : "REQ_PLAN_ID", // 每一行的唯一标识，一般为主键列
				cardView : false, // 是否显示详细视图
				detailView : false, // 是否显示父子表
				jsonpCallback:reqPlanCall,
				singleSelect : true,// 复选框单选
				columns : [{
					field : 'REQ_PLAN_ID',
					title : '计划id',
					align : "center",
					visible:false,
				},{
					field : 'REQ_PLAN_NAME',
					title : '计划名称',
					align : "center",
				},{
					field : 'PLAN_STARTTIME',
					title : '计划开始时间',
					align : "center",
				}, {
					field : 'PLAN_ENDTIME',
					title : '计划结束时间',
					align : "center"
				}, {
					field : "PLAN_CONTENT",
					title : "备注",
					align : "center"
				}]
			});
}

function reqApproveOver(req_id,result){
    var approve_result=result;
    var param = new Object();
    //"req_name","fromBid","toBid","SID"
    param.system_name=getCurrentPageObj().find("#APRsystem_name").html();
    param.SID = SID;
    var fromBid1 = getCurrentPageObj().find("#file_id_reqAssAPR").val();
    var fromBid2 = getCurrentPageObj().find("#file_id_reqAPR").val(); 
    if(fromBid1=="" || fromBid2==""){
    	param.fromBid = fromBid1+fromBid2;
    } else {
    	param.fromBid = fromBid1+","+fromBid2;
    }
    param.toBid = getCurrentPageObj().find("#req_code_reqAPR").html();
    param.is_dic = true;
    /*******提醒参数*******/
    param.user_id = getCurrentPageObj().find("#APRreq_analysis1").text()+","+getCurrentPageObj().find("#req_product_manager").text()+","+getCurrentPageObj().find("#req_create_personAPR").text();
	param.b_code = getCurrentPageObj().find("#req_code_reqAPR").text();
	param.b_id = req_id;
	//param.remind_type="PUB2017143";
	if(approve_result=='01'){//01审批通过,02打回
		param.b_name =  getCurrentPageObj().find("#req_name_reqAPR").text()+"（编号："+param.b_code+"）需求审批通过";
		baseAjax("sfile/mvFTPFile.asp", param, function(result){
	    }, true);
	}else if(approve_result=='02'){
		param.b_name =  getCurrentPageObj().find("#req_name_reqAPR").text()+"（编号："+param.b_code+"）需求审批被打回";
	}
	var req_acc_classify=getCurrentPageObj().find('#req_acc_classifyAPR').val();//获取需求类型
    baseAjaxJsonp(dev_construction+"requirement_accept/reqApprove.asp?SID="+SID+"&req_id="+req_id+"&approve_result="+approve_result+"&req_acc_classify="+req_acc_classify, param , function(data) {
		if (data != undefined && data != null && data.result=="true") {
			alert("提交成功!", function(){
				closeCurrPageTab();
			});
		}else{
			alert("提交失败");
		}
	}); 
}

