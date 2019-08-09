//初始化字典项
(function(){
	initSelect(getCurrentPageObj().find("[name='inter_app_status']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"I_DIC_INTER_APP_STATUS"});
})();
//获取时间戳
var queryList_call = getMillisecond()+'2';
//初始化页面按钮
function interfaceESBUseAnalysedTest(){
	var $page = getCurrentPageObj();
	var currTab = getCurrentPageObj();
	var table = currTab.find("#interDesignTable");
	//重置按钮
	getCurrentPageObj().find("#reset").click(function() {
		getCurrentPageObj().find("#interDesignForm input").val("");

	});
	
	//接口设计
	currTab.find('#inter_Design').click(function(){
		//此处判断是新增接口还是已有接口，转向不行的url
		var seles = table.bootstrapTable("getSelections");
		if(seles.length!=1){
			alert("请选择一条数据进行设计!");
			return;
		}
		if(seles[0].INTER_APP_STATUS == '06'){
			alert("状态为ESB待分析的数据不能再设计!");
			return;
		}
		url = "dev_application/serInterDesign/interDesign_edit.html";
		closeAndOpenInnerPageTab("interDesignEdit", "新建接口设计",url, function(){
			initDesignDetail(seles[0]);
		});

	});
	
	//接口拿回
	currTab.find('#inter_Return').click(function(){
		//此处判断是新增接口还是已有接口，转向不行的url
		var seles = table.bootstrapTable("getSelections");
		if(seles.length!=1){
			alert("请选择一条数据进行设计!");
			return;
		}
		if(seles[0].INTER_APP_STATUS != '06'){
			alert("请选择接口申请状态为ESB待分析的数据!");
			return;
		}
		newconfirm=function(msg,callback,cancelback){
			if(!nconfirmIsShow){
				return;
			}
			nconfirmIsShow=false;
			setTimeout(function(){
			 $.Zebra_Dialog(msg, {
		         'type':     'close',
		         'title':    '提示',
		         'buttons':  ['是','否'],
		         'onClose':  function(caption) {
		        	 nconfirmIsShow=true;
		           if (caption=="是"&&callback) {
		        	   callback();
		           }else if (cancelback) {
		        	   //closePageTab("split_req");
		        	   //closeAndOpenInnerPageTab("split_les_req","需求任务拆分","dev_construction/requirement/requirement_analyze/split_task/splitTask_lessQuerylist.html",null);
		        	   alert("请在需求任务拆分进行操作!");
		        	   cancelback();
		    		}
		         }
		     });
			},200);
		};
		nconfirm("是否进行拿回操作", function(){
			var url = dev_application+'IDesign/interDesignBack.asp?call='+queryList_call+'&SID='+SID+'&INTER_APP_STATUS=05';
			baseAjax(url, {"APP_ID" : seles[0].APP_ID}, function(data){
				if (data != undefined&&data!=null&&data.result=="true") {
					alert("拿回成功！",function(){
						currTab.find('#interDesignTable').bootstrapTable('refresh',{url:getDesignUrl()							
						});
					});
				} else {
					alert("拿回失败！");
				}
			});	
		},function(){
			return;
		});
	});

	//查询按钮
	getCurrentPageObj().find("#queryInterDesign").click(function() {
		currTab.find('#interDesignTable').bootstrapTable('refresh',{url:getDesignUrl()
		
		});
	
	});

	//enter触发查询
	enterEventRegister(getCurrentPageObj().attr("class"), function(){getCurrentPageObj().find("#queryInterDesign").click();});
	
	//消费方 pop框按钮
	$page.find("[name='consumer_name']").click(function(){
		var $name = $page.find("[name='consumer_name']");
		var $id = $page.find("[name='con_system_id']");
		var $systemPop = $page.find("[mod='systemPop']");
		query_systemPop($systemPop, {id : $id, name : $name});
	});
	
	//服务方 pop框按钮
	$page.find("[name='ESBvice_name']").click(function(){
		var $name = $page.find("[name='ESBvice_name']");
		var $id = $page.find("[name='con_system_id']");
		var $systemPop = $page.find("[mod='systemPop']");
		query_systemPop($systemPop, {id : $id, name : $name});
	});
////初始化页面table  
//function initESBUseAnalysedInfo() {
	
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	table.bootstrapTable("destroy").bootstrapTable({
			//请求后台的URL（*）
			url :getDesignUrl(),
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
			uniqueId : "SYSTEM_ID", // 每一行的唯一标识，一般为主键列
			cardView : false, // 是否显示详细视图
			detailView : false, // 是否显示父子表
			jsonpCallback:queryList_call,
			singleSelect : true,// 复选框单选
			onLoadSuccess : function(data){
				gaveInfo();
			},
			columns : [ {	
				checkbox:true,
				rowspan: 2,
				align: 'center',
				valign: 'middle'
			},{
				field : "REQ_TASK_CODE",
				title : "关联任务编号",
				align : "center",
			    width : '180',
			    formatter:function(value,row,index){
			    	if(value==undefined){
			    		return '';
			    	}else{
			    		return '<a style="color:blue" href="javascript:void(0)" onclick="openReqTaskDetailDes(\''+row.REQ_TASK_ID+'\')";>'+value+'</a>';
			    	}
			    }
			},{
				field : "INTER_CODE",
				title : "接口编号",
				align : "center",
				width : '100'
			},{
				field : "INTER_NAME",
				title : "接口名称",
				align : "center"
			},{
				field : "TRADE_CODE",
				title : "接口交易码",
				align : "center",
				width : '100'
			},{
				field: 'APP_TYPE_NAME',
				title : '申请类型',
				align: 'center'
			},{
				field : "INTER_APP_STATUS_NAME",
				title : "接口申请状态",
				align : "center"
			},{
				field : "CON_SYSTEM_NAME",
				title : "消费方应用名称",
				align : "center"
			}, {
				field : 'SER_SYSTEM_NAME',
				title : '服务方应用名称',
				align : "center"
			},{
				field : "REQ_FINISH_TIME",
				title : "要求完成日期",
				align : "center"
			}, {
				field : "APP_USER_NAME",
				title : "申请人",
				align : "center"
				
			}, {
				field : "CURRENT_MAN2",
				title : "当前处理人",
				align : "center"
			}, {
				field : "APP_TIME",
				title : "申请日期",
				align : "center",
				width : '200'
			}

			]
		});
}

//initESBUseAnalysedInfo();
interfaceESBUseAnalysedTest();

//组装查询url 
function getDesignUrl(){
	var url = dev_application+'IDesign/queryDesignList.asp?call='+queryList_call+'&SID='+SID;
	var param = getCurrentPageObj().find("#interDesignForm").serialize();
	/*var queryCondition = getCurrentPageObj().find("#InterDesignForm [name]");
	for(var i=0; i<queryCondition.length; i++){
		var obj=$(queryCondition[i]);
		if($.trim(obj.val())!=""){
			url+='&'+obj.attr("name")+"="+escape(encodeURIComponent(obj.val()));
		}
	}*/
	return url+"&"+param;
}

//打开任务详情页面
function openReqTaskDetailDes(req_task_id){
	closeAndOpenInnerPageTab("req_taskDetail","任务详情页面","dev_construction/requirement/requirement_analyze/task_accept/task_detail.html",function(){
		initReqTaskDetailLayout(req_task_id);
	  });
}
