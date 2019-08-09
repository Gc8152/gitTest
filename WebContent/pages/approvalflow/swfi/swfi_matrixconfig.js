var callTable = getMillisecond();
//初始化节点配置页面
function initmatrixPage(item){
	initAFDetail(item);
	initMatrixInfoPage(item.AF_ID);
}
//加载页面流程表单数据
function initAFDetail(item){
	getCurrentPageObj().find("#AF_NAME").text(item.AF_NAME);
	getCurrentPageObj().find("#A_SYS_NAME").text(item.A_SYS_NAME);
	getCurrentPageObj().find("#A_STATE").text(item.A_STATE);
	getCurrentPageObj().find("#af_id").val(item.AF_ID);
}
/*------------------------------------------审批矩阵基本信息------------------------------------------*/
//初始化矩阵table
function initMatrixInfoPage(af_id) {
	var queryParams=function(params){
		var temp={
			limit: params.limit, //页面大小
			offset: params.offset //页码
		};
		return temp;
	};
	$("#matixTableInfo").bootstrapTable(
		{
			//请求后台的URL（*）
			url :'AFConfig/queryMatrixById.asp?af_id='+af_id+'&call='+callTable,
			method : 'get', //请求方式（*）   
			striped : true, //是否显示行间隔色
			cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
			sortable : true, //是否启用排序
			sortOrder : "asc", //排序方式
			queryParams : queryParams,//传递参数（*）
			sidePagination : "server",//分页方式：client客户端分页，server服务端分页（*）
			pagination : true, //是否显示分页（*）
			pageList : [5,10],//每页的记录行数（*）
			pageNumber : 1, //初始化加载第一页，默认第一页
			pageSize : 10,//可供选择的每页的行数（*）
			clickToSelect : true, //是否启用点击选中行
			uniqueId : "M_ID", //每一行的唯一标识，一般为主键列
			cardView : false, //是否显示详细视图
			detailView : false, //是否显示父子表
			jsonpCallback:callTable,
			singleSelect: true,
			columns : [ 
			{	
				checkbox:true,
				rowspan: 2,
				align: 'center',
				valign: 'middle'
			},{
				field: 'R_NAME',
				title : '矩阵规则名称',
				align: 'center'
			},{
				field : 'M_NAME',
				title : '节点集合',
				align : "center"
			}, {
				field : 'M_STATE_NAME',
				title : '矩阵启用状态',
				align : "center" 
			}, {
				field : "operation",
				title : "操作",
				align : "center",
				formatter:function(value,row,index){
					 var cfi_edit="<a style='color:#0088cc; cursor:pointer;' onclick=configAFButton('"+index+"');>配置流程</a>";
					 return cfi_edit;
				 }
			}]
	});
	//矩阵POP框新增保存按钮
	$("#addPOPMatrix").click(function (){
		operateMatrixInfo("add");
	});
	//矩阵POP框修改保存按钮
	$("#updatePOPMatrix").click(function (){
		operateMatrixInfo("update");
	});
	//模态框下的取消按钮
	getCurrentPageObj().find("#cancelBtn").click(function(){
		$('#matrixInfoModalPOP').modal('hide');
		reSetForm('matrixInfoModalPOPForm');
	});
};
//增加矩阵按钮（弹出摸态框）
$("#addMatix").click(function(){
	initVlidate($("#matrixInfoModalPOPForm"));
	$("#gridMatrixModalLabelAdd").show();
	$("#gridMatrixModalLabelUpdate").hide();
	$("#addPOPMatrix").show();
	$("#updatePOPMatrix").hide();
	//显示矩阵摸态框
	$("#matrixInfoModalPOP").modal("show");
	//矩阵状态初始化
	initSelect(getCurrentPageObj().find("#m_state"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"AF_DIC_STATE"},"00");
	//获取流程id
	var af_id = $("#af_id").val();
	//初始化table
	initeNodeModlTable(af_id);
});
//矩阵修改POP框表单数据初始化函数
function initMatrixInfoPOP(af_id,m_id){
	var url = "AFConfig/queryMatrixById.asp?af_id="+af_id+"&m_id="+m_id;
	baseAjaxJsonp(url, null, function(data){
		$("#r_name").val(data["rows"][0].R_NAME);
/*		$("#r_id").val(data.R_ID);
		$("#m_id").val(data.M_ID);*/
		getCurrentPageObj().find("#r_exp").val(data["rows"][0].R_EXP);
		setTimeout(function(){
			getCurrentPageObj().find('#m_state').val(data["rows"][0].M_STATE+"");
			getCurrentPageObj().find('#m_state').select2();
		},200);
	});
}
//修改审批矩阵
var m_rote_v ="";
$("#updateMatix").click(function(){
	var data = $('#matixTableInfo').bootstrapTable("getSelections");
	if(data.length > 0){
		var n_ids = data[0].N_IDS;
		var af_id = data[0].AF_ID;
		var m_id = data[0].M_ID;
		var r_id = data[0].R_ID;
		$("#m_id").val(m_id);
		$("#r_id").val(r_id);
		m_rote_v = n_ids;
		initVlidate($("#matrixInfoModalPOPForm"));
		$("#gridMatrixModalLabelAdd").hide();
		$("#gridMatrixModalLabelUpdate").show();
		$("#addPOPMatrix").hide();
		$("#updatePOPMatrix").show();
		//显示矩阵摸态框
		$("#matrixInfoModalPOP").modal("show");
		//矩阵状态初始化
		initSelect(getCurrentPageObj().find("#m_state"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"AF_DIC_STATE"});
		initMatrixInfoPOP(af_id,m_id);
		//初始化列表
		setTimeout(function(){
			initeNodeModlTable(af_id);
		},200);
	}else{
		alert("请选择要修改的数据");
	}
});
//删除审批矩阵
$("#deleteMatix").click(function(){
	var selRow = $('#matixTableInfo').bootstrapTable("getSelections");
	if(selRow.length > 0){
		nconfirm("确定要删除这"+selRow.length+"条记录吗？",function () {
			var r_id = selRow[0].R_ID;
			var m_id = selRow[0].M_ID;
			baseAjax("AFConfig/deleteOneMatInfo.asp?r_id="+r_id+"&m_id="+m_id,null,function(data){
				var result = data.result;
				if(result == "true"){
					alert("删除成功");
					$('#matixTableInfo').bootstrapTable('refresh');
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

//矩阵新增及修改调用函数
function operateMatrixInfo(operate){
	if(operate == 'add'){
		//获取流程id
		var af_id = $("#af_id").val();
		//获取输入框数据
		var modl_r_name = $.trim($("#r_name").val());
		var modl_r_exp = $.trim($("#r_exp").val());
		var modl_m_state = $.trim($("#m_state").val());
		//获取选中节点数据
		var records = $("#matrixModalTabList").bootstrapTable('getSelections');
		if(records<=0){
			alert("矩阵节点不能为空！");
			return;
		}
		//获取选中记录的所有节点名称
		var modl_n_name = $.map(records, function (row) {
			return row.N_NAME;                  
		});
		//获取选中记录的所有节点id
		var modl_n_id = $.map(records, function (row) {
			return row.N_ID;                  
		});
		var params={"records":JSON.stringify(records),"af_id":af_id,"r_name":modl_r_name,
				"r_exp":modl_r_exp,"m_state":modl_m_state};
		var bool = vlidate($("#matrixInfoModalPOPForm"));
		if(bool){
			//ajax请求发送参数到后台插入数据库表
			baseAjax("AFConfig/addOneMatrixInfo.asp?n_id="+
					escape(encodeURIComponent(modl_n_id))+"&n_name="+
					escape(encodeURIComponent(modl_n_name)),params, function(data) {
		    	if (data != undefined && data != null && data.result == "true") {
		    		alert("添加成功");
					$("#matixTableInfo").bootstrapTable('refresh');
		    		$("#matrixInfoModalPOP").modal("hide");
		    		reSetForm('matrixInfoModalPOPForm');
				}else{
					alert("操作失败");
				}
			});
		}
	}else if(operate == 'update'){
		var af_id = $("#af_id").val();
		var r_id = $("#r_id").val();
		var m_id = $("#m_id").val();
		//获取输入框数据
		var modl_r_name = $.trim($("#r_name").val());
		var modl_r_exp = $.trim($("#r_exp").val());
		var modl_m_state = $.trim($("#m_state").val());
		//$("#up_submitModlMatrix").unbind("click");
		//获取选中节点数据
		var records = $("#matrixModalTabList").bootstrapTable('getSelections');
		var params={"records":JSON.stringify(records),"af_id":af_id,"r_name":modl_r_name,
				"r_exp":modl_r_exp,"r_id":r_id,"m_state":modl_m_state};
		var bool = vlidate($("#matrixInfoModalPOPForm"));
		if(bool){
			//ajax请求发送参数到后台插入数据库表
			baseAjax("AFConfig/updateOneMatrixInfo.asp?m_id="+
					escape(encodeURIComponent(m_id)),params, function(data) {
	        	if (data != undefined && data != null && data.result == "true") {
	        		alert("修改成功");
					$("#matixTableInfo").bootstrapTable('refresh');
					$("#matrixInfoModalPOP").modal("hide");
				}else{
					alert("操作失败");
				}
	        	reSetForm('matrixInfoModalPOPForm');
			});
		}
	}else {
		alert("操作有误~");
	}
}
//加载矩阵模态框节点列表
function initeNodeModlTable(af_id){
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	$("#matrixModalTabList").bootstrapTable("destroy").bootstrapTable(
		{
			//请求后台的URL（*）
			url : 'AFNode/queryAllNodeAF.asp?af_id='+af_id,
			method : 'get', //请求方式（*）   
			striped : false, //是否显示行间隔色
			cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
			sortable : true, //是否启用排序
			sortOrder : "asc", //排序方式
			queryParams : queryParams,//传递参数（*）
			sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
			//pagination : true, //是否显示分页（*）
			//pageList : [5,10],//每页的记录行数（*）
			pageNumber : 1, //初始化加载第一页，默认第一页
			pageSize : 10,//可供选择的每页的行数（*）
			clickToSelect : false, //是否启用点击选中行
			uniqueId : "N_ID", //每一行的唯一标识，一般为主键列
			cardView : false, //是否显示详细视图
			detailView : false, //是否显示父子表
			singleSelect: false,
			columns : [{
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
				field: 'ORDER_ID',
				title: '排序',
				formatter:function(value,row,index){
					var rowData = $('#matrixModalTabList').bootstrapTable('getData');
					if(index == 0){//下移-置底
						return "<div class='form-move-all'><ul class='form-move'><li class='form-move-down' title='下移' onclick='tableRowUpOrDownMove("+JSON.stringify(row)+","+index+","+JSON.stringify("down")+")'></li><li class='form-move-bottom' title='置底' onclick='tableRowUpOrDownMove("+JSON.stringify(row)+","+index+","+JSON.stringify("bottom")+")'></li></ul></div>";
					}else if(index == rowData.length-1){//置顶-上移
						return "<div class='form-move-all'><ul class='form-move'><li class='form-move-top' title='置顶' onclick='tableRowUpOrDownMove("+JSON.stringify(row)+","+index+","+JSON.stringify("top")+")'></li><li class='form-move-up' title='上移'  onclick='tableRowUpOrDownMove("+JSON.stringify(row)+","+index+","+JSON.stringify("up")+")'></li></ul></div>";
					}else{//置顶-上移-下移-置底
						return "<div class='form-move-all'><ul class='form-move'><li class='form-move-top' title='置顶' onclick='tableRowUpOrDownMove("+JSON.stringify(row)+","+index+","+JSON.stringify("top")+")'></li><li class='form-move-up' title='上移'  onclick='tableRowUpOrDownMove("+JSON.stringify(row)+","+index+","+JSON.stringify("up")+")'></li><li class='form-move-down' title='下移' onclick='tableRowUpOrDownMove("+JSON.stringify(row)+","+index+","+JSON.stringify("down")+")'></li><li class='form-move-bottom' title='置底' onclick='tableRowUpOrDownMove("+JSON.stringify(row)+","+index+","+JSON.stringify("bottom")+")'></li></ul></div>";
					}
				} 
			}, {
				checkbox:true,
				title:"选择",
				align: 'center',
				valign: 'middle',
				formatter:checkedMFormatter
			}]
		});
}
function checkedMFormatter(value, row, index) {
	var rote_vs = m_rote_v.split(",");
	for(var i=0;i<=index;i++){
		if(row.N_ID===rote_vs[i]){//===不做类型比较，类型不同一定不等
			return {
                checked: true
			};
		}
	}
	return value;
}
/**
 * 表格数据上移、下移、置顶、置底操作
 * @param thisRow 当前行数据
 * @param thisIndex 当前行索引
 * @param flag 移动标识
 */
function tableRowUpOrDownMove(thisRow,thisIndex,flag){
	//获取表格数据
	var rowData = $('#matrixModalTabList').bootstrapTable('getData');
	//获取上一行数据
	var preRow = rowData[thisIndex-1];
	//获取下一行数据
	var nextRow = rowData[thisIndex+1];
	//根据flag值判断上移或者下移
	if(flag == "up"){
		//将上一行数据与当前行数据进行交换
		$('#matrixModalTabList').bootstrapTable('updateRow', {index:thisIndex,row:preRow});
		$('#matrixModalTabList').bootstrapTable('updateRow', {index:thisIndex-1,row:thisRow});
	}else if(flag == "down"){
		//将下一行数据与当前行数据进行交换
		$('#matrixModalTabList').bootstrapTable('updateRow', {index:thisIndex,row:nextRow});
		$('#matrixModalTabList').bootstrapTable('updateRow', {index:thisIndex+1,row:thisRow});
	}else if(flag == "top"){
		//从下向上循环
		for(var i=thisIndex;i>=0;i--){
			//判断是否循环到第一行
			if(i == 0){
				//将第一行数据变成当前行
				$('#matrixModalTabList').bootstrapTable('updateRow', {index:i,row:thisRow});
			}
			else{
				//将这一行数据变成上一行
				$('#matrixModalTabList').bootstrapTable('updateRow', {index:i,row:rowData[i-1]});
			}
		}
	}else{
		//从上向下循环
		for(var i=thisIndex;i<=rowData.length-1;i++){
			//判断是否是最后一行
			if(i == rowData.length-1){
				//将最后一行数据变成当前行数据
				$('#matrixModalTabList').bootstrapTable('updateRow', {index:i,row:thisRow});
			}
			else{
				//将当前行数据变成下一行数据
				$('#matrixModalTabList').bootstrapTable('updateRow', {index:i,row:rowData[i+1]});
			}
		}
	}
}
//关闭模态框
function closematrixInfoModalPOP(id,id2){
	$("#"+id).modal("hide");
	reSetForm(id2);
}
//保存成功重置表单
function reSetForm(id){
	getCurrentPageObj().find("#"+id+" input").val("");
	getCurrentPageObj().find("#"+id+" textarea").val("");
	getCurrentPageObj().find("#"+id+" select").val("");
	getCurrentPageObj().find("#"+id+" select").select2();
}
/*------------------------------------------审批规则基本信息------------------------------------------*/
//新增审批规则按钮（列表增加一行）
function addApproRuleButton(m_id){
	//新增列表增加一行可编辑空记录
	$("#addApproveRules").unbind("click").click(function(){
		$("#approRuleTableInfo").TaskMytable("appenRowAndEditor",{M_ID:m_id});
	});
}
//配置流程函数
function configAFButton(index){
	var data = $("#matixTableInfo").bootstrapTable("getData");
	var af_id = data[index].AF_ID;
	var m_id = data[index].M_ID;
	initApproRuleCFTable(af_id,m_id);
	$("#approvalRuleList").css('display','block');
}
//审批规则配置初始化页面
function initApproRuleCFTable(af_id,m_id){
	findMatrixNodes(af_id,m_id);
	addApproRuleButton(m_id);
	getCurrentPageObj().off("click").on("click","input[name='R_NAME']",function(){
		initVlidate($("#ARInfoModalForm"));
		addProcessRule($(this));
	});
	//模态框下的取消按钮
	$("#cancelPOPARoleBtn").unbind("click").click(function(){
		reSetForm('ARInfoModalForm');
		getCurrentPageObj().find('#approRuleModalPOP').modal('hide');
	});
}
//查询矩阵对应的节点数据
function findMatrixNodes(af_id,m_id){
	baseAjax("AFConfig/queryMNodeInfos.asp",{m_id:m_id,af_id:af_id},function(data){
		initTCfgAssessment(data.rows,m_id,af_id);
	});
}
//显示审批规则table
function initTCfgAssessment(data,m_id,af_id) {
	
	var columns=[{
		field : 'R_NAME',
		title : '审批规则',
		align : "center",
        edit:{type:"text",width:130},
        formatter:function(index,value,row,field){
			if(row.R_NAME==null||row.R_NAME==""||row.R_NAME==undefined){
				return "点击配置审批规则";
			}else{
				return row.R_NAME;
			}
		}
	}];
	for(var i=0;i<data.length;i++){
		columns[columns.length]={
			field : data[i]["N_ID"],
			title : data[i]["N_NAME"],
			align : "center",
			formatter:function(index,value,row,field){
				if(row["nids"]&&row["nids"].indexOf(","+field+",")!=-1){
					return "<input type='checkbox' checked='checked'>";
				}
				return "<input type='checkbox'>";
			}
		};
	}
	/*columns[columns.length]={
		field : "ORDER_ID",
		title : "排序",
		align : "center",
		formatter:function(index,value,row){
			var rowData = $('#approRuleTableInfo').bootstrapTable('getData');
			var rowData = $("#approRuleTableInfo").TaskMytable("getData");
			if(index == 0){
				return "<img style='width:22px;height: 18px;' class='move' title='下移' src='"+
				contextPath+"/images/bootstrap-table/xia.png' onclick='tableRowUpOrDownMove("+
				JSON.stringify(row)+","+index+","+JSON.stringify("down")+")' >" +
    		  		 "&nbsp;&nbsp;" +
    		  		 "<img style='width:22px;height: 22px;' class='move' title='置底' src='"+
    		  		 contextPath+"/images/bootstrap-table/zhidi.png' onclick='tableRowUpOrDownMove("+
    		  		 JSON.stringify(row)+","+index+","+JSON.stringify("bottom")+")' >";
			}else if(index == rowData.length-1){
				return "<img style='width:22px;height: 22px;' class='move' title='置顶' src='"+
				contextPath+"/images/bootstrap-table/zhiding.png' onclick='tableRowUpOrDownMove("+
				JSON.stringify(row)+","+index+","+JSON.stringify("top")+")' >" +
    		  		 "&nbsp;&nbsp;" +
    		  		 "<img style='width:22px;height: 18px;' class='move' title='上移' src='"+
    		  		 contextPath+"/images/bootstrap-table/shang.png' onclick='tableRowUpOrDownMove("+
    		  		 JSON.stringify(row)+","+index+","+JSON.stringify("up")+")'  >";
			}else{
				return "<img style='width:22px;height: 22px;' class='move' title='置顶' title='置顶' src='"+
				contextPath+"/images/bootstrap-table/zhiding.png' onclick='tableRowUpOrDownMove("+
				JSON.stringify(row)+","+index+","+JSON.stringify("top")+")' >" +
    		  		 "&nbsp;&nbsp;" +
    		  		 "<img style='width:22px;height: 18px;' class='move' title='上移' src='"+
    		  		 contextPath+"/images/bootstrap-table/shang.png' onclick='tableRowUpOrDownMove("+
    		  		 JSON.stringify(row)+","+index+","+JSON.stringify("up")+")'  >" +
    		  		 "&nbsp;&nbsp;" +
    		  		 "<img style='width:22px;height: 18px;' class='move' title='下移'  src='"+
    		  		 contextPath+"/images/bootstrap-table/xia.png' onclick='tableRowUpOrDownMove("+
    		  		 JSON.stringify(row)+","+index+","+JSON.stringify("down")+")' >" +
    		  		 "&nbsp;&nbsp;" +
    		  		 "<img style='width:22px;height: 22px;' class='move' title='置底' src='"+
    		  		 contextPath+"/images/bootstrap-table/zhidi.png' onclick='tableRowUpOrDownMove("+
    		  		 JSON.stringify(row)+","+index+","+JSON.stringify("bottom")+")' >";
			}
		}
	};*/
	columns[columns.length]={
		field : "OPT_PERSON",
		title : "操作",
		align : "center",
		formatter:function(index,value,row){
			return '<a style="color:#0088cc; cursor:pointer;" onclick="saveMAFInfo('+index+')">保存</a>/'+
				   '<a style="color:#0088cc; cursor:pointer;" onclick="deleteMAFInfo('+index+')">删除</a>';
		}
	};
	var config={
		columns:columns,
		url:"AFConfig/queryMatixProcessByMId.asp?m_id="+m_id+"&af_id="+af_id,
		pagesize:5,
		queryParams:{},
		dblclick:function(index,row){
		},
		click:function(index,row){
			$("#p_r_id").val(row.R_ID);
			$("#approRuleTableInfo").TaskMytable("beginEditor",index);
		},
		loadSuccess:function(data){}
	};
	$("#approRuleTableInfo").TaskMytable(config);
}
//保存审批流程
function saveMAFInfo(index){
	var tr=$("#approRuleTableInfo tr[index='"+index+"']");
	var params={};
	var inputs=tr.find("input[type='checkbox']:checked");
	var nids="";
	for(var i=0;i<inputs.length;i++){
		nids+=$(inputs[i]).parent().parent().attr("field")+",";
	}
	params["nids"]=nids;
	params["af_id"]=$("#af_id").val();
	$("#approRuleTableInfo").TaskMytable("endEditor",index);
	var data=$("#approRuleTableInfo").TaskMytable("getData").rows[index];
	if(data&&data.P_ID){
		params["p_id"]=data.P_ID;
	}
	if(data&&data.M_ID){
		params["m_id"]=data.M_ID;
	}
	if(data&&data.R_ID){
		params["r_id"]=data.R_ID;
	}
	/*if(data&&data.P_STATE){
		params["state"]=data.P_STATE;
	}*/
	baseAjax("AFConfig/addApproveRuleInfo.asp",params,function(data){
		if(data&&data.result=="true"){
			alert("保存成功!");
		}else if(data.result=="false"){
			alert(data.msg);
		}else{
			alert("保存失败!");
		}
		$("#approRuleTableInfo").TaskMytable("refresh");
	});
}
//删除审批流程
function deleteMAFInfo(index){
	var selRow = $('#approRuleTableInfo').bootstrapTable("getSelections");
	if(selRow.length > 0){
		nconfirm("确定要删除这"+selRow.length+"条记录吗？",function(){
			var data=$("#approRuleTableInfo").TaskMytable("getData").rows[index];
			if(!data["P_ID"]){
				$("#approRuleTableInfo").TaskMytable("delRow",index);
			}else{
				baseAjax("AFConfig/deleteAFProcess.asp",{p_id:data["P_ID"]},function(){
					$("#approRuleTableInfo").TaskMytable("refresh");
				});
			}
		});
	}else{
		alert("请选择要删除的数据");
		return ;
	}
}
//增加审批流节点
function addProcessRule(obj){
	var obj_t=obj;
	addAFRule(obj_t,function(r_id,r_name){
		obj.val(r_name);
		var index=obj.parents("tr[index]").attr("index");
		var data=$("#approRuleTableInfo").TaskMytable("getData").rows[index];
		data.R_ID=r_id;
	});
}
function addAFRule(obj_t,callback){
	$("#approRuleModalPOP").modal("show");
/*	var afStateParam = {
		opttype:'AF_DIC_STATE'
	};
	initSelect("p_state",afStateParam,"",false);*/
	if(obj_t.val()!=""){
	 var index=obj_t.parents("tr[index]").attr("index");
		var data=$("#approRuleTableInfo").TaskMytable("getData").rows[index];
		$("#p_r_name").val(data.R_NAME);
		$("#p_r_exp").val(data.R_EXP);
		$("#p_state").val(data.P_STATE);
		$("#p_state").select2();
	}else{
		$("#p_r_name").val("");
		$("#p_r_exp").val("");
	}
	var r_name=$("#p_r_name").val();
	var r_exp=$("#p_r_exp").val();
	var p_r_id = $("#p_r_id").val();
	if(p_r_id != null && p_r_id != '' && p_r_id != undefined){
		$("#gridSystemApproRuleAdd").hide();
		$("#gridSystemApproRuleUpdate").show();
	}else{
		$("#gridSystemApproRuleAdd").show();
		$("#gridSystemApproRuleUpdate").hide();
	}
	$("#savePOPARoleInfo").unbind("click");
	$("#savePOPARoleInfo").click(function(){
		var bool = vlidate($("#ARInfoModalForm"));
		r_name=$("#p_r_name").val();
		r_exp=$("#p_r_exp").val();
		p_r_id = $("#p_r_id").val();
		if(p_r_id != null && p_r_id != '' && p_r_id != undefined){
			if(bool){
				baseAjax("AFConfig/updateAFRule.asp",
						{r_id:p_r_id,r_name:r_name,r_exp:r_exp},function(data){
					if(data&&data.result&&data.result=="true"){
						alert("修改成功");
						$("#approRuleModalPOP").modal("hide");
						if(callback){
							$("#p_r_id").val(data.r_id);
							callback(data.r_id,r_name);
						}
					}else {
						alert("修改失败");
						$("#approRuleModalPOP").modal("hide");
					}
				});
			}
		}else {
			if(bool){
				baseAjax("AFConfig/addAFRule.asp",
						{r_name:r_name,r_exp:r_exp},function(data){
					if(data&&data.result&&data.result=="true"){
						alert("添加成功");
						$("#approRuleModalPOP").modal("hide");
						if(callback){
							$("#p_r_id").val(data.r_id);
							callback(data.r_id,r_name);
						}
					}else {
						alert("保存失败");
						$("#approRuleModalPOP").modal("hide");
					}
				});
			}
		}
	});
}
//页面返回按钮
$("#goback").click(function(){
	closeCurrPageTab();
});