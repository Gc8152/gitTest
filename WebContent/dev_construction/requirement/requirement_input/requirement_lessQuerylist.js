;initRequirementListLayout1();
function initRequirementListLayout1(){
	var currTab = getCurrentPageObj();
	var queryForm = currTab.find("#requirementQueryTable");
	var table = currTab.find("#gRequirementInfoTable");
	var reqQueryListCall=getMillisecond();
	
	//初始化字典项
	autoInitSelect(queryForm);
	
	initRequirementListLayout();
	//初始化按钮
	function initRequirementListLayout() {
		
		//提出部门
		var org = currTab.find("#reqQuery_put_org_name");
		org.click(function(){
			$(".drop-ztree").hide();
			openSelectTreeDiv($(this),"reqQuery2_tree_id","SOrg/queryorgtreelist.asp",{"margin-top": "2px",width:"205px"},function(node){
				currTab.find("#reqQuery_put_org_name").val(node.name);
				currTab.find("#req_put_dept_reqquery").val(node.id);
				currTab.find("#reqQuery2_tree_id").hide();
			});
		});
		
		// 查询
		var query = currTab.find("#serach_reqQuery");
		query.click(function() {
			var param = queryForm.serialize();
			table.bootstrapTable('refresh',{url:dev_construction+"requirement_input/queryLessRequirementInfoList.asp?SID="+SID+
				"&call="+reqQueryListCall + "&" + param});
		  });
		enterEventRegister(getCurrentPageObj().attr("class"), function(){getCurrentPageObj().find("#serach_reqQuery").click();});
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
				var code=id[0].REQ_CODE;
				if(code!=undefined &&code!=null){
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
			  }
			  }
			}else{
		        alert("请选择一条数据进行维护！");
			}
				
		});
		
		//删除
		currTab.find('#delete').click(function(){
			var id = $("#gRequirementInfoTable").bootstrapTable('getSelections');
			if(id.length==1){
			var ids=$.map(id, function (row) {return row.REQ_ID;});
			nconfirm("是否确定删除？",function(){
			baseAjaxJsonp(dev_construction+"requirement_input/deleteRequirementInfo.asp?SID="+SID+"&req_id="+ids, null , function(data) {
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
		
		//提交受理
		currTab.find('#commit').click(function(){
			var id = currTab.find("#gRequirementInfoTable").bootstrapTable('getSelections');
			var ids=$.map(id, function (row) {return row.REQ_ID;});
			var code=id[0].REQ_CODE;
			if(id.length==1){
				if(ids==null||ids==""){
					alert("提交失败：获取主键id失败");
					return;
				}
			 nconfirm("是否确定提交？",function(){	
				 if(code!=undefined&&code!=null){
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
				var code=id[0].REQ_CODE;
			if(code!=undefined && code!=null){
				
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
						url :dev_construction+"requirement_input/queryLessRequirementInfoList.asp?SID="+SID+"&call="+reqQueryListCall,
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
							visible:false
						},{
							field : 'REQ_CODE',
							title : '需求编号',
							align : "center",
							width : "13%"
						},{
							field : 'REQ_NAME',
							title : '需求名称',
							align : "center",
							width : "19%"
						},/* {
							field : "REQ_TYPE1_DISPLAY",
							title : "需求大类",
							align : "center",
							width : "10%",
						},*/ {
							field : "REQ_STATE_DISPLAY",
							title : "需求状态",
							align : "center",
							width : "13%"
						}, {
							field : "REQ_PUT_DEPT_DISPLAY",
							title : "提出部门",
							align : "center",
							width : "10%"
						}, {
							field : "REQ_ANALYTIC_RESULT",
							title : "退回结论说明",
							align : "center",
							width : "10%",
							formatter:function(value,row,index){
								if(value == undefined){value = '';}
								return value;
							}
						}, {
							field : "CREATE_PERSON_NAME",
							title : "需求提出人",
							align : "center",
							width : "10%"
						},{
							field : "P_OWNER_NAME",
							title : "当前责任人",
							align : "center",
							width : "10%"
						}, {
							field : "CREATE_TIME",
							title : "录入时间",
							align : "center",
							width : "10%"
						}]
					});
		}
}