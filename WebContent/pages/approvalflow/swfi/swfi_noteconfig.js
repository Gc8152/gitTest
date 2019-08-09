var callTable = getMillisecond();
//初始化节点配置页面
function initNotePage(item){
	initAFDetail(item);
	nodeConfigPageInit(item.AF_ID);
}
//加载页面流程表单数据
function initAFDetail(item){
	getCurrentPageObj().find("#AF_NAME").text(item.AF_NAME);
	getCurrentPageObj().find("#A_SYS_NAME").text(item.A_SYS_NAME);
	getCurrentPageObj().find("#A_STATE").text(item.A_STATE);
	getCurrentPageObj().find("#af_id").val(item.AF_ID);
}
function addrole(){
	alert();
}
function nodeConfigPageInit(af_id){
	var queryParams = function(params) {
		var temp = {
			limit : params.limit, // 页面大小
			offset : params.offset
		};
		return temp;
	};
	//初始化业务系统下拉框
	initSelect(getCurrentPageObj().find("#af_sys_name"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"AF_DIC_SYSTEM"});
	//初始化流程状态
	initSelect(getCurrentPageObj().find("#af_state"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"AF_DIC_STATE"});
	$('#noteInfoTable').bootstrapTable("destroy").bootstrapTable({
		url : "AFConfig/queryAllAFNode.asp?af_id=" + af_id+'&call='+callTable, // 请求后台的URL（*）
		method : 'get', // 请求方式（*）
		striped : true, // 是否显示行间隔色
		cache : false, // 是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
		pagination : true, // 是否显示分页（*）
		sortable : false, // 是否启用排序
		sortOrder : "asc", // 排序方式
		queryParams : queryParams, // 传递参数（*）
		sidePagination : "server", // 分页方式：client客户端分页，server服务端分页（*）
		pageNumber : 1, // 初始化加载第一页，默认第一页
		pageSize : 10, // 每页的记录行数（*）
		pageList : [ 5, 10 ], // 可供选择的每页的行数（*）
		strictSearch : true,
		clickToSelect : true, // 是否启用点击选中行
		uniqueId : "N_ID", // 每一行的唯一标识，一般为主键列
		cardView : false, // 是否显示详细视图
		detailView : false, // 是否显示父子表
		jsonpCallback:callTable,
		singleSelect : true,
		radio : true,
		columns : [{
			field : 'state',
			checkbox : true,
			rowspan : 2,
			align : 'center',
			valign : 'middle'
		}, {
			field : 'N_NAME',
			title : '节点名称',
			align : "center"
		}, {
			field : "N_TYPE_NAME",
			title : "节点类型",
			align : "center"
		}, {
			field : "N_STATE_NAME",
			title : "节点启用状态",
			align : "center"
		}, {
			field : "OPT_PERSONNAME",
			title : "操作人",
			align : "center"
		}, {
			field : "OPT_TIME",
			title : "操作时间",
			align : "center"
		}]
	});
	//新增节点
	$("#addAFNote").click(function(){
      
		initVlidate($("#addNoteInfoModalForm"));
		//显示节点模态框 
		$("#gridSystemModalLabelUpdate").hide();
		$("#updatePOPNote").hide();
		$("#gridSystemModalLabelAdd").show();
		$("#addPOPNote").show();
		$("#add_n_name").val("");
		$("#add_n_roleName").val("");
		$("#add_n_roleCode").val("");
		$("#add_memo").val("");
	    //初始化节点审批人
		$("#factor").prop("checked",true);
		$("#role").prop("checked",false);
		$("#factor").prop("disabled",false);
		$("#add_n_roleCode").val("");
		$("#add_n_roleName").val("");
		$(".role").hide();
		
		var add_n_person=getCurrentPageObj().find("input[name='add_n_person']:checked");
		if(add_n_person.val()=='02'){
			$(".role").show();
		}else{
			$(".role").hide();
		}
		$('#addNoteInfoModalPOP').modal('show');
		//节点类型初始化
		initSelect(getCurrentPageObj().find("#add_n_type"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"AF_DIC_NODE_TYPE"});
		//节点启用停用状态
		initSelect(getCurrentPageObj().find("#add_n_state"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"AF_DIC_STATE"},"00");		
		var n_factor=getCurrentPageObj().find("#add_n_factor");
		n_factor.empty();
		n_factor.append('<option value="">'+'请选择'+'</option>');	
		baseAjaxJsonp("AFNode/queryNodeFactorById.asp?af_id="+af_id,null,function(data) {
			if(data!=undefined){
				for(var i=0;i<data.rows.length;i++){
					n_factor.append('<option value="'+data.rows[i].B_CODE+'">'+data.rows[i].B_NAME+'</option>');	
				}
				n_factor.select2();
			}
		});				
	});
	//节点类型内容发生变化时触发的事件
	$("#add_n_type").on("change", function (e) {
		var options=$(this).val();
		if(options=="01"){
			$("#role").prop("checked",true);
			$("#factor").prop("checked",false);
			$("#factor").prop("disabled",true);
			$(".role").show();
			$("#add_n_factor").removeAttr("validate");
			$("#add_n_factor").siblings("strong[class^='high']").remove();
			var validateId=$("#add_n_factor").attr("validateid");
			$("#"+validateId).css("display","none");
		}else {
			$("#factor").prop("checked",true);
			$("#role").prop("checked",false);
			$("#factor").prop("disabled",false);
			$("#add_n_roleCode").val("");
			$("#add_n_roleName").val("");
			$(".role").hide();
			$("#add_n_factor").attr("validate","v.required");
			initVlidate($("#addNoteInfoModalForm"));
		}
	});
	$(".n_person").change(function(){
		var add_n_person=$("input[name='add_n_person']:checked");
		if(add_n_person.val()=='02'){
			$(".role").show();
			$("#add_n_factor").removeAttr("validate");
			$("#add_n_factor").siblings("strong[class^='high']").remove();
			var validateId=$("#add_n_factor").attr("validateid");
			$("#"+validateId).css("display","none");
		}else{
			$("#add_n_roleCode").val("");
			$("#add_n_roleName").val("");
			$(".role").hide();
			$("#add_n_factor").attr("validate","v.required");
			initVlidate($("#addNoteInfoModalForm"));
		}
		
	});	
	//角色pop框
	$("#add_n_roleName").click(function(){
		openAllRolePop("rolePop",{name:$("#add_n_roleName"),no:$("#add_n_roleCode")},"","add");
	});
	//修改节点
	$("#updateAFNote").click(function(){
		var n_id = "";
		var selRow = $('#noteInfoTable').bootstrapTable("getSelections");
		if(selRow.length == 1){
			n_id = selRow[0].N_ID;
			initVlidate($("#addNoteInfoModalForm"));
			$("#gridSystemModalLabelUpdate").show();
			$("#updatePOPNote").show();
			$("#gridSystemModalLabelAdd").hide();
			$("#addPOPNote").hide();
			//显示节点模态框
			$('#addNoteInfoModalPOP').modal('show');
			//节点类型初始化
			initSelect(getCurrentPageObj().find("#add_n_type"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"AF_DIC_NODE_TYPE"});
			//节点启用停用状态
			initSelect(getCurrentPageObj().find("#add_n_state"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"AF_DIC_STATE"});
			var n_factor=getCurrentPageObj().find("#add_n_factor");
			n_factor.empty();
			n_factor.append('<option value="">'+'请选择'+'</option>');	
			baseAjaxJsonp("AFNode/queryNodeFactorById.asp?af_id="+af_id,null,function(data) {
				if(data!=undefined){
					for(var i=0;i<data.rows.length;i++){
						n_factor.append('<option value="'+data.rows[i].B_CODE+'">'+data.rows[i].B_NAME+'</option>');	
					}
					n_factor.select2();
				}
			});	
			setTimeout(function(){
				initNodeInfoPOP(n_id);
			},333);
			
		}else{
			alert("请选择一条数据");
			return;
		}
	});
	//删除节点
	$("#deleteAFNote").click(function(){
		var af_id = $('#af_id').val();
		var selRow = $('#noteInfoTable').bootstrapTable("getSelections");
		if(selRow.length > 0){
			nconfirm("确定要删除这"+selRow.length+"条记录吗？",function(){
				n_id = selRow[0].N_ID;
				baseAjax("AFNode/deleteNodeInfo.asp?n_id="+n_id,null,function(data){
					var result = data.result;
					if(result == "true"){
						alert("删除成功");					
						$('#noteInfoTable').bootstrapTable('refresh');
					}else{
						alert("删除失败");
					}
				});
			});
		}else{
			alert("请选择要删除的数据");
			return ;
		}
	});
	//模态框下的新增
	$("#addPOPNote").click(function(){
		operateNodeInfo("add");
		$("#factor").prop("disabled",false);
	});
	//模态框下的修改
	$("#updatePOPNote").click(function(){
		operateNodeInfo("update");
	});
	//节点模态框下的取消按钮
	$("#addCancelBtn").click(function(){
		$('#addNoteInfoModalPOP').modal('hide');
	});
	$("#updateCancelBtn").click(function(){
		$('#updateNoteInfoModalPOP').modal('hide');
	});
}
function closeNoteInfoModalPOP(id,id2){
	$('#'+id).modal('hide');
	reSetForm(id2);
}
//页面返回按钮
$("#goBackafList").click(function(){
	closeCurrPageTab();
});
var rote_v ="";
//节点增改函数
function operateNodeInfo(operate){
	if(operate == 'add'){
		var inputs = $("input[name^='add.']");
		var selects = $("select[name^='add.']");
		var textareas = $("textarea[name^='add.']");
		var params = {};
		inputs.each(function(){			
				params[$(this).attr("name").substr(4)] = $(this).val();				
		});
		selects.each(function(){
			params[$(this).attr("name").substr(4)] = $(this).val();
		});
		textareas.each(function(){
			params[$(this).attr("name").substr(4)] = $(this).val();
		});
		params['af_id'] = getCurrentPageObj().find("#af_id").val();
		params[$("input[name='add_n_person']:checked").attr("name").substr(4)] = $("input[name='add_n_person']:checked").val();
		var bool = vlidate($("#addNoteInfoModalForm"));
		if(bool){
			baseAjax("AFNode/addNodeInfo.asp", params, function(data) {
				var result = data.result;
				if(result == "true"){
					alert("添加成功");
					$('#noteInfoTable').bootstrapTable('refresh');
					$('#addNoteInfoModalPOP').modal('hide');
				}else{
					alert("添加失败");
				}
			});
		}
	}else if(operate == 'update'){
		var inputs = $("input[name^='add.']");
		var selects = $("select[name^='add.']");
		var textareas = $("textarea[name^='add.']");
		var params = {};
		inputs.each(function(){			
				params[$(this).attr("name").substr(4)] = $(this).val();				
		});
		selects.each(function(){
			params[$(this).attr("name").substr(4)] = $(this).val();
		});
		textareas.each(function(){
			params[$(this).attr("name").substr(4)] = $(this).val();
		});
		params['af_id'] = $("#af_id").val();
		params[$("input[name='add_n_person']:checked").attr("name").substr(4)] = $("input[name='add_n_person']:checked").val();
		var bool = vlidate($("#addNoteInfoModalForm"));
		if(bool){
			baseAjax("AFNode/updateNodeInfo.asp", params, function(data) {
		    	var result = data.result;
				if(result == "true"){
					alert("修改成功");
					$('#noteInfoTable').bootstrapTable('refresh');
					$('#addNoteInfoModalPOP').modal('hide');
				}else{
					alert("操作失败");
				}
			});
		}
	}
}

