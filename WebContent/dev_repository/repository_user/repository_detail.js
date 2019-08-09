function repositoryOrVersion(item,type){//初始化
	var $page = getCurrentPageObj();
	var intell_id = item.INTELL_ID;
	//赋值
	for(var k in item){
		$page.find("[name='REP."+ k +"']").val(item[k]);
	}
	
	//附件列表
	//点击打开模态框
	var tablefile = $page.find("#table_file");
	var business_code = item.FILE_ID;
	if(typeof(business_code)!="undefined"){
		 getFtpFileList(tablefile, getCurrentPageObj().find("#fileview_modal"), business_code, "1");
	}
	var queryParams = function(params) {
		var temp = {
			limit : params.limit, // 页面大小
			offset : params.offset
		// 页码
		};
		return temp;
	};
	initVersionTable(intell_id);
	//初始化版本列表
	function initVersionTable(intell_id){
		var optCallq = getMillisecond();
		$page.find('[tb="version_Table"]').bootstrapTable('destroy');
		$page.find('[tb="version_Table"]').bootstrapTable({
			//请求后台的URL（*）
			url:"Repository/queryAllVersion.asp?SID="+SID+'&call='+optCallq+'&INTELL_ID='+intell_id,
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
			//uniqueId : "", //每一行的唯一标识，一般为主键列
			cardView : false, //是否显示详细视图
			detailView : false, //是否显示父子表
			jsonpCallback : optCallq,
			singleSelect: true,
			onLoadSuccess : function(data){
				gaveInfo();
			},
			columns : [
			 {
				field : "",
				title : "序号",
				align : "center",
				formatter:function(value,row,index){
					return index + 1;
				}	
			},{
				field : 'TITLE',
				title : '标题',
				align : "center"
			}, {
				field : 'CONTENT',
				title : '内容',
				align : "center"
			}, {
				field : 'UPDATE_EXPLAIN',
				title : '更新说明',
				align : "center"
			}, 
			{
				field : 'UPDATE_TIME',
				title : '操作时间',
				align : "center"
			},
			{
				field : 'RELEASE_PERSON_NAME',
				title : '发布人',
				align : "center"
			},
			{
				field : "DID",
				title : "操作",
				align : "center",
				formatter:function(value,row,index){
					/*return '<a style="color:blue" href="javascript:void(0)" onclick="openRepositoryDetail(\''+row.INTELL_ID+'\',\''+row.VERSION_CODE+'\')";>'+"查看"+'</a>';*/
					return '<span class="hover-view" name="download_file" index="'+index+'">'
				 	+'<a style="color:blue" href="javascript:void(0)" onclick="openRepositoryDetail('+row.INTELL_ID+',\''+row.VERSION_CODE+'\')">查看<a/></span>';	
				}	
			}
			]
		});
	}

}
//打开知识详情页面
function openRepositoryDetail(INTELL_ID,VERSION_CODE){
	getCurrentPageObj().find('#myTab a[href="#repository_info"]').tab('show');
}