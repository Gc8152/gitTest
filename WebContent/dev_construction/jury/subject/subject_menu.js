

var themeCall = getMillisecond();
initGThemeInfo();
//初始化表格


function initGThemeInfo(){
	var process_id=1;
	//var themeCall = "theme_list";
		//getMillisecond();
	getCurrentPageObj().find("#ThemeTable").bootstrapTable({
	      url: dev_construction+'GTheme/queryThemeList.asp?call='+themeCall+'&SID='+SID+'&process_id='+process_id,     //请求后台的URL（*）
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
	      uniqueId: "THEME_ID",           //每一行的唯一标识，一般为主键列
	      cardView: false,          //是否显示详细视图
	      detailView: false,          //是否显示父子表	
	      jsonpCallback:themeCall,
	      singleSelect: true,//复选框单选
	      onLoadSuccess:function(data){
	    	  
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
	        field: 'THEME_ID',
	        title: 'ID',
	        align:"center",
	        visible:false
	      }, {
	          field: 'THEME_NAME',
	          title: '主题名字',
	          align:"center",
	          width : "27%",
	        },{
	          field: 'JURY_WORD_PRO',
	          title: '评审工作产品',
	          align:"center",
	          width : "43%",
	       },{
	      	  field:"GRADE_NAME",
	      	  title:"评审等级",
	          align:"center",
	          width : "20%",
	      }]
	    }); 
		var queryParams=function(params){
			var temp={
					limit: params.limit, //页面大小
					offset: params.offset //页码
			};
			return temp;
		}
		
		//添加页面pop框弹出
		getCurrentPageObj().find("#process_add").click(function() {
			
			getCurrentPageObj().find("#tab_subject_add").hide();
			hideAll();	//隐藏级别标签页的信息
			getCurrentPageObj().find("#hideTheme").show();
			getCurrentPageObj().find("#setProcessModel").modal("show");
			getCurrentPageObj().find("#processModalLabel").html("添加评审过程");
			getCurrentPageObj().find("#opt_save").val("add");
			
			getCurrentPageObj().find("#process_name").val("");
			getCurrentPageObj().find("#order_id").val("");
			getCurrentPageObj().find("#process_desc").val("");
			//$("#req_task_state").val(data.REQ_TASK_STATE);
			initSelect(getCurrentPageObj().find("#req_task_state"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_REQTASK_STATE"});
	
		});
		
		//修改页面pop框弹出
		getCurrentPageObj().find("#process_edit").click(function() {
			getCurrentPageObj().find("#tab_subject_add").hide();
			hideAll();	//隐藏级别标签页的信息
			getCurrentPageObj().find("#hideTheme").show();
			var id = getCurrentPageObj().find("#process_id").val();	

			if(id==null||id==undefined||id==""||id==1){
				alert("请选择一条数据！");				
				return;
			}else{	
				getCurrentPageObj().find("#setProcessModel").modal("show");
				getCurrentPageObj().find("#processModalLabel").html("修改评审过程");
				getCurrentPageObj().find("#opt_save").val("edit");
				var expertsCall = getMillisecond();
				baseAjaxJsonp(dev_construction+'GProcess/queryProcessById.asp.asp?call='+expertsCall+'&SID='+SID+"&process_id="+id,null, function(data) {
					if (data != undefined&&data!=null&&data.result=="true") {
						getCurrentPageObj().find("#process_name").val(data.PROCESS_NAME);
						getCurrentPageObj().find("#order_id").val(data.ORDER_ID);
						getCurrentPageObj().find("#process_desc").val(data.PROCESS_DESC);
						//$("#req_task_state").val(data.REQ_TASK_STATE);
						initSelect(getCurrentPageObj().find("#req_task_state"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_REQTASK_STATE"},data.REQ_TASK_STATE);
					}else{
						alert("查询失败");
					}
				},expertsCall);	
			}
		});
		
		//保存
		getCurrentPageObj().find("#process_save").click(function(){
			if(!vlidate(getCurrentPageObj().find("#processForm"))){
				return ;
			}
			var expertsCall = getMillisecond();
			var params = getPageParam("G");		//遍历当前页面的input,text,select
			var opt_save = getCurrentPageObj().find("#opt_save").val();
			if(opt_save == 'edit'){				//修改操作页面
				baseAjaxJsonp(dev_construction+'GProcess/updateProcess.asp?call='+expertsCall+'&SID='+SID,params, function(data) {
					if (data != undefined&&data!=null&&data.result=="true") {
						alert("添加成功");
						getCurrentPageObj().find("#setProcessModel").modal("hide");
						initProcessTree();
					}else{
						alert("添加失败");
					}
				},expertsCall);
			}else{							//添加操作页面
				baseAjaxJsonp(dev_construction+'GProcess/insertProcess.asp?call='+expertsCall+'&SID='+SID,params, function(data) {
			
					if (data != undefined&&data!=null&&data.result=="true") {
						alert("添加成功");
						getCurrentPageObj().find("#setProcessModel").modal("hide");
						initProcessTree();
					}else{
						alert("添加失败");
					}
				},expertsCall);
			}
		});
		
		//删除
		getCurrentPageObj().find("#process_del").click(function(){
			var id = getCurrentPageObj().find("#process_id").val();	
			var params={};
			params["process_id"] = id;
			var expertsCall = getMillisecond();
			if(id==null||id==undefined||id==""){
				alert("请选择一条数据！");				
				return;
			}else{	
				baseAjaxJsonp(dev_construction+'GProcess/deleteProcess.asp?call='+expertsCall+'&SID='+SID,params, function(data) {
					if (data != undefined&&data!=null&&data.result=="true") {
						getCurrentPageObj().find("#process_name_title").html("");
						getCurrentPageObj().find("#process_desc_title").html("");
						getCurrentPageObj().find("#title_process").html("");
						alert("删除成功");
						initProcessTree();
					}else{
						alert("添加失败");
					}
				},expertsCall);
			}
		});

		
};





function reloadTheme(process_id){
	getCurrentPageObj().find('#ThemeTable').bootstrapTable('refresh',{url : dev_construction+'GTheme/queryThemeList.asp?call='+themeCall+'&SID='+SID+'&process_id='+process_id});
}

var params={};
var zNodes = [];
function initProcessTree(){
	var call = getMillisecond();
	baseAjaxJsonp(dev_construction+'GProcess/queryProcessList.asp?call='+call+'&SID='+SID,params, function(data) {
		if (data != undefined&&data!=null&&data.result=="true") {
			zNodes = data.processMenu;
			getCurrentPageObj().find("#opt_list").hide();
			setCheck();
		}else{
			alert("查询失败");
		}
	},call);
}
initProcessTree();

var setting = {
	view : {
		showIcon : true
	},
	check : {
		enable : false,
		chkStyle : "checkbox",
		radioType : "level"
	},
	data : {
		simpleData : {
			enable : true
		}
	},
	callback : {
		onClick : function(event, treeId, treeNode) {
			getCurrentPageObj().find("#hideTheme").show();	//显示主题列表
			getCurrentPageObj().find("#tab_subject_add").hide();
			hideAll();  //其他页面全隐藏
			
			reloadTheme(treeNode.id);	//访问主题列表
			var processCall = getMillisecond();
			baseAjaxJsonp(dev_construction+'GProcess/queryProcessById.asp?call='+processCall+'&SID='+SID,{process_id : treeNode.id},function(data) {
				getCurrentPageObj().find("#process_name_title").html(data.PROCESS_NAME);
				getCurrentPageObj().find("#process_desc_title").html(data.PROCESS_DESC);
				getCurrentPageObj().find("#title_process").html('--'+data.PROCESS_NAME);
				
				if(data.PROCESS_ID == 1){
					getCurrentPageObj().find("#opt_list").hide();
					getCurrentPageObj().find("#process_id").val("");
				}else{
					getCurrentPageObj().find("#opt_list").show();
					getCurrentPageObj().find("#process_id").val(data.PROCESS_ID);
				}
			},processCall);
		
		}
	}
};

function setCheck() {
	var treeObj = $.fn.zTree.init($("#treeSubject"),setting, zNodes);
	treeObj.expandAll(true);
}


initSelect(getCurrentPageObj().find("#req_task_state"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_REQ_TASK_STATE"});
	
	