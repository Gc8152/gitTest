var use_InterfaceApply_editCall = getMillisecond();//table回调方法名
var use_InterfaceApply_opt = "";//操作的全局变量
//初始化事件
function initUseAppOrderAddOrUpdateLayOut(item,opt){
	use_InterfaceApply_opt = opt;
	var $page = getCurrentPageObj();//当前页
	initVlidate($page);//渲染必填项
	var qRecord_app_num = "";
	if(item){//初始化申请信息
		initAppInfo(item);
		qRecord_app_num = item.RECORD_APP_NUM;
		$page.find(".hide").show();//显示申请名称
	}
	if(use_InterfaceApply_opt=="view"){//查看不可操作
		$page.find("input,select,textarea").not("[name='closePageTabConfirm']").attr("disabled","disabled");
		$page.find("[name='useInterfaceApply_edit']").hide();
	}
	//初始化接口申请列表
	initInterAppTable(qRecord_app_num);
	//初始化按钮事件
	initButtonEvent();
	
/****************************以下内部方法**********************************/	
	//初始化申请信息
	function initAppInfo(item){
		for(var k in item){
			k1 = k.toLowerCase();
			$page.find("[name='IU."+ k1 +"']").val(item[k]);
			if(k1 == "ser_system_id"){
				$page.find("[name='IU.old_"+ k1 +"']").val(item[k]);
			}
		}
		/*
		 * 不可修改，防止修改的时候切换了服务方应用并选了切换后的服务方的现有接口，但是最后却没有保存，
		 * 造成申请单选的服务方应用与所申请的现有接口的服务方应用不对应(申请单信息与子表接口申请不同步保存，
		 * 	要同步保存改造太大，目前先这样，后续需要再改造)
		 */
		//$page.find("[name='IU.ser_system_name']").attr("disabled", "disabled");
	}
	
	//初始化接口申请列表
	function initInterAppTable(record_app_num) {
		var queryParams = function(params) {
			var temp = {
				limit : params.limit, // 页面大小
				offset : params.offset
			// 页码
			};
			return temp;
		};
		$page.find('[tb="appListTable"]').bootstrapTable({
					url :dev_application+"useApplyManage/queryInterAppListById.asp?SID=" + SID + "&call=" + use_InterfaceApply_editCall + "&record_app_num=" + record_app_num,
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
					uniqueId : "SYSTEM_ID", // 每一行的唯一标识，一般为主键列
					cardView : false, // 是否显示详细视图
					detailView : false, // 是否显示父子表
					singleSelect : true,// 复选框单选
					jsonpCallback:use_InterfaceApply_editCall,
					onLoadSuccess : function(data){
						gaveInfo();
					},
					columns : [ {
						field : 'APP_TYPE_NAME',
						title : '申请类型',
						align : "center",
						width : "10%"
					}, {
						field : "APP_INTER_NUM",
						title : "申请编号",
						align : "center",
						width : "15%"
					}, {
						field : "INTER_CODE",
						title : "接口编号",
						align : "center",
						width : "15%"
					}, {
						field : "INTER_NAME",
						title : "接口名称",
						align : "center",
						width : "15%"
					}, {
						field : "INTER_OFFICE_TYPE_NAME",
						title : "接口业务类型",
						align : "center",
						width : "10%"
					}, {
						field : "INTER_DESCR",
						title : "接口描述",
						align : "center",
						width : "15%"
					}, {
						field : "INTER_APP_STATUS_NAME",
						title : "接口申请状态",
						align : "center",
						width : "10%"
					}, {
						field : "APP_TYPE",
						title : "操作",
						align : "center",
						width : "10%",
						formatter:function(value,row,index){
							var optHtml = "";
							if(value =="00"){//新建接口
								if(use_InterfaceApply_opt=="view"){//查看模式为查看
									optHtml = "<span class='viewDetail' "+
									"onclick='useInterfaceApply_editInterDetail(\"" + index + "\")'>查看</span>";
								}else if(use_InterfaceApply_opt=="edit"){//编辑模式可修改
									optHtml = "<span class='viewDetail' "+
									"onclick='useInterfaceApply_editInterDetail(\"" + index + "\")'>修改</span>";
								}
							}else if(value =="01"){//现有接口
								optHtml = "<span class='viewDetail' "+
								"onclick='useInterfaceApply_viewDetail(\"" + row.INTER_ID + "\",\""+row.INTER_VERSION +"\")'>查看</span>";
							}
							if(use_InterfaceApply_opt=="edit"){//编辑模式可删除
								optHtml += " | <span class='viewDetail' "+
								"onclick='useInterfaceApply_delInterApp(\""  + index + "\")'>删除</span>";
							}
							return optHtml;
						}
					}]
				});
	}
	//按钮事件
	function initButtonEvent(){
		//消费方 pop框按钮
		
		$page.find("[name='IU.con_system_name']").click(function(){
			
			var $cid = $page.find("[name='IU.con_inter_id']");
			var $id = $page.find("[name='IU.con_system_id']");
			var $name = $(this);
			var $systemPop = $page.find("[mod='systemPop']");
			useInterfaceApply_systemPop($systemPop, {id : $id, name : $name, type : "con",cid : $cid});
		});
		
		//服务方 pop框按钮
		$page.find("[name='IU.ser_system_name']").click(function(){
			var $id = $page.find("[name='IU.ser_system_id']");
			var $name = $(this);
			var $systemPop = $page.find("[mod='systemPop']");
			useInterfaceApply_systemPop($systemPop, {id : $id, name : $name, type : "ser"});
		});
		
		//需求任务 pop框按钮
		$page.find("[name='IU.req_task_code']").click(function(){
			var system_id = $page.find("[name='IU.con_system_id']").val();
			if(!system_id){
				alert("请选择消费方应用");
				return;
			}
			var $id = $page.find("[name='IU.req_task_id']");
			var $code = $(this);
			var $name = $page.find("[name='IU.req_task_name']");
			var $taskPop = $page.find("[mod='taskPop']");
			useInterfaceApply_taskPop($taskPop, {system_id : system_id, id : $id, name : $name, code : $code});
		});
		
		//选择现有接口按钮
		$page.find("[btn='selectInterface']").click(function(){
			var ser_system_id = $page.find("[name='IU.ser_system_id']").val();
			if(!ser_system_id){
				alert("请选择服务方应用");
				return;
			}
			var record_app_num = $page.find("[name='IU.record_app_num']").val();
			if(!record_app_num){//没有申请单编号，则表示未临时保存信息
				addAppInfoTemp();//临时保存基本信息，免得要判断考虑特别多的东西
			}
			var $seleInterPop = $page.find("[mod='seleInterPop']");
			useInterfaceApply_seleInterPop($seleInterPop, {ser_system_id : ser_system_id});
		 });
		
		 //新增接口按钮
		$page.find("[btn='addNewInterface']").click(function(){
			var ser_system_id = $page.find("[name='IU.ser_system_id']").val();
			if(!ser_system_id){
				alert("请选择服务方应用");
				return;
			}
			var record_app_num = $page.find("[name='IU.record_app_num']").val();
			if(!record_app_num){//没有申请单编号，则表示未临时保存信息
				addAppInfoTemp();//临时保存基本信息，免得要判断考虑特别多的东西
			}
			//打开新建接口pop框
			useInterfaceApply_editInterDetail();
			
		 });
		
		//保存按钮
		$page.find("[btn='saveAppInfo']").click(function(){
			addAppInfo("save");
		});
		
		//提交
		$page.find("[btn='submitAppInfo']").click(function(){
			addAppInfo("submit");
			
		});
		
	};
	
	//临时保存基本信息
	function addAppInfoTemp(){
		var params = getPageParam("IU");
		if(params['app_reason'] == '请填写申请原因'){
			params['app_reason'] = '';
		}  
		var sCall = getMillisecond();
		//
		baseAjaxJsonp(dev_application+"useApplyManage/addAppInfoTemp.asp?SID=" + SID + "&call=" + sCall, params, function(data) {
			if(data && data.record_app_num){
				$page.find("[name='IU.record_app_num']").val(data.record_app_num);
			}else{
				alert("网络错误，请重新发起申请");
				closeCurrPageTab();
			}
		},sCall,false);
	}
	
	//真实保存基本信息(逻辑保存)
	function addAppInfo(opt_type){
		if(!vlidate($page,"",true)){
			return ;
		}
		var seles = $page.find('[tb="appListTable"]').bootstrapTable("getData");
		if(seles.length == 0){
			alert("请添加申请单");
			return ;
		}
		
		
		var aaa=getCurrentPageObj().find("[name='IU.app_reason']").val();
	    if(aaa.length>230){
	    	alert("申请原因及要点至多可输入230汉字！");
	    	return;
	    }
	  
		var params = getPageParam("IU");
		params["opt_type"] = opt_type;
		var app_name = "";
		if(params['app_reason'] == '请填写申请原因'){
			params['app_reason'] = '';
		}  
		for(var i = 0; i < seles.length; i++){
			if(seles[i].APP_TYPE == "00"){//新增接口类型
				app_name += seles[i].INTER_NAME + "(新建),";
			}else{//01现有接口
				app_name += seles[i].INTER_NAME + "(现有),";
			}
		}
		params["app_name"] = app_name.substring(0, app_name.length - 1);
		var sCall = getMillisecond();
		//
		baseAjaxJsonp(dev_application+"useApplyManage/addAppInfo.asp?SID=" + SID + "&call=" + sCall, params, function(data) {
			alert(data.msg);
			if(data && data.result=="true"){
				closeCurrPageTab();
			}
		},sCall,false);
	}
	
}

