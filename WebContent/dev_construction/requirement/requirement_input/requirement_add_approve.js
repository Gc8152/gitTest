
initRequirementAddApproveBtn();
//初始化页面信息
function initReqAprInfor(ids){
	var reqAprCall=getMillisecond()+1;
	baseAjaxJsonp(dev_construction+"requirement_input/queryReqAddApprovetList.asp?SID="+SID+"&req_state=15&req_id="+ids+"&call="+reqAprCall, null , function(data) {
			var map=data.rows[0];
			for(var k in map){
				var str=map[k];
				k = k.toLowerCase();//大写转换为小写
				if(k=="req_level"){
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
			    }else if(k=="req_id"){
			    	getCurrentPageObj().find('#req_id_reqAPR').val(str);
 				}else if(k=="create_person"){
			    	getCurrentPageObj().find('#req_create_personAPR').val(str);
			    }else if(k=="file_id"){
			    	getCurrentPageObj().find('#file_id_reqAPR').val(str);
			    	}else if(k=="assfile_id"){
			    	getCurrentPageObj().find('#file_id_reqAssAPR').val(str);
				}else{
					$("span[name='APR."+k+"']").text(str);
				}
			     }
				   var i=map["INSTANCE_ID"];
				 //初始化流程数据
					initTitle(map["INSTANCE_ID"]);
					initAddAFApprovalInfo(map["INSTANCE_ID"]);
		initReqDetailFileList();//初始化附件信息列表
	},reqAprCall);
	
}

