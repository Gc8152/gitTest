var docCall = getMillisecond();

initFileSearch();
//初始化页面按钮事件
function initFileSearch(){
	initSelect(getCurrentPageObj().find("select[name='stage']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_REQTASK_STATE"});
	//查询按钮事件
	getCurrentPageObj().find("#query_docManageQueryList").click(function(){
		
		var fileparam = getCurrentPageObj().find("#docmUploadfile_form").serialize();
		getCurrentPageObj().find("#docmUploadFileListTable").bootstrapTable(
				'refresh',
				{
					url : dev_project+'docmanage/queryProjectFile.asp?call='+docCall+'&SID='+SID+'&'+fileparam
					
				});
	});
	//重置按钮事件
	getCurrentPageObj().find("#reset_docManageQueryList").click(function(){
    getCurrentPageObj().find("input[name=file_name]").val("");
    getCurrentPageObj().find("input[name=opt_person_name]").val("");
    getCurrentPageObj().find("select[name=stage]").val(" ");
    getCurrentPageObj().find("select[name=stage]").select2();
    getCurrentPageObj().find("input[name=dm_uploadfile_time_min]").val("");
    getCurrentPageObj().find("input[name=dm_uploadfile_time_max]").val("");
    
	
});
	
	getCurrentPageObj().find("#docmanage_project_li").click(function(){
		var project_id=getCurrentPageObj().find("input[name=project_id]").val();
		var row={};
		row["PROJECT_ID"]=project_id;
		getCurrentPageObj().find("#tab_docmsecond").load("dev_project/projectManage/myProject/projectRange/projectRange.html", function() {
				initProjectRange(row);
				});
		
	});	
}
function initProjectDocumentListTable(project_id){
	getCurrentPageObj().find("input[name=project_id]").val(project_id);
	
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	getCurrentPageObj().find("#docmUploadFileListTable").bootstrapTable({
		//请求后台的URL（*）
		url : dev_project+'docmanage/queryProjectFile.asp?call='+docCall+'&SID='+SID+'&project_id='+project_id,
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
		uniqueId : "PROJECT_ID", //每一行的唯一标识，一般为主键列
		cardView : false, //是否显示详细视图
		detailView : false, //是否显示父子表
		jsonpCallback : docCall,
		singleSelect: true,
		onLoadSuccess : function(data){
			gaveInfo();
		},
		onAll: function() {
			var curtab=getCurrentPageObj().find("#docmUploadFileListTable");
			curtab.find("span[name=view_remand]").unbind('click').click(function(){
				var viewFileDiv=getCurrentPageObj().find("#docmview_sub_req_info");
				viewFileDiv.load("dev_project/documentManage/documentManage_uplodeFileSubReqView.html", null, function(){
				var docview_modal = viewFileDiv.find("#docmodalView");
				var index = curtab.find("span[name=view_remand]").attr("index");
				var rowObj = curtab.bootstrapTable('getData')[index];
				var spans = docview_modal.find("span");
				for(var i=0; i<spans.length; i++){
					var span_name = $(spans[i]).attr("name");
					   var span_name_max=span_name.toUpperCase(); 
					$(spans[i]).html(rowObj[span_name_max]);
				}
				docview_modal.modal('show');
			});		
				});
		},
		columns : [ {
			field: 'middle',
			checkbox: true,
			rowspan: 2,
			align: 'center',
			valign: 'middle',
			visible : false
		}, {
			field : 'Number',
			title : '序号',
			align : "center",
			width : "7%",
			/*sortable: true,*/
			formatter: function (value, row, index) {
				return index+1;
			}
		}, {
			field : "PHASE_NAME",
			title : "阶段",
			align : "center",
			width : "12%"
		}, {
			field : "FILE_TYPE_NAME",
			title : "文档类型",
			align : "center",
			width : "12%"
		}, {
			field : "FILE_NAME",
			title : "文档名称",
			align : "center",
			width : "28%"
		}/*, {
			field : "FILE_VERSION",
			title : "文档版本",
			align : "center",
			visible : false
		}*/,  {
			field : "OPT_PERSON_NAME",
			title : "上传人",
			align : "center",
			width : "12%"
		},{
			field : "OPT_TIME",
			title : "上传时间",
			align : "center",
			width : "18%"
		},/* {
			field : "DESCR",
			title : "备注",
			align : "center",
			width : "9%",
			visible : false
		}, {
//			field : "BUSINESS_CODE",
			field : "FILE_ID",
			title : "操作",
			align : "center",
			width : "9%",
		    visible:false
		},*/{
			 field : "ID",
			 title : "操作",
			 align : "center",
			 width : "12%",
			 formatter: function (value, row, index) {
					 return '<span class="hover-view fa fa-eye" name="view_remand" index="'+index+'"></span><span class="fgx">|</span>'
					 +'<span class="hover-view" name="download_file" index="'+index+'">'
					 +'<a class="hover-view fa fa-download" name="testDL" onclick="docmVerifyFileExit('+row.ID+')"></a></span>';
			 }
		 }]
	});
	
}