//打开新建接口pop框
function useInterfaceApply_editInterDetail(index){
	var $editInterPop = getCurrentPageObj().find("[mod='editInterPop']");
	var params = {};
	if(index){//查看信息传参数
		params = getCurrentPageObj().find('[tb="appListTable"]').bootstrapTable("getData")[index];
	}
	params["ser_system_name"] = getCurrentPageObj().find("[name='IU.ser_system_name']").val();
	params["ser_system_id"] = getCurrentPageObj().find("[name='IU.ser_system_id']").val();
	userInterfaceApply_editInterPop($editInterPop,params);
}
//保存接口申请信息
function useInterfaceApply_addInterAppInfo(inter_id, app_type,callback){
	var record_app_num = getCurrentPageObj().find("[name='IU.record_app_num']").val();
	var spCall = getMillisecond();
	baseAjaxJsonp(dev_application+"useApplyManage/addExistInter.asp?SID="
			+ SID + "&call=" + spCall,
			{record_app_num : record_app_num,
			inter_id : inter_id,
			app_type : app_type}, function(data) {
		if(data && data.result=="true"){
			if(callback){
				callback();
			}
			getCurrentPageObj().find('[tb="appListTable"]').bootstrapTable('refresh',{
				url:dev_application+"useApplyManage/queryInterAppListById.asp?SID=" + SID + "&call=" + use_InterfaceApply_editCall + "&record_app_num=" + record_app_num});
		}
	},spCall,false);
}

