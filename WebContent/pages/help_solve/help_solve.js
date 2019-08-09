var currTab = getCurrentPageObj();
var tableProCall = getMillisecond();
var tablefile = currTab.find("#problemList");
var problem_name=currTab.find("#problem_name").val();
function initRoleButtonEvent(){
	currTab.find("#serach").click(function(){
		var param = getCurrentPageObj().find("#form-list").serialize();
		tablefile.bootstrapTable('refresh',
				{url:'Problem/findProblemOne1.asp?'+param});
	});
}	
	//enter查询
	enterEventRegister(getCurrentPageObj().attr("class"), function(){getCurrentPageObj().find("#serach").click();});
	//修改
	currTab.find("#update").click(function(){
		var id = tablefile.bootstrapTable('getSelections');
		var ids=$.map(id, function (row) {return row.PROBLEM_NAME;});	
		if(id.length!=1){
			alert("请选择一条问题解决方案进行修改!");
			return ;
		}else{	
			addProblem(this,'ProblemUpdate',ids);		
		}
	});
	//新增
	currTab.find("#add").click(function(){
		addProblem(this,'ProblemAdd',null);		
	});
	//详情查询
	currTab.find("#serachAll").click(function(){
		var id = tablefile.bootstrapTable('getSelections');
		var ids=$.map(id, function (row) {return row.PROBLEM_NAME;});	
		if(id.length!=1){
			alert("请选择一条问题解决方案查看详细信息!");
			return ;
		}else{	
			addProblem(this,'ProblemSerachAll',ids);		
		}
	});
	//删除
	currTab.find('#deletes').click(function(){
		var id = tablefile.bootstrapTable('getSelections');
		var ids=$.map(id, function (row) {return row.PROBLEM_NAME;});
		if(id.length==1){
			baseAjax('Problem/findProblemOne.asp?problem_name='+escape(encodeURIComponent(ids)), null , function(data) {
				//console.log(data);
				var create_id=data.rows[0].CREATE_ID;
				var present_userid=SID;
				  if(create_id==present_userid){
					  var ids=$.map(id, function (row) {return row.PROBLEM_NAME;});
					  var business_code=$.map(id, function (row) {return row.FILE_ID;});
					  nconfirm("是否确定删除？",function(){
						  //附件删除
						  baseAjax('Problem/findProblemFile.asp?business_code='+business_code, null , function(data) {
							  if(data != "" && data != null && data.result=="true" ){
								  for(var i=0;i<data.rows.length;i++){
							   	 /* var file_id=data.rows[i].FILE_ID;
									  baseAjaxJsonp(dev_background+'Problem/findProblemFileDelete.asp?file_id='+file_id+'&call='+tableProCall+'&SID='+SID, null , function(data){
									   if(data == "" && data == null && data.result!="true" ){	
											   alert("删除失败!");
									   }
									  });*/
									  var ids= "," + data.rows[i].ID;
									  baseAjax("sfile/delFTPFile.asp", {ids:ids.substring(1)}, function(result){
										  if(result.result!="true") {
												alert("删除失败");
											}
										});
									  }
								  }
						  });
						  baseAjax('Problem/findProblemDelete.asp?problem_name='+escape(encodeURIComponent(ids))+'&SID='+SID, null , function(data) {
							  if(data == "" && data == null && data.result!="true" ){
						   alert("删除失败!");
					    }else{
					    	alert("删除成功！");
					    	tablefile.bootstrapTable('refresh',
						 {url:'Problem/findProblemAll.asp?problem_name='+escape(encodeURIComponent(problem_name))});
					    }
						  });
				  });
				  }else{
						alert("只能删除自己创建的信息");
					}
				});
		}else{
			alert("请选择一条问题解决方案进行删除");
			return;
		}
	});

