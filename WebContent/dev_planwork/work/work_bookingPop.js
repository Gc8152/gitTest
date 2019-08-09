	//审批通过
	$("#taskPassThough").click(function(){
		var id = $("#pop_workBookingTable").bootstrapTable('getSelections');
		if(id.length<1){
			alert("请至少选择一条数据!");
			return ;
		}
		var ids = $.map(id, function (row) {
			return row.PLAN_ID;                    
		});
//		alert(ids.toString());
		var call = getMillisecond();
		baseAjaxJsonp(dev_planwork + 'workCon/taskApproval.asp?call=' + call+ '&SID=' + SID, {ids:ids.toString(),status:'02'},//02审批通过操作
			function(msg) {
			if(msg.result){
				alert("已经审批通过！");
			 }
			}, call);
	});
	
	//审批打回
	$("#taskBeatBack").click(function(){
		var id = $("#pop_workBookingTable").bootstrapTable('getSelections');
		if(id.length<1){
			alert("请至少选择一条数据!");
			return ;
		}
		var ids = $.map(id, function (row) {
			return row.PLAN_ID;                    
		});
//		alert(ids.toString());
		var call = getMillisecond();
		baseAjaxJsonp(dev_planwork + 'workCon/taskApproval.asp?call=' + call+ '&SID=' + SID, {ids:ids.toString(),status:'03'},//03审批打回操作
			function(msg) {
			if(msg.result){
				alert("已经审批打回！");
			 }
			}, call);
	});
	
	
var pcall = getMillisecond();
function openWorkBookingPop(id,callparams){
	$('#myModal_user').remove();
	getCurrentPageObj().find("#"+id).load("dev_planwork/work/work_bookingPop.html",{},function(){
		$("#myModal_user").modal("show");
		// 获取表格和查询参数
		var url = dev_planwork + 'workCon/queryDSPTaskList.asp?call=' + pcall+ '&SID=' + SID;
		workBookingPop("#pop_workBookingTable",url,callparams);
	});
}

/**
	 * 用户POP框
	 */
	function workBookingPop(userTable,userUrl,userParam){
		var queryParams=function(params){
			var temp={
					limit: params.limit, //页面大小
					offset: params.offset, //页码
					project_id:userParam.projectid//项目主键
			};
			return temp;
		};	
		var columns=[{
	     			field : 'middle',
	     			checkbox : true,
	     			rowspan : 2,
	     			align : 'center',
	     			valign : 'middle'
	     		  }, {
	     			  field:"PLAN_ID",
		         	  title: '计划主键',
		         	  align:"center",
		         	  visible:false
	               }, {
		           	  field: 'DUTY_MAN',
		         	  title: '工号',
		         	  align:"center",
		         	  width:"260"
			       },{
		         	  field: 'USER_NAME',
		         	  title: '姓名',
		         	  align:"center",
		         	  width:"240"
		           },{
		         	  field: 'PROJECT_NAME',
		         	  title: '项目名称 ',
		         	  align:"center",
		         	  width:"250"
		           },{
		         	  field: 'PLAN_NAME',
		         	  title: '任务名称 ',
		         	  align:"center",
		         	  width:"250"
		           },{
		         	  field: 'TOTAL',
		         	  title: '工作量（工时）',
		         	  align:"center",
		         	  width:"240"
		           }/*,{
		         	  field: 'PRENODEMAN',
		         	  title: '报工详情',
		         	  align:"center"
		           } */ ];
		
		//查询所有用户POP框
		$(userTable).bootstrapTable("destroy").bootstrapTable({
					//请求后台的URL（*）
					url : userUrl,
					method : 'get', //请求方式（*）   
					striped : true, //是否显示行间隔色
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
					uniqueId : "user_no", //每一行的唯一标识，一般为主键列
					cardView : false, //是否显示详细视图
					detailView : false, //是否显示父子表
					jsonpCallback : pcall,
					//singleSelect: singleSelect,
					onDblClickRow:function(row){
						/*if(singleSelect){
						$('#myModal_user').modal('hide');
						if(userParam.type=="appendPersons"){
							if(userParam.name.val()==""){
								userParam.name.val(row.USER_NAME);
								userParam.no.val(row.USER_NO);											
							}else{
								var codes = userParam.no.val();
								var code = codes.split(",");
								for(var i=0;i<code.length;i++){
									if(code[i]==row.USER_NO){alert("参会人员不可重复选择");return;}
								}
								var placeholder=userParam.name.attr("placeholder");
								if(userParam.name.val()==placeholder){
									userParam.name.val("");
								}
								var names = userParam.name.val();
								if($.trim(names)==""){
									userParam.name.val(row.USER_NAME);
									userParam.no.val(row.USER_NO);
								}else{
									userParam.name.val(names+","+row.USER_NAME);
									userParam.no.val(codes+","+row.USER_NO);
								}
							}
						}else{
							userParam.name.val(row.USER_NAME);
							userParam.no.val(row.USER_NO);			
							userParam.dept.val(row.ORG_NO);		
						}*/
						//根据用户编号查询关联角色
					/*	if(userParam.role=="auth"){
					        $.ajax({
						           url:"SRole/findAllRoleById.asp",
						           type:"post",
						           async: false,
						           data:{"user_no":row.USER_NO},
						           dataType:"json",
						           success:function(msg){
						        	   userParam.cascade.role_no.text("");
						        	   userParam.cascade.role_no.append("<option value=''  selected>-- 请选择 --</option>");
						        	   for(var i=0;i<msg.total;i++){
						        		   if(msg.rows[i].ROLE_NAME==undefined)break;
						        		   var option = "<option value="+msg.rows[i].ROLE_NO+">"+msg.rows[i].ROLE_NAME+"</option>";
						        		   userParam.cascade.role_no.append(option);
						        	   }
						        	   userParam.cascade.role_no.select2();
						           }
						      });
						}*/
						//根据用户编号查询关联机构 
						/*if(userParam.role=="auth"){
					        $.ajax({
						           url:"SOrg/findAllOrgById.asp",
						           type:"post",
						           async: false,
						           data:{"user_no":row.USER_NO},
						           dataType:"json",
						           success:function(msg){
						        	   userParam.cascade.org_no.text("");
						        	   userParam.cascade.org_no.append("<option value=''  selected>-- 请选择 --</option>");
						        	   for(var i=0;i<msg.total;i++){
						        		   if(msg.rows[i].ORG_NAME==undefined)return;
						        		   var option = "<option value="+msg.rows[i].ORG_CODE+">"+msg.rows[i].ORG_NAME+"</option>";
						        		   userParam.cascade.org_no.append(option);
						        	   }
						        	   userParam.cascade.org_no.select2();
						           }
						      });
						}
						}*/
					},
					 columns : columns,
					 onClickRow:function(rowIndex,rowData){
			        	 // $("#taskDetailsPOP").load("dev_planwork/work/taskDetailsPOP.html");
						// $("#myModal_user").modal("hide");
			        	  openTaskDetailsPop("taskDetailsPOP",{w_id:rowIndex.PLAN_ID,staff_id:rowIndex.DUTY_MAN});
			          }
				});
		
	}