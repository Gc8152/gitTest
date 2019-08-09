
/**
 * 初始化考核模板信息
 * @param template_id
 */
//定义考核项的序号
var number=1;
var currTab = getCurrentPageObj(); //获取页面对象
var t_table = currTab.find("#template_assess_table");//表格对象
function optTemplate_configuration(template_id){
	var calls = getMillisecond();
	baseAjaxJsonp(dev_outsource+"OptTemplate/queryOneTemplateInfo.asp?template_id="+template_id+"&SID="+SID+"&call="+calls,null,function(data){
		if(data){
			var templateInfoval = data["templateInfo"];
			for(var p in templateInfoval){
				var projectKey = p.toLowerCase();
				if(projectKey == "template_id"){
					currTab.find("#OTD_"+projectKey).val(template_id||"");
				}else if(projectKey=="detail_id"){
					currTab.find("#OTD_"+projectKey).val(templateInfoval[p]||"");
				}else{
					currTab.find("div[id=OTD_"+projectKey+"]").text(templateInfoval[p]||"");
				}
		}
			TemplateInfo(template_id);//初始化考核项父表
			initMoreMsgPOPBtn(template_id);//初始化按钮操作
		}
},calls);

//按钮操作
function initMoreMsgPOPBtn(template_id){
	/*******模板配置*******/
	//新增
	currTab.find("#add_assess").unbind("click");
	currTab.find("#add_assess").click(function(){
		currTab.find('#opModal_template_assess').modal('show');
		currTab.find('#myModalLabel').text("新增考核项");
		currTab.find("#template_table").find("input").each(function(){ $(this).val(""); });
		currTab.find("#template_table").find("textarea").each(function(){ $(this).val(""); });
		saveTemplateMsg(template_id,"add");
		
	});
	
	//点击考核项目事件
	currTab.find("#check_item_name").click(function(){
		openCheckDicPop("checkDic_pop",{
			check_item_name : currTab.find("#check_item_name"),
			check_item_one : currTab.find("#check_item_one"),
			one_score : currTab.find("#one_score")
		});
	});
 }

//加载考核项父类
function TemplateInfo(template_id){
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	
		var url =  dev_outsource+'OptTemplate/queryAllTemplateDetailInfoById.asp?SID='+SID+"&call="+calls+"&template_id="+template_id;
		t_table.bootstrapTable({
			url : url,//请求后台的URL（*）
			method : 'get', //请求方式（*）   
			striped : false, //是否显示行间隔色
			cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）escape(encodeURIComponent(user_name))
			sortable : true, //是否启用排序
			sortOrder : "asc", //排序方式
			queryParams : queryParams,//传递参数（*）
			sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
			pagination : false, //是否显示分页（*）
			pageList : [100],//每页的记录行数（*）
			pageNumber : 1, //初始化加载第一页，默认第一页
			pageSize : 10,//可供选择的每页的行数（*）
			clickToSelect : true, //是否启用点击选中行
			uniqueId : "TEM_DETAILID", //每一行的唯一标识，一般为主键列
			cardView : false, //是否显示详细视图
			detailView : true, //是否显示父子表
			jsonpCallback:calls,
			singleSelect: true,
			onLoadSuccess:function(data){
			},
			columns : [ {
				field : 'TEM_DETAILID',
				title : '主键',
				align : "center",
				visible:false
			},{
				field : 'ITEM_CODE',
				title : '考核项编号',
				align : "center",
				visible:false
			},{
				field : 'CHECK_ITEM_NAME',
				title : '考核项',
				align : "center",
				width :"30%"
			},{
				field : 'ONE_SCORE',
				title : '考核评分',
				align : "center",
				width :"15%"
			},{
				field : 'RANK_DESC',
				title : '考核依据',
				align : "center",
				width:"30%"
			},{
				field : 'handle',
				title : '操作',
				align : "center",
				width:"20%",
				formatter:function (value,row,index){
					return '<input align="center" onclick="updateRow(\''+row.TEM_DETAILID+'\')" type="button" class="btn btn-ecitic" value="修改" />'+
					       '<input align="center" onclick="delRow(\''+row.TEM_DETAILID+'\')" type="button" class="btn btn-ecitic" value="删除" />';
				}
			}],
			onExpandRow:function(index,row,$detail){
				InitOptTable(index,row,$detail);
			}
		});
   }	
}
//删除一行数据
function delRow(TEM_DETAILID){
	
  nconfirm("确定删除此考核项吗？",function(){
	  var delCall = getMillisecond();
		var url = dev_outsource+"OptTemplate/delOptTemplateDetail.asp?id="+TEM_DETAILID+"&SID="+SID+"&call="+delCall;//此时获取到的是选中行的id
		baseAjaxJsonp(url, null, function(data){
			if(data != undefined && data != null && data.result == 'true'){
				alert("删除成功!");
				t_table.bootstrapTable('refresh');
			}else{
				alert("删除失败!");
			}
		},delCall); 
	  
  });
	
}

