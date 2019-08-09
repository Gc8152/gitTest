//初始化列表
initTableInfo();
function initTableInfo() {
	var currTab = getCurrentPageObj();
	var changeCall = getMillisecond();
	var table = currTab.find("#confBasicInfo");
	var url=dev_resource+'ConfigApply/queryConfigId.asp?call='+changeCall+'&SID='+SID;
	baseAjaxJsonp(url,null,function(data){
		currTab.find("#CONFIG_ID").html(data.CONFIGID);
		currTab.find("#CONFIG").val(data.CONFIGID);
		if(data.STATU=="01"){
			currTab.find("#STATU").html("待提交");
		}
		currTab.find("#P_OWNER").html(data.USER_NAME);
		currTab.find("#APPLICANT").html(data.USER_NAME);
	},changeCall,false);
	
	var time = new Date();
	var year = time.getFullYear();
	var month = time.getMonth()+1;
	var day = time.getDate();
	//初始化指派时间
	currTab.find("#APP_TIME").html(year + "-" + month + "-" + day);
	currTab.find("#time").val(year + "-" + month + "-" + day);
	
	//保存
	$('#save_button').click(function(){
		var param = getPageParamRA("C");
		
		var changeCall1 = getMillisecond()+'1';
		if(!vlidate(getCurrentPageObj().find("#gConfigInfo_add"),"",true)){
			return ;
		}
		var records = $("#user_tableConfigAdd").bootstrapTable('getData');
		var demand="";
		for(var j=0;j<records.length;j++){
			demand += "," + records[j].USER_NO;
		}
		demands=demand.slice(1);
		param["DEV_USER_ALL"]=demands;
		
		var url = dev_resource+'ConfigApply/addConfigApply.asp?call='+changeCall1+'&SID='+SID;
		baseAjaxJsonp(url, param, function(data){
			if (data != undefined&&data!=null&&data.result=="true") {
				alert("保存成功！");
				closePageTab("configApply");
			} else {
				alert(data.msg);
			}
		}, changeCall1);
	});
	
	
	
	
	//点击打开应用模态框
	var system_name = currTab.find("#system_name");
	var modal_system = currTab.find("#modal_system");
	system_name.click(function(){
		
		modal_system.modal('show');
		openSysPop("chooseSys",{sys_id:currTab.find("#system_id"),sys_name:currTab.find("#system_name"),
			imp_cf_id:currTab.find("#config_man_id"),imp_cf_name:currTab.find("#config_man_name"),system_short:currTab.find("#system_short"),project_name:currTab.find("#project_man"),skill_name:currTab.find("#skill_man"),project_man_id:currTab.find("#project_man_id"),skill_man_id:currTab.find("#skill_man_id")});
		//
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
		sysInfo.bootstrapTable({
			//请求后台的URL（*）
			url : dev_resource+"ConfigApply/queryListSystemInfo.asp?SID="+SID+'&call='+changeCall,
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
			jsonpCallback:changeCall,
			onDblClickRow:function(row){
				
				if(row.STATU_ID==""||row.STATU_ID==null&&row.STATU_ID==undefined){
					
					modal_system.modal('hide');
					$('#user_tableConfigAdd').bootstrapTable("removeAll");
					
					callparams.sys_id.val(row.SYSTEM_ID);
					callparams.sys_name.val(row.SYSTEM_NAME);
					callparams.imp_cf_id.val(row.CONFIG_MAN_ID);
					callparams.imp_cf_name.val(row.CONFIG_MAN_NAME);
					callparams.system_short.val(row.SYSTEM_SHORT);
					callparams.project_name.val(row.PROJECT_MAN_NAME);
					callparams.project_man_id.val(row.PROJECT_MAN_ID);
					callparams.skill_name.val(row.SKILL_MAN_NAME);
					callparams.skill_man_id.val(row.SKILL_MAN_ID);
					var dev_flag="02";
					baseAjaxJsonp(dev_resource+"ConfigApply/queryListSystemInfo.asp?SID="+SID+'&call='+changeCall+"&dev_flag="+dev_flag,row, function(data) {
						if(data.rows1.length!=0){
							$('#user_tableConfigAdd').bootstrapTable("prepend",data.rows1[0]);
						}
						if(data.rows2.length!=0){
							$('#user_tableConfigAdd').bootstrapTable("prepend",data.rows2[0]);
						}
					},changeCall);
				}else if(row.STATU_ID=="01"){
					alert("该应用待分配,请选择可配置应用");
				}else if(row.STATU_ID=="02"){
					alert("该应用待确认,请选择可配置应用");
				}else if(row.STATU_ID=="03"){
					alert("该应用配置完成,请选择可配置应用");
				}
			
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
		        	field : 'SYSTEM_SHORT',
					title : '应用简称',
					align : "center"
		        }, {
		        	field : 'CONFIG_MAN_NAME',
					title : '配置管理员',
					align : "center"
		        }, {
		        	field : "PROJECT_MAN_NAME",
					title : "项目经理",
					align : "center"
		        }, {
		        	field : "SKILL_MAN_NAME",
					title : "技术经理",
					align : "center"
		        }, {
		        	field : "STATU_NAME",
		        	title : "应用状态",
		        	align : "center"
		        },{
		        	field : "STATU_ID",
		        	title : "应用状态",
		        	align : "center",
		        	visible : false
		        },{
		        	field : "SKILL_MAN_ID",
					title : "技术",
					align : "center",
					visible : false
		        }, {
		        	field : "PROJECT_MAN_ID",
					title : "项目",
					align : "center",
					  visible : false
		        }, {
		        	field : "ROLE_NO",
					title : "角色",
					align : "center",
				  visible : false
						
		        }]
		});
	}
	//POP重置
	var reset_pop = currTab.find("#pop_appReset");
	reset_pop.click(function(){
		getCurrentPageObj().find("#SYSTEM_NAME").val("");
		getCurrentPageObj().find("#SYSTEM_SHORT").val("");
	});
	//多条件查询项目经理
	var select_pop = currTab.find("#pop_appSearch");
	select_pop.click(function(){
		var system_name =  modal_system.find("input[name=SYSTEM_NAME]").val();
		var SYSTEM_SHORT =  modal_system.find("input[name=SYSTEM_SHORT]").val();
		sysInfo.bootstrapTable('refresh',{url:dev_resource+"ConfigApply/queryListSystemInfo.asp?SID="+SID+'&call='+changeCall
				+"&system_name="+escape(encodeURIComponent(system_name))+"&SYSTEM_SHORT="+escape(encodeURIComponent(SYSTEM_SHORT))});
		
	});
	//enter触发查询
	enterEventRegister("popModelQueryLevel1", function(){getCurrentPageObj().find("#pop_appSearch").click();});
	//enter触发查询
	enterEventRegister(getCurrentPageObj().attr("class"), function(){getCurrentPageObj().find("#pop_appSearch").click();});
	
	//需求选择
	var select = currTab.find("#select");
	select.click(function(e){
		//点击选择按钮，获取复选框中被选中的记录id
		if($("#dev_tableConAdd").find("input[type='checkbox']").is(':checked')){
			//if($('#'))
			var currTab = getCurrentPageObj();
			var changeCall1 = getMillisecond()+'3';
			var dev_flag="02";
			var project_man_id=currTab.find("#project_man_id").val();
			var skill_man_id=currTab.find("#skill_man_id").val();
			var rol = $("#dev_tableConAdd").bootstrapTable('getSelections');
			var bat = $("#user_tableConfigAdd").bootstrapTable('getData');
			var m=0;
			for(var k=0;k<bat.length;k++){
				if(bat[k].USER_NAME!="软件开发岗"){
					m++;
				}
			}
			if(m==1){
				bat.splice(0, 1);
				
			}else if(m==2){
				bat.splice(0, 1);
				bat.splice(0, 1);
			}
			
			for(var i=0;i<rol.length;i++){
				for(var j=0;j<bat.length;j++){
					if(rol[i].USER_NO==bat[j].USER_NO){
						var id=bat[j].USER_NO;
						$('#user_tableConfigAdd').bootstrapTable("removeByUniqueId", id);
					}
				}
				$('#user_tableConfigAdd').bootstrapTable("append",rol[i]);
			}
		
				baseAjaxJsonp(dev_resource+"ConfigApply/queryListSystemInfo.asp?SID="+SID+'&call='+changeCall1+"&dev_flag="+dev_flag+"&PROJECT_MAN_ID="+project_man_id+"&SKILL_MAN_ID="+skill_man_id,null, function(data) {
					if(data.rows1.length!=0){
						$('#user_tableConfigAdd').bootstrapTable("prepend",data.rows1[0]);
					}
					if(data.rows2.length!=0){
						
						$('#user_tableConfigAdd').bootstrapTable("prepend",data.rows2[0]);
					}
				},changeCall1);
			
			
			$("#dev_modal").modal("hide");
		}else{
			e.preventDefault();
	        $.Zebra_Dialog('请选择一条或多条要添加的记录!', {
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
	
	getCurrentPageObj().find('#user_tableConfigAdd').bootstrapTable("destroy").bootstrapTable({
		//请求后台的URL（*）
		method : 'get', //请求方式（*）   
		striped : false, //是否显示行间隔色
		cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
		sortable : true, //是否启用排序
		sortOrder : "asc", //排序方式
		queryParams : queryParams,//传递参数（*）
		sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
		pagination : false, //是否显示分页（*）
		pageList : [10,15],//每页的记录行数（*）
		pageNumber : 1, //初始化加载第一页，默认第一页
		pageSize : 10,//可供选择的每页的行数（*）
		clickToSelect : true, //是否启用点击选中行
		uniqueId : "USER_NO", //每一行的唯一标识，一般为主键列
		cardView : false, //是否显示详细视图
		detailView : false, //是否显示父子表
		singleSelect: true,
		columns :[ {
			field : 'Number',
			title : '序号',
			align : "center",
			width: 50,
			formatter: function (value, row, index) {
				return index+1;
			}
		},
		{
			field : 'USER_NO',
			title : '用户编号',
			align : "center",
			 width:"10%"
		}, {
			field : "USER_NAME",
			title : "用户名称",
			align : "center"
		}, {
			field : "LOGIN_NAME",
			title : "登陆名",
			align : "center"
		
		},{
			field : "ROLE_NAME",
			title : "角色岗位",
			align : "center"
		}, {
			field : "ROLE_NO",
			title : "角色",
			align : "center",
			visible : false
		}, {
			field : "DID",
			title : "操作",
			align : "center",
			formatter: function (value, row, index) {
				return row.ROLE_NAME=="软件开发岗"?'<span class="hover-view" '+
						'onclick="deleteInfo('+index+')">删除</span>':"-"
					;
			}
	        }]
	});
	
	

	
	//添加开发人员
	var dev_modal= currTab.find("#dev_modal");
	$('#add_user').click(function(){
		dev_modal.modal('show');
		openDevPop("app_user_dev",{},'user_tableConfigAdd');
	});
	
	getCurrentPageObj().find("#pop_userReset").click(function() {
		getCurrentPageObj().find("#pop_userCode").val("");
		getCurrentPageObj().find("#pop_username").val("");
		

	});
	//查询人员
		$("#pop_userSearch").click(function() {
			var changeCalls = getMillisecond()+'2';
			var dev_flag="01";
			var id = $.trim(getCurrentPageObj().find("#pop_userCode").val());
			var user_name = $.trim(getCurrentPageObj().find("#pop_username").val());
				getCurrentPageObj().find('#dev_tableConAdd').bootstrapTable('refresh',{
				url:dev_resource+"ConfigApply/queryListSystemInfo.asp?SID="+SID+'&call='+changeCall+'&dev_flag='+dev_flag+"&id="+id+"&user_name="+escape(encodeURIComponent(user_name)),
				});
		});
		//enter触发查询
		enterEventRegister("popModelQueryLevel1", function(){getCurrentPageObj().find("#pop_userSearch").click();});
	//开发人员信息列表
	function openDevPop(id,callparams,table_id){
		var devInfo = currTab.find("#dev_tableConAdd");
		var changeCalls = getMillisecond()+'2';
		var dev_flag="01";
		//分页
		var queryParams1=function(params){
			var temp={
					limit: params.limit, //页面大小
					offset: params.offset //页码
			};
			return temp;
		};	
		//查询所有POP框
		devInfo.bootstrapTable({
			//请求后台的URL（*）
			url : dev_resource+"ConfigApply/queryListSystemInfo.asp?SID="+SID+'&call='+changeCall+'&dev_flag='+dev_flag,
			method : 'get', //请求方式（*）   
			striped : true, //是否显示行间隔色
			cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
			sortable : true, //是否启用排序
			sortOrder : "asc", //排序方式
			queryParams : queryParams1,//传递参数（*）
			sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
			pagination : true, //是否显示分页（*）
			pageList : [5,10,15],//每页的记录行数（*）
			pageNumber : 1, //初始化加载第一页，默认第一页
			pageSize : 10,//可供选择的每页的行数（*）
			clickToSelect : true, //是否启用点击选中行
			uniqueId : "USER_NO", //每一行的唯一标识，一般为主键列
			cardView : false, //是否显示详细视图
			detailView : false, //是否显示父子表
			singleSelect: false,
			jsonpCallback:changeCall,
			onDblClickRow:function(row){
				dev_modal.modal('hide');
				var records_old = getCurrentPageObj().find("#"+table_id).bootstrapTable('getData');
					var flag = true;
					$.map(records_old, function (row2) {
						if(row.USER_NO==row2.USER_NO)
							flag=false;
					})
					if(flag)
					getCurrentPageObj().find("user_tableConfigAdd").bootstrapTable("append",row);	
			},
			columns :[ {
				field: 'middle',
				checkbox: true,
				rowspan: 2,
				align: 'center',
				valign: 'middle',
				formatter: function (value, row, index) {
					return index+1;
				}
			},{
				field : 'USER_NO',
				title : '用户编号',
				align : "center"
			}, {
				field : "USER_NAME",
				title : "用户名称",
				align : "center"
			}, {
				field : "LOGIN_NAME",
				title : "登陆名",
				align : "center"
			
			},{
				field : "ROLE_NO",
				title : "角色",
				align : "center",
				visible : false
			}, {
				field : "ROLE_NAME",
				title : "角色岗位",
				align : "center"
		        }]
		});
	}
	
	
	//POP重置
	var reset_pop = currTab.find("#reset_pop");
	reset_pop.click(function(){
		dev_modal.find("input").val("");
	});
	//多条件查询项目经理
	var select_pop = currTab.find("#select_pop");
	select_pop.click(function(){
		var system_name =  dev_modal.find("input[name=SYSTEM_NAME]").val();
		devInfo.bootstrapTable('refresh',{url:dev_resource+"ConfigApply/queryListSystemInfo.asp?SID="+SID+'&call='+changeCalls
				+"&system_name="+system_name});
	});	
};

//需求表里的删除
function deleteInfo(index){
	var currTab = getCurrentPageObj();
	var changeCall1 = getMillisecond()+'3';
	var dev_flag="02";
	var rols = $("#user_tableConfigAdd").bootstrapTable('getData');
	
	//rols.splice(0, 1);
	var rol = $("#user_tableConfigAdd").bootstrapTable('getData')[index];
	var id=rol.USER_NO;
	var project_man_id=currTab.find("#project_man_id").val();
	var skill_man_id=currTab.find("#skill_man_id").val();
	/*params["PROJECT_MAN_ID"]=currTab.find("project_man_id");
	params["SKILL_MAN_ID"]=currTab.find("skill_man_id");*/
	var g=0;
	for(var k=0;k<rols.length;k++){
		if(rols[k].ROLE_NAME!="软件开发岗"){
			g++;
		}
	}
	
	
	
	 if(g==1){
		rols.splice(0, 1);
		
	}else if(g==2){
		rols.splice(0, 1);
		rols.splice(0, 1);
		
	}
	
	for(var i=0;i<rols.length;i++){
		if(rol.USER_NO==rols[i].USER_NO){
			
			$('#user_tableConfigAdd').bootstrapTable("removeByUniqueId", id);
		}
	}
	
	
	if(g==0){
		baseAjaxJsonp(dev_resource+"ConfigApply/queryListSystemInfo.asp?SID="+SID+'&call='+changeCall1+"&dev_flag="+dev_flag+"&PROJECT_MAN_ID="+project_man_id+"&SKILL_MAN_ID="+skill_man_id,null, function(data) {
			if(data.rows1.length!=0){
			$('#user_tableConfigAdd').bootstrapTable("prepend",data.rows1[0]);
			}
			if(data.rows2.length!=0){
				
				$('#user_tableConfigAdd').bootstrapTable("prepend",data.rows2[0]);
			}
		},changeCall1);
	}else if(g==1){
		//rols.splice(0, 1);
		baseAjaxJsonp(dev_resource+"ConfigApply/queryListSystemInfo.asp?SID="+SID+'&call='+changeCall1+"&dev_flag="+dev_flag+"&PROJECT_MAN_ID="+project_man_id+"&SKILL_MAN_ID="+skill_man_id,null, function(data) {
			if(data.rows1.length!=0){
			$('#user_tableConfigAdd').bootstrapTable("prepend",data.rows1[0]);
			}
			if(data.rows2.length!=0){
				
				$('#user_tableConfigAdd').bootstrapTable("prepend",data.rows2[0]);
			}
		},changeCall1);
	}else{
		
		baseAjaxJsonp(dev_resource+"ConfigApply/queryListSystemInfo.asp?SID="+SID+'&call='+changeCall1+"&dev_flag="+dev_flag+"&PROJECT_MAN_ID="+project_man_id+"&SKILL_MAN_ID="+skill_man_id,null, function(data) {
			if(data.rows1.length!=0){
			$('#user_tableConfigAdd').bootstrapTable("prepend",data.rows1[0]);
			}
			if(data.rows2.length!=0){
				
				$('#user_tableConfigAdd').bootstrapTable("prepend",data.rows2[0]);
			}
		},changeCall1);
	}
	

}	
