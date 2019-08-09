//初始化事件
initDefectAttrList();

function initDefectAttrList(){
	var $page = getCurrentPageObj();//当前页
	autoInitSelect($page);//初始化下拉选
	var formObj = $page.find("#defectAttrForm");//表单对象
	var initTableCall = getMillisecond();//table回调方法名
	var defectAttrTable = $page.find("[tb='defectAttrTable']");
	
	//初始化列表
	initDefectAttrTable();
	//重置按钮
	$page.find("[name='resetDefectAttr']").click(function(){
		$page.find("table input").val("");
		$page.find("select").val(" ").select2();
	});
	
	//查询按钮

	 $page.find("[name='queryDefectAttr']").click(function(){
		 var param = formObj.serialize();
		 defectAttrTable.bootstrapTable('refresh',{
				url:dev_test+"defectAttrCust/queryDefectAttrCustList.asp?SID=" + SID + "&call=" + initTableCall +'&'+param+"&ATTR_STATE=00"});
	 });
	//enter触发查询
		enterEventRegister(getCurrentPageObj().attr("class"), function(){getCurrentPageObj().find("[name='queryDefectAttr']").click();});
	//新增缺陷
	 $page.find("button[name='addAttr']").click(function(){
		 closeAndOpenInnerPageTab("defectAttrCust_Add","新增属性","dev_test/systemManage/defectAttrCust/defectAttrCust_edit.html", function(){
			 editDefect(null);
			});
	 });
	 
	//修改缺陷
	 $page.find("button[name='editAttr']").click(function(){
			var seles = defectAttrTable.bootstrapTable("getSelections");
			if(seles.length!=1){
					alert("请选择一条数据进行修改!");
					return;
			}
		 closeAndOpenInnerPageTab("defectAttrCust_Update","修改缺陷","dev_test/systemManage/defectAttrCust/defectAttrCust_edit.html", function(){
			 editDefect(seles[0]);
			});
	 });
	 //刪除属性
		$page.find("button[name='delectAttr']").click(function(){
			var id = defectAttrTable.bootstrapTable('getSelections');
			var ids = $.map(id, function (row) {
				return row.ATTR_ID;                  
			});
			var is_basic = $.map(id, function (row) {
				return row.IS_BASIC_ATTR;                  
			});
			if(id.length!=1){
				alert("请选择一条数据进行删除!");
				return ;
			}
			nconfirm("确定要删除该数据吗？",function(){
			    if(is_basic != "00"){		
					var quaryAttrDeleteCall = getMillisecond();
					var url=dev_test+"defectAttrCust/delAttr.asp?call="+quaryAttrDeleteCall+"&SID="+SID+"&ATTR_ID="+ids;
					baseAjaxJsonp(url, null , function(data) {
						if (data != undefined&&data!=null&&data.result=="true") {
							alert("删除成功！");
							defectAttrTable.bootstrapTable('remove', {
								field: 'ATTR_ID',
								values: ids
							});
							defectAttrTable.bootstrapTable('refresh',
							{url:dev_test+'defectAttrCust/queryDefectAttrCustList.asp?call='+initTableCall+'&SID='+SID+"&ATTR_STATE=00"});
						}else{	
							alert("删除失败！");
						}	
					},quaryAttrDeleteCall);	
			    }else{
			    	alert("基础属性不能删除！");
			    }
			});						
		});
	 
		//查看缺陷
		 $page.find("button[name='showAttr']").click(function(){
				var seles = defectAttrTable.bootstrapTable("getSelections");
				if(seles.length!=1){
						alert("请选择一条数据进行查看!");
						return;
				}
			 closeAndOpenInnerPageTab("showAttrCust","查看缺陷","dev_test/systemManage/defectAttrCust/defectAttrCust_show.html", function(){
				 showDefect(seles[0]);
				});
		 });
	 

	 

	 //初始化表
	function initDefectAttrTable() {
		var queryParams = function(params) {
			var temp = {
				limit : params.limit, // 页面大小
				offset : params.offset
			// 页码
			};
			return temp;
		};
		defectAttrTable.bootstrapTable({
					url : dev_test+"defectAttrCust/queryDefectAttrCustList.asp?SID=" + SID + "&call=" + initTableCall+"&ATTR_STATE=00",
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
					uniqueId : "ATTR_ID", // 每一行的唯一标识，一般为主键列
					cardView : false, // 是否显示详细视图
					detailView : false, // 是否显示父子表
					singleSelect : true,// 复选框单选
					jsonpCallback: initTableCall,
					onLoadSuccess : function(data){
						gaveInfo();
					},
					columns : [ {
						checkbox : true,
						rowspan : 2,
						align : 'center',
						valign : 'middle'
					},{
						field : 'ORDER_ID',
						title : '序号',
						align : "center",
						width : "120",
						formatter:function(value,row,index){
							return index + 1;
						}
					}, {
						field : "ATTR_ID",
						title : "属性ID",
						width : "120",
						align : "center"
					}, {
						field : "ATTR_NAME",
						title : "属性名称",
						width : "120",
						align : "center"
					}, {
						field : "NECESSARY",
						title : "是否必填",
						width : "120",
						align : "center",
						formatter:function(value,row,index){
							var result='';
							if(value=='00'){
								result = '是';
							}
							if(value=='01'){
								result = '否';
							}
							return result;
						}
					},{
						field : "ATTR_TYPE_NAME",
						title : "属性类型",
						width : "120",
						align : "center"
					}, {
						field : "MAX_LENGTH",
						title : "最大长度",
						align : "center",
						width : "120"
					}, {
						field : "DICTIONARY_NUM",
						title : "字典项编号",
						align : "center",
						width : "120"
					}, {
						field : "SORT_NUM",
						title : "排序序号",
						align : "center",
						width : "120"
					}, {
						field : "DEFAULT_NUM",
						title : "默认值",
						align : "center",
						width : "120"
					}]
				});
	}
	
}