function pageDispatch_sdicitem(obj, key) {
	// 初始化
	var id = $("#table_sdic").bootstrapTable('getSelections');
	if (id.length != 1) {
		alert("请选择一条数据进行配置!");
		return;
	}
	closeAndOpenInnerPageTab("add_sdicitem", "创建字典项","pages/sdic/sdicItem_queryInfo.html",function(){
		// 字典项页面加载
		var dic_code = $.map(id, function(row) {
			return (row.DIC_CODE);
		});
		var dic_name = $.map(id, function(row) {
			return (row.DIC_NAME);
		});
		var queryParams = function(params) {
			var temp = {
				limit : params.limit, // 页面大小
				offset : params.offset
			// 页码
			};
			return temp;
		};
		$("#sdic_code").val(dic_code);
		$("#sdic_name").val(dic_name);
		// 初始化字典项
		setTimeout(function(){
			$('#table_item').bootstrapTable("destroy").bootstrapTable({
				url : "SDicItem/findAllSDicItem.asp?dic_code=" + dic_code, // 请求后台的URL（*）
				method : 'get', // 请求方式（*）
				striped : true, // 是否显示行间隔色
				cache : false, // 是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
				pagination : true, // 是否显示分页（*）
				sortable : false, // 是否启用排序
				sortOrder : "asc", // 排序方式
				queryParams : queryParams, // 传递参数（*）
				sidePagination : "server", // 分页方式：client客户端分页，server服务端分页（*）
				pageNumber : 1, // 初始化加载第一页，默认第一页
				pageSize : 10, // 每页的记录行数（*）
				pageList : [ 5, 10 ], // 可供选择的每页的行数（*）
				strictSearch : true,
				clickToSelect : true, // 是否启用点击选中行
				uniqueId : "ITEM_CODE", // 每一行的唯一标识，一般为主键列
				cardView : false, // 是否显示详细视图
				detailView : false, // 是否显示父子表
				singleSelect : true,
				radio : true,
				columns : [ {
					field : 'state',
					checkbox : true,
					rowspan : 2,
					align : 'center',
					valign : 'middle'
				}, {
					field : 'ORDER_ID',
					title : '序号',
					rowspan : 2,
					align : 'center'
				}, {
					field : 'ITEM_CODE',
					title : '字典编码',
					align : 'center'
				}, {
					field : 'ITEM_NAME',
					title : '文本值',
					align : 'center'
				}, {
					field : 'DIC_CODE',
					title : '类别编码',
					align : 'center'
				}, {
					field : 'STATE',
					title : '状态',
					align : 'center',
					formatter : function(value, row, index) {
						if (value == "00") {
							return "启用";
						}
						return "停用";
					}
				}, {
					field : 'IS_DEFAULT',
					title : '是否默认',
					align : 'center',
					formatter : function(value, row, index) {
						if (value == "00") {
							return "是";
						}
						return "否";
					}
				}, {
					field : 'MEMO',
					title : '说明',
					align : 'center'
				}, {
					field : 'OPT_NO',
					title : '操作人',
					align : 'center'
				}, {
					field : 'OPT_TIME',
					title : '操作时间',
					align : 'center'
				}, {
					field : 'DIC_NAME',
					title : '类别名称',
					align : 'center',
					visible:false
				}]
			});	
		}, 300);
			
		
		// 删除
		deleteSdicItem();
		//新增
		addSdicItem();
		//修改
		updateSdicItem();
	});
}
// 删除
function deleteSdicItem() {
	// 删除表格中的一条数据
	$("#del_item").on(	'click',function() {
		nconfirm("是否停用?",function(){
			var id = $("#table_item").bootstrapTable(
					'getSelections');
			var ids = $.map(id, function(row) {
				return row.ITEM_CODE;
			});
			if (id.length != 1) {
				alert("请选择一条数据进行停用!");
				return;
			}
			$.ajax({
				type : "post",
				url : "SDicItem/delete.asp",
				async : true,
				data : {
					"item_code" : ids[0],
					"dic_code" : $("#sdic_code").val()
				},
				dataType : "json",
				success : function(msg) {
					alert("停用成功！");
					$('#table_item')	.bootstrapTable('refresh',{url : "SDicItem/findAllSDicItem.asp?dic_code="+ $("#sdic_code").val()	});
				},
				error : function() {
					alert("停用失败！");
				}
			});
		});
	});
}
//新增
function addSdicItem(){
	initVlidate($("#sdicItem_form_add"));
	//表单必填项
	$("input").focus(function() {
		$(this).siblings("div").remove();
	});
	$("select").change(function() {
		$(this).siblings("div[class^='tag-position']").remove();
	});
	$("textarea").focus(function() {
		$(this).siblings("div[class^='tag-position']").remove();
	});
	$("#dic_item_state").select2();
	$("#dic_is_default").select2();
	//状态下拉框
	initSelect($("#dic_item_state"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"S_DIC_OC"});	
	initSelect($("#dic_is_default"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"S_DIC_YN"});	

	$("#add_item").click(function(){
		//新增页面
		$("#s_dic_tiem_add_Pop").modal("show");
		$("input[name='sd.']").each(function(){
			$(this).val("");
		});
		$("#dicItem_name").val($("#sdic_name").val());
	});
	//保存
	$("#itemdic_save").click(function(){
	    //验证是否为空
		  if(!vlidate($("#sdicItem_form_add"),999999)){
			  return ;
		  }
		  var dic_item_code =  $.trim($("#dic_item_code").val());
	      var dic_item_name = $.trim($("#dic_item_name").val());
	      var dic_item_state =  $.trim($("#dic_item_state").val());
	      var dic_is_default =  $.trim($("#dic_is_default").val());
	      var dic_item_state =  $.trim($("#dic_item_state").val());
	      var dic_order_id =  $.trim($("#dic_order_id").val());
	      var dic_memo =  $.trim($("#dic_memo").val());
	      //判断编码是否重复
	      var ok = true;
	      if(ok){
		        $.ajax({
		           url:"SDicItem/findById.asp",
		           type:"post",
	    		   async :  false,
		           data:{"item_code":dic_item_code,"dic_code":$("#sdic_code").val()},
		           dataType:"json",
		           success:function(msg){
		        	   if(msg.result){
		        		   ok = false;
		        		   alert("字典编码重复！请重新输入！");
		        	   }
		           }
		        });
		     }
	      //验证是否有默认值
	      if(ok){
		        $.ajax({
		           url:"SDicItem/findAllSDicItem.asp",
		           type:"post",
	    		   async :  false,
		           data:{"dic_code":$("#sdic_code").val()},
		           dataType:"json",
		           success:function(msg){
		        	   for(var i=0;i<msg.rows.length;i++){
			        	   if(msg.rows[i].IS_DEFAULT=='00' &&dic_is_default=='00'){
			        		   alert("是否默认选项填写错误！");
			        		   ok = false;
			        		   return;
			        	   }		        		   
		        	   }
		           }
		        });
		     }      
	      if(ok){
  	        //发送Ajax请求save
  	        $.ajax({
  	           url:"SDicItem/save.asp",
  	           type:"post",
	    	   async :  false,
  	           data:{"item_code":dic_item_code,
  	        	  	    "item_name":dic_item_name,
  	        	   		"dic_code":$("#sdic_code").val(),
  	        	   		"state":dic_item_state,
  	        	   		"is_default":dic_is_default,
  	        	   		"order_id":dic_order_id,
  	        	   		"memo":dic_memo
  	        	},
  	           dataType:"json",
  	           success:function(msg){
  					alert("保存成功!");
  					$("#s_dic_tiem_add_Pop").modal("hide");
					$('#table_item')	.bootstrapTable('refresh',{url : "SDicItem/findAllSDicItem.asp?dic_code="+ $("#sdic_code").val()	});
  	           }
  	        });
  	     }	 
	});
	//关闭
	$("#itemdic_close").click(function(){
		onModalCloseEvent("s_dic_tiem_add_Pop");
		$("#s_dic_tiem_add_Pop").modal("hide");
	});
}


