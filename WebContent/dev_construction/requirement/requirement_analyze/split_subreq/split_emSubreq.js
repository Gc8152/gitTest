
initEmReqSplitBtn();
var currTab=getCurrentPageObj();
function initEmReqSplitLayout(ids){
	var emreqSplitCall=getMillisecond();
	baseAjaxJsonp(dev_construction+"requirement_input/queryEmRequirementInfoByID.asp?SID="+SID+"&req_id="+ids+"&call="+emreqSplitCall, null , function(data) {
		for ( var k in data) {
			var str=data[k];
			k = k.toLowerCase();//大写转换为小写
	     if(k=="req_id"){
	    	 currTab.find("input[name='" + k + "']").val(str);
	     }
	     else if(k=="affect_other_system"){
	    	 if(str=="0"){
	    		 currTab.find("input[name='" + k + "']:last").attr("checked","true");
	    		 currTab.find("div[name='affect_other_system_describe']").attr("disabled","disabled");
	    	 }
	    	 else{
	    		 currTab.find("input[name='" + k + "']:first").attr("checked","true"); 
	    		 currTab.find("div[name='affect_other_system_describe']").attr("validate","v.required");
	    	 }
	    	
	     }
	     else  if(k=="affect_other_system_describe"){
	    	 currTab.find("div[name='" + k + "']").text(str);
	     }
	     else  if(k=="change_system_fuction"){
	    	 if(str=="0"){
	    		 currTab.find("input[name='" + k + "']:last").attr("checked","true");
	    		 currTab.find("div[name='change_system_fuction_describe']").attr("disabled","disabled");
	    	 }
	    	 else{
	    		 currTab.find("input[name='" + k + "']:first").attr("checked","true"); 
	    		 currTab.find("div[name='change_system_fuction_describe']").attr("validate","v.required");
	    		 
	    	 }
	     }
	     else  if(k=="change_system_fuction_describe"){
	    	 currTab.find("div[name='" + k + "']").text(str);
	     }
	     else  if(k=="change_data_structure"){
	    	 if(str=="0"){
	    		 currTab.find("input[name='" + k + "']:last").attr("checked","true");
	    		 currTab.find("div[name='change_data_structure_describe']").attr("disabled","disabled");
	    	 }
	    	 else{
	    		 currTab.find("input[name='" + k + "']:first").attr("checked","true"); 
	    		 currTab.find("div[name='change_data_structure_describe']").attr("validate","v.required");
	    		 
	    	 }
	     }
	     else  if(k=="change_data_structure_describe"){
	    	 currTab.find("div[name='" + k + "']").text(str);
	     }
	     else  if(k=="update_system_file"){
	    	 if(str=="0"){
	    		 currTab.find("input[name='" + k + "']:last").attr("checked","true");
	    		 currTab.find("div[name='update_system_file_describe']").attr("disabled","disabled");
	    	 }
	    	 else{
	    		 currTab.find("input[name='" + k + "']:first").attr("checked","true"); 
	    		 currTab.find("div[name='update_system_file_describe']").attr("validate","v.required");
	    		 
	    	 }
	     }
	     else  if(k=="update_system_file_describe"){
	    	 currTab.find("div[name='" + k + "']").text(str);
	     }
	     else  if(k=="emreq_solution"){
	    	 currTab.find("div[name='" + k + "']").text(str);
	     }
	     else  if(k=="emreq_test_suggest"){
	    	 currTab.find("div[name='" + k + "']").text(str);
	     }
	     else  if(k=="req_code"){
	    	 currTab.find("div[name='" + k + "']").text(str);
	     }
	     else  if(k=="req_acc_classify"){
	    	 currTab.find("input[name='" + k + "']").val(str);
	     }
	     else  if(k=="req_analysis"){
	    	 currTab.find("input[name='" + k + "']").val(str);
	     }
	     else  if(k=="file_id"){
	    	 currTab.find("input[name='" + k + "']").val(str);
	     }
	     else{
			currTab.find("div[name='" + k + "']").text(str);
			}
		}
		initEmReqSubList();//初始化子需求列表
		//初始化附件列表
		initVlidate($("#emReq_splitForm"));
		var business_code = getCurrentPageObj().find("#req_code_reqSP").text();
		var emtable = getCurrentPageObj().find("#emReqSplit_filetable");
		getSvnFileList(emtable, getCurrentPageObj().find("#emReqSplit_fileview_modal"), business_code, "0101");
	},emreqSplitCall);
}
//初始化按钮
function initEmReqSplitBtn(){
	//提交并保存
	$('#summitForSplitTask').click(function(){
		    var req_id=getCurrentPageObj().find('#req_id_reqSP').val();
		    var sub_req_state="02";
		     baseAjaxJsonp(dev_construction+"requirement_splitreq/updateSubReqState.asp?SID="+SID+"&req_id="+req_id+"&sub_req_state="+sub_req_state, null , function(data) {
				if (data != undefined && data != null && data.result=="true") {
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
						}
					});   
	          });
	
//新增子需求
 $('#requirementSub_add').click(function(){
	 openReqSubPop("SubReqPop","add",null);//传入调用pop框的div的id,操作类型，子需求编号
 });
 
}

