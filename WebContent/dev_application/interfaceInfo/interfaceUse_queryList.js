var url = '';
//按钮方法
function initQueryInterUseButtonEvent(){
	var $page = getCurrentPageObj();
	$page.find("#interuseQuery").click(
			function() {
                var param=$page.find("#interfaceUse_queryList_form").serialize();
                $page.find('#interuseTableInfo').bootstrapTable('refresh',{url:dev_application+'InterUseQuery/queryallinteruse.asp?SID='+SID+'&'+param});
				
			});
	//enter触发查询
	enterEventRegister(getCurrentPageObj().attr("class"), function(){getCurrentPageObj().find("#interuseQuery").click();});
	
	$page.find("#interuseReset").click(function() {
		$page.find("#interfaceUse_queryList_form input").val("");
		var uselects = $page.find("#interfaceUse_queryList_form select");
		uselects.val(" ");
		uselects.select2();
	});
	
	//消费方 pop框按钮
	$page.find("[name='custe_system_name']").click(function(){
		
		var $name = $page.find("[name='custe_system_name']");
		var $id = $page.find("[name='con_system_id']");
		var $systemPop = $page.find("[mod='systemPop']");
		query_systemPop($systemPop, {id : $id, name : $name});
	});
	
	//服务方 pop框按钮
	$page.find("[name='ser_system_name']").click(function(){
		var $name = $page.find("[name='ser_system_name']");
		var $id = $page.find("[name='con_system_id']");
		var $systemPop = $page.find("[mod='systemPop']");
		query_systemPop($systemPop, {id : $id, name : $name});
	});
	
}

//查询列表显示table
function initInterUseTableInfo() {
	 var param1=getCurrentPageObj().find("#interfaceUse_queryList_form").serialize();
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	getCurrentPageObj().find("#interuseTableInfo").bootstrapTable(
			{
				//请求后台的URL（*）
				url:dev_application+'InterUseQuery/queryallinteruse.asp?SID='+SID+'&'+param1,
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
				//uniqueId : "interuse_no", //每一行的唯一标识，一般为主键列
				cardView : false, //是否显示详细视图
				detailView : false, //是否显示父子表
				singleSelect: true,
				onLoadSuccess : function(data){
					gaveInfo();
					fileData = getInterFileList();
					initFileUploadAction(fileData);
				},
				columns : [ {
					title : '序号',
					align : "center",
					sortable: true,
					formatter: function (value, row, index) {
						return index+1;
					}
				}, {
					field : "SER_SYSTEM_NAME",
					title : "服务方应用名称",
					align : "center"
				},{
					field : 'CON_SYSTEM_NAME',
					title : '消费方应用名称',
					align : "center"
				}, {
					field : "INTER_CODE",
					title : "接口编号",
					align : "center",
					width : "100",
					formatter : function(value, row, index) {
						var optHtml = "";
						if(row.INTER_STATUS=="02"){//新建接口
								optHtml = "<span class='hover-view'"+
								"onclick='InfcUse_InterDetail(\"" + index + "\")'>"+value+"</span>";
							}
						else{
							optHtml = "<div>"+value+"</div>";
						}
						return optHtml;}
						
				}, {
					field : "TRADE_CODE",
					title : "接口交易码",
					align : "center"
				}, {
					field : "INTER_NAME",
					title : "接口名称",
					align : "center"
				}, {
					field : "INTER_DESCR",
					title : "接口描述",
					align : "center"
				}, {
					field : "INTER_STATUS_NAME",
					title : "接口状态",
					align : "center"				
				}, {
					field : "START_TIME",
					title : "开始服务日期",
					align : "center"
				}, {
					field : "explain",
					title : "接口调用说明",
					align : "center",
					formatter:function(value, row, index){
						var str = "<div name='file_info_div' style='margin: 0 auto 10px 0' bid='"+row.FILE_ID+"' index='"+index+"'>";
						str += "<a name='inter_use_file_detail' style='margin-left:10px;display:none;'>查看</a>" +
						"<a name='inter_use_file_download' style='margin-left:10px;display:none;'>下载</a>";
						str +="<div/>";
						return str;
					}
				} ]
			});
	
	var fileData = null;
	var file_view_div = getCurrentPageObj().find("#add_fileview_modal");
	function initFileUploadAction(){
		var $details = getCurrentPageObj().find("#interuseTableInfo").find("a[name=inter_use_file_detail]");
		var $downloads = getCurrentPageObj().find("#interuseTableInfo").find("a[name=inter_use_file_download]");
		
		//初始化查看按钮
		$details.unbind('click').click(function(){
			var $div = $(this).parent();
			var file_id = $div.attr("file_id");
			if(fileData!==null){
				for(var k in fileData){
					var file = fileData[k];
					if(file_id==file.ID){
						ftpFileInfoDetailModel(file_view_div, file);
					}
				}
			} else {
				alert("文件不存在！");
			}
		});
		//初始化下载按钮
		$downloads.unbind('click').click(function(){
			var $div = $(this).parent();
			var file_id = $div.attr("file_id");
			verifyFileExit(file_id);
		});
	}
	//获取文件列表并绑定文件id到相应的按钮上
	function getInterFileList(){
		var affectTableData = getCurrentPageObj().find("#interuseTableInfo").bootstrapTable('getData');
		var businessArr = $.map(affectTableData, function(row) {
			return row.FILE_ID;
		});
		if(businessArr.length>0){
			var fileData = getFtpFileListByBc(businessArr, "00");
			if(fileData.length>0){
				for(var k in fileData){
					var file = fileData[k];
					var $div = getCurrentPageObj().find("#interuseTableInfo").find("div[bid="+file["BUSINESS_CODE"]+"]");
					$div.attr("file_id", file.ID);
					if(typeof(file["BUSINESS_CODE"])!="undefined"){
						$div.find("a[name=inter_use_file_detail]").show();
						$div.find("a[name=inter_use_file_download]").show();
					}
				}
			}
			return fileData;
		}
		return null;
	}
	
};
//下拉框方法
function initInterUseQueryType(){
	//初始化数据
	initSelect(getCurrentPageObj().find("#interuse_status"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"I_DIC_INTER_STATUS"},"bb");
}
//点击链接获取详细的接口信息
function InfcUse_InterDetail(index){
	var selects=getCurrentPageObj().find("#interuseTableInfo").bootstrapTable('getData');
	var row=selects[index];
var id =row.INTER_ID;
var version= row.INTER_VERSION;
	closeAndOpenInnerPageTab("interfaceinfo_360mesbasic","接口信息查询","dev_application/interfaceInfo/interfaceinfo_360mesbasic.html",function(){
		var modObj = getCurrentPageObj().find("#inter360_basic_table");
		Inter360InfoDetail(id);
		inter360initAttrTable(id,version,modObj,"table[tb=360attrTable] tbody",null);
		//报文输入输出信息
		initImportContentQuery(id,"AImportContentList",version);
		initExportContentQuery(id,"AExportContentList",version);
		//接口调用关系查询
		initInter_useRelationQuery(id);
		//接口版本信息
		initVersionListTable(id);
		//变更列表信息
		initExchangeListQuery(id);
	});
}
initInterUseQueryType();
initQueryInterUseButtonEvent();
initInterUseTableInfo();


