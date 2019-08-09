
initReqAssessListLayout();
function initReqAssessListLayout() {
	
	var currTab= getCurrentPageObj();
	var queryForm = currTab.find("#ReqAccQueryForm");
	var table = currTab.find("#gReqForAssessTable");
	var reqAssQueryListCall=getMillisecond();
	
  //初始化字典
  autoInitSelect(queryForm);
  
 //初始化按钮  
 initReqAssessListBtn(); 
 function initReqAssessListBtn(){
  //提出部门
  currTab.find("#reqAssessQuery_put_org_code").click(function(){
	        currTab.find(".drop-ztree").hide();
			openSelectTreeDiv($(this),"reqAssessQuery2_tree_id","SOrg/queryOrgTreeWithCenterList.asp",{"margin-top": "2px",width:"185px"},function(node){
				currTab.find("#reqAssessQuery_put_org_code").val(node.name);
				currTab.find("#req_put_dept_reqAssessQuery").val(node.id);
				currTab.find("#reqAssessQuery2_tree_id").hide();
			});
		});
  	//查询
	 currTab.find("#serach_reqAssessQuery").click(function() {
		var param = queryForm.serialize();
		table.bootstrapTable('refresh',{
			url:dev_construction+"requirement_accept/queryRequirementInfoForAcceptList.asp?SID="+SID+
			"&call="+reqAssQueryListCall+"&menu=req_assess"+"&"+param});
	
	});
	 enterEventRegister(getCurrentPageObj().attr("class"), function(){getCurrentPageObj().find("#serach_reqAssessQuery").click();});

	//重置
	 
	 currTab.find('#reset_reqAssessQuery').click(function() {
			queryForm[0].reset();
			currTab.find('#req_put_dept_reqAssessQuery').val("");//非ie8下reset()方法不能清除隐藏项的值
			currTab.find('#create_person_reqAssessQuery').val("");
			var selects = currTab.find("select");
			for(var i=0; i<selects.length; i++){
				$(selects[i]).select2();
	 
			}
	});
	
	//需求评估
	getCurrentPageObj().find("#requirement_assess").click(function(){
		var id = getCurrentPageObj().find("#gReqForAssessTable").bootstrapTable('getSelections');
		var ids=$.map(id, function (row) {return row.REQ_ID;});
		var p_owner=$.map(id, function (row) {return row.P_OWNER;});
		var req_acc_classify=$.map(id, function (row) {return row.REQ_ACC_CLASSIFY;});
		if(id.length==1){
		if(p_owner!=SID){
			alert("你不是此需求的当前责任人，无法评估");
			return;
		}
		if(req_acc_classify=='00'){
			closeAndOpenInnerPageTab("requirement_assess","紧急需求评估","dev_construction/requirement/requirement_accept/emRequiremnetAnalysis_analysis.html",function(){
				initEmReqAnalysisLayout(ids);
				initRequirementEmAddBtn();
			});
		}
		else{
			var req_state=$.map(id, function (row) {return row.REQ_STATE;});
			if(req_state=='04'||req_state=='06'||req_state=='09'){//产品经理待评估，审批退回和转交状态可评估
			closeAndOpenInnerPageTab("requirement_assess","需求评估","dev_construction/requirement/requirement_accept/requirement_assess.html",function(){
				initReqAssessDicCode(req_state);
				initReqAssessLayOut(ids,req_state);
				});
			}else{
				 alert("当前需求状态不是评估环节！");
			}}
		}else{
			
	        alert("请选择一条数据进行评估！");
		}
	});
	//紧急需求分析
	getCurrentPageObj().find("#emRequirement_analysis").click(function(){
		var id = getCurrentPageObj().find("#gReqForAssessTable").bootstrapTable('getSelections');
		var ids=$.map(id, function (row) {return row.REQ_ID;});
		var p_owner=$.map(id, function (row) {return row.P_OWNER;});
		var req_acc_classify=$.map(id, function (row) {return row.REQ_ACC_CLASSIFY;});
		var req_state=$.map(id, function (row) {return row.REQ_STATE;});
		if(id.length==1){
		if(p_owner!=SID){
			alert("你不是此需求的当前责任人，无法评估");
			return;
		}
		if(req_acc_classify!='00'){
			alert("当前需求不是紧急需求不能进行紧急需求评估");
			return;
		}	
		closeAndOpenInnerPageTab("enrequirement_analysis","紧急需求评估","dev_construction/requirement/requirement_accept/emRequiremnetAnalysis_analysis.html",function(){
			if(req_state=="09"){
				$("#closes_req").show(); 
			}
			initEmReqAnalysisLayout(ids);
			initRequirementEmAddBtn();
		});
			
		}else{
			
	        alert("请选择一条数据进行评估！");
		}
			
	});
	
	//需求提出人pop
	currTab.find("#create_person_name_reqAssessQuery").click(function() {
		openUserPop("crp_accQuery",{name:currTab.find('#create_person_name_reqAssessQuery'),no:currTab.find('#create_person_reqAssessQuery')});
	});
}	


 //初始化列表
 initReqAssessQueryTable();
 function initReqAssessQueryTable() {
		var queryParams = function(params) {
			var temp = {
				limit : params.limit, // 页面大小
				offset : params.offset
			// 页码
			};
			return temp;
		};
		getCurrentPageObj().find('#gReqForAssessTable').bootstrapTable("destroy").bootstrapTable({
					url :dev_construction+"requirement_accept/queryRequirementInfoForAcceptList.asp?SID="+SID+"&call="+reqAssQueryListCall+"&menu=req_assess",
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
					uniqueId : "REQ_CODE", // 每一行的唯一标识，一般为主键列
					cardView : false, // 是否显示详细视图
					detailView : false, // 是否显示父子表
					jsonpCallback:reqAssQueryListCall,
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
						field : 'REQ_CODE',
						title : '需求编号',
						align : "center",
						width : "13%"
					},{
						field : 'REQ_NAME',
						title : '需求名称',
						align : "center",
						width : "18%",
					},{
						field : "REQ_ACC_CLASSIFY_DISPLAY",
						title : "需求分类",
						align : "center",
						width : "9%",
						formatter:function(value,row,index){
							if(row.REQ_ACC_CLASSIFY=="00"){
								return '<span style="color:red;">'+value+'</span>';
							}else{
								return value;
							}
						}
					},{
						field : "REQ_STATE_DISPLAY",
						title : "需求状态",
						align : "center",
						width : "9%",
					},{
						field : "REQ_SCORE_DISPLAY",
						title : "需求优先级",
						align : "center",
						width : "9%",
					},{	
						field : "REQ_PUT_DEPT_DISPLAY",
						title : "提出部门",
						align : "center",
						width : "9%",
					},{
						field : "CREATE_PERSON_NAME",
						title : "需求提出人",
						align : "center",
						width : "8%",
					},{
						field : "REQ_OPERATION_DATE",
						title : "要求投产日期",
						align : "center",
						width : "9%",
					},{	
						field : "P_OWNER_NAME",
						title : "当前责任人",
						align : "center",
						width : "8%",
					},{	
						field : "OLD_REQ_CODE",
						title : "存量需求编号",
						align : "center",
						width : "8%",
						visible:false
					}]
				});
	}
}	
