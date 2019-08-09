
initOptCheckConfigQueryPage();
function initOptCheckConfigQueryPage(){
    var currTab = getCurrentPageObj();
    var queryForm = currTab.find("#optDicList");
    var table = currTab.find("#detailOptDicTable");
    var calls = getMillisecond();
	getCurrentPageObj().find("#sd_state").select2();
	getCurrentPageObj().find("#query_state").select2();
	
	//查询
	currTab.find("#queryAllOptDicList").unbind().click(function(){
		var param = queryForm.serialize();
		table.bootstrapTable('refresh',{url:dev_outsource+'optDic/queryAllOptDic.asp?SID=' + SID+"&call="+calls+"&"+param});
	 });
	//enter触发查询
	enterEventRegister(getCurrentPageObj().attr("class"), function(){currTab.find("#queryAllOptDicList").click();});
	
	//清空
	currTab.find("#reset_optDicList").click(function(){
		currTab.find("#optDicList input").val("");
		var selects=currTab.find("#optDicList select");
		selects.val("");
		selects.select2();
	});
	
	//新增
	currTab.find("#addOptDic").click(function(){
		currTab.find("#addOptDicPop_up").modal("show");
		currTab.find("#reset_saveOptDic").click();
		initAddConfigDicPop("","");
	});
	
	//修改
	currTab.find("#updateOptDic").click(function(){
		var num = table.bootstrapTable('getSelections');
		var configId= $.map(num, function (row) {
			return row.ID;                    
		});
		if(configId.length!=1){
			alert("请选择一条数据进行修改!");
			return ;
		}
		currTab.find("#addOptDicPop_up").modal("show");
		currTab.find("#reset_saveOptDic").click();
		initAddConfigDicPop(configId,"update");
	});
	
	//指标说明
	currTab.find("#configOptDic").click(function(){
		var num = table.bootstrapTable('getSelections');
		var itemcode= $.map(num, function (row) {
			return row.ITEMCODE;                    
		});
		var itemname= $.map(num, function (row) {
			return row.ITEMNAME;                    
		});
		if(itemcode.length!=1){
			alert("请选择一条数据进行子项配置!");
			return ;
		}
		closeAndOpenInnerPageTab("OptDicItemManage","指标说明","dev_outsource/outsource/optCheckConfig/optDicItemManage.html",function(){
			getCurrentPageObj().find("#diccode_item").val(itemcode[0]);
			getCurrentPageObj().find("#dicname_item").val(itemname[0]);
			initOptDicItemMangePage(itemcode[0]);
		});
	});
	//删除
	currTab.find("#deleteOptDic").click(function(){
		var num = table.bootstrapTable('getSelections');
		var configId= $.map(num, function (row) {
			return row.ID;                    
		});
		if(configId.length!=1){
			alert("请选择一条数据进行修改!");
			return ;
		}
		nconfirm("确定要删除该数据吗？",function(){
			baseAjaxJsonp(dev_outsource+"optDic/deleteOptDic.asp?id="+configId+"&SID="+SID+"&call="+calls, null, function(data){
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
	
	//查看
	currTab.find("#detailOptDic").click(function(){
		var num = table.bootstrapTable('getSelections');
		var configId= $.map(num, function (row) {
			return row.ID;                    
		});
		if(configId.length!=1){
			alert("请选择一条数据进行查看!");
			return ;
		}
		currTab.find("#addOptDicPop_up").modal("show");
		currTab.find("#reset_saveOptDic").click();
		initAddConfigDicPop(configId,"detail");
	});


//初始化外包人员考核指标列表显示table
initOptDicTable();
function initOptDicTable() {
	var queryParams=function(params){
		var temp={};
		 temp["limit"]=params.limit;
		 temp["offset"]=params.offset;
		return temp;
	};
	table.bootstrapTable(
			{
				//请求后台的URL（*）
				url : dev_outsource+'optDic/queryAllOptDic.asp?SID='+SID+"&call="+calls,
				method : 'get', //请求方式（*）   
				striped : false, //是否显示行间隔色
				cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）escape(encodeURIComponent(user_name))
				sortable : true, //是否启用排序
				sortOrder : "asc", //排序方式
				queryParams : queryParams,//传递参数（*）
				sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
				pagination : true, //是否显示分页（*）
				pageList : [5,10,20],//每页的记录行数（*）
				pageNumber : 1, //初始化加载第一页，默认第一页
				pageSize : 10,//可供选择的每页的行数（*）
				clickToSelect : true, //是否启用点击选中行
				uniqueId : "ID", //每一行的唯一标识，一般为主键列
				cardView : false, //是否显示详细视图
				detailView : false, //是否显示父子表
				jsonpCallback:calls,
				singleSelect: true,
				onLoadSuccess:function(data){
					
				},
				columns : [ {
					field: 'middle',
					checkbox: true,
					rowspan: 2,
					align: 'center',
					valign: 'middle'
				},{
					field : 'Number',
					title : '序号',
					align : "center",
					formatter: function (value, row, index) {
						return index+1;
					}
				},{
					field : 'ID',
					title : '主键',
					align : "center",
					visible: false
				},{
					field : 'DICCODE',
					title : '指标编码',
					align : "center"
				}, {
					field : "ITEMNAME",
					title : "指标名称",
					align : "center"
				}, {
					field : "DETAIL",
					title : "考核得分(分)",
					align : "center"
				}, {
					field : "STATE",
					title : "状态",
					align : "center",
					formatter:function(value,row,index){
						if(value!=null&&value!=undefined&&value!=""){
							if(value=="00"){
								return "启用";
							}else if(value=="01"){
								return "禁用";
							}
						}else{
							return "";
						}
					}
				}]
			});
   }
}

//新增考核项pop按钮操作
function initAddConfigDicPop(configId,opertype){
	var currTab = getCurrentPageObj();
	initVlidate(currTab.find("#addOptDicForm"));
	//先清除pop中的数据
	currTab.find("#addOptDicForm input").val("");
	currTab.find("#addOptDicForm textarea").val("");
	var selects = currTab.find("#addOptDicForm select");
	selects.val("");
	selects.select2();
	
	//pop可操作性控制
    if(opertype=="detail"){//查看
    	currTab.find("#addOptDicForm select").attr("disabled","disabled");
    	currTab.find("#addOptDicForm input,#addOptDicForm textarea").attr("readonly","true");
    	currTab.find("#saveOptDic,#reset_saveOptDic").hide();
    	currTab.find("#return_saveOptDic").show();
    }else{
    	currTab.find("#saveOptDic,#reset_saveOptDic").show();
    	currTab.find("#return_saveOptDic").hide();
    	currTab.find("#addOptDicForm select").removeAttr("disabled");
    	currTab.find("#addOptDicForm input,#addOptDicForm textarea").removeAttr("readonly");
    }
    
    //初始化页面数据
    var calls = getMillisecond();
	if(configId!=null&&configId!=""&&configId!=undefined){
		baseAjaxJsonp(dev_outsource+"optDic/queryOneOptDic.asp?id="+configId+"&SID="+SID+"&call="+calls,null, function(data) {
        	if (data != undefined&&data!=null) {
        	    for(key in data){
        	    	var inputId=key.toLowerCase();
        	    	if(inputId=="state"){
        	    		currTab.find("#sd_state").val(data[key]);
        	    		currTab.find("#sd_state").select2();
        	    	}else{
            	    	if(currTab.find("#sd_"+inputId)!=null&&currTab.find("#sd_"+inputId)!=undefined&&$("#sd_"+inputId)!=""){
            	    		currTab.find("#sd_"+key.toLowerCase()).val(data[key]);
        	    		}
        	    	}
        	    }
			}
		},calls);
	}
	
	//按钮操作
    //保存
	var obj = currTab.find("#saveOptDic");
	obj.unbind().click(function(){
		if(!vlidate(currTab.find("#addOptDicForm"))){
			return ;
		}
		var url = dev_outsource+"optDic/addOptDic.asp?SID="+SID+"&call="+calls;
		var tips = "保存";
		var configid = currTab.find("#sd_id").val();
		if(configid!=null&&configid!=""&&configid!=undefined){
			url=dev_outsource+"optDic/updateOptDic.asp?SID="+SID+"&call="+calls;
			tips="修改";
		}
		var param=currTab.find("#addOptDicForm").serialize()+"&itemcode="+$("#sd_diccode").val();
		baseAjaxJsonp(url,param,function(data){
			if (data != undefined&&data!=null&&data.result=="true") {
				alert(tips+"成功");
				currTab.find("#queryAllOptDicList").click();
				currTab.find("#addOptDicPop_up").modal("hide");
			}else{
				alert(tips+"失败");
			}
		},calls);
	});
	
	//重置
	obj = currTab.find("#reset_saveOptDic");
	obj.unbind().click(function(){
		currTab.find("#addOptDicForm input").val("");
		currTab.find("#addOptDicForm textarea").val("");
		var selects = currTab.find("#addOptDicForm select");
		selects.val("");
		selects.select2();
	});
	
	//返回
	obj = currTab.find("#return_saveOptDic");
	obj.unbind().click(function(){
		currTab.find("#addOptDicPop_up").modal("hide");
	});
	
}