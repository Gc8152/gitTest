
function designTestCases(seles){//
	treeInfo.projectId=seles.PROJECT_ID;
	treeInfo.initZtree(seles);
//	caseDesign.designTestCases(seles);
	pointTest.initTestPointCaseInfo(seles.PROJECT_ID);
	caseDesign.eventClick(seles.PROJECT_ID,seles.TEST_TASK_ID);
}
function beginEditorOptDt(o){
	getCurrentPageObj().find("[tb='realOptTable']").bootstrapTable('beginEditor',o);
	initVlidate(getCurrentPageObj().find(getCurrentPageObj().find("[tb='realOptTable']")));
}
/**
 * 左侧树信息
 * @param treeInfo
 * @param $page
 */
(function(treeInfo,$page){
	 treeInfo.initZtree=function(param){
		var setting = {
	        view: {
	            selectedMulti: false //禁止多点选中  
	        },
	        async:{dataType:"application/json"},
	        data: {  
	            simpleData: {  //setting.data.key.name;
	                enable:true,  
	                idKey: "ID",  
	                pIdKey: "PID",
	                rootPId: "",
	                formatterNodeName:function(node){
	                	if("XQ"==node.ID.substr(0,2)){
	                		return node.NAME+"("+node.ID+")";
	                	}
	                	return node.NAME;
	                }
	            },
	            key: {
	            	name:"NAME"
	            }
	        },  
	        callback: {  
	            onClick: function(event,treeId,treeNode) {
	            	ztreeClick(param["PROJECT_ID"],treeId,treeNode);
	            }  
	        }
	    };
		var project_id=param["PROJECT_ID"];
		baseAjaxJsonpNoCall(dev_test+'designTestCases/queryDesignTree.asp?PROJECT_ID='+project_id +"&TEST_TASK_ID="+param["TEST_TASK_ID"],null,function(data) {
			//树的数据初始化
			if (data != undefined && data != null && data.result=="true") {
				var treeObj = $.fn.zTree.init(getCurrentPageObj().find("#treeCaseDesign"),setting, data.functree);
//				var node = treeObj.getNodeByParam("ID", project_id, null);
				treeObj.expandAll(true);
			}else{
				alert("查询失败");
			}
		});
	};
	//查询需求信息及功能点信息
	function initReqInfo(task_num){
		var reqCall = getMillisecond();
		baseAjaxJsonp(dev_test+"testTaskAnalyze/queryReqInfo.asp?SID=" + SID + "&call=" + reqCall + "&TASK_NUM="+task_num, null, function(data) {
			if (data != undefined && data != null && data.result=="true") {
				var reqinfo = data.reqinfo;
				if(reqinfo != null && reqinfo.length > 0) {
		            for(var k in reqinfo[0]){
		            	$page.find("#T_"+k).text(reqinfo[0][k]);
		            	if(k == 'SYSTEM_NAME'){
		            		$page.find("#F_"+k).text(reqinfo[0][k]);
		            	}
		            	if(k == 'REQ_CODE'){
		            		file_id = reqinfo[0][k];
		            	} 
		            }
		            var $tableObj = getCurrentPageObj().find("[tb='case_taskFileTable']");
		            var $modalObj = getCurrentPageObj().find("#case_file_reqtask_modal");
		    		getFtpFileList($tableObj,$modalObj, reqinfo[0].TASK_NUM, "03");
				}
			}else{
				alert("数据异常");
			}
		},reqCall,false);
	}
	/**
	 * 单击
	 */
	function ztreeClick(project_id,treeId,treeNode){
		levCaseDesign();
		var level=treeNode["level"];
		$page.find("#Casedesignsum .controls .active").removeClass("active");
		$page.find("#case_menu_optLi,#menu_opt1").addClass("active");
		var testCaseExportExcel=dev_test+"designTestCases/testCaseExportExcel.asp?SID=" + SID+"&PROJECT_ID="+treeInfo.projectId;
		if(level==0){
			$page.find("#case_task_explainLi").hide();
			pointTest.initTestPointCaseInfo(project_id);
		}else if(level==1){
			$page.find("#case_task_explainLi").show();
			testCaseExportExcel+=("&task_num="+treeNode["ID"]);
			pointTest.initTestPointCaseInfo(project_id,treeNode["ID"]);
			initReqInfo(treeNode["ID"]);
	    }else if(level==2){
	    	$page.find("#case_task_explainLi").show();
	    	initReqInfo(treeNode.getParentNode()["ID"]);
	    		testCaseExportExcel+=("&func_id="+treeNode["ID"]);
	    		pointTest.initTestPointCaseInfo(project_id,null,treeNode["ID"]);
	    }
		$page.find("#testCaseExport").unbind("click").click(function(){
			startLoading();
			location.href =testCaseExportExcel+"&test_task_id="+treeNode.TEST_TASK_ID;
			endLoading();
		});
	}
})(treeInfo={},getCurrentPageObj());



