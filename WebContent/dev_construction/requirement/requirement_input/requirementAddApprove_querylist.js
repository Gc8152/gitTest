initReqAddApproveQueryListLayout();

function initReqAddApproveQueryListLayout(){
	var currTab= getCurrentPageObj();
	var queryForm = currTab.find("#reqAddAprQueryListForm");
	var table = currTab.find("#gReqAddApproveTable");	
    var reqAddAprQueryListCall=getMillisecond();

//初始化字典
autoInitSelect(queryForm);

//初始化按钮
initReqAddApproveQueryBtn();
function initReqAddApproveQueryBtn() {
	//提出部门
	  currTab.find("#reqAddAprQuery_put_org_code").click(function(){
		        currTab.find(".drop-ztree").hide();
				openSelectTreeDiv($(this),"reqAprQuery2_tree_id","SOrg/queryOrgTreeWithCenterList.asp",{"margin-top": "2px",width:"230px"},function(node){
					currTab.find("#reqAddAprQuery_put_org_code").val(node.name);
					currTab.find("#req_put_dept_reqAddAprQuery").val(node.id);
					currTab.find("#reqAprQuery2_tree_id").hide();
				});
			});
	  
	// 查询
	getCurrentPageObj().find("#serach_reqAddAprQuery").click(function() {
		var param = queryForm.serialize();
		table.bootstrapTable('refresh',{
			url:dev_construction+"requirement_input/queryReqAddApprovetList.asp?SID="+SID+
			"&req_state=15&call="+reqAddAprQueryListCall+"&"+param
		});
	});
	enterEventRegister(getCurrentPageObj().attr("class"), function(){getCurrentPageObj().find("#serach_reqAprQuery").click();});


	//重置
	getCurrentPageObj().find('#reset_reqAddAprQuery').click(function() {
		queryForm[0].reset();
		currTab.find('#req_put_dept_reqAddAprQuery').val("");//非ie8下reset()方法不能清除隐藏项的值
		currTab.find('#create_person_reqAprQuery').val("");
		var selects = currTab.find("select");
		for(var i=0; i<selects.length; i++){
			$(selects[i]).select2();
 
		}
	});
	
	//审批
	getCurrentPageObj().find("#req_add_approve").click(function() {
		var id = table.bootstrapTable('getSelections');
		var ids=$.map(id, function (row) {return row.REQ_ID;});
		var req_state=$.map(id, function (row) {return row.REQ_STATE;});
		var approve_owner=$.map(id, function (row) {return row.CURR_ACTORNO;});
		var req_acc_classify=$.map(id, function (row) {return row.REQ_ACC_CLASSIFY;});
		if(id.length==1){
			
		  if(req_state[0]!="15"){			
			alert("该需求审批已完成审批！");
			return;
		  }
		  var appowner=approve_owner[0].split(',');
		  if(approve_owner.length<1 ||appowner.indexOf(SID)){
			 
			alert("你不是此需求的当前审批人");
			return;
		  }
		  closeAndOpenInnerPageTab("requirement_approve","需求提出审批页面","dev_construction/requirement/requirement_input/requirement_add_approve.html",function(){
			  initReqAprInfor(ids);
		   });
	   }else{
			        alert("请选择一条数据进行审批！");
		}		
	});
	//批量审批
/*	getCurrentPageObj().find("#req_approve_quckly").click(function() {
		var id = table.bootstrapTable('getSelections');
		var ids = $.map(id, function (row) {return row.INSTANCE_ID;});
		var curr_actorno = $.map(id, function (row) {return row.CURR_ACTORNO;});
		var req_acc_classify=$.map(id, function (row) {return row.REQ_ACC_CLASSIFY;});
		 if(id.length>=1){
			 var curr_actornos = curr_actorno.toString();
			 var approve_owner = curr_actornos.split(",");
			 for(var i=0;i<approve_owner.length;i++){
				 if(approve_owner[i]!=SID){
					 alert("您不是所选需求一致的当前审批人");
					 return;
				 }
			 }
			 var req_acc_classifys = req_acc_classify.toString();
			 var req_acc_arr = req_acc_classifys.split(",");
			 for(var i=0;i<req_acc_arr.length;i++){
				 if(req_acc_arr[i]=="00"){
					 alert("包含紧急需求，不能批量审批");
					 return;
				 }
			 }
			 nconfirm("是否确定批量审批通过？",function(){
				 var instance_id = ids.toString();
				 batchApprPassBtn(instance_id,batch_callFunc);
			 });
		 }else {
			 alert("请至少选择一条需求");
		 }
		
	});*/
	
 //需求提出人pop
 currTab.find("#create_person_name_reqAddAprQuery").click(function() {
		openUserPop("crp_reqapprove",{name:currTab.find('#create_person_name_reqAddAprQuery'),no:currTab.find('#create_person_reqAprQuery')});
	});
}	

//初始化列表
initReqAddAprListQueryTable();
function initReqAddAprListQueryTable() {
		var queryParams = function(params) {
			var temp = {
				limit : params.limit, // 页面大小
				offset : params.offset
			// 页码
			};
			return temp;
		};
		table.bootstrapTable("destroy").bootstrapTable({
					url :+SID+"&call="+reqAddAprQueryListCall+"&req_state=15",
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
					jsonpCallback:reqAddAprQueryListCall,
					singleSelect : false,// 复选框单选
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
						width : "12%"
					},{
						field : 'REQ_NAME',
						title : '需求名称',
						align : "center",
						width : "15%",
					},{
						field : "CREATE_PERSON_NAME",
						title : "需求提出人",
						align : "center",
						width : "9%",
					},{
						field : "REQ_PUT_DEPT_DISPLAY",
						title : "提出部门",
						align : "center",
						width : "9%",
					},{
					field : "REQ_STATE_DISPLAY",
						title : "需求状态",
						align : "center",
						width : "9%",
					},{
						field : "CURR_ACTORNO_NAME",
						title : "当前审批人",
						align : "center",
						width : "9%",
					},{
						field : "OPT_TIME",
						title : "审批时间",
						align : "center",
						width : "10%",
					}]
				});
	}
}
