//用户字典项管理权限
var dicperm="";
//查询，清空
searchAndReset();
//根据权限初始化操作按钮
initOptButton();

//所属菜单
menuSdic();
function initSdic(role){
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
	//初始化查询所有
	$('#table_sdic').bootstrapTable("destroy").bootstrapTable({
	    url: "SDic/findAllSDic.asp?role="+role,       //请求后台的URL（*） 
	    method: 'get',			    //请求方式（*）   
	    striped: false,              //是否显示行间隔色
	    cache: false,               //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
	    pagination: true,           //是否显示分页（*）
	    sortable: false,            //是否启用排序
	    sortOrder: "asc",           //排序方式
	    queryParams: queryParams,            //传递参数（*）
	    sidePagination: "server",   //分页方式：client客户端分页，server服务端分页（*）
	    pageNumber:1,               //初始化加载第一页，默认第一页
	    pageSize: 10,               //每页的记录行数（*）
	    pageList: [5,10],           //可供选择的每页的行数（*）
	    strictSearch: false,
	    clickToSelect: true,        //是否启用点击选中行
	    uniqueId: "DIC_CODE",             //每一行的唯一标识，一般为主键列
	    cardView: false,            //是否显示详细视图
	    detailView: false,          //是否显示父子表
		singleSelect: true,
		radio:true, 
	    columns: [{
			field: 'state',
			checkbox: true,
			rowspan: 2,
			align: 'center',
			valign: 'middle'
	    },{
			field: 'DIC_CODE',
			title: '类别编码' 
	    },{
	        field: 'DIC_NAME',
	        title: '类别名称'
	    },{
	        field: 'STATE',
	        title: '状态',
		    formatter:function(value,row,index){if(value=="00"){return "启用";}return "停用";}
	    },{
	        field: 'MEMO',
	        title: '说明'
	    },{
	        field: 'MENU_NAME',
	        title: '所属菜单'
	    },{
	        field: 'MANAGER_ROLE',
	        title: '管理角色'
	    }]
	});		
	//状态下拉框
	initSelect($("#dic_state"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"S_DIC_OC"});		
}
function searchAndReset(){
	 //重置查询
 	$("#dic_search").click(function(){
		var dic_code_search = ($("#dic_code").val()||"");
		var dic_name_search = ($("#dic_name").val()||"");
		var dic_state_search = ($.trim($("#dic_state").val())||"");
		var menu_no = $("#dic_query_menucode").val();
		var manager_role = ($.trim($("#manager_role").val())||"");
		$('#table_sdic').bootstrapTable('refresh',{url:'SDic/findAllSDic.asp?role='+dicperm+'&dic_code='+dic_code_search+"&dic_name="+escape(encodeURIComponent(dic_name_search))+"&state="+dic_state_search+"&menu_no="+menu_no+"&manager_role="+manager_role});
	});
 	enterEventRegister(getCurrentPageObj().attr("class"), function(){getCurrentPageObj().find("#dic_search").click();});
 	//清空
	$("#dic_reset").click(function(){
		$("#dic_code").val("");
		$("#dic_name").val("");
		$("#dic_state").val(" ");
		$("#manager_role").val(" ");
		$("#dic_state").select2();
		$("#manager_role").select2();
		$("#dic_query_menucode").val("");
		$("#dic_query_menuname").val("");
	});		
}

function deleteSdic(){
	//删除表格中的一条数据
	$("#del_sdic").click(function(){
		var id = $("#table_sdic").bootstrapTable('getSelections');
		var ids = $.map(id, function (row) {
			return row.DIC_CODE;                    
			});
		if(id.length!=1){
			alert("请选择一条数据进行停用!");
			return ;
		}
		nconfirm("是否停用?",function(){
			var url="SDic/delete.asp?dic_code="+ids;
			$.ajax({
				type : "post",
				url : url,
				async :  true,
				data : "",
				dataType : "json",
				success : function(msg) {
					alert("停用成功！");
					$('#table_sdic').bootstrapTable('refresh',{url:'SDic/findAllSDic.asp?role='+dicperm});
				},
				error : function() {	
					alert("停用失败！");
				}
			});
		});
	});
}

function menuSdic(){
	//所属菜单
	$("#dic_query_menuname").click(function(){
		openSelectTreeDivToBody($(this),"dicquery_menutree_id","SMenu/queryAllmenu.asp",30,function(node){
			$("#dic_query_menuname").val(node.name);
			$("#dic_query_menucode").val(node.id);
		});
	});
	$("#dic_query_menuname").focus(function(){
		$("#dic_query_menuname").click();
	});	
	//初始化角色下拉框
	baseAjax('SRole/querySrole.asp',null,function(data){
		var obj=getCurrentPageObj().find("#manager_role");
		if(obj!=undefined&&data!=undefined){
			obj.empty();
			obj.append('<option value=" ">请选择</option>');
			for(var i=0;i<data.srole.length;i++){
				obj.append('<option value="'+data.srole[i].ROLE_NO+'">'+data.srole[i].ROLE_NAME+'</option>');	
			}
			obj.select2();
		};
	});
}

function initOptButton(){
	baseAjax("SUser/queryDicPerm.asp", null,function(data){
		dicperm=data.dicperm;
		if(dicperm=="admin"){
			$("#opt_button").append("<button class='btn btn-ecitic' id='add_sdic' onclick=\"pageDispatch_sdic_add(this,'sdic_add')\">创建</button><button class='btn btn-ecitic' id='update_sdic' onclick=\"pageDispatch_sdic_update(this,'sdic_update')\">修改</button><button class='btn btn-ecitic' id='del_sdic'>停用</button>");
		}
	    $("#opt_button").append("<button class='btn btn-ecitic' id='s_dic_item' onclick=\"pageDispatch_sdicitem(this,'sdic_item')\">字典项配置</button>");
	  //初始化
	    initSdic(dicperm);
	  //删除
	    deleteSdic();
	});
}
