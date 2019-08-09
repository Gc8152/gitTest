initRequirementUpdateDicCode();
initRequirementUpdateBtn();
initRequirementUpdateOrg();

//初始化字典
function initRequirementUpdateDicCode(){
	autoInitRadio({dic_code:"G_DIC_REQUIREMENT_LEVEL"},getCurrentPageObj().find("#req_level_rr"),"RR.req_level",{labClass:"ecitic-radio-inline",value:"03"});
}

function initReqUpdateLayout(ids){
	var currTab = getCurrentPageObj();
	 var reqReturnCall=getMillisecond();//加入时间戳，防止多次请求返回数据不能识别
	 baseAjaxJsonp(dev_construction+"requirement_input/queryReqAddApprovetList.asp?SID="+SID+"&req_id="+ids+"&call="+reqReturnCall, null , function(data) {
		 var map=data.rows[0];
	     for(var k in map){
			var str=map[k];
				k = k.toLowerCase();//大写转换为小写
					    if(k=="req_level"){
					    	getCurrentPageObj().find("input[name='RR."+k+"']"+"[value="+str+"]").attr("checked",true);
					    }else if(k=="req_income_doc"){
							currTab.find("#req_income_doc_reqRR").val(str);
						}else if(k=="req_description"){
							currTab.find("#req_description_reqRR").val(str);
						}else if(k=="req_dis_view"){
							currTab.find("#req_dis_viewRR").val(str);
						}else if(k=="put_dept_opinion"){
							currTab.find("#put_dept_opinion_reqRR").val(str);	
						}else if(k=="instance_id"&&map["INSTANCE_ID"]!=undefined){
							initReqApprovalDetailInfo(map["INSTANCE_ID"],'0');
						}else{
							currTab.find("input[name='RR."+k+"']").val(str);//file_id和assfile_id都在这里赋值进来了
						}
					}
			initReqReturnIncomeCss();//初始化文件列表
 },reqReturnCall);
	
}

//获取页面输入的值
function gerReqUpdatePageValue(){
	if(!vlidate($("#g_requirement_infoadd_return"),"",true)){
		 alert("请按要求填写图表中的必填项！");
		return ;
	}
	 var inputs = getCurrentPageObj().find("input:text[name^='RR.']");
	 var hiddens =getCurrentPageObj().find("input:hidden[name^='RR.']");
	 var selects = getCurrentPageObj().find("select[name^='RR.']");
	 var radios = getCurrentPageObj().find("input:radio[name^='RR.']:checked");
	 var textareas = getCurrentPageObj().find("textarea[name^='RR.']");
	 var params = {};
	//取值
		for(var i=0;i<inputs.length;i++){
			params[$(inputs[i]).attr("name").substr(3)] = $(inputs[i]).val();	 
		}
		
		
		for(var i=0;i<hiddens.length;i++){
			params[$(hiddens[i]).attr("name").substr(3)] = $(hiddens[i]).val();	 
		}
		
		for(var i=0;i<selects.length;i++){
			params[$(selects[i]).attr("name").substr(3)] = $(selects[i]).val(); 
		}
		
		for(var i=0;i<radios.length;i++){
			params[$(radios[i]).attr("name").substr(3)] = $(radios[i]).val();
		}
		
		for(var i=0;i<textareas.length;i++){
			params[$(textareas[i]).attr("name").substr(3)] = $(textareas[i]).val();
		}
		
		var req_id=getCurrentPageObj().find("#req_id_reqRR").val();
		if(req_id==null&&req_id==""){
			alert("未能获取主键id，更新失败");
			return;
		}
	return params;
}

