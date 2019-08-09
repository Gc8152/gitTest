
initRequirementAssessBtn();
//加载需求拆分页面信息
function initSplitReqInformationLayOut(ids){
	var reqAnaCall=getMillisecond();
	baseAjaxJsonp(dev_construction+"requirement_splitreq/querySplitSubReqPageById.asp?SID="+SID+"&req_id="+ids+"&call="+reqAnaCall, null , function(data) {
		for ( var f in data) {
			var map=data[f];
		   if(f=="1"||f=="2"){
		     for(var k in map){
				var str=map[k];
				k = k.toLowerCase();//大写转换为小写
		    if(k=="req_dis_result"||k=="req_acc_result"){
		    	getCurrentPageObj().find("input[name='SP."+k+"']"+"[value="+str+"]").attr("checked",true);
		    }else if(k=="req_level"){
		    	//autoInitRadio({dic_code:"G_DIC_REQUIREMENT_LEVEL"},getCurrentPageObj().find("#req_level_reqSP"),"SP.req_level",{labClass:"ecitic-radio-inline",value:str});
		    	baseAjax("SDic/findItemByDic.asp",{dic_code:"G_DIC_REQUIREMENT_LEVEL"},function(data){
		    		if(data!=undefined){
		    			for(var i=0;i<data.length;i++){
		    				if(data[i].ITEM_CODE==str){
	    						getCurrentPageObj().find("#req_level_reqSP").append("<label class='ecitic-radio-inline'><input type='radio' name='SP.req_level'  value="+data[i].ITEM_CODE+" checked disabled/>&nbsp;"+data[i].ITEM_NAME+"</label>");
	    					}else{
	    						getCurrentPageObj().find("#req_level_reqSP").append("<label class='ecitic-radio-inline'><input type='radio' name='SP.req_level'  value="+data[i].ITEM_CODE+" disabled/>&nbsp;"+data[i].ITEM_NAME+"</label>");
	    					}					
		    			}
		    		}
		    	},false);
		    }else if(k=="req_feasibility_result"){
		    	//autoInitRadio({dic_code:"G_DIC_REQ_FEASIBILITY"},getCurrentPageObj().find("#sp_req_feasibility_result"),"SP.req_feasibility_result",{labClass:"ecitic-radio-inline",value:str});
		    	baseAjax("SDic/findItemByDic.asp",{dic_code:"G_DIC_REQ_FEASIBILITY"},function(data){
		    		if(data!=undefined){
		    			for(var i=0;i<data.length;i++){
		    				if(data[i].ITEM_CODE==str){
	    						getCurrentPageObj().find("#sp_req_feasibility_result").append("<label class='ecitic-radio-inline'><input type='radio' name='SP.req_feasibility_result'  value="+data[i].ITEM_CODE+" checked disabled/>&nbsp;"+data[i].ITEM_NAME+"</label>");
	    					}else{
	    						getCurrentPageObj().find("#sp_req_feasibility_result").append("<label class='ecitic-radio-inline'><input type='radio' name='SP.req_feasibility_result'  value="+data[i].ITEM_CODE+" disabled/>&nbsp;"+data[i].ITEM_NAME+"</label>");
	    					}					
		    			}
		    		}
		    	},false);
			}else if(k=="req_income_doc"){
				getCurrentPageObj().find("#req_income_doc_reqSP").val(str);
			}else if(k=="req_description"){
				getCurrentPageObj().find("#req_description_reqSP").val(str);
			}else if(k=="req_dis_view"){
				getCurrentPageObj().find("#req_dis_viewSP").val(str);
			/*}else if(k=="req_scheme"){
				getCurrentPageObj().find("#SPreq_scheme").val(str);*/
			}else if(k=="req_type1"){
				if(str=='02'){
					getCurrentPageObj().find('#business_org_hide').hide();
					getCurrentPageObj().find('#SPproject_id_display').hide();
				}
			}else if(k=="req_analytic_result"){
				getCurrentPageObj().find("#SPreq_analytic_result").val(str);
			}else if(k=="put_dept_opinion"){
				getCurrentPageObj().find("#put_dept_opinion_reqSP").val(str);
			}else if(k=="req_id"){
				getCurrentPageObj().find("#req_id_reqSP").val(str);
			}else if(k=="file_id"){
		    	 getCurrentPageObj().find('#file_id_reqSP').val(str);
		    }else if(k=="file_id_assess"){
		    	 getCurrentPageObj().find('#SPAssfile_id').val(str);
			/*}else if(k=="req_assess_level"){
				var num=str.split(",");
				for(var i=0;i<num.length;i++){
					getCurrentPageObj().find("input[name='SP."+k+"']"+"[value="+num[i]+"]").attr("checked",true);
				}
			}else if(k=="req_type1"&&str=="02"){
	    	 	getCurrentPageObj().find('#hiddenStyle').hide();
	    	 	getCurrentPageObj().find('#hiddenStyle1').hide();*/
	    	}else{
				getCurrentPageObj().find("span[name='SP."+k+"']").text(str);
			}
		    }
		    }
		    }
		initReqSubList();//初始化子需求列表
		initReqPlanList();//初始化需求实施计划列表
		initSpReqIncomeCss();//初始化收益评估样式
	},reqAnaCall);
	
}

