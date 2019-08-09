/**
 * 初始化
 */
var calls = getMillisecond();
initAddContractInfoPage();
function initAddContractInfoPage(){
	var currTab = getCurrentPageObj();
	var table = currTab.find("#outpersonTemplateTableInfo");
	//模板分类
	initSelect(currTab.find("select[name='OTQ.opt_specialtype']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_OUTPERSION_PROFESSION"});
	
	/**
	 * 初始化按钮各种事件
	 */
  initOptPersionCheckTemplateBtn();
  function initOptPersionCheckTemplateBtn(){
	  
	  //点击新增按钮
	  currTab.find("#template_Add_Pop").unbind("click");
	  currTab.find("#template_Add_Pop").bind('click',function(){
		  currTab.find('#opModal_template').modal('show');//显示pop
		  currTab.find("#create_person").attr("readOnly",false);
		  initChecktemplatePop("","add");
		});
	  
		//点击修改按钮
	  currTab.find("#template_Edit_Pop").unbind("click");
	  currTab.find("#template_Edit_Pop").bind('click',function(){
		    currTab.find('#opModal_template').modal('show');//显示pop
		    currTab.find("#create_person").attr("readOnly","true");//创建人不可修改
			var id = table.bootstrapTable('getSelections');
			if(id.length!=1){
				alert("请选择一条数据进行修改!");
				return ;
			}
			var ids = $.map(id, function (row) {
				return row.TEMPLATE_ID;                    
			});//数组
			initChecktemplatePop(ids,"update");
			
		});
	  
		//重置查询条件
	    currTab.find("#resetOptTemplate").unbind("click");
		currTab.find("#resetOptTemplate").bind('click',function(){
			getCurrentPageObj().find("input[name^='OTQ.']").val("");
			getCurrentPageObj().find("#staffCheckTemplateQuery select:visible").val(" ").select2();
		});
		
		//查询列表页
		currTab.find("#queryOptTemplate").unbind().click(function(){
			table.bootstrapTable('refresh',
					{url:queryTemplateUrl()});
					/*{url:dev_outsource+"OptTemplate/queryOptTemplateInfo.asp?SID="+SID+"&call="+calls+"&"+param});*/
		});
		//enter触发查询
		enterEventRegister(getCurrentPageObj().attr("class"), function(){currTab.find("#queryOptTemplate").click();});
		
		//删除考核模板信息
		currTab.find("#template_Del").unbind("click");
		currTab.find("#template_Del").bind('click',function(){
			var id = table.bootstrapTable('getSelections');
			if(id.length!=1){
				alert("请选择一条数据进行删除!");
				return ;
			}
			var ids = $.map(id, function (row) {
				return row.TEMPLATE_ID;                    
			});
			nconfirm("确定删除该外包人员考核信息吗？",function(){
				var url = dev_outsource+"OptTemplate/delOptTemplate.asp?SID="+SID+"&template_id="+ids+"&call="+calls;
				baseAjaxJsonp(url,{},function(data){
					 if(data != undefined&&data!=null&&data.result=="true"){
						 alert("删除成功！");
						 table.bootstrapTable('refresh');
					 }else{
						 alert("删除失败！");
					 }
				 },calls);
			});
		});
		
		//查看
		currTab.find("#template_Detail").unbind("click");
		currTab.find("#template_Detail").bind('click',function(){
			var id = table.bootstrapTable('getSelections');
			if(id.length!=1){
				alert("请选择一条数据进行操作!");
				return ;
			}
			var ids = $.map(id, function (row) {
				return row.TEMPLATE_ID;                    
			});
			closeAndOpenInnerPageTab("outperson_Detail","外包人员考核详细信息","dev_outsource/outsource/outpersonTemplate/optTemplate_detail.html",function(){
				optTemplate_detailInfo(ids[0]);
			});
		});
		
		//模板配置
		currTab.find("#template_configuration").unbind("click");
		currTab.find("#template_configuration").bind('click',function(){
			var id = table.bootstrapTable('getSelections');
			if(id.length!=1){
				alert("请选择一条数据进行配置!");
				return ;
			}
			var ids = $.map(id, function (row) {
				return row.TEMPLATE_ID;                    
			});
			closeAndOpenInnerPageTab("outperson_configuration","外包人员考核信息配置","dev_outsource/outsource/outpersonTemplate/optTemplate_add.html",function(){
				optTemplate_configuration(ids[0]);
			});
		});
	}
  
  /**
   * 初始化考核模板列表
   */
  initOptPersionCheckTemplateList();
  function initOptPersionCheckTemplateList() {
	  var queryParams=function(params){
			var temp={};
			 temp["limit"]=params.limit;
			 temp["offset"]=params.offset;
			return temp;
		};
		table.bootstrapTable({
					url : dev_outsource+'OptTemplate/queryOptTemplateInfo.asp?SID='+SID+"&call="+calls,
					method : 'get', //请求方式（*）   
					cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
					sortable : true, //是否启用排序
					sortOrder : "asc", //排序方式
					queryParams : queryParams,//传递参数（*）
					sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
					pagination : true, //是否显示分页（*）
					pageList : [5,10,20],//每页的记录行数（*）
					pageNumber : 1, //初始化加载第一页，默认第一页
					pageSize : 10,//可供选择的每页的行数（*）
					clickToSelect : true, //是否启用点击选中行
					uniqueId : "TEMPLATE_ID", //每一行的唯一标识，一般为主键列
					cardView : false, //是否显示详细视图
					detailView : false, //是否显示父子表
					jsonpCallback:calls,
					singleSelect: true,
					onLoadSuccess:function(data){
					},
					columns : [ {
						field: 'middle',
						checkbox: true,
						rowspan: 2,
						align: 'center',
						valign: 'middle'
					},{
						field : 'abcdef',
						title : '序号',
						align : "center",
						formatter: function (value, row, index) {
		        			  return index+1;
			        	}
					},{
						field : 'TEMPLATE_ID',
						title : '主键ID',
						align : 'center',
						visible:false
					}, {
						field : "SPECIALTYPE_NAME",
						title : "模板类别",
						align : "center"
					}, {
						field : "START_TIME",
						title : "生效时间",
						align : "center"
					}, {
						field : "END_TIME",
						title : "终止时间",
						align : "center"
					}, {
						field : "CREATE_PERSON",
						title : "创建人",
						align : "center"
					},  {
						field : "CREATE_TIME",
						title : "创建时间",
						align : "center"
					}]
				});
	}
}

