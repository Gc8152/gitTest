//初始化处室和项目组方法
function initSystemPopOrgandGroupEvent(){
	getCurrentPageObj().find("#O_business_dept_name").unbind("click");
	getCurrentPageObj().find("#O_business_dept_name").click(function(){
		openSelectTreeDiv($(this),"systemPop_tree_id_org","SOrg/queryorgtreelist.asp",{"margin-top":"26px","margin-left":"130px", width:"176px",height:"200px"},function(node){
			getCurrentPageObj().find("#O_business_dept_name").val(node.name);
			getCurrentPageObj().find("#O_business_dept_id").val(node.id);
		});
	});
	/*getCurrentPageObj().find("#P_project_group_name").unbind("click");
	getCurrentPageObj().find("#P_project_group_name").click(function(){
		openSelectTreeDiv($(this),"systemPop_tree_id_group","SOrg/queryorgtreelist.asp",{"margin-top":"26px","margin-left":"130px", width:"176px",height:"200px"},function(node){
			getCurrentPageObj().find("#P_project_group_name").val(node.name);
			getCurrentPageObj().find("#P_project_id").val(node.id);
		});
	});*/
}

/**
 * 获取组装查询url
 * @returns
 */
function getSystemPopUrl(queryParam) {
	var condition = getCurrentPageObj().find("#pop_sys_condition [name]");
	var url = dev_outsource + 'outperson/queryApplication.asp?SID='+SID;
	for(var i=0; i<condition.length; i++) {
		var obj = $(condition[i]);
		var id=obj.attr("id");
		if("res_group_name"==id&&$.trim(obj.val()) != ""){
			url+='&res_group_name='+escape(encodeURIComponent(getCurrentPageObj().find("#res_group_name option:selected").text()));
		}else if($.trim(obj.val()) != ""){
			url+='&'+obj.attr("name").substring(2)+"="+escape(encodeURIComponent(obj.val()));
		}
	}
	return url+(getCurrentPageObj()[0].sysparam||"")+(queryParam||"");
}
/**
 * 打开应用模态框
 * @param id	增加模态框的div的id
 * @param callparams 传给bootstraptable中的参数
 */
function openSystemPop(id,callparams){
	getCurrentPageObj().find('#myModal_system').remove();	
	getCurrentPageObj().find("#"+id).load("dev_outsource/outsource/outperson/systemPop.html",{},function(){
		getCurrentPageObj().find("#myModal_system").modal("show");
		initSystemPop("#pop_systemTable", getSystemPopUrl(callparams.queryParam), callparams);
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
function initSystemPop(systemTable,systemUrl,systemParam){
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
							if(systemParam.func_call){
								systemParam.func_call(row);
							}
					},
					onLoadSuccess:function(data){
					},
					columns : [  
					{
						field : 'SYSTEM_ID',
						title : '应用编号',
						align : "center",
					},{
						field : "SYSTEM_NAME",
						title : "应用名称",
						align : "center"
					}, {
						field : "SYSTEM_SHORT",
						title : "应用简称",
						align : "center"
					},/*{
						field : 'BUSINESS_DEPT_NAME',
						title : '所属部门',
						align : "center",
					},*/{
						field : "RES_GROUP_NAME",
						title : "负责组",
						align : "center"
					}, {
						field : "PROJECT_MAN_NAME",
						title : "应用负责人",
						align : "center"
					}/*,{
						field : "IS_SECIENTIFIC_MANAGEMENT",
						title : "是否科技管理",
						align : "center",
						formatter:function(value,row,index){if(value=="00"){return "是";}return "否";}
					}*/]
			});
	//应用POP重置
	getCurrentPageObj().find("#pop_systemReset").unbind("click").click(function(){
		getCurrentPageObj().find("#pop_sys_condition input[type!='button']").val("");
		var selects = getCurrentPageObj().find("#pop_sys_condition select");
		selects.val(" ");
		selects.select2();
	});
	//多条件查询应用
	getCurrentPageObj().find("#pop_systemSearch").unbind("click").click(function(){
		getCurrentPageObj().find(systemTable).bootstrapTable('refresh',{url:getSystemPopUrl(systemParam.queryParam)});
	});
	enterEventRegister("popModelQueryLevel1", function(){getCurrentPageObj().find("#pop_systemSearch").click();});
	baseAjaxJsonpNoCall(dev_construction+"requirement_accept/queryUserByRoleNo.asp?role_no=0082&limit=10&offset=0", {}, function(data){
		var elem=getCurrentPageObj().find("#res_group_name");
		elem.append('<option value=" ">请选择</option>');	
		if(data&&data.rows&&data.rows.length>0){
			for(var i=0;i<data.rows.length;i++){
				var value=data.rows[i]["ORG_CODE"];
				var name=data.rows[i]["ORG_NAME"];
				elem.append('<option value="'+value+'">'+name+'</option>');	
			}
		}
		elem.val(" ");
		elem.select2();
	});
}
