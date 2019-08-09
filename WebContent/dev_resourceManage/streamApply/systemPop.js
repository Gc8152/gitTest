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
	var project_man_id = $("#currentLoginNo").val();
	var type='01';
	var condition = getCurrentPageObj().find("#pop_sys_condition [name]");
	var url = dev_application + 'applicationManager/queryApplication.asp?SID='+SID+'&project_man_id='+project_man_id+'&type='+type;
	for(var i=0; i<condition.length; i++) {
		var obj = $(condition[i]);
		if($.trim(obj.val()) != ""){
			url+='&'+obj.attr("name").substring(2)+"="+escape(encodeURIComponent(obj.val()));
		};
	}
	return url+(getCurrentPageObj()[0].sysparam||"");
}
/**
 * 打开应用模态框
 * @param id	增加模态框的div的id
 * @param callparams 传给bootstraptable中的参数
 */
function openSystemPop(id,callparams){
	getCurrentPageObj().find('#myModal_system').remove();	
	getCurrentPageObj().find("#"+id).load("dev_resourceManage/streamApply/systemPop.html",{},function(){
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
					//	if(row.ACCOMPLISH_CONFIG == '01' ){
							getCurrentPageObj().find('#myModal_system').modal('hide');
							if(systemParam.id){
								systemParam.id.val(row.SYSTEM_ID);
							}
							if(systemParam.name){
								systemParam.name.val(row.SYSTEM_NAME);
							}
							if(systemParam.config_man_id){
								systemParam.config_man_id.val(row.CONFIG_MAN_ID);
							}
							if(systemParam.config_man_name){
								systemParam.config_man_name.val(row.CONFIG_MAN_NAME);
							};
							if(systemParam.system_short){
								systemParam.system_short.val(row.SYSTEM_SHORT);
							}
							initAutoValue();
							var req_type1=getCurrentPageObj().find('#stream_type').val();	
							if(req_type1=="00"){
								initStreamTask(row.SYSTEM_ID);
								var records = $("#requirement_task").bootstrapTable('getData');
								if(records.length!=0&&records!=undefined&&records!=""){
									getCurrentPageObj().find("#just_save").attr("style","disabled : true");
									getCurrentPageObj().find("#input_save").attr("style","disabled : true");
									alert("该应用已申请流紧急流");
								}else{
									getCurrentPageObj().find("#just_save").attr("style","disabled : false");
									getCurrentPageObj().find("#input_save").attr("style","disabled : false");
								}
							}else{
								getCurrentPageObj().find("#just_save").attr("style","disabled : false");
								getCurrentPageObj().find("#input_save").attr("style","disabled : false");
							}
						/*}else{
							alert("该应用尚未完成配置库！");
						};	*/
					},
					onLoadSuccess:function(data){
					},
					columns : [  
					{
						field : 'SYSTEM_ID',
						title : '应用编号',
						align : "center",
						//visible: false
					}, {
						field : "SYSTEM_NAME",
						title : "应用名称",
						align : "center"
					}, {
						field : "SYSTEM_SHORT",
						title : "应用简称",
						align : "center"
					},{
						field : "PROJECT_GROUP_NAME",
						title : "开发组",
						align : "center"
					},  {
						field : "CONFIG_MAN_NAME",
						title : "配置管理员",
						align : "center"
					}, {
						field : "ACCOMPLISH_CONFIG",
						title : "配置库是否完成",
						align : "center",
						formatter:function(value,row,index){if(value=="01"){return "完成";}else {return "未完成";}}
					}, {
						field : "",
						title : "配置库信息",
						align : "center"
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
	//enter触发查询
	enterEventRegister("popModelQueryLevel1", function(){getCurrentPageObj().find("#pop_systemSearch").click();});

	
};
