var changeInitiate_editCall = getMillisecond();//table回调方法名
var subCall = getMillisecond();//需求点表回调方法
//初始化事件
function changeInitiateEdit(item){
	var $page = getCurrentPageObj();//当前页
	initVlidate($page);//渲染必填项
	autoInitSelect($page);//初始化下拉选择
	if(item){//如果是修改
		initAppInfo(item);//初始化申请信息
	}
	initFileTable(item);//初始化附件相关
	initButtonEvent();//初始化按钮事件
	
/****************************************************************/	
	//初始化申请信息
	function initAppInfo(item){
		for(var k in item){
			if(k == 'CHANGE_REASON_TYPE'){
				initSelect($page.find("[name='IU."+ k +"']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_CHANGE_REASON_TYPE"},item[k]);
				continue;
			}
			$page.find("[name='IU."+ k +"']").val(item[k]);
		}
	}
	
	//按钮事件
	function initButtonEvent(){
		//需求编号 pop框 IU.REQ_MANAGER_ID
		$page.find("[name='IU.REQ_CODE']").click(function(){
			var $requirementPop = $page.find("[mod='requirementPop']");
			var $REQ_ID = $page.find("[name='IU.REQ_ID']");
			var $REQ_CODE = $page.find("[name='IU.REQ_CODE']");
			var $REQ_NAME = $page.find("[name='IU.REQ_NAME']");
			var $CHANGE_BUSINESSER = $page.find("[name='IU.CHANGE_BUSINESSER']");
			var $CHANGE_BUSINESS_PHONE = $page.find("[name='IU.CHANGE_BUSINESS_PHONE']");
			var $CHANGE_ANALYZE_ID = $page.find("[name='IU.CHANGE_ANALYZE_ID']");
			var $CHANGE_ANALYZE_NAME = $page.find("[name='IU.CHANGE_ANALYZE_NAME']");
			var $REQ_PRODUCT_MANAGER = $page.find("[name='IU.REQ_PRODUCT_MANAGER']");
			var $SYSTEM_NAME = $page.find("[name='IU.SYSTEM_NAME']");
			var $REQ_SUBS_TABLE = $page.find("#initiate_reqSubsTable");
			requirementPop($requirementPop, {
				REQ_ID : $REQ_ID,
				REQ_CODE : $REQ_CODE,
				REQ_NAME : $REQ_NAME,
				CHANGE_BUSINESSER : $CHANGE_BUSINESSER,
				CHANGE_BUSINESS_PHONE : $CHANGE_BUSINESS_PHONE,
				CHANGE_ANALYZE_ID : $CHANGE_ANALYZE_ID,
				CHANGE_ANALYZE_NAME : $CHANGE_ANALYZE_NAME,
				REQ_PRODUCT_MANAGER : $REQ_PRODUCT_MANAGER,
				REQ_SUBS_TABLE : $REQ_SUBS_TABLE,
				SYSTEM_NAME : $SYSTEM_NAME,
				CALL : subCall
			});
		});
		
		
		//变更分析人 pop框
		$page.find("[name='IU.CHANGE_ANALYZE_NAME']").click(function(){
			var $changeAnalyzePop = $page.find("[mod='changeAnalyzePop']");
			var $CHANGE_ANALYZE_ID = $page.find("[name='IU.CHANGE_ANALYZE_ID']");
			var $CHANGE_ANALYZE_NAME = $page.find("[name='IU.CHANGE_ANALYZE_NAME']");
			analyzePop($changeAnalyzePop, {
				CHANGE_ANALYZE_ID : $CHANGE_ANALYZE_ID,
				CHANGE_ANALYZE_NAME  : $CHANGE_ANALYZE_NAME });
		});
		
		
		
		//保存按钮
		$page.find("[btn='saveAppInfo']").click(function(){
			addAppInfo("save");
		});
		
		//提交按钮
		$page.find("[btn='submitAppInfo']").click(function(){
			addAppInfo("submit");
			
		});
		
	};
	
	//保存||提交
	function addAppInfo(opt_type){
		
		var params = getPageParam("IU");
		params["OPT_TYPE"] = opt_type;
		var changeReason = getCurrentPageObj().find("[name='IU.CHANGE_REASON']").attr("placeholder");
		var changeDes = getCurrentPageObj().find("[name='IU.CHANGE_DESCRIPTION']").attr("placeholder");
		if(params.CHANGE_REASON == changeReason){
			params.CHANGE_REASON = '';
		}
		if(params.CHANGE_DESCRIPTION == changeDes){
			params.CHANGE_DESCRIPTION = '';
		}
		
		if(!vlidate($page,"",true)){
			alert("有必填项未填");
			return ;
		}
		
		var filedata = getCurrentPageObj().find("#initiate_fileTable").bootstrapTable("getData");
		  if(filedata==""||filedata==undefined){
			  alert("该需求变更还未上传需求变更申请书！");
			  return;
		  }
		  
		  var aaa=getCurrentPageObj().find("[name='IU.CHANGE_REASON']").val();
		    if(aaa.length>100){
		    	alert("变更原因至多可输入100汉字！");
		    	return;
		    }
		    var bbb=getCurrentPageObj().find("[name='IU.CHANGE_DESCRIPTION']").val();
		    if(bbb.length>130){
		    	alert("变更描述至多可输入130汉字！");
		    	return;
		    }
		
		var sCall = getMillisecond();
		baseAjaxJsonp(dev_construction+"requirement_change/editAppInfo.asp?SID=" + SID + "&call=" + sCall, params, function(data) {
			if(data && data.result=="true"){
				alert(data.msg);
				closeCurrPageTab();
			}else{
				alert(data.msg);
				closeCurrPageTab();
			}
		},sCall,false);
	}
	
	//初始化附件列表
	function initFileTable(item) {
		
		 //附件上传
		 var tablefile = $page.find("#initiate_fileTable");
		 var business_code = "";
		 business_code = $page.find("#FILE_ID_EDIT").val();
		 if(typeof(business_code)!="undefined"){
			 business_code = Math.uuid();
			 $page.find("#FILE_ID_EDIT").val(business_code);
		 }

		 //点击打开模态框
		 var addfile = $page.find("#reqChange_upFile");
		 addfile.click(function(){
			 var systemName = getCurrentPageObj().find("[name='IU.SYSTEM_NAME']").val();
			 if(systemName == ''||systemName== undefined){
				 alert("请先选择需求");
				 return;
			 }
			 var paramObj = new Object();
			 paramObj["SYSTEM_NAME"] = systemName;
			 paramObj["REQ_CODE"] = getCurrentPageObj().find("input[name='IU.REQ_CODE']").val();
			 openFileSvnUpload($page.find("#file_modal"), tablefile, 'GZ1072',business_code, '00', 'S_DIC_REQ_CHA_FILE', false, false, paramObj);
		 });

		 //附件删除
		 var delete_file = $page.find("#reqChange_delFile");
		 delete_file.click(function(){
			 delSvnFile(tablefile, business_code, "00");
		 });
		 
		 getSvnFileList(tablefile, $page.find("#file_initiate_modal"), business_code, "01");
		
	}	
	
	
	
	
	
	var queryParams = function(params) {
		var temp = {
			limit : params.limit, // 页面大小
			offset : params.offset
		// 页码
		};
		return temp;
	};
	var reqId = $page.find("[name='IU.REQ_ID']").val();
	var sUrl = dev_construction+"requirement_change/queryReqSubs.asp?SID=" + 
			SID + "&call=" + subCall + "&REQ_ID=" + reqId;
	$page.find("#initiate_reqSubsTable").bootstrapTable({
		url :sUrl,
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
		pageSize : 10, // 每页的记录行数（*）
		clickToSelect : true, // 是否启用点击选中行
		// height: 460, //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
		uniqueId : "REQ_ID", // 每一行的唯一标识，一般为主键列
		cardView : false, // 是否显示详细视图
		detailView : false, // 是否显示父子表
		singleSelect : true,// 复选框单选
		jsonpCallback:subCall,
		onDblClickRow:function(row){
		},onLoadSuccess : function(data){
			gaveInfo();
		},
		columns : [ {
			field : 'ORDER_ID',
			title : '序号',
			align : "center",
			width : "50px",
			formatter:function(value,row,index){
				return index + 1;
			}
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
	
	
	
	
}

