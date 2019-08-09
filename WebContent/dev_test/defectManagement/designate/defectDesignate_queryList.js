//初始化事件
initDesignateList();

function initDesignateList(){
	var $page = getCurrentPageObj();//当前页
	autoInitSelect($page);//初始化下拉选
	var formObj = $page.find("#designateForm");//表单对象
	var initTableCall = getMillisecond();//table回调方法名
	var designateTable = $page.find("[tb='designateTable']");
	
	//初始化列表
	initdesignateTable();
	//重置按钮
	$page.find("[name='resetDesignate']").click(function(){
		$page.find("select").val(" ").select2();
		$page.find("table input").val("");
		$page.find("[name='MODULE_ID']").html('<option value="">请选择</option>').val("").select2();
		$page.find("[name='FUNCPOINT_ID']").html('<option value="">请选择</option>').val("").select2();
		$page.find("select[name='PRIORITY_LEVEL']").val(" ").select2();
	});
	
	//查询按钮
	 $page.find("[name='queryDesignate']").click(function(){
		 var param = formObj.serialize();
		 designateTable.bootstrapTable('refresh',{
				url:dev_test+"designateDefect/queryDesignateDefectList.asp?SID=" + SID + "&call=" + initTableCall +'&'+param});
	 });
	//enter触发查询
		enterEventRegister(getCurrentPageObj().attr("class"), function(){getCurrentPageObj().find("[name='queryDesignate']").click();});
	 
	//指派缺陷
	 $page.find("button[name='designateDefect']").click(function(){
			var seles = designateTable.bootstrapTable("getSelections");
			if(seles.length!=1){
					alert("请选择一条数据!");
					return;
			}

		 closeAndOpenInnerPageTab("editDefect","指派缺陷","dev_test/defectManagement/designate/defectDesignate_edit.html", function(){
			 designateDefect(seles[0]);
			});
	 });
	//拒绝缺陷
	 $page.find("button[name='disposeDefect']").click(function(){
			var seles = designateTable.bootstrapTable("getSelections");
			if(seles.length!=1){
					alert("请选择一条数据!");
					return;
			}
			$page.find("#refuseDefect_modal").modal('show');
			initVlidate($page);

	 });
	//转交缺陷
	 $page.find("button[name='discoverDefect']").click(function(){
			var seles = designateTable.bootstrapTable("getSelections");
			if(seles.length!=1){
					alert("请选择一条数据!");
					return;
			}
			$page.find("#discoverDefect_modal").modal('show');
			initVlidate($page);

	 });
	//选择应用
	$page.find("[name='IU.DISCOVER_SYSTEM_NAME']").click(function(){
//		$page.find("#discoverDefect_modal").modal('hide');

		//选择应用
		var $SYSTEM_NAME = $page.find("[name='IU.DISCOVER_SYSTEM_NAME']");
		var $SYSTEM_ID= $page.find("[name='IU.DISCOVER_SYSTEM_ID']");
		var seles = designateTable.bootstrapTable("getSelections");
		var SYSTEM_ID = seles[0].SYSTEM_ID;
		var DISCOVER_SYSTEM_ID = seles[0].DISCOVER_SYSTEM_ID;
		var sys_id = "";
		if(DISCOVER_SYSTEM_ID == undefined){
			sys_id=SYSTEM_ID;
		}else{
			sys_id=DISCOVER_SYSTEM_ID;
		}
		openSystemPop2('sendProduceSystemPop', {
			name : $SYSTEM_NAME,
			id  : $SYSTEM_ID,
			duty_name : $page.find("[name='IU.DUTY_PERSON_NAME']"),
			duty_id : $page.find("[name='IU.DUTY_PERSON']"),
			
		},sys_id);
	});
	//选择责任人
	$page.find("#DUTY_PERSON_NAME").click(function(){
		var DISCOVER_SYSTEM_ID = $page.find("[name='IU.DISCOVER_SYSTEM_ID']").val();
		if(DISCOVER_SYSTEM_ID==null || DISCOVER_SYSTEM_ID==""){
			alert("请选择应用");
			return;
		}
		openUserPop("userOrgDivPop",{"name":$page.find("#DUTY_PERSON_NAME"),"no":$page.find("#DUTY_PERSON")},DISCOVER_SYSTEM_ID);

		//initModal();//POP框垂直居中
	});
	//拒绝缺陷保存
	$page.find("[btn='refuse_save']").click(function(){
		if(!vlidate($page.find("#refuseDefect_modal"),"",true)){
			return ;
		}
		var seles = designateTable.bootstrapTable("getSelections");
		var params = {};
		params["TYPE"] = 'refuse';
		params["DISPOSE_REASON"] = $page.find("[name='IU.REFUSE_REASON']").val();
		params["DEFECT_ID"] = seles[0].DEFECT_ID;
		$page.find("#refuseDefect_modal").modal('hide');
		saveDispose(params);
	});
	//转交缺陷保存
	$page.find("[btn='discover_save']").click(function(){
		if(!vlidate($page.find("#discoverDefect_modal"),"",true)){
			return ;
		}
		var seles = designateTable.bootstrapTable("getSelections");
		var params = {};
		params["TYPE"] = 'discover';
		params["DUTY_PERSON"] = $page.find("[name='IU.DUTY_PERSON']").val();
		params["DISPOSE_REASON"] = $page.find("[name='IU.DISCOVER_COMMENT']").val();
		params["DISCOVER_SYSTEM_ID"] = $page.find("[name='IU.DISCOVER_SYSTEM_ID']").val();
		params["DISCOVER_COMMENT"] = $page.find("[name='IU.DISCOVER_COMMENT']").val();
		params["DEFECT_ID"] = seles[0].DEFECT_ID;
		$page.find("#discoverDefect_modal").modal('hide');
		saveDispose(params);
	});
	function saveDispose(params){
			var sCall = getMillisecond();
			baseAjaxJsonp(dev_test+"disposeDefect/saveDispose.asp?SID=" + SID + "&call=" + sCall, params, function(data) {
				if(data && data.result=="true"){
					getCurrentPageObj().find("[tb='designateTable']").bootstrapTable("refresh");
					//alert(data.msg);
				}else{
					alert(data.msg);
					//closeCurrPageTab();
				}
			},sCall,false);
	}
	//查看详情
	 $page.find("button[name='designateDetail']").click(function(){
		 var seles = designateTable.bootstrapTable("getSelections");
			if(seles.length!=1){
					alert("请选择一条数据进行查看!");
					return;
			}

		 closeAndOpenInnerPageTab("designateDetail","查看缺陷详情","dev_test/defectManagement/query/defect_detail.html", function(){
			 detailDefect(seles[0]);
			});
	 }); 

	 //初始化表
	function initdesignateTable() {
		var queryParams = function(params) {
			var temp = {
				limit : params.limit, // 页面大小
				offset : params.offset
			// 页码
			};
			return temp;
		};
		designateTable.bootstrapTable({
					url : dev_test+"designateDefect/queryDesignateDefectList.asp?SID=" + SID + "&call=" + initTableCall,
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
					}, */{
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