(function(pointTest,$page){
	pointTest.refreshTestPointCaseInfo=function(project_id){
		var node=$.fn.zTree.getZTreeObj("treeCaseDesign").getSelectedNodes();
		if(node.length==0||node[0].level==0){
			pointTest.initTestPointCaseInfo(project_id);
		}else if(node[0].level==1){
			pointTest.initTestPointCaseInfo(project_id,node[0].ID,"");
		}else if(node[0].level==2){
			pointTest.initTestPointCaseInfo(project_id,"",node[0].ID);
		}
	};
	/**
	 * 初始化要点和案例数据
	 * @param Project_id
	 * @param func_id
	 */
	 pointTest.initTestPointCaseInfo=function(Project_id,task_code,func_id){
		var queryParams = function(params) {
			var temp = {
				limit : params.limit, // 页面大小
				offset : params.offset
			// 页码
			};
			return temp;
		};
		$page.find("#CaseList").bootstrapTable('destroy').bootstrapTable({
			url : dev_test+"designTestCases/queryCaseDesignQueryList.asp?SID=" + SID + "&call=jq_1523590716979CList&PROJECT_ID=" + Project_id+(task_code?"&task_code="+task_code:"")+(func_id?"&func_id="+func_id:""),
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
			uniqueId : " ", // 每一行的唯一标识，一般为主键列
			cardView : false, // 是否显示详细视图
			detailView : false, // 是否显示父子表
			singleSelect : true,// 复选框单选
			jsonpCallback:"jq_1523590716979CList",
			onLoadSuccess : function(data){
//				gaveInfo();
			},
			columns : [ {
				checkbox : true,
				rowspan : 2,
				align : 'center',
				valign : 'middle'
			},{
				field : 'ORDER_ID',
				title : '序号',
				align : "center",
				width : "50px",
				formatter:function(value,row,index){
					return index + 1;
				}
			}, {
				field : "SYSTEM_NAME",
				title : "应用名称",
				align : "center",
			    width : "120px"
			}, {
				field : "MODULE_NAME",
				title : "模块名称",
				align : "center",
				width : "150px"
			}, {
				field : "FUNC_NAME",
				title : "功能点名称",
				align : "center",
				width : "200px"
			}, {
				field : "TESTPOINT_NAME",
				title : "测试检查要点",
				align : "center",
				width : "200px"
			}, {
				field : "POINT_TYPE",
				title : "测试要点类型",
				align : "center",
				width : "200px"
			}, {
				field : "CASE_NUM",
				title : "测试案例编号",
				align : "center",
				width : "150px"
			}, {
				field : "CASE_NAME",
				title : "测试案例名称",
				align : "center",
				width : "150px"
			}, {
				field : "EXECUTE_STATE_NAME",	
				title : "案例状态",
				align : "center",
				width : "150px"
			}, {
				field : "CASE_VERSION_NAME",
				title : "当前版本号",
				align : "center",
				width : "150px"
			}, {
				field : "OPT_PERSON_NAME",
				title : "当前设计人",
				align : "center",
				width : "150px"
			}]
		});
	};
})(pointTest={},getCurrentPageObj());

