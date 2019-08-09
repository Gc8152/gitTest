//初始化事件
initDefectList();

function initDefectList(){
	var $page = getCurrentPageObj();//当前页
	autoInitSelect($page);//初始化下拉选
	var formObj = $page.find("#defectForm");//表单对象
	var initTableCall = getMillisecond();//table回调方法名
	var defectTable = $page.find("[tb='defectTable']");
	
	//初始化列表
	initDefectTable();
	//重置按钮
	$page.find("[name='resetDefect']").click(function(){
		$page.find("select").val(" ").select2();
		$page.find("table input").val("");
		$page.find("[name='MODULE_ID']").html('<option value="">请选择</option>').val("").select2();
		$page.find("[name='FUNCPOINT_ID']").html('<option value="">请选择</option>').val("").select2();
		$page.find("select[name='PRIORITY_LEVEL']").val(" ").select2();
	});
	
	//查询按钮
	 $page.find("[name='queryDefect']").click(function(){
		 var param = formObj.serialize();
		 defectTable.bootstrapTable('refresh',{
				url:dev_test+"addDefect/queryAddDefectList.asp?SID=" + SID + "&call=" + initTableCall +'&'+param});
	 });
	//enter触发查询
		enterEventRegister(getCurrentPageObj().attr("class"), function(){getCurrentPageObj().find("[name='queryDefect']").click();});
	//新增缺陷
	 $page.find("button[name='addDefect']").click(function(){
		 closeAndOpenInnerPageTab("addDefect","新增缺陷","dev_test/defectManagement/add/defect_add.html", function(){
			 editDefect(null,'add');
			});
	 });
	 
	//修改缺陷
	 $page.find("button[name='editDefect']").click(function(){
			var seles = defectTable.bootstrapTable("getSelections");
			if(seles.length!=1){
					alert("请选择一条数据进行修改!");
					return;
			}
			
//			if(seles[0].DEFECT_STATE != "00"){
//				alert("不是草拟状态不能修改");
//				return;
//			}
		 closeAndOpenInnerPageTab("editDefect","修改缺陷","dev_test/defectManagement/add/defect_add.html", function(){
			 editDefect(seles[0],'edit');
			});
	 });
	 
	//查看详情
	 $page.find("button[name='viewDetail']").click(function(){
		 var seles = defectTable.bootstrapTable("getSelections");
			if(seles.length!=1){
					alert("请选择一条数据进行查看!");
					return;
			}
			
			if(seles[0].DEFECT_STATE == "00"){
				alert("请先提交");
				return;
			}
			
		 closeAndOpenInnerPageTab("detail","查看缺陷详情","dev_test/defectManagement/add/defect_view.html", function(){
			 detailDefect(seles[0]);
			});
	 }); 
	 //删除缺陷
	 $page.find("button[name='viewDelete']").click(function(){
		 	var seles = defectTable.bootstrapTable("getSelections");
			if(seles.length!=1){
				alert("请选择一条数据!");
				return;
			}
			if(seles[0].DEFECT_STATE == '02'){//已拒绝
				alert("该缺陷不可以删除");
				return;
			}
			nconfirm("确定需要删除该数据？",function(){
				var call_op = getMillisecond();
				baseAjaxJsonp(dev_test+'addDefect/deleteDefeact.asp?call='+call_op+'&SID='+SID,{id:seles[0].DEFECT_ID},function(data){
					if(data&&data.result=="true"){
						getCurrentPageObj().find("[tb='defectTable']").bootstrapTable("refresh");
						//alert("删除成功");
					}else{
						alert("删除失败");
					}
				},call_op);
			});
	 });
	//关闭缺陷
	 $page.find("button[name='closeDefect']").click(function(){
		 var seles = defectTable.bootstrapTable("getSelections");
			if(seles.length!=1){
					alert("请选择一条数据!");
					return;
			}
			if(seles[0].DEFECT_STATE != '02'){//已拒绝
				alert("该缺陷不可以关闭");
				return;
			}
			nconfirm("确定需要关闭该缺陷？",function(){
				var call_sub = getMillisecond();
				baseAjaxJsonp(dev_test+'verifyDefect/saveVerify.asp?call='+call_sub+'&SID='+SID,{"DEFECT_ID":seles[0].DEFECT_ID,"TYPE":"close"},function(data){
					if(data&&data.result=="true"){
						getCurrentPageObj().find("[tb='defectTable']").bootstrapTable("refresh");
						//alert("关闭成功");
					}else{
						alert("关闭失败");
					}
				},call_sub);
			});
			
	 }); 
	 //提交缺陷
	 $page.find("button[name='submitDefect']").click(function(){
		 	var seles = defectTable.bootstrapTable("getSelections");
			if(seles.length!=1){
				alert("请选择一条数据!");
				return;
			}
			nconfirm("确定需要提交该数据？",function(){
				var call_sub = getMillisecond();
				baseAjaxJsonp(dev_test+'addDefect/submitDefect.asp?call='+call_sub+'&SID='+SID,{id:seles[0].DEFECT_ID},function(data){
					if(data&&data.result=="true"){
						if(data && data.review=="false"){
							alert("提交失败，请联系管理员");
						}
						getCurrentPageObj().find("[tb='defectTable']").bootstrapTable("refresh");
						//alert("提交成功");
					}else{
						alert("提交失败");
					}
				},call_sub);
			});
	 });
	 //初始化表
	function initDefectTable() {
		var queryParams = function(params) {
			var temp = {
				limit : params.limit, // 页面大小
				offset : params.offset
			// 页码
			};
			return temp;
		};
		defectTable.bootstrapTable({
					url : dev_test+"addDefect/queryAddDefectList.asp?SID=" + SID + "&call=" + initTableCall,
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
					uniqueId : "DEFECT_ID", // 每一行的唯一标识，一般为主键列
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
					},/*{
						field : 'ORDER_ID',
						title : '序号',
						align : "center",
						width : "60",
						formatter:function(value,row,index){
							return index + 1;
						}
					},*/{
						field : "DEFECT_NUM",
						title : "缺陷编号",
						width : "150",
						align : "center",
						//visible:false
					},{
						field : "SUMMARY",
						title : "缺陷摘要",
						width : "400",
						align : "center",
						formatter : function(value,row,index){
							return req_namformatter(24,value);
						}
						//visible:false
					},{
						field : "DEFECT_STATE_NAME",
						title : "缺陷状态",
						align : "center",
						width : "120"
					}, {
						field : "SYSTEM_NAME",
						title : "应用名称",
						width : "120",
						align : "center",
						//visible:false
					}, {
						field : "MODULE_NAME",
						title : "模块名称",
						width : "120",
						align : "center",
						//visible:false
					},{
						field : "FUNCPOINT_NAME",
						title : "功能点",
						width : "120",
						align : "center"
					}, 
					 {
						field : "SEVERITY_GRADE_NAME",
						title : "缺陷等级",
						align : "center",
						width : "120"
					}, {
						field : "PRIORITY_LEVEL_NAME",
						title : "缺陷优先级",
						align : "center",
						width : "120"
					}, 
					 {
						field : "CREATE_MAN_NAME",
						title : "提出人",
						align : "center",
						width : "120"
					},{
						field : "CREATE_TIME",
						title : "缺陷提出时间",
						align : "center",
						width : "180",
						//visible:false
					}
					
					]
				});
	}
	//选择应用
	$page.find("[name='SYSTEM_NAME']").click(function(){
		//选择应用
		var $SYSTEM_NAME = $page.find("[name='SYSTEM_NAME']");
		var $SYSTEM_ID= $page.find("[name='SYSTEM_ID']");
		openSystemPop('sendProduceSystemPop', {
			name : $SYSTEM_NAME,
			id  : $SYSTEM_ID,
			duty_name : $page.find("[name='IU.DUTY_PERSON_NAME']"),
			duty_id : $page.find("[name='IU.DUTY_PERSON']"),
			func_call:selectModule
		});
	});
	//添加查询模块
	function selectModule(){
		var system_id = getCurrentPageObj().find("#SYSTEM_ID").val();
		var url = dev_test+'addDefect/queryModuleBySysId.asp';
		var obj = getCurrentPageObj().find("#MODULE_ID");	
		obj.empty();
		obj.append('<option value="">请选择</option>');	
		baseAjaxJsonpNoCall(url,{"system_id":system_id},function(data){
			var rows = data.list;
			if(rows){
				for(var i=0;i<rows.length;i++){
					obj.append('<option  value="'+rows[i].FUNC_NO+'">'+rows[i].FUNC_NAME+'</option>');	
				}
			}
		});
		obj.select2();
		
	}

	
}
//添加查询功能点
function selectFunc(){
	var module_id = getCurrentPageObj().find("#MODULE_ID").val();

	var url = dev_test+'addDefect/queryModuleByFuncId.asp';
	var obj = getCurrentPageObj().find("#FUNCPOINT_ID");
	obj.empty();
	obj.append('<option value="">请选择</option>');	
	
	baseAjaxJsonpNoCall(url,{"module_id":module_id},function(data){
		var rows = data.list;
		if(rows){
			for(var i=0;i<rows.length;i++){
				obj.append('<option value="'+rows[i].FUNC_NO+'">'+rows[i].FUNC_NAME+'</option>');	
			}
		}
	});
	obj.select2();
}