/**
 * 组装查询url 
 * @returns {String}
 */
function queryTemplateUrl(){
	var url=dev_outsource+"OptTemplate/queryOptTemplateInfo.asp?SID="+SID+"&call="+calls;
	var fds=getCurrentPageObj().find("input[name^='OTQ.']");//获取input框的值
	for(var i=0;i<fds.length;i++){
		var obj=$(fds[i]);
		if($.trim(obj.val())=="点击选择"){
			obj.val("");
		}
		if($.trim(obj.val())!=""){
			url+='&'+obj.attr("name").substr(4)+"="+escape(encodeURIComponent(obj.val()));
		}
	}
	var selects = getCurrentPageObj().find("select[name^='OTQ.']");//获取下拉框的值
	for(var i=0;i<selects.length;i++){
		var obj=$(selects[i]);
		if($.trim(obj.val())!=""){
			url+='&'+obj.attr("name").substr(4)+"="+escape(encodeURIComponent(obj.val()));
		}
	}
	return url;
}

/**
 * 获取当前时间
 */
function showTime(){
	var date =new Date();
	var year=date.getFullYear();
	var month=date.getMonth()+1;
	var day=date.getDate();
	if(month>=1 && month <=9){
		month ="0"+month;
	}
	if(day>=1 && day <=9){
		day ="0"+day;
	}
	getCurrentPageObj().find("#create_time").val(year+"-"+month+"-"+day);//date.getMonth方法返回值是0（一月）到11（十二月）从0开始
}

/**
 * 初始化考核模板配置pop页面信息
 */
function initChecktemplatePop(template_id,optType){
	
  var objPOP = getCurrentPageObj(); //获取页面对象
  initVlidate(objPOP);  
  initSelect(objPOP.find("select[name='OT.opt_specialtype']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_OUTPERSION_PROFESSION"});
  //先清空pop页面信息
  objPOP.find("#template_form").find("input").val("");
  objPOP.find("#template_form").find("textarea").val("");
  objPOP.find("#template_form").find("select").val(""); 
  objPOP.find("#template_form").find("select").select2();

    //初始化页面信息
    var calls = getMillisecond();
    if(optType=="update"){
    	baseAjaxJsonp(dev_outsource+"OptTemplate/queryOneTemplateInfo.asp?template_id="+template_id+"&SID="+SID+"&call="+calls,null,function(data){
    		if(data){
    			var templateInfos = data["templateInfo"];
    			for(var p in templateInfos){
    				var projectKey = p.toLowerCase();
    				if("opt_specialtype"==projectKey){
    					initSelect(objPOP.find("select[name='OT.opt_specialtype']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_OUTPERSION_PROFESSION"},templateInfos[p]);
    					objPOP.find("[name='OT."+projectKey+"']").val(templateInfos[p]);
    				}else{
    					objPOP.find("[name='OT."+projectKey+"']").val(templateInfos[p]);
    				}
    			}
    		}
    	},calls);
    }else if(optType=="add"){
    	showTime();//创建时间默认为当前时间
		getCurrentPageObj().find("input[name='OT.create_person']").val($("#currentLoginName").val());//设置创建人默认为当前登录人
    }
  
  //按钮操作
  //保存
  objPOP.find("#saveTemplateInfo").unbind("click");
  objPOP.find("#saveTemplateInfo").bind('click',function(){
		if(vlidate(objPOP,"",false)){//验证
			var params = {};
			//获取所有name前缀为OT的值把所有值都放到vals里面
			var vals=getCurrentPageObj().find("[name^='OT.']");
			for(var i=0;i<vals.length;i++){
				var val=$(vals[i]);
				if($.trim(val.val())!=""){
					params[val.attr("name").substr(3)]=val.val();
				}
			}
			var param = template_id;
			var url = dev_outsource+"OptTemplate/insertOptTemplate.asp?SID="+SID+"&call="+calls;
			if(null!=template_id&&""!=template_id&&undefined!=template_id){
				url = dev_outsource+"OptTemplate/updateOptTemplate.asp?SID="+SID+"&template_id="+param+"&call="+calls;
			}
			baseAjaxJsonp(url,params,function(data){
				 if(data != undefined&&data!=null&&data.result=="true"){
					 alert("保存成功！");
					 objPOP.find('#opModal_template').modal('hide');
					 objPOP.find("#outpersonTemplateTableInfo").bootstrapTable('refresh');
				 }else{
					 alert("保存失败！");
				 }
			 },calls);
		 }
	});

}