//删除接口申请信息
function useInterfaceApply_delInterApp(index){
	var record_app_num = getCurrentPageObj().find("[name='IU.record_app_num']").val();
	params = getCurrentPageObj().find('[tb="appListTable"]').bootstrapTable("getData")[index];
	var dCall = getMillisecond();
	baseAjaxJsonp(dev_application+"useApplyManage/delInterApp.asp?SID="
			+ SID + "&call=" + dCall,
			{inter_id : params.INTER_ID,
			app_id : params.APP_ID,
			app_type : params.APP_TYPE}, function(data) {
		if(data && data.result=="true"){
			getCurrentPageObj().find('[tb="appListTable"]').bootstrapTable('refresh',{
				url:dev_application+"useApplyManage/queryInterAppListById.asp?SID=" + SID + "&call=" + use_InterfaceApply_editCall + "&record_app_num=" + record_app_num});
		}
	},dCall,false);
	
}

//跳转查看现有接口360
function useInterfaceApply_viewDetail(id,version,modObj){
	if(modObj){//需要关闭模态框时
		$("#"+modObj).modal("hide");//模态框关闭，关闭遮罩层
	}
	closeAndOpenInnerPageTab("interinfo_360mesbasic","接口信息查询","dev_application/interfaceInfo/interfaceinfo_360mesbasic.html",function(){
		var modObj = getCurrentPageObj().find("#inter360_basic_table");
		Inter360InfoDetail(id);
		inter360initAttrTable(id,version,modObj,"table[tb=360attrTable] tbody",null);
		//报文输入输出信息
		initImportContentQuery(id,"AImportContentList",version);
		initExportContentQuery(id,"AExportContentList",version);
		//接口调用关系查询
		initInter_useRelationQuery(id);
		//接口版本信息
		initVersionListTable(id);
		//变更列表信息
		initExchangeListQuery(id);
	});
}