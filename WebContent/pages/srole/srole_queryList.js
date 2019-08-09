/*function pageDispatcher(obj,key,param){	
	var p=param;
	if("sRoleDis"==key){
		$("li.active").attr("class","");
		$(content).empty();
		$(content).load("pages/srole/srole_author.html",{},function(){				
			$("#nowSRole").html(p.role_name+"-"+p.role_no);
		});
		$(obj).attr("class","active");
		return;
	}
}*/
//初始化按钮事件
function initRoleButtonEvent(){
	debugger;
	getCurrentPageObj().find("#sRole_serch").click(function(){
		var role_no=getCurrentPageObj().find("#role_no").val();
		var role_name=getCurrentPageObj().find("#role_name").val();
		getCurrentPageObj().find('#SRoleTableInfo').bootstrapTable('refresh',
				{url:'SRole/findSRoleAll.asp?role_no='+role_no+"&role_name="+escape(encodeURIComponent(role_name))});
	});
	enterEventRegister(getCurrentPageObj().attr("class"), function(){getCurrentPageObj().find("#sRole_serch").click();});
}
//权限设置
getCurrentPageObj().find("#authDis").click(function(){			
	var id = getCurrentPageObj().find("#SRoleTableInfo").bootstrapTable('getSelections');
	var ids = $.map(id, function (row) {return row.ROLE_NO;});
	var role_name=$.map(id, function (row) {return row.ROLE_NAME;});			
	//var params={"role_no":ids,"role_name":role_name};
	if(ids==null||ids==undefined||ids==""){
		alert("请选择一条数据！");			
		return;
	}else{
		closePageTab("auth_srole",function(){
			openInnerPageTab("auth_srole","权限设置","pages/srole/srole_author.html",function(){
				getCurrentPageObj().find("#nowSRole").html(role_name+"-"+ids);
			});	
		});
		//pageDispatcher(this,'sRoleDis',params);
	}
});
//删除
getCurrentPageObj().find("#del").click(function(){
	var id = getCurrentPageObj().find("#SRoleTableInfo").bootstrapTable('getSelections');
	var ids = $.map(id, function (row) {return row.ROLE_NO;});	
	if(ids==null||ids==undefined||ids==""){
		alert("请选择一条数据！");					
		return;
	}else{
		nconfirm("确定要删除该数据吗?",function(){
			deleteSRoleInfo(ids);
			getCurrentPageObj().find("#SRoleTableInfo").bootstrapTable('remove', {
				field: 'ROLE_NO',
				values: ids
			});	
		});
	}
});
//执行删除的方法
function deleteSRoleInfo(param){
	var ids=param;
	var url="SRole/deleteSRole.asp?role_no="+ids;
	$.ajax({
		type : "post",
		url : url,
		async :  true,
		data : "",
		dataType : "json",
		success : function(msg) {
			getCurrentPageObj().find('#SRoleTableInfo').bootstrapTable('refresh',{url:'SRole/findSRoleAll.asp?role_no=&role_name='});
		},
		error : function() {						
		}
	});
}
//修改
getCurrentPageObj().find("#update").click(function(){			
		var id = getCurrentPageObj().find("#SRoleTableInfo").bootstrapTable('getSelections');
		var ids = $.map(id, function (row) {return row.ROLE_NO;});
		if(ids==null||ids==undefined||ids==""){
			alert("请选择一条数据！");				
			return;
		}else{	
			pageDispatchSRole(this,'SRoleUpdate',ids);		
		}
	});
//常用功能配置
getCurrentPageObj().find("#function").click(function(){
	var id = getCurrentPageObj().find("#SRoleTableInfo").bootstrapTable('getSelections');
	if(id.length!=1){
		alert("请选择一条数据进行查看！");
		return;
	} 
	var ids=$.map(id,function(row){
		return row.ROLE_NO;
	});
	closeAndOpenInnerPageTab("function", "常用功能配置", "pages/srole/srole_function.html", function(){
		function_detail(ids);
	});
});

