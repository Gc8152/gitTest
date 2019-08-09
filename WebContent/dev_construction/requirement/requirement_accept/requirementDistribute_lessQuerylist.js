function initRequirementListLayout(req_state) {
	
	var currTab= getCurrentPageObj();
	var queryForm = currTab.find("#ReqDisQueryForm");
	var table = currTab.find("#gReqInfoForDistributeTable");
	var reqDisQueryCall=getMillisecond();
	
  //初始化字典
  autoInitSelect(queryForm);
  //需求状态默认待分发
  initSelect(currTab.find("#req_state_reqDisQuery"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_REQUIREMENT_STATE"},req_state,null);
 //初始化按钮   
 initReqDisListBtn();
 function initReqDisListBtn(){
	 //初始化提出部门
	 currTab.find("#reqDisQuery_put_org_code").click(function(){
		    $(".drop-ztree").hide();
			openSelectTreeDiv($(this),"reqDisQuery2_tree_id","SOrg/queryOrgTreeWithCenterList.asp",{"margin-top": "2px",width:"185px"},function(node){
					currTab.find("#reqDisQuery_put_org_code").val(node.name);
					currTab.find("#req_put_dept_reqDisQuery").val(node.id);
					currTab.find("#reqDisQuery2_tree_id").hide();
					
				});
			});
	// 查询
	 currTab.find("#serach_reqDisQuery").click(function() {
		var param = queryForm.serialize();
		table.bootstrapTable('refresh',{
			url:dev_construction+"requirement_accept/queryRequirementInfoForAcceptList.asp?SID="+SID+
			"&call="+reqDisQueryCall+"&menu=req_distribute"+"&"+param});
	});
	 enterEventRegister(getCurrentPageObj().attr("class"), function(){getCurrentPageObj().find("#serach_reqDisQuery").click();});

	//重置
	 currTab.find('#reset_reqDisQuery').click(function() {
		queryForm[0].reset();
		currTab.find('#req_put_dept_reqDisQuery').val("");//非ie8下reset()方法不能清除隐藏项的值
		currTab.find('#create_personReqDisQuery').val("");
		var selects = currTab.find("select");
		for(var i=0; i<selects.length; i++){
			$(selects[i]).select2();
		}
	});
	
	// 需求分发
	currTab.find("#requirement_dispense").click(function() {
		var id = currTab.find("#gReqInfoForDistributeTable").bootstrapTable('getSelections');
		var ids=$.map(id, function (row) {return row.REQ_ID;});
		var req_state=$.map(id, function (row) {return row.REQ_STATE;});
				if(id.length==1){
					if(req_state=='02'){//需求管理待分发
						closeAndOpenInnerPageTab("req_dispense","需求分发","dev_construction/requirement/requirement_accept/requirement_distribute.html",function(){
						  initReqDisLayOut(ids);
						});
					}else if(req_state=="05"){//产品经理退回
					  closeAndOpenInnerPageTab("reqdis_manReturn","评估退回分发","dev_construction/requirement/requirement_accept/reqdistribute_manReturn.html",function(){
						 initReqDisReturnLayOut(ids);
						});
					}else{
						alert("当前需求状态不是分发环节，不能分发");
					}
				}else{
			        alert("请选择一条数据进行分发！");
				}		
	});
	
	
	//需求关闭
	currTab.find("#requirement_lessclose").click(function(){
		var id = currTab.find("#gReqInfoForDistributeTable").bootstrapTable('getSelections');
		if(id.length==1){
		nconfirm("确定要关闭该需求吗", function(){
			baseAjaxJsonp(dev_construction+"requirement_accept/requirementClose.asp?SID="+SID, {"req_id":id[0]["REQ_ID"],"req_state":'13'} , function(data) {
				if (data != undefined && data != null && data.result=="true") {
						if (data != undefined && data != null && data.result=="true"){
							alert("需求关闭成功");
							table.bootstrapTable('refresh');
						}else{
							var mess=data.mess;
							alert("保存提交失败:"+mess);
						}
				  }
			});
		});
		}else{
			alert("请选择一条数据进行关闭！");
		}
	});

//需求提出人pop
currTab.find('#create_person_name_ReqDisQuery').click(function(){
	openUserPop("create_person_pop",{name:currTab.find('#create_person_name_ReqDisQuery'),no:currTab.find('#create_personReqDisQuery')});
});
}	

	/**********************************/
	
	initReqDisQueryTable();
 //初始化列表
 function initReqDisQueryTable() {
		var queryParams = function(params) {
			var temp = {
				limit : params.limit, // 页面大小
				offset : params.offset
			// 页码
			};
			return temp;
		};
		getCurrentPageObj().find('#gReqInfoForDistributeTable').bootstrapTable("destroy").bootstrapTable({
					url :dev_construction+"requirement_accept/queryRequirementInfoForAcceptList.asp?req_state="+req_state+"&backlog_p_owner="+SID+"&SID="+SID+"&call="+reqDisQueryCall+"&menu=req_distribute",
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
					jsonpCallback:reqDisQueryCall,
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
						width:"12%",
					},{
						field : 'REQ_NAME',
						title : '需求名称',
						align : "center",
						width : "15%",
					},/*{
						field : "REQ_TYPE1_DISPLAY",
						title : "需求大类",
						align : "center",
						width : "10%",
					},*/{
						field : "REQ_STATE_DISPLAY",
						title : "需求状态",
						align : "center",
						width : "10%",
					},{
						field : "REQ_LEVEL_DISPLAY",
						title : "业务优先级",
						align : "center",
						width : "10%",
					},{
						field : "REQ_PUT_DEPT_DISPLAY",
						title : "提出部门",
						align : "center",
						width : "9%",
					},{
						field : "REQ_OPERATION_DATE",
						title : "要求投产日期",
						align : "center",
						width : "10%",
					},/*{
						field : "REQ_BUSINESSER",
						title : "需求提出人",
						align : "center",
					},*/{
						field : "CREATE_PERSON_NAME",
						title : "需求提出人",
						align : "center",
						width : "8%",
					},{
						field : "P_OWNER_NAME",
						title : "当前责任人",
						align : "center",
						width : "11%",
						formatter:function(value,row,index){if(value=="" || value == undefined || value==null){return "部门负责人";}else{return value}}
					},{
						field : "CREATE_TIME",
						title : "录入时间",
						align : "center",
						width : "9%",
					}]
				});
	}
}