//修改
function updateSdicItem(){
	//取数据
	$("#update_item").click(function(){
		var id = $("#table_item").bootstrapTable('getSelections');
		if(id.length!=1){
			alert("请选择一条数据进行修改!");
			return ;
		}
		var ids = $.map(id, function (row) {
			return row.ITEM_CODE;                    
		});
		var dic_code = $.map(id, function(row) {
			return (row.DIC_CODE);
		});
		var dic_name = $.map(id, function(row) {
			return (row.DIC_NAME);
		});
		//新增页面
		$("#s_dic_tiem_update_Pop").modal("show");
		//添加必填项星星
		initVlidate($("#sdicItem_form_update"));
		//表单必填项
		$("input").focus(function() {
			$(this).siblings("div").remove();
		});
		$("select").change(function() {
			$(this).siblings("div[class^='tag-position']").remove();
		});
		$("textarea").focus(function() {
			$(this).siblings("div[class^='tag-position']").remove();
		});
		$("#dic_item_update_state").select2();
		$("#dic_is_update_default").select2();
		//查询初始化赋值
        $.ajax({
	           url:"SDicItem/findById.asp?item_code="+ids+"&dic_code="+dic_code,
	           type:"post",
    		   async :  true,
	           data:{},
	           dataType:"json",
	           success:function(result){
	     	      $("#dic_item_update_code").val(result.list[0].item_code);
	    	      $("#dic_item_update_name").val(result.list[0].item_name);
	    	      initSelect($("#dic_item_update_state"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"S_DIC_OC"},result.list[0].state);
	    	      initSelect($("#dic_is_update_default"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"S_DIC_YN"},result.list[0].is_default);
	    	      $("#dic_update_name").val(dic_name);
	    	      $("#dic_order_update_id").val(result.list[0].order_id);
	    	      $("#dicItem_update_memo").val(result.list[0].memo);
	           }
	        });
	});
	//保存
	$("#item_update_save").on('click',function(){
		var id = $("#table_item").bootstrapTable('getSelections');
		if(id.length!=1){
			alert("请选择一条数据进行修改!");
			return ;
		}
		var dic_code = $.map(id, function(row) {
			return (row.DIC_CODE);
		});
		//检查数据格式
       if(!vlidate($("#sdicItem_form_update"),9999)){
			  return ;
	   }
      var item_code = $("#dic_item_update_code").val();
      var item_name = $("#dic_item_update_name").val();
      var item_state = $("#dic_item_update_state").val();
	  var item_is_default = $("#dic_is_update_default").val();
      var item_order_id = $("#dic_order_update_id").val();
      var item_memo =  $("#dicItem_update_memo").val(); 
      var ok = true;
      //验证是否有默认值
        $.ajax({
           url:"SDicItem/findAllSDicItem.asp?dic_code="+dic_code,
           type:"post",
		   async : false,
           data:{"limit":10,"offset":0},
           dataType:"json",
           success:function(msg){
        	   for(var i=0;i<msg.rows.length;i++){
        		   if(msg.rows[i].ITEM_CODE!=item_code){
        			   if(msg.rows[i].IS_DEFAULT=='00'&&item_is_default=='00'){
        				   alert("是否默认选项填写错误！");
        				   ok = false;
        				   return;
        			   }		        		   
        		   }
        	   }
           }
        });
        if(ok){
        	//发送Ajax请求save
        	$.ajax({
        		url:"SDicItem/update.asp?dic_code="+dic_code,
        		type:"post",
	    		async:false,
        		data:{"item_code":item_code,
        			"item_name":item_name,
        			"state":item_state,
        			"is_default":item_is_default,
        			"order_id":item_order_id,
        			"memo":item_memo
        		},
        		dataType:"json",
        		success:function(msg){
        			alert("修改成功!");
  					$("#s_dic_tiem_update_Pop").modal("hide");
					$('#table_item')	.bootstrapTable('refresh',{url : "SDicItem/findAllSDicItem.asp?dic_code="+ $("#sdic_code").val()	});
        		}
        	});
        }
	});		
	//关闭
	$("#item_update_close").click(function(){
		onModalCloseEvent("s_dic_tiem_update_Pop");
		$("#s_dic_tiem_update_Pop").modal("hide");
	});	
}