//节点修改POP框表单数据初始化函数
function initNodeInfoPOP(n_id){
	getCurrentPageObj().find("#addNoteInfoModalForm input[name!='add_n_person']").val("");
	getCurrentPageObj().find("#addNoteInfoModalForm textarea").val("");
	getCurrentPageObj().find("#addNoteInfoModalForm select").val("");
	getCurrentPageObj().find("#addNoteInfoModalForm select").select2();
	var url = "AFNode/queryOneNodeById.asp?n_id="+n_id;
	baseAjax(url, null, function(dicData){
//[{N_ROLENAME=系统管理员, N_ROLECODE=admin, AF_ID=10, N_PERSON=02, OPT_TIME=2017-04-26 16:43:25, N_TYPE=01, N_STATE=00, N_NAME=需求设计中心, N_FACTOR=n_dmanager, OPT_PERSON=0, N_ID=44}]
		for(var v in dicData){
			if(v=="N_ROLECODE"){
				$("input[name='add.n_roleCode']").val(dicData[v]);
			}else if(v=="N_ROLENAME"){
				$("input[name='add.n_roleName']").val(dicData[v]);
			}else if(v=="N_PERSON"){
				if(dicData[v]=='01'){
				  getCurrentPageObj().find("input[name='add_n_person'][value='01']").click();
				  $(".role").hide();
				}else{
				  getCurrentPageObj().find("input[name='add_n_person'][value='02']").click();		  
				  $(".role").show();
				  $("input[name='add.n_roleCode']").val(dicData["N_ROLECODE"]);
				  $("input[name='add.n_roleName']").val(dicData["N_ROLENAME"]);
				}				
			}else if(v=="N_FACTOR"){
				setSelected($("#add_n_factor"),dicData["N_FACTOR"]);
			}else{
				
			$("input[name='add."+v.toLowerCase()+"']").val(dicData[v]);
			$("select[name='add."+v.toLowerCase()+"']").val(dicData[v]).select2();			
			$("textarea[name='add."+v.toLowerCase()+"']").val(dicData[v]);
			}
		}
		var options=$("#add_n_type").val();
		//if(options=="01"||options=="02"){
		if(options=="01"){
			$("#factor").prop("disabled",true);
		}else {
			$("#factor").prop("disabled",false);
		}
	});
}
//加载节点要素列表
function initeNodeElementTable(af_id){
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	$("#nodeModalTabList").bootstrapTable("destroy").bootstrapTable(
		{
			//请求后台的URL（*）
			url : 'AFNode/queryNodeFactorById.asp?af_id='+af_id,
			method : 'get', //请求方式（*）   
			striped : true, //是否显示行间隔色
			cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
			sortable : true, //是否启用排序
			sortOrder : "asc", //排序方式
			queryParams : queryParams,//传递参数（*）
			sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
			//pagination : true, //是否显示分页（*）
			//pageList : [5,10],//每页的记录行数（*）
			pageNumber : 1, //初始化加载第一页，默认第一页
			pageSize : 10,//可供选择的每页的行数（*）
			clickToSelect : true, //是否启用点击选中行
			uniqueId : "B_CODE", //每一行的唯一标识，一般为主键列
			cardView : false, //是否显示详细视图
			detailView : false, //是否显示父子表
			singleSelect: false,
			columns : [{
				field : 'B_CODE',
				title : '节点要素编号',
				align : "center"
			}, {
				field : 'B_NAME',
				title : '节点要素名称',
				align : "center"
			}, {
				field : "SYSTEM_CODE_NAME",
				title : "所属业务系统",
				align : "center"
			}, {
				field : "B_STATE_NAME",
				title : "启用状态",
				align : "center"
			}, {
				field : "OPT_PERSONNAME",
				title : "操作人",
				align : "center"
			}, {
				checkbox:true,
				title:"选择",
				align: 'center',
				valign: 'middle',
				formatter:checkedFormatter
			}]
		});
}
function checkedFormatter(value, row, index) {
	var rote_vs=rote_v.split(",");
	for(var i=0;i<=index;i++){
		if(row.B_CODE===rote_vs[i]){//===不做类型比较，类型不同一定不等
			return {
                checked: true
			};
		}
	}
	return value;
}
function reSetForm(id){
	getCurrentPageObj().find("#"+id+" input").val("");
	getCurrentPageObj().find("#"+id+" textarea").val("");
	getCurrentPageObj().find("#"+id+" select").val("");
	getCurrentPageObj().find("#"+id+" select").select2();
}
$.fn.modal.Constructor.prototype.enforceFocus = function () {};