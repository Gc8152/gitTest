initOutPersonFindLayout();

function initOutPersonFindLayout(){
	var callout = getMillisecond();
	initClickEvents();
	initTable();
	
	/**
	 * 组装查询url 
	 * @returns {String}
	 */
	function queryOutPersonUrl(){
		var url= dev_outsource + "outperson/findOutPersonInfo.asp?a=1&SID="+SID+"&call="+callout+"&query_type=leave_approve";
		var sts="";
		var selects=getCurrentPageObj().find("select[name^='FD.']");//获取下拉选的值
		for(var i=0;i<selects.length;i++){
			var obj=getCurrentPageObj().find(selects[i]);
			if($.trim(obj.val())!=""){
				sts+='&'+obj.attr("name").substr(3)+"="+obj.val();
			}
		}
		var fds=getCurrentPageObj().find("input[name^='FD.']");
		for(var i=0;i<fds.length;i++){
			var obj=getCurrentPageObj().find(fds[i]);
			if($.trim(obj.val())!=""){
				url+='&'+obj.attr("name").substr(3)+"="+obj.val();
			}
		}
		return url+sts;
	}
	/**
	 * 初始化按钮各种事件
	 */
	function initClickEvents(){
		autoInitSelect(getCurrentPageObj());//初始化下拉选
		initSelect(getCurrentPageObj().find("#purch_types"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_PURCH_TYPE"});	//人员采购类型
		var obj=getCurrentPageObj().find("#FD_op_office");//实施处室
		obj.unbind("click");
		obj.click(function(){
			openSelectTreeDivToBody($(this),"op_office_pop_fd_tree","SOrg/queryorgtreelist.asp?suporg_code=1101",30,function(node){
				getCurrentPageObj().find("#FD_op_office").val(node.name);
				getCurrentPageObj().find("input[name='FD.op_office']").val(node.id);//queryorgtreeofficeslist
			});
		});
		
		//离场审批
		getCurrentPageObj().find("#outperson_approve2").unbind("click");
		getCurrentPageObj().find("#outperson_approve2").click(function(){
			var dt=getCurrentPageObj().find("#outpersonTableInfo").bootstrapTable('getSelections');
			
			if(dt.length!=1){
				alert("请选择一条数据!");
				return;
			}
			closeAndOpenInnerPageTab("outpersonInbankDetailOne","查看外包人员离场信息","dev_outsource/outsource/outpersonDeparture/outpersonDeparture_approve.html",function(){
				initOutPersonDetail(dt[0]["OP_ID"],dt[0]["PURCH_TYPE"],dt[0]["OP_CODE"]);
				initAFApprovalInfo(dt[0]["INSTANCE_ID"],'1');
			});
		});
		
		
		
		//查看离场
		getCurrentPageObj().find("#outperson_Detail").unbind("click");//查看详情
		getCurrentPageObj().find("#outperson_Detail").click(function(){
			var dt=getCurrentPageObj().find("#outpersonTableInfo").bootstrapTable('getSelections');
			//流程id
			var flowid=$.map(dt, function (row) {
				return row.FLOWID_ENTER;                    
			});
			//审批状态
			var spstate=$.map(dt, function (row) {
				return row.SPSTATE_ENTER;                    
			});
			//流程url
			var flowurl=$.map(dt, function (row) {
				return row.FLOWURL_ENTER;                    
			});
			if(dt.length!=1){
				alert("请选择一条数据!");
				return;
			}
			closeAndOpenInnerPageTab("outpersonInbankDetailOne","查看外包人员入场信息","dev_outsource/employee/outperson/outperson_workflowdetail.html",function(){
				initOutPersonDetail(dt[0]["OP_ID"],dt[0]["PURCH_TYPE"],dt[0]["IDCARD_NO"],flowid[0],spstate[0],flowurl[0]);
			});
		});
		
		//查询按钮
		getCurrentPageObj().find("#queryOutPersonInfo2").unbind("click");
		getCurrentPageObj().find("#queryOutPersonInfo2").click(function(){
			getCurrentPageObj().find("#outpersonTableInfo").bootstrapTable("refresh",{url:queryOutPersonUrl()});
		});
		//enter触发查询
		enterEventRegister(getCurrentPageObj().attr("class"), function(){getCurrentPageObj().find("#queryOutPersonInfo2").click();});
		//重置按钮
		getCurrentPageObj().find("#resetOutPersonInfo2").unbind("click");//重置按钮
		getCurrentPageObj().find("#resetOutPersonInfo2").click(function(){
			getCurrentPageObj().find("input[name^='FD.']").val("");
			getCurrentPageObj().find("#FDsupplier_name").val("点击选择供应商");
			getCurrentPageObj().find("#FD_op_office").val("点击选择所属中心");
			getCurrentPageObj().find("#staffInfoList select").val(" ").select2();
		});
		getCurrentPageObj().find("#outperson_Import2").unbind("click");//导入按钮
		getCurrentPageObj().find("#outperson_Import2").click(function(){
			getCurrentPageObj().find("#outpersonld").val("");
			getCurrentPageObj().find("#file_outperson_import").val("");
			getCurrentPageObj().find("#modal_outperson_import").modal("show");
		});
		
		getCurrentPageObj().find("#import_outperson_button").unbind("click");//导入功能
		getCurrentPageObj().find("#import_outperson_button").click(function(){
			startLoading();
		    $.ajaxFileUpload({
			    url:"outperson/importOutPersonInfo.asp",
			    type:"post",
				secureuri:false,
				fileElementId:'file_outperson_import',
				data:'',
				dataType: 'json',
				success:function (msg){
					endLoading();
					getCurrentPageObj().find("#file_outperson_import").val("");
					getCurrentPageObj().find("#modal_outperson_import").modal("hide");
					if(msg&&msg.result=="true"){
						alert("导入成功");
						getCurrentPageObj().find("#outpersonTableInfo").bootstrapTable("refresh");
					}else if(msg&&msg.error_info){
						alert("导入失败:"+msg.error_info);
					}else{
						alert("导入失败！");
					}
				},
				error: function (msg){
					endLoading();
					alert("导入失败！");
				}
		   });
		});
		obj=getCurrentPageObj().find("#FDsupplier_name");//供应商名称
		obj.unbind("click");
		obj.click(function(){
			openSupplierPop("outperson_contractSupplier_Pop",
					{singleSelect:true,parent_company:getCurrentPageObj().find("#FDsupplier_name"),parent_sup_num:getCurrentPageObj().find("input[name='FD.supplier_id']")});
		});
		obj=getCurrentPageObj().find("#outperson_export2");//外包人员导出
		obj.unbind("click");
		obj.click(function(){
			/*var purch_type=getCurrentPageObj().find("#purch_type").val();//人员采购类型
			if(purch_type==null||purch_type==undefined||purch_type=="请选择"||purch_type==""){
				alert("请先选择人员采购类型");
				return;
			}else{*/
			initSelect(getCurrentPageObj().find("#purch_types"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_PURCH_TYPE"});	//人员采购类型
				var belongproject=getCurrentPageObj().find("#belongproject").val();//身份证
				var op_name=getCurrentPageObj().find("#op_name").val();//外包人员姓名
				var supplier_id=getCurrentPageObj().find("#supplier_id").val();//供应商ID
				var op_office=getCurrentPageObj().find("#op_office").val();//实施处室
				var op_state=getCurrentPageObj().find("#op_state").val();//人员状态
				var url ="outperson/exportOutPersonInfo.asp?op_name="+escape(encodeURIComponent(op_name))+"&belongproject="+belongproject
				+"&supplier_id="+supplier_id+"&op_office="+op_office+"&op_state="+op_state;
				window.location.href = url;
			/*}*/
		});
	}
	
	//function queryList(event){
//		if(event.keyCode==13){
//			getCurrentPageObj().find("#outpersonTableInfo").bootstrapTable("refresh",{url:queryOutPersonUrl()});
//		}
	//}
	var queryParams=function(params){
		var temp={};
		 temp["limit"]=params.limit;
		 temp["offset"]=params.offset;
		return temp;
	};


	//查询列表显示table
	function initTable() {
		initSelect(getCurrentPageObj().find("#purch_types"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_PURCH_TYPE"});	//人员采购类型
		var outpseron_workflowType=getCurrentPageObj().find("#outpseron_workflowType").val();
		var outpseronEnterFlag=false;
		var outpseronOutFlag=false;
		if(outpseron_workflowType=="enterbank"){
			outpseronEnterFlag=true;
		}else if(outpseron_workflowType=="outbank"){
			outpseronOutFlag=true;
		}
		var op_state="06";
		getCurrentPageObj().find("#outpersonTableInfo").bootstrapTable({
					url : dev_outsource + 'outperson/findOutPersonInfo.asp?SID='+SID+"&call="+callout+"&query_type=leave_approve",
					method : 'get', //请求方式（*）   
					cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
					sortable : true, //是否启用排序
					sortOrder : "asc", //排序方式
					queryParams : queryParams,//传递参数（*）
					sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
					pagination : true, //是否显示分页（*）
					pageList : [5,10,20],//每页的记录行数（*）
					pageNumber : 1, //初始化加载第一页，默认第一页
					pageSize : 10,//可供选择的每页的行数（*）
					clickToSelect : true, //是否启用点击选中行
					uniqueId : "OP_ID", //每一行的唯一标识，一般为主键列
					cardView : false, //是否显示详细视图
					detailView : false, //是否显示父子表
					singleSelect: true,
					jsonpCallback : callout,
					onLoadSuccess:function(data){
					},
					columns : [ {
						field: 'middle',
						checkbox: true,
						rowspan: 2,
						align: 'center',
						valign: 'middle',
					},{
						field : 'R',
						title : '序号',
						align : "center",
						visible:false,
					},{
						field : 'OP_ID',
						title : '员工id',
						align : 'center',
						visible:false,
					},{
						field : 'OP_CODE',
						title : '外包人员编号',
						align : "center",
						visible:false,
					},{
						field : 'OP_NAME',
						title : '外包人员姓名',
						align : "center",
					},{
						field : 'OP_STATE_NAME',
						title : '外包人员状态',
						align : "center",
					}, {
						field : "SEX_NAME",
						title : "性别",
						align : "center",
					}, {
						field : "SUPPLIER_NAME",
						title : "供应商名称",
						align : "center",
					},  {
						field : "SSBM",
						title : "行内归属部门",
						align : "center"
					}, {
						field : "OP_STAFF_NAME",
						title : "行内项目经理",
						align : "center"
					}, {
						field : "OP_BELONGSYSTEM_NO",
						title : "所属应用编号",
						align : "center",
						visible:false
					}, {
						field : "OP_BELONGSYSTEM",
						title : "所属应用",
						align : "center"
					}, {
						field : "PURCH_TYPE_NAME",
						title : "人员采购类型",
						align : "center"
					}, {
						field : "OP_GRADE_NAME",
						title : "人员档次",
						align : "center",
						visible:false
					}, {
						field : "DEV_DIRECTION_NAME",
						title : "开发方向",
						align : "center"
					}, {
						field : "DEV_GRADE_NAME",
						title : "人员级别",
						align : "center"
					},{
						field : "BELONGPROJECT",
						title : "所属项目",
						align : "center",
						visible:false
					}, {
						field : "SPSTATENAME_ENTER",
						title : "入场审批状态",
						align : "center",
//						visible:outpseronEnterFlag,
						visible:false,
						formatter:function(value,row,index){
							var SPSTATENAME_ENTER=row.SPSTATENAME_ENTER;
							if(SPSTATENAME_ENTER==null||SPSTATENAME_ENTER==""||SPSTATENAME_ENTER==undefined){
								SPSTATENAME_ENTER="待发起";
							}
							return SPSTATENAME_ENTER;
						}
					 }, {
						field : "SPSTATENAME_OUT",
						title : "离场审批状态",
						align : "center",
						visible:outpseronOutFlag,
						formatter:function(value,row,index){
							var SPSTATENAME_OUT=row.SPSTATENAME_OUT;
							if(SPSTATENAME_OUT==null||SPSTATENAME_OUT==""||SPSTATENAME_OUT==undefined){
								SPSTATENAME_OUT="待发起";
							}
							return SPSTATENAME_OUT;
						}
					}]
				});
	}
	/**
	 * 判断同一供应商，同一人员采购类型，同一所属项目
	 * @param supname
	 * @param purchatype
	 * @param belongProject
	 * @param SSBM
	 * @returns {Boolean}
	 */
//	function validate_sup_pur_project(supname,purchatype,belongProject,ssbm){
//		var supflag=true;
//		var purflag=true;
//		var projectflag=true;
//		if(supname!=null&&supname!=""&&supname!=undefined){
//			var supname1=supname[0];
//			if(supname1==null||supname1==""||supname1==undefined){
//				return false;
//			}else{
//				for(var i=1,length=supname.length;i<length;i++){
//					if(supname1!=supname[i]){
//						supflag=false;
//						break;
//					}
//				}
//			}
//		}else{
//			supflag=false;
//		}
//		if(supflag){
//			if(purchatype!=null&&purchatype!=""&&purchatype!=undefined){
//				var purchatype1=purchatype[0];
//				if(purchatype1==null||purchatype1==""||purchatype1==undefined){
//					return false;
//				}else{
//					for(var i=1,length=purchatype.length;i<length;i++){
//						if(purchatype1!=purchatype[i]){
//							purflag=false;
//							break;
//						}
//					}
//				}
//			}else{
//				purflag=false;
//			}
//		}
//		if(purflag){
//			if(belongProject!=null&&belongProject!=""&&belongProject!=undefined){
//				var belongProject1=belongProject[0];
//				if(belongProject1==null||belongProject1==""||belongProject1==undefined){
//					return false;
//				}else{
//					for(var i=1,length=belongProject.length;i<length;i++){
//						if(belongProject1!=belongProject[i]){
//							projectflag=false;
//							break;
//						}
//					}
//				}
//			}else{
//				projectflag=false;
//			}
//		}
//		if(supflag&&purflag&&projectflag){
//			return true;
//		}else{
//			return false;
//		}
//	}
}