function initfileupload(){
	//点击文档上传模态框
	var currTab=getCurrentPageObj();
	var docMuploadBtn = getCurrentPageObj().find("#docMuploadBtn");
	var upload_div=getCurrentPageObj().find("#docm_modalfile");
	docMuploadBtn.click(function(){
		upload_div.load("dev_project/documentManage/documnetManage_uploadFileModel.html", null, function(){
			upload_div.find("#modal").modal('show');
			var project_id=getCurrentPageObj().find("input[name=project_id]").val();
			initVlidate(currTab);
			//initSelect(currTab.find("select[name='doc_file_type']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"P_DIC_PROJECT_STATUS"});
			initSelect(currTab.find("select[name='doc_task_state']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_REQTASK_STATE"},null,null,["00","01","02","04","06","11","12","13","14","15"]);
			//项目编号与名称pop
			var remand_code_pop=currTab.find("#doc_sub_req_code");
			remand_code_pop.click(
					function(e){
						openRemandPop("requirement_pointPop", {
							doc_sub_req_code : getCurrentPageObj().find("#doc_sub_req_code"),
							doc_sub_req_name : getCurrentPageObj().find("#doc_sub_req_name"),
							doc_sub_req_id : getCurrentPageObj().find("#doc_sub_req_id"),
							doc_req_task_id : getCurrentPageObj().find("#doc_req_task_id"),
							doc_req_task_code : getCurrentPageObj().find("#doc_req_task_code"),
							doc_system_name : getCurrentPageObj().find("#doc_system_name"),
							doc_req_name : getCurrentPageObj().find("#doc_req_name"),
							doc_req_code : getCurrentPageObj().find("#doc_req_code")
							
							/*,
							doc_req_task_state : getCurrentPageObj().find("#doc_req_task_state")*/
							
						},project_id);
					}
			);
			var docm_sure = getCurrentPageObj().find("#docm_sure");
			docm_sure.click(function(){
				if(!vlidate(getCurrentPageObj(),"",true)){
					return ;
				}
				var doc_sub_req_code=getCurrentPageObj().find("#doc_sub_req_code").val();
				var doc_sub_req_name=getCurrentPageObj().find("#doc_sub_req_name").val();
				var doc_sub_req_id=getCurrentPageObj().find("#doc_sub_req_id").val();
				//var doc_file_type=getCurrentPageObj().find("#doc_file_type").val();
				var doc_req_task_id=getCurrentPageObj().find("#doc_req_task_id").val();
				var doc_req_task_code=getCurrentPageObj().find("#doc_req_task_code").val();
				var doc_system_name=getCurrentPageObj().find("#doc_system_name").val();
				var doc_req_name=getCurrentPageObj().find("#doc_req_name").val();
				var doc_req_code=getCurrentPageObj().find("#doc_req_code").val();
				var doc_task_state=getCurrentPageObj().find("#doc_task_state").val();
				if(doc_task_state=="03"){
				upload_div.find("#modal").modal('hide');
				closeAndOpenInnerPageTab("task_analyze_info","需求任务分析文档上传","dev_construction/requirement/reqTask_phased/analyze/task_analyze_info.html",function(){
					var params = {};
					params['req_task_id'] = doc_req_task_id;
					params["phased_state"]="03";
					params['req_task_code']=doc_req_task_code;
					//文档所处阶段
					params['phase']='03';
					//路径id
					params['path_id']='GZ1056';
					params['SYSTEM_NAME'] = doc_system_name;
					getCurrentPageObj().find("#phased_state").val("03");
					getCurrentPageObj().find("#req_task_id").val(doc_req_task_id);//给记录req_task_id
					getCurrentPageObj().find("#sub_req_id").val(doc_sub_req_id);
					getCurrentPageObj().find("#b_code").val(doc_sub_req_code);
					getCurrentPageObj().find("#b_name").val(doc_sub_req_name);
					queryTaskPhasedByIdTwo(params);
					initFtpFileListAndObject(params,"S_DIC_REQ_ANL_FILE");
				});
				}//if(doc_task_state=="03")
				if(doc_task_state=="05"){
					upload_div.find("#modal").modal('hide');
					closeAndOpenInnerPageTab("task_analyze_info","设计开发文件上传","dev_construction/requirement/reqTask_phased/summary/task_summary_info.html",function(){
						var params = {};
						params['req_task_id'] = doc_req_task_id;
						params["phased_state"]="05";
						params['req_task_code']=doc_req_task_code;
						//文档所处阶段
						params['phase']='05';
						//路径id
						params['path_id']='GZ1055';
						getCurrentPageObj().find("#phased_state").val("05");
						getCurrentPageObj().find("#req_task_id").val(doc_req_task_id);
						getCurrentPageObj().find("#sub_req_id").val(doc_sub_req_id);
						getCurrentPageObj().find("#b_code").val(doc_sub_req_code);
						getCurrentPageObj().find("#b_name").val(doc_sub_req_name);
						queryTaskPhasedByIdTwo(params);//查询任务列表
						initFtpFileListAndObject(params,"S_DIC_SYS_DESIGN_FILE");
					});
					}//if(doc_task_state=="05")
				
				if(doc_task_state=="07"){
					upload_div.find("#modal").modal('hide');
					closeAndOpenInnerPageTab("task_analyze_info","单元测试文件上传","dev_construction/requirement/reqTask_phased/coding/task_coding_info.html",function(){
						var params = {};
						params['req_task_id'] = doc_req_task_id;
						params["phased_state"]="07";
						params['req_task_code']=doc_req_task_code;
						//文档所处阶段
						params['phase']='07';
						//路径id
						params['path_id']='GZ1057';
						getCurrentPageObj().find("#phased_state").val("07");
						getCurrentPageObj().find("#req_task_id").val(doc_req_task_id);
						getCurrentPageObj().find("#sub_req_id").val(doc_sub_req_id);
						getCurrentPageObj().find("#b_code").val(doc_sub_req_code);
						getCurrentPageObj().find("#b_name").val(doc_sub_req_name);
						queryTaskPhasedByIdTwo(params);//查询任务列表
						initFtpFileListAndObject(params,"S_DIC_UNIT_TEST_FILE");
					});
				}
				if(doc_task_state=="08"){
					upload_div.find("#modal").modal('hide');
					 closeAndOpenInnerPageTab("task_analyze_info","联调测试文件上传","dev_construction/requirement/reqTask_phased/joint/task_joint_info.html",function(){
							var params = {};
							params['req_task_id'] = doc_req_task_id;
							params["phased_state"]="08";
							params['req_task_code']=doc_req_task_code;
							//文档所处阶段
							params['phase']='08';
							//路径id
							params['path_id']='GZ1058';
							getCurrentPageObj().find("#phased_state").val("08");
							getCurrentPageObj().find("#req_task_id").val(doc_req_task_id);
							getCurrentPageObj().find("#sub_req_id").val(doc_sub_req_id);
							getCurrentPageObj().find("#b_code").val(doc_sub_req_code);
							getCurrentPageObj().find("#b_name").val(doc_sub_req_name);
							queryTaskPhasedByIdTwo(params);
							initFtpFileListAndObject(params,"S_DIC_JOINT_TEST_FILE");
						});
				}
				if(doc_task_state=="09"){
					upload_div.find("#modal").modal('hide');
					var Call=getMillisecond();
					closeAndOpenInnerPageTab("sittestreport_edit","SIT测试报告编辑","dev_construction/sit_test_jn/sit_report/sitreport_edit.html",function(){
						baseAjaxJsonp(dev_construction + "GSitReport/queryOneSitReport.asp?SID="
								+ SID + "&call=" + Call,{"req_task_id" : doc_req_task_id},function(resultMap) {
							
							if (resultMap.data) {
								var item =new Array();
								item[0]=resultMap.data;
								initSitTestReportInfoLayout(item);
							}}, Call, false);
		
					});
				}//if(doc_task_state=="09")
				if(doc_task_state=="10"){
					Calls=getMillisecond();
					upload_div.find("#modal").modal('hide');
					var param={};
					 param["SUB_REQ_NAME"]=doc_sub_req_name;
				     param["REQ_NAME"]=doc_req_name;
					 param["REQ_CODE"]=doc_req_code;
				     param["SYSTEM_NAME"]=doc_system_name;
					 param["SUB_REQ_CODE"]=doc_sub_req_code;
					 param["SUB_REQ_ID"]=doc_sub_req_id;
					 param["REQ_TASK_CODE"]=doc_req_task_code;
					closeAndOpenInnerPageTab("uatReport_edit","UAT报告上传页面","dev_construction/uat_test/uatreport/uatReport_edit.html",function(){
								initUatReportInfo(param);
					});
				}//if(doc_task_state=="09")
				
			});
				
			});
			
			
		});

}
function docmVerifyFileExit(file_id){
	baseAjax("sfile/verifyFileExit.asp", {id:file_id}, function(result){
		if(result.result){
			location.href="sfile/downloadFTPFile.asp?id="+file_id;
		} else {
			alert(result.msg);
		}
	});
}
