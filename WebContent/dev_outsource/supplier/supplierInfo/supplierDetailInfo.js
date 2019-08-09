(function(suplierDetail){
	suplierDetail.initDetail=function (nums){
		var call=getMillisecond();
		//供应商基本信息
		baseAjaxJsonp(dev_outsource+"SupplierInfo/querySupplierDetailInfo.asp?sup_num="+nums, {"SID":SID,"call":call} , function(data) {
			//初始化基本信息
			for ( var k in data) {
				getCurrentPageObj().find("span[name='SD." + k + "']").html(data[k]);
			}
		},call);

		//分页
		var queryParams=function(params){
			var temp={
					limit: params.limit, //页面大小
					offset: params.offset //页码
			};
			return temp;
		};
		//queryTalkByNumMan(nums);//查询也谈及扣款
		var call1=getMillisecond();
		//360视图中联系人信息
		$("#DetailLinkmanTable").bootstrapTable(
				{
					//请求后台的URL（*）
					url : dev_outsource+'SupplierInfo/queryLinkmanByNum.asp?sup_num='+nums+"&SID="+SID+"&call="+call1,
					method : 'get', //请求方式（*）   
					striped : false, //是否显示行间隔色
					cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）escape(encodeURIComponent(user_name))
					sortable : true, //是否启用排序
					sortOrder : "asc", //排序方式
					queryParams : queryParams,//传递参数（*）
					sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
					//pagination : true, //是否显示分页（*）
					pageList : [5,10],//每页的记录行数（*）
					pageNumber : 1, //初始化加载第一页，默认第一页
					pageSize : 5,//可供选择的每页的行数（*）
					clickToSelect : true, //是否启用点击选中行
					uniqueId : "linkman_num", //每一行的唯一标识，一般为主键列
					cardView : false, //是否显示详细视图
					detailView : false, //是否显示父子表
					singleSelect: true,
					jsonpCallback : call1,
					onLoadSuccess:function(data){
						//alert("我发送请求了");
					},
					columns : [ {
						field : 'Number',
						title : '序号',
						align : "center",
						formatter: function (value, row, index) {
							return index+1;
						}
					},{
						field : 'LINKMAN_NUM',
						title : '联系人编号',
						align : "center",
						visible:false
					},{
						field : 'LINKMAN_TYPE',
						title : '联系人类别',
						align : "center"	
					},{
						field : 'NAME',
						title : '姓名',
						align : "center",
					},{
						field : 'POST',
						title : '职务',
						align : "center"
					},{
						field : "TEL",
						title : "联系电话",
						align : "center",
					}, {
						field : "EMAIL",
						title : "邮箱",
						align : "center"
					},{
						field : "IS_LIASIONS",
						title : "是否常用联系人",
						align : "center"
					}  ]
				});
		var call2=getMillisecond();
		//360视图中的股东信息
		$("#DetailOwnershipStructureTable").bootstrapTable(
				{
					//请求后台的URL（*）
					url : dev_outsource+'SupplierInfo/queryOwnershipByNum.asp?sup_num='+nums+"&SID="+SID+"&call="+call2,
					method : 'get', //请求方式（*）   
					striped : false, //是否显示行间隔色
					cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）escape(encodeURIComponent(user_name))
					sortable : true, //是否启用排序
					sortOrder : "asc", //排序方式
					queryParams : queryParams,//传递参数（*）
					sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
					//pagination : true, //是否显示分页（*）
					pageList : [5,10],//每页的记录行数（*）
					pageNumber : 1, //初始化加载第一页，默认第一页
					pageSize : 5,//可供选择的每页的行数（*）
					clickToSelect : true, //是否启用点击选中行
					uniqueId : "shareholder_num", //每一行的唯一标识，一般为主键列
					cardView : false, //是否显示详细视图
					jsonpCallback : call2,
					detailView : false, //是否显示父子表
					singleSelect: true,
					onLoadSuccess:function(data){
						var allData=$("#DetailOwnershipStructureTable").bootstrapTable("getData");
						var dlength=allData.length;
						if(dlength>0){
							var sumAmount=0;
							var sumRatio=0;
							for(var i=0;i<dlength;i++){
								sumAmount+=parseFloat(allData[i]["AMOUNT"]);
								sumRatio+=parseFloat(allData[i]["SHAREHOLDING_RATIO"]);
							}
							var sumRow={};
							sumRow.R="合计";
							sumRow.SHAREHOLDER_NUM="";
							sumRow.SHAREHOLDER_NAME="合计";
							sumRow.AMOUNT=sumAmount;
							sumRow.SHAREHOLDING_RATIO=sumRatio.toFixed(2);
							$("#DetailOwnershipStructureTable").bootstrapTable("append",sumRow);
							$("#DetailOwnershipStructureTable").bootstrapTable("mergeCells",{
								index:dlength,
								field:"R",
								rowspan:0,
								colspan:2,
								radio:false
							});
						}
					},
					columns : [ {
						field : 'Number',
						title : '序号',
						align : "center",
						formatter: function (value, row, index) {
							return index+1;
						}
					},{
						field : 'SHAREHOLDER_NUM',
						title : '股东编号',
						align : "center",
						visible:false
					},{
						field : 'SHAREHOLDER_NAME',
						title : '股东名称',
						align : "center",
					},{
						field : 'AMOUNT',
						title : '出资金额(元)',
						align : "center",
						formatter : function(value,row,index){
							if(value!=""&&value!=null&&value!=undefined){
								value=parseFloat(value).toFixed(2);
								return formatNumber(value);
							}else{
								return value;
							}
						}
					}, {
						field : "SHAREHOLDING_RATIO",
						title : "持股比例",
						align : "center",
						formatter : function(value){
							return value+"%";
						}
					} ]
				});
		var call3=getMillisecond();
		//360视图中的财务信息
		$("#DetailFinancialInfoTable").bootstrapTable(
				{
					//请求后台的URL（*）
					url : dev_outsource+'SupplierInfo/queryFinancialInfoByNum.asp?sup_num='+nums+"&SID="+SID+"&call="+call3,
					method : 'get', //请求方式（*）   
					striped : false, //是否显示行间隔色
					cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）escape(encodeURIComponent(user_name))
					sortable : true, //是否启用排序
					sortOrder : "asc", //排序方式
					queryParams : queryParams,//传递参数（*）
					sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
					//pagination : true, //是否显示分页（*）
					pageList : [5,10],//每页的记录行数（*）
					pageNumber : 1, //初始化加载第一页，默认第一页
					pageSize : 5,//可供选择的每页的行数（*）
					clickToSelect : true, //是否启用点击选中行
					uniqueId : "financial_num", //每一行的唯一标识，一般为主键列
					cardView : false, //是否显示详细视图
					detailView : false, //是否显示父子表
					singleSelect: true,
					jsonpCallback : call3,
					onLoadSuccess:function(data){
					},
					columns : [ {
						field : 'Number',
						title : '序号',
						align : "center",
						formatter: function (value, row, index) {
							return index+1;
						}
					},{
						field : 'FINANCIAL_NUM',
						title : '财务信息编号',
						align : "center",
						visible:false
					},{
						field : 'YEAR',
						title : '年度/指标（合并口径）',
						align : "center"
					},{
						field : 'TOTAL_ASSETS',
						title : '总资产（元）',
						align : "center",
						formatter : function(value,row,index){
							if(value!=""&&value!=null&&value!=undefined){
								value=parseFloat(value).toFixed(2);
								return formatNumber(value);
							}else{
								return value;
							}
						}
					},{
						field : 'NET_ASSETS',
						title : '净资产（元）',
						align : "center",
						formatter : function(value,row,index){
							if(value!=""&&value!=null&&value!=undefined){
								value=parseFloat(value).toFixed(2);
								return formatNumber(value);
							}else{
								return value;
							}
						}
					},{
						field : 'SALES_AMOUNT',
						title : '销售额（元）',
						align : "center",
						formatter : function(value,row,index){
							if(value!=""&&value!=null&&value!=undefined){
								value=parseFloat(value).toFixed(2);
								return formatNumber(value);
							}else{
								return value;
							}
						}
					},{
						field : 'NET_PROFITS',
						title : '净利润(元)',
						align : "center",
						formatter : function(value,row,index){
							if(value!=""&&value!=null&&value!=undefined){
								value=parseFloat(value).toFixed(2);
								return formatNumber(value);
							}else{
								return value;
							}
						}
					}, {
						field : "TOTAL_ASSETS_RATE",
						title : "总资产利润率",
						align : "center",
						formatter : function(value){
							if(value!=""&&value!=null&&value!=undefined){
								return value+"%";
							}else{
								return value;
							}
						}
					}, {
						field : "ASSET_LIABILITY_RATIO",
						title : "资产负债率",
						align : "center",
						formatter : function(value){
							if(value!=""&&value!=null&&value!=undefined){
								return value+"%";
							}else{
								return value;
							}
						}
					}, {
						field : "NET_CASH_FLOWS",
						title : "经营活动现金流量净额(元)",
						align : "center",
						formatter : function(value,row,index){
							if(value!=""&&value!=null&&value!=undefined){
								value=parseFloat(value).toFixed(2);
								return formatNumber(value);
							}else{
								return value;
							}
						}
					}, {
						field : "CASH_EQUIVALENTS",
						title : "期末现金及现金等价物余额(元)",
						align : "center",
						formatter : function(value,row,index){
							if(value!=""&&value!=null&&value!=undefined){
								value=parseFloat(value).toFixed(2);
								return formatNumber(value);
							}else{
								return value;
							}
						}
					}, {
						field : "CURRENT_ASSETS_RATIO",
						title : "期末货币资金占流动资产比例",
						align : "center",
						formatter : function(value){
							if(value!=""&&value!=null&&value!=undefined){
								return value+"%";
							}else{
								return value;
							}
						}
					} ]
				});
		var call5=getMillisecond();
		//资质文件
		$("#DetailEnclInfoTable").bootstrapTable(
				{
					//请求后台的URL（*）
					url : dev_outsource+'SupplierInfo/queryEnclByNum.asp?sup_num='+nums+"&SID="+SID+"&call="+call5,
					method : 'get', //请求方式（*）   
					striped : false, //是否显示行间隔色
					cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）escape(encodeURIComponent(user_name))
					sortable : true, //是否启用排序
					sortOrder : "asc", //排序方式
					queryParams : queryParams,//传递参数（*）
					sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
					//pagination : true, //是否显示分页（*）
					pageList : [5,10],//每页的记录行数（*）
					pageNumber : 1, //初始化加载第一页，默认第一页
					pageSize : 5,//可供选择的每页的行数（*）
					clickToSelect : true, //是否启用点击选中行
					uniqueId : "encl_num", //每一行的唯一标识，一般为主键列
					cardView : false, //是否显示详细视图
					jsonpCallback : call5,
					detailView : false, //是否显示父子表
					singleSelect: true,
					onLoadSuccess:function(data){
					},
					columns : [ {
						field : 'ENCL_NUM',
						title : '附件编号',
						align : "center",
						visible:false
					},{
						field : 'Number',
						title : '序号',
						align : "center",
						formatter: function (value, row, index) {
							return index+1;
						}
					},{
						field : 'ENCL_TYPE',
						title : '类别',
						align : "center"
					},{
						field : 'ENCL_NAME',
						title : '资质名称',
						align : "center",
					},{
						field : "ISSUE_AUTHORITY",
						title : "颁发机构",
						align : "center"
					},{
						field : "EFFICIENT_TIME",
						title : "生效时间",
						align : "center"
					},{
						field : "END_TIME",
						title : "终止时间",
						align : "center"
					}]
				});
		var call6=getMillisecond();
		//360视图中主要客户签约情况
		$("#DetailSignInfoTable").bootstrapTable(
				{
					//请求后台的URL（*）
					url : dev_outsource+'SupplierInfo/querySignInfoByNum.asp?sup_num='+nums+"&SID="+SID+"&call="+call6,
					method : 'get', //请求方式（*）   
					striped : false, //是否显示行间隔色
					cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）escape(encodeURIComponent(user_name))
					sortable : true, //是否启用排序
					sortOrder : "asc", //排序方式
					queryParams : queryParams,//传递参数（*）
					sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
					//pagination : true, //是否显示分页（*）
					pageList : [5,10],//每页的记录行数（*）
					pageNumber : 1, //初始化加载第一页，默认第一页
					pageSize : 5,//可供选择的每页的行数（*）
					clickToSelect : true, //是否启用点击选中行
					uniqueId : "sign_num", //每一行的唯一标识，一般为主键列
					cardView : false, //是否显示详细视图
					detailView : false, //是否显示父子表
					singleSelect: true,
					jsonpCallback : call6,
					onLoadSuccess:function(data){
					},
					columns : [ {
						field : 'Number',
						title : '序号',
						align : "center",
						formatter: function (value, row, index) {
							return index+1;
						}
					},{
						field : 'SIGN_NUM',
						title : '签约编号',
						align : "center",
						visible:false
					},{
						field : 'CUS_NAME',
						title : '客户名称',
						align : "center"
					},{
						field : 'SIGN_TYPE',
						title : '签约类别',
						align : "center",
						formatter : function(value, row, index) {
							if(value == "01") {
								return "五大行";
							} else if(value == "02") {
								return "股份制银行";
							} else if(value == "03"){
								return "其他银行";
							} else{
								return "其他客户";
							}
						}
					},{
						field : 'SIGN_DATE',
						title : '签约时间',
						align : "center",
					},{
						field : 'SIGN_MONEY',
						title : '项目规模',
						align : "center"
					}, {
						field : "LINKMAN_NAME",
						title : "客户联系人",
						align : "center"
					}, {
						field : "LINK_TEL",
						title : "联系人电话",
						align : "center"
					}, {
						field : "PRODUCT",
						title : "签约主要产品/服务",
						align : "center",
					} ]
				});
	};
})(suplierDetail={});