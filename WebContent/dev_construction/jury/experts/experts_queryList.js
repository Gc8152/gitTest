var expertsQuery = getMillisecond();
//初始化按钮事件
function initRoleButtonEvent(){
	
	//弹出专家名称pop框
	getCurrentPageObj().find("#query_user_name").click(function(){ 
		openUserPop("queryDivExpert",{name:getCurrentPageObj().find("#query_user_name"),no:getCurrentPageObj().find("#query_user_id")});
	});
//	reviewer_user_id
	
	//查询
	getCurrentPageObj().find("#queryExperts").click(function(){
		var reviewer_user_id = getCurrentPageObj().find("#query_user_id").val();
		var reviewer_grade = getCurrentPageObj().find("#reviewer_grade option:selected").val();
		var type_key = getCurrentPageObj().find("#type_key option:selected").val();

		getCurrentPageObj().find('#expertsTableInfo').bootstrapTable('refresh',
				{url:dev_construction+'GExperts/queryExpertsList.asp?call='+expertsQuery+'&SID='+SID+"&reviewer_user_id="+reviewer_user_id+"&reviewer_grade="+reviewer_grade+"&type_key="+type_key});
	});
	enterEventRegister(getCurrentPageObj().attr("class"), function(){getCurrentPageObj().find("#queryExperts").click();});
	
	//重置
	getCurrentPageObj().find("#reset_expertsQuery").click(function(){
		getCurrentPageObj().find("#query_user_id").val("");
		getCurrentPageObj().find("#query_user_name").val("");
		getCurrentPageObj().find("#reviewer_grade").val(" ");
		getCurrentPageObj().find("#reviewer_grade").select2();
		getCurrentPageObj().find("#type_key").val(" ");
		getCurrentPageObj().find("#type_key").select2();
	});
	
	//删除
	getCurrentPageObj().find("#experts_delete").click(function(){

		closePageTab("update_experts");
		var id = $("#expertsTableInfo").bootstrapTable('getSelections');
		var ids = $.map(id, function (row) {return row.EXPERT_ID;});	

		if(ids==null||ids==undefined||ids==""){
			alert("请选择一条数据！");					
			return;
		}else{
			nconfirm("确定要删除该数据吗?",function(){
				deleteGExpertInfo(ids);
				$("#expertsTableInfo").bootstrapTable('remove', {
					field: 'EXPERT_ID',
					values: ids
				});	
			});
		}
		
	});

	//修改
	getCurrentPageObj().find("#experts_edit").click(function(){
		var id = $("#expertsTableInfo").bootstrapTable('getSelections');
		var ids = $.map(id, function (row) {return row.EXPERT_ID;});	
		if(ids==null||ids==undefined||ids==""){
			alert("请选择一条数据！");				
			return;
		}else{	
			pageDispatchGxperts(this,'GExpertUpdate',ids);		
		}
	});
	
	//修改
	getCurrentPageObj().find("#experts_info").click(function(){
		var id = $("#expertsTableInfo").bootstrapTable('getSelections');
		var ids = $.map(id, function (row) {return row.EXPERT_ID;});	
		if(ids==null||ids==undefined||ids==""){
			alert("请选择一条数据！");				
			return;
		}else{	
			pageDispatchGxperts(this,'GExpertUpdate',ids,"info");		
		}
	});
	
	
	
}

//执行删除的方法
function deleteGExpertInfo(param){
	var expertsCall = getMillisecond();
	var params = {};
	params["expert_id"] = param[0];
	baseAjaxJsonp(dev_construction+'GExperts/deleteExperts.asp?call='+expertsCall+'&SID='+SID,params, function(data) {
		if (data != undefined&&data!=null&&data.result=="true") {
			$('#expertsTableInfo').bootstrapTable('refresh',{url:dev_construction+'GExperts/queryExpertsList.asp?SID='+SID});
			alert("删除成功");
		}else{
			alert("删除失败");
		}
	},expertsCall);
}

//创建跳转页面
function pageDispatchGxperts(obj,key,param,type){
	var params = {};
	params["expert_id"] = param[0];
	if("GExpertAdd"==key){

		closePageTab("add_experts");
		closeAndOpenInnerPageTab("add_experts","添加评委","dev_construction/jury/experts/experts_add.html");		
		
		return;
	}else if("GExpertUpdate"==key){
		var descInfo="修改评委";
		if(type=="info"){
			descInfo="查看评委";
		}
		closeAndOpenInnerPageTab("update_experts",descInfo,"dev_construction/jury/experts/experts_update.html",function(){	
			var expertsCall = getMillisecond();
			baseAjaxJsonp(dev_construction+'GExperts/queryExpertsById.asp?call='+expertsCall+'&SID='+SID,params, function(data) {
				for ( var k in data) {
					var str = data[k];
					k = k.toLowerCase();
					getCurrentPageObj().find("#"+k).val(str);
					if(k=="experts_type"){
						initGExpertUpdateType(str);
					}
					if(k=="reviewer_grade")
						initSelect(getCurrentPageObj().find("#reviewer_grade"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_REVIEWER_GRADE"},str);

				}					
				if(type=="info"){
					getCurrentPageObj().find("#updateExpert_from input").attr("disabled",true);
					getCurrentPageObj().find("#updateExpert_from select").attr("disabled",true);
					getCurrentPageObj().find("#updateExpert_from textarea").attr("disabled",true);
					getCurrentPageObj().find("#updateExperts").hide();
					getCurrentPageObj().find("#expertsInfo").html("查看评委");
				}
				
				//alert(data['experts_type']);
				
			},expertsCall);
		});
	}
}




//初始化表格
function initSRoleInfo(){

	$("#expertsTableInfo").bootstrapTable({
      url: dev_construction+'GExperts/queryExpertsList.asp?call='+expertsQuery+'&SID='+SID,     //请求后台的URL（*）
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
      pageSize: 5,            //每页的记录行数（*）		       
      clickToSelect: true,        //是否启用点击选中行
      //height: 460,            //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
      uniqueId: "EXPERT_ID",           //每一行的唯一标识，一般为主键列
      cardView: false,          //是否显示详细视图
      detailView: false,          //是否显示父子表	
      jsonpCallback:expertsQuery,
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
        width : "6%",
      }, {
        field: 'EXPERT_ID',
        title: 'ID',
        align:"center",
        visible:false
      }, {
          field: 'USER_NAME',
          title: '评委名字',
          align:"center",
          width : "20%",
        },{
          field: 'ITEM_NAME',
          title: '评委类型',
          align:"center",
          width : "20%",
       }, {
           field: 'SYSTEM_NAME',
           title: '负责应用',
           align:"center",
           width : "20%",
       },{
      	  field:"GRADE_NAME",
      	  title:"评委等级",
          align:"center",
          width : "15%",
      },{
      	field:"IS_BANKER",
      	title:"是否行员",
		align:"center",
		width : "15%",
		formatter: function (value, row, index) {
			if(value=="00")
				return "是";
			else 
				return "否";
		}
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

//初始化数据,评委类型
initSelect(getCurrentPageObj().find("#type_key"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_EXPERT_TYPE"});
//初始化数据,评委级别
initSelect(getCurrentPageObj().find("#reviewer_grade"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_REVIEWER_GRADE"});

//初始化方法
initSRoleInfo();
initRoleButtonEvent();

