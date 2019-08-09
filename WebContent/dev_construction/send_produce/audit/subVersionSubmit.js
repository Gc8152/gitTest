function initAnnualVersionEditEvent(item,type){//item作为新增修改标识
	var currTab = getCurrentPageObj();//当前页
	var tableCall=getMillisecond();	
	var table = currTab.find("#table_subReq");
	for (var key in item) {
		if(key=="VERSIONS_ID"||key=="VERSIONS_TYPE"){
			currTab.find("input[name='A."+key+"']").val(item[key]);
		}else{
			currTab.find("#"+key).html(item[key]);
			currTab.find("#"+key).html(item[key]);
			currTab.find("#"+key).html(item[key]);
		}
		
	}
	
	//选择剥离需求
	currTab.find("#add_peelAudit").unbind("click");
	currTab.find("#add_peelAudit").click(function() {
		var versions_id = currTab.find("#VERSIONS_ID").val();
		openSubReqPop("auditPop",{ "version_id":versions_id});			
	});
	var file_id = (item.FILE_ID||Math.uuid());
	if("15"==item.VERSIONS_TYPE){//紧急需求隐藏评审附件信息
		currTab.find('div[name="type15"]').hide();
	}else{//初始化附件信息
		//上传评审附件
		var review_file=currTab.find("#review_file");
		var tablefile1=currTab.find("#reviewadd_filetable");//queryFTPFileByBusinessCode
		review_file.unbind("click");
		review_file.click(function() {
			openFileSvnUpload(getCurrentPageObj().find("#reqviewaAdd_modalfile"), tablefile1, 'GZ1077',file_id, '0101', 'S_DIC_REVIEW_ACC_FILE', false, false, {FILE_DIR:file_id});
		});
		//附件删除
		var delete_file1 = getCurrentPageObj().find("#reviewdelete_file");
		delete_file1.click(function(){
			delSvnFile(tablefile1, file_id, "0101");
		});
		//初始化附件列表
		getSvnFileList(tablefile1, getCurrentPageObj().find("#reqviewAss_fileview_modal"), file_id, "0101");
	}
	//提交
	var save = currTab.find("#submit_sub");
	save.click(function(){
		if(!vlidate(currTab,"",true)){
			alert("你还有必填项未填");
			return ;
		}
		if("15"!=item.VERSIONS_TYPE&&!checkFileUpload()){//不等于紧急版本
			return;
		}
		var result = getSupData();//影响分析
		result.param["file_id"]=file_id;
		var call=getMillisecond()+"verpro";	
		baseAjaxJsonp(dev_construction+"reqSubAudit/saveReqSubAudit.asp?call="+call+"&SID="+SID,result.param, function(data){
			if (data != undefined && data != null && data.result=="true" ) {
				alert(data.msg);
				closePageTab("add_annual");
			}else{ 
				alert(data.msg);
			}
		}, call);
	});

	//检查投产附件上传情况
	function checkFileUpload(){
		//校验是否上传了文件
		var fileData  = tablefile1.bootstrapTable('getData');
		if(fileData!=null&& fileData.length>0){
				var oneLevel="《一级投产评审记录表》";//00
				var twoLevel="《二级投产评审记录表》";//01
				for(var i=0; i<fileData.length; i++){
					var fileType = fileData[i]["FILE_TYPE"];
					if(fileType==undefined){
						continue;
					}
					if(fileType.indexOf("00") >= 0){
						oneLevel="";
					}else if(fileType.indexOf("01") >= 0){
						twoLevel="";
					}
				}
				var msg=oneLevel+twoLevel;
				if(""==msg){
					return true;
				}else{
					alert("请上传"+msg);
					return false;
				}
		} else {
				alert("请上传投产评审附件");
				return false ;
		}
	}
	function getSupData(){
		var result = new Object();
		result.flag = true;
		var currTab = getCurrentPageObj();
		var param = {};
		param = getPageParam("A");
		
		var versionSupreqData = table.bootstrapTable('getData');
		var sendSupreqList = new Array();
		$.each(versionSupreqData, function(j) {
			var obj = new Object();
			obj.sub_req_id = versionSupreqData[j].SUB_REQ_ID;
			/*var is_peel = currTab.find("#IS_PEEL"+j).val().trim();
			obj.is_peel = is_peel; 
			if(is_peel == "" || is_peel == undefined || is_peel == "undefined"){
				result.flag = false;
				result.line = j;
				return;
			}*/
			sendSupreqList.push(obj);
		});
		
		param["sendSupreqList"] = JSON.stringify(sendSupreqList);
		result.param = param;
		return result;
	}
	
	
	
	//年度版本计划列表显示
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	var version_id = item.VERSIONS_ID;
	var flag = true;
	var flag2 = true;
	if(type=="1"){
		version_id = version_id + '33d'; 
		flag2 = false;
	}else{
		flag = false;
	}
	table.bootstrapTable({
		//请求后台的URL（*）
		url : dev_construction+'reqSubAudit/querySubReqList.asp?SID='+SID+'&call='+tableCall+'&version_id='+version_id,
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
		uniqueId : "SUB_REQ_ID", //每一行的唯一标识，一般为主键列
		cardView : false, //是否显示详细视图
		detailView : false, //是否显示父子表
		singleSelect: true,
		jsonpCallback:tableCall,
		onLoadSuccess:function(data){
			gaveInfo();	
		},
		columns : [ {
			field : 'Number',
			title : '序号',
			align : "center",
		    width: "6%",
			formatter: function (value, row, index) {
				return index+1;
			}
		}, {
			field : 'SUB_REQ_CODE',
			title : '需求点编号',
			align : "center",
			width : "120px",
			formatter:function(value, row, index) {
				var veiw = '<a class="click_text_sp" cursor:pointer;" onclick="veiwTask('+row.REQ_TASK_ID+');">'+value+'</a>';
				return veiw;  
			},
		}, {
			field : "SUB_REQ_NAME",
			title : "需求点名称",
			align : "center",
		}, {
			field : "TASK_STATE_NAME",
			title : "主线任务状态",
			align : "center",
		}, {
			field : "SYSTEM_NAME",
			title : "应用名称",
			align : "center",
		}, {
			field : "PROJECT_MAN_NAME",
			title : "应用负责人",
			align : "center",
		},{
			field : "TASK_COUNT",
			title : "涉及任务数",
			align : "center",
		},{
			field : "TASK_NOSEND_COUNT",
			title : "未提交投产任务",
			align : "center",
		}/*,{
			field : "SEND_COUNT",
			title : "涉及投产单数",
			align : "center",
		},{
			field : "NO_SEND_COUNT",
			title : "投产单审计不通过数",
			align : "center",
		}*/,{
			field : "IS_PEEL",
			title : "评审结论",
			align : "center",
			formatter:function(value, row, index) {
				if(value=="00"){
					return "不通过";
				}else if(value=="01"){
					return "通过";
				}else{
					return "未评审";
				}
			},
			visible:flag2
		},{
			width : "50px",
			field : "",
			title : "操作",
			align : "center",
			formatter:function(value, row, index) {
				var edit= '<a class="click_text_sp" cursor:pointer;" onclick="delSupProTask('+row.SUB_REQ_ID+');">删除</a>';
				return edit;  
			},
			visible:flag
		}]
	});
	
	
};

function delSupProTask(id) {
	var currTab = getCurrentPageObj();
	//删除该行
	currTab.find("#table_subReq").bootstrapTable("removeByUniqueId", id);		
}

//需求任务详情
function veiwTask(req_task_id) {
	closePageTab("req_taskDetail");
	openInnerPageTab("req_taskDetail","任务详情页面","dev_construction/requirement/requirement_analyze/task_accept/task_detail.html",function(){
		initReqTaskDetailLayout(req_task_id);
	});		
}