//初始化按钮
function initRequirementUpdateBtn(){
	//保存并提交
	getCurrentPageObj().find('#submit_reqReturn').click(function(){
		if(!vlidate($("#g_requirement_infoadd_return"),"",true)){
			return ;
		}
		var req_name_reqRR=getCurrentPageObj().find("#req_name_reqRR").val();
	    if(req_name_reqRR.length>100){
	    	alert("需求名称至多可输入100汉字！");
	    	return;
	    }
	    var req_income_doc_reqRR=getCurrentPageObj().find("#req_income_doc_reqRR").val();
	    var rid=getCurrentPageObj().find('#req_income_doc_reqRR').attr("placeholder");
	      if(req_income_doc_reqRR!=rid){
		       if(req_income_doc_reqRR.length>50){
		    	alert("需求收益评估至多可输入50汉字！");
		    	return;
		       };
	    }
	    var req_description_reqRR=getCurrentPageObj().find("#req_description_reqRR").val();
	    if(req_description_reqRR.length>150){
	    	alert("需求概述至多可输入150汉字！");
	    	return;
	    }
	    var put_dept_opinion_reqRR=getCurrentPageObj().find("#put_dept_opinion_reqRR").val();
	    if(put_dept_opinion_reqRR.length>50){
	    	alert("主管部门意见至多可输入50汉字！");
	    	return;
	    }
		var filedata = getCurrentPageObj().find("#reqRR_tablefile").bootstrapTable("getData");
		if(filedata==""||filedata==undefined){
			  alert("该需求还未上传需求申请书！");
			  return;
		}
		var fileData1 = getCurrentPageObj().find("#reqAssRR_filetable").bootstrapTable("getData");
	   // var fileCheck=false;
		if(fileData1==null||fileData1==undefined||fileData1==""){
			alert("此需求未上传业务需求说明书！");
		  return;
		}/*else{
			for(var i=0;i<fileData1.length;i++){
				  var file_type=fileData1[i].FILE_TYPE;
				  if(file_type=="01"){
					  fileCheck=true; 
				  }
		  	}
		}*/
		returnSubmit();
	});
	function returnSubmit(){
		  //获取页面输入的值
	    var params=gerReqUpdatePageValue();
	        var req_income_doc=params.req_income_doc;
	        var rid=getCurrentPageObj().find('#req_income_doc_reqRR').attr("placeHolder");
		      if(req_income_doc==rid){
		    	  params["req_income_doc"]="";
		      }
		      var put_dept_opinion=params.put_dept_opinion;
		      var pdo=getCurrentPageObj().find('#put_dept_opinion_reqRR').attr("placeHolder");
		      if(put_dept_opinion==pdo){
		    	  params["put_dept_opinion"]=""; 
		      }
	    baseAjaxJsonp(dev_construction+'requirement_input/updateRequirementInfo.asp?SID='+SID+'&p_owner='+'&req_state=15', params , function(data) {
			if (data != undefined && data != null && data.result=="true") {
				var items = {};
				items["af_id"] = '184';//流程id
				items["systemFlag"] = '02'; //systemFlag：系统标识（合同系统：00，项目系统：01，报销系统：02，工程管理：03 外包管理：04）
				items["biz_id"] = 'ap'+params.req_id;//为防止与需求审批流程发生冲突，需求id增加前缀ap作为业务id
				approvalProcess(items,function(data){
					alert("更新并提交审批成功");
				});
				closeCurrPageTab();
			}else{
				var mess=data.mess;
				alert("更新失败:"+mess);
			}
		});
	}	
}

