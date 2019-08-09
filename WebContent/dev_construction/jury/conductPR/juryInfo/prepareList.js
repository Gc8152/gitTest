var juryQuery = getMillisecond();
//初始化按钮事件
function initJuryButtonEvent(){
	getCurrentPageObj().find("#query_user_name").click(function(){ 
		openUserPop("queryDivJury",{name:getCurrentPageObj().find("#query_user_name"),no:getCurrentPageObj().find("#query_user_id")});
	});
	
	//删除
	getCurrentPageObj().find("#jury_delete").click(function(){

		closePageTab("update_jury");
		var id = getCurrentPageObj().find("#juryTableInfo").bootstrapTable('getSelections');
		var ids = $.map(id, function (row) {return row.JURY_ID;});	

		if(ids==null||ids==undefined||ids==""){
			alert("请选择一条数据！");					
			return;
		}else{
			nconfirm("确定要删除该数据吗?",function(){
				deleteGJuryInfo(ids);
				getCurrentPageObj().find("#juryTableInfo").bootstrapTable('remove', {
					field: 'JURY_ID',
					values: ids
				});	
			});
		}
		
	});
	
	//添加页面跳转
	getCurrentPageObj().find("#jury_add").click(function(){
		
		closePageTab("edit_jury");
		closeAndOpenInnerPageTab("edit_jury","添加评委","dev_construction/jury/conductPR/juryInfo/preparePR.html",function(){	
			getCurrentPageObj().find("#jury_sava_type").val("jury_add");
		});
	});

	//修改
	getCurrentPageObj().find("#jury_edit").click(function(){
		findJuryAllInfo("edit_jury","修改评审","jury_edit");
	});
	
	//确定评审人员
	getCurrentPageObj().find("#jury_user_confirm").click(function(){
		findJuryAllInfo("edit_jury","确定评审人员","jury_user_confirm");
	});
	
	//准备评审
	getCurrentPageObj().find("#jury_prepare").click(function(){
		findJuryAllInfo("edit_jury","准备评审","jury_prepare");
	});
	
	//执行评审
	getCurrentPageObj().find("#jury_perform").click(function(){
		findJuryAllInfo("edit_jury","执行评审","jury_perform");
	});
	
	//缺陷跟踪
	getCurrentPageObj().find("#jury_follow").click(function(){
		findJuryAllInfo("edit_jury","缺陷跟踪","jury_follow");
	});
	
	//形成评审结论
	getCurrentPageObj().find("#jury_conclusion").click(function(){
		findJuryAllInfo("edit_jury","形成评审结论","jury_conclusion");
		//closeAndOpenInnerPageTab("zz","xx","dev_construction/jury/conclusion/conclusion.html",function(){});
	});
	
	//评审缺陷审核
	getCurrentPageObj().find("#jury_defect_audit").click(function(){
		findJuryAllInfo("edit_jury","评审缺陷审核","jury_defect_audit");
	});
	
	//查看评审
	getCurrentPageObj().find("#jury_view").click(function(){
		findJuryAllInfo("edit_jury","查看评审","jury_view");
	});
	
	
}

