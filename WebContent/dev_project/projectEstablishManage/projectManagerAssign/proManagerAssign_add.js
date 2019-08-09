function initAssignPMAddEvent(item){
	var currTab = getCurrentPageObj();		//该方法可以获取当前显示的页面对象，通过这个对象可以避免与其他页面的id重复问题
	var call=getMillisecond();
	//初始化数据
	for (var key in item) {
		key1=key.toLowerCase();
		//debugger;
		//console.log(key1);
		//currTab.find("td[name="+key1+"]").html(itm[key]);
		if(key1=="project_man_id"||key1=="project_man_name"|key1=="system_id"||key1=="system_name"){
			currTab.find("input[name="+ key1 +'PM'+"]").val(item[key]);
			
		}else if(key1=="project_name"){
			currTab.find("td[name="+key1+"]").html(item[key]);
		}else if(key1=="project_num"){
			currTab.find("td[name="+key1+"]").html(item[key]);
		}else if(key1=="draft_id"){
			currTab.find("td[name="+key1+"]").html(item[key]);
		}else if(key1=="project_id"){
			currTab.find("td[name="+key1+"]").html(item[key]);
		}else if(key1=="pm_name"){
			currTab.find("td[name="+key1+"]").html(item[key]);
		}
		/*if(key1=="project_type"){
			//currTab.find("input[name="+key1+"]").html(item[key]);
			if(item[key]=="SYS_DIC_NEW_PROJECT"){
				getCurrentPageObj().find("[name='project_man_name']").attr("disabled",false);
			}
		}*/
		var time = new Date();
		var year = time.getFullYear();
		var month = time.getMonth()+1;
		var day = time.getDate();
		//初始化指派时间
		currTab.find("[name='assign_time']").val(year + "-" + month + "-" + day);
	}
	
	//项目经理pop
	$('#project_man_name').click(function(){
		openAppUserPop("project_man_pop",{no:getCurrentPageObj().find("#project_man_id"),name:getCurrentPageObj().find("#project_man_name")},"0007");
	});  
	
	//保存
	var save = currTab.find("#save_assignPM");
	save.click(function(){
		if(!vlidate(currTab,"",true)){
			return ;
		}
		var param = {};
		param["draft_id"]=currTab.find("td[name='draft_id']").html();
		param["project_id"]=currTab.find("td[name='project_id']").html();
		param["project_man_id"]=currTab.find("input[name='project_man_idPM']").val();
		param["system_id"]=currTab.find("input[name='system_idPM']").val();
		param["assign_time"]=currTab.find("input[name='assign_time']").val();
		var call1=getMillisecond();
		baseAjaxJsonp(dev_project+"AssignPM/assignPM.asp?SID="+SID+'&call='+call1,param, function(data){
			if (data != undefined && data != null && data.result=="true" ) {
	       		closeCurrPageTab();
			} 
			alert(data.msg);
		}, call1);
		
	});
	//返回
	var back = currTab.find("#back_assignPM");
	back.click(function(){
		closeCurrPageTab();
		//openInnerPageTab("back_project","返回","dev_project/projectEstablishManage/projectEstablish/projectEstablish_queryList.html");
	});
	  
	//点击打开应用模态框
	var system_name = currTab.find("input[name=system_namePM]");
	var modal_system = currTab.find("#modal_system");
	system_name.click(function(){
		modal_system.modal('show');
		openSysPop("chooseSys",{sys_id:currTab.find("input[name=system_idPM]"),sys_name:currTab.find("input[name=system_namePM]"),
			imp_pm_id:currTab.find("input[name=project_man_idPM]"),imp_pm_name:currTab.find("input[name=project_man_namePM]")});
	});
	//应用信息列表
	var sysInfo = currTab.find("#sys_table");
	function openSysPop(id,callparams){
		//分页
		var queryParams=function(params){
			var temp={
					limit: params.limit, //页面大小
					offset: params.offset //页码
			};
			return temp;
		};	
		//查询所有POP框
		sysInfo.bootstrapTable("destroy").bootstrapTable({
			//请求后台的URL（*）
			url : dev_project+"AssignPM/queryListSystemInfo.asp?SID="+SID+'&call='+call,
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
			pageSize : 10,//可供选择的每页的行数（*）
			clickToSelect : true, //是否启用点击选中行
			uniqueId : "USER_NO", //每一行的唯一标识，一般为主键列
			cardView : false, //是否显示详细视图
			detailView : false, //是否显示父子表
			singleSelect: true,
			jsonpCallback:call,
			onDblClickRow:function(row){
				modal_system.modal('hide');
				callparams.sys_id.val(row.SYSTEM_ID);
				callparams.sys_name.val(row.SYSTEM_NAME);
				callparams.imp_pm_id.val(row.PROJECT_MAN_ID);
				callparams.imp_pm_name.val(row.PROJECT_MAN_NAME);
			},
			columns :[{
					field : 'Number',
					title : '序号',
					align : "center",
					width: 50,
					formatter: function (value, row, index) {
						return index+1;
					}
				}, {
		        	field : 'SYSTEM_NAME',
					title : '应用名称',
					align : "center"
		        }, {
		        	field : "PROJECT_MAN_NAME",
					title : "项目经理",
					align : "center"
		        }]
		});
	}
	//POP重置
	var reset_pop = currTab.find("#reset_pop");
	reset_pop.click(function(){
		modal_system.find("input").val("");
	});
	//多条件查询项目经理
	var select_pop = currTab.find("#select_pop");
	select_pop.click(function(){
		var system_name =  modal_system.find("input[name=SYSTEM_NAME]").val();
		sysInfo.bootstrapTable('refresh',{url:dev_project+"AssignPM/queryListSystemInfo.asp?SID="+SID + "&call=" + call
				+"&system_name="+system_name});
	});
	enterEventRegister(getCurrentPageObj().attr("class"), function(){getCurrentPageObj().find("#select_pop").click();});
}
initVlidate(getCurrentPageObj());