function toCaseDesign(){
	getCurrentPageObj().find("#panoramicView_li_two").show();
	getCurrentPageObj().find("#tab2_panoramicView2,#panoramicView_li_two").addClass("active");
	getCurrentPageObj().find("#case_menu_optLi,#case_task_explainLi,#case_task_explain,#menu_opt1").removeClass("active");
}
function levCaseDesign(){
	getCurrentPageObj().find("#tab2_panoramicView2,#panoramicView_li_two").removeClass("active");
	getCurrentPageObj().find("#panoramicView_li_two").hide();
//	getCurrentPageObj().find("#case_menu_optLi,#case_task_explainLi,#case_task_explain,#menu_opt1").removeClass("active");
//	getCurrentPageObj().find("#case_task_explain,#menu_opt1").addClass("active");
}
/**
 * 案例相关操作
 * @param caseDesign
 * @param $page
 */
(function(caseDesign,$page){
	/**
	 * 事件初始化
	 */
	caseDesign.eventClick=function(project_id,test_task_id){
		$page.find("#testCaseExport").unbind("click").click(function(){
			location.href =dev_test+"designTestCases/testCaseExportExcel.asp?SID=" + SID+"&PROJECT_ID="+project_id+"&test_task_id="+test_task_id;
		});
		importExcel.initImportExcel($page.find("#testCaseImport"),"测试案例","sfile/downloadFTPFile.asp?id=m_051","caseInfo/importTestCaseInfo.asp",function(msg){//{result=false, error_info=第1页签第7行:优先级不能为空!设计人不能为空!设计日期不能为空!测试要点类型不能为空!}
			if(msg&&msg.result=="false"){
				var error_info=msg.error_info;
				if(error_info&&error_info.length<200){
					alert(msg.error_info||"导入失败！");
				}else{
					alert("导入失败！"+'<div style="display:none;">'+error_info+'</div>');
				}
			}else if(msg&&msg.result=="true"){
				alert("导入成功!");
			}else{
				alert("导入失败!未知错误");
			}
			pointTest.refreshTestPointCaseInfo(project_id);
		});
		$page.find("button[name='casesDesign']").unbind("click").click(function(){
			startLoading();
			var selRow = $page.find("#CaseList").bootstrapTable("getSelections");
			var selectedNode=$.fn.zTree.getZTreeObj("treeCaseDesign").getSelectedNodes();
			if((selectedNode.length==0||selectedNode[0].level!=2)&&selRow.length==0){
				alert("请选择左侧功能点或者选择一条案例信息!");
			}else{
				toCaseDesign();
				if(selRow.length == 1){
					$page.find("#tab2_panoramicView2 [name='IU.TESTPOINT_ID']").val(selRow[0]["TESTPOINT_ID"]);
					$page.find("#tab2_panoramicView2 [name='IU.FUNC_NO']").val(selRow[0]["FUNC_ID"]);
					$page.find("#tab2_panoramicView2 [name='IU.TASK_NUM']").val(selRow[0]["TASK_NUM"]);
					initRealOptTable();//初始化操作步骤表格
					initCaseInfo(selRow[0].CASE_ID,selRow[0].TESTPOINT_ID);//数据初始化
				}else if(selectedNode.length>0){
					$page.find("#tab2_panoramicView2 [name^='IU.']").val("");//初始化表单信息
					$page.find("#tab2_panoramicView2 select").select2();
					$page.find("[name='IU.FILE_ID']").val(Math.Random19());
					initRealOptTable();//初始化操作步骤表格
					initFileUpload();
					initCaseSelect();
					$page.find("#tab2_panoramicView2 [name='IU.TASK_NUM']").val(selectedNode[0]["PID"]);
					$page.find("#FUNC_ID").val(selectedNode[0]["ID"]);
				}else{
					alert("请选择一条测试要点进行测试案例设计！",function(){
						
					});
				}
			}
			endLoading();
		});
		$page.find("#testCaseDelete").unbind("click").click(function(){
			var selRow = $page.find("#CaseList").bootstrapTable("getSelections");
			if(selRow.length==0){
				alert("请选择案例!");
			}else if(selRow[0]["EXECUTE_STATE"]!="00"){//
				alert("请选择待执行的案例进行删除!");
			}else{
				nconfirm("确定要删除该案例吗？",function(){
					baseAjaxJsonpNoCall(dev_test+"designTestCases/deleteCaseInfoAndExecuteInfo.asp",{case_id:selRow[0]["CASE_ID"],testpoint_id:selRow[0]["TESTPOINT_ID"]},function(data){
						if(data&&data.result=="true"){
							alert("删除成功!");
							pointTest.refreshTestPointCaseInfo(project_id);
						}else{
							alert("删除失败!");
						}
					});
				});
			}
		});
		initVlidate($page.find("#tab2_panoramicView2"));
		/**
		 * 验证操作步骤
		 */
		function vlidateStepOpt(){
			$page.find("[tb='realOptTable']").bootstrapTable('endAllEditor');
			var data=$page.find("[tb='realOptTable']").bootstrapTable('getData');
			if(data.length==0){
				alert("请添加操作步骤!");
				return false;
			}else{
				for(var i=0;i<data.length;i++){
					if(!data[i]["OPT_DESCRIPT"]){
						alert("请完善操作步骤信息!");
						return false;
					}else if(!data[i]["EXPECT_RESULT"]){
						alert("请完善预期结果信息!");
						return false;
					}
				}
			}
			return true;
		}
		
		$page.find("#backToCaseDesignList").unbind("click").click(function(){
			getCurrentPageObj().find('[href="#menu_opt1"]').click();
		});
		/**
		 * 保存案例信息
		 */
		$page.find("#saveAddInfo").unbind("click").click(function(){
			if(!vlidate($page.find("#tab2_panoramicView2"))){
				return ;
			}else if(!vlidateStepOpt()){
				return;
			}
			nconfirm("确定要保存该案例吗?",function(){
				var file_obj=$page.find("#tab2_panoramicView2 [name='IU.FILE_ID']");
				if(file_obj.val()==""){
					file_obj.val("fl"+Math.Random19());
				}
				var caseInfoEle=$page.find("#tab2_panoramicView2 [name^='IU.']");
				var caseInfo="";
				$.each(caseInfoEle,function(i,o){//案例基本信息
					var obj=$(o);
					var name=obj.attr("name").substr(3);
					caseInfo+="&caseInfo['"+name+"']="+obj.val();
				});
//				$page.find("[tb='realOptTable']").bootstrapTable('endAllEditor');
				var tableData = getCurrentPageObj().find("[tb='realOptTable']").bootstrapTable('getData');
				for(var i=0;i<tableData.length;i++){
					$.each(tableData[i],function(k,v){
						if(k!="OPT_ORDER"){
							caseInfo+='&caseOptInfo["'+i+'"]["'+k+'"]='+(v||"");
						}
					});
					caseInfo+=('&caseOptInfo["'+i+'"]["OPT_ORDER"]='+(i+1));
				}
				/**保存案例信息**/
				baseAjaxProxyTest("designTestCases/saveDesignCaseInfo.asp",caseInfo,function(data){
					if(data&&data.result=="true"){
						alert("保存成功");
						levCaseDesign();
						//case_menu_optLi href="#menu_opt1"
						$page.find("#case_menu_optLi,#menu_opt1").addClass("active");
//						$page.find("#Casedesignsum").show();
//						$page.find("#caseDesignwrite").hide();
						var row=$page.find("#CaseList").bootstrapTable("getSelections");
						if(row.length>0){
							pointTest.refreshTestPointCaseInfo(row[0]["PROJECT_ID"]);
						}else{
							pointTest.refreshTestPointCaseInfo(project_id);
						}
					}else{
						alert("保存失败!");
					}
				});
			});
		});
	};
	/**
	 * 初始化案例要点信息
	 */
	function initCasePointInfo(testpoint_id){
		/*baseAjaxJsonpNoCall(dev_test+"designTestCases/queryTestPointInfoById.asp?testpoint_id="+testpoint_id, null, function(data) {
			if(data&&data.rows&&data.rows[0]){
				$.each(data.rows[0],function(k,v){
					$page.find("#tab1_panoramicView1 div#"+k).text(v);
				});
			}
		});*/
	}
	/**
	 * 初始化案例信息
	 */
	function initCaseInfo(case_id,point_id){
		initCasePointInfo(point_id);
		if(case_id&&"1"!=case_id){
			baseAjaxJsonpNoCall(dev_test+"designTestCases/findOneDesignCaseInfo.asp?point_id="+point_id, null, function(data) {
				if(data&&data.caseInfo){
					$.each(data.caseInfo,function(k,v){
						$page.find("[name='IU."+k+"']").val(v);
					});
					initCaseSelect(data.caseInfo["CASE_TYPE1"],data.caseInfo["CASE_TYPE2"],data.caseInfo["PRI_LEVEL"],data.caseInfo["CASE_VERSION"],data.caseInfo["TEST_ATTRIBUTE"]);
					initFileUpload();
				}
				if(data&&data.optList){
					$.each(data.optList,function(k,v){
						$page.find("[tb='realOptTable']").bootstrapTable('append',v);
					});
				}
			});
		}else{
			initCaseSelect();
			initFileUpload();
		}
//		initOptHisTable(point_id);
	}
	/**
	 * 初始化下拉数据
	 */
	function initCaseSelect(case_type1,case_type2,pri_level,case_version,test_attribute){
		initSelect($page.find("[name='IU.CASE_TYPE1']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"TM_DIC_CASE_TYPE1"},case_type1);
		initSelect($page.find("[name='IU.CASE_TYPE2']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"TM_DIC_CASE_TYPE2"},case_type2);
		initSelect($page.find("[name='IU.PRI_LEVEL']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"TM_DIC_CASE_LEVEL"},pri_level);
		initSelect($page.find("[name='IU.CASE_VERSION']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"TM_DIC_CASE_VERSION"},case_version);
		initSelect($page.find("[name='IU.TEST_ATTRIBUTE']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"TM_DIC_TEST_ATTRIBUTE"},test_attribute);
	}
	/**
	 * 上传附件
	 */
	function initFileUpload(){
		/**
		 * 增加操作步骤
		 */
		$page.find("[name='addCaseOpt']").unbind("click").click(function(){
			var tableDate = getCurrentPageObj().find("[tb='realOptTable']").bootstrapTable('getData');
			var num = tableDate.length;
			$page.find("[tb='realOptTable']").bootstrapTable('endAllEditor');
			var optInfo = {"OPT_DESCRIPT":"","OPT_DESCRIPT":"","EXPECT_RESULT":"","REMARK":"","STEP_ID": "CI"+Math.Random19()};
				$page.find("[tb='realOptTable']").bootstrapTable('append',optInfo);
//				$page.find("[tb='realOptTable']").bootstrapTable('beginEditor',num);
				beginEditorOptDt(num);
		});
		/**
		 * 上传附件
		 */
		var tablefile = $page.find("#fileTableone");
		var file_obj = $page.find("[name='IU.FILE_ID']");
		var file_id=file_obj.val();
		if(!file_id){
			file_id=Math.Random19();
			file_obj.val(file_id);
		}
		$page.find("#add_attachment_btn").unbind("click").click(function(){
			 var paramObj = new Object();
			 paramObj.afterUpload = function (){
				 getFtpFileList($page.find("#fileTable"), $page.find("#file_modal1"), file_id, "test_case_design"); 
			 };
			 openFileFtpUpload($page.find("#file_modal"), tablefile, 'GZ1077',file_id, 'test_case_design', 'TM_DIC_SCREENSHOT', false, false, paramObj);
		});
		getFtpFileList(tablefile, $page.find("#file_modal"), file_id, "test_case_design");
		getFtpFileList($page.find("#fileTable"), $page.find("#file_modal1"), file_id, "test_case_design");
		var delete_file1 = getCurrentPageObj().find("#del_attachment_btn");
		delete_file1.click(function(){
			nconfirm("确定要删除该附件？",function(){
				delFtpFile(tablefile, file_id, "GZ1077");
			});
		});
	}
	//案例设计_操作步骤表初始化
	function initRealOptTable(){
		$page.find("[tb='realOptTable']").bootstrapTable('destroy').bootstrapTable({
//			url : dev_test+"designTestCases/queryOptByCaseId.asp?SID=" + SID + "&call=jq_1523590716977COList&CASE_ID="+case_id ,
			method : 'get', // 请求方式（*）
			striped : false, // 是否显示行间隔色
			cache : false, // 是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
			sortable : true, // 是否启用排序
			sortOrder : "asc", // 排序方式
			//queryParams : queryParams,// 传递参数（*）
			sidePagination : "server", // 分页方式：client客户端分页，server服务端分页（*）
			pagination : false, // 是否显示分页（*）
			clickToSelect : false, // 是否启用点击选中行
			// height: 460, //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
			uniqueId : "STEP_ID", // 每一行的唯一标识，一般为主键列
			cardView : false, // 是否显示详细视图
			detailView : false, // 是否显示父子表
			singleSelect : false,// 复选框单选
			jsonpCallback:"jq_1523590716977COList",
			onDblClickRow:function(row){
			},onClickRow: function(row,tr) {
				var step_id=tr.find("a[step_id]").attr("step_id");
//				$page.find("[tb='realOptTable']").bootstrapTable('beginEditor',{"STEP_ID":step_id});
				beginEditorOptDt({"STEP_ID":step_id});
			},onLoadSuccess : function(data){
			},
			columns : [ {
				field : 'ORDER_ID',
				title : '步骤编号',
				align : "center",
				width : "50px",
				formatter:function(value,row,index){
					return index + 1;
				}
			}, {
				field : "OPT_DESCRIPT",
				title : "操作步骤&nbsp;<span style='color:red'>*</span>",
				align : "center",
				edit:{
					type:"textarea"
				}
			}, {
				field : "INPUT_DATA",
				title : "输入数据",
				align : "center",
				edit:{
					type:"textarea"
				}
			}, {
				field : "EXPECT_RESULT",
				title : "预期结果&nbsp;<span style='color:red'>*</span>",
				align : "center",
				edit:{
					type:"textarea"
				}
			}, {
				field : "REMARK",
				title : "备注",
				align : "center",
				edit:{
					type:"textarea"
				}
			}, {
				field :	"OPT",
				title :	"操作",
				align : "center",
				width : "10%",
				formatter: function (value, row, index) {
					return "<a style='color:blue'  href='javascript:void(0)' step_id='"+row.STEP_ID+"' onclick=deleteCzbz('"+row.STEP_ID+"')>删除</a>" ;
				}
			}]
		});
	}
	//操作历史记录表
	function initOptHisTable(testpoint_id){
		var queryParams = function(params) {
			var temp = {
				limit : params.limit, // 页面大小
				offset : params.offset
			// 页码
			};
			return temp;
		};
		$page.find("[tb='optHistoryTable']").bootstrapTable({
			url : dev_test+"designTestCases/queryOptHistory.asp?SID=" + SID + "&call=jq_1523590716970HISTORY&TESTPOINT_ID=" + testpoint_id,
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
			uniqueId : "OPERATION", // 每一行的唯一标识，一般为主键列
			cardView : false, // 是否显示详细视图
			detailView : false, // 是否显示父子表
			singleSelect : true,// 复选框单选
			jsonpCallback : "jq_1523590716970HISTORY",
			onDblClickRow : function(row){
			},onLoadSuccess : function(data){
//				gaveInfo();
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
				field : "CASE_VERSION",
				title : "版本号",
				align : "center"
			}, {
				field : "OPT_TIME",
				title : "创建日期",
				align : "center"
			}, {
				field : "OPT_MAN_NAME",
				title : "创建人",
				align : "center"
			}]
		});
	}
})(caseDesign={},getCurrentPageObj());

//删除操作步骤要点
function deleteCzbz(row_num){
//	$page.find("[tb='realOptTable']").bootstrapTable('endAllEditor');
	getCurrentPageObj().find("[tb='realOptTable']").bootstrapTable('removeByUniqueId', row_num);
}