
/**
 * 根据需求点查找下面所有的任务的接口 (根据需求点id查找)(两个参数的 是根据投产编号来查询)
 */
function initqueryInterface(sub_req_id,SendProduce){
	var queryParams = function(params){
		var temp = {};
		temp["limit"] = params.limit;
		temp["offset"] = params.offset;
		return temp;
	};
	var queryInterfacecall = getMillisecond();
	var urlq=null;
	if(SendProduce!="SendProduce"){//SendProduce用于判断是否是通过根据投产编号来查询  接口list
		urlq=dev_construction+'GSitSubmit/queryTaskInterface.asp?call='+queryInterfacecall+'&SID='+SID+'&sub_req_id='+sub_req_id;
	}else{
		urlq=dev_construction+'GSitSubmit/queryTaskInterface.asp?call='+queryInterfacecall+'&SID='+SID+'&audit_no='+sub_req_id;
	}
	var table=getCurrentPageObj().find("table[name='table_TaskInterfaceInfo']");
	//getCurrentPageObj().find("#sendProContent").bootstrapTable("destory");
	//getCurrentPageObj().find("#table_interface_editInfo")
	table.bootstrapTable(
			{
				url : urlq,//+'&version_id=0&system_no=0&type=edit&sit_id='+sit_id
				method : 'get', //请求方式（*）   
				striped : false, //是否显示行间隔色
				cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
				sortable : true, //是否启用排序
				sortOrder : "asc", //排序方式
				queryParams : queryParams,//传递参数（*）
				sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
				pagination : false, //是否显示分页（*）
				pageList : [5,10],//每页的记录行数（*）
				pageNumber : 1, //初始化加载第一页，默认第一页
				pageSize : 10,//可供选择的每页的行数（*）
				clickToSelect : true, //是否启用点击选中行
				uniqueId : "REQ_TASK_ID", //每一行的唯一标识，一般为主键列
				cardView : false, //是否显示详细视图
				detailView : false, //是否显示父子表
				singleSelect: true,
				jsonpCallback: queryInterfacecall,
				onLoadSuccess:function(data){
					/*gaveInfo();	
					var sit_num = data.sit_num+1;
					getCurrentPageObj().find("#TEST_COUNT_NAME").val("第"+sit_num+"轮次");*/
				},
				columns : [/*{
							checkbox : true,
							rowspan : 2,
							align : 'center',
							valign : 'middle'
						},*/{
							field : 'REQ_TASK_ID',
							title : '任务序列号',
							align : "center",
							visible:false
						},{
							field : 'SUB_REQ_ID',
							title : '需求点序列号',
							align : "center",
							visible:false
						},{
							field : "INTER_CODE",
							title : "接口编号",
							align : "center",
							width : "10%"
						},{
							field : "INTER_NAME",
							title : "接口名称",
							align : "center",
							width : "15%"
						},{
							field : "INTER_VERSION",
							title : "接口版本",
							align : "center",
						},{
							field : "SYSTEM_NAME",
							title : "服务方应用id",
							align : "center",
						},{
							field : "INTER_OFFICE_TYPE_NAME",
							title : "接口业务类型",
							align : "center",
						},{
							field : "APP_TYPE_NAME",
							title : "申请类型",
							align : "center",
						}, {
							field : "START_WORK_TIME",
							title : "开始执行时间",
							align : "center",
							valign: 'middle',
							width : "10%",
							/*formatter: function (value, row, index) {
								return '<span class="hover-view" '+
								'onclick="viewTaskDetail('+value+')">查看</span>';
							}*/
						}]
			});
}