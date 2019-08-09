

initSplitReqListLayOut();

function initSplitReqListLayOut(){
	
	var currTab= getCurrentPageObj();
	var queryForm = currTab.find("#splitReqQueryForm");
	var table = currTab.find("#gReqInfoForAnalyzeTable");
	

 //初始化字典
 autoInitSelect(queryForm);	

 //初始化按钮
 initSplitReqListBtn();
 function initSplitReqListBtn() {
	 //加载提出部门
	 currTab.find("#AnalyzeQuery_put_org_code").click(function(){
			$(".drop-ztree").hide();
			openSelectTreeDiv($(this),"reqAnalyzeQuery2_tree_id","SOrg/queryOrgTreeWithCenterList.asp",{"margin-top": "2px",width:"170px",position:"relative"},function(node){
				currTab.find("#AnalyzeQuery_put_org_code").val(node.name);
				currTab.find("#req_put_dept_AnalyzeQuery").val(node.id);
				currTab.find("#reqAnalyzeQuery2_tree_id").hide();
			});
		});
	// 查询
	 currTab.find("#serach_reqQuery").click(function() {
		var param = queryForm.serialize();//获取表单的值
		table.bootstrapTable('refresh',{
			url:dev_construction+"requirement_splitreq/queryReqForAnalyzeList.asp?SID="+SID+"&"+param});
	});
	 enterEventRegister(getCurrentPageObj().attr("class"), function(){getCurrentPageObj().find("#serach_reqQuery").click();});
	//重置
	currTab.find('#reset_reqQuery').click(function() {
		queryForm[0].reset();
		currTab.find('#req_put_dept_AnalyzeQuery').val("");//非ie8下reset()方法不能清除隐藏项的值
		currTab.find('#system_id_AnalyzeQuery').val("");
		currTab.find('#create_person_AnalyzeQuery').val("");
		var selects = currTab.find("select");
		for(var i=0; i<selects.length; i++){
			$(selects[i]).select2();
		}
	});
	
	
	//转交
	currTab.find('#change_analyzer').click(function() {
		var seles = getCurrentPageObj().find("#gReqInfoForAnalyzeTable").bootstrapTable('getSelections');
		if(seles.length != 1){
			alert('请选择一个任务进行转交');
			return;
		}
		seles[0].role = '0027';//需求分析岗
		openChangeUserPop("change_analyzerPop",seles[0],change_analyzer);
		
		
	});
	
	
	currTab.find("#req_sub_auto_split").click(function(){
		nconfirm("将自动拆分一个需求点或更新现有需求点状态，是否确定更改？", function(){
			var row = getCurrentPageObj().find("#gReqInfoForAnalyzeTable").bootstrapTable('getSelections');
			//console.log(JSON.stringify(row[0]));
			//console.log(row[0].REQ_ID);
			baseAjaxJsonp(dev_construction+"requirement_splitreq/autoSpritAndupdateSubReqState.asp?SID="+SID+"&req_id="+req_id+"&sub_req_state="+sub_req_state, null , function(data) {
				if (data != undefined && data != null && data.result=="true") {
					alert("拆分及更新状态成功!", function(){
						closeCurrPageTab();
					});
				}else{
					if(data.msg!=null&&data.msg!=undefined){
						alert("执行失败:"+data.msg);
					}else{
					  alert("执行失败");
					}
				}
			});   
		});
	});
	//判断是否需求分析
	currTab.find("#req_sub_split").click(function(){

		var id =getCurrentPageObj().find("#gReqInfoForAnalyzeTable").bootstrapTable('getSelections');
		var ids = $.map(id, function (row) {return row.REQ_ID;});
		var p_owner = $.map(id, function (row) {return row.P_OWNER;});//需求分析师为当前责任人
		var req_acc_classify=$.map(id, function (row) {return row.REQ_ACC_CLASSIFY;});
		if(id.length==1){
		if(p_owner!=SID){
			alert("您不是所选数据的当前责任人！");
			return;
		}
		
		var app_status=$.map(id, function (row) {return row.APP_STATUS;});
		var system_id=$.map(id, function (row) {return row.SYSTEM_ID;});
		var status = $.map(id, function (row) {return row.REQ_STATE;});
		
		if(status=='13'){
		  alert("需求已完成，不能再拆分");
		  return;
		}
		if(req_acc_classify=="02"||req_acc_classify=="03"){//项目类需求需要判断立项
			if(app_status!="02"){
				alert("该需求立项未通过，不能拆分需求点");
				return;
			}
		}
		
		if(req_acc_classify=="03"){
			if(system_id==null||system_id==""){
				alert("该项目需求还未指定应用，不能拆分子需求");
				return;
			}
		}
		}else{
	        alert("请选择一条需求进行分析！");
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
		if(req_acc_classify=="00"){
			nconfirm("是否拆分或修改需求点", function(){
				closeAndOpenInnerPageTab("emrequirement_splitreq","紧急需求拆分","dev_construction/requirement/requirement_analyze/split_subreq/split_emSubreq.html",function(){
					initEmReqSplitLayout(ids);//加载需求拆分页面信息
					});
			},function(){
				    var sub_req_state="02";
				     baseAjaxJsonp(dev_construction+"requirement_splitreq/updateSubReqState.asp?SID="+SID+"&req_id="+ids+"&sub_req_state="+sub_req_state, null , function(data) {
							});  
			});
		}
		else{
			newconfirm("是否拆分或修改需求点", function(){
			closeAndOpenInnerPageTab("requirement_splitreq","需求拆分","dev_construction/requirement/requirement_analyze/split_subreq/split_subreq.html",function(){
				initSplitReqInformationLayOut(ids);//加载需求拆分页面信息
				});
		},function(){
			// var req_id=getCurrentPageObj().find('#req_id_reqSP').val();
			    var sub_req_state="02";
			     baseAjaxJsonp(dev_construction+"requirement_splitreq/updateSubReqState.asp?SID="+SID+"&req_id="+ids+"&sub_req_state="+sub_req_state, null , function(data) {
					/*if (data != undefined && data != null && data.result=="true") {
								alert("提交成功!", function(){
									closeCurrPageTab();
								});
							}else{
								var mess=data.mess;
								if(mess!=null&&mess!=undefined){
									alert("提交失败:"+mess);
								}else{
								  alert("提交失败");
								}
							}*/
						});  
		});
		}
		
	});
	//需求分析
	currTab.find("#req_analyzed").click(function(){
		var id =getCurrentPageObj().find("#gReqInfoForAnalyzeTable").bootstrapTable('getSelections');
		var ids = $.map(id, function (row) {return row.REQ_ID;});
		var p_owner = $.map(id, function (row) {return row.P_OWNER;});//需求分析师为当前责任人
		if(id.length==1){
		if(p_owner!=SID){
			alert("您不是所选数据的当前责任人！");
			return;
		}
		var req_acc_classify=$.map(id, function (row) {return row.REQ_ACC_CLASSIFY;});
		var app_status=$.map(id, function (row) {return row.APP_STATUS;});
		var system_id=$.map(id, function (row) {return row.SYSTEM_ID;});
		var status = $.map(id, function (row) {return row.REQ_STATE;});
		
		if(status=='13'){
		  alert("需求已完成，不能再拆分");
		  return;
		}
		if(req_acc_classify=="02"||req_acc_classify=="03"){//项目类需求需要判断立项
			if(app_status!="02"){
				alert("该需求立项未通过，不能拆分需求点");
				return;
			}
		}
		
		if(req_acc_classify=="03"){
			if(system_id==null||system_id==""){
				alert("该项目需求还未指定应用，不能拆分子需求");
				return;
			}
		}
		
			closeAndOpenInnerPageTab("requirement_splitreq","需求拆分","dev_construction/requirement/requirement_analyze/split_subreq/split_subreq.html",function(){
				initSplitReqInformationLayOut(ids);//加载需求拆分页面信息
				});
		}else{
	        alert("请选择一条需求进行分析！");
		}	
	});	
	
	//查看详情
	currTab.find("#req_splitSubreq_detail").click(function(){
		var id = getCurrentPageObj().find("#gReqInfoForAnalyzeTable").bootstrapTable('getSelections');
		var ids = $.map(id, function (row) {return row.REQ_ID;});
		var req_acc=$.map(id, function (row) {return row.REQ_ACC_CLASSIFY;});
		if(id.length==1){
			if(req_acc=="00"){
				closeAndOpenInnerPageTab("emsubreq_detail","紧急需求点详情","dev_construction/requirement/requirement_analyze/split_subreq/splitEmSubreq_detail.html",function(){
					initEmReqSplitDetail(ids);//初始化页面信息
					});	
			}
			else{
			closeAndOpenInnerPageTab("subreq_detail","需求点详情","dev_construction/requirement/requirement_analyze/split_subreq/splitSubreq_detail.html",function(){
				initSplitReqDetailLayOut(ids);//初始化页面信息
				});
			}
		}else{
	        alert("请选择一条数据进行查看！");
		}	
	});	
	
	//加载应用pop
	currTab.find('#system_name_AnalyzeQuery').click(function(){
		openTaskSystemPop("spt_system_pop",{sysno:getCurrentPageObj().find("#system_id_AnalyzeQuery"),sysname:getCurrentPageObj().find("#system_name_AnalyzeQuery")});
	});
	//需求提出人pop
	currTab.find("#create_person_name_AnalyzeQuery").click(function() {
			openUserPop("crp_reqspt",{name:currTab.find('#create_person_name_AnalyzeQuery'),no:currTab.find('#create_person_AnalyzeQuery')});
		});
  }	

//初始化列表
initSplitReqQueryTable();
function initSplitReqQueryTable() {
		var subQueryListCall=getMillisecond();
		var queryParams = function(params) {
			var temp = {
				limit : params.limit, // 页面大小
				offset : params.offset,// 页码
				call : subQueryListCall
			};
			return temp;
		};
		table.bootstrapTable("destroy").bootstrapTable({
					url :dev_construction+"requirement_splitreq/queryReqForAnalyzeList.asp?SID="+SID,
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
					uniqueId : "REQ_CODE", // 每一行的唯一标识，一般为主键列
					cardView : false, // 是否显示详细视图
					detailView : false, // 是否显示父子表
					jsonpCallback:subQueryListCall,
					singleSelect : true,// 复选框单选
					onLoadSuccess:function(data){
						gaveInfo();
					},
					columns : [ {
						checkbox : true,
						rowspan : 2,
						align : 'center',
						valign : 'middle'
					},{
						field : 'REQ_ID',
						title : '需求序列号',
						align : "center",
						visible:false,
					},{
						field : 'REQ_CODE',
						title : '需求编号',
						align : "center",
						width : "180px",
					}, {
						field : 'REQ_NAME',
						title : '需求名称',
						align : "center",
						width : "200px",
					}, {
						field : "REQ_TYPE1_DISPLAY",
						title : "需求大类",
						align : "center",
						width : "100px",
					}, {
						field : "REQ_ACC_CLASSIFY_DISPLAY",
						title : "需求类别",
						align : "center",
						width : "100px",
					}, {
						field : "REQ_STATE_NAME",
						title : "需求状态",
						align : "center",
						width : "120px",
					}, {
						field : "REQ_SCORE_DISPLAY",
						title : "需求优先级",
						align : "center",
						width : "90px",
					},{
						field : "SYSTEM_NAME",
						title : "应用名称",
						align : "center",
						width : "180px",
					},{
						field : "SUB_NUMS",
						title : "子需求个数",
						align : "center",
						width : "120px",
					}, {
						field : "REQ_PUT_DEPT_NAME",
						title : "提出部门",
						align : "center",
						width : "120px",
					}, {
						field : "CREATE_PERSON_NAME",
						title : "需求提出人",
						align : "center",
						width : "90px",
					}, {
						field : "SUMMIT_TIME",
						title : "需求提出日期",
						align : "center",
						width : "118px",
					}, {
						field : "REQ_OPERATION_DATE",
						title : "要求投产时间",
						align : "center",
						width : "118px",
					}, {
						field : "P_OWNER_NAME",
						title : "当前责任人",
						align : "center",
						width : "90px",
					}, {
						field : "P_OWNER",
						title : "当前责任人",
						align : "center",
						visible:false,
					}, {
						field : "REQ_STATE",
						title : "需求状态",
						align : "center",
						visible:false,
					}]
				});
	}
}



function change_analyzer(item){
	nconfirm("确定将任务["+item.REQ_CODE+"]转交["+item.USER_NAME+"]?",function(){
		var param = {};
		param.USER_NO = item.USER_NO;
		param.REQ_ID = item.REQ_ID;
		param.REQ_STATE = item.REQ_STATE;
		  baseAjaxJsonp(dev_construction+"requirement_splitreq/reqChangeUser.asp?SID="+SID, param , function(data) {
				 if (data != undefined && data != null && data.result=="true") {
					 alert(data.msg);
					 getCurrentPageObj().find("#gReqInfoForAnalyzeTable").bootstrapTable('refresh',{
							url:dev_construction+"requirement_splitreq/queryReqForAnalyzeList.asp?SID="+SID});
			 	 }else{
			 		 alert(data.msg);
			 	 }
			  });
	});
}