//关联人员操作
getCurrentPageObj().find("#relateUser").click(function(){		
	var seles =getCurrentPageObj().find("#SRoleTableInfo").bootstrapTable('getSelections');
	if(seles.length!=1){
		alert("请选择一条数据进行查看！");
		return;
	} 
	closeAndOpenInnerPageTab("relateUser", "关联人员", "pages/srole/srole_relateUser.html", function(){
		initrelateUserInfo(seles[0]);
	});
});

  //初始化表格
  function initSRoleInfo(){
	  var queryParams=function(params){
			var temp={
					limit: params.limit, //页面大小
					offset: params.offset //页码
			};
			return temp;
		};
	var role_no=getCurrentPageObj().find("#role_no").val();
	var role_name=getCurrentPageObj().find("#role_name").val();
	getCurrentPageObj().find("#SRoleTableInfo").bootstrapTable({
        url: 'SRole/findSRoleAll.asp?role_no='+role_no+"&role_name="+role_name,     //请求后台的URL（*）
        method: 'get',           //请求方式（*）   
        striped: false,           //是否显示行间隔色
        cache: false,            //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）		       
        sortable: true,           //是否启用排序
        sortOrder: "asc",          //排序方式
        queryParams: queryParams,//传递参数（*）
        sidePagination: "server",      //分页方式：client客户端分页，server服务端分页（*）
        pagination: true,          //是否显示分页（*）
        pageList: [5,10,15],    //可供选择的每页的行数（*）
        pageNumber:1,            //初始化加载第一页，默认第一页
        pageSize: 10,            //每页的记录行数（*）		       
        clickToSelect: true,        //是否启用点击选中行
        //height: 460,            //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
        uniqueId: "ROLE_NO",           //每一行的唯一标识，一般为主键列
        cardView: false,          //是否显示详细视图
        detailView: false,          //是否显示父子表	
        singleSelect: true,//复选框单选
        columns: [
		{	
			//radio:true,
			checkbox:true,
			rowspan: 2,
			align: 'center',
			valign: 'middle'
		}, 
		{
          field: 'RN',
          title: '序号',
          align:"center"
        }, {
          field: 'ROLE_NO',
          title: '角色编号',
          align:"center"
        }, {
        	field:"ROLE_NAME",
        	title:"角色名称",
            align:"center"
        }, {
        	field:"FLAG",
        	title:"标记",
            align:"center"
        }, {
        	field:"CREATE_NO",
        	title:"创建人",
            align:"center"
        }, {
        	field:"CREATE_TIME",
        	title:"创建时间",
            align:"center"
        }]
      }); 
};
//实现修改
function updateSRoleOneInfo(){
	var role_no=getCurrentPageObj().find("#role_no_u").val();
	var role_name=getCurrentPageObj().find("#role_name_u").val();
	var flag=getCurrentPageObj().find("#flag").val();
	var order_no=getCurrentPageObj().find("#order_no").val();
	var memo=getCurrentPageObj().find("#memo").val();
	var params={"role_no":role_no,"role_name":role_name,"flag":flag,"memo":memo,"order_no":order_no};
	$.ajax({
		type:"post",
		url:"SRole/updateSRole.asp",
		async:true,
		data:params,
		dataType:"json",
		success:function(success){					
			getCurrentPageObj().find('#SRoleTableInfo').bootstrapTable('refresh',{url:'SRole/findSRoleAll.asp?role_no=&role_name='});
		}
	});		
}
//创建跳转页面
function pageDispatchSRole(obj,key,param){
	var p=param;
	if("SRoleAdd"==key){
		closePageTab("add_srole");
		openInnerPageTab("add_srole","创建角色","pages/srole/srole_add.html");		
		return;
	}else if("SRoleUpdate"==key){
		closePageTab("update_srole");
		openInnerPageTab("update_srole","修改角色信息","pages/srole/srole_update.html",function(){			
			$.ajax({
				type:"post",
				url:"SRole/findSRoleById.asp?role_no="+p,
				async:false,
				data:"",
				dataType:"json",
				success:function(data){
					initSRoleFlag(data.flag);
					for ( var k in data) {
						if(k=='memo'){
							getCurrentPageObj().find("textarea[name='R." + k + "']").val(data[k]);
						}else{
							getCurrentPageObj().find("input[name='R." + k + "']").val(data[k]);
						}
					}					
				}
			});
		});
	}
}
//重置
$("#sRole_reset").click(function() {
	getCurrentPageObj().find("#role_no").val("");
	getCurrentPageObj().find("#role_name").val("");
});
initSRoleInfo();
initRoleButtonEvent();