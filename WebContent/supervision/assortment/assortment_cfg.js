var tableCall=getMillisecond();
var assid;//类别ID
//获取督办类别信息
function assortment_init(assortid){
	var call=getMillisecond();
	assid = assortid;
	//根据模型编号给模型赋值
	var url = dev_workbench+"Assortment/queryAssortmentOne.asp?assortid="+assortid+"&call="+call+"&SID="+SID;
	baseAjaxJsonp(url,null,function(data){
		for(var k in data){
			$("#"+k).text(data[k]);	
		}
	},call);
	$("#closePageAssortment_cfg").click(function(){
		nconfirm("确定离开该页面?",function(){
			closeCurrPageTab();
		});
	});
	initMCQueryList(assortid);
}	
//初始化模型查询列表
function initMCQueryList(assortid){
	//加载bootstrapTable列表
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	$("#messstrategyType_Table").bootstrapTable(	{
		//请求后台的URL（*）
		url : dev_workbench+'PucTMesscategory/queryAllMesscategory.asp?assortid='+assortid+'&call='+tableCall+'&SID='+SID,
		method : 'get', //请求方式（*）   
		striped : true, //是否显示行间隔色
		cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
		sortable : true, //是否启用排序
		sortOrder : "asc", //排序方式
		queryParams : queryParams,//传递参数（*）
		sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
		pagination : true, //是否显示分页（*）
		pageList : [5,10],//每页的记录行数（*）
		pageNumber : 1, //初始化加载第一页，默认第一页
		pageSize : 10,//可供选择的每页的行数（*）
		clickToSelect : true, //是否启用点击选中行
		uniqueId : "CATEGORY_CODE", //每一行的唯一标识，一般为主键列
		cardView : false, //是否显示详细视图
		detailView : false, //是否显示父子表
		jsonpCallback:tableCall,
		singleSelect: true,
		onLoadSuccess:function(data){
		},
//{ASSORTNAME=任务管理, CATEGORY_NAME=定时提醒未考勤人员1, SENDER=企业运营部, OPT_TIME=0, CATEGORY_TYPE=03, CATEGORY_STATENAME=启用, CATEGORY_CODE=PUB201701, ROW_NUM=1, ASSORTID=4, SENDER_MAIL=e32748327@qq.com, CATEGORY_STATE=00, SENDER_TITLE=无, RULE_INSTRUCTION=定时提醒未考勤人员, OPT_PERSON=0},
		columns : [ {
			field: 'middle',
			checkbox: true,
			rowspan: 2,
			align: 'center',
		},{
			field : 'CATEGORY_CODE',
			title : '模型编号',
			align : "center"
//			visible:false
		},{
			field : 'CATEGORY_NAME',
			title : '模型名称',
			align : "center"
		}, {
			field : "ASSORTNAME",
			title : "督办类别",
			align : "center"
		}, {
			field : "CATEGORY_STATENAME",
			title : "模型状态",
			align : "center"
		}, {
			field : "SENDER",
			title : "发件人姓名",
			align : "center"
		}, {
			field : "SENDER_MAIL",
			title : "发件人邮箱",
			align : "center"
		} ,{
			field : "SENDER_TITLE",
			title : "邮件标题",
			align : "center"
		}]
	});
}
//功能按钮
function pageMCButton(){
	//新增页面
	$("#messstrategy_queryList_addpop").click(function(){
		if($("#FLAGNAME").text()=='启用'){	
			$("#messcategoryPop").modal("show");
			$("#assortid_idpop").val(assid);
			$("#assortid_namepop").val($("#ASSORTNAME").text());		
			//给必填项添加*
			initVlidate($("#add_messcategorypop"));
			//下拉框
			autoInitSelect($("#add_messcategorypop"));	
		}else if($("#FLAGNAME").text()=='停用'){
			alert("此模型类别已停用不能新增模型");
		}else{
			$("#messcategoryPop").modal("show");
			$("#assortid_idpop").val(assid);
			$("#assortid_namepop").val($("#ASSORTNAME").text());		
			//给必填项添加*
			initVlidate($("#add_messcategorypop"));
			//下拉框
			autoInitSelect($("#add_messcategorypop"));
		}
			
	});	
	$("#messcaTegory_addButtonpop").click(function(){
		var call=getMillisecond();
		//必填项验证
		if(!vlidate($("#add_messcategorypop"),99999999)){
			return ;
		}	
		//取值
		var inputs = $("input[name^='POP.']");
		var selects = $("select[name^='POP.']");
		var textareas = $("textarea[name^='POP.']");
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
			params['opt_type'] = 'add';			
		var url = dev_workbench+"PucTMesscategory/puctMesscategoryAdd.asp?call="+call+"&SID="+SID;
		baseAjaxJsonp(url,params,function(data){
			if(data.result=="true"){
				alert("添加成功！");
					onModalCloseEvent("messcategoryPop");
					$("#messcategoryPop").modal("hide");
					$("#messstrategyType_Table").bootstrapTable('refresh');				
			}else{
				alert("添加失败！");
			}
		},call);
	});
	//修改页面
	$("#messstrategy_queryList_updatepop").click(function(){
		var id = $("#messstrategyType_Table").bootstrapTable('getSelections');
		if (id.length != 1) {
			alert("请选择一条数据进行修改!");
			return;
		}
		var category_code = $.map(id, function(row) {
			return (row.CATEGORY_CODE);
		});
		$("#assortid_idpop_update").val(assid);
		$("#assortid_namepop_update").val($("#ASSORTNAME").text());	
		$("#messcategoryPop_update").modal("show");	
		messcaTegory_initUpdatepop(category_code,assid);		
	});
	//修改按钮		
	$("#messcaTegory_updateButtonpop").click(function(){
		var call=getMillisecond();
		//必填项验证
		if(!vlidate($("#update_messcategorypop"),99999999)){
			return ;
		}	
		//取值
		var inputs = $("input[name^='upd.']");
		var selects = $("select[name^='upd.']");
		var textareas = $("textarea[name^='upd.']");
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
			params['opt_type'] = 'update';
			params['category_code'] = $("#messcategoryCodepop_update").val();
		var url = dev_workbench+"PucTMesscategory/puctMesscategoryAdd.asp?call="+call+"&SID="+SID;
		baseAjaxJsonp(url,params,function(data){
			if(data.result=="true"){
				alert("修改成功！");
				onModalCloseEvent("messcategoryPop_update");
				$("#messcategoryPop_update").modal("hide");
				$("#messstrategyType_Table").bootstrapTable('refresh');
			}else if(data.result=="blockup"){
				$("#category_state span[class='selection']").append('<div id="remindInfo" class="tag-content" >'+"此模型的类别已停用，故此模型不能启用！"+'</div>');
			}else{
				alert("修改失败！");
			}
		},call);
	});
	//删除功能
	$("#messstrategy_queryList_deletepop").click(function(){
		 var call=getMillisecond();
		var id = $("#messstrategyType_Table").bootstrapTable('getSelections');
		if (id.length != 1) {
			alert("请选择一条数据进行删除!");
			return;
		}
		var category_code = $.map(id, function(row) {
			return (row.CATEGORY_CODE);
		});
		var url = dev_workbench+"PucTMesscategory/puctMessCategoryDelete.asp?category_code="+category_code+"&call="+call+"&SID="+SID;
		baseAjaxJsonp(url,null,function(data){
			if(data.result=="true"){
				alert("删除成功！");
				$("#messstrategyType_Table").bootstrapTable('refresh');
			}else{
				alert("删除失败！");
			}
		},call);
	});
	//POP关闭
	$("#ass_popButtonClose").click(function(){
		onModalCloseEvent("messcategoryPop");
		$("#messcategoryPop").modal("hide");
	});
	//update_popButtonClose
	$("#update_popButtonClose").click(function(){
		onModalCloseEvent("messcategoryPop_update");
		$("#messcategoryPop_update").modal("hide");
	});
}
//修改初始化页面
function messcaTegory_initUpdatepop(category_code,assortid){
	var call=getMillisecond();
	assortFlag = assortid;
	//给必填项添加*
	initVlidate($("#update_messcategorypop"));
	//将模型编号赋值到页面上
	$("#messcategoryCodepop_update").val(category_code);
	//根据模型编号给模型赋值
	var url = dev_workbench+"PucTMesscategory/findMessCategoryByCode.asp?category_code="+category_code+"&call="+call+"&SID="+SID;
	baseAjaxJsonp(url,null,function(data){
		for(var k in data){
			$("input[name='upd."+k.toLowerCase()+"']").val(data[k]);
			$("textarea[name='upd." + k.toLowerCase() + "']").val(data[k]);		  
			if(k.toLowerCase()=='category_state'){
   				   initSelect($("select[name='upd." + k.toLowerCase() + "']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"S_DIC_OC"},data[k]);
			}			
			if(k.toLowerCase()=='category_type'){
   				   initSelect($("select[name='upd." + k.toLowerCase() + "']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"M_DIC_MESSTYPE"},data[k]);
			}
		}
	},call);
}
function removeInfo(){
	$("#remindInfo").remove();
}
pageMCButton();