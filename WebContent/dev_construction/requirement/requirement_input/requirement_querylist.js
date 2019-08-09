initRequirementListLayout1();
function refreshRequirementList(param1){

	
	var currTab = getCurrentPageObj();
	var queryForm = currTab.find("#requirementQueryTable");
	var table = currTab.find("#gRequirementInfoTable");
	var param = queryForm.serialize();
	table.bootstrapTable('refresh',{url:"requirement_input/queryalluser.asp?SID="+SID+
		"&call=jq_1535020283110_ap&" + param+param1});
	isRun_split="";
}


function initRequirementListLayout1(){
	var currTab = getCurrentPageObj();
	/*var currentLoginNoOrg_no = $("#currentLoginNoOrg_no").val();
	if(currentLoginNoOrg_no.substring(0,6)=="101017"){//机构编号为101017 科技信息中心 时放开紧急需求提出功能
		currTab.find("#emergentAdd").show();
	} else {
		currTab.find("#emergentAdd").hide();
	}*/
	
	var queryForm = currTab.find("#requirementQueryTable");
	var table = currTab.find("#gRequirementInfoTable");
	var reqQueryListCall="jq_1535020283110_ap";
	
	//初始化字典项
	autoInitSelect(queryForm);
	
	initRequirementListLayout();
	//初始化按钮
	function initRequirementListLayout() {
		
		//提出部门
		var org = currTab.find("#reqQuery_put_org_name");
		org.click(function(){
			$(".drop-ztree").hide();
			openSelectTreeDiv($(this),"reqQuery2_tree_id","SOrg/queryOrgTreeWithCenterList.asp",{"margin-top": "2px",width:"205px"},function(node){
				currTab.find("#reqQuery_put_org_name").val(node.name);
				currTab.find("#req_put_dept_reqquery").val(node.id);
				currTab.find("#reqQuery2_tree_id").hide();
			});
		});
		
		// 查询
		var query = currTab.find("#serach_reqQuery");
		query.click(function() {
			refreshRequirementList("");
		  });
		enterEventRegister(getCurrentPageObj().attr("class"), function(){query.click();});

		//重置
		var reset = currTab.find('#reset_reqQuery');
		reset.click(function() {
			queryForm[0].reset();
			currTab.find('#req_put_dept_reqquery').val("");//在非ie8的情况下reset()方法不能重置隐藏项
			currTab.find('#create_person_reqquery').val("");
			var selects = currTab.find("select");
			for(var i=0; i<selects.length; i++){
				$(selects[i]).select2();
			}
		});
		
		// 新增
		var add = currTab.find("#add");
		add.click(function() {
			closePageTab("addRequirement");
			closeAndOpenInnerPageTab("addRequirement","需求提出","dev_construction/requirement/requirement_input/requirement_add.html");
		});
		// 紧急需求提出新增
		var emergentAdd = currTab.find("#emergentAdd");
		emergentAdd.click(function() {
			closePageTab("emergentAddRequirement");
			closeAndOpenInnerPageTab("emergentAddRequirement","紧急需求提出","dev_construction/requirement/requirement_input/requirement_emergent_add.html",function(){
			initReqEmId();
			initRequirementEmAddBtn();
			initReqEmAddOrg();
			});
		});
		
		//维护
		var update = currTab.find("#update");
		update.click(function(){
			var id = table.bootstrapTable('getSelections');
			var p_owner=$.map(id, function (row) {return row.P_OWNER;});
			var ids=$.map(id, function (row) {return row.REQ_ID;});
			var req_state=$.map(id, function (row) {return row.REQ_STATE;});
			if(id.length==1){
				var is_emergency_req=id[0].IS_EMERGENCY_REQ;
				if(is_emergency_req!=undefined &&is_emergency_req!=null&&is_emergency_req=="00"){
					 if(p_owner!=SID){
							alert("您不是当前所选需求的当前责任人！");
							return;
					  }
						  closePageTab("updateRequirement_input");
						  closeAndOpenInnerPageTab("updateEmRequirement_input","紧急需求修改","dev_construction/requirement/requirement_input/requirement_emergent_add.html",function(){
							  initEmReqUpdateLayout(ids);
						});
					  
				}
				else{
			 if(p_owner!=SID){
					alert("您不是当前所选需求的当前责任人！");
					return;
			  }
			  if(req_state=="01"){
					  closePageTab("updateRequirement_input");
					  closeAndOpenInnerPageTab("updateRequirement_input","需求提出修改","dev_construction/requirement/requirement_input/requirement_update.html",function(){
						  initReqUpdateLayout(ids);
					}); 
			  }else if(req_state=='03'){
				  closePageTab("updateReqInput_return");
				  closeAndOpenInnerPageTab("updateReqInput_return","需求录入退回修改","dev_construction/requirement/requirement_input/reqInputReturn_update.html",function(){
					  initReqReturnLayout(ids);
				  });	
			  }else if(req_state=='16'){
				  closePageTab("updateReqInput_return");
					  closeAndOpenInnerPageTab("reqApproveReturn_return","需求审批退回修改","dev_construction/requirement/requirement_input/reqApproveReturn_update.html",function(){
						  initReqUpdateLayout(ids);
					  });	
			  }
			  }
			}else{
		        alert("请选择一条数据进行维护！");
			}
				
		});
		
		//删除
		currTab.find('#delete').click(function(){
			var id = $("#gRequirementInfoTable").bootstrapTable('getSelections');
			var REQ_CODE=$.map(id, function (row) {return row.REQ_CODE;});
			var REQ_STATE=$.map(id, function (row) {return row.REQ_STATE;});
			var req_name=$.map(id, function (row) {return row.req_name;});
			if(REQ_STATE!="01"&&REQ_CODE!=""){
				alert("该需求无法删除");
				return;
			}
			if(id.length==1){
			var ids=$.map(id, function (row) {return row.REQ_ID;});
			nconfirm("是否确定删除？",function(){
			baseAjaxJsonp("requirement_input/deleteRequirementInfo.asp?req_name"+req_name, null , function(data) {
			   if(data!=null&&data!=""&&data.result=="true"){
				   alert("删除成功!");
				   currTab.find('#gRequirementInfoTable').bootstrapTable('refresh');
			    }else{
				   alert("删除失败！");
			    }
			   });
			});
			}else{
				alert("请选择一条数据进行删除");
				return;
			}
		});
		//关闭
		currTab.find('#closes').click(function(){
			var id = $("#gRequirementInfoTable").bootstrapTable('getSelections');
			if(id.length==1){
				var a  = $("#gRequirementInfoTable").bootstrapTable('getSelections')[0].REQ_STATE;
				var REQ_CODE=$.map(id, function (row) {return row.REQ_CODE;});
				if(REQ_CODE==""){
					alert("该需求无法关闭");
					return;
				}
				
			var ids=$.map(id, function (row) {return row.REQ_ID;});
			nconfirm("是否确定关闭？",function(){
				if( a != "03"){
					alert("不是需求管理员退回的，不能关闭！");
				}else{
					baseAjaxJsonp(dev_construction+"requirement_input/closeRequirementInfo.asp?SID="+SID+"&req_id="+ids, null , function(data) {
						   if(data!=null&&data!=""&&data.result=="true"){
							   alert("关闭成功!");
							   currTab.find('#gRequirementInfoTable').bootstrapTable('refresh');
						    }else{
							   alert("关闭失败！");
						    }
						 });
				}
					
			});
			}else{
				alert("请选择一条数据进行关闭！");
				return;
			}
		});
		
		//提交受理
		currTab.find('#commit').click(function(){
			var id = currTab.find("#gRequirementInfoTable").bootstrapTable('getSelections');
			var ids=$.map(id, function (row) {return row.REQ_ID;});
			var is_emergency_req=id[0].IS_EMERGENCY_REQ;
			if(id.length==1){
				if(ids==null||ids==""){
					alert("提交失败：获取主键id失败");
					return;
				}
			 nconfirm("是否确定提交？",function(){	
				 if(is_emergency_req!=undefined&&is_emergency_req!=null&&is_emergency_req=="00"){
					 baseAjaxJsonp(dev_construction+"requirement_input/submitToAnalysis.asp?SID="+SID+"&req_id="+ids, null , function(data) {
						 if(data!=null&&data!=""&&data.result=="true"){
							alert("提交成功!");
							$('#gRequirementInfoTable').bootstrapTable('refresh');
						 }else{
							var mess=data.mess;
							alert("提交失败！"+""+mess);
						 }
						});
				 }
				 else{
			  baseAjaxJsonp(dev_construction+"requirement_input/submitToAccept.asp?SID="+SID+"&req_id="+ids, null , function(data) {
				 if(data!=null&&data!=""&&data.result=="true"){
					alert("提交成功!");
					$('#gRequirementInfoTable').bootstrapTable('refresh');
				 }else{
					var mess=data.mess;
					alert("提交失败！"+""+mess);
				 }
				});
				 }
			  });
			}else{
				alert("请选择一条需求进行提交");
			}
		});
		
		//查看详情
		currTab.find("#detail").click(function(){
			var id = currTab.find("#gRequirementInfoTable").bootstrapTable('getSelections');
			
			var ids=$.map(id, function (row) {return row.REQ_ID;});
			if(id.length==1){
				var is_emergency_req=id[0].IS_EMERGENCY_REQ;
			if(is_emergency_req!=undefined && is_emergency_req!=null&&is_emergency_req=="00"){
				
					closePageTab("EmRequirement_detail");
					closeAndOpenInnerPageTab("EmRequirement_detail","紧急需求详情","dev_construction/requirement/requirement_input/requirement_emergent_detail.html",function(){
						initEmReqDetailLayout(ids);
					});
				}
			else{
				closePageTab("Requirement_detail");
				closeAndOpenInnerPageTab("Requirement_detail","需求详情","dev_construction/requirement/requirement_input/req_detail.html",function(){
					initReqDetailLayout(ids);
				});
			}
			}else{
				
		        alert("请选择一条数据进行查看！");
			}
				
		});
  //需求提出人pop
 currTab.find("#create_person_name_reqquery").click(function(){
	 openUserPop("crp_reqquery",{name:currTab.find('#create_person_name_reqquery'),no:currTab.find('#create_person_reqquery')});
 });
}
	/**********************************/
	
	initReuirementQueryTable();
	try{
		if(isRun_split!="false"){
			getCurrentPageObj().find("#serach_reqQuery").click();
		}
	}catch(e){
		getCurrentPageObj().find("#serach_reqQuery").click();
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
			table.bootstrapTable("destroy").bootstrapTable({
						//url :"requirement_input/queryalluser.asp?SID="+SID+"&call="+reqQueryListCall,
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
						uniqueId : "REQ_NAME", // 每一行的唯一标识，一般为主键列
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
							visible:false
						},{
							field : 'req_name',
							title : '需求名称',
							align : "center",
							width : "13%"
						},{
							field : 'req_businesser',
							title : '业务联系人',
							align : "center",
							width : "19%"
						},/* {
							field : "REQ_TYPE1_DISPLAY",
							title : "需求大类",
							align : "center",
							width : "10%",
						},*/ {
							field : "req_business_phone",
							title : "业务联系电话",
							align : "center",
							width : "13%"
						}, {
							field : "req_put_dept",
							title : "提出部门",
							align : "center",
							width : "10%"
						}, /*{
							field : "REQ_ANALYTIC_RESULT",
							title : "退回结论说明",
							align : "center",
							width : "10%",
							formatter:function(value,row,index){
								if(value == undefined){value = '';}
								return value;
							}
						}, */{
							field : "req_dept",
							title : "主管部门",
							align : "center",
							width : "10%"
						},{
							field : "req_description",
							title : "需求描述",
							align : "center",
							width : "10%"
						}, {
							field : "req_operation_date",
							title : "要求投产日期",
							align : "center",
							width : "10%"
						}]
					});
		}
}