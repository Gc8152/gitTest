//初始化
	function findDefect(item){
		var $page = getCurrentPageObj();//当前页
		initVlidate($page);//渲染必填项
		autoInitSelect($page);//初始化下拉选择
		 
		var case_id = item.CASE_ID;
		var func_id = item.FUNC_ID;
		var func_name = item.FUNC_NAME;
		var item = {};
	     item["FUNC_NAME"] = func_name;
		 item["FUNC_ID"] = func_id;
		 item["CASE_ID"] = case_id;
		for(var k in item){
			 $page.find("#"+k).val(item[k]);
			 }
		    initRealOptTable(null);//初始化操作步骤表
			initFileTable();//初始化附件相关
			initButtonEvent(null);//初始化按钮事件
			
		//按钮事件
		function initButtonEvent(edit,CASE_ID){
			
			//保存按钮
			$page.find("[btn='saveAddInfo']").click(function(){ 
				var CASE_ID = item.CASE_ID;
				addDefectInfo("save",edit,CASE_ID);
			});
			
			//提交按钮
			$page.find("[btn='submitAddInfo']").click(function(){
				addDefectInfo("submit",edit,CASE_ID);
				
			});
			
			var tableDate = getCurrentPageObj().find("[tb='realOptTable']").bootstrapTable('getData');
			var opt_order = tableDate.length;
			//增加操作步骤
			$page.find("[name='addOpt']").click(function(){
				var optInfo = {};
				opt_order = opt_order + 1;
				optInfo["OPT_DESCRIPT"] = "";
				optInfo["INPUT_DATA"] = "";
				optInfo["EXPECT_RESULT"] = "";
				optInfo["REAL_INPUT"] = "";
				optInfo["REAL_RESULT"] = "";
				optInfo["OPT_ORDER"] = opt_order;
				getCurrentPageObj().find("[tb='realOptTable']").bootstrapTable('append',optInfo);
			});
		};


		//保存&提交
		function addDefectInfo(opt_type,edit,CASE_ID){
			 
				var params = getPageParam("IU");
				var tableDate = getCurrentPageObj().find("[tb='realOptTable']").bootstrapTable('getData');
				if(0 == tableDate.length){
					params["REAL_OPT"] = '';
				}else{
					var count = 1;
					var realOpt = new Array();
					for(var k in tableDate){
						realOpt.push({"OPT_ORDER":count,"OPT_DESCRIPT":tableDate[k].OPT_DESCRIPT,
									"INPUT_DATA":tableDate[k].INPUT_DATA,"EXPECT_RESULT":tableDate[k].EXPECT_RESULT,
									"REAL_INPUT":tableDate[k].REAL_INPUT,"REAL_RESULT":tableDate[k].REAL_RESULT});
						count++;
					}
					params["REAL_OPT"] = JSON.stringify(realOpt);
				}
				params["OPT_TYPE"] = opt_type;
				params["CASE_ID"] = CASE_ID;
				if(!vlidate($page,"",true)){
					alert("有必填项未填");
					return ;
				}
				
					addSave(params);
		}


		//新增保存&提交
		function addSave(params){
			 
			var addCall = getMillisecond();
			baseAjaxJsonp(dev_test+"testTaskExecute/saveAddDefect.asp?SID=" + SID + "&call=" + addCall, params, function(data) {
				if(data && data.result=="true"){
					alert(data.msg);
					closeCurrPageTab();
				}else{
					alert(data.msg);
					closeCurrPageTab();
				}
			},addCall,false);
		}

		//初始化信息
		function initDefectInfo(item){
			 
			for(var k in item){
				var dicCode = $page.find("[name='IU."+ k +"']").attr("diccode");
				if(dicCode != undefined){
					initSelect($page.find("[name='IU."+ k +"']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:dicCode},item[k]);
					continue;
				}
				$page.find("[name='IU."+ k +"']").val(item[k]);
			}
		}


		//实际操作步骤表
		function initRealOptTable(item){
			var defect_id = 'x';
			if(null != item){
				defect_id = item.DEFECT_ID;
			}
			var realOptCall = getMillisecond()+'1';
			$page.find("[tb='realOptTable']").bootstrapTable({
				url : dev_test+"testTaskExecute/queryOptByDefectId.asp?SID=" + SID + "&call=" + realOptCall + "&DEFECT_ID=" + defect_id,
				method : 'get', // 请求方式（*）
				striped : false, // 是否显示行间隔色
				cache : false, // 是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
				sortable : true, // 是否启用排序
				sortOrder : "asc", // 排序方式
				sidePagination : "server", // 分页方式：client客户端分页，server服务端分页（*）
				pagination : false, // 是否显示分页（*）
				clickToSelect : false, // 是否启用点击选中行
				// height: 460, //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
				uniqueId : "OPT_ORDER", // 每一行的唯一标识，一般为主键列
				cardView : false, // 是否显示详细视图
				detailView : false, // 是否显示父子表
				singleSelect : false,// 复选框单选
				jsonpCallback:realOptCall,
				onDblClickRow:function(row){
				},onLoadSuccess : function(data){
					gaveInfo();
				},onPostBody :function(data){
					var bootData = getCurrentPageObj().find("[tb='realOptTable']").bootstrapTable("getData");
					var inputs = getCurrentPageObj().find("[tb='realOptTable']").find("input");
					inputs.unbind("change").bind("change", function(e){
						var index = $(this).attr("index");
						var bootrow = bootData[index];
						bootrow[$(this).attr("name")] = $(this).val();
					});
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
					field : "OPT_DESCRIPT",
					title : "操作描述",
					align : "center",
					formatter: function (value, row, index) {
						if(undefined == row.OPT_DESCRIPT){
							row.OPT_DESCRIPT = '';
						}
						return "<input type='text' name='OPT_DESCRIPT' index='"+index+"' value='"+row.OPT_DESCRIPT+"'>" ;
					}
				}, {
					field : "INPUT_DATA",
					title : "输入数据",
					align : "center",
					formatter: function (value, row, index) {
						if(undefined == row.INPUT_DATA){
							row.INPUT_DATA = '';
						}
						return "<input type='text' name='INPUT_DATA' index='"+index+"' value='"+row.INPUT_DATA+"'>" ;
					}
				}, {
					field : "EXPECT_RESULT",
					title : "预期结果",
					align : "center",
					formatter: function (value, row, index) {
						if(undefined == row.EXPECT_RESULT){
							row.EXPECT_RESULT = '';
						}
						return "<input type='text' name='EXPECT_RESULT' index='"+index+"' value='"+row.EXPECT_RESULT+"'>" ;
					}
				}, {
					field : "REAL_INPUT",
					title : "实际输入数据",
					align : "center",
					formatter: function (value, row, index) {
						if(undefined == row.REAL_INPUT){
							row.REAL_INPUT = '';
						}
						return "<input type='text' name='REAL_INPUT' index='"+index+"' value='"+row.REAL_INPUT+"'>" ;
					}
				}, {
					field : "REAL_RESULT",
					title : "实际结果",
					align : "center",
					formatter: function (value, row, index) {
						if(undefined == row.REAL_RESULT){
							row.REAL_RESULT = '';
						}
						return "<input type='text' name='REAL_RESULT' index='"+index+"' value='"+row.REAL_RESULT+"'>" ;
					}
				}, {
					field :	"OPT_ORDER",
					title :	"操作",
					align : "center",
					width : "10%",
					formatter: function (value, row, index) {
						return "<a style='color:blue'  href='javascript:void(0)' onclick=deleteOpt('"+row.OPT_ORDER+"')>删除</a>" ;
					}
				}
				]
			});
		}





		//初始化附件列表
		function initFileTable(item) {

			 //附件上传
			 var tablefile = $page.find("[tb='defect_fileTable']");
			 var business_code = "";
			 business_code = $page.find("#FILE_ID_ADD").val();
			 if(typeof(business_code)!="undefined"){
				 business_code = Math.uuid();
				 $page.find("#FILE_ID_ADD").val(business_code);
			 }
			
			 //点击打开模态框
			 var addfile = $page.find("[btn='defect_upFile']");
			 addfile.click(function(){
				 var paramObj = new Object();
				 paramObj["SYSTEM_NAME"] = "systemname";
			 	openFileFtpUpload($page.find("#file_modal"), tablefile, 'GZ1077',business_code, '0101', 'TM_DIC_SCREENSHOT', false, false, paramObj);
			 });
			
			 //附件删除
			 var delete_file = $page.find("[tb='defect_delFile']");
			 delete_file.click(function(){
			 	delFtpFile(tablefile, business_code, "0101");
			 });
			 
			 getFtpFileList(tablefile, $page.find("#file_modal"), business_code, "0101");

		}
	}

	//删除操作步骤
	function deleteOpt(opt_order){
		getCurrentPageObj().find("[tb='realOptTable']").bootstrapTable('removeByUniqueId', opt_order);
		
	}
		