//初始化子需求列表
function initEmReqSubList(){
	var req_id=getCurrentPageObj().find('#req_id_reqSP').val();
	if(req_id==null||req_id==""){
		alert("子需求列表获取需求id失败");
		return;
	}
	var queryParams = function(params) {
		var temp = {
			limit : params.limit, // 页面大小
			offset : params.offset
		// 页码
		};
		return temp;
	};
	var reqSubCall = getMillisecond();
	getCurrentPageObj().find('#gRequirementSub').bootstrapTable("destroy").bootstrapTable({
				url :dev_construction+"requirement_splitreq/queryReqSubList.asp?SID="+SID+"&req_id="+req_id+"&call="+reqSubCall,
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
				uniqueId : "SUB_REQ_CODE", // 每一行的唯一标识，一般为主键列
				cardView : false, // 是否显示详细视图
				detailView : false, // 是否显示父子表
				jsonpCallback:reqSubCall,
				singleSelect : true,// 复选框单选
				columns : [{
					field : 'SUB_REQ_CODE',
					title : '需求点编号',
					align : "center",
				},{
					field : 'SUB_REQ_NAME',
					title : '需求点名称',
					align : "center",
				},{
					field : 'SUB_REQ_STATE_DISPLAY',
					title : '需求点状态',
					align : "center",
				},{
					field : 'PLAN_ONLINETIME',
					title : '计划投产时间',
					align : "center",
				},{
					field : 'SUB_REQ_CONTENT',
					title : '需求点描述',
					align : "center",
				}, {
					field : 'SUB_REQ_CODE',
					title : "操作",
					align : "center",
				    formatter : function(value){
				    	     if(value!=null){
								return "<a href='#' onclick='updateReqSub(" + JSON.stringify(value) + ")' style="+'"color:blue"'+">修改</a>" +"&nbsp;&nbsp;"+
									   "<a href='#' onclick='deleteReqSub(" + JSON.stringify(value) + ")' style="+'"color:blue"'+">删除</a>";
				    	   }	
						   }	
				           }]
			     });
 }


//修改子需求
function updateReqSub(sub_req_code){
	openReqSubPop("SubReqPop","update",sub_req_code);
	
}

//删除子需求
function deleteReqSub(sub_req_code){
	nconfirm("确定删除吗？", function() {
		baseAjaxJsonp(dev_construction+"requirement_splitreq/deleteReqSub.asp?SID="+SID+"&sub_req_code="+sub_req_code, null , function(data) {
			if (data != undefined && data != null && data.result=="true") {
				alert("删除成功");
				$('#gRequirementSub').bootstrapTable('refresh');
			}else{
				var mess=data.mess;
				alert("删除失败："+mess);
			}
		});
	});
}