function findJuryAndTaskInfo(params,typeSave){
	var juryJtCall = "jt"+getMillisecond();
	baseAjaxJsonp(dev_construction+'GJury/queryJuryById.asp?call='+juryJtCall+'&SID='+SID,params, function(data) {
		if (data != undefined&&data!=null&&data.result=="true") {
			var juryMap = data.juryMap;
			var resultStr = '00';
			for ( var k in juryMap) {
				var str = juryMap[k];
				k = k.toLowerCase();
				if(str!=null && str != "null" && str!=undefined){
				//getCurrentPageObj().find("div"+).val(str);
				getCurrentPageObj().find("div[name='GI."+k+"']").html(str);
				}
				if(k=="feedback_time"&&typeSave=="jury_prepare"){
					getCurrentPageObj().find("input[name='G."+k+"']").val("");
				}else if(k=="compere_name"&&typeSave=="jury_user_confirm"){
					getCurrentPageObj().find("input[name='G."+k+"']").val("");
				}else{
					getCurrentPageObj().find("input[name='G."+k+"']").val(str);
				}
				getCurrentPageObj().find("textarea[name='G."+k+"']").val(str);
				if(k=="file_id"){
					getCurrentPageObj().find("#file_id").val(str);
				}
				getCurrentPageObj().find("textarea[name='G."+k+"']").val(str);
				
				if(typeSave=="jury_conclusion"||typeSave=="jury_view"){
					getCurrentPageObj().find("#con_"+k).html(str);
				}
				//评审结论
				if(k=="jury_result"){
					resultStr = str;
				}
			}
			getCurrentPageObj().find("input[name='G.jury_sava_type']").val(typeSave);
			var juryTaskList = data.juryTaskList;
			
			if(typeSave=="jury_conclusion"||typeSave=="jury_view"){
				var row = juryTaskList[0];
				getCurrentPageObj().find("#sub_req_name").html(row.SUB_REQ_NAME);
				getCurrentPageObj().find("#sub_req_code").html(row.SUB_REQ_CODE);
				var ids1="";
				var all_jury_task="";
				for(var j=0;j<juryTaskList.length;j++){
					if(ids1==""){
						ids1 = row.P_OWNER;
						all_jury_task = row.REQ_TASK_ID;
					}else{
						ids1 = ids1+","+juryTaskList[j].P_OWNER;
						all_jury_task = all_jury_task+","+juryTaskList[j].REQ_TASK_ID;
					}
					getCurrentPageObj().find("#all_jury_task").val(all_jury_task);
					getCurrentPageObj().find("#task_user_no_all").val(ids1);//督办提醒人id
					
				}
				
			}
			
			getCurrentPageObj().find('#juryTasktable').bootstrapTable("destroy").bootstrapTable({
				  data: juryTaskList,      //请求后台的URL（*）
			      method: 'get',           //请求方式（*）   
			      striped: false,           //是否显示行间隔色
			      sortable: true,           //是否启用排序
			      sortOrder: "asc",          //排序方式
			      sidePagination: "client",      //分页方式：client客户端分页，server服务端分页（*）
			      pagination: true,          //是否显示分页（*）
			      pageList: [5,10,15],    //可供选择的每页的行数（*）
			      pageNumber:1,            //初始化加载第一页，默认第一页
			      pageSize: 5,            //每页的记录行数（*）		       
			      //height: 460,            //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
			      uniqueId: "JURY_ID",           //每一行的唯一标识，一般为主键列
			      cardView: false,          //是否显示详细视图
			      detailView: false,          //是否显示父子表	
			      minimunCountColumns: 2, 
			      onLoadSuccess:function(data){
						gaveInfo();
					},
			      columns: [
					{
			        field: 'REQ_TASK_NAME',
			        title: '任务名称',
			        align:"center",
			      }, {
			    	  field: 'REQ_TASK_CODE',
				      title: '任务编码',
				      align:"center",
			      }, {
			    	  field: 'REQ_TASK_ID',
				      title: '任务ID',
				      align:"center",
				    visible:false
			      }, {
			    	  field: 'SUB_REQ_CODE',
				      title: '需求点编码',
				      align:"center",
			      }, {
			    	  field: 'REQ_TASK_RELATION_NAME',
				      title: '从属关系',
				      align:"center",
				      formatter:function(value,row,index){
				    	  if(row.REQ_TASK_RELATION=='01'){
				    		  $("#req_task_code_aa").val(row.REQ_TASK_CODE);
				    	  }
				    	  
				    	  return value;
				      }
			      }, {
			    	  field: 'SYSTEM_NAME',
				      title: '应用名称',
				      align:"center",
			      }, {
			    	  field: 'opt',
				      title: '查看',
				      align:"center",
	                  formatter: function (value, row, index) { 
	                	  return "<span class='hover-view' onclick='viewJuryTaskDetail(\""+row.REQ_TASK_ID+"\",\""+row.REQ_TASK_CODE+"\",\""+juryMap.REQ_TASK_STATE+"\");'>查看</span>";
	                  }
			      }]
			});
			
			
			getCurrentPageObj().find("#juryUserLi").show();
			var user_visible = false;
			var check_visible = false;
			if(typeSave!="jury_user_confirm"){
				getCurrentPageObj().find("#compereshow2").hide();
				getCurrentPageObj().find("#juryCheckLi").show();
				getCurrentPageObj().find("#juryCheckLiD").show();
				getCurrentPageObj().find("#juryCheckLi").addClass("tabBtn_Bg");
				
			}else{
				
				getCurrentPageObj().find("#juryUserLiD").show();
				getCurrentPageObj().find("#juryUserLi").addClass("tabBtn_Bg");
			}
			
			
			var juryUserList = data.juryUserList;
			if(typeSave!="jury_user_confirm"&&typeSave!="jury_prepare"){
				var USER_NAME = "";
				var ids = "";
				for(var i=0;i<juryUserList.length;i++){
					if(i==0) {
						USER_NAME=juryUserList[i].USER_NAME;
						ids = juryUserList[i].USER_NO;
					}else {
						USER_NAME=USER_NAME+","+juryUserList[i].USER_NAME;
						ids = ids+","+juryUserList[i].USER_NO;
					}
					if(juryUserList[i].IS_FINISH_JURY=="00"&&SID==juryUserList[i].REVIEWER_USER_ID)
						$("#defect_query_info").hide();
				}
				
				$("#jury_user_name_all").html(USER_NAME);
				$("#jury_user_no_all").val(ids);
				if(typeSave=="jury_view")
					autoInitRadio("dic_code=G_DIC_JURY_TASK_RESULT",getCurrentPageObj().find("#jury_result"),"G.jury_result",{labClass:"labelRadio2",type:"update",value:resultStr,"disabled":"true"});
			}else{
				user_visible = typeSave=="jury_user_confirm"?true:false;
				check_visible =typeSave=="jury_prepare"?true:false;
			}
			getCurrentPageObj().find('#juryUsertable').bootstrapTable("destroy").bootstrapTable({
				  data: juryUserList,      //请求后台的URL（*）
			      striped: false,           //是否显示行间隔色
			      sortable: true,           //是否启用排序
			      sortOrder: "asc",          //排序方式
			      sidePagination: "client",      //分页方式：client客户端分页，server服务端分页（*）
			      pagination: true,          //是否显示分页（*）
			      //height: 460,            //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
			      uniqueId: "USER_NO",           //每一行的唯一标识，一般为主键列
			      cardView: false,          //是否显示详细视图
			      detailView: false,          //是否显示父子表	
			      onLoadSuccess:function(data){
						/*gaveInfo();*/
			    	  
			      },
			      columns: [
				  {
			    	  field: 'USER_NAME',
				      title: '用户名',
				      align:"center",
			      }, {
			    	  field: 'ROLE',
				      title: '评审角色',
				      align:"center",
				      formatter:function(value,row,index){
				    	  if(typeSave!="jury_user_confirm")
				    		  return row.GRADE_NAME;
				    	  else
				    		  return "<select id='jury_role"+row.USER_NO+"' value="+row.JURY_ROLE+" name='jury_role"+row.USER_NO+"' diccode='G_DIC_REVIEWER_GRADE' style='width:150px'></select>";
				      }
			      }, {
			    	  field: 'ORG_NO_NAME',
				      title: '所属部门',
				      align:"center",
			      }, {
			    	  field: 'IS_BANKER_NAME',
				      title: '是否行员',
				      align:"center",
				      formatter:function(value,row,index){
				    	  return row.IS_BANKER=='00'?IS_BANKER_NAME = "是":IS_BANKER_NAME = "否";
				      }
			      },{
				        field: 'USER_NO',
				        title: '操作',
				        align:"center",
				        width:"10%",
				        visible:user_visible,
				        formatter:function(value,row,index){
				        	//return "<input name='jury_user' value='"+row.USER_NO+"' type='checkbox'/>";
							return '<span class="hover-view" '+
							'onclick="delUserTask(\'juryUsertable\','+value+')">删除</span>';
						}

				      }]
			});
			
			
			
			var juryCheckList = data.juryCheckList;
			if(juryCheckList.length==0)
				juryCheckList="";
			getCurrentPageObj().find('#juryChecktable').bootstrapTable("destroy").bootstrapTable({
				  data: juryCheckList,      //请求后台的URL（*）
			      striped: false,           //是否显示行间隔色
			      sortable: true,           //是否启用排序
			      sortOrder: "asc",          //排序方式
			      sidePagination: "client",      //分页方式：client客户端分页，server服务端分页（*）
			      pagination: true,          //是否显示分页（*）
			      pageList: [5,10,15],    //可供选择的每页的行数（*）
			      pageNumber:1,            //初始化加载第一页，默认第一页
			      pageSize: 100,            //每页的记录行数（*）		       
			      //height: 460,            //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
			      uniqueId: "CHECK_ID",           //每一行的唯一标识，一般为主键列
			      cardView: false,          //是否显示详细视图
			      detailView: false,          //是否显示父子表	
			      onLoadSuccess:function(data){
						/*gaveInfo();*/
			      },
			      columns: [
					{
			    	  field: 'CHECK_NAME',
				      title: '评审检查项',
				      align:"center",
			      }, {
			    	  field: 'JURY_PRINCIPAL_NAME',
				      title: '评审负责人角色',
				      align:"center",
			      },{
				        field: 'CHECK_ID',
				        title: '操作',
				        align:"center",
				        width:"10%",
				        visible:check_visible,
				        formatter:function(value,row,index){
				        	//return "<input name='jury_user' value='"+row.USER_NO+"' type='checkbox'/>";
							return '<span class="hover-view" '+
							'onclick="delUserTask(\'juryChecktable\','+value+')">删除</span>';
						}

				      }]
			});
			
			autoInitSelect($("#juryUsertable"));
			
			
			getCurrentPageObj().find('#juryUsertable2').bootstrapTable("destroy").bootstrapTable({
				  data: juryUserList,      //请求后台的URL（*）
			      striped: false,           //是否显示行间隔色
			      sortable: true,           //是否启用排序
			      sortOrder: "asc",          //排序方式
			      sidePagination: "client",      //分页方式：client客户端分页，server服务端分页（*）
			      pagination: true,          //是否显示分页（*）
			      pageList: [5,10,15],    //可供选择的每页的行数（*）
			      pageNumber:1,            //初始化加载第一页，默认第一页
			      pageSize: 50,            //每页的记录行数（*）		       
			      //height: 460,            //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
			      uniqueId: "USER_NO",           //每一行的唯一标识，一般为主键列
			      cardView: false,          //是否显示详细视图
			      detailView: false,          //是否显示父子表	
			      onLoadSuccess:function(data){
						/*gaveInfo();*/
			    	  
			      },
			      columns: [
					{
			    	  field: 'USER_NAME',
				      title: '用户名',
				      align:"center",
			      }, {
			    	  field: 'GRADE_NAME',
				      title: '评审角色',
				      align:"center",
				    
			      }, {
			    	  field: 'ORG_NO_NAME',
				      title: '所属部门',
				      align:"center",
			      }, {
			    	  field: 'IS_BANKER_NAME',
				      title: '是否行员',
				      align:"center",
				      formatter:function(value,row,index){
				    	  return row.IS_BANKER=='00'?IS_BANKER_NAME = "是":IS_BANKER_NAME = "否";
				      }
			      },{
			    	  field: 'IS_FINISH_JURY',
				      title: '是否完成评审',
				      align:"center",
				      formatter:function(value,row,index){
				    	  if(value=='00')
				    		  return "是";
				    	  else
				    		  return "否";
				      }
			      }, {
			    	  field: 'FINISH_TIME',
				      title: '完成评审时间',
				      align:"center",
			      }]
			});
		}else{
			alert("查询失败");
		}
	},juryJtCall);
}

