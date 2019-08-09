initClickButtonEvent();


//按钮方法
function initClickButtonEvent(){
	var $page = getCurrentPageObj();//当前页
	autoInitSelect($page);//初始化下拉选
	var quaryAttrCall=getMillisecond();
	initAttrManageInfo(quaryAttrCall);
	//查询按钮
	getCurrentPageObj().find("#queryCaseAttr").unbind("click");
	getCurrentPageObj().find("#queryCaseAttr").click(function(){	
		var param = getCurrentPageObj().find("#CaseAttrQuerytForm").serialize();
		getCurrentPageObj().find("#CaseAttrTableInfo").bootstrapTable('refresh',{
			url:dev_test+'caseAttrCust/querycaseAttrCust.asp?call='+quaryAttrCall+'&SID='+SID+'&'+param+"&ATTR_STATE=00"});		
	});
	//enter触发查询
	enterEventRegister(getCurrentPageObj().attr("class"), function(){getCurrentPageObj().find("#queryCaseAttr").click();});
	
	//重置按钮
	$page.find('#resetCaseAttr').click(function(){
		$page.find("table input").val("");
		$page.find("select").val(" ").select2();
	});
	
	//新增按钮
	getCurrentPageObj().find("#caseAttr_add").unbind("click");
	getCurrentPageObj().find("#caseAttr_add").click(function(){		
		closeAndOpenInnerPageTab("caseAttr_add","新增基础属性","dev_test/systemManage/caseAttrCust/caseAttrCust_edit.html", function(){
			initAddAttrManageButtonEvent();
		});
	});	

	//修改按钮
	getCurrentPageObj().find("#caseAttr_update").unbind("click");
	getCurrentPageObj().find("#caseAttr_update").click(function(){

		var seles = getCurrentPageObj().find("#CaseAttrTableInfo").bootstrapTable('getSelections');
		if(seles.length != 1) {
			alert("请选择一条数据进行操作!");
			return;
		}				
		else{ 
			closeAndOpenInnerPageTab("caseAttr_update","修改案例属性定义","dev_test/systemManage/caseAttrCust/caseAttrCust_edit.html", function(){
			caseAttrupdate(seles[0]);
					});
		}
	});	
	//删除按钮
	$("#caseAttr_delete").click(function(){
		var id = $("#CaseAttrTableInfo").bootstrapTable('getSelections');
		var ids = $.map(id, function (row) {
			return row.ATTR_ID;                  
		});
		var is_basic = $.map(id, function (row) {
			return row.IS_BASIC_ATTR;                  
		});
		if(id.length!=1){
			alert("请选择一条数据进行删除!");
			return ;
		}
		nconfirm("确定要删除该数据吗？",function(){
		    if(is_basic != "00"){		
				var quaryAttrDeleteCall = getMillisecond();
				var url=dev_test+"caseAttrCust/deleteCaseAttr.asp?call="+quaryAttrDeleteCall+"&SID="+SID+"&ATTR_ID="+ids;
				baseAjaxJsonp(url, null , function(data) {
					if (data != undefined&&data!=null&&data.result=="true") {
						alert("删除成功！");
						$("#CaseAttrTableInfo").bootstrapTable('remove', {
							field:'ATTR_ID',
							values: ids
						});
						getCurrentPageObj().find("#CaseAttrTableInfo").bootstrapTable('refresh',
						{url:dev_test+'caseAttrCust/querycaseAttrCust.asp?call='+quaryAttrCall+'&SID='+SID+"&ATTR_STATE=00"});
					}else{	
						alert("删除失败！");
					}	
				},quaryAttrDeleteCall);	
		    }else{
		    	alert("基础属性不能删除！");
		    }
		});	
	});	
	
	//查看按钮
	getCurrentPageObj().find("#caseAttr_show").unbind("click");
	getCurrentPageObj().find("#caseAttr_show").click(function(){

		var seles = getCurrentPageObj().find("#CaseAttrTableInfo").bootstrapTable('getSelections');
		if(seles.length != 1) {
			alert("请选择一条数据进行操作!");
			return;
		}				
		else{ 
			closeAndOpenInnerPageTab("caseAttr_show","查看案例属性定义","dev_test/systemManage/caseAttrCust/caseAttrCust_show.html", function(){
			caseAttrshow(seles[0]);
					});
		}
	});	
	
};
	

//查询列表显示table
function initAttrManageInfo(quaryAttrCall) {
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	$("#CaseAttrTableInfo").bootstrapTable(
			{
				//请求后台的URL（*）
				url :dev_test+'caseAttrCust/querycaseAttrCust.asp?call='+quaryAttrCall+'&SID='+SID+"&ATTR_STATE=00",
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
				uniqueId : "ATTR_ID", //每一行的唯一标识，一般为主键列
				cardView : false, //是否显示详细视图
				detailView : false, //是否显示父子表
				jsonpCallback:quaryAttrCall,
				singleSelect: true,
				onLoadSuccess : function(data){
					gaveInfo();
				},
				columns : [ {
					field: 'middle',
					checkbox: true,
					rowspan: 2,
					align: 'center',
					valign: 'middle'
				},{
					field : '',
					title : '序号',
					align : "center",
					width : "80",
					sortable: true,
					formatter: function (value, row, index) {
						return index+1;
					}
				}, {
					field : "ATTR_ID",
					title : "属性ID",
					align : "center"
				}, {
					field : "ATTR_NAME",
					title : "属性名称",
					align : "center"
				}, {
					field : "NECESSARY",
					title : "是否必填",
					width : "80",
					align : "center",
					formatter:function(value,row,index){
						var result='';
						if(value=='00'){
							result = '是';
						}
						if(value=='01'){
							result = '否';
						}
						return result;
					}
				},{
					field : "ATTR_TYPE_NAME",
					title : "属性类型",
					align : "center"
				}, {
					field : "MAX_LENGTH",
					title : "最大长度",
					width : "100",
					align : "center"
				}, {
					field : "DICTIONARY_NUM",
					title : "字典项编号",
					align : "center"
				}, {
					field : "SORT_NUM",
					title : "排序序号",
					width : "80",
					align : "center"
				}, {
					field : "DEFAULT_NUM",
					title : "默认值",
					align : "center"
				}]
			});
};


