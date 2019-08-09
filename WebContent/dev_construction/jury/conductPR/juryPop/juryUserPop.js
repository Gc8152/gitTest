var juryUserCall = getMillisecond();
function openJuryUserPop(id,callparams){
	
	getCurrentPageObj().find('#myModal_juryUser').remove();
	getCurrentPageObj().find("#"+id).load("dev_construction/jury/conductPR/juryPop/juryUserPop.html",{},function(){
		getCurrentPageObj().find("#myModal_juryUser").modal("show");
		//autoInitSelect($("#pop_juryUserState"));
		var taskCall = getMillisecond();
		JuryUserPop("#pop_juryUserTable",dev_construction+'GJury/popFindAllJuryUser.asp?call='+juryUserCall+'&SID='+SID,callparams,juryUserCall);
		
		
		initJuryUserEvent(function(node){
			if(callparams.name){
				callparams.name.data("node",node);
			}
		});
		
		//JuryUserPop("#pop_juryUserTable",dev_construction+'GJury/queryJuryUserList.asp?SID='+SID,callparams);
	});
}

function initJuryUserEvent(callback){
	getCurrentPageObj().find("#user_pop_org_name").unbind("click");//user_pop_org_code
	getCurrentPageObj().find("#user_pop_org_name").click(function(){
		openSelectTreeDiv($(this),"userPop_jury_id","SOrg/queryorgtreelist.asp",{"margin-left":"130px",width:'180px'},function(node){
			getCurrentPageObj().find("#user_pop_org_name").val(node.name);
			getCurrentPageObj().find("#user_pop_org_code").val(node.id);
			if(callback){
				callback(node);
			}
		});
	});
	getCurrentPageObj().find("#user_pop_org_name").focus(function(){
		getCurrentPageObj().find("#user_pop_org_name").click();
	});
}