//修改一行数据
function updateRow(TEM_DETAILID){
	getCurrentPageObj().find('#opModal_template_assess').modal('show');
	getCurrentPageObj().find('#myModalLabel').text("修改考核项");
	var template_id = "";
	baseAjaxJsonp(dev_outsource+"OptTemplate/queryOneTemplateDetail.asp?id="+TEM_DETAILID+"&SID="+SID+"&call="+calls,null,function(data){
		if(data){
			var templateDetailMap = data["templateDetailMap"];
			template_id = templateDetailMap["TEMPLATE_ID"];
			for(var p in templateDetailMap){
				var projectKey = p.toLowerCase();
				getCurrentPageObj().find("[name='OTDD."+projectKey+"']").val(templateDetailMap[p]);
			}
		}
	},calls);
	saveTemplateMsg(template_id,"update");
}

//配置详情保存逻辑
function saveTemplateMsg(template_id,status){
	currTab = getCurrentPageObj();
	var saveCall = getMillisecond();
	//点击保存
	currTab.find("#saveTemplateInfo").unbind("click");
	currTab.find("#saveTemplateInfo").click(function(){
		var params = {};
		 var vals = currTab.find("[name^='OTDD.']");//AC是新增数据的前缀
		 for(var i=0;i<vals.length;i++){
			 var val=$(vals[i]);
			 if($.trim(val.val())!=""){
				 params[val.attr("name").substr(5)]=val.val();//把属性值放到params这个集合里
			 }
		 }
		 var tips = "";
		 if(status=="add"){
			 tips = "添加";
		 }else{
			 tips = "修改";
		 }
			var url = dev_outsource+"OptTemplate/insertOrUpdateOptTemplateDetail.asp?template_id="+template_id+"&SID="+SID+"&call="+saveCall;
			baseAjaxJsonp(url, params, function(data){
				if(data != undefined && data != null && data.result == 'true'){
					alert(tips+"成功!");
					currTab.find('#opModal_template_assess').modal('hide');
					currTab.find("#template_assess_table").bootstrapTable('refresh');
				}else{
					alert(tips+"失败!");
				}
			},saveCall);
  });
}
//加载考核项子类
InitOptTable=function (index,row,$detail){
	var parentid=row.ITEM_CODE;
	var cur_table=$detail.html('<table></table>').find('table');
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	$(cur_table).bootstrapTable({
		url : dev_outsource+'OptTemplate/querySonTemplateDetailInfo.asp?itemcode='+parentid+"&SID="+SID+"&call="+calls,//请求后台的URL（*）
		method : 'get', //请求方式（*）   
		cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）escape(encodeURIComponent(user_name))
		sortable : true, //是否启用排序
		sortOrder : "asc", //排序方式
		queryParams : queryParams,//传递参数（*）
		//ajaxOptions:{strParentID:parentid},
		sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
		pagination : false, //是否显示分页（*）
		pageList : [5,10],//每页的记录行数（*）
		pageNumber : 1, //初始化加载第一页，默认第一页
		pageSize : 10,//可供选择的每页的行数（*）
		clickToSelect : true, //是否启用点击选中行
		uniqueId : "ID", //每一行的唯一标识，一般为主键列
		cardView : false, //是否显示详细视图
		detailView : false, //是否显示父子表
		jsonpCallback:calls,
		singleSelect: true,
		onLoadSuccess:function(data){
		},
		columns : [ {
			field : 'ID',
			title : '主键',
			align : "center",
			visible:false
		},{
			field : 'ONE_SCORE',
			title : '考核得分区间',
			align : "center"
		
		},{
			field : 'RANK_DESC',
			title : '考核依据',
			align : "center"
		} ],
		onExpandRow:function(index,row,$detail){
			oInit.InitOptTable(index,row,$detail);
		}
	});
};


//删除行后重新排序
function reOrder(){
	var rownumJiazds = getCurrentPageObj().find(".rownumJiazd");
	for(var i=0;i<rownumJiazds.length;i++){
		$(rownumJiazds[i]).html(i+1);
	}
}

function checkNum(obj){
	var reg = new RegExp("^[0-9]+(.[0-9]{1,2})?$");
	if(!reg.test(obj.value)){
        alert("请输入两位小数的数字!");
        obj.value='';
    	return false;
    }
	return true;
}

function checkRateNum(obj){
	var flag = true;
	var reg = new RegExp("^[0-9]+(.[0-9]{1,2})?$");
	var form=$(obj);
	var uuid=form.attr("validateId");
	if(!reg.test(obj.value)){
        flag = false;
    }else{
    	if(parseFloat(obj.value) > parseFloat(100.00)){
            flag = false;
    	}
    }
	if(!flag){
		if(uuid==undefined||uuid==""){
			uuid=Math.uuid();
		}
		form.attr("validateId",uuid);
		$(obj).parent().append('<div  id="'+uuid+'"  class="tag-content" >'+'请填写100以内数字，保留两位小数'+'</div>');
        obj.value='';
	}
	return flag;
}


//点击保存后弹出的提示
function add_contract_saveAndClose(msg,callback){
	setTimeout(function(){
		  $.Zebra_Dialog(msg, {
	          'type':     'close',
	          'title':    '提示',
	          'buttons':  ['确定'],
	          'onClose':  function(caption) {
            	if(callback){//回调函数
            		$("li.current a").click();
            		$("#contractInfoTable").bootstrapTable('refresh');
            	}
	          }
	      });
	},206);
};