//初始化表格
function initProblemInfo(){
	/**初始化任务列表**/
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	}
	var param = getCurrentPageObj().find("#problem_from").serialize();
	tablefile.bootstrapTable({
        url:'Problem/findProblemAll.asp?problem_name='+escape(encodeURIComponent(problem_name))+ "&" +param,     //请求后台的URL（*）
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
		pageSize : 10,//可供选择的每页的行数（*）
		clickToSelect : true, //是否启用点击选中行
		uniqueId : "PROBLEM_ID", //每一行的唯一标识，一般为主键列
		cardView : false, //是否显示详细视图
		detailView : false, //是否显示父子表
		singleSelect: true,//复选框单选
		onLoadSuccess:function(data){
			gaveInfo();	
		},
        columns: [
		{
			checkbox : true,
			rowspan : 2,
			align : 'center',
			valign : 'middle'
		}, {
			 field : 'FILE_ID',
			 title : '序号',
			 align : "center",
	          width : 40,
			 formatter: function (value, row, index) {
				 return index+1;
			 }
		 },{
          field: 'PROBLEM_NAME',
          title: '问题名称',
          width : 180,
          align:"center"
        }, {
        	field:"PROBLEM_DESCRIPTION",
        	title:"问题描述",
        	width : 180,
            align:"center"
        },  {
        	field:"PROBLEM_SOLUTION",
        	title:"解决方案",
        	width : 180,
            align:"center"
        }, {
        	field:"CREATE_NAME",
        	title:"创建人",
        	width : 70,
            align:"center"
        }, {
        	field:"CREATE_TIME",
        	title:"创建日期",
        	width : 130,
            align:"center"
        },{
        	field:"FILE_ID",
        	title:"文件id",
            align:"center",
            visible:false
        }]
      }); 
};
//创建跳转页面
function addProblem(obj,key,param){
	var p=param;
	if("ProblemAdd"==key){
		closeAndOpenInnerPageTab("add_problem","系统使用常见问题及帮助","pages/help_solve/help_solve_add.html");		
	}else if("ProblemUpdate"==key){
		closePageTab("update_Problem");
			baseAjax('Problem/findProblemOne.asp?problem_name='+escape(encodeURIComponent(p)), null , function(data) {
				//console.log(data);
				var create_id=data.rows[0].CREATE_ID;
				var present_userid=SID;
				  if(create_id==present_userid){
						if (data != undefined && data != null && data.result=="true" ) {
							  closeAndOpenInnerPageTab("update_Problem","系统使用常见问题及帮助","pages/help_solve/help_solve_update.html", function(){
								  initUpdateProblemBtn(data.rows[0]);
							  });
						  }else{
							alert("進入修改頁面失败");
						  }
					}else{
						alert("只能修改自己创建的信息");
					}
				});
	}else if("ProblemSerachAll"==key){
		closePageTab("serachAll_Problem");
			baseAjax('Problem/findProblemOne.asp?problem_name='+escape(encodeURIComponent(p)), null , function(data) {
				//console.log(data);
				  if (data != undefined && data != null && data.result=="true" ) {
					  closeAndOpenInnerPageTab("serachAll_Problem","系统使用常见问题及帮助","pages/help_solve/help_solve_serach.html", function(){
						  initSearchProblemBtn(data.rows[0]);
					  });
				  }else{
					alert("進入详情頁面失败");
				  }
				});
	}
};
function initButtonInfo(){
	//var tableProCal1l = getMillisecond()+'1';
	//baseAjax('Problem/findProblemOne.asp?', null , function(data) {
		//var present_userid=data.present_userid;
		if(SID=="0"){
			 /*document.getElementById('add').style.display = "block"; 
			 document.getElementById('deletes').style.display = "block";
			 document.getElementById('update').style.display = "block";*/
			$('#add').attr('style','block');
			$('#update').attr('style','block');
			$('#deletes').attr('style','block');
		}
//	});
}
initButtonInfo();
initProblemInfo();
initRoleButtonEvent();