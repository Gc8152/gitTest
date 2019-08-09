//初始化部门和项目组方法
function initSystemPopOrgandGroupEvent(){
	getCurrentPageObj().find("#P_organ_name").unbind("click");
	getCurrentPageObj().find("#P_organ_name").click(function(){
		openSelectTreeDiv($(this),"systemPop_tree_id_org","SOrg/queryorgtreelist.asp",{"margin-top":"26px","margin-left":"130px", width:"176px",height:"200px"},function(node){
			getCurrentPageObj().find("#P_organ_name").val(node.name);
			getCurrentPageObj().find("#P_organ_id").val(node.id);
		});
	});
/*	getCurrentPageObj().find("#P_organ_name").focus(function(){
		getCurrentPageObj().find("#P_organ_name").click();
	});	*/
	getCurrentPageObj().find("#P_project_group_name").unbind("click");
	getCurrentPageObj().find("#P_project_group_name").click(function(){
		openSelectTreeDiv($(this),"systemPop_tree_id_group","SOrg/queryorgtreelist.asp",{"margin-top":"26px","margin-left":"130px", width:"176px",height:"200px"},function(node){
			getCurrentPageObj().find("#P_project_group_name").val(node.name);
			getCurrentPageObj().find("#P_project_id").val(node.id);
		});
	});
}

/**
 * 获取组装查询url
 * @returns
 */
function getSystemPopUrl() {
	var condition = getCurrentPageObj().find("#pop_sys_condition [name]");
	var url = dev_application + 'applicationManager/queryApplication.asp?SID='+SID
	for(var i=0; i<condition.length; i++) {
		var obj = $(condition[i]);
		if($.trim(obj.val()) != ""){
			url+='&'+obj.attr("name").substring(2)+"="+escape(encodeURIComponent(obj.val()));
		}
	}
	return url;
}
/**
 * 打开应用模态框
 * @param id	增加模态框的div的id
 * @param callparams 传给bootstraptable中的参数
 */
function openSystemPop(id,callparams){
	getCurrentPageObj().find('#myModal_system').remove();	
	getCurrentPageObj().find("#"+id).load("dev_construction/sit_test_jn/sit_submit/systemPop.html",{},function(){
		getCurrentPageObj().find("#myModal_system").modal("show");
		initSystemTaskPop("#pop_systemTable", getSystemPopUrl(), callparams);
		initSystemPopOrgandGroupEvent();
		//初始化字典项
		initSelect($("#P_is_important"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_IS_INSTANCY"});
		initSelect($("#P_system_status"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_SYSTEM_STATUS"});
		//$("select").select2();
	});
	
}

/**
 * 初始化应用模态框
 */
function initSystemTaskPop(systemTable,systemUrl,systemParam){
	//分页
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};	
	//查询应用POP框
	getCurrentPageObj().find(systemTable).bootstrapTable("destroy").bootstrapTable({
				//请求后台的URL（*）
					url :systemUrl,
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
					pageSize : 5, // 每页的记录行数（*）
					clickToSelect : true, // 是否启用点击选中行
					// height: 460, //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
					uniqueId : "SYSTEM_ID", // 每一行的唯一标识，一般为主键列
					cardView : false, // 是否显示详细视图
					detailView : false, // 是否显示父子表
					singleSelect : true,// 复选框单选
					onDblClickRow:function(row){	//双击行事件
							getCurrentPageObj().find('#myModal_system').modal('hide');
							if(systemParam.id){
								systemParam.id.val(row.SYSTEM_ID);
							}
							if(systemParam.name){
								systemParam.name.val(row.SYSTEM_NAME);
							}
							if(systemParam.test_man_id){
								systemParam.test_man_id.val(row.TEST_MAN_ID);
							}
							if(systemParam.test_man_name){
								systemParam.test_man_name.val(row.TEST_MAN_NAME);
							}
							//是否新应用
							//getCurrentPageObj().find("input[name='is_new_system'][value='"+row.IS_NEW_SYSTEM+"']").click();
							if(row.IS_NEW_SYSTEM == '00') {
								getCurrentPageObj().find("#is_new_system").val("是");
							} else {
								getCurrentPageObj().find("#is_new_system").val("否");
							}
							var system_id = getCurrentPageObj().find("#system_id").val();
							var versions_id = getCurrentPageObj().find("#versions_id").val();
							//双击模态框后，检查应用和版本都存在的时候查询相关的任务
							if(system_id && versions_id) {
								//checkThisApplyIsExist(system_id, versions_id);
								freshSItTaskContent(system_id, versions_id);
							}
							//判断是否CC项目
							var IS_CC = row.IS_CC;
							if(IS_CC == '00'){
								getCurrentPageObj().find("#CONFIG_ADDRESS").val("");
								getCurrentPageObj().find("#CONFIG_BASE_NAME").val("");
								getCurrentPageObj().find("#sit_flow").show();
								getCurrentPageObj().find("#is_svn").hide();
								
							}else{
								getCurrentPageObj().find("#SIT_FLOW_NAME").val("");
								getCurrentPageObj().find("#SIT_BASE_LINE").val("");
								getCurrentPageObj().find("#sit_flow").hide();
								getCurrentPageObj().find("#is_svn").show();
								
							}
					},
					onLoadSuccess:function(data){
					},
					columns : [  
					{
						field : 'SYSTEM_ID',
						title : '应用编号',
						align : "center",
						visible: false
					}, {
						field : 'ORGAN_NAME',
						title : '部门',
						align : "center"
					}, {
						field : "PROJECT_GROUP_NAME",
						title : "项目组",
						align : "center"
					}, {
						field : "SYSTEM_NAME",
						title : "应用名称",
						align : "center"
					}, {
						field : "SYSTEM_SHORT",
						title : "应用简称",
						align : "center"
					}, {
						field : "IS_CC",
						title : "是否纳入CC",
						align : "center",
						formatter:function(value,row,index){if(value=="00"){return "是";}return "否";}
					}, {
						field : "IS_NEW_SYSTEM",
						title : "是否新应用",
						align : "center",
						formatter:function(value,row,index){if(value=="00"){return "是";}return "否";}
					}, {
						field : "IS_AGILE",
						title : "是否敏捷",
						align : "center",
						visible: false,
						formatter:function(value,row,index){if(value=="00"){return "是";}return "否";}
					}, {
						field : "SYSTEM_STATUS",
						title : "应用状态",
						align : "center",
						formatter:function(value,row,index){if(value=="01"){return "未上线";}else if(value=="02"){return "已上线";}else if(value=="03"){return "待下线";}else{return "已下线";}}
					}]
			});
	//应用POP重置
	getCurrentPageObj().find("#pop_systemReset").click(function(){
		getCurrentPageObj().find("#pop_sys_condition input").val("");
		var selects = getCurrentPageObj().find("#pop_sys_condition select");
		selects.val(" ");
		selects.select2();
	});
	//多条件查询应用
	getCurrentPageObj().find("#pop_systemSearch").click(function(){
		getCurrentPageObj().find(systemTable).bootstrapTable('refresh',{url:getSystemPopUrl()});
	});
	enterEventRegister("popModelQueryLevel1", function(){getCurrentPageObj().find("#pop_systemSearch").click();});
}
