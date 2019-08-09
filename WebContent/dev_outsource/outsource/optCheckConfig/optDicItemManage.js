
//初始化页面
function initOptDicItemMangePage(diccode){
var currTab = getCurrentPageObj();
var table = currTab.find("#detailOptDicItemTable");
var calls = getMillisecond();
//初始化列表
initOptDicItemTable(diccode);
var query_diccode="";
//初始化页面按钮
initOptDicItemPageBtn();
function initOptDicItemPageBtn(){
	currTab.find("#sdi_state").select2();
	
	//新增
	currTab.find("#addOptDicItem").click(function(){
		initAddDicItemPop("","");
	});
	
	//修改
	currTab.find("#updateOptDicItem").click(function(){
		var num = table.bootstrapTable('getSelections');
		var configId= $.map(num, function (row) {
			return row.ID;                    
		});
		if(configId.length!=1){
			alert("请选择一条数据进行修改!");
			return ;
		}
		initAddDicItemPop(configId,"update");
	});
	
	//删除
	currTab.find("#deleteOptDicItem").click(function(){
		var num = table.bootstrapTable('getSelections');
		var configId= $.map(num, function (row) {
			return row.ID;                    
		});
		if(configId.length!=1){
			alert("请选择一条数据进行修改!");
			return ;
		}
		nconfirm("确定要删除该数据吗？",function(){
			var url=dev_outsource+"optDic/deleteOptDic.asp?id="+configId+"&SID="+SID+"&call="+calls;
			baseAjaxJsonp(url,null,function(msg){
						$("#detailOptDicItemTable").bootstrapTable('remove', {
							field: 'ID',
							values: configId
						});
				table.bootstrapTable('refresh',{url:'optDic/queryAllOptDic.asp?flag=item&query_diccode='+query_diccode});
			});
		});	
	});
	
	//查看
	currTab.find("#detailOptDicItem").click(function(){
		var num = table.bootstrapTable('getSelections');
		var configId= $.map(num, function (row) {
			return row.ID;                    
		});
		if(configId.length!=1){
			alert("请选择一条数据进行查看!");
			return ;
		}
		initAddDicItemPop(configId,"detail");
	});
};

//初始化查询供应商列表显示table
function initOptDicItemTable(diccode) {
	var queryParams=function(params){
		var temp={};
		 temp["limit"]=params.limit;
		 temp["offset"]=params.offset;
		return temp;
	};
	table.bootstrapTable({
				//请求后台的URL（*）
				url : dev_outsource+'optDic/queryAllOptDic.asp?flag=item&query_diccode='+diccode+"&SID="+SID+"&call="+calls,
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
				  gaveInfo();	
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
				},{
					field : 'ITEMCODE',
					title : '指标说明编码',
					align : "center"
				}, {
					field : "ITEMNAME",
					title : "指标说明",
					align : "center"
				}, {
					field : "DETAIL",
					title : "考核依据",
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
	query_diccode=diccode;
}

//初始化字典项新增修改pop页面
function initAddDicItemPop(configId,opertype){
	currTab.find("#addOptDicItemPop_up").modal("show");
	emptyForm("addOptDicItemForm");
	initVlidate(currTab.find("#addOptDicItemForm"));
    if(opertype=="detail"){
    	currTab.find("#addOptDicItemForm select").attr("disabled","disabled");
    	currTab.find("#addOptDicItemForm input,#addOptDicItemForm textarea").attr("readonly","true");
    }else{
    	currTab.find("#addOptDicItemForm select").removeAttr("disabled");
    	currTab.find("#addOptDicItemForm input[id!=sdi_diccode],#addOptDicItemForm textarea").removeAttr("readonly");
    }
	if(configId!=null&&configId!=""&&configId!=undefined){
		baseAjaxJsonp(dev_outsource+"optDic/queryOneOptDic.asp?id="+configId+"&SID="+SID+"&call="+calls,null, function(data) {
        	if (data != undefined&&data!=null) {
        	    for(key in data){
        	    	var inputId=key.toLowerCase();
        	    	if(inputId=="state"){
        	    		currTab.find("#sdi_state").val(data[key]);
        	    		currTab.find("#sdi_state").select2();
        	    	}else{
            	    	if($("#sdi_"+inputId)!=null&&$("#sdi_"+inputId)!=undefined&&$("#sdi_"+inputId)!=""){
                	    	$("#sdi_"+key.toLowerCase()).val(data[key]);
        	    		}
        	    	}
        	    }
			}
		},calls);
	}else{
		var diccode = currTab.find("#diccode_item").val();
		currTab.find("#sdi_diccode").val(diccode);
		var call = getMillisecond()+1;
		baseAjaxJsonp(dev_outsource+'optDic/queryMaxOptDic.asp?query_diccode='+diccode+"&SID="+SID+"&call="+call,null, function(data) {
			if(data&&data["ITEMCODE"]!=undefined){
				var itemcode=data["ITEMCODE"];
				currTab.find("#sdi_itemcode").val(itemcode);
			}else{
				currTab.find("#sdi_itemcode").val(diccode+"01");
			}
		},call);
		
	}
	currTab.find("#sdi_itemcode").prop({"readonly":true});
	//保存
	var obj=currTab.find("#saveOptDicItem");
	obj.unbind();
	obj.click(function(){
		if(!vlidate(currTab.find("#addOptDicItemForm"))){
			return ;
		}
		var url = dev_outsource+"optDic/addOptDic.asp?SID="+SID+"&call="+calls;
		var tips="保存";
		var configid = currTab.find("#sdi_id").val();
		if(configid!=null&&configid!=""&&configid!=undefined){
			url=dev_outsource + "optDic/updateOptDic.asp?SID="+SID+"&call="+calls;
			tips="修改";
		}
		baseAjaxJsonp(url,currTab.find("#addOptDicItemForm").serialize(),function(data){
			if (data != undefined&&data!=null&&data.result=="true") {
				alert(tips+"成功");
				table.bootstrapTable('refresh'/*,{url:dev_outsource+'optDic/queryAllOptDic.asp?flag=item&query_diccode='+query_diccode}*/);
				currTab.find("#addOptDicItemPop_up").modal("hide");
			}else{
				alert(tips+"失败");
			}
		},calls);
	});
	
	//关闭
	obj = currTab.find("#return_saveOptDicItem");
	obj.unbind();
	obj.click(function(){
		currTab.find("#addOptDicItemPop_up").modal("hide");
	});
  }
}

//清空字典项pop页面信息
function emptyForm(formId){
	getCurrentPageObj().find("#"+formId+ " input").val("");
	getCurrentPageObj().find("#"+formId+" textarea").val("");
	var selects=getCurrentPageObj().find("#"+formId+" select");
	selects.val("");
	selects.select2();
}