/**
	 * 用户POP框
	 */
	function JuryUserPop(juryUserTable,taskUrl,taskParam,juryUserCall){
		var singleSelect=true;
		if(taskParam.singleSelect==false){
			singleSelect=false;
		}
		//查询所有用户POP框
		getCurrentPageObj().find(juryUserTable).bootstrapTable("destroy").bootstrapTable({
					//请求后台的URL（*）
					url : taskUrl,
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
					uniqueId : "USER_NO", //每一行的唯一标识，一般为主键列
					cardView : false, //是否显示详细视图
					detailView : false, //是否显示父子表
					jsonpCallback:juryUserCall,
					singleSelect: singleSelect,
					onDblClickRow:function(row){
						getCurrentPageObj().find('#myModal_juryUser').modal('hide');
						var records_old = getCurrentPageObj().find("#juryUsertable").bootstrapTable('getData');
						
							var flag = true;
							$.map(records_old, function (row2) {
								if(row.USER_NO==row2.USER_NO)
									flag=false;
							})
							if(flag)
							addUserTaks(taskParam.table_id,row);
						
					},
					columns :[ 
					            {
									field: 'middle',
									checkbox: true,
									rowspan: 2,
									align: 'center',
									valign: 'middle',
								}, {
									field : "USER_NAME",
									title : "用户名称",
									align : "center"
								}, {
									field : "GRADE_NAME",
									title : "评委级别",
									align : "center",
									 formatter:function(value,row,index){
										 if(value=="" || value==undefined) 
											 return "列席";
										 else
											 return value;
									 }
								}, {
									field : "IS_BANKER",
									title : "是否行员",
									align : "center",
									 formatter:function(value,row,index){if(value=="00"){return "是";}return "否";}
								}, {
									field : "ORG_NO_NAME",
									title : "所属部门",
									align : "center"
								}, {
									field : "USER_MAIL",
									title : "用户邮箱",
									align : "center"
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
		getCurrentPageObj().find("#pop_juryUserSave").click(function(){
			var records = getCurrentPageObj().find(juryUserTable).bootstrapTable('getSelections');
			var records_old = getCurrentPageObj().find("#juryUsertable").bootstrapTable('getData');
			var USER_NO = $.map(records, function (row) {
				var flag = true;
				$.map(records_old, function (row2) {
					if(row.USER_NO==row2.USER_NO)
						flag=false;
				})
				if(flag)
				addUserTaks(taskParam.table_id,row);
			});
			
			getCurrentPageObj().find("#myModal_juryUser").modal("hide");
		});
		
		//获取选中记录的所有节点名称
		getCurrentPageObj().find("#pop_juryUserSave2").click(function(){
			var records = getCurrentPageObj().find(juryUserTable).bootstrapTable('getSelections');

			var USER_NO = $.map(records, function (row) {
				var GRADE_NAME = row.GRADE_NAME;
				if(row.GRADE_NAME==null||row.GRADE_NAME==""||row.GRADE_NAME==undefined)
					GRADE_NAME = "听众";
				
				var IS_BANKER_NAME = row.IS_BANKER;
				if(row.IS_BANKER=='00') IS_BANKER_NAME = "是";
				else IS_BANKER_NAME = "否";
				var trHtml="<tr id='row"+row.USER_NO+"' align='center'><td>" +
						"<div class='form-control2' ><input name='jury_user' value='"+row.USER_NO+"' type='checkbox'/></div>" +
						"</td><td style='text-align: center; '>"+row.USER_NAME+
						/*"</td><td style='text-align: center; '>"+GRADE_NAME+ */
						"</td><td style='text-align: center; '><select id='jury_role"+row.USER_NO+"' style='width:150px'></select>" +
						"</td><td style='text-align: center; '>"+row.ORG_NO_NAME+
						"</td><td style='text-align: center; '>"+IS_BANKER_NAME+"</td></tr>"; 

			    var flag = true;
				 var chobj= getCurrentPageObj().find("input[name='jury_user']:checkbox"); 
			     var delid="";//删除的ID  
			     chobj.each(function(){  
					if(row.USER_NO == $(this).val()){
						flag=false;
					}
			     });
			     if(flag){
			    	var $tr=getCurrentPageObj().find("#"+taskParam.table_id+" tr").eq("-1"); 
					$tr.after(trHtml);  
					initSelect(getCurrentPageObj().find("#"+"jury_role"+row.USER_NO),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_REVIEWER_GRADE"});
			     }
			    //初始化评委级别
			    
				return row.USER_NO;                  
			});
			
			
			
			if(getCurrentPageObj().find("#pop_juryUserTable input[type='checkbox']").is(':checked')){
				getCurrentPageObj().find("#myModal_juryUser").modal("hide");
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
		getCurrentPageObj().find("#pop_juryUserReset").click(function(){
			//alert("dd");
			getCurrentPageObj().find(".form-inline input").each(function(){
				$(this).val("");
			});
			getCurrentPageObj().find("#pop_juryUserState").val(" ");
			getCurrentPageObj().find("#pop_juryUserState").select2();
		});
		//多条件查询用户
		getCurrentPageObj().find("#pop_juryUserSearch").click(function(){
			var PopUserName = getCurrentPageObj().find("#pop_username").val();
			//var PopUserNo =  getCurrentPageObj().find("#pop_userCode").val();
			var PopUserLoginName = getCurrentPageObj().find("#pop_userLoginName").val();
			var PopUserState =  $.trim($("#pop_userState").val());
			var sorg_code =  $.trim($("#user_pop_org_code").val());
			getCurrentPageObj().find(juryUserTable).bootstrapTable('refresh',{url:taskUrl+"&PopUserName="+escape(encodeURIComponent(PopUserName))+"&PopUserLoginName="+PopUserLoginName+"&PopUserState="+PopUserState+"&org_code="+sorg_code});
			//$(juryUserTable).bootstrapTable('refresh',	{url:dev_construction+"GJury/popFindAllJuryUser.asp?call="+juryUserCall+"&SID="+SID+"&PopTaskName="+escape(encodeURIComponent(PopTaskName))+"&PopTaskNo="+PopTaskNo+"&PopTaskState="+PopTaskState});
		});
		enterEventRegister("popModelQueryLevel1", function(){getCurrentPageObj().find("#pop_juryUserSearch").click();});
	}