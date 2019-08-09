//查询所有
$('#table_authorize').bootstrapTable({
    url: "SAuthorize/findAll.asp",       //请求后台的URL（*） 
    method: 'get',			    //请求方式（*）   
    striped: true,              //是否显示行间隔色
    cache: false,               //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
    pagination: true,           //是否显示分页（*）
    sortable: false,            //是否启用排序
    sortOrder: "asc",           //排序方式
    queryParams: queryParams,            //传递参数（*）
    sidePagination: "server",   //分页方式：client客户端分页，server服务端分页（*）
    pageNumber:1,               //初始化加载第一页，默认第一页
    pageSize: 5,               //每页的记录行数（*）
    pageList: [5,10],           //可供选择的每页的行数（*）
    strictSearch: false,
    clickToSelect: true,        //是否启用点击选中行
    uniqueId: "id",             //每一行的唯一标识，一般为主键列
	singleSelect: true,
	radio:true, 
    cardView: false,            //是否显示详细视图
    detailView: false,          //是否显示父子表
    columns: [
     {
    	    field: 'state',
    	    checkbox: true,
    	    rowspan: 2,
    	    align: 'center',
    	    valign: 'middle'
     },
	{
      field: 'ID',
      title: '序号'
    }, {
      field: 'AUTH_NAME',
      title: '授权人' 
    }, {
      field: 'BAUTH_NAME',
      title: '被授权人'
    }, {
       field: 'ROLE_NAME',
       title: '授权角色'
    }, {
        field: 'ORG_NAME',
        title: '授权机构'
    } , {
        field: 'AUTH_TYPE',
        title: '授权类型',
   	 	formatter:function(value,row,index){if(value=="1"){return "复制";}return "授权";}
     },{
        field: 'QUERY_OP',//授权状态
        title: '查询权限',
	 	formatter:function(value,row,index){if(value=="0"){return "是";}return "否";}
     } ,{
         field: 'OPTION_OP',//授权状态
         title: '操作权限',
 	 	formatter:function(value,row,index){if(value=="0"){return "是";}return "否";}
      } ,{
          field: 'APPROVE_OP',//授权状态
          title: '审批权限',
          formatter:function(value,row,index){if(value=="0"){return "是";}return "否";}
       } , {
        field: 'START_TIME',
        title: '开始时间'
     }, {
     field: 'END_TIME',
     title: '结束时间'
      }]
  });
	var queryParams=function(params){
		if(params==null||params==undefined){
			return {
				limit: 5,offset: 1
			};
		}
		return {
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
};
//	加载下拉框
appendSelect($("#auth_type"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"1"});
appendSelect($("#option_op"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"2"});


 //重置查询
$("#Authorize_search").click(function(){
	var  auth_name = $("#auth_name").val();
	var  bauth_name = $("#bauth_name").val();
	var  role_name = $("#role_name").val();
	var  org_name = $("#org_name").val();
	var  auth_type = $("#auth_type").val();
	if($("#option_op").val()==""){
		$('#table_authorize').bootstrapTable('refresh',{url:'SAuthorize/findAll.asp?'+
			'auth_name='+escape(encodeURIComponent(auth_name))+"&bauth_name="+escape(encodeURIComponent(bauth_name))+"&role_name="+escape(encodeURIComponent(role_name))+"&org_name="+escape(encodeURIComponent(org_name))+"&auth_type="+auth_type});			
	}
	if($("#option_op option:selected").text()=="查询"){
		$('#table_authorize').bootstrapTable('refresh',{url:'SAuthorize/findAll.asp?'+
			'auth_name='+escape(encodeURIComponent(auth_name))+"&bauth_name="+escape(encodeURIComponent(bauth_name))+"&role_name="+escape(encodeURIComponent(role_name))+"&org_name="+escape(encodeURIComponent(org_name))+"&auth_type="+auth_type+"&query_op="+0});
	}
	if($("#option_op option:selected").text()=="审批"){
		$('#table_authorize').bootstrapTable('refresh',{url:'SAuthorize/findAll.asp?'+
			'auth_name='+escape(encodeURIComponent(auth_name))+"&bauth_name="+escape(encodeURIComponent(bauth_name))+"&role_name="+escape(encodeURIComponent(role_name))+"&org_name="+escape(encodeURIComponent(org_name))+"&auth_type="+auth_type+"&approve_op="+0});
	}
	if($("#option_op option:selected").text()=="变更"){
		$('#table_authorize').bootstrapTable('refresh',{url:'SAuthorize/findAll.asp?'+
			'auth_name='+escape(encodeURIComponent(auth_name))+"&bauth_name="+escape(encodeURIComponent(bauth_name))+"&role_name="+escape(encodeURIComponent(role_name))+"&org_name="+escape(encodeURIComponent(org_name))+"&auth_type="+auth_type+"&option_op="+0});
	}		
});
//清空
$("#Authorize_reset").click(function(){
	$("#auth_name").val("");
	$("#bauth_name").val("");
	$("#role_name").val("");
	$("#org_name").val("");
	$("#auth_type").val("");
	$("#option_op").val("");
	$("#auth_type").select2();
	$("#option_op").select2();
});
 //删除表格中的一条数据
$("#del_authorize").click(function(){
	nconfirm("是否删除?",function(){
		var id = $("#table_authorize").bootstrapTable('getSelections');
		var ids = $.map(id, function (row) {
			return row.ID;                    
			});
		if(id.length!=1){
			alert("请选择一条数据进行修改!");
			return ;
		}
		var url="SAuthorize/delete.asp?id="+ids;
		$.ajax({
			type : "post",
			url : url,
			async :  true,
			data : "",
			dataType : "json",
			success : function(msg) {
				alert("删除成功！");
				$('#table_authorize').bootstrapTable('refresh',{url:'SAuthorize/findAll.asp?'});
			},
			error : function() {	
				alert("删除失败！");
			}
		});	
	});
});

//授权人模态框
$("#auth_name").click(function(){
	openUserPop("userDivAuthorize",{name:$("#auth_name"),no:$("#auth_no")});
});
//被授权人模态框
$("#bauth_name").click(function(){
	openUserPop("userDivAuthorize",{name:$("#bauth_name"),no:$("#bauth_no")});
});
//授权角色模态框
$("#role_name").click(function(){
	openRolePop("roleDivAuthorize",{name:$("#role_name"),no:$("#role_no")});
});
//授权机构模态框
$("#org_name").click(function(){
	openSOrgPop("orgDivAuthorize",{name:$("#org_name"),no:$("#org_no")});
});	