//删除一行
function delUserTask(tableid,id) {
	//删除该行
	getCurrentPageObj().find("#"+tableid).bootstrapTable("removeByUniqueId", id);	
	autoInitSelect($("#juryUsertable"));
}

function addUserTaks(id,item){
	getCurrentPageObj().find("#"+id).bootstrapTable("append",item);
	autoInitSelect($("#juryUsertable"));
}

//查找评审基本信息
function findJuryAllInfo(tadId,title,typeSave){
	var id = getCurrentPageObj().find("#juryTableInfo").bootstrapTable('getSelections');
	var ids = $.map(id, function (row) {return row.JURY_ID;});	
	
	
	var params = {};
	if(ids==null||ids==undefined||ids==""){
		alert("请选择一条数据！");				
		return;
	}else{	
		params["jury_id"] = ids[0];
		if(typeSave=="jury_user_confirm"){
			closeAndOpenInnerPageTab(tadId,title,"dev_construction/jury/conductPR/juryInfo/preparePR_user.html",function(){
				findJuryAndTaskInfo(params,typeSave);
				getCurrentPageObj().find("#check_userList").show();
			});
		}else if(typeSave=="jury_prepare"){
			closeAndOpenInnerPageTab(tadId,title,"dev_construction/jury/conductPR/juryInfo/preparePR_user.html",function(){
				findJuryAndTaskInfo(params,typeSave);
				autoInitRadio("dic_code=G_DIC_JURY_TYPE",getCurrentPageObj().find("#jury_type2"),"G.jury_type",{labClass:"labelRadio",type:"update",value:"01"});
				getCurrentPageObj().find("#tr_feedback").show();
				getCurrentPageObj().find("#check_checkList").show();
			});
		}else if(typeSave=="jury_perform"){
			closeAndOpenInnerPageTab(tadId,title,"dev_construction/jury/conductPR/juryInfo/preparePR_user.html",function(){
				findJuryAndTaskInfo(params,typeSave);
				//autoInitRadio("dic_code=G_DIC_JURY_TYPE",getCurrentPageObj().find("#jury_type2"),"G.jury_type",{labClass:"labelRadio",type:"update",value:"01"});
				getCurrentPageObj().find("#tr_feedback2").show();
				getCurrentPageObj().find("#tab_jury_defect").show();  //显示缺陷tab
				getCurrentPageObj().find("#tab_finish_jury").show();
				getCurrentPageObj().find("#jury_save_D").hide(); //隐藏保存，返回选项
				$('#tab_jury_defect a').tab('show');
				$("#defect_follow").hide();
				defectInfo(ids[0]);
			});
		}else if(typeSave=="jury_follow"){
			closeAndOpenInnerPageTab(tadId,title,"dev_construction/jury/conductPR/juryInfo/preparePR_user.html",function(){
				findJuryAndTaskInfo(params,typeSave);
				//autoInitRadio("dic_code=G_DIC_JURY_TYPE",getCurrentPageObj().find("#jury_type2"),"G.jury_type",{labClass:"labelRadio",type:"update",value:"01"});
				getCurrentPageObj().find("#tr_feedback2").show();
				getCurrentPageObj().find("#tab_jury_defect").show();  //显示缺陷tab
				getCurrentPageObj().find("#tab_finish_jury").show();
				getCurrentPageObj().find("#jury_save_D").hide(); //隐藏保存，返回选项
				$('#tab_jury_defect a').tab('show');
				$("#defect_query_info").hide();
				defectInfo(ids[0]);
				
			});
		}else if(typeSave=="jury_conclusion"){
			var juryJtCall = "rt"+getMillisecond();
			closeAndOpenInnerPageTab(tadId,title,"dev_construction/jury/conductPR/juryInfo/preparePR_user.html",function(){
				findJuryAndTaskInfo(params,typeSave);
				//autoInitRadio("dic_code=G_DIC_JURY_TYPE",getCurrentPageObj().find("#jury_type2"),"G.jury_type",{labClass:"labelRadio",type:"update",value:"01"});
				getCurrentPageObj().find("#tr_feedback2").show();
				getCurrentPageObj().find("#tab_jury_defect").show();  //显示缺陷tab
				getCurrentPageObj().find("#tab_finish_jury").show();
				getCurrentPageObj().find("#jury_save_D").hide(); //隐藏保存，返回选项
				
				getCurrentPageObj().find("#tab_jury_conclusion").show();
				getCurrentPageObj().find('#myJuryTab a:last').tab('show');
				getCurrentPageObj().find("#juryEndSubmit").show();
				getCurrentPageObj().find("#defect_query_info").hide();
				getCurrentPageObj().find("#defect_follow").hide();
				getCurrentPageObj().find("#file_show").show();
				getCurrentPageObj().find("#juryEndSubmit").show();
				defectInfo(ids[0]);
				//autoInitRadio("dic_code=G_DIC_JURY_TASK_RESULT",getCurrentPageObj().find("#jury_result"),"G.jury_result",{labClass:"labelRadio2",type:"update",value:resultStr,"disabled":"true"});
				autoInitRadio("dic_code=G_DIC_JURY_TASK_RESULT",getCurrentPageObj().find("#jury_result"),"G.jury_result",{labClass:"labelRadio2",type:"update",value:"01"});
				
				//初始化文件列表
			/*	var tablefile = getCurrentPageObj().find("#table_file");
				getSvnFileList(tablefile, getCurrentPageObj().find("#fileview_modal"), getCurrentPageObj().find("#file_id").val(), "00");
			*/
				
				baseAjaxJsonp(dev_construction+'GJury/queryJuryById.asp?call='+juryJtCall+'&SID='+SID,params, function(data) {
					if (data != undefined&&data!=null&&data.result=="true") {
						var juryMap = data.juryMap;
						var tablefile = getCurrentPageObj().find("#table_file");
						getSvnFileList(tablefile, getCurrentPageObj().find("#fileview_modal"), juryMap["FILE_ID"], "00");
					}
				},juryJtCall);
				
				
			});
		}else if(typeSave=="jury_view"){
			closeAndOpenInnerPageTab(tadId,title,"dev_construction/jury/conductPR/juryInfo/preparePR_user.html",function(){
				findJuryAndTaskInfo(params,typeSave);
				//autoInitRadio("dic_code=G_DIC_JURY_TYPE",getCurrentPageObj().find("#jury_type2"),"G.jury_type",{labClass:"labelRadio",type:"update",value:"01"});

				var juryJtCall = "rt"+getMillisecond();
				getCurrentPageObj().find("#tr_feedback2").show();
				getCurrentPageObj().find("#tab_jury_defect").show();  //显示缺陷tab
				getCurrentPageObj().find("#tab_finish_jury").show();
				getCurrentPageObj().find("#jury_save_D").hide(); //隐藏保存，返回选项
				
				getCurrentPageObj().find("#tab_jury_conclusion").show();
				getCurrentPageObj().find('#myJuryTab a:last').tab('show');
				defectInfo(ids[0]);
				
				getCurrentPageObj().find("#defect_query_info").hide();
				getCurrentPageObj().find("#defect_follow").hide();
				//初始化文件列表
				getCurrentPageObj().find("#up_jury_desc").attr("disabled",true);
				
				baseAjaxJsonp(dev_construction+'GJury/queryJuryById.asp?call='+juryJtCall+'&SID='+SID,params, function(data) {
					if (data != undefined&&data!=null&&data.result=="true") {
						var juryMap = data.juryMap;
						var tablefile = getCurrentPageObj().find("#table_file");
						getSvnFileList(tablefile, getCurrentPageObj().find("#fileview_modal"), juryMap["FILE_ID"], "00");
						
					}
						
				},juryJtCall);
				
			});
		}
	}
}


