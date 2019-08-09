
initOutPersonCheckQueryPage();
function initOutPersonCheckQueryPage(){
	var currTab = getCurrentPageObj();
	var queryForm = currTab.find("#optCheckList");
	var table = currTab.find("#optCheckTable");
	var calls = getMillisecond();
	//根据diccode标签初始化下拉框
	autoInitSelect(queryForm);

/**
 * 组装查询url 
 * @returns {String}
 */
function queryStaffCheckUrl(){
	var url=dev_outsource+"OptCheck/queryalloptcheck.asp?SID="+SID+"&call="+calls;
	var sts="";
	var selects=getCurrentPageObj().find("select[name^='OCQ.']");//获取下拉选的值
	for(var i=0;i<selects.length;i++){
		var obj=$(selects[i]);
		if($.trim(obj.val())!=""){
			sts+='&'+obj.attr("name").substr(4)+"="+obj.val();
		}
	}
	var fds=getCurrentPageObj().find("input[name^='OCQ.']");
	for(var i=0;i<fds.length;i++){
		var obj=$(fds[i]);
		if($.trim(obj.val())!=""){
			url+='&'+obj.attr("name").substr(4)+"="+escape(encodeURIComponent(obj.val()));
		}
	}
	return url+sts;
}

/**
 * 获取查询参数
 * @returns {___anonymous51_52}
 */
function getOCheckParams(){
	var param={};
	var inputs=	$("#optCheckList input");
	for(var i=0;i<inputs.length;i++){
		var obj=$(inputs[i]);
		if($.trim(obj.val())!=""){
			param[obj.attr("name")]=obj.val();
		}
	}
	var selects=$("#optCheckList select");
	for(var i=0;i<selects.length;i++){
		var obj=$(selects[i]);
		if($.trim(obj.val())!=""){
			param[obj.attr("name")]=obj.val();
		}
	}
	return param;
}

//查询列表显示table
initOptCheckQueryTable();
function initOptCheckQueryTable() {
	var queryParams=function(params){
		var temp={};
		 temp["limit"]=params.limit;
		 temp["offset"]=params.offset;
		return temp;
	};
	table.bootstrapTable({
				url : dev_outsource+"OptCheck/queryalloptcheck.asp?SID="+SID+"&call="+calls,
				method : 'get', //请求方式（*）   
				striped : false, //是否显示行间隔色
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
				uniqueId : "CHECK_ID", //每一行的唯一标识，一般为主键列
				cardView : false, //是否显示详细视图
				detailView : false, //是否显示父子表
				jsonpCallback:calls,
				singleSelect: true,
				onLoadSuccess:function(data){
					gaveInfo();
				},
				columns : [ {
					field: 'middle',
					checkbox: true,
					rowspan: 2,
					align: 'center',
					valign: 'middle'
				},{
					field : 'OP_ID',
					title : '外包人员id',
					align : 'center',
					visible:false
				},{
					field : 'CHECK_ID',
					title : '考核id',
					align : 'center',
					visible:false
				},{
					field : 'IDCARD_NO',
					title : '身份证',
					align : "center"
				},{
					field : 'OP_NAME',
					title : '人员姓名',
					align : "center"
				}, {
					field : "SUP_NAME",
					title : "供应商名称",
					align : "center"
				}, {
					field : "OP_STAFF_NAME",
					title : "行方项目经理",
					align : "center"
				}, {
					field : "CHECK_SCORE",
					title : "考核分数",
					align : "center"
				}, {
					field : "CHECK_ENDTIME",
					title : "考核时间",
					align : "center"
				}, {
					field : "CHECK_TYPE_DISPLAY",
					title : "考核类别",
					align : "center"
				}]
			});
};
/**
 * 初始化页面查询事件
 */
initOptCheckQueryPageBtn();
function initOptCheckQueryPageBtn(){
	
	//供应商pop框
	obj=currTab.find("#supplier_id");
	obj.unbind("click");
	obj.click(function(){
		openSupplierPop("supNamePop",{singleSelect:true,parent_company:currTab.find("#supplier_id"),parent_sup_num:currTab.find("input[name='OCQ.supplier_id']")});
	});
	
	//查询按钮事件
	currTab.find("#queryOptCheck").unbind("click");
	currTab.find("#queryOptCheck").click(function(){
		table.bootstrapTable("refresh",{url:queryStaffCheckUrl()});
	});
	//enter触发查询
	enterEventRegister(currTab.attr("class"), function(){currTab.find("#queryOptCheck").click();});
	
	//新增外包人员考核信息
	currTab.find("#optCheckAdd").unbind("click");
	currTab.find("#optCheckAdd").click(function(){
		closeAndOpenInnerPageTab("optCheckAdd","外包人员考核新增","dev_outsource/outsource/outpersonCheck/outpersonCheck_add.html",function(){
		});
	});
	
	//重置按钮
	currTab.find("#check_reset").click(function(){
		currTab.find("#optCheckList input").val("");
		var selects=getCurrentPageObj().find("#optCheckList select");
		selects.val(" ");
		selects.select2();
	});
	
	//修改外包人员考核信息
	currTab.find("#optCheckUpdate").unbind("click");
	currTab.find("#optCheckUpdate").click(function(){
		var id = table.bootstrapTable('getSelections');
		if(id.length!=1){
			alert("请选择一条数据进行修改!");
			return ;
		}
		var ids = $.map(id, function (row) {
			return row.CHECK_ID;                    
		});
		closePageTab("optCheckUpdate",function(){
			openInnerPageTab("optCheckUpdate","行员考核修改","dev_outsource/outsource/outpersonCheck/outpersonCheck_update.html",function(){
				optCheck_update(ids);
			});
		});
	});
	
	//删除外包人员考核信息
	currTab.find("#optCheckDel").unbind("click");
	currTab.find("#optCheckDel").click(function(){
		var id = table.bootstrapTable('getSelections');
		if(id.length!=1){
			alert("请选择一条数据进行删除!");
			return ;
		}
		var ids = $.map(id, function (row) {
			return row.CHECK_ID;                    
		});
		nconfirm("确定删除该外包人员考核信息吗？",function(){
			var url=dev_outsource+"OptCheck/deloptCheck.asp?check_id="+ids+"&SID="+SID+"&call="+calls;
			baseAjaxJsonp(url,null,function(data){
				if(data!=null&&data!=undefined&&data.result=="true"){
					alert("删除成功！",function(){
						table.bootstrapTable('refresh');
					});
				}else{
					alert("删除失败！");
				}
				
			},calls);
		});
	});
	
	//详情页面
	currTab.find("#optCheckDetail").unbind("click");
	currTab.find("#optCheckDetail").click(function(){
		var id = table.bootstrapTable('getSelections');
		if(id.length!=1){
			alert("请选择一条数据进行查看!");
			return ;
		}
		var ids = $.map(id, function (row) {
			return row.CHECK_ID;                    
		});
		closeAndOpenInnerPageTab("optCheckDetail","外包人员考核详细信息","dev_outsource/outsource/outpersonCheck/outpersonCheck_detail.html",function(){
			optCheck_detail(ids);
		});
	});
	
	//打印
	currTab.find("#optCheckPrint").unbind("click");
	currTab.find("#optCheckPrint").click(function(){
		var id = table.bootstrapTable('getSelections');
		if(id.length!=1){
			alert("请选择一条数据进行打印!");
			return ;
		}
		var check_id = escape(id[0]["CHECK_ID"]);
		var op_name = escape(id[0]["OP_NAME"]);
		var sup_name = escape(id[0]["SUP_NAME"]);
		var check_score = escape(id[0]["CHECK_SCORE"]);
		var check_endtime = escape(id[0]["CHECK_ENDTIME"]);
		var check_type = escape(id[0]["CHECK_TYPE"]);
		openPrintWindow("dev_outsource/outsource/outpersonCheck/outpersonCheck_checkPrint.html?" +
						"op_name="+op_name+"&sup_name="+sup_name+"&check_score="+check_score+"&check_id="+check_id+
						"&check_endtime="+check_endtime+"&check_type="+check_type);
	});
	
	//考核信息导入
	currTab.find("#optCheckImp").unbind("click");
	currTab.find("#optCheckImp").click(function(){
		currTab.find("#optCheck_import").modal("show");
     });
	
	//导入
	currTab.find("#importOptCheck").unbind("click");
	currTab.find("#importOptCheck").click(function(){
		startLoading();
	    $.ajaxFileUpload({
		    url:"OptCheck/importOptCheck.asp",
		    type:"post",
			secureuri:false,
			fileElementId:'opCheckfile',
			data:'',
			dataType: 'json',
			success:function (msg){
				endLoading();
				getCurrentPageObj().find("#opCheckfile").val("");
				getCurrentPageObj().find("#opcheckfield").val("");
				$("#optCheck_import").modal("hide");
				if(msg&&msg.result=="true"){
					alert("导入成功",function(){
						table.bootstrapTable("refresh");
					});
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
  };
}
/**
 * 校验输入的数字
 * @param obj
 */
function oCheckList_checkNum(obj){
	var reg = new RegExp("^[0-9]+(.[0-9]{1,2})?$");
	if(!reg.test(obj.value) && obj.value!="" && obj.value!=null){
		alert("请输入正确的数字！",function(){
			obj.value='';
		});
    }
}

//时间比较
function ocheckTimeCompare(){
	WdatePicker({onpicked:function(){
		var check_starttime = getCurrentPageObj().find("#check_starttime").val();
		var check_endtime = getCurrentPageObj().find("#check_endtime").val();
		if(check_starttime!=""&&check_endtime!=""){
			if(check_starttime>check_endtime){
				alert('开始时间不能大于结束时间!',function(){
					getCurrentPageObj().find("#check_starttime").val("");
					getCurrentPageObj().find("#check_endtime").val("");
				});
			}
		}
	}});
}
