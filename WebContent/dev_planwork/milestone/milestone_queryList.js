var themecall = getMillisecond();
initProjectModelInfo();
initQueryProjectModelButtonEvent();
//查询列表显示table
function initProjectModelInfo() {
	var model_id = $("#m_model_id").val();
	var model_name = $("#m_model_name").val();
	var is_use = $("#m_is_use").val();
	var project_type = $("#M_project_type").val();
	var child = $("#M_child").val();
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	$("#ProjectModelTableInfo").bootstrapTable(
			{
				//请求后台的URL（*）
				url : dev_planwork
						+ 'Milestone/queryAllProjectModel.asp?model_id='
						+ model_id + "&model_name=" + model_name + "&is_use="
						+ is_use + "&project_type=" + project_type + "&child="
						+ child + "&SID=" + SID + "&call=" + themecall,
				method : 'get', //请求方式（*）   
				striped : false, //是否显示行间隔色
				cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
				sortable : true, //是否启用排序
				sortOrder : "asc", //排序方式
				queryParams : queryParams,//传递参数（*）
				sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
				pagination : true, //是否显示分页（*）
				pageList : [10,15],//每页的记录行数（*）
				pageNumber : 1, //初始化加载第一页，默认第一页
				pageSize : 10,//可供选择的每页的行数（*）
				clickToSelect : true, //是否启用点击选中行
				uniqueId : "MODEL_ID", //每一行的唯一标识，一般为主键列
				cardView : false, //是否显示详细视图
				detailView : false, //是否显示父子表
				jsonpCallback : themecall,
				singleSelect: true,
				onLoadSuccess : function(){
					$('#ProjectModelTableInfo').find('tr').each(function(){
						var tdArr = $(this).children();
						tdArr.eq(5).attr('title','点击可修改状态');
					});
				},
				columns : [ {
					field: 'middle',
					checkbox: true,
					rowspan: 2,
					align: 'center',
					valign: 'middle'
				},{
					field : 'MODEL_ID',
					title : '模板编号',
					align : "center"
				}, {
					field : "MODEL_NAME",
					title : "模板名称",
					align : "center"
				}, {
					field : "PROJECT_TYPE_NAME",
					title : "项目类型",
					align : "center"
				}, {
					field : "CHILD_NAME",
					title : "子分类",
					align : "center"
				}, {
					field : 'ATTR_ID',
					visible : false,
					title : '模板属性配置ID'
				}, {
					field : "IS_USE_NAME",
					title : "模板状态",
					align : "center",
					formatter : function(value,row,index){
						if(value == '启用'){
							return "<a href='#' onclick='updateModelState(" + JSON.stringify(row) + ")'>启用</a>";
						}else{
							return "<a href='#' onclick='updateModelState(" + JSON.stringify(row) + ")'>停用</a>";
						}
					}
				}, {
					field : "DESCRIPTION",
					title : "说明",
					align : "center"
				}, {
					field : "CREATE_TIME",
					title : "创建时间",
					align : "center"
					},
//					{
//						field : "",
//						title : "操作",
//						align : "center",
//						formatter : function(value, row, index) {
//							return "<a href='#' onclick='deleteProjectModel("
//									+ JSON.stringify(row)
//									+ ")'>删除</a>";
//						}
//					}
					]
			});
};
initSelectVal();
//下拉框方法
function initSelectVal(){
	//初始化模板状态数据
	initSelect($("#m_is_use"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"SYS_DIC_IS_USE"});
	initSelect($("#is_use"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"SYS_DIC_IS_USE"},"01");
	//初始化项目类型数据
	initSelect($("#M_project_type"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"SYS_DIC_MILESTONE_PROJECT_TYPE"});
}
//改变项目类型，动态加载子分类下拉框的值
function change_ProjectType(obj){
	$("#M_child").val("");
	$("#M_child").select2();
	$("#M_child").empty();
	initSelect($("#M_child"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:$(obj).val()});
	$("#M_child").attr("disabled",false);
}
//改变里程碑模板状态，启用或停用
function updateModelState(row,is_use){
	var model_id = row.MODEL_ID;
	var is_use = row.IS_USE;
	is_use == '01' ? is_use = '00' : is_use = '01';
	var call = getMillisecond();
	var url = dev_planwork + 'Milestone/updateModelState.asp?SID=' + SID + "&call=" + call;
	baseAjaxJsonp(url, {
		model_id : model_id,
		is_use : is_use,
	}, function(msg) {
		if (msg.result == "true") {
			if(is_use == '01'){
				if(msg.iSuse == "true"){
					alert("该模板属性在其他模板被使用，该模板禁止启用！");
				}else{
					alert("该模板被成功启用！");
				}
			}else{
				alert("该模板被成功停用！");
			}
			$("#queryProjectModel").click();
		} else {
			alert("系统异常，请稍后！");
		}
	}, call);
}
//页面按钮事件
function initQueryProjectModelButtonEvent(){
	//查询按钮事件
	$("#queryProjectModel").click(
			function() {
				var model_id = $("#m_model_id").val();
				var model_name = $("#m_model_name").val();
				var is_use = $.trim($("#m_is_use").val());
				var project_type = $.trim($("#M_project_type").val());
				var child = $.trim($("#M_child").val());
				$('#ProjectModelTableInfo').bootstrapTable('refresh',{url:dev_planwork
					+ 'Milestone/queryAllProjectModel.asp?model_id='
					+ model_id + "&model_name=" + escape(encodeURIComponent(model_name)) + "&is_use="
					+ is_use + "&project_type=" + escape(encodeURIComponent(project_type)) + "&child="
					+ child + "&SID=" + SID + "&call=" + themecall});
			});
	enterEventRegister(getCurrentPageObj().attr("class"), function(){getCurrentPageObj().find("#queryProjectModel").click();});
	//重置按钮事件
	$("#resetProjectModel").click(function() {
		$("input[name^='M.']").val("");
		$("select[name^='M.']").val(" ");
		$("#m_is_use").val(" ");
		$("#m_is_use").select2();
		$("#M_project_type").val(" ");
		$("#M_project_type").select2();
		$("#M_child").val(" ");
		$("#M_child").select2();
		$("#M_child").attr("disabled",true);
	});
		//新增模板
		$("#addMilestoneModel").click(
			function() {
				openInnerPageTab("milestone_add", "新增里程碑模板",
						"dev_planwork/milestone/milestone_add.html",
						function() {
							$("#add_projectModelForm").attr("model_id","");
							$("#modelSpan").html("模板信息");
						});
			});
		//修改模板
		$("#editMilestoneModel").click(function(){
			var selRow = $('#ProjectModelTableInfo').bootstrapTable("getSelections");
			if (selRow.length == 1) {
				var model_id = selRow[0].MODEL_ID;
				var model_name = selRow[0].MODEL_NAME;
				var is_use = selRow[0].IS_USE;
				var description = selRow[0].DESCRIPTION;
				if(is_use == "00"){
					alert("该模板已被停用，不可修改！");
					return;
				}
				
				openInnerPageTab("milestone_add", "修改里程碑模板",
						"dev_planwork/milestone/milestone_add.html",
						function() {
							$("#update_projectModelForm").attr("model_id",model_id);
							$("#modelSpan").html("模板编号：" + model_id);
							$("#P_model_name").val(model_name);
							$("#P_description").val(description);
							//加载该模板已经配置的属性列表
							queryMilestoneAttrList(model_id);
							//查询模板已经配置的里程碑信息
							queryMilestoneList(model_id);
						});
			}else{
				alert("请选择一条数据进行操作!");
				return ;
			}
			
		});
}
	