//执行删除的方法
function deleteGJuryInfo(param){
	var juryCall = getMillisecond();
	var params = {};
	params["expert_id"] = param[0];
	baseAjaxJsonp(dev_construction+'GJury/deleteJury.asp?call='+juryCall+'&SID='+SID,params, function(data) {
		if (data != undefined&&data!=null&&data.result=="true") {
			getCurrentPageObj().find('#juryTableInfo').bootstrapTable('refresh',{url:dev_construction+'GJury/queryJuryList.asp?SID='+SID});
			alert("删除成功");
		}else{
			alert("删除失败");
		}
	},juryCall);
}


//初始化表格
function initSJuryInfo(obj,url,juryQuery){
	//初始化数据,评审级别
	initSelect(getCurrentPageObj().find("#jury_grade"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_JURY_GRADE"});
	//初始化数据,评审方式
	initSelect(getCurrentPageObj().find("#jury_type"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_JURY_TYPE"},"01");

	getCurrentPageObj().find("#sponsor_name").click(function(){ 
		openUserPop("queryDivExpert",{name:getCurrentPageObj().find("#sponsor_name"),no:getCurrentPageObj().find("#sponsor_id")});
	});
	
	getCurrentPageObj().find("#jury_principal_name").click(function(){ 
		openUserPop("queryDivExpert",{name:getCurrentPageObj().find("#jury_principal_name"),no:getCurrentPageObj().find("#jury_principal_id")});
	});
	//加载应用pop
	getCurrentPageObj().find('#system_name').click(function(){
		openTaskSystemPop("queryDivExpert",{sysno:getCurrentPageObj().find("#system_id"),sysname:getCurrentPageObj().find("#system_name")});
	});
	//初始化数据,评审级别
	initSelect(getCurrentPageObj().find("#at_jury_grade"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_JURY_GRADE"});
	//初始化数据,评审方式
	initSelect(getCurrentPageObj().find("#jury_type"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_JURY_TYPE"});
	//初始化数据,状态
	//initSelect(getCurrentPageObj().find("#jury_state"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_JURY_STATUS"});

	obj.bootstrapTable("destroy").bootstrapTable({
      url: url,     //请求后台的URL（*）
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
      uniqueId: "JURY_ID",           //每一行的唯一标识，一般为主键列
      cardView: false,          //是否显示详细视图
      detailView: false,          //是否显示父子表	
      jsonpCallback:juryQuery,
      singleSelect: true,//复选框单选
      onLoadSuccess:function(data){
			gaveInfo();
		},
      columns: [
		{	
			//radio:true,
			checkbox:true,
			rowspan: 2,
			align: 'center',
			valign: 'middle'
		}, 
		{
        field: 'ROW_NUM',
        title: '序号',
        align:"center",
        width:'5%'
      }, {
        field: 'JURY_ID',
        title: 'ID',
        align:"center",
        visible:false
      }, {
	      field: 'JURY_NAME',
	      title: '评审名称',
	      align:"center",
	      width:'14%'
      }, {
        field: 'SYSTEM_NAME',
        title: '应用名称',
        align:"center",
        width:'12%'
      }, {
           field: 'AT_GRADE_NAME',
           title: '评审级别',
           align:"center",
           width:'8%'
       },{
      	  field:"JURY_STATUS_NAME",
      	  title:"评审状态",
          align:"center",
          width:'10%'
      },{
      	field:"SPONSOR_NAME",
      	title:"发起人",
          align:"center",
          width:'7%'
      },{
    	field:"JURY_PRINCIPAL_NAME",
      	title:"负责人",
          align:"center",
          width:'7%'
      },{
    	field:"COMPERE_NAME",
      	title:"主持人",
          align:"center",
          width:'8%'
      },{
    	field:"JURY_TYPE_NAME",
      	title:"评审方式",
          align:"center",
          width:'8%'
      },{
    	field:"FEEDBACK_TIME",
      	title:"反馈时间",
          align:"center",
          width:'10%'
      },{
    	field:"AT_PRINCIPAL_NAME",
      	title:"环节处理人",
          align:"center",
          width:'10%'
      }]
    }); 
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	}
};

//查询
function queryJuryTable(objTable,jurySponsorurl){
	var jury_name = getCurrentPageObj().find("#jury_name").val();
	var sponsor_id = getCurrentPageObj().find("#sponsor_id").val();
	var at_jury_grade = getCurrentPageObj().find("#at_jury_grade option:selected").val();
	var jury_type = getCurrentPageObj().find("#jury_type option:selected").val();
	var system_id = getCurrentPageObj().find("#system_id").val();
	var jury_principal_id = getCurrentPageObj().find("#jury_principal_id").val();
	if(system_id==undefined){
		system_id = "";
	}
	if(jury_principal_id==undefined){
		jury_principal_id = "";
	}
	//escape(encodeURIComponent(cont_name))
	objTable.bootstrapTable('refresh',
			{url:jurySponsorurl+"&jury_name="+escape(encodeURIComponent(jury_name))+"&sponsor_id="+sponsor_id+"&at_jury_grade="+at_jury_grade+"&jury_type="+jury_type+"&system_id="+system_id+"&jury_principal_id="+jury_principal_id});

}

//重置
getCurrentPageObj().find("#resetJury").click(function(){
	getCurrentPageObj().find("#juryQueryT input").val("");
	var selects = getCurrentPageObj().find("#juryQueryT select");
	selects.val(" ");
	selects.select2();
});



//初始化方法
//initSJuryInfo();
initJuryButtonEvent();


