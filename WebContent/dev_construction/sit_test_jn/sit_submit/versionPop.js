/**
 * 获取组装查询url
 * @returns
 */
function getVersionPopUrl() {
	var condition = getCurrentPageObj().find("#pop_ver_condition [name]");
	var url = dev_construction+'reqtask_intoVersion/queryVersionInfoList.asp?SID='+SID+"&visit_modul=10";
	for(var i=0; i<condition.length; i++) {
		var obj = $(condition[i]);
		if($.trim(obj.val()) != ""){
			url+='&'+obj.attr("name").substring(2)+"="+escape(encodeURIComponent(obj.val()));
		}
	}
	
	return url;
}
/**
 * 打开版本模态框
 * @param id	增加模态框的div的id
 * @param callparams 传给bootstraptable中的参数
 */
function openVersionPop(id,callparams){
	getCurrentPageObj().find('#myModal_version').remove();	
	getCurrentPageObj().find("#"+id).load("dev_construction/sit_test_jn/sit_submit/versionPop.html",{},function(){
		getCurrentPageObj().find("#myModal_version").modal("show");
		initVersionPop("#pop_versionTable", getVersionPopUrl(), callparams);
		//自动初始化字典项
		autoInitSelect(getCurrentPageObj().find("#pop_ver_condition"));
		//initSelect(getCurrentPageObj().find("[name='P_versions_type']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"SYS_DIC_VERSION_PROJECT"});
		//$("select").select2();
	});
	
}

/**
 * 初始化版本模态框
 */
function initVersionPop(versionTable,versionmUrl,versionParam){
	//分页
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};	
	
	//查询版本POP框
	getCurrentPageObj().find(versionTable).bootstrapTable("destroy").bootstrapTable({
					//请求后台的URL（*）
					//url : dev_project+'annualVersion/queryListAnnualVersion.asp?SID='+SID,
					url:versionmUrl,
					method : 'get', //请求方式（*）   
					striped : false, //是否显示行间隔色
					cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
					sortable : true, //是否启用排序
					sortOrder : "asc", //排序方式
					queryParams : queryParams,//传递参数（*）
					sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
					pagination : true, //是否显示分页（*）
					pageList : [5,10,15],//每页的记录行数（*）
					pageNumber : 1, //初始化加载第一页，默认第一页
					pageSize : 5,//可供选择的每页的行数（*）
					clickToSelect : true, //是否启用点击选中行
					uniqueId : "VERSIONS_ID", //每一行的唯一标识，一般为主键列
					cardView : false, //是否显示详细视图
					detailView : false, //是否显示父子表
					singleSelect: true,
					//jsonpCallback:tableCall,
					onDblClickRow:function(row){	//双击行事件
						getCurrentPageObj().find('#myModal_version').modal('hide');
						if(versionParam.id){
							versionParam.id.val(row.VERSIONS_ID);
						}
						if(versionParam.name){
							versionParam.name.val(row.VERSIONS_NAME);
						}
						var system_id = getCurrentPageObj().find("#system_id").val();
						var versions_id = getCurrentPageObj().find("#versions_id").val();
						//双击模态框后，检查应用和版本都存在的时候查询相关的任务
						if(system_id && versions_id) {
							//checkThisApplyIsExist(system_id, versions_id);
							freshSItTaskContent(system_id, versions_id);
						}
					},
					onLoadSuccess: function(data) {
					},
					columns : [ {
						field : 'VERSIONS_ID',
						title : '版本编号',
						align : "center",
					},{
						field : 'VERSIONS_NAME',
						title : '版本名称',
						align : "center",
					}, {
						field : 'VERSIONS_DATE',
						title : '版本日期',
						align : "center"
					}, {
						field : 'VERSIONS_STATUS_DISPLAY',
						title : '版本状态',
						align : "center"
					},{
						field : 'VERSIONS_WEEK',
						title : '周次',
						align : "center",
					    visible:false
					},{
						field : 'SYSTEM_NAME',
						title : '应用名称',
						align : "center",
					    visible:false
					}]
			});
	//版本POP重置
	$("#pop_versionReset").click(function(){
		getCurrentPageObj().find("#pop_ver_condition input").val("");
		var selects = getCurrentPageObj().find("#pop_ver_condition select");
		selects.val(" ");
		selects.select2();
	});
	//多条件查询版本
	$("#pop_versionSearch").click(function(){
		getCurrentPageObj().find(versionTable).bootstrapTable('refresh',{url:getVersionPopUrl()});
	});
	enterEventRegister("popModelQueryLevel1", function(){getCurrentPageObj().find("#pop_versionSearch").click();});
}
