

initReqApproveQueryListLayout();

function initReqApproveQueryListLayout(){
	var currTab= getCurrentPageObj();
	var queryForm = currTab.find("#reqAprDetailQueryListForm");
	var table = currTab.find("#gReqForApproveDetailTable");	
    var reqAprQueryListCall=getMillisecond();


//初始化字典
autoInitSelect(queryForm);

//初始化按钮
initReqApproveQueryBtn();
function initReqApproveQueryBtn() {
	
	//提出部门
	  currTab.find("#reqAprQuery_put_org_code1").click(function(){
		        currTab.find(".drop-ztree").hide();
				openSelectTreeDiv($(this),"reqAprQuery3_tree_id","SOrg/queryOrgTreeWithCenterList.asp",{"margin-top": "2px",width:"230px"},function(node){
					currTab.find("#reqAprQuery_put_org_code1").val(node.name);
					currTab.find("#req_put_dept_reqAprQuery1").val(node.id);
					currTab.find("#reqAprQuery3_tree_id").hide();
				});
			});
	  
	// 查询
	getCurrentPageObj().find("#serach_reqAprDetailQuery").click(function() {
		var param = queryForm.serialize();
		table.bootstrapTable('refresh',{
			url:dev_construction+"requirement_accept/queryReqForApprovetList.asp?SID="+SID+
			"&call="+reqAprQueryListCall+"&"+param+"&menu=02"
		});
	});
	enterEventRegister(getCurrentPageObj().attr("class"), function(){getCurrentPageObj().find("#serach_reqAprDetailQuery").click();});


	//重置
	getCurrentPageObj().find('#reset_reqAprDetailQuery').click(function() {
		queryForm[0].reset();
		currTab.find('#req_put_dept_reqAprQuery1').val("");//非ie8下reset()方法不能清除隐藏项的值
		currTab.find('#create_person_reqAprQuery1').val("");
		var selects = currTab.find("select");
		for(var i=0; i<selects.length; i++){
			$(selects[i]).select2();
 
		}
	});
	
	
	//查看审批详情
	getCurrentPageObj().find("#view_reqApr_detail").click(function() {
		var id = table.bootstrapTable('getSelections');
		var ids=$.map(id, function (row) {return row.REQ_ID;});
		var instance_id = $.map(id, function (row) {return row.INSTANCE_IDS;});
		var req_acc_classify=$.map(id, function (row) {return row.REQ_ACC_CLASSIFY;});
		  if(id.length==1){
			  if(req_acc_classify=="00"){
					 closeAndOpenInnerPageTab("emReqApprFinish_detail","紧急需求审批查看详情页面","dev_construction/requirement/requirement_accept/requirement_approve/emReqApprFinish_detail.html",function(){
						 initEmReqFinishDetailLayout(ids); 
					  });
					
				}
		  else{
			 closeAndOpenInnerPageTab("reqApr_detail","需求审批查看详情页面","dev_construction/requirement/requirement_accept/requirement_approve/reqApr_detail.html",function(){
				 initReqAprDetailLayOut(ids,instance_id);		
			 });	}	
		  }else{
		    alert("请选择一条数据进行查看！");
		  }
	 });
 //需求提出人pop
 currTab.find("#create_person_name_reqAprQuery1").click(function() {
		openUserPop("crpd_reqapprovedetail",{name:currTab.find('#create_person_name_reqAprQuery1'),no:currTab.find('#create_person_reqAprQuery1')});
	});
}	

//初始化列表
initReqAprListQueryTable();
function initReqAprListQueryTable() {
		var queryParams = function(params) {
			var temp = {
				limit : params.limit, // 页面大小
				offset : params.offset
			// 页码
			};
			return temp;
		};
		table.bootstrapTable("destroy").bootstrapTable({
					url :dev_construction+"requirement_accept/queryReqForApprovetList.asp?SID="+SID+"&call="+reqAprQueryListCall+"&menu=02",
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
					jsonpCallback:reqAprQueryListCall,
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
						width : "12%"
					},{
						field : 'REQ_NAME',
						title : '需求名称',
						align : "center",
						width : "15%",
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
						field : "REQ_ACC_TYPE1_DISPLAY",
						title : "需求大类",
						align : "center",
						width : "9%",
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
						field : "REQ_SCORE_DISPLAY",
						title : "需求优先级",
						align : "center",
						width : "9%",
					},{
					    field : "REQ_EVALUATE_STATE_NAME",
						title : "审批状态",
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
					/*},{
						field : "REQ_STATE_DISPLAY",
						title : "需求状态",
						align : "center"
					},{
						field : "REQ_DEPT_DISPLAY",
						title : "主管部门",
						align : "center",
					},{
						field : "REQ_OPERATION_DATE",
						title : "要求投产日期",
						align : "center",
					},{
						field : "P_OWNER_NAME",
						title : "当前责任人",
						align : "center",
					},{
						field : "CREATE_TIME",
						title : "录入时间",
						align : "center",
					},{
						field : "P_OWNER_NAMES",
						title : "当前责任人",
						align : "center",
						visible:false,
					},{
						field : "REQ_STATE",
						title : "需求状态",
						align : "center",
						visible:false,*/
					}]
				});
	}
}
