
//initBusinessOrgTree();
initRequirementAssessBtn();
setTimeout(function(){
	 hideTableLeftBorder(1);
},100);

//加载部门下拉树
function initBusinessOrgTree(){
	//主管业务部门
	/*getCurrentPageObj().find("#project_id_org").click(function(){
			$(".drop-ztree").hide();
			openSelectTreeDiv($(this),"projectid_tree_id1","SOrg/queryOrgTreeWithCenterList.asp",{"margin-top": "2px",width:"88%"},function(node){
			  getCurrentPageObj().find("#project_id_org").val(node.name);
			  getCurrentPageObj().find("#project_id_applicationadd").val(node.id);
			  getCurrentPageObj().find("#projectid_tree_id1").hide();
		});
	});*/
}

//加载字典项
function initReqAssessDicCode(req_state){
	var queryForm=getCurrentPageObj().find("#g_requirement_accept");
	 //初始化字典
	 autoInitSelect(queryForm);
	 initSelect(getCurrentPageObj().find("#DAAreq_acc_classify"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_REQ_CLASSIFY"},"01","",["00"]);
	 if(req_state!="09"){
	   autoInitRadio({dic_code:"G_DIC_REQ_FEASIBILITY"},getCurrentPageObj().find("#DAA_acc_feasibility"),"DAA.req_feasibility_result",{labClass:"ecitic-radio-inline",value:"01"});
	 }
}


//初始化页面数据
function initReqAssessLayOut(ids,req_state){
	var file_id_assess = "";
	getCurrentPageObj().find('#req_dept_idDA').hide();
	//当需求状态不是需求审批退回时隐藏审批记录
	if(req_state!="09"){
		getCurrentPageObj().find('#ulfourth').hide();//隐藏审批记录说明tab
		getCurrentPageObj().find('#approve_record').hide();//隐藏审批记录内容
	}
	getCurrentPageObj().find('#ulthird').hide();//隐藏转交说明tab
	//getCurrentPageObj().find('#transfer_decrition').hide();//隐藏转交说明内容
	var reqAssessCall = getMillisecond();
	baseAjaxJsonp(dev_construction+"requirement_splitreq/querySplitSubReqById.asp?SID="+SID+"&req_id="+ids+"&call="+reqAssessCall, null , function(data) {
		if(data&&data["2"]){
			$("#DAAgroup_id").val(data["2"]["RES_GROUP_ID"]);
		}
		for ( var f in data) {
			var map=data[f];
		if(f=="1"||f=="2"){
			for(var k in map){
					var str=map[k];
					k = k.toLowerCase();//大写转换为小写
				if(k=='create_person'){
					getCurrentPageObj().find("input[name='DA."+k+"']").val(str);
				}
			    if(k=="req_datatable_flag"||k=="req_income_flag"||k=="req_dis_result"){
			    	getCurrentPageObj().find("input[name='DA."+k+"']"+"[value="+str+"]").attr("checked",true);
			    }else if(k=="req_level"){
			    	autoInitRadio({dic_code:"G_DIC_REQUIREMENT_LEVEL"},getCurrentPageObj().find("#req_level_reqDA"),"DA.req_level",{labClass:"ecitic-radio-inline",value:str});
			    }else if(k=="req_acc_result"){
			    	getCurrentPageObj().find('#DARreq_acc_result').val(str);
			    }else if(k=="req_analytic_result"){
			    	getCurrentPageObj().find("#DARreq_analytic_result").val(str);
				}else if(k=="req_id"){
					getCurrentPageObj().find("#req_id_reqDA").val(str);
				}else if(k=="file_id"){
					getCurrentPageObj().find("#file_id_reqDA").val(str);
				}else if(k=="assfile_id"){
					getCurrentPageObj().find("#DAAfile_id").val(str);//正常需求评估的时候把需求信息表里的assfile_id赋值给DAAfile_id
				}else if(k=="req_income_doc"){
					getCurrentPageObj().find("#req_income_doc_reqDA").val(str);
				}else if(k=="req_description"){
					getCurrentPageObj().find("#req_description_reqDA").val(str);
				}else if(k=="req_dis_view"){
					getCurrentPageObj().find("#req_dis_viewDA").val(str);
				}else if(k=="put_dept_opinion"){
					getCurrentPageObj().find("#put_dept_opinion_reqDA").val(str);	
				}else{
					getCurrentPageObj().find("span[name='DA."+k+"']").text(str);
				}
			    if(req_state=="09"){
			      if(k=="req_acc_result"){
			    	  getCurrentPageObj().find("input[name='DAA."+k+"']"+"[value="+str+"]").attr("checked",true);
			      }else if(k=="req_feasibility_result"){
			    	  autoInitRadio({dic_code:"G_DIC_REQ_FEASIBILITY"},getCurrentPageObj().find("#DAA_acc_feasibility"),"DAA.req_feasibility_result",{labClass:"ecitic-radio-inline",value:str});
			      }else if(k=="req_develop_mode"){
			    	  initSelect(getCurrentPageObj().find("#DAAreq_develop_mode"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_REQ_DEVELOP_MODE"},str);
			      }else if(k=="req_demand_size"){
			    	  initSelect(getCurrentPageObj().find("#DAAreq_demand_size"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_REQ_SIZE"},str);
			      }else if(k=="req_type1"){
			    	  initSelect(getCurrentPageObj().find("#DAAreq_acc_type1"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_REQUIREMENT_TYPE1"},str);
			      }else if(k=="req_type2"){
			    	  initSelect(getCurrentPageObj().find("#DAAreq_acc_type2"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_REQUIREMENT_TYPE2"},str);
			      }else if(k=="req_come"){
			    	  initSelect(getCurrentPageObj().find("#DAAreq_acc_come"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_REQUIREMENT_SOURCE"},str);
			      }else if(k=="req_analytic_result"){
			    	  getCurrentPageObj().find("#DAAreq_analytic_result").val(str);
			      }else if(k=="req_quality"){
			    	  initSelect(getCurrentPageObj().find("#DAAreq_quality"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_REQ_QUALITY"},str);
			      }else if(k=="req_acc_classify"){
			    	  initSelect(getCurrentPageObj().find("#DAAreq_acc_classify"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_REQ_CLASSIFY"},str,"",["00"]);
			      }else if(k=="req_feasibility_explain"){
			    	  getCurrentPageObj().find("#DAAreq_feasibility_explain").val(str);
			      }else if(k=="file_id_assess"){
			    	  file_id_assess = str;
			      }else{
			    	  getCurrentPageObj().find("input[name='DAA."+k+"']").val(str);
			      }
			    }/*else if(k=="req_type1"&&str=="02"){
			    	 getCurrentPageObj().find('#hiddenStyle').hide();
				    	getCurrentPageObj().find('#project_id_org').removeAttr("validate");
				    	getCurrentPageObj().find('#project_id_org').val("");
			    	}*/
				}
			}
			if(req_state=="09"){
				getCurrentPageObj().find("input[name='DAA.file_id']").val(file_id_assess);//审批不通过需求重新评估的时候把需求评估表里的file_id赋值给DAAfile_id 
				if(f==1){
					//初始化流程数据
					initTitle(map["INSTANCE_ID"]);
					initReqApprovalDetailInfo(map["INSTANCE_ID"],'0');
				}
			}
		}
		 initReqPlanList();//初始化需求实施计划列表
		 initReqReturnDaCss(req_state);//初始化页面样式 
	},reqAssessCall);
}
var tableCall = getMillisecond();
//流程实例id
var instance_id="";
function initcontentPop(){
	getCurrentPageObj().find('#apphistoryPop').empty();
	getCurrentPageObj().find('#apphistoryPop').append(
		'<div class="ecitic-title">'+
			'<span>流程审批列表<em></em></span>'+
		'</div>'+
		'<div class="ecitic-new">'+
			'<table id="AFApprovalTableInfo" class="table table-bordered table-hover table-text-show"></table>'+
		'</div>'		
	);

}
/*审批列表表格初始化列表*/
function initReqApprovalDetailInfo(instance_id) {
	this.instance_id=instance_id;
	initcontentPop();
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	
	getCurrentPageObj().find('#AFApprovalTableInfo').bootstrapTable({
		url :'AFLaunch/queryAFApprovalLists.asp?instance_id='+instance_id+"&call="+tableCall,
		method : 'get', //请求方式（*）   
		striped : true, //是否显示行间隔色
		cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
		sortable : true, //是否启用排序
		sortOrder : "asc", //排序方式
		queryParams : queryParams,//传递参数（*）
		sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
		pagination : false, //是否显示分页（*）
		pageList : [5,10],//每页的记录行数（*）
		pageNumber : 1, //初始化加载第一页，默认第一页
		pageSize : 10,//可供选择的每页的行数（*）
		clickToSelect : false, //是否启用点击选中行
		uniqueId : "af_id", //每一行的唯一标识，一般为主键列
		cardView : false, //是否显示详细视图
		detailView : false, //是否显示父子表
		jsonpCallback:tableCall,
		singleSelect: true,
		onLoadSuccess:function (){
			setRowspan("AFApprovalTableInfo");
			gaveInfo();
		},
		columns : [{
			field : 'N_ID',
			title : '审批节点id',
			align : "center",
			visible:false
		},{
			field : 'N_NAME',
			title : '审批岗位',
			align : "center",
			valign: "middle"
		}, {
			field : "APP_PERSON",
			title : "工号",
			align : "center",
			visible:false
		}, {
			field : "APP_PERSON_NAME",
			title : "审批人",
			align : "center",
	        width : "30px"
		}, {
			field : "APP_STATE",
			title : "操作",
			align : "center",
			formatter:function(value,row,index){
      	  if(row.STATE_NAME){
      		  return row.STATE_NAME;
      	  } 
      	  return '--';
        },
        	
		}, {
			field : "APP_CONTENT",
			title : "审批意见",
			align : "center"
		}, {
			field : "OPT_TIME",
			title : "审批时间",
			align : "center"
		}]
	});
}
//合并单元格
function setRowspan(id){
	var tabledata=getCurrentPageObj().find('#'+id).bootstrapTable('getData');
	var n_name = tabledata[0].N_NAME;
	var j=0;
	var k=1;
	for(var i=1;i<tabledata.length;i++){
		if(n_name!=tabledata[i].N_NAME){
			getCurrentPageObj().find('#'+id).bootstrapTable('mergeCells',{index:j,field:'N_NAME',colspan:1,rowspan:k});
			j=i;
			k=1;
			n_name=tabledata[i].N_NAME;
		}else{
			k++;
		}
	}
	getCurrentPageObj().find('#'+id).bootstrapTable('mergeCells',{index:j,field:'N_NAME',colspan:1,rowspan:k});
}

//拿到需求评估受理页面所有输入的信息
function getRequirementAssessPageValue(){
	if(!vlidate($("#g_requirement_accept"),"",true)){
		 alert("请按要求填写图表中的必填项！");
		return ;
	}
	var inputs = $("input:text[name^='DAA.']");
	var hiddens = $("input:hidden[name^='DAA.']");
	var selects = $("select[name^='DAA.']");
	var radios = $("input:radio[name^='DAA.']:checked");
	var textareas = $("textarea[name^='DAA.']");
	var str=[];
	var params = {};
	//取值
	
	obj = document.getElementsByName("DAA.req_assess_level");
	 for(k in obj){
	        if(obj[k].checked)
	        	str.push(obj[k].value);
	    }
	 var req_assess_level=str.join(",");
	    params["req_assess_level"]=req_assess_level;
	    
		for(var i=0;i<inputs.length;i++){
			params[$(inputs[i]).attr("name").substr(4)] = $(inputs[i]).val();	 
		}
		
		for(var i=0;i<hiddens.length;i++){
			params[$(hiddens[i]).attr("name").substr(4)] = $(hiddens[i]).val();	 
		}
		
		for(var i=0;i<selects.length;i++){
			params[$(selects[i]).attr("name").substr(4)] = $(selects[i]).val(); 
		}
		
		for(var i=0;i<radios.length;i++){
			params[$(radios[i]).attr("name").substr(4)] = $(radios[i]).val();
		}
		
		for(var i=0;i<textareas.length;i++){
			params[$(textareas[i]).attr("name").substr(4)] = $(textareas[i]).val();
		}
		var req_id=getCurrentPageObj().find('#req_id_reqDA').val();
		if(req_id!=null&&req_id!=""){
	    params["req_id"]=req_id;
		}else{
			alert("获取主键id失败");
			return;
		}
	return params;
}

//初始化按钮
function initRequirementAssessBtn(){
	var currTab = getCurrentPageObj();
	//提交并保存
	currTab.find('#summitForApprove').click(function(){
		var req_id = currTab.find('#req_id_reqDA').val();
		var req_acc_result = currTab.find("input:radio[name='DAA.req_acc_result']:checked").val();
		if(req_acc_result=="01"){//结论为受理时
		  if(!vlidate($("#g_requirement_accept"),"",true)){
			  alert("您还有必填项未填或者输入有误");
			  return ;
		  }
		  /*var planData = getCurrentPageObj().find("#gRequirermentPlan").bootstrapTable("getData");
		  if(planData==null||planData==undefined||planData==""){
			  alert("您还没有编写实施计划！");
			  return;
		  }*/
		/*  var fileData = getCurrentPageObj().find("#reqAss_filetable").bootstrapTable("getData");
		  var fileCheck=false;
		  if(fileData==null||fileData==undefined||fileData==""){
			  alert("此需求未上传业务需求说明书，请补录！");
			  return;
		  }else{
			  for(var i=0;i<fileData.length;i++){
				  var file_type=fileData[i].FILE_TYPE;
				  if(file_type=="01"){
					  fileCheck=true; 
				  }
			  }
		  }
		  if(!fileCheck){
			 alert("此需求还未上传业务需求说明书，请补录！"); 
			 return;
		  }*/
		  
		  var DAAreq_analytic_result = currTab.find("#DAAreq_analytic_result").val();
		    if(DAAreq_analytic_result.length>150){
		    	alert("需求名称至多可输入150汉字！");
		    	return;
		    }
		    var DAAreq_feasibility_explain = currTab.find("#DAAreq_feasibility_explain").val();
		    if(DAAreq_feasibility_explain.length>100){
		    	alert("需求收益评估至多可输入100汉字！");
		    	return;
		    }
		  
		  var req_type = currTab.find("#DAAreq_acc_type1").val();
		  var item = {};
		  item["af_id"] = '22';//流程id
		  item["systemFlag"] = '03'; //systemFlag：系统标识（合同系统：00，项目系统：01，报销系统：02，工程管理：03）
		  item["biz_id"] = req_id;//业务id
		  item["n_orgmanager"] = $("#currentLoginNoOrg_no").val();
		  item["requirement_type"] = req_type;
		  item["r_project_group"] = currTab.find("#DAAgroup_id").val();
		  /*item["business_dpt_lead"] = getCurrentPageObj().find("#project_id_applicationadd").val();
		  */
		  item["business_dpt_lead"] = currTab.find("input[name='DA.create_person']").val();
		  //调用发起流程的函数
		  approvalProcess(item,function(data){
			  var params=getRequirementAssessPageValue();//拿到页面的值作为参数
			  baseAjaxJsonp(dev_construction+"requirement_accept/insertReqAccept.asp?SID="+SID, params , function(data) {
					if (data != undefined && data != null && data.result=="true") {
						baseAjaxJsonp(dev_construction+"requirement_accept/summitReqForApprove.asp?SID="+SID, {"req_id":req_id,"req_acc_result":req_acc_result,"req_acc_productman":req_acc_productman,"req_analysis":req_analysis} , function(data) {
							if (data != undefined && data != null && data.result=="true"){
								closePageTab("requirement_assess");
								alert("受理成功");
							}else{
								alert("保存成功，提交失败");
							}
						});
					}else{
						var mess=data.mess;
						alert("保存需求评估信息失败:"+mess);
					}
				});
		  });
		}else if(req_acc_result=="02"||req_acc_result=="03"){//退回和转交
			var req_acc_productman = currTab.find('#DAAreq_acc_productman').val();
			var req_analysis = currTab.find('#DAAreq_analysis').val();
			var req_acc_reason = currTab.find('#DAAreq_acc_reason').val();
			var req_analytic_result = currTab.find('#DAAreq_analytic_result').val();
			var file_id = currTab.find('#DAAfile_id').val();
			if(req_analytic_result==""||req_analytic_result==null){
				alert("请输入结论说明");
				return;
			}
			if(req_acc_result=="02"){
				if(req_acc_reason==""||req_acc_reason==null||req_acc_reason==" "){
					alert("请选择退回原因");
					return;
				}
			}
			if(req_acc_result=="03"){
				if(req_acc_productman==""||req_acc_productman==null){
					alert("转交时项目经理不能为空");
					return;
				}
			}
			baseAjaxJsonp(dev_construction+"requirement_accept/summitReqForApprove.asp?SID="+SID, {"req_id":req_id,"req_acc_result":req_acc_result,"req_acc_productman":req_acc_productman,"req_analysis":req_analysis,"req_acc_reason":req_acc_reason,"req_analytic_result":req_analytic_result,"file_id":file_id} , function(data) {
				if (data != undefined && data != null && data.result=="true"){
					alert("提交成功");
					closePageTab("requirement_assess");
				}else{
					alert("提交失败");
				}
			});
		}
	});
	
	
//测试工作量失去焦点事件
currTab.find('#DAAtest_workload').blur(function(){
	var dev_workload = currTab.find('#DAAdev_workload').val();
	    if(dev_workload==null||dev_workload==""){
	    	dev_workload="0";
	    }
	var test_workload = currTab.find('#DAAtest_workload').val();
	   if(test_workload==null||test_workload==""){
		   test_workload="0";
        }
	   currTab.find('#DAAreq_total_workload').val(parseInt(dev_workload)+parseInt(test_workload));
	
});

//开发工作量失去焦点事件
currTab.find('#DAAdev_workload').blur(function(){
	var dev_workload = currTab.find('#DAAdev_workload').val();
    if(dev_workload==null||dev_workload==""){
    	dev_workload="0";
    }
    var test_workload = currTab.find('#DAAtest_workload').val();
    if(test_workload==null||test_workload==""){
	   test_workload="0";
    }
   currTab.find('#DAAreq_total_workload').val(parseInt(dev_workload)+parseInt(test_workload));
	
});

//产品经理pop
currTab.find('#DAAreq_acc_productman_name').click(function(){
	openRoleUserPop("reqAccUserPop",{no:currTab.find('#DAAreq_acc_productman'),name:currTab.find('#DAAreq_acc_productman_name')},"0017",function(){
		return {"sup_org_no":"10101706"};
	});
});

//应用pop
currTab.find('#DAAsystem_name').click(function(){
	openTaskSystemPopByKeJi("reqAccSysPop",{sysno:currTab.find('#DAAsystem_id'),sysname:currTab.find('#DAAsystem_name')},function(row){
		currTab.find("#DAAgroup_id").val(row.RES_GROUP_ID);
	},function(){
		var org_name=$("#currentLoginNoOrg_name").val();
		currTab.find("#SPTres_group_name").prop({disabled:true}).val(org_name);
		return {res_group_name:org_name};
	});
 });

//需求分析师pop
currTab.find('#DAAreq_analysis_name').click(function(){
	openRoleUserPop("reqAccUserPop",{no:currTab.find('#DAAreq_analysis'),name:currTab.find('#DAAreq_analysis_name')},"0027",function(){
		getCurrentPageObj().find("#role_userPop .h30:eq(2)").hide();
		return {"org_code":$("#currentLoginNoOrg_no").val()};
	});
});

//版本pop
currTab.find('#DAAreq_version_name').click(function(){
	openTaskVersionPop("reqAccVersionPop",{versionsid:getCurrentPageObj().find('#DAAreq_version'),versionsname:getCurrentPageObj().find('#DAAreq_version_name'),vm:""});
});

//新增需求实施计划
currTab.find('#requirementPlan_add').click(function(){
	  openReqPlanPop("reqPlanPop","add",null);
 });
 
 //修改需求计划
currTab.find('#requirementPlan_update').click(function(){
	 var id = currTab.find("#gRequirermentPlan").bootstrapTable('getSelections');
		var ids=$.map(id, function (row) {return row.REQ_PLAN_ID;});
	if(id.length==1){
	  openReqPlanPop("reqPlanPop","update",ids);
		}else{
			alert("请选择一条数据进行修改");
		}
});
 //删除需求计划
currTab.find('#requirementPlan_delete').click(function(){
	 var id = currTab.find("#gRequirermentPlan").bootstrapTable('getSelections');
		var ids=$.map(id, function (row) {return row.REQ_PLAN_ID;});
		if(id.length==1){
		   nconfirm("是否删除？",function(){
		   baseAjaxJsonp(dev_construction+"requirement_accept/deleteReqPlanById.asp?SID="+SID+"&req_plan_id="+ids, null , function(data) {
			if (data != undefined && data != null && data.result=="true") {
				alert("删除成功");
				currTab.find('#gRequirermentPlan').bootstrapTable('refresh');
			}else{
				var mess=data.mess;
				alert("删除失败："+mess);
			}
		   });
		  });
		}else{
			alert("请选择一条数据删除");
		}
   });
 
//点击评估受理隐藏退回原因和项目经理,显示受理填写内容
 currTab.find("#DAAreq_acc_result1").click(function(){
	 hideTableLeftBorder(1);
	 currTab.find("#accept_assess_table tr:eq(0) td:gt(1)").show();
	 currTab.find("#accept_assess_table tr:eq(0) td:gt(5)").remove();
	 currTab.find("#DAA_acc_reason").hide();
	 currTab.find("#DAA_return_reason").hide();
	 currTab.find("#DAAreq_acc_reason").val(" ");
	 currTab.find("#DAAreq_acc_reason").select2();
	 currTab.find("#DAA_acc_productman").hide();
	 currTab.find("#DAAreq_acc_productman_name").hide();
	 currTab.find("#DAAreq_acc_productman_name").val("");
	 //currTab.find("#DAA_acc_explain").parent().hide();
	 //currTab.find("#DAAreq_acc_explain").parent().hide();
	 //currTab.find("#DAAreq_acc_explain").val("");
	 
	 currTab.find('#req_property_title').parent().show();
	 currTab.find('#DAAreq_acc_classify').parent().parent().parent().parent().show();
	 currTab.find('#req_access_title').parent().show();
	 currTab.find('#DAAreq_analysis_name').parent().parent().parent().parent().show();
	 currTab.find('#req_feasibility_title').parent().show();
	 currTab.find('#DAA_acc_feasibility').parent().parent().parent().parent().show();
	 currTab.find('#req_access_budget').parent().show();
	 currTab.find('#DAAreq_expense').parent().parent().parent().parent().show();
	 currTab.find('#req_access_plan').parent().show();
	 currTab.find('#requirementPlan_add').parent().parent().show();
	// currTab.find('#DAAfile_id').parent().show();
	 currTab.find('#reqAssAdd_file').parent().parent().show();
 });
 //点击退回显示退回原因隐藏项目经理和受理填写信息
 currTab.find("#DAAreq_acc_result2").click(function(){
	 showTableLeftBorder(1);
	 hideTableLeftBorder(3);
	 currTab.find("#accept_assess_table tr:eq(0) td:gt(5)").remove();
	 currTab.find("#DAA_acc_reason").show(); 
	 currTab.find("#DAA_acc_reason").parent().show();
	 currTab.find("#DAA_return_reason").show();
	 currTab.find("#DAA_return_reason").parent().show();
	 //currTab.find("#DAA_acc_explain").parent().show();
	 //currTab.find("#DAAreq_acc_explain").parent().show();
	 currTab.find("#DAA_acc_productman").hide();
	 currTab.find("#DAAreq_acc_productman_name").hide();
	 currTab.find("#DAAreq_acc_productman_name").val("");
	 currTab.find("#DAAreq_acc_productman").val("");
	 
	 currTab.find('#req_property_title').parent().hide();
	 currTab.find('#DAAreq_acc_classify').parent().parent().parent().parent().hide();
	 currTab.find('#req_access_title').parent().hide();
	 currTab.find('#DAAreq_analysis_name').parent().parent().parent().parent().hide();
	 currTab.find('#req_feasibility_title').parent().hide();
	 currTab.find('#DAA_acc_feasibility').parent().parent().parent().parent().hide();
	 currTab.find('#req_access_budget').parent().hide();
	 currTab.find('#DAAreq_expense').parent().parent().parent().parent().hide();
	 currTab.find('#req_access_plan').parent().hide();
	 currTab.find('#requirementPlan_add').parent().parent().hide();
	 currTab.find('#DAAfile_id').parent().hide();
	 currTab.find('#reqAssAdd_file').parent().parent().hide();
 });
 //点击转交显示产品经理，隐藏退回原因以及受理填写信息
 currTab.find("#DAAreq_acc_result3").click(function(){
	 currTab.find("#accept_assess_table tr:eq(0) td:gt(5)").remove();
	 currTab.find("#accept_assess_table tr:eq(0)").append("<td colspan=2></td>");
	 showTableLeftBorder(1);
	 hideTableLeftBorder(5);
	 currTab.find("#DAA_acc_productman").show();
	 currTab.find("#DAAreq_acc_productman_name").show();
	 currTab.find("#DAA_acc_reason").parent().hide();
	 currTab.find("#DAA_return_reason").parent().hide();
	 currTab.find("#DAAreq_acc_reason").val(" ");
	 currTab.find("#DAAreq_acc_reason").select2();
	 //getCurrentPageObj().find("#DAA_acc_explain").parent().hide();
	 //getCurrentPageObj().find("#DAAreq_acc_explain").parent().hide();
	 
	 currTab.find('#req_property_title').parent().hide();
	 currTab.find('#DAAreq_acc_classify').parent().parent().parent().parent().hide();
	 currTab.find('#req_access_title').parent().hide();
	 currTab.find('#DAAreq_analysis_name').parent().parent().parent().parent().hide();
	 currTab.find('#req_feasibility_title').parent().hide();
	 currTab.find('#DAA_acc_feasibility').parent().parent().parent().parent().hide();
	 currTab.find('#req_access_budget').parent().hide();
	 currTab.find('#DAAreq_expense').parent().parent().parent().parent().hide();
	 currTab.find('#req_access_plan').parent().hide();
	 currTab.find('#requirementPlan_add').parent().parent().hide();
	 currTab.find('#DAAfile_id').parent().hide();
	 currTab.find('#reqAssAdd_file').parent().parent().hide();
 });
 
}

//根据流程分类改变应用是否隐藏
function changeSysMust(){
	var req_classify=getCurrentPageObj().find('#DAAreq_acc_classify').val();
	    if(req_classify=="03"){//流程类别是新项目需求时隐藏应用名称和清空值,去除必填
	    	getCurrentPageObj().find('#system_name_hide').hide();
	    	getCurrentPageObj().find('#system_id_hide').hide();
	    	getCurrentPageObj().find('#system_id_hide+strong').hide();
	    	getCurrentPageObj().find('#DAAsystem_name').removeAttr("validate");
	    	getCurrentPageObj().find('#DAAsystem_id').val("");
	    	getCurrentPageObj().find('#DAAsystem_name').val("");
	    }else{
	    	getCurrentPageObj().find('#system_name_hide').show();
	    	getCurrentPageObj().find('#system_id_hide').show();
	    	getCurrentPageObj().find('#system_id_hide+strong').show();
	    	getCurrentPageObj().find('#DAAsystem_name').attr("validate","v.required");
	    }
	
}

//根据需求大类显示或隐藏主管业务部门
function showOrHideBusinessOrg(){
 var req_type1=getCurrentPageObj().find('#DAAreq_acc_type1').val();	
	if(req_type1=='01'){//需求大类为需求申请书时显示主管业务部门
		getCurrentPageObj().find('#business_org_hide').show();
		getCurrentPageObj().find('#project_id_org').show();
		getCurrentPageObj().find('#project_id_org').attr("validate","v.required");
		getCurrentPageObj().find('#project_id_org+strong').show();
		var project_id = getCurrentPageObj().find('#req_dept_idDA').html();//主管部门id
		var name = getCurrentPageObj().find('#req_dept_reqDA').html();//主管部门name
    	getCurrentPageObj().find('#project_id_applicationadd').val(project_id);
    	getCurrentPageObj().find('#project_id_org').val(name);
	}else{
		getCurrentPageObj().find('#business_org_hide').hide();
		getCurrentPageObj().find('#project_id_org').hide();
		getCurrentPageObj().find('#project_id_org').val("");
		getCurrentPageObj().find('#project_id_applicationadd').val("");
		getCurrentPageObj().find('#project_id_org').removeAttr("validate");
		getCurrentPageObj().find('#project_id_org+strong').hide();
	}
	
}

function showTableLeftBorder(i){
	getCurrentPageObj().find("#accept_assess_table tr:eq(0) td:gt("+i+")").css("border-left","1px solid #ddd");
}
function hideTableLeftBorder(i){
	getCurrentPageObj().find("#accept_assess_table tr:eq(0) td:gt("+i+")").css("border-left",0);
}


//初始化隐藏分发退回原因和需求评估信息及计划；隐藏或显示需求评估收益样式
function initReqReturnDaCss(req_state){
	var currTab = getCurrentPageObj();
	/*var req_dis_result=currTab.find('input:radio[name="DA.req_dis_result"]:checked').val();
	if(req_dis_result=='01'){//分发结论为接受时隐藏退回原因
		currTab.find("#return_reasonDA").parent().hide();
		currTab.find("#req_return_reasonDA").parent().hide();
	}*/
	//显示或隐藏转交说明
	var req_acc_result=currTab.find('#DARreq_acc_result').val();
	if(req_acc_result=="03"){//当受理结论是转交时显示转交说明
		currTab.find('#ulthird').show();//显示转交说明tab
	}
	//隐藏或显示业务部门
	if(req_state=="09"){
	var req_type1 = currTab.find('#DAAreq_acc_type1').val();
	  if(req_type1!="01"){//需求大类不是申请书时隐藏业务部门
		  currTab.find('#business_org_hide').hide();
		  currTab.find('#project_id_org').hide();
		  currTab.find('#project_id_org').val("");
		  currTab.find('#project_id_applicationadd').val("");
		  currTab.find('#project_id_org').removeAttr("validate");
		  currTab.find('#project_id_org+strong').hide();
	  }
	}
	
	//当为待评估状态时默认评估结论为转交
	if(req_state=="04"){
	  //初始化评估结论和样式
	  currTab.find('#DAAreq_acc_result3').attr("checked",true);//默认为转交
	  //隐藏退回原因和退回理由，显示转交产品经理,隐藏需填写的内容
	  currTab.find("#accept_assess_table tr:eq(0) td:gt(5)").remove();
		 currTab.find("#accept_assess_table tr:eq(0)").append("<td colspan=2></td>");
		 showTableLeftBorder(1);
		 hideTableLeftBorder(5);
		 currTab.find("#DAA_acc_productman").show();
		 currTab.find("#DAAreq_acc_productman_name").show();
		 currTab.find("#DAA_acc_reason").parent().hide();
		 currTab.find("#DAA_return_reason").parent().hide();
		 currTab.find("#DAAreq_acc_reason").val(" ");
		 currTab.find("#DAAreq_acc_reason").select2();
		 
		 currTab.find('#req_property_title').parent().hide();
		 currTab.find('#DAAreq_acc_classify').parent().parent().parent().parent().hide();
		 currTab.find('#req_access_title').parent().hide();
		 currTab.find('#DAAreq_analysis_name').parent().parent().parent().parent().hide();
		 currTab.find('#req_feasibility_title').parent().hide();
		 currTab.find('#DAA_acc_feasibility').parent().parent().parent().parent().hide();
		 currTab.find('#req_access_budget').parent().hide();
		 currTab.find('#DAAreq_expense').parent().parent().parent().parent().hide();
		 currTab.find('#req_access_plan').parent().hide();
		 currTab.find('#requirementPlan_add').parent().parent().hide();
		 currTab.find('#DAAfile_id').parent().hide();
		 currTab.find('#reqAssAdd_file').parent().parent().hide();
	}else{//转交状态和审批退回默认为受理
		  currTab.find('#DAAreq_acc_result1').attr("checked",true);//默认为接受
		  //隐藏退回原因，产品经理和退回理由
		  currTab.find("#DAA_acc_reason").hide();
		  currTab.find("#DAA_return_reason").hide();
		  currTab.find("#DAAreq_acc_reason").val("");
		  currTab.find("#DAAreq_acc_reason").select2();
		  currTab.find("#DAA_acc_productman").hide();
		  currTab.find("#DAAreq_acc_productman_name").hide();
		  currTab.find("#DAAreq_acc_productman_name").val("");
		  currTab.find("#DAA_acc_explain").parent().hide();
	}
	 //初始化附件列表
	 initReqDetailFileList(); 
}

//初始化附件列表
function initReqDetailFileList(){
	var reqinfofile_id = getCurrentPageObj().find("#file_id_reqDA").val();
	var reqinfotablefile = getCurrentPageObj().find("#reqinfo_file");
	//初始化需求信息附件列表
	getSvnFileList(reqinfotablefile, getCurrentPageObj().find("#reqinfo_fileview_modal"), reqinfofile_id, "0101",function(){
		appendTablefile();
	});
	//需求工作量评估附件上传
	/*var business_code = getCurrentPageObj().find("#DAAfile_id").val();
	var tablefile = getCurrentPageObj().find("#reqAss_filetable");*/
	/*if(!business_code){
		business_code = Math.uuid();
		getCurrentPageObj().find("#DAAfile_id").val(business_code);
	}
	//点击打开模态框
	var addfile = getCurrentPageObj().find("#reqAssAdd_file");
	addfile.click(function(){
		var paramObj = new Object();
		paramObj.FILE_DIR = business_code;
		openFileFtpUpload(getCurrentPageObj().find("#reqAss_modalfile"), tablefile, 'GZ1063',business_code, '0102', 'S_DIC_REQ_ACC_FILE', false, false, paramObj);
	});
	//附件删除
	var delete_file = getCurrentPageObj().find("#reqAssdelete_file");
	delete_file.click(function(){
		delFtpFile(tablefile, business_code, "0102");
	});*/
	
	//初始化附件列表
//	getFtpFileList(tablefile, getCurrentPageObj().find("#reqAss_fileview_modal"), business_code, "0102");	
}
function appendTablefile(){
	var reqinfotablefile = getCurrentPageObj().find("#reqinfo_file");
	var business_code = getCurrentPageObj().find("#DAAfile_id").val();
	baseAjax("sfile/queryFTPFileByBusinessCode.asp",{business_code:business_code, phase:'0102'},function(data){
		reqinfotablefile.bootstrapTable("append",data);
	},false);
}




//初始化实施计划列表
function initReqPlanList(){
	var req_id=$('#req_id_reqDA').val();
	var queryParams = function(params) {
		var temp = {
			limit : params.limit, // 页面大小
			offset : params.offset
		// 页码
		};
		return temp;
	};
	var reqPlanCall = getMillisecond();
	$('#gRequirermentPlan').bootstrapTable("destroy").bootstrapTable({
				url :dev_construction+"requirement_accept/queryReqPlanList.asp?SID="+SID+"&req_id="+req_id+"&call="+reqPlanCall,
				method : 'get', // 请求方式（*）
				striped : false, // 是否显示行间隔色
				cache : false, // 是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
				sortable : true, // 是否启用排序
				sortOrder : "asc", // 排序方式
				queryParams : queryParams,// 传递参数（*）
				sidePagination : "server", // 分页方式：client客户端分页，server服务端分页（*）
				pagination : true, // 是否显示分页（*）
				pageList : [ 5, 10, 15 ], // 可供选择的每页的行数（*）
				pageNumber : 1, // 初始化加载第一页，默认第一页
				pageSize : 10, // 每页的记录行数（*）
				clickToSelect : true, // 是否启用点击选中行
				// height: 460, //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
				uniqueId : "REQ_PLAN_ID", // 每一行的唯一标识，一般为主键列
				cardView : false, // 是否显示详细视图
				detailView : false, // 是否显示父子表
				jsonpCallback:reqPlanCall,
				singleSelect : true,// 复选框单选
				columns : [{
					checkbox : true,
					rowspan : 2,
					align : 'center',
					valign : 'middle'
				},{
					field : 'REQ_PLAN_ID',
					title : '计划id',
					align : "center",
					visible:false,
				},{
					field : 'REQ_PLAN_NAME',
					title : '计划名称',
					align : "center",
				},{
					field : 'PLAN_STARTTIME',
					title : '计划开始时间',
					align : "center",
				}, {
					field : 'PLAN_ENDTIME',
					title : '计划结束时间',
					align : "center"
				}, {
					field : "PLAN_CONTENT",
					title : "计划内容",
					align : "center"
				}]
			});
}