//初始化需求收益估算和理由样式
function initReqReturnIncomeCss(){
	var tablefile = getCurrentPageObj().find("#reqRR_tablefile");
	var business_code = "";
	 business_code = getCurrentPageObj().find("#file_id_reqRR").val();
	 if(!business_code){
		 business_code = Math.uuid();
		 getCurrentPageObj().find("#file_id_reqRR").val(business_code);
	 }
	//需求申请书上传
	 var addfile = getCurrentPageObj().find("#reqRR_addfile");
	addfile.click(function(){
		var paramObj = new Object();
		 paramObj.FILE_DIR = business_code;
		 openFileSvnUpload(getCurrentPageObj().find("#reqRR_filemodal"), tablefile, 'GZ1063',business_code, '0101', 'S_DIC_REQ_PUT_FILE', false,false, paramObj);
	});
	//附件删除
	var delete_file = getCurrentPageObj().find("#reqRR_deletefile");
	delete_file.click(function(){
		delSvnFile(tablefile, business_code, "0101");
	});
	//初始化附件列表
	getSvnFileList(tablefile,getCurrentPageObj().find("#reqRR_fileview_modal"),business_code,"0101");
	
	var business_codeass = "";
	business_codeass = getCurrentPageObj().find("#assfile_id_reqRR").val();
	 if(!business_codeass){
		 business_codeass = Math.uuid();
		 getCurrentPageObj().find("#assfile_id_reqRR").val(business_codeass);
	 }
	//业务需求说明书附件上传
	var assTablefile = getCurrentPageObj().find("#reqAssRR_filetable");
	var addfile = getCurrentPageObj().find("#reqRR_assAddfile");
	addfile.click(function(){
		var paramObj1 = new Object();
		 paramObj1.FILE_DIR = business_codeass;
		 openFileSvnUpload(getCurrentPageObj().find("#reqAssRR_filemodal"), assTablefile, 'GZ1063',business_codeass, '0102', 'S_DIC_REQ_ACC_FILE', false,false, paramObj1);
	});
	//附件删除
	var delete_file = getCurrentPageObj().find("#reqRR_assDelfile");
	delete_file.click(function(){
		delSvnFile(assTablefile,business_codeass, "0102");
	});
	//初始化附件列表
	getSvnFileList(assTablefile,getCurrentPageObj().find("#reqAssRR_fileview_modal"),business_codeass,"0102");
	
}
//初始化部门
function initRequirementUpdateOrg(){
	//主管部门
	$("#req_dept_reqRR_org").click(function(){
		$(".drop-ztree").hide();
//		$("#reqPutUpdate_tree_id").hide();
		openSelectTreeDiv($(this),"reqUpdate_tree_id1","SOrg/queryOrgTreeWithCenterList.asp",{"margin-top": "2px",width:"88%"},function(node){
			$("#req_dept_reqRR").val(node.name);
			$("#req_dept_reqRR_org").val(node.id);
			$("#reqUpdate_tree_id1").hide();
		});
	});
	$("#req_dept_reqRR_org").focus(function(){
		$("#req_dept_reqRR").click();
	});
	
//提出部门		
	$("#req_put_dept_reqRR_org").click(function(){
//		$("#reqUpdate_tree_id").hide();
		$(".drop-ztree").hide();
		openSelectTreeDiv($(this),"reqPutUpdate_tree_id1","SOrg/queryOrgTreeWithCenterList.asp",{"margin-top": "2px",width:"88%"},function(node){
			$("#req_put_dept_reqRR").val(node.name);
			$("#req_put_dept_reqRR_org").val(node.id);
			$("#reqPutUpdate_tree_id1").hide();
		});
	});
	$("#req_put_dept_reqRR_org").focus(function(){
		$("#req_put_dept_reqRR").click();
	});	
	
//会签部门
	var obj=getCurrentPageObj().find('#req_countersign_org_reqRR');
	obj.click(function(){
		openOrgTreePop("req_countersign_org_pop",null,{id:getCurrentPageObj().find("#req_countersign_dept_reqRR"),name:getCurrentPageObj().find("#req_countersign_org_reqRR")});
	});	
	
}

var instance_id="";
function initcontentPop(){
	getCurrentPageObj().find('#apphistoryPop').empty();
	getCurrentPageObj().find('#apphistoryPop').append(
		'<div class="ecitic-title">'+
			'<span>流程审批列表<em></em></span>'+
		'</div>'+
		'<div class="ecitic-new">'+
			'<table id="AFApprovalTableInfo" class="table table-bordered table-hover"></table>'+
		'</div>'		
	);

}

var tableCall = getMillisecond();
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
			align : "center"
		}, {
			field : "APP_STATE",
			title : "操作",
			align : "center",
			formatter:function(value,row,index){
        	  if(row.STATE_NAME){
        		  return row.STATE_NAME;
        	  } 
        	  return '--';
          }
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
