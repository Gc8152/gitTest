initRiskAddDicCode();
initRiskAddBtn();
riskPopCall()
//加载字典项
function initRiskAddDicCode(){
	initSelect(getCurrentPageObj().find("#riskAdd_level"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"P_DIC_RISK_LEVEL"});
	initSelect(getCurrentPageObj().find("#riskAdd_possible"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"P_DIC_RISK_POSSIBLE"});
	initSelect(getCurrentPageObj().find("#riskAdd_effect"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"P_DIC_RISK_EFFECT"});
	initSelect(getCurrentPageObj().find("#risk_type1"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"P_DIC_RISK_TYPE1"});
	initSelect(getCurrentPageObj().find("#risk_measures"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"P_DIC_RISK_MEASURES"});
	initSelect(getCurrentPageObj().find("#risk_intstate"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"P_DIC_RISK_STATUS"});
	var currentLoginName=$("#currentLoginName").val();
	getCurrentPageObj().find("#sayman").val(currentLoginName);
}
function initRiskAddBtn() {
	//显示pop框
    $("#risk_from").click(function(){
	getCurrentPageObj().find("#riskPopList").bootstrapTable('refresh');
	$("#riskModalPOP").modal("show");		
	initRiskAddTable();
   });
}
//初始化pop列表
function initRiskAddTable(){
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
   $("#riskModalPOPList").bootstrapTable(
			{
				url : dev_project+"riskQuestionManage/queryAcceptOperatePopAdd.asp?SID="+SID,
				method : 'get', //请求方式（*）   
				striped : false, //是否显示行间隔色
				cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
				sortable : true, //是否启用排序
				sortOrder : "asc", //排序方式
				queryParams : queryParams,//传递参数（*）
				sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
				pagination : true, //是否显示分页（*）
				pageList : [5,10],//每页的记录行数（*）
				pageNumber : 1, //初始化加载第一页，默认第一页
				pageSize : 5,//可供选择的每页的行数（*）
				clickToSelect : true, //是否启用点击选中行
				uniqueId : "URN", //每一行的唯一标识，一般为主键列
				cardView : false, //是否显示详细视图
				detailView : false, //是否显示父子表
				singleSelect: true,//单选多选
				recallSelect:true,
				onLoadSuccess:function(data){
				},
				onDblClickRow:function(row){
					getCurrentPageObj().find("#risk_from").val(row.PROJECT_NUM);
					getCurrentPageObj().find("#callman").val(row.PM_NAME);
					$('#riskModalPOP').modal('hide');
				},
				columns : [
				           {
					field : 'PROJECT_NUM',
					title : '项目编号',
					align : 'center'
				},{
					field : 'PROJECT_NAME',
					title : '项目名称',
					align : 'center'
				},{
					field : 'PM_NAME',
					title : '项目经理',
					align : 'center'
				}]
			});
}
function riskPopCall(){
	//风险来处POP框
	/*getCurrentPageObj().find("#addPOP").click(function(){
		var id=$("#riskModalPOPList").bootstrapTable('getRecallSelections');
		if(id.length==0){
			alert("请选择一条数据!");
			return;
		}
		var ids=$.map(id,function(row){
			return row.PM_NAME;
		});
		var idn=$.map(id,function(row){
			return row.PROJECT_NUM;
		});
		getCurrentPageObj().find("#risk_from").val(idn);
		//getCurrentPageObj().find("#pm_name").val(ids);
		getCurrentPageObj().find("#callman").val(ids);
		$('#riskModalPOP').modal('hide');
	});*/
	//POP查询
	getCurrentPageObj().find("#pop_menuSearch").click(function(){
		    var pop_person=$("#pop_person").val();
		    var pop_menuuser=$("#pop_menuuser").val();
			$('#riskModalPOPList').bootstrapTable('refresh',
					{url:dev_project+"riskQuestionManage/queryAcceptOperatePopAdd.asp?SID="+SID+"&pop_person="+escape(encodeURIComponent(pop_person))+"&pop_menuuser="+escape(encodeURIComponent(pop_menuuser))});
	});
	//重置
	getCurrentPageObj().find("#pop_menuReset").click(function(){
		getCurrentPageObj().find("#pop_person").val("");
		getCurrentPageObj().find("#pop_menuuser").val("");
	});
	//保存并提交
	getCurrentPageObj().find('#risk_save').click(function(){
		if(!vlidate($("#risk_form"),"",true)){
			alert("请按要求填写图表中的必填项！");
			return ;
		}
		var inputs = getCurrentPageObj().find("input:text[name^='RIS.']");
		var selects = getCurrentPageObj().find("select[name^='RIS.']");
		var textareas = getCurrentPageObj().find("textarea[name^='RIS.']");
		var params = {};
		for(var i=0;i<inputs.length;i++){
			params[$(inputs[i]).attr("name").substr(4)] = $(inputs[i]).val(); 
		}
		for(var i=0;i<selects.length;i++){
			params[$(selects[i]).attr("name").substr(4)] = $(selects[i]).val();
		}
		for(var i=0;i<textareas.length;i++){
			params[$(textareas[i]).attr("name").substr(4)] = $(textareas[i]).val();	 
		}
		var calli = 'jq_1530174253455';
		baseAjaxJsonp(dev_project+"riskQuestionManage/queryAcceptOperateAdd.asp?SID="+SID+'&call='+calli, params, function(data) {
			if(data.msg=='01'){
				alert("该风险来源下风险名称重复");
				return;
			}
			closePageTab("risk_add");	
			alert("添加成功");
		},calli);
	});	
}