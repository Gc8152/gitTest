/**
 * 供应商名称查询格式化
 * @param name
 * @returns
 */
function supNameformat(name){
	if(name&&($.trim(name)=="供应商简称"||$.trim(name)=="供应商名称")){
		return "";
	}
	return escape(encodeURIComponent(name));
}
/**
 * @param id
 * @param callparams
 * @param type:type有值时属于特殊情况
 */
function openSupplierPop(id,callparams,type){
	$('#myModal_supplier').remove();	
	getCurrentPageObj().find("#"+id).load("dev_outsource/supplier/supplierInfo/supplierPop.html",{},function(){
		$("#myModal_supplier").modal("show");
		$("#pop_sup_name").focus();
		//获取input里面的值
		var sup_name = $("#pop_sup_name").val();
		var sup_simp_name =  $("#pop_sup_simp_name").val();
		var url= dev_outsource+"SupplierInfo/queryAllSupplierInPop.asp?sup_name="
			+supNameformat(sup_name)+"&sup_simp_name="+supNameformat(sup_simp_name);
		//定期考核
		if(type!=null&&type=="adddotimecheck"){
			url+="&docheck_stime="+callparams.docheck_stime+"&docheck_etime="+callparams.docheck_etime
			+"&docheck_category="+callparams.docheck_category;
		//黑名单
		}else if(type!=null&&type=="black"){
			url= dev_outsource+"SupplierInfo/queryAllSupplierInPop.asp?type=black&sup_name="
				+supNameformat(sup_name)+"&sup_simp_name="+supNameformat(sup_simp_name);
		}
		supplierPop("#pop_supplierTable",url,callparams,type);
		$("select").select2();
	});
}
function openSupplierPop2(id,callparams,callback,type){
	$('#myModal_supplier').remove();	
	getCurrentPageObj().find("#"+id).load("dev_outsource/supplier/supplierInfo/supplierPop.html",{},function(){
		$("#myModal_supplier").modal("show");
		$("#pop_sup_name").focus();
		//获取input里面的值
		var sup_name = $("#pop_sup_name").val();
		var sup_simp_name =  $("#pop_sup_simp_name").val();
		var url= dev_outsource+"SupplierInfo/queryAllSupplierInPop.asp?sup_name="
			+supNameformat(sup_name)+"&sup_simp_name="+supNameformat(sup_simp_name);
		//定期考核
		if(type!=null&&type=="adddotimecheck"){
			url+="&docheck_stime="+callparams.docheck_stime+"&docheck_etime="+callparams.docheck_etime
			+"&docheck_category="+callparams.docheck_category;
		//黑名单
		}else if(type!=null&&type=="black"){
			url= dev_outsource+"SupplierInfo/queryAllSupplierInPop.asp?type=black&sup_name="
				+supNameformat(sup_name)+"&sup_simp_name="+supNameformat(sup_simp_name);
		}
		supplierPop2("#pop_supplierTable",url,callparams,callback,type);
		$("select").select2();
	});
}
function supplierPop(supplierTable,supplierUrl,supplierParam,type){
	//分页
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};	
	//设置多选还是单选
	var singleSelect=true;
	if(supplierParam.singleSelect==false){
		singleSelect=false;
	}
	if(!singleSelect){
		$("#supplierPOPSureSelected").parent().show();
		$("#supplierPOPSureSelected").unbind("click");
		$("#supplierPOPSureSelected").click(function(){
			var ids = getCurrentPageObj().find(supplierTable).bootstrapTable('getSelections');
			if(supplierParam.name&&supplierParam.no){
				var kvs=arrayObjToStr2(supplierParam.no,ids,"SUP_NUM","SUP_NAME");
				if(""==supplierParam.name.val()||supplierParam.name.attr("placeholder")==supplierParam.name.val()){
					supplierParam.no.val(kvs[0]);
					supplierParam.name.val(kvs[1]);
				}else if(""!=kvs[0]&&""!=kvs[1]){
					supplierParam.no.val(supplierParam.no.val()+","+kvs[0]);
					supplierParam.name.val(supplierParam.name.val()+","+kvs[1]);
				}
				$('#myModal_supplier').modal('hide');
			}
		});
	}else{
		$("#supplierPOPSureSelected").parent().hide();
	}
	//查询所有供应商POP框
	$(supplierTable).bootstrapTable("destroy").bootstrapTable({
				//请求后台的URL（*）
				url : supplierUrl+'&call=jq_1520840212928&SID='+SID,
				method : 'get', //请求方式（*）   
				striped : false, //是否显示行间隔色
				cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
				sortable : true, //是否启用排序
				sortOrder : "asc", //排序方式
				queryParams : queryParams,//传递参数（*）
				sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
				pagination : true, //是否显示分页（*）
				pageList : [5],//每页的记录行数（*）
				pageNumber : 1, //初始化加载第一页，默认第一页
				pageSize : 5,//可供选择的每页的行数（*）
				clickToSelect : true, //是否启用点击选中行
				uniqueId : "sup_num", //每一行的唯一标识，一般为主键列
				cardView : false, //是否显示详细视图
				detailView : false, //是否显示父子表
				singleSelect: singleSelect,
				jsonpCallback:"jq_1520840212928",
				onDblClickRow:function(row){
					if(singleSelect){
						$('#myModal_supplier').modal('hide');
						if(type==""||type==undefined||type==null){
							if(supplierParam.parent_company)supplierParam.parent_company.val(row.SUP_NAME);
							if(supplierParam.parent_sup_num)supplierParam.parent_sup_num.val(row.SUP_NUM);
							if(supplierParam.linkman)supplierParam.linkman.val(row.SUPPLIER_LINKMAN);
							if(supplierParam.linkphone)supplierParam.linkphone.val(row.SUPPLIER_LINKPHONE);
							if(supplierParam.parent_company_simp)supplierParam.parent_company_simp.val(row.SUP_SIMP_NAME);
							if(supplierParam.representative)supplierParam.representative.val(row.REPRESENTATIVE);
							if(supplierParam.group_company)supplierParam.group_company.val(row.GROUP_COMPANY);
							if(supplierParam.register_money)supplierParam.register_money.val(row.REGISTER_MONEY);
							if(supplierParam.industry)supplierParam.industry.val(row.INDUSTRY);
							if(supplierParam.suplinkemail) supplierParam.suplinkemail.val(row.EMAIL);
							if(supplierParam.suplevel)supplierParam.suplevel.val(row.SUPLEVEL);
						}else if(type=="supdaily"){
							//日常管理中的投诉和建议
							if(supplierParam.supname) supplierParam.supname.val(row.SUP_NAME);
							if(supplierParam.supnum) supplierParam.supnum.val(row.SUP_NUM);
							if(supplierParam.suplevel)supplierParam.suplevel.html(row.SUPLEVEL);
							if(supplierParam.supcategory) supplierParam.supcategory.html(row.SUP_SORT_ONE);
							if(supplierParam.suplinkman)supplierParam.suplinkman.html(row.SUPPLIER_LINKMAN);
							if(supplierParam.suplinktel) supplierParam.suplinktel.html(row.SUPPLIER_LINKPHONE);
							if(supplierParam.suplinkemail) supplierParam.suplinkemail.html(row.EMAIL);
						}else if(type=="adddotimecheck"){
							if(supplierParam.supname) supplierParam.supname.val(row.SUP_NAME);
							if(supplierParam.supnum) supplierParam.supnum.val(row.SUP_NUM);
							if(supplierParam.suplevel)supplierParam.suplevel.html(row.SUPLEVEL);
							if(supplierParam.supsortone) supplierParam.supsortone.html(row.SUP_SORT_ONE);
							if(supplierParam.suplinkman)supplierParam.suplinkman.html(row.SUPPLIER_LINKMAN);
							if(supplierParam.suplinktel) supplierParam.suplinktel.html(row.SUPPLIER_LINKPHONE);
							if(supplierParam.suplinkemail) supplierParam.suplinkemail.html(row.EMAIL);
							if(supplierParam.supsimplename) supplierParam.supsimplename.html(row.SUP_SIMP_NAME);
							supplierParam.callback();
						}else if(type=="black"){
							if(supplierParam.supname) supplierParam.supname.val(row.SUP_NAME);
							if(supplierParam.supnum) supplierParam.supnum.html(row.SUP_NUM);
							if(supplierParam.suplevel)supplierParam.suplevel.html(row.SUPLEVEL);
							if(supplierParam.supsortone) supplierParam.supsortone.html(row.SUP_SORT_ONE);
							if(supplierParam.suplinkman && row.SUPPLIER_LINKMAN != ""&& row.SUPPLIER_LINKMAN != null){
								supplierParam.suplinkman.html(row.SUPPLIER_LINKMAN);
							}else{
								supplierParam.suplinkman.html(" ");
							}
							if(supplierParam.suplinktel && row.SUPPLIER_LINKPHONE != ""&& row.SUPPLIER_LINKPHONE != null){
								supplierParam.suplinktel.html(row.SUPPLIER_LINKPHONE);
							}else{
								supplierParam.suplinktel.html(" ");
							}
							if(supplierParam.suplinkemail && row.EMAIL != ""&& row.EMAIL != null){
								supplierParam.suplinkemail.html(row.EMAIL);
							}else{
								supplierParam.suplinkemail.html(" ");
							}
							if(supplierParam.supsimpname) supplierParam.supsimpname.html(row.SUP_SIMP_NAME);
						}else if(type=="doPer"){
							if(supplierParam.supname) supplierParam.supname.val(row.SUP_NAME);
							if(supplierParam.supnum) supplierParam.supnum.html(row.SUP_NUM);
							if(supplierParam.suplevel)supplierParam.suplevel.html(row.SUPLEVEL);
							if(supplierParam.supsortone) supplierParam.supsortone.html(row.SUP_SORT_ONE);
							if(supplierParam.suplinkman)supplierParam.suplinkman.html(row.SUPPLIER_LINKMAN);
							if(supplierParam.suplinktel) supplierParam.suplinktel.html(row.SUPPLIER_LINKPHONE);
							if(supplierParam.suplinkemail) supplierParam.suplinkemail.html(row.EMAIL);
							if(supplierParam.supsimpname) supplierParam.supsimpname.html(row.SUP_SIMP_NAME);
							changeSupplier();
						}
					}
				},
				columns :[
					{
						field: 'middle',
						checkbox: true,
						rowspan: 2,
						align: 'center',
						valign: 'middle',
						visible:!singleSelect
					},{
						field : 'R',
						title : '序号',
						align : "center",
					}, {
			        	field : 'SUP_NUM',
						title : '供应商编号',
						align : "center"
			        },{
			        	field : 'SUP_NAME',
						title : '供应商名称',
						align : "center"
			        }, {
			        	field : "SUP_SIMP_NAME",
						title : "供应商简称",
						align : "center"
			        },{
						field : 'SUPPLIER_LINKMAN',
						title : '联系人',
						align : "center"
			        },{
						field : 'SUPPLIER_LINKPHONE',
						title : '联系电话',
						align : "center"
			        },{
						field : 'EMAIL',
						title : '联系邮箱',
						align : "center"
			        },{
						field : 'SUPLEVEL',
						title : '供应商级别',
						align : "center",
						visible: false
			        },{
			        	field : 'SUP_SORT_ONE',
			        	title : '供应商类别',
			        	align : "center",
			        	visible: false
			        }]
			});
	//供应商POP重置
	$("#pop_supplierReset").click(function(){
		$("#pop_sup_name").val("");
		$("#pop_sup_simp_name").val("");
		
	});
	//多条件查询供应商
	$("#pop_supplierSearch").click(function(){
		/*var sup_name = $("#pop_sup_name").val();
		var sup_simp_name =  $("#pop_sup_simp_name").val();
		$(supplierTable).bootstrapTable('refresh',{url:dev_outsource+"SupplierInfo/queryAllSupplierInPop.asp?type=black&sup_name="
			+escape(encodeURIComponent(sup_name))+"&sup_simp_name="+escape(encodeURIComponent(sup_simp_name))+'&call='+callTable+'&SID='+SID});*/
		refreshSuppplierPop(supplierTable);
	});
}
function refreshSuppplierPop(supplierTable){
	var sup_name = $("#pop_sup_name").val();
	var sup_simp_name =  $("#pop_sup_simp_name").val();
		$(supplierTable).bootstrapTable('refresh',{url:dev_outsource+"SupplierInfo/queryAllSupplierInPop.asp?type=black&sup_name="
		+supNameformat(sup_name)+"&sup_simp_name="+supNameformat(sup_simp_name)+'&call=jq_1520840212928&SID='+SID});
}
/**
 * 供应商模态框
 */
