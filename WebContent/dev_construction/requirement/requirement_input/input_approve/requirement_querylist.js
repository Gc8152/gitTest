var reqQueryListCall=getMillisecond();
initRequirementListLayout();
initReuirementQueryTable();
initRequirementDicCode();
initReqPopOrgEvent();

//加载需求状态字典
function initRequirementDicCode(){
	initSelect(getCurrentPageObj().find("#req_type2_reqquery"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_REQUIREMENT_TYPE2"});	
}

//初始化按钮
function initRequirementListLayout() {
	// 查询
	getCurrentPageObj().find("#serach_reqQuery").click(function() {
		var req_put_dept = getCurrentPageObj().find("input[name=req_put_dept]").val();
		var req_dept = getCurrentPageObj().find("input[name=req_dept]").val();
		var req_type2 = getCurrentPageObj().find("select[name=req_type2]").val();
		var req_code = getCurrentPageObj().find("input[name=req_code]").val();
		var req_name = getCurrentPageObj().find("input[name=req_name]").val();
		var req_operation_date = getCurrentPageObj().find("input[name=req_operation_date]").val();
		var req_operation_date1 = getCurrentPageObj().find("input[name=req_operation_date1]").val();
		$('#gRequirementInfoTable').bootstrapTable('refresh',{
			url:dev_construction+"requirement_input/queryRequirementInfoList.asp?SID="+SID+'&req_name='+escape(encodeURIComponent(req_name))
			+'&req_code='+req_code+'&req_put_dept='+req_put_dept+'&req_dept='+req_dept+'&req_operation_date='+req_operation_date
			+'&req_type2='+req_type2+'&req_operation_date1='+req_operation_date1+"&call="+reqQueryListCall
		});
	});
	
	enterEventRegister(getCurrentPageObj().attr("class"), function(){getCurrentPageObj().find("#serach_reqQuery").click();});
	//重置
	getCurrentPageObj().find('#reset_reqQuery').click(function() {
		getCurrentPageObj().find('#req_put_dept_reqquery').val("");
		getCurrentPageObj().find('#req_name_reqquery').val("");
		getCurrentPageObj().find('#req_code_reqquery').val("");
		getCurrentPageObj().find('#req_type2_reqquery').val(" ");
		getCurrentPageObj().find('#req_type2_reqquery').select2();
		getCurrentPageObj().find('#req_dept_reqquery').val("");
		getCurrentPageObj().find('#req_operation_date_reqquery').val("");
		getCurrentPageObj().find('#req_operation_date1_reqquery').val("");
	});
	
	//需求提出审批
	getCurrentPageObj().find("#detail").click(function(){
		var id = getCurrentPageObj().find("#gRequirementInfoTable").bootstrapTable('getSelections');
		var ids=$.map(id, function (row) {return row.REQ_ID;});
		var ids=$.map(id, function (row) {return row.REQ_ID;});
		var req_state=$.map(id, function (row) {return row.REQ_STATE;});
		var approve_owner=$.map(id, function (row) {return row.CURR_ACTORNO;});
	/*	if(approve_owner!=SID){
			alert("你不是此需求的当前审批人");
			return;
		}*/
		if(req_state=="04"){			
			alert("该需求审批已经通过！");
			return;
		}
		if(req_state=="012"){			
			alert("该需求已被拒绝！");
			return;
		}
		var reqdetailCall=getMillisecond();
		if(id.length==1){
			closePageTab("reqInput_approve");
			closeAndOpenInnerPageTab("reqInput_approve","需求提出审批","dev_construction/requirement/requirement_input/input_approve/req_approve_detail.html",function(){
				baseAjaxJsonp(dev_construction+"requirement_input/queryRequirementInfoByID.asp?SID="+SID+"&req_id="+ids+"&call="+reqdetailCall, null , function(data) {
						for ( var k in data) {
							var str=data[k];
							k = k.toLowerCase();//大写转换为小写
					    if(k=="req_datatable_flag"||k=="req_level"||k=="req_income_flag"){
					    	getCurrentPageObj().find("input[name='RD."+k+"']"+"[value="+str+"]").attr("checked",true);
						}else if(k=="req_income_doc"){
							getCurrentPageObj().find("span[name='RD." + k + "']").text(str);
						}else if(k=="req_description"){	
							getCurrentPageObj().find("span[name='RD." + k + "']").text(str);
						}else{
							getCurrentPageObj().find("span[name='RD." + k + "']").text(str);
						}	
						}
						initReqDetailIncomeCss();//初始化需求收益评估样式
						initTitle(data["INSTANCE_ID"]);
						initAFApprovalInfo(data["INSTANCE_ID"]);
						
				},reqdetailCall);
				
				});
		}else{
			
	        alert("请选择一条数据进行查看！");
		}
			
	});
	
	//查看审批详情
	getCurrentPageObj().find("#view_aprdetail").click(function(){
		var id = getCurrentPageObj().find("#gRequirementInfoTable").bootstrapTable('getSelections');
		var ids=$.map(id, function (row) {return row.REQ_ID;});
		var reqdetailCall=getMillisecond();
		if(id.length==1){
			closePageTab("reqInput_approve_viewDetail");
			closeAndOpenInnerPageTab("reqInput_approve_viewDetail","需求提出审批详情","dev_construction/requirement/requirement_input/input_approve/req_approve_viewdetail.html",function(){
				baseAjaxJsonp(dev_construction+"requirement_input/queryRequirementInfoByID.asp?SID="+SID+"&req_id="+ids+"&call="+reqdetailCall, null , function(data) {
						for ( var k in data) {
							var str=data[k];
							k = k.toLowerCase();//大写转换为小写
					    if(k=="req_datatable_flag"||k=="req_level"||k=="req_income_flag"){
					    	getCurrentPageObj().find("input[name='RD."+k+"']"+"[value="+str+"]").attr("checked",true);
						}else if(k=="req_income_doc"){
							getCurrentPageObj().find("span[name='RD." + k + "']").text(str);
						}else if(k=="req_description"){	
							getCurrentPageObj().find("span[name='RD." + k + "']").text(str);
						}else{
							getCurrentPageObj().find("span[name='RD." + k + "']").text(str);
						}	
						}
						initReqDetailIncomeCss();//初始化需求收益评估样式
						initTitle(data["INSTANCE_ID"]);
						initReqInputAFApprovalDetailInfo(data["INSTANCE_ID"]);
						
				},reqdetailCall);
				
				});
		}else{
			
	        alert("请选择一条数据进行查看！");
		}
			
	});
}	

//加载部门
function initReqPopOrgEvent(){
	//主管部门
	getCurrentPageObj().find("#reqQuery_org_name").click(function(){
//			$("#reqQuery2_tree_id").hide();
			$(".drop-ztree").hide();
			openSelectTreeDiv($(this),"reqQuery_tree_id","SOrg/queryOrgTreeWithCenterList.asp",{"margin-top": "2px",width:"205px"},function(node){
				getCurrentPageObj().find("#reqQuery_org_name").val(node.name);
				getCurrentPageObj().find("#req_dept_reqquery").val(node.id);
				getCurrentPageObj().find("#reqQuery_tree_id").hide();
				
			});
		});
	getCurrentPageObj().find("#reqQuery_org_name").focus(function(){
			$("#reqQuery_org_name").click();
		});
		//提出部门
		$("#reqQuery_put_org_name").click(function(){
//			$("#reqQuery_tree_id").hide();
			$(".drop-ztree").hide();
			openSelectTreeDiv($(this),"reqQuery2_tree_id","SOrg/queryOrgTreeWithCenterList.asp",{"margin-top": "2px",width:"205px"},function(node){
				getCurrentPageObj().find("#reqQuery_put_org_name").val(node.name);
				getCurrentPageObj().find("#req_put_dept_reqquery").val(node.id);
				getCurrentPageObj().find("#reqQuery2_tree_id").hide();
				
			});
		});
		getCurrentPageObj().find("#reqQuery_put_org_name").focus(function(){
			getCurrentPageObj().find("#reqQuery_put_org_name").click();
		});
	}
//初始化列表
function initReuirementQueryTable() {
		var queryParams = function(params) {
			var temp = {
				limit : params.limit, // 页面大小
				offset : params.offset
			// 页码
			};
			return temp;
		};
		getCurrentPageObj().find('#gRequirementInfoTable').bootstrapTable("destroy").bootstrapTable({
					url :dev_construction+"requirement_input/queryReqApproveInfoList.asp?SID="+SID+"&call="+reqQueryListCall,
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
					uniqueId : "REQ_ID", // 每一行的唯一标识，一般为主键列
					cardView : false, // 是否显示详细视图
					detailView : false, // 是否显示父子表
					jsonpCallback:reqQueryListCall,
					singleSelect : true,// 复选框单选
					onLoadSuccess:function(data){
						gaveInfo();
					},
					columns : [ {
						checkbox : true,
						rowspan : 2,
						align : 'center',
						valign : 'middle'
					},{
						field : 'REQ_ID',
						title : '需求序列号',
						align : "center",
						visible:false,
					},{
						field : 'REQ_NAME',
						title : '需求名称',
						align : "center",
					}, {
						field : "REQ_TYPE2_DISPLAY",
						title : "需求类型",
						align : "center"
					}, {
						field : "REQ_STATE_DISPLAY",
						title : "需求状态",
						align : "center"
					}, {
						field : "REQ_PUT_DEPT_DISPLAY",
						title : "提出部门",
						align : "center"
					}, {
						field : "REQ_DEPT_DISPLAY",
						title : "主管部门",
						align : "center",
						//formatter:function(value,row,index){if(value=="00"){return "是";}return "否";}
					}, {
						field : "REQ_OPERATION_DATE",
						title : "要求投产日期",
						align : "center",
						//formatter:function(value,row,index){if(value=="00"){return "是";}return "否";}
					},{
						field : "CURR_ACTORNO_NAME",
						title : "当前审批人",
						align : "center",
						//formatter:function(value,row,index){if(value=="00"){return "是";}return "否";}	
					}, {
						field : "P_OWNER_NAME",
						title : "当前责任人",
						align : "center",
						//formatter:function(value,row,index){if(value=="00"){return "是";}return "否";}	
					}, {
						field : "CREATE_TIME",
						title : "录入时间",
						align : "center",
						//formatter:function(value,row,index){if(value=="01"){return "未上线";}else if(value=="02"){return "已上线";}else if(value=="03"){return "待下线";}else{return "已下线";}}
					}]
				});
	}

