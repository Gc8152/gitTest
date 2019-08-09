initRiskQuestionLayout();

var firstSelect = getCurrentPageObj().find("select[name=FIRST_CLASSIFY]");
firstSelect.bind('change',function(){
	var obj = getCurrentPageObj().find("select[name=SECOND_CLASSIFY]");
	var type = firstSelect.val();
	obj.empty();
	if(type=='01'){
		initSelect(obj,{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"P_DIC_RISK_TYPE2"},"", "","09,10,11,12,13");
	} else if(type='02'){
		initSelect(obj,{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"P_DIC_RISK_TYPE2"},"", "","01,02,03,04,05,06,07,08");
	}
});
function initRiskQuestionLayout(){
	var currTab = getCurrentPageObj();
	
	var form = currTab.find("#riskQuestionManage_query");
	var table = currTab.find("#riskQuestionManage_table");
	var call = getMillisecond();
	
	//查询操作
	var commit = currTab.find("#commit");
	commit.click(function(){
		inittablerisk();
	});
	//重置按钮
	var reset = currTab.find("#reset");
	reset.click(function(){
		form[0].reset();
		currTab.find("select").select2();
	});
	
	/**		初始化按钮跳转	**/
	/*新建*/
	var riskManage_add = currTab.find("#riskManage_add");
	riskManage_add.click(function(){
		/*var rows = table.bootstrapTable('getSelections');
		if(rows.length!=1){
			alert("请选择一条数据进行修改!");
			return ;
		}*/
		openInnerPageTab("riskQuestionManage_add","新建风险问题","dev_project/riskQuestionManage/riskQuestionManage_add.html",function(){
			initRiskQuestionSaveLayout(2);
		});
	});
	/*风险跟踪*/
	var riskManage_follow = currTab.find("#riskManage_follow");
	riskManage_follow.click(function(){
		var rows = table.bootstrapTable('getSelections');
		if(rows.length!=1){
			alert("请选择一条数据进行跟踪!");
			return ;
		}
		var status =rows[0].RISK_STATUS; 
		if(status!='05' && status!='06' &&status!='04'){
			openInnerPageTab("riskManage_follow","风险跟踪","dev_project/riskQuestionManage/riskQuestionManage_record.html",function(){
				initRiskQuestionRecordLayout(rows[0].RISK_ID, rows[0].FIRST_CLASSIFY);
			});
		} else {
			alert("请选择一条非处理完状态的数据进行跟踪!");
			return ;
		}
	});
	/*风险验证*/
	var riskManage_validate = currTab.find("#riskManage_validate");
	riskManage_validate.click(function(){
		var rows = table.bootstrapTable('getSelections');
		if(rows.length!=1){
			alert("请选择一条数据进行验证!");
			return ;
		}
		var status =rows[0].RISK_STATUS; 
		if(status=='04'){
			openInnerPageTab("riskManage_validate","风险验证","dev_project/riskQuestionManage/riskQuestionRecord_validate.html",function(){
				initRiskQuestionValidateLayout(rows[0].RISK_ID, rows[0].FIRST_CLASSIFY, rows[0].RISK_STATUS);
			});
		} else {
			alert("请选择一条待验证状态的数据进行验证!");
			return ;
		}
	});
	/*风险详情*/
	var riskManage_queryInfo = currTab.find("#riskManage_queryInfo");
	riskManage_queryInfo.click(function(){
		var rows = table.bootstrapTable('getSelections');
		if(rows.length!=1){
			alert("请选择一条数据进行验证!");
			return ;
		}
		var status =rows[0].RISK_STATUS;
		closeAndOpenInnerPageTab("riskManage_queryInfo","风险详情","dev_project/riskQuestionManage/riskQuestionManage_detail.html",function(){
			initRiskQuestionDetailLayout(2,rows[0].RISK_ID, rows[0].FIRST_CLASSIFY);
		});
		/*var rows = table.bootstrapTable('getSelections');
		if(rows.length!=1){
			alert("请选择一条数据进行修改!");
			return ;
		}
		newOpenTab("configManage","配置管理","dev_project/myProject/configManage/configManage_qeryList.html",function(){
			initLayout(rows);
		});*/
	});
	inittablerisk();
	function 	inittablerisk(){
	/**		初始化table	**/
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	var param = form.serialize();
	table.bootstrapTable("destroy").bootstrapTable({
		//请求后台的URL（*）
		url : dev_project+"riskQuestionManage/queryListProjectRisk.asp?SID="+SID+"&call="+call+"&"+param,
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
		pageSize : 10,//可供选择的每页的行数（*）
		clickToSelect : true, //是否启用点击选中行
		uniqueId : "RISK_ID", //每一行的唯一标识，一般为主键列
		cardView : false, //是否显示详细视图
		jsonpCallback : call,
		detailView : false, //是否显示父子表
		singleSelect: true,
		columns : [ {
			field: 'middle',
			checkbox: true,
			rowspan: 2,
			align: 'center',
			valign: 'middle'
		},{
			field : 'aa',
			title : '序号',
			align : "center",
			formatter : function(value, row, index){
				return index+1;
			}
		}, {
			field : "flag",
			title : "标识",
			align : "center"
		}, {
			field : "RISK_FROM_ID",
			title : "风险出处",
			align : "center"
		}, {
			field : "RISK_DESC",
			title : "风险描述",
			align : "center"
		}, {
			field : "FIRST_CLASSIFY_NAME",
			title : "一级分类",
			align : "center"
		}, {
			field : "SECOND_CLASSIFY_NAME",
			title : "二级分类",
			align : "center"
		}, {
			field : "PRIORITY_NAME",
			title : "优先级",
			align : "center"
		}, {
			field : "RISK_GRADE_NAME",
			title : "风险级别",
			align : "center"
		}, {
			field : "DUTY_USER_NAME",
			title : "责任人",
			align : "center"
		}, {
			field : "RISK_STATUS_NAME",
			title : "风险状态",
			align : "center"
		}, {
			field : "PRESENT_TIME",
			title : "提出日期",
			align : "center"
		}, {
			field : "CLOSE_DATE",
			title : "关闭日期",
			align : "center"
		}]
	});
}
	autoInitSelect(form);
	
	//initSelect(form.find("select[name=RISK_STATUS]"),[{01,02}],param,default_v,preStr)
	
}