//初始化按钮
function initRequirementAssessBtn(){
	//提交并保存
	$('#summitForSplitTask').click(function(){
		    var req_id=getCurrentPageObj().find('#req_id_reqSP').val();
		    var sub_req_state="02";
		     baseAjaxJsonp(dev_construction+"requirement_splitreq/updateSubReqState.asp?SID="+SID+"&req_id="+req_id+"&sub_req_state="+sub_req_state, null , function(data) {
				if (data != undefined && data != null && data.result=="true") {
							alert("提交成功!", function(){
								closeCurrPageTab();
							});
						}else{
							var mess=data.mess;
							if(mess!=null&&mess!=undefined){
								alert("提交失败:"+mess);
							}else{
							  alert("提交失败");
							}
						}
					});   
	          });
	
//新增子需求
 $('#requirementSub_add').click(function(){
	 openReqSubPop("SubReqPop","add",null);//传入调用pop框的div的id,操作类型，子需求编号
 });
 
}

//初始化子需求列表
function initReqSubList(){
	var req_id=getCurrentPageObj().find('#req_id_reqSP').val();
	if(req_id==null||req_id==""){
		alert("子需求列表获取需求id失败");
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
	var reqSubCall = getMillisecond();
	getCurrentPageObj().find('#gRequirementSub').bootstrapTable("destroy").bootstrapTable({
				url :dev_construction+"requirement_splitreq/queryReqSubList.asp?SID="+SID+"&req_id="+req_id+"&call="+reqSubCall,
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
				uniqueId : "SUB_REQ_CODE", // 每一行的唯一标识，一般为主键列
				cardView : false, // 是否显示详细视图
				detailView : false, // 是否显示父子表
				jsonpCallback:reqSubCall,
				singleSelect : true,// 复选框单选
				columns : [{
					field : 'SUB_REQ_CODE',
					title : '需求点编号',
					align : "center",
				},{
					field : 'SUB_REQ_NAME',
					title : '需求点名称',
					align : "center",
				},{
					field : 'SUB_REQ_STATE_DISPLAY',
					title : '需求点状态',
					align : "center",
				},{
					field : 'PLAN_ONLINETIME',
					title : '计划投产时间',
					align : "center",
				},{
					field : 'SUB_REQ_CONTENT',
					title : '需求点描述',
					align : "center",
				}, {
					field : 'SUB_REQ_CODE',
					title : "操作",
					align : "center",
				    formatter : function(value,row){
				    	     if(value!=null && row.SUB_REQ_STATE_DISPLAY !="关闭"){
				   
								return "<a href='#' onclick='updateReqSub(" + JSON.stringify(value) + ")' style="+'"color:blue"'+">修改</a>" +"&nbsp;&nbsp;"+
									   "<a href='#' onclick='deleteReqSub(" + JSON.stringify(value) + ")' style="+'"color:blue"'+">删除</a>";
				    	
				    	   }	
						   }	
				           }]
			     });
 }


//修改子需求
function updateReqSub(sub_req_code){
	openReqSubPop("SubReqPop","update",sub_req_code);
	
}

//删除子需求
function deleteReqSub(sub_req_code){
	nconfirm("确定删除吗？", function() {
		baseAjaxJsonp(dev_construction+"requirement_splitreq/deleteReqSub.asp?SID="+SID+"&sub_req_code="+sub_req_code, null , function(data) {
			if (data != undefined && data != null && data.result=="true") {
				alert("删除成功");
				$('#gRequirementSub').bootstrapTable('refresh');
			}else{
				var mess=data.mess;
				alert("删除失败："+mess);
			}
		});
	});
}

//初始化需求评估样式
function initSpReqIncomeCss(){
	/*var req_income_flag=getCurrentPageObj().find('input:radio[name="SP.req_income_flag"]:checked').val();
	if(req_income_flag=="01"){//需求收益评估为否时隐藏需求收益估算和理由
		getCurrentPageObj().find('#req_income_sp').parent().hide();
		getCurrentPageObj().find('#req_income_reqSP').parent().hide();
		getCurrentPageObj().find('#req_remark_sp').parent().hide();
		getCurrentPageObj().find('#req_income_doc_reqSP').parent().parent().hide();
	}*/
	getCurrentPageObj().find('input:radio[name="SP.req_feasibility_result"]').attr("disabled");//设置可行性结论不可点击
	initReqDetailFileList();//初始化附件列表
}

//初始化附件列表
function initReqDetailFileList(){
 //初始化需求信息附件列表
 var business_code = getCurrentPageObj().find("#req_code_reqSP").text();
 var tablefile = getCurrentPageObj().find("#reqSP_tablefile");
 getSvnFileList(tablefile,getCurrentPageObj().find("#reqSP_fileview_modal"), business_code, "0101",function(){
	 appendAssTable(tablefile,business_code);
 });
 //初始化需求评估信息附件列表
 //var ass_file_id = getCurrentPageObj().find("#SPAssfile_id").val();
 /*var ass_tablefile = getCurrentPageObj().find("#reqAssSP_tablefile");
 getSvnFileList(ass_tablefile, getCurrentPageObj().find("#reqAssSP_fileview_modal"), business_code, "0102");*/
}
function appendAssTable(tablefile,business_code){
	baseAjax("sfile/queryFTPFileByBusinessCode.asp",{business_code:business_code, phase:'0102'},function(data){
		tablefile.bootstrapTable("append",data);
	},false);
}

//初始化实施计划列表
function initReqPlanList(){
	var req_id=getCurrentPageObj().find('#req_id_reqSP').val();
	if(req_id==null||req_id==""){
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
	getCurrentPageObj().find('#gReqPlanTable').bootstrapTable("destroy").bootstrapTable({
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


