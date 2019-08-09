
function openRolePop(id,callparams,flag){
	if(flag){
		if(flag=="" || flag==null || flag==undefined)
			flag = true;
	}
	getCurrentPageObj().find('#myModal_role').remove();
	getCurrentPageObj().find("#"+id).load("pages/srole/srolePop.html",{},function(){
		getCurrentPageObj().find("#myModal_role").modal("show");
		autoInitSelect(getCurrentPageObj().find("#pop_roleState"));
		rolePop("#pop_roleTable","SRole/findAllRoleById.asp",callparams,flag);
	});
}





/**
	 * 用户POP框
	 */
	function rolePop(roleTable,roleUrl,roleParam,flag){
		//查询所有用户POP框
		getCurrentPageObj().find(roleTable).bootstrapTable("destroy").bootstrapTable({
					//请求后台的URL（*）
					url : roleUrl,
					method : 'get', //请求方式（*）   
					striped : false, //是否显示行间隔色
					cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
					sortable : true, //是否启用排序
					sortOrder : "asc", //排序方式
					queryParams : queryParams,//传递参数（*）
					sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
					pagination : true, //是否显示分页（*）
					pageList : [5,10,15],//每页的记录行数（*）
					pageNumber : 1, //初始化加载第一页，默认第一页
					pageSize : 5,//可供选择的每页的行数（*）
					clickToSelect : true, //是否启用点击选中行
					uniqueId : "ROLE_NO", //每一行的唯一标识，一般为主键列
					cardView : false, //是否显示详细视图
					detailView : false, //是否显示父子表
					singleSelect: flag,
					recallSelect:true,
					onDblClickRow:function(row){
						getCurrentPageObj().find('#myModal_role').modal('hide');
						roleParam.name.val(row.ROLE_NAME);
						roleParam.no.val(row.ROLE_NO);
					},
					columns :[
						{	
							//radio:true,
							checkbox:true,
							rowspan: 2,
							align: 'center',
							valign: 'middle'
						},{
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
				            align:"center",
							formatter:function(value,row,index){if(value=="00"){return "启用";}return "停用";}
				        }, {
				        	field:"UPDATE_NO",
				        	title:"修改人",
				            align:"center"
				        }, {
				        	field:"UPDATE_TIME",
				        	title:"修改时间",
				            align:"center"
				        }]
				});
		var queryParams=function(params){
			var temp={
					limit: params.limit, //页面大小
					offset: params.offset, //页码
			};
			return temp;
		};		
		//获取选中节点数据
		
		//获取选中记录的所有节点名称
		getCurrentPageObj().find("#pop_roleSave").click(function(){
			var records = getCurrentPageObj().find(roleTable).bootstrapTable('getRecallSelections');
			var role_nos = "";
			var role_names = "";
			var role_no = $.map(records, function (row) {
				if(role_nos == ""){
					role_nos = row.ROLE_NO;
					role_names = row.ROLE_NAME;
				}else{
					role_nos = role_nos +","+row.ROLE_NO;
					role_names = role_names+","+row.ROLE_NAME;
				}
				return row.ROLE_NO;                  
			});

			if(getCurrentPageObj().find("#pop_roleTable input[type='checkbox']").is(':checked')){
				roleParam.name.val(role_names);
				roleParam.no.val(role_nos);
				getCurrentPageObj().find("#myModal_role").modal("hide");
			}else{
		        $.Zebra_Dialog('请选择一条或多条记录进行添加!', {
		            'type':     'close',
		            'title':    '提示',
		            'buttons':  ['是'],
		            'onClose':  function(caption) {
		            	if(caption=="是"){
		            	}
		            }
		        });
			}
		});
		
		//用户POP重置
		getCurrentPageObj().find("#pop_roleReset").click(function(){
			getCurrentPageObj().find("#role_query input").each(function(){
				$(this).val("");
			});
			getCurrentPageObj().find("#pop_roleState").val(" ");
			getCurrentPageObj().find("#pop_roleState").select2();
		});
		//多条件查询用户
		getCurrentPageObj().find("#pop_roleSearch").click(function(){
			var currtab=getCurrentPageObj();
			var PopRoleName = getCurrentPageObj().find("#pop_roleName").val()==currtab.find("#pop_roleName").attr("placeholder")?"":currtab.find("#pop_roleName").val();
			var PopRoleNo =  getCurrentPageObj().find("#pop_roleNo").val()==currtab.find("#pop_roleNo").attr("placeholder")?"":currtab.find("#pop_roleNo").val();
			var PopRoleState =  $.trim(getCurrentPageObj().find("#pop_roleState").val());
			getCurrentPageObj().find(roleTable).bootstrapTable('refresh',	{url:"SRole/findAllRoleById.asp?PopRoleName="+escape(encodeURIComponent(PopRoleName))+"&PopRoleNo="+PopRoleNo+"&PopRoleState="+PopRoleState});
		});
	}