function supplierPop2(supplierTable,supplierUrl,supplierParam,callback,type){
	//分页
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};	
	//设置多选还是单选
	var singleSelect=true;
	if(supplierParam.singleSelect==false){
		singleSelect=false;
	}
	if(!singleSelect){
		$("#supplierPOPSureSelected").parent().show();
		$("#supplierPOPSureSelected").unbind("click");
		$("#supplierPOPSureSelected").click(function(){
			var ids = getCurrentPageObj().find(supplierTable).bootstrapTable('getSelections');
			if(supplierParam.name&&supplierParam.no){
				var kvs=arrayObjToStr2(supplierParam.no,ids,"SUP_NUM","SUP_NAME");
				if(""==supplierParam.name.val()||supplierParam.name.attr("placeholder")==supplierParam.name.val()){
					supplierParam.no.val(kvs[0]);
					supplierParam.name.val(kvs[1]);
				}else if(""!=kvs[0]&&""!=kvs[1]){
					supplierParam.no.val(supplierParam.no.val()+","+kvs[0]);
					supplierParam.name.val(supplierParam.name.val()+","+kvs[1]);
				}
				$('#myModal_supplier').modal('hide');
			}
		});
	}else{
		$("#supplierPOPSureSelected").parent().hide();
	}
	
	//查询所有供应商POP框
	$(supplierTable).bootstrapTable("destroy").bootstrapTable({
				//请求后台的URL（*）
				url : supplierUrl+"&call=jq_1520840212928&SID="+SID,
				method : 'get', //请求方式（*）   
				striped : false, //是否显示行间隔色
				cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
				sortable : true, //是否启用排序
				sortOrder : "asc", //排序方式
				queryParams : queryParams,//传递参数（*）
				sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
				pagination : true, //是否显示分页（*）
				pageList : [5],//每页的记录行数（*）
				pageNumber : 1, //初始化加载第一页，默认第一页
				pageSize : 5,//可供选择的每页的行数（*）
				clickToSelect : true, //是否启用点击选中行
				uniqueId : "sup_num", //每一行的唯一标识，一般为主键列
				jsonpCallback : "jq_1520840212928",
				cardView : false, //是否显示详细视图
				detailView : false, //是否显示父子表
				singleSelect: singleSelect,
				onDblClickRow:function(row){
					if(singleSelect){
						$('#myModal_supplier').modal('hide');
						callback(row.SUP_NUM);
						if(type==""||type==undefined||type==null){
							if(supplierParam.parent_company)supplierParam.parent_company.val(row.SUP_NAME);
							if(supplierParam.parent_sup_num)supplierParam.parent_sup_num.val(row.SUP_NUM);
							if(supplierParam.linkman)supplierParam.linkman.val(row.SUPPLIER_LINKMAN);
							if(supplierParam.linkphone)supplierParam.linkphone.val(row.SUPPLIER_LINKPHONE);
							if(supplierParam.parent_company_simp)supplierParam.parent_company_simp.val(row.SUP_SIMP_NAME);
							if(supplierParam.representative)supplierParam.representative.val(row.REPRESENTATIVE);
							if(supplierParam.group_company)supplierParam.group_company.val(row.GROUP_COMPANY);
							if(supplierParam.register_money)supplierParam.register_money.val(row.REGISTER_MONEY);
							if(supplierParam.industry)supplierParam.industry.val(row.INDUSTRY);
							if(supplierParam.suplinkemail) supplierParam.suplinkemail.val(row.EMAIL);
							if(supplierParam.suplevel)supplierParam.suplevel.val(row.SUPLEVEL);
						}else if(type=="supdaily"){
							//日常管理中的投诉和建议
							if(supplierParam.supname) supplierParam.supname.val(row.SUP_NAME);
							if(supplierParam.supnum) supplierParam.supnum.val(row.SUP_NUM);
							if(supplierParam.suplevel)supplierParam.suplevel.html(row.SUPLEVEL);
							if(supplierParam.supcategory) supplierParam.supcategory.html(row.SUP_SORT_ONE);
							if(supplierParam.suplinkman)supplierParam.suplinkman.html(row.SUPPLIER_LINKMAN);
							if(supplierParam.suplinktel) supplierParam.suplinktel.html(row.SUPPLIER_LINKPHONE);
							if(supplierParam.suplinkemail) supplierParam.suplinkemail.html(row.EMAIL);
						}else if(type=="adddotimecheck"){
							if(supplierParam.supname) supplierParam.supname.val(row.SUP_NAME);
							if(supplierParam.supnum) supplierParam.supnum.val(row.SUP_NUM);
							if(supplierParam.suplevel)supplierParam.suplevel.html(row.SUPLEVEL);
							if(supplierParam.supsortone) supplierParam.supsortone.html(row.SUP_SORT_ONE);
							if(supplierParam.suplinkman)supplierParam.suplinkman.html(row.SUPPLIER_LINKMAN);
							if(supplierParam.suplinktel) supplierParam.suplinktel.html(row.SUPPLIER_LINKPHONE);
							if(supplierParam.suplinkemail) supplierParam.suplinkemail.html(row.EMAIL);
							if(supplierParam.supsimplename) supplierParam.supsimplename.html(row.SUP_SIMP_NAME);
							supplierParam.callback();
						}else if(type=="black"){
							if(supplierParam.supname) supplierParam.supname.val(row.SUP_NAME);
							if(supplierParam.supnum) supplierParam.supnum.html(row.SUP_NUM);
							if(supplierParam.suplevel)supplierParam.suplevel.html(row.SUPLEVEL);
							if(supplierParam.supsortone) supplierParam.supsortone.html(row.SUP_SORT_ONE);
							if(supplierParam.suplinkman)supplierParam.suplinkman.html(row.SUPPLIER_LINKMAN);
							if(supplierParam.suplinktel) supplierParam.suplinktel.html(row.SUPPLIER_LINKPHONE);
							if(supplierParam.suplinkemail) supplierParam.suplinkemail.html(row.EMAIL);
							if(supplierParam.supsimpname) supplierParam.supsimpname.html(row.SUP_SIMP_NAME);
						}else if(type=="doPer"){
							if(supplierParam.supname) supplierParam.supname.val(row.SUP_NAME);
							if(supplierParam.supnum) supplierParam.supnum.html(row.SUP_NUM);
							if(supplierParam.suplevel)supplierParam.suplevel.html(row.SUPLEVEL);
							if(supplierParam.supsortone) supplierParam.supsortone.html(row.SUP_SORT_ONE);
							if(supplierParam.suplinkman)supplierParam.suplinkman.html(row.SUPPLIER_LINKMAN);
							if(supplierParam.suplinktel) supplierParam.suplinktel.html(row.SUPPLIER_LINKPHONE);
							if(supplierParam.suplinkemail) supplierParam.suplinkemail.html(row.EMAIL);
							if(supplierParam.supsimpname) supplierParam.supsimpname.html(row.SUP_SIMP_NAME);
							changeSupplier();
						}
					}
				},
				columns :[
					{
						field: 'middle',
						checkbox: true,
						rowspan: 2,
						align: 'center',
						valign: 'middle',
						visible:!singleSelect
					},{
						field : 'R',
						title : '序号',
						align : "center",
					}, {
			        	field : 'SUP_NUM',
						title : '供应商编号',
						align : "center"
			        },{
			        	field : 'SUP_NAME',
						title : '供应商名称',
						align : "center"
			        }, {
			        	field : "SUP_SIMP_NAME",
						title : "供应商简称",
						align : "center"
			        },{
						field : 'SUPPLIER_LINKMAN',
						title : '联系人',
						align : "center"
			        },{
						field : 'SUPPLIER_LINKPHONE',
						title : '联系电话',
						align : "center"
			        },{
						field : 'EMAIL',
						title : '联系邮箱',
						align : "center"
			        },{
						field : 'SUPLEVEL',
						title : '供应商级别',
						align : "center",
						visible: false
			        },{
			        	field : 'SUP_SORT_ONE',
			        	title : '供应商类别',
			        	align : "center",
			        	visible: false
			        }]
			});
	//供应商POP重置
	$("#pop_supplierReset").click(function(){
		$("#pop_sup_name").val("");
		$("#pop_sup_simp_name").val("");
		
	});
	//多条件查询供应商
	$("#pop_supplierSearch").click(function(){
		refreshSuppplierPop(supplierTable);
		/*var sup_name = $("#pop_sup_name").val();
		var sup_simp_name =  $("#pop_sup_simp_name").val();
		$(supplierTable).bootstrapTable('refresh',{url:"SupplierInfo/queryAllSupplierInPop.asp?type=black&sup_name="
			+escape(encodeURIComponent(sup_name))+"&sup_simp_name="+escape(encodeURIComponent(sup_simp_name))});*/
	});
}
//关闭当前 模态框
function clossThisModal(){
	$('#myModal_supplier').modal('hide');
}