//初始化按钮
function initRequirementAddApproveBtn(){
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

//初始化附件列表
function initReqDetailFileList(){
 //初始化需求信息附件列表
 var file_id = getCurrentPageObj().find("#file_id_reqAPR").val();
 var tablefile = getCurrentPageObj().find("#reqAPR_tablefile");
 getSvnFileList(tablefile,getCurrentPageObj().find("#reqAPR_fileview_modal"),file_id,"0101",function(){
	 appendAss_tablefile();
 });	
 }

function appendAss_tablefile(){
	var tablefile = getCurrentPageObj().find("#reqAPR_tablefile");
	var ass_file_id = getCurrentPageObj().find("#file_id_reqAssAPR").val();
	baseAjax("sfile/queryFTPFileByBusinessCode.asp",{business_code:ass_file_id, phase:'0102'},function(data){
		tablefile.bootstrapTable("append",data);
	},false);
}


//审批回掉函数
getCurrentPageObj()[0].call_func=function proj_func(result,mark,biz_id,msg){
	
	if(mark=='over'){//审批通过
		//alert("审批通过");
		reqAddApproveOver(biz_id,"01"); //业务id
	}else if(mark=='reject'){
		reqAddApproveOver(biz_id,"02");//审批打回
	}else{
		alert(msg);
	}
};
function reqAddApproveOver(biz_id,result){
	//防止与其他审批流程冲突，biz_id='ap'+req_id
    var approve_result=result;
    var param = new Object();
    var req_id=biz_id.substring(2);
    var powner='';
/*    param.SID = SID;
    param.is_dic = true;
    *//*******提醒参数*******//*
    param.user_id = getCurrentPageObj().find("#req_create_personAPR").val();
	param.biz_id = biz_id;
	param.req_id = req_id;
	if(approve_result=='01'){//01审批通过,02打回
		param.b_name =  getCurrentPageObj().find("#req_name_reqAPR").text()+"（ID："+req_id+"）需求审批通过";
	}else*/ if(approve_result=='02'){
		//param.b_name =  getCurrentPageObj().find("#req_name_reqAPR").text()+"（ID："+req_id+"）需求审批被打回";
		powner= getCurrentPageObj().find("#req_create_personAPR").val();
	}
    baseAjaxJsonp(dev_construction+"requirement_input/reqAddApprove.asp?SID="+SID+"&req_id="+req_id+"&approve_result="+approve_result+"&powner="+powner, param , function(data) {
		if (data != undefined && data != null && data.result=="true") {
			alert("提交成功!", function(){
				closeCurrPageTab();
			});
		}else{
			alert("提交失败");
		}
	}); 
}


/**
 * 审批列表表格初始化列表
 * @param instance_id
 * @returns
 */
function initAddAFApprovalInfo(instance_id,type) {
	this.instance_id=instance_id;
	initcontentPop();
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	getCurrentPageObj().find('#AFApprovalTableInfo').bootstrapTable({
		url :'AFLaunch/queryAFApprovalLists.asp?instance_id='+instance_id+"&call="+tableCall,
		method : 'get', //请求方式（*）   
		striped : true, //是否显示行间隔色
		cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
		sortable : true, //是否启用排序
		sortOrder : "asc", //排序方式
		queryParams : queryParams,//传递参数（*）
		sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
		pagination : false, //是否显示分页（*）
		pageList : [5,10],//每页的记录行数（*）
		pageNumber : 1, //初始化加载第一页，默认第一页
		pageSize : 10,//可供选择的每页的行数（*）
		clickToSelect : false, //是否启用点击选中行
		uniqueId : "af_id", //每一行的唯一标识，一般为主键列
		cardView : false, //是否显示详细视图
		detailView : false, //是否显示父子表
		jsonpCallback:tableCall,
		singleSelect: true,
		onLoadSuccess:function (){
			setRowspan("AFApprovalTableInfo");
			gaveInfo();
		},
		columns : [{
			field : 'N_ID',
			title : '审批节点id',
			align : "center",
			visible:false
		},{
			field : 'N_NAME',
			title : '审批岗位',
			align : "center",
			valign: "middle"
		}, {
			field : "APP_PERSON",
			title : "工号",
			align : "center",
			visible:false
		}, {
			field : "APP_PERSON_NAME",
			title : "审批人",
			align : "center",
	        width : "30px"
		}, {
			field : "APP_STATE",
			title : "操作",
			align : "center",
			formatter:function(value,row,index){
			  var curr_actorno = row.CURR_ACTORNO;
        	  if(row.STATE_NAME){
        		  return row.STATE_NAME;
        	  }else if(type=='0'){
        		  return '--';
        	  }else if(curr_actorno!=null&&curr_actorno!=undefined){
        		  var userid = $("#currentLoginNo").val();
        		  var str = curr_actorno.split(",");
        		  var flag = false;
        		  $.each(str,function(i){
        			  if(userid==str[i]){
        				  flag=true;
        			  }
        		  })
        		  if("apping" == row.APPING && userid == row.APP_PERSON && flag){
	        			return '<span style="color:#0088cc;cursor: pointer;" onclick="approvalAdd(\'00\','+row.N_ID+');" class=pass>批准</span> '+
	        			'| <span style="color:#0088cc;cursor: pointer;" onclick="approvalAdd(\'01\','+row.N_ID+');" class=reject>拒绝</span>';
        		  }else{
        			  return '--';
        		  }
        	  }
        	  return '--';
          },
     
		}, {
			field : "APP_CONTENT",
			title : "审批意见",
			align : "center"
		}, {
			field : "OPT_TIME",
			title : "审批时间",
			align : "center"
		}]
	});
}

/**
 * 批准/拒绝
 * @param state
 * @param n_id 发起人拿回时此参数可以为空
 * @param instance_id1
 */
function approvalAdd(state,n_id,instance_id1){
	getCurrentPageObj().find('#approvalPop').remove();
	getCurrentPageObj().find('#appOptPop').empty();
	getCurrentPageObj().find("#appOptPop").load("dev_construction/requirement/requirement_input/approval_content.html",{},function(){
		getCurrentPageObj().find("#approvalPop").modal("show");
		getCurrentPageObj().find("#n_id").val(n_id);
		/*if(state=='02'){
			getCurrentPageObj().find("#instance_id").val(instance_id1);
		}else{*/
			getCurrentPageObj().find("#instance_id").val(instance_id);
	//	}
		var stateName=(state=='00'?'批准':state=='01'?'拒绝':state=='02'?'撤回':'委托');
		initVlidate(getCurrentPageObj().find("#approvalFlowAuditForm"));
		//显示审批处理模态框
		getCurrentPageObj().find("#approvalPop").modal("show");
		if(state!="03"){
			getCurrentPageObj().find("#userSelect").attr("style","display: none");
			if(state=="00")
				initNextPerson(instance_id);
		}else{
			getCurrentPageObj().find("#userSelect").removeAttr("style");
			initUserPop();
			initUserSelect();
		}
		if(state!='01'){
			getCurrentPageObj().find("#dahui").css("display","none");
		}else{
			getCurrentPageObj().find("#dahui").css("display","block");
		}
		//审批意见初始化
		getCurrentPageObj().find("#auditTitle").html(state=='02'?'撤回':state=='03'?'委托':'审批');
		getCurrentPageObj().find("#auditStateName").html(state=='02'?'请填写撤回理由：':state=='03'?'请填写委托理由：':'请填写操作为【<font size=\'4px\'>'+stateName+'</font>】的审批意见：');
		//审批意见
		getCurrentPageObj().find("#auditState").val(state);
		//提交审批意见动作
		getCurrentPageObj().find("#doApprovalSubmitAction").click(function(){
			var state=getCurrentPageObj().find("#auditState").val();
			var contentObj=getCurrentPageObj().find("#auditContent");
		    if(state!="00"&&contentObj.val().length>250){
		    	alert("审批意见至多可输入250汉字！");
		    	return;
		    }
		    if(state=="00"){
		    	contentObj.removeAttr("validate");
		    }else{
		    	contentObj.attr("validate","v.required");
		    }
			doApprovalSubmit((getCurrentPageObj()[0].call_func||call_func));
		});
		//取消审批意见动作
		getCurrentPageObj().find("#doApprovalCancelAction").click(function(){
			reSetForm('approvalFlowAuditForm');
			getCurrentPageObj().find('#approvalPop').modal('hide');
			getCurrentPageObj().find("#historyPop").modal("hide");
		});
	});
}