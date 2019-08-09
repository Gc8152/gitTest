//初始化事件
initVerifyList();

function initVerifyList(){
	var $page = getCurrentPageObj();//当前页
	initVlidate($page);//渲染必填项
	autoInitSelect($page);//初始化下拉选
	var formObj = $page.find("#verifyForm");//表单对象
	var verifyCall = getMillisecond();//table回调方法名
	var verifyTable = $page.find("[tb='verifyTable']");
	
	//初始化列表
	initVerifyTable();
	//重置按钮
	$page.find("[name='resetVerify']").click(function(){
		$page.find("select").val(" ").select2();
		$page.find("table input").val("");
		$page.find("[name='MODULE_ID']").html('<option value="">请选择</option>').val("").select2();
		$page.find("[name='FUNCPOINT_ID']").html('<option value="">请选择</option>').val("").select2();
		$page.find("select[name='PRIORITY_LEVEL']").val(" ").select2();
	});
	
	//查询按钮
	 $page.find("[name='queryVerify']").click(function(){
		 var param = formObj.serialize();
		 verifyTable.bootstrapTable('refresh',{
				url:dev_test+"verifyDefect/queryVerifyDefectList.asp?SID=" + SID + "&call=" + verifyCall +'&'+param});
	 });
	//enter触发查询
		enterEventRegister(getCurrentPageObj().attr("class"), function(){getCurrentPageObj().find("[name='queryVerify']").click();});
	 
	//验证缺陷
	 $page.find("button[name='verifyDefect']").click(function(){
			var seles = verifyTable.bootstrapTable("getSelections");
			if(seles.length!=1){
					alert("请选择一条数据!");
					return;
			}
			if(seles[0].DEFECT_STATE == '05'){//已拒绝
				 closeAndOpenInnerPageTab("verifyRefuse","验证缺陷","dev_test/defectManagement/verify/defectVerify_refuse.html", function(){
					 verifyRefuse(seles[0]);
					});
			}
			if(seles[0].DEFECT_STATE == '06' || seles[0].DEFECT_STATE == '07'){//已修复
				 closeAndOpenInnerPageTab("verifyFix","验证缺陷","dev_test/defectManagement/verify/defectVerify_fix.html", function(){
					 verifyFix(seles[0]);
					});
			}
	 });
	 
	 
	//查看详情
//	 $page.find("button[name='verifyDetail']").click(function(){
//		 var seles = verifyTable.bootstrapTable("getSelections");
//			if(seles.length!=1){
//					alert("请选择一条数据进行查看!");
//					return;
//			}
//
//		 closeAndOpenInnerPageTab("verifyDetail","查看缺陷详情","dev_test/defectManagement/query/defect_detail.html", function(){
//			 detailDefect(seles[0]);
//			});
//	 });
	//关闭缺陷
	 $page.find("button[name='closeDefect']").click(function(){
		 var seles = verifyTable.bootstrapTable("getSelections");
			if(seles.length!=1){
					alert("请选择一条数据!");
					return;
			}
			nconfirm("确定需要关闭该缺陷？",function(){
				var call_sub = getMillisecond();
				baseAjaxJsonp(dev_test+'verifyDefect/saveVerify.asp?call='+call_sub+'&SID='+SID,{"DEFECT_ID":seles[0].DEFECT_ID,"TYPE":"close"},function(data){
					if(data&&data.result=="true"){
						getCurrentPageObj().find("[tb='verifyTable']").bootstrapTable("refresh");
					}else{
						alert("关闭失败");
					}
				},call_sub);
			});
			
	 }); 
	//重新打开
	 $page.find("button[name='reopenDefect']").click(function(){
		 var seles = verifyTable.bootstrapTable("getSelections");
			if(seles.length!=1){
					alert("请选择一条数据!");
					return;
			}
			$page.find("#refuseDefect_modal").modal('show');
			initVlidate($page.find("#refuseDefect_modal"));
			$page.find("[name='IU.FILE_ID']").val(seles[0].FILE_ID);
			var file_showTd=$page.find("#file_showTd");
			file_showTd.html("");
			findFileInfo(seles[0].FILE_ID,function(data){
				if(data.rows.length>0){
					defaultShowFileInfo(seles[0].FILE_ID,file_showTd,data,true,"outResumeFileDiv");
				}
			});
//			nconfirm("确定需要重新该缺陷？",function(){
//				var call_sub = getMillisecond();
//				baseAjaxJsonp(dev_test+'verifyDefect/saveVerify.asp?call='+call_sub+'&SID='+SID,{"DEFECT_ID":seles[0].DEFECT_ID,"TYPE":"reopen"},function(data){
//					if(data&&data.result=="true"){
//						getCurrentPageObj().find("[tb='verifyTable']").bootstrapTable("refresh");
//						alert("重新打开成功");
//					}else{
//						alert("重新打开失败");
//					}
//				},call_sub);
//			});
			
	 }); 
	//初始化附件列表
		var file_id = $page.find("#ETA_out_resume_file").val();
		if(""==$.trim(file_id)){
			$page.find("#ETA_out_resume_file").val(Math.uuid());
		}
		$page.find("#ETA_out_resume").click(function(){
			openFileUploadInfo('outResumeFile','OUT_RESUME',
					$page.find("#ETA_out_resume_file").val(),
					function(data){
						defaultShowFileInfo($page.find("#ETA_out_resume_file").val(),
						$page.find("#file_showTd"),data,true,"outResumeFileDiv");
			});
		});
		
	//重新打开缺陷保存
	$page.find("[btn='refuse_save']").click(function(){
		if(!vlidate($page,"",true)){
			return ;
		}
		var seles = verifyTable.bootstrapTable("getSelections");
		var params = {};
		params["TYPE"] = 'reopen';
		params["DISPOSE_REASON"] = $page.find("[name='IU.DISPOSE_REASON']").val();
		params["DEFECT_ID"] = seles[0].DEFECT_ID;
		params["FILE_ID"] = $page.find("[name='IU.FILE_ID']").val();
		$page.find("#refuseDefect_modal").modal('hide');
		saveDispose(params);
	});
	function saveDispose(params){
		var sCall = getMillisecond();
		baseAjaxJsonp(dev_test+"verifyDefect/saveVerify.asp?SID=" + SID + "&call=" + sCall, params, function(data) {
			if(data && data.result=="true"){
				getCurrentPageObj().find("[tb='verifyTable']").bootstrapTable("refresh");
				//alert(data.msg);
			}else{
				alert(data.msg);
				//closeCurrPageTab();
			}
		},sCall,false);
	}
	 //初始化表
	function initVerifyTable() {
		var queryParams = function(params) {
			var temp = {
				limit : params.limit, // 页面大小
				offset : params.offset
			// 页码
			};
			return temp;
		};
		verifyTable.bootstrapTable({
					url : dev_test+"verifyDefect/queryVerifyDefectList.asp?SID=" + SID + "&call=" + verifyCall,
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
					uniqueId : "DEFECT_ID", // 每一行的唯一标识，一般为主键列
					cardView : false, // 是否显示详细视图
					detailView : false, // 是否显示父子表
					singleSelect : true,// 复选框单选
					jsonpCallback: verifyCall,
					onLoadSuccess : function(data){
						gaveInfo();
					},
					columns : [ {
						checkbox : true,
						rowspan : 2,
						align : 'center',
						valign : 'middle'
					},/*{
						field : 'ORDER_ID',
						title : '序号',
						align : "center",
						width : "60",
						formatter:function(value,row,index){
							return index + 1;
						}
					},*/ {
						field : "DEFECT_NUM",
						title : "缺陷编号",
						width : "150",
						align : "center",
						//visible:false
					},{
						field : "SUMMARY",
						title : "缺陷摘要",
						width : "400",
						align : "center",
						formatter : function(value,row,index){
							return req_namformatter(24,value);
						}
						//visible:false
					},{
						field : "DEFECT_STATE_NAME",
						title : "缺陷状态",
						align : "center",
						width : "120"
					}, {
						field : "SYSTEM_NAME",
						title : "应用名称",
						width : "120",
						align : "center",
						//visible:false
					}, {
						field : "MODULE_NAME",
						title : "模块名称",
						width : "120",
						align : "center",
						//visible:false
					},{
						field : "FUNCPOINT_NAME",
						title : "功能点",
						width : "120",
						align : "center"
					}, 
					 {
						field : "SEVERITY_GRADE_NAME",
						title : "缺陷等级",
						align : "center",
						width : "120"
					},{
						field : "PRIORITY_LEVEL_NAME",
						title : "缺陷优先级",
						align : "center",
						width : "120"
					},{
						field : "CREATE_MAN_NAME",
						title : "提出人",
						align : "center",
						width : "120"
					},{
						field : "CREATE_TIME",
						title : "缺陷提出时间",
						align : "center",
						width : "180",
						//visible:false
					},{
						field : "DISPOSE_MAN_NAME",
						title : "处理人",
						align : "center",
						width : "120"
					},{
						field : "DISPOSE_TIME",
						title : "处理时间",
						align : "center",
						width : "180",
						//visible:false
					},{
						field : "COMPLETE_TIME",
						title : "要求完成时间",
						align : "center",
						width : "180",
						//visible:false
					}]
				});
	}
	//选择应用
	$page.find("[name='SYSTEM_NAME']").click(function(){
		//选择应用
		var $SYSTEM_NAME = $page.find("[name='SYSTEM_NAME']");
		var $SYSTEM_ID= $page.find("[name='SYSTEM_ID']");
		openSystemPop('sendProduceSystemPop', {
			name : $SYSTEM_NAME,
			id  : $SYSTEM_ID,
			duty_name : $page.find("[name='IU.DUTY_PERSON_NAME']"),
			duty_id : $page.find("[name='IU.DUTY_PERSON']"),
			func_call:selectModule
		});
	});
	//添加查询模块
	function selectModule(){
		var system_id = getCurrentPageObj().find("#SYSTEM_ID").val();
		var url = dev_test+'addDefect/queryModuleBySysId.asp';
		var obj = getCurrentPageObj().find("#MODULE_ID");	
		obj.empty();
		obj.append('<option value="">请选择</option>');	
		baseAjaxJsonpNoCall(url,{"system_id":system_id},function(data){
			var rows = data.list;
			if(rows){
				for(var i=0;i<rows.length;i++){
					obj.append('<option  value="'+rows[i].FUNC_NO+'">'+rows[i].FUNC_NAME+'</option>');	
				}
			}
		});
		obj.select2();
		
	}

	
}
//添加查询功能点
function selectFunc(){
	var module_id = getCurrentPageObj().find("#MODULE_ID").val();

	var url = dev_test+'addDefect/queryModuleByFuncId.asp';
	var obj = getCurrentPageObj().find("#FUNCPOINT_ID");
	obj.empty();
	obj.append('<option value="">请选择</option>');	
	
	baseAjaxJsonpNoCall(url,{"module_id":module_id},function(data){
		var rows = data.list;
		if(rows){
			for(var i=0;i<rows.length;i++){
				obj.append('<option value="'+rows[i].FUNC_NO+'">'+rows[i].FUNC_NAME+'</option>');	
			}
		}
	});
	obj.select2();
}