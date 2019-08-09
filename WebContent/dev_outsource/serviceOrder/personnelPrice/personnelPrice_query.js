var callTable = getMillisecond();
//初始化页面下拉选择框
function initPersonPricePage(){
	var obj = getCurrentPageObj().find("#supplier_name");//初始化供应商pop
	obj.unbind("click");
	obj.click(function(){
		openSupplierPop("priceSupplier_Pop",{singleSelect:true,parent_company:getCurrentPageObj().find("#supplier_name"),
			parent_sup_num:getCurrentPageObj().find("input[name='pr.supplier_id']")});
	});
	var obj = getCurrentPageObj().find("#contract");//初始化合同pop框
	obj.unbind("click");
	obj.click(function(){
		openContractInfoPop("priceContract_Pop",{code:getCurrentPageObj().find("#contract")});
	});
	getCurrentPageObj().find("#price_add").click(function(){//新增页面
		openInnerPageTab("price_add", "人员单价新增", "dev_outsource/serviceOrder/personnelPrice/personnelPrice_add.html",function(){});
	});
	getCurrentPageObj().find("#price_update").click(function(){//修改页面
		var id = getCurrentPageObj().find("#personal_price_query").bootstrapTable('getSelections');
		if (id.length != 1) {
			alert("请选择一条数据!");
			return;
		}
		var p = $.map(id, function(row) {
			return (row.P_ID);
		});
		closePageTab("price_update",function(){
			openInnerPageTab("price_update", "人员单价修改", "dev_outsource/serviceOrder/personnelPrice/personnelPrice_update.html",function(){
				initUpdatePage(p);
			});
		});
	});
	getCurrentPageObj().find("#price_detail").click(function(){//查看页面
		var id = getCurrentPageObj().find("#personal_price_query").bootstrapTable('getSelections');
		if (id.length != 1) {
			alert("请选择一条数据!");
			return;
		}
		var p = $.map(id, function(row) {return (row.P_ID);});
		closePageTab("price_detail",function(){
			openInnerPageTab("price_detail", "人员单价查看", "dev_outsource/serviceOrder/personnelPrice/personnelPrice_detail.html",function(){
				initDetail(p);
			});
		});
	});
	getCurrentPageObj().find("#price_del").click(function(){//删除按钮price_del
		var id =getCurrentPageObj().find("#personal_price_query").bootstrapTable('getSelections');
		if (id.length != 1) {
			alert("请选择一条数据!");
			return;
		}
		var p_id = $.map(id, function(row) {
			return (row.P_ID);
		});
		nconfirm("确定删除该人员单价？",function(){
			var call = getMillisecond();
			baseAjaxJsonp(dev_outsource+'pPrice/delPPriceById.asp?call='+call+'&SID='+SID,{"p_id":p_id},function(msg){
				var data=msg.result;
				if(data=="true"){
					alert("删除成功！");
					getCurrentPageObj().find('#personal_price_query').bootstrapTable('refresh',
							{url:dev_outsource+'pPrice/queryAllPPrice.asp?call='+callTable+'&SID='+SID});
				}else{
					alert("删除失败！");
				}
			},call);
		});
	});

	function priceTimeCompare(){//时间比较
		var flag = true;
		var p_starttime = getCurrentPageObj().find("#p_starttime").val();
		var p_endtime = getCurrentPageObj().find("#p_endtime").val();
		if(p_starttime!=""&&p_starttime!=undefined&&p_endtime!=""&&p_endtime!=undefined){
			if(p_starttime>p_endtime){
				alert('开始时间不能大于结束时间!');
				return false;
			}
		}
		return flag;
	}
	function querypriceUrl(){//组装查询url  @returns {String}
		var url=dev_outsource+"pPrice/queryAllPPrice.asp?&SID="+SID+'&call='+callTable;
		var sts="";
		var selects=getCurrentPageObj().find("select[name^='pr.']");//获取下拉选的值
		for(var i=0;i<selects.length;i++){
			var obj=$(selects[i]);
			if($.trim(obj.val())!=""){
				sts+='&'+obj.attr("name").substr(3)+"="+obj.val();
			}
		}
		var fds=getCurrentPageObj().find("input[name^='pr.']");//获取input框的值
		for(var i=0;i<fds.length;i++){
			var obj=$(fds[i]);
			if($.trim(obj.val())!=""){
				url+='&'+obj.attr("name").substr(3)+"="+escape(encodeURIComponent(obj.val()));
			}
		}
		return url+sts;
	}
	getCurrentPageObj().find("#price_query").click(function(){//查询按钮点击
		if(priceTimeCompare()){
			getCurrentPageObj().find("#personal_price_query").bootstrapTable("refresh", {url:querypriceUrl()});
		}
	});
	getCurrentPageObj().find("#price_reset").click(function(){//重置按钮点击
		getCurrentPageObj().find("input").val("");
		getCurrentPageObj().find("select").val(" ");
		getCurrentPageObj().find("select").select2();
	});
	//初始化导入文件
	importExcel.initImportExcel(getCurrentPageObj().find("#outperson_Import"),"外包人员单价信息","sfile/downloadFTPFile.asp?id=m_046","pPrice/importOutPersonPrice.asp",function(msg){
		if(msg&&msg.result=="true"){
			alert("导入成功!");
		}else if(msg&&msg.result=="false"&&msg.error_info){
			alert(msg.error_info);
		}else{
			alert("导入失败!");
		}
	});
}
function initPersonPriceTable(){// 初始化人员单价维护基本信息列表数据
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	getCurrentPageObj().find("#personal_price_query").bootstrapTable(
			{
				url : dev_outsource+'pPrice/queryAllPPrice.asp?call='+callTable+'&SID='+SID,//请求后台的URL（*）
				method : 'get', //请求方式（*）   
				striped : false, //是否显示行间隔色
				cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
				sortable : true, //是否启用排序
				sortOrder : "asc", //排序方式
				queryParams : queryParams,//传递参数（*）
				sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
				pagination : true, //是否显示分页（*）
				pageList : [5,10,20],//每页的记录行数（*）
				pageNumber : 1, //初始化加载第一页，默认第一页
				pageSize : 10,//可供选择的每页的行数（*）
				clickToSelect : true, //是否启用点击选中行
				uniqueId : "supplier_id", //每一行的唯一标识，一般为主键列
				cardView : false, //是否显示详细视图
				detailView : false, //是否显示父子表
				singleSelect: true,
				jsonpCallback:callTable,
				columns : [ {
					field: 'middle',
					checkbox: true,
					rowspan: 2,
					align: 'center',
					valign: 'middle'
				},{
					field : 'abcdef',
					title : '序号',
					align : "center",
					formatter: function (value, row, index) {
	        			  return index+1;
		        	  }
				},{
					field : 'P_ID',
					title : '主键',
					align : "center",
					visible:false 
				},{
					field : 'SUPPLIER_ID',
					title : '供应商编号',
					align : "center",
					visible:false 
				},{
					field : 'SUPPLIER_NAME',
					title : '供应商',
					align : "center"
				},{
					field : 'CONTRACT',
					title : '框架合同编号',
					align : "center"
				},{
					field : 'P_STARTTIME',
					title : '开始时间',
					align : "center",
				},{
					field : 'P_ENDTIME',
					title : '结束时间',
					align : "center",
				},{
					field : 'OPT_PERSON',
					title : '创建人',
					align : "center",
				}]
			});
}
initPersonPriceTable();//初始化非项目任务书列表数据
initPersonPricePage();//初始化页面下拉选择框