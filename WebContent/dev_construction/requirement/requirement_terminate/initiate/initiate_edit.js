
//初始化事件
function terInitEdit(){
	var $page = getCurrentPageObj();//当前页
	initVlidate($page);//渲染必填项
	autoInitSelect($page);//初始化下拉选择
	initButtonEvent();//初始化按钮事件
	
/****************************************************************/	
	
	//按钮事件
	function initButtonEvent(){
		//需求 pop框 
		$page.find("[name='IU.REQ_CODE']").click(function(){
			var $reqPop = $page.find("[mod='reqTerminatePop']");
			var $REQ_ID = $page.find("[name='IU.REQ_ID']");
			var $REQ_CODE = $page.find("[name='IU.REQ_CODE']");
			var $REQ_NAME = $page.find("[name='IU.REQ_NAME']");
			var $SUB_REQ_ID = $page.find("[name='IU.SUB_REQ_ID']");
			var $SUB_REQ_CODE = $page.find("[name='IU.SUB_REQ_CODE']");
			var $SUB_REQ_NAME = $page.find("[name='IU.SUB_REQ_NAME']");
			var $REQ_TASK_STATE_NAME = $page.find("[name='IU.REQ_TASK_STATE_NAME']");
			var $REQ_PRODUCT_MANAGER = $page.find("[name='IU.REQ_PRODUCT_MANAGER']");
			var $PROJECT_MAN_ID = $page.find("[name='IU.PROJECT_MAN_ID']");
			reqPop($reqPop, {
				REQ_ID : $REQ_ID,
				REQ_CODE : $REQ_CODE,
				REQ_NAME : $REQ_NAME,
				SUB_REQ_ID : $SUB_REQ_ID,
				SUB_REQ_CODE : $SUB_REQ_CODE,
				SUB_REQ_NAME : $SUB_REQ_NAME,
				REQ_TASK_STATE_NAME : $REQ_TASK_STATE_NAME,
				REQ_PRODUCT_MANAGER : $REQ_PRODUCT_MANAGER,
				PROJECT_MAN_ID : $PROJECT_MAN_ID,
				func_call : function(row){
					refTab(row.REQ_ID);
				}
			});
		});
		
		
		
		
		
		
		
		//提交按钮
		$page.find("[btn='saveti']").click(function(){
			var params = getPageParam("IU");
			var initExp = getCurrentPageObj().find("[name='IU.INITIATE_EXPLAIN']").attr("placeholder");
			if(params.INITIATE_EXPLAIN == initExp){
				params.INITIATE_EXPLAIN = '';
			}
			var selections=getCurrentPageObj().find("#subReqTab").bootstrapTable("getRecallSelections");
			var subData=getCurrentPageObj().find("#subReqTab").bootstrapTable("getData").length;
			if(subData>0&&selections.length <1) {
				alert("请至少选择一条数据!");
				return;
			}
			params.SUB_REQS= JSON.stringify(selections);
			if(!vlidate($page,"",true)){
				alert("有必填项未填");
				return ;
			}
			
			var aaa=getCurrentPageObj().find("[name='IU.INITIATE_EXPLAIN']").val();
		    if(aaa.length>230){
		    	alert("终止描述至多可输入230汉字！");
		    	return;
		    }
			
			var sCall = getMillisecond();
			baseAjaxJsonp(dev_construction+"req_terminate/initiateApply.asp?SID=" + SID + "&call=" + sCall, params, function(data) {
				if(data && data.result=="true"){
					alert(data.msg);
					closeCurrPageTab();
				}else{
					alert(data.msg);
					closeCurrPageTab();
				}
			},sCall,false);
			
		});
		
	};
	
}

	
	function refTab(REQ_ID){
		getCurrentPageObj().find("#subReqTab").bootstrapTable('refresh',{
			url : dev_construction+"req_terminate/querySubList.asp?REQ_ID=" +REQ_ID+"&TYPE=1"}
		);
	}

	(function(){
		var subCall = getMillisecond();
		var queryParams = function(params) {
			var temp = {
				limit : params.limit, // 页面大小
				offset : params.offset,
				call:subCall,
				SID:SID
			// 页码
			};
			return temp;
		};
		getCurrentPageObj().find("#subReqTab").bootstrapTable({
			method : 'get', // 请求方式（*）
			striped : false, // 是否显示行间隔色
			cache : false, // 是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
			sortable : true, // 是否启用排序
			sortOrder : "asc", // 排序方式
			queryParams : queryParams,// 传递参数（*）
			sidePagination : "server", // 分页方式：client客户端分页，server服务端分页（*）
			pagination : true, // 是否显示分页（*）
			pageList : [ 5, 10, 15 ], // 可供选择的每页的行数（*）
			pageNumber : 1, // 初始化加载第一页，默认第一页
			pageSize : 5, // 每页的记录行数（*）
			clickToSelect : true, // 是否启用点击选中行
			// height: 460, //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
			uniqueId : "SUB_REQ_ID", // 每一行的唯一标识，一般为主键列
			cardView : false, // 是否显示详细视图
			detailView : false, // 是否显示父子表
			singleSelect : false,// 复选框单选
			jsonpCallback:subCall,
			onLoadSuccess : function(data){
				var $cri = getCurrentPageObj().find("#TER_SUBREQID_STR");
				if(data.subreqstr !='' && data.subreqstr!= undefined){
					$cri.val(data.subreqstr);
				}
				gaveInfo();
			},
			columns : [{
				checkbox : true,
				rowspan : 2,
				align : 'center',
				valign : 'middle'
			}, {
				field : 'SUB_REQ_CODE',
				title : '需求点编号',
				align : "center"
			}, {
				field : "SUB_REQ_NAME",
				title : "需求点名称",
				align : "center"
			}, {
				field : "SUB_REQ_STATE_NAME",
				title : "需求点状态",
				align : "center"
			}, {
				field : "SUB_REQ_CONTENT",
				title : "需求点描述",
				align : "center"
			}]
			
		});
	})();


