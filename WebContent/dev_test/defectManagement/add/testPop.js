

/**
 * 获取组装查询url
 * @returns
 */
function getTestPopUrl(id) {
	var condition = getCurrentPageObj().find("#pop_test_condition [name]");
	var url = dev_test+"addDefect/queryCaseInfo.asp?SID=" + SID+"&func_id="+id;
	for(var i=0; i<condition.length; i++) {
		var obj = $(condition[i]);
		if($.trim(obj.val()) != ""){
			url+='&'+obj.attr("name")+"="+escape(encodeURIComponent(obj.val()));
		}
	}
	return url;
}
/**
 * 打开应用模态框
 * @param id	增加模态框的div的id
 * @param callparams 传给bootstraptable中的参数
 */
function openTestPop(id,callparams,func_id){
	getCurrentPageObj().find('#testmodel').remove();	
	getCurrentPageObj().find("#"+id).load("dev_test/defectManagement/add/testPop.html",{},function(){
		getCurrentPageObj().find("#testmodel").modal("show");
		initTestPop("#pop_caseTable", getTestPopUrl(func_id), callparams);
//		initSystemPopOrgandGroupEvent();
		//初始化字典项
//		initSelect($("#P_is_important"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_IS_INSTANCY"});
//		initSelect($("#P_system_status"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_SYSTEM_STATUS"});
		//$("select").select2();
		
	});
	
}

/**
 * 初始化应用模态框
 */
function initTestPop(systemTable,systemUrl,systemParam){
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
					uniqueId : "CASE_ID", // 每一行的唯一标识，一般为主键列
					cardView : false, // 是否显示详细视图
					detailView : false, // 是否显示父子表
					singleSelect : true,// 复选框单选
					onDblClickRow:function(row){	//双击行事件
							getCurrentPageObj().find('#testmodel').modal('hide');
							if(systemParam.id){
								systemParam.id.val(row.CASE_ID);
							}
							if(systemParam.name){
								systemParam.name.val(row.CASE_NAME);
							}
							if(systemParam.func_call){
								var url=dev_test+"addDefect/queryOptByCaseId.asp?"+"SID=" + SID + "&call=" + systemParam.realCall + "&CASE_ID="+row.CASE_ID;
								systemParam.func_call(url);
							}
							if(systemParam.selectCaseType){
								systemParam.selectCaseType(row.CASE_TYPE1);
							}
							//是否新应用
							//getCurrentPageObj().find("input[name='is_new_system'][value='"+row.IS_NEW_SYSTEM+"']").click();
//							if(row.IS_NEW_SYSTEM == '00') {
//								getCurrentPageObj().find("#is_new_system").val("是");
//							} else {
//								getCurrentPageObj().find("#is_new_system").val("否");
//							}
//							var system_id = getCurrentPageObj().find("#system_id").val();
//							var versions_id = getCurrentPageObj().find("#versions_id").val();
//							refreshSendProSvnOrFtp(row.IS_CC);
//							//双击模态框后，检查应用和版本都存在的时候查询相关的任务
//							if(system_id && versions_id) {
//								//checkThisApplyIsExist(system_id, versions_id);
//								freshSendProContent(system_id, versions_id);
//								initqueryInterfaceSend_Add(system_id, versions_id);
//							}else{
//								getCurrentPageObj().find('#sendProInstancyContent').bootstrapTable("removeAll");
//							}
					},
					onLoadSuccess:function(data){
					},
					columns : [  
					{
						field : 'CASE_NUM',
						title : '案例编号',
						align : "center",
						//visible: false
					}, {
						field : 'CASE_NAME',
						title : '案例名称',
						align : "center",
						//visible : false
					} , {
						field : 'TESTPOINT_NAME',
						title : '测试检查要点',
						align : "center",
						width : "300"
						//visible : false
					} ]
			});
	//应用POP重置
	getCurrentPageObj().find("#pop_testReset").click(function(){
		getCurrentPageObj().find("#pop_test_condition input").val("");
	});
	//重置案例
	getCurrentPageObj().find("#testReset").click(function(){
		getCurrentPageObj().find('#testmodel').modal('hide');
		getCurrentPageObj().find("[name='IU.TESTPOINT_NAME']").val("");
		getCurrentPageObj().find("[name='IU.TESTPOINT_ID']").val("");
		selectCaseType("");
	});
	//多条件查询应用
	getCurrentPageObj().find("#pop_testSearch").click(function(){
		var func_id = getCurrentPageObj().find("[name='IU.FUNCPOINT_ID']").val();
		getCurrentPageObj().find(systemTable).bootstrapTable('refresh',{url:getTestPopUrl(func_id)});
	});
	enterEventRegister("popModelQueryLevel1", function(){getCurrentPageObj().find("#pop_testSearch").click();});
}
