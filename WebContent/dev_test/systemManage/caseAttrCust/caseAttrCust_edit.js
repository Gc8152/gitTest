var $page = getCurrentPageObj();//当前页

//修改初始化
function caseAttrupdate(item){
	//设置页面头部显示内容
	$("#caseAttr-title").text("修改案例属性");
	var $page = getCurrentPageObj();
	initVlidate($page);//渲染必填项
	autoInitSelect($page);//初始化下拉选择
	//下拉框以及单选框赋值
	 for(var k in item){
		 //下拉框赋值，隐藏
		 if(k == "ATTR_TYPE"){
			if(item.ATTR_TYPE == '00'){
				$page.find("#tr1").show();
				$page.find("#tr2").hide();
				$page.find("#tr3").hide();
				}
			 else{
				 $page.find("#tr2").show(); 
				 $page.find("#tr1").hide();
				 $page.find("#tr3").show();
			 }
			 continue; 
		 }
		
		 //单选框赋值
		 if(k=="NECESSARY"){
			 if(item.NECESSARY=='00'){
				 $page.find("#NECESSARY0").attr("checked",true);
			 }
			 if(item.NECESSARY=='01'){
				 $page.find("#NECESSARY1").attr("checked",true);
			 }
			 continue;
		 }
		 //案例属性表赋值
		getCurrentPageObj().find("#"+k).val(item[k]);
		getCurrentPageObj().find("#DICTIONARY_NUM_CASE").val(item['DICTIONARY_NUM']);
		//初始化下拉框
		initSelect($("#DEFAULT_NUM_CASE"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:item['DICTIONARY_NUM']},item['DEFAULT_NUM']);
		initSelect($page.find("[name='I.ATTR_TYPE']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:'TM_DIC_ATTR_TYPE'},item['ATTR_TYPE']);
	 }
	 
	 updateCaseAttr();
}

//修改保存
function updateCaseAttr(){
	popFunction();
	$page.find("#addAttrManage").click(function(){
    var editCall = getMillisecond();
    var inputs = $page.find("input[name^='I.']");
	var select = $page.find("select[name^='I.']");
	var radios  =$page.find("input:radio[name^='I.']:checked");
	var params = {};
	for (var i = 0; i < inputs.length; i++) {
		var obj = $page.find(inputs[i]);
		params[obj.attr("name").substr(2)] = obj.val();
	}
	for (var i = 0; i < radios.length; i++) {
		var obj = $page.find(radios[i]);
		params[obj.attr("name").substr(2)] = obj.val();
	}
	for(var i = 0; i < select.length; i++){
		var obj = $page.find(select[i]);
		params[obj.attr("name").substr(2)] = obj.val();
	}
	
	if(params["ATTR_TYPE"]==00){
		params["DICTIONARY_NUM"] = '0';
	}else{
		params["MAX_LENGTH"] = '0';
	}
	params["OPT_TYPE"] = "sss";
			baseAjaxJsonp(dev_test+"caseAttrCust/saveEditCaseAttrCust.asp?SID=" + SID + "&call=" + editCall, params, function(data) {
				if(data && data.result=="true"){
					alert(data.msg);
					closeCurrPageTab();
				}else{
					alert(data.msg);
					closeCurrPageTab();
				}
			},editCall,false);

	
	
    	
    });
}

//新增保存
function initAddAttrManageButtonEvent(){
	//设置页面头部显示内容
	var $page = getCurrentPageObj();
	$page.find("#caseAttr-title").text("新增案例属性");
	initSelect($page.find("[name='I.ATTR_TYPE']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:'TM_DIC_ATTR_TYPE'});
	var forDicValidate = "ok";
	initVlidate($page);//渲染必填项
	autoInitSelect($page);//初始化下拉选择
/*	$page.find("#DICTIONARY_NUM_CASE").unbind("click").click(function(){
		showModal(function(row){
			getCurrentPageObj().find("#DICTIONARY_NUM_CASE").val(row["DIC_CODE"]);
			initSelect($page.find("#DEFAULT_NUM_CASE"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:row["DIC_CODE"]});
		});
	});*/
	popFunction();
		$page.find("#NECESSARY0").click(function(){
			$(this).attr("checked",true);
			$page.find("#NECESSARY1").attr("checked",false);
		});
	
		$page.find("#NECESSARY1").click(function(){
			$(this).attr("checked",true);
			$page.find("#NECESSARY0").attr("checked",false);
		});
		
		$page.find("#addAttrManage").click(function(){
			
		
		if(!vlidate($("#addAttrManage_from"))){
			return;
		}		
		if(forDicValidate != "ok"){
			return;
		}
		
		var inputs = $page.find("input[name^='I.']");
		var select = $page.find("select[name^='I.']");
		var radios  =$page.find("input:radio[name^='I.']:checked");
		var params = {};
		for (var i = 0; i < inputs.length; i++) {
			var obj = $page.find(inputs[i]);
			params[obj.attr("name").substr(2)] = obj.val();
		}
		for (var i = 0; i < radios.length; i++) {
			var obj = $page.find(radios[i]);
			params[obj.attr("name").substr(2)] = obj.val();
		}
		for(var i = 0; i < select.length; i++){
			var obj = $page.find(select[i]);
			params[obj.attr("name").substr(2)] = obj.val();
		}	
		if(params["ATTR_TYPE"]==00){
			params["DICTIONARY_NUM"] = '0';
		}else{
			params["MAX_LENGTH"] = '0';
		}
		//必填项未填提示
		if(!vlidate($page,"",true)){
			alert("有必填项未填");
			return ;
		}

		var addAttrCall2=getMillisecond();		
		baseAjaxJsonp(dev_test+"caseAttrCust/saveCaseAttrCust.asp?call="+addAttrCall2+"&SID="+SID,params, function(data) {
			if (data != undefined&&data!=null&&data.result=="true") {
				alert("添加成功");
				closeCurrPageTab();
			}else{
				alert(data.msg);
				//alert("出错了！");
			}
		},addAttrCall2);
		});
}

//单选框以及下拉框的隐藏
function myFunction(){
	var x = getCurrentPageObj().find("#ATTR_TYPE").val();
	if(x == '00'){
		getCurrentPageObj().find("#tr1").show();
		getCurrentPageObj().find("#tr2").hide();
		getCurrentPageObj().find("#tr3").hide();
		}
	 else{
		 getCurrentPageObj().find("#tr2").show();
		 getCurrentPageObj().find("#tr3").show();
		 getCurrentPageObj().find("#tr1").hide();
	 }
};

function popFunction(){
	var $page = getCurrentPageObj();
	$page.find("#DICTIONARY_NUM_CASE").unbind("click").click(function(){
		showModal(function(row){
			getCurrentPageObj().find("#DICTIONARY_NUM_CASE").val(row["DIC_CODE"]);
			//初始化下拉框
			initSelect($page.find("#DEFAULT_NUM_CASE"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:row["DIC_CODE"]});
		});
	});
	
	//pop框显隐
	function showModal(func_call){
		initPreContractInfoList(
				function(row){
					func_call(row);
					$page.find("#myModal_case").modal("hide");
				}
			);
	$page.find("#myModal_case").modal("show");
	}
}


//pop框表格
function initPreContractInfoList(func_call) {
	getCurrentPageObj().find("#conPerTableAdd_case").bootstrapTable({
		 url: "SDic/findAllSDic.asp",       //请求后台的URL（*） 
		    method: 'get',			    //请求方式（*）   
		    striped: false,              //是否显示行间隔色
		    cache: false,               //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
		    pagination: true,           //是否显示分页（*）
		    sortable: false,            //是否启用排序
		    sortOrder: "asc",           //排序方式
//		    queryParams: queryParams,            //传递参数（*）
		    sidePagination: "server",   //分页方式：client客户端分页，server服务端分页（*）
		    pageNumber:1,               //初始化加载第一页，默认第一页
		    pageSize: 10,               //每页的记录行数（*）
		    pageList: [5,10],           //可供选择的每页的行数（*）
		    strictSearch: false,
		    clickToSelect: true,        //是否启用点击选中行
		    uniqueId: "DIC_CODE",             //每一行的唯一标识，一般为主键列
		    cardView: false,            //是否显示详细视图
		    detailView: false,          //是否显示父子表
			singleSelect: true,
			radio:true, 
			onDblClickRow:function(row){
				if(func_call){
					func_call(row);
				}
			},
		    columns: [/*{
				field: 'state',
				checkbox: true,
				rowspan: 2,
				align: 'center',
				valign: 'middle'
		    },*/{
				field: 'DIC_CODE',
				title: '类别编码' 
		    },{
		        field: 'DIC_NAME',
		        title: '类别名称'
		    },{
		        field: 'STATE',
		        title: '状态',
			    formatter:function(value,row,index){if(value=="00"){return "启用";}return "停用";}
		    },{
		        field: 'MEMO',
		        title: '说明'
		    },{
		        field: 'MENU_NAME',
		        title: '所属菜单'
		    },{
		        field: 'MANAGER_ROLE',
		        title: '管理角色'
		    }]
	});
};

$(document).ready(function(){

	//查询
	$("#queryPer").unbind("click").click(
			function() {
				var dic_code = $("#dic_code").val();
				// user_name=escape(encodeURIComponent($.trim(user_name)));
				var dic_name = $("#dic_name").val();
				getCurrentPageObj().find("#conPerTableAdd_case").bootstrapTable(
						"refresh",
						{
							url : "SDic/findAllSDic.asp?dic_code="
									+ dic_code + "&dic_name=" + dic_name
						});
			});
	//重置
	getCurrentPageObj().find("#resetPer").unbind("click").click(
	function(){
		getCurrentPageObj().find("#contractInfo input").val("");
	}		
	)
});
