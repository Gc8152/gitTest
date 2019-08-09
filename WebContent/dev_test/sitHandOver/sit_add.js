function addSit(item,type){
	var $page = getCurrentPageObj();//当前页
	var taskInfo = $page.find("#table_task_info");
	var defectInfo = $page.find("#table_defect_info");
	var initTableCall = getMillisecond();//table回调方法名
	var initDefectCall = getMillisecond()+1;//table回调方法名
	initVlidate($page);//渲染必填项
	if(type == 'add'){//新增
		autoInitSelect($page);//初始化下拉选
		autoVersion();//自动生成版本
		selectProject();//选择移交项目（弹pop框）
		var taskurl = dev_test+'testTaskHandOver/queryListTaskInfo.asp?call='+initTableCall+'&SID='+SID+'&TYPE='+type+'&PROJECT_ID=x';
		var defecturl = dev_test+"testTaskHandOver/queryListDefectInfo.asp?SID="+SID+"&call="+initDefectCall+'&PROJECT_ID=x';
		inittaskInfo(taskurl);
		initdefectInfo(defecturl);
		initButtonEvent('add');//初始化按钮事件
	}
    if(type == 'edit'){//修改
    	var TEST_ROUND = item.TEST_ROUND;
    	var round = TEST_ROUND - 1;
    	var PROJECT_ID = item.PROJECT_ID;
    	var taskurl = dev_test+'testTaskHandOver/queryListTaskInfo.asp?call='+initTableCall+'&SID='+SID+'&TYPE='+type+'&TEST_ROUND='+TEST_ROUND+'&PROJECT_ID='+PROJECT_ID;
    	var defecturl = dev_test+"testTaskHandOver/queryListDefectInfo.asp?SID="+SID+"&call="+initDefectCall+'&PROJECT_ID='+PROJECT_ID+'&TEST_ROUND='+ round; 
    	initsitInfo(item);//初始化修改信息
    	 //selectProject();
 		 inittaskInfo(taskurl);
 		initdefectInfo(defecturl);
 		 initButtonEvent('edit');//初始化按钮事件
	}
     //自动生成版本
     function autoVersion (){
			var versionCall = getMillisecond();
				baseAjaxJsonp(dev_test+"testTaskHandOver/addVersion.asp?SID=" + SID + "&call=" + versionCall, null, function(data) {
			if (data != undefined && data != null && data.result=="true") {
				var addlist = data.add;
				var testversion = addlist[0].TEST_VERSION;
				getCurrentPageObj().find("#TEST_VERSION").val(testversion);
			}else{
				alert(data.msg);
			}
		},versionCall,false);
	}
     //初始化修改信息
     function initsitInfo(item){
    	 
		for(var k in item){
			var dicCode = $page.find("[name='I."+ k +"']").attr("diccode");
			if(dicCode != undefined){
				initSelect($page.find("[name='I."+ k +"']"),{ value:"ITEM_CODE",text:"ITEM_NAME" },{dic_code:dicCode},item[k]);
				continue;
			}
			$page.find("[name='I."+ k +"']").val(item[k]);
		}
	}
     //选择移交项目（弹pop框）
	 function selectProject(){
		 	//获取项目id
		      function refreshTable(pid,test_round){ 
		    	  	type = 'add';
					taskInfo.bootstrapTable('refresh',{url:dev_test+"testTaskHandOver/queryListTaskInfo.asp?SID="+SID+"&call="+initTableCall+"&PROJECT_ID="+pid+"&TYPE="+type});	
					defectInfo.bootstrapTable('refresh',{url:dev_test+"testTaskHandOver/queryListDefectInfo.asp?SID="+SID+"&call="+initDefectCall+"&PROJECT_ID="+pid+'&TEST_ROUND='+test_round});
				}
		    //选择项目
				$page.find("[name='I.PROJECT_NAME']").click(function(){
					var $projectPop = $page.find("[mod='projectPop']");
					var $PROJECT_NAME= $page.find("[name='I.PROJECT_NAME']");
					var $PROJECT_ID= $page.find("[name='I.PROJECT_ID']");
					var $PROJECT_NUM= $page.find("[name='I.PROJECT_NUM']");
					var $TEST_ROUND= $page.find("[name='I.TEST_ROUND']");
					var $USER_NAME= $page.find("[name='I.USER_NAME']");
					var $OPT_MAN= $page.find("[name='I.OPT_MAN']");
					var $VERSION_NAME= $page.find("[name='I.VERSION_NAME']");
					projectPop($projectPop,{
						PROJECT_NAME : $PROJECT_NAME,
						PROJECT_NUM : $PROJECT_NUM,
						TEST_ROUND : $TEST_ROUND,
						USER_NAME : $USER_NAME,
						USER_NO : $OPT_MAN,
						VERSION_NAME : $VERSION_NAME,
						PROJECT_ID: $PROJECT_ID},refreshTable);
					});
	 		}
	 //按钮事件
	 function initButtonEvent(type){
			//保存按钮
			$page.find("[btn='submit_sit']").click(function(){ 
				var selesall = taskInfo.bootstrapTable("getData");
				var defectall = defectInfo.bootstrapTable("getData");
				var all=selesall.length;//所有任务数；
				var dall=defectall.length;//所有缺陷数
				var params = getPageParam("I");
				//存储测试人员
				var manInfo = new Array();
				var defInfo = new Array();
				var as=0;//任务和缺陷总数
				//存储并计算有关任务信息
				for(var k=0; k<selesall.length; k++){
					if ( selesall[k].SIT_STATE!=undefined && selesall[k].SIT_STATE!=null && selesall[k].SIT_STATE!='' && selesall[k].SIT_STATE=='01'){
						as++;
					}
					var temp = '';
                    if(selesall[k].TEST_MAN != undefined && selesall[k].TEST_MAN != null && selesall[k].TEST_MAN != ''){
                    	temp = selesall[k].TEST_MAN;
                    }
                    if(selesall[k].SIT_STATE == undefined || selesall[k].SIT_STATE == null || selesall[k].SIT_STATE == ''){
                    	selesall[k].SIT_STATE = '00';
                    }
					manInfo.push({  "TASK_ID":selesall[k].TASK_ID,
									 "TEST_MAN":temp,
									 "SIT_STATE":selesall[k].SIT_STATE});
					
				}
				//存储并计算有关缺陷信息
				for(var k=0; k<defectall.length; k++){
					if ( defectall[k].DEFECT_SIT_STATE!=undefined && defectall[k].DEFECT_SIT_STATE!=null && defectall[k].DEFECT_SIT_STATE!='' && defectall[k].DEFECT_SIT_STATE=='01'){
						as++;
					}
					var temp = '';
                    if(defectall[k].DEFECT_TEST_MAN != undefined && defectall[k].DEFECT_TEST_MAN != null && defectall[k].DEFECT_TEST_MAN != ''){
                    	temp = defectall[k].DEFECT_TEST_MAN;
                    }
                    if(defectall[k].DEFECT_SIT_STATE == undefined || defectall[k].DEFECT_SIT_STATE == null || defectall[k].DEFECT_SIT_STATE == ''){
                    	defectall[k].DEFECT_SIT_STATE = '00';
                    }
					defInfo.push({  "DEFECT_ID":defectall[k].DEFECT_ID,
									 "DEFECT_TEST_MAN":temp,
									 "DEFECT_SIT_STATE":defectall[k].DEFECT_SIT_STATE});
					
				} 
				params["HAND_OVER_TIME"] = nowTime();	
				params["TASK_PARAMS"]= JSON.stringify(manInfo);
				params["DEFECT_PARAMS"]= JSON.stringify(defInfo);
				//判断执行状态
				if(as=='0'){
					params["HAND_OVER_STATE"] = '00';
				}
				else if(as == all+dall){
					params["HAND_OVER_STATE"] = '02';
				}
				else{
					params["HAND_OVER_STATE"] = '01';
				}
				if(!vlidate($page,"",true)){
						alert("有必填项未填");
						return ;
					}
			//新增保存&提交
				if(type == 'add'){
				params["ACCEPT_STATE"] = '10';
				params["EXECUTE_STATE"] = '00';
				
			    var editCall = getMillisecond();
				baseAjaxJsonp(dev_test+"testTaskHandOver/saveTaskPoj.asp?SID=" + SID + "&call=" + editCall, params, function(data) {
					if(data && data.result=="true"){
						alert(data.msg);
						closeCurrPageTab();
					}else{
						alert(data.msg);
						closeCurrPageTab();
					}
				},editCall,false);
			}
				//修改保存&提交
				if(type == 'edit'){
			    var editCall = getMillisecond();
				baseAjaxJsonp(dev_test+"testTaskHandOver/editPoj.asp?SID=" + SID + "&call=" + editCall, params, function(data) {
					if(data && data.result=="true"){
						alert(data.msg);
						closeCurrPageTab();
					}else{
						alert(data.msg);
						closeCurrPageTab();
					}
				},editCall,false);
			}	
				
			});
			};
	//需求任务页面列表
	 function inittaskInfo(url) {
		 var queryParams=function(params){
		 	var temp={
		 			limit: params.limit, //页面大小
		 			offset: params.offset, //页码
		 			type:'1'
		 	};
		 	return temp;
		 }; 
		 
		 taskInfo.bootstrapTable({
		 	//请求后台的URL（*）
		 	url : url,
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
		 	uniqueId : "SIT_ID", //每一行的唯一标识，一般为主键列
		 	cardView : false, //是否显示详细视图
		 	detailView : false, //是否显示父子表
		 	jsonpCallback:initTableCall,
		 	singleSelect: false,
		 	onClickCell: function (field, value, row, $element) {
		 		 if (field == 'USER_NAME'){
		 			 if(row.SIT_STATE != '01'){
		 				 alert("该任务未移交，不能指派测试人员");
		 				 return;
		 			 }else{
		 		    var r = row.ROW_NUM - 1;//获取行值
					var arrManPopMod = $page.find("[mod='arrManPopMod']");
					var user_name =  $page.find("[name='USER_NAME']");
					var  test_user_name= $(user_name[r]);
						arrManPop(arrManPopMod,
								{
							TEST_USER_NAME : test_user_name,
							},
							callBack);
						
						function callBack(name,no){
							 
							row["USER_NAME"] = name;
							row["TEST_MAN"] = no;
						}}
								}
		 	
		 	},//单击某列触发事件
		 	onLoadSuccess : function(data){
		 		var tablearr=getCurrentPageObj().find("select[name='SIT_STATE']");
		 		for(var i=0;i<tablearr.length; i++){ 
		 			var tab=$(tablearr[i]);
		 			var values=tab.attr("value");
		 			if(values=="undefined"){
		 				values='00';
		 			}
		 			initSelect(tab,{ value:"ITEM_CODE",text:"ITEM_NAME" },{dic_code:"TM_DIC_HAND_OVER"},values);
		 			if(values=="01"){
		 				tab.attr("disabled",true);
		 			}
		 		}
		 	},
		 	onPostBody :function(data){
				var bootData = getCurrentPageObj().find("#table_task_info").bootstrapTable("getData");
				var seles = getCurrentPageObj().find("#table_task_info").find("select");
				seles.unbind("change").bind("change", function(e){
					 
					var username = getCurrentPageObj().find("#table_task_info").find("input[name='USER_NAME']");
					var index = $(this).attr("index");
					var bootrow2 = bootData[index];
					bootrow2[$(this).attr("name")] = $(this).val();
					if(bootrow2[$(this).attr("name")]=='00'){
						bootrow2["TEST_MAN"]='';
						bootrow2["USER_NAME"]='';
						$(username[index]).val("");
						alert("该任务未移交，不能指派测试人员");
					}
					
					
				});
			},
		 	columns : [ /*{
		 		checkbox : true,
				rowspan : 2,
				align : 'center',
				valign : 'middle',
			    formatter : function(value, row, index) {
			        if (row.SIT_STATE != undefined && row.SIT_STATE != null && row.SIT_STATE=='1')
			            return {
			                disabled : true,//设置是否可用
			                checked : true//设置选中
			            };
			        return value;
			    }
		 	},  */{
		 		field : "TASK_NUM",
		 		title : "需求任务编号",
		 		align : "center",
		 		width : "200",
		 	},{
		 		field : "TASK_NAME",
		 		title : "需求任务名称",
		 		align : "center",
		 		width : "200",
		 	},{
		 		field : "SIT_STATE",
		 		title : "移交状态",
		 		align : "center",
		 		width : "100",
		 		formatter: function (value, row, index) {
					return "<select   name='SIT_STATE'  index='"+index+"' value='"+value+"'diccode='TM_DIC_HAND_OVER'  class='requirement-ele-width' style='width: 100%'></select>" ;
			    }
		 	},{
			 		field : "USER_NAME",
			 		title : "测试人员",
			 		align : "center",
			 		width : "100",
			 		formatter: function (value, row, index) {
						if(undefined == row.USER_NAME){
							row.USER_NAME = '';
						}
						return "<input type='text' name='USER_NAME' index='"+index+"' value='"+row.USER_NAME+"'  readonly>" ;
					}
			 	}]
		 });
	 }
	//缺陷页面列表
	 function initdefectInfo(url) {
		 var queryParams=function(params){
			 	var temp={
			 			limit: params.limit, //页面大小
			 			offset: params.offset, //页码
			 			type:'1'
			 	};
			 	return temp;
			 }; 
			 
			 defectInfo.bootstrapTable({
			 	//请求后台的URL（*）
			 	url : url,
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
			 	uniqueId : "", //每一行的唯一标识，一般为主键列
			 	cardView : false, //是否显示详细视图
			 	detailView : false, //是否显示父子表
			 	jsonpCallback:initDefectCall,
			 	singleSelect: false,
			 	onClickCell: function (field, value, row, $element) {
			 		 if (field == 'USER_NAME'){
			 			 if(row.DEFECT_SIT_STATE != '01'){
			 				 alert("该缺陷未移交，不能指派测试人员");
			 				 return;
			 			 }else{
			 		    var r = row.ROW_NUM - 1;//获取行值
						var arrManPopMod = $page.find("[mod='arrManPopMod']");
						var duser_name =  $page.find("[name='DEFECT_USER_NAME']");
						var  test_user_name= $(duser_name[r]);
							arrManPop(arrManPopMod,
									{
								TEST_USER_NAME : test_user_name,
								},
								callBack);
							
							function callBack(name,no){
								 
								row["USER_NAME"] = name;
								row["DEFECT_TEST_MAN"] = no;
							}}
									}
			 	
			 	},//单击某列触发事件
			 	onLoadSuccess : function(data){
			 		var deftablearr=getCurrentPageObj().find("select[name='DEFECT_SIT_STATE']");
			 		for(var i=0;i<deftablearr.length; i++){
			 			var deftab=$(deftablearr[i]);
			 			var values=deftab.attr("value");
			 			if(values=="undefined"){
			 				values='00';
			 			}
			 			initSelect(deftab,{ value:"ITEM_CODE",text:"ITEM_NAME" },{dic_code:"TM_DIC_HAND_OVER"},values);
			 			if(values=="01"){
			 				deftab.attr("disabled",true);
			 			}
			 		}
			 	},
			 	onPostBody :function(data){
					var bootData = getCurrentPageObj().find("#table_defect_info").bootstrapTable("getData");
					var seles = getCurrentPageObj().find("#table_defect_info").find("select");
					seles.unbind("change").bind("change", function(e){
						 
						var dusername = getCurrentPageObj().find("#table_defect_info").find("input[name='DEFECT_USER_NAME']");
						var index = $(this).attr("index");
						var bootrow2 = bootData[index];
						bootrow2[$(this).attr("name")] = $(this).val();
						if(bootrow2[$(this).attr("name")]=='00'){
							bootrow2["DEFECT_TEST_MAN"]='';
							bootrow2["USER_NAME"]='';
							$(dusername[index]).val("");
							alert("该缺陷未移交，不能指派测试人员");
						}
						
						
					});
				},
			 	columns : [ /*{
			 		checkbox : true,
					rowspan : 2,
					align : 'center',
					valign : 'middle',
				    formatter : function(value, row, index) {
				        if (row.SIT_STATE != undefined && row.SIT_STATE != null && row.SIT_STATE=='1')
				            return {
				                disabled : true,//设置是否可用
				                checked : true//设置选中
				            };
				        return value;
				    }
			 	},  */{
			 		field : "DEFECT_NUM",
			 		title : "缺陷编号编号",
			 		align : "center",
			 		width : "200",
			 	},{
			 		field : "FUNC_NAME",
			 		title : "功能点",
			 		align : "center",
			 		width : "200",
			 	},{
			 		field : "DEFECT_SIT_STATE",
			 		title : "移交状态",
			 		align : "center",
			 		width : "100",
			 		formatter: function (value, row, index) {
						return "<select   name='DEFECT_SIT_STATE'  index='"+index+"' value='"+value+"'diccode='TM_DIC_HAND_OVER'  class='requirement-ele-width' style='width: 100%'></select>" ;
				    }
			 	},{
				 		field : "USER_NAME",
				 		title : "测试人员",
				 		align : "center",
				 		width : "100",
				 		formatter: function (value, row, index) {
							if(undefined == row.USER_NAME){
								row.USER_NAME = '';
							}
							return "<input type='text' name='DEFECT_USER_NAME' index='"+index+"' value='"+row.USER_NAME+"'  readonly>" ;
						}
				 	}]
			 });
		 }
	//获取当前时间
	 function nowTime(){
			function p(s) {
					    return s < 10 ? '0' + s: s;
					}
	                var myDate = new Date();
					//获取当前年
					var year=myDate.getFullYear();
					//获取当前月
					var month=myDate.getMonth()+1;
					//获取当前日
					var date=myDate.getDate(); 
					var h=myDate.getHours();       //获取当前小时数(0-23)
					var m=myDate.getMinutes();     //获取当前分钟数(0-59)
					var s=myDate.getSeconds();  
					var now=year+'-'+p(month)+"-"+p(date)+" "+p(h)+':'+p(m)+":"+p(s);
					return now;
			} 
}
