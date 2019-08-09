//initAttrManageDicType();
//初始化
function editDefect(item){
	
	
	var $page = getCurrentPageObj();//当前页
	initVlidate($page);//渲染必填项
	autoInitSelect($page);//初始化下拉选择
	if(null == item){//新增
		//设置页面头部显示内容
		$page.find("#defectAttr-title").text("新增缺陷属性");
		initButtonEvent(null);//初始化按钮事件
	}else{//修改
		//设置页面头部显示内容
		$page.find("#defectAttr-title").text("修改缺陷属性");
		 for(var k in item){
			 if(k == "ATTR_TYPE"){
				 
				if(item.ATTR_TYPE == '00'){
					$page.find("#tr1").show();
					$page.find("#tr2").hide();
					$page.find("#tr3").hide();
					}
				 else{
					 $page.find("#tr2").show(); 
					 $page.find("#tr3").show();
					 $page.find("#tr1").hide();
				 }
				 continue;
				 
			 }
			 if(k=="NECESSARY"){
				 if(item.NECESSARY=='00'){
					 $page.find("#NECESSARY0").attr("checked",true);
				 }
				 if(item.NECESSARY=='01'){
					 $page.find("#NECESSARY1").attr("checked",true);
				 }
				 continue;
			 }
			getCurrentPageObj().find("#"+k).val(item[k]);
			//初始化下拉框
			initSelect($page.find("#DEFAULT_NUM"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:item['DICTIONARY_NUM']},item['DEFAULT_NUM']);
			initSelect($page.find("[name='I.ATTR_TYPE']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:'TM_DIC_ATTR_TYPE'},item['ATTR_TYPE']);
		 }
		initButtonEvent("edit");//初始化按钮事件
		//initDefectInfo(item);//初始化缺陷信息
	}

	//按钮事件
	function initButtonEvent(edit){
		//保存按钮
		$page.find("#saveAddAttr").click(function(){
			addDefectInfo("save",edit);
		});
		
		$page.find("#NECESSARY0").click(function(){
			$(this).attr("checked",true);
			$page.find("#NECESSARY1").attr("checked",false);
		});
		
		$page.find("#NECESSARY1").click(function(){
			$(this).attr("checked",true);
			$page.find("#NECESSARY0").attr("checked",false);
		});
		$page.find("#DICTIONARY_NUM").unbind("click").click(function(){
			showModal(function(row){
				getCurrentPageObj().find("#DICTIONARY_NUM").val(row["DIC_CODE"]);
				//初始化下拉框
				initSelect($page.find("#DEFAULT_NUM"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:row["DIC_CODE"]});
			});
		});
		
	};
	//pop框显隐
	function showModal(func_call){
		initPreContractInfoList(
				function(row){
					func_call(row);
					$page.find("#myModal").modal("hide");
				}
			);
		$page.find("#myModal").modal("show");
	}
	//pop框表格
	function initPreContractInfoList(func_call) {
		getCurrentPageObj().find("#conPerTableAdd").bootstrapTable({
			 url: "SDic/findAllSDic.asp",       //请求后台的URL（*） 
			    method: 'get',			    //请求方式（*）   
			    striped: false,              //是否显示行间隔色
			    cache: false,               //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
			    pagination: true,           //是否显示分页（*）
			    sortable: false,            //是否启用排序
			    sortOrder: "asc",           //排序方式
//			    queryParams: queryParams,            //传递参数（*）
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
	//pop框中查询与重置按钮
	(function() {
		//查询
		$page.find("#queryPer").unbind("click").click(
				function() {
					var dic_code = $page.find("#dic_code").val();
					// user_name=escape(encodeURIComponent($.trim(user_name)));
					var dic_name = $page.find("#dic_name").val();
					getCurrentPageObj().find("#conPerTableAdd").bootstrapTable(
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
		);
		})();
	
//保存&提交
	function addDefectInfo(opt_type,edit){
		//debugger;
			var params = getPageParam("I");
			if(params["ATTR_TYPE"]==00){
				params["DICTIONARY_NUM"] = '0';
			}else{
				params["MAX_LENGTH"] = '0';
			}
			
			
			var aaa = $page.find("input[name='I.NECESSARY']:checked").val();
			var bbb = $page.find("#NECESSARY0").attr("value");
			var ccc = $page.find("#NECESSARY1").attr("value");
		params["OPT_TYPE"] = opt_type;
			if(!vlidate($page,"",true)){
				alert("有必填项未填");
				return ;
			}
			if(null == edit){ 
				addSave(params);
			}else{
				editSave(params);
			}
	}

	//新增保存&提交
	function addSave(params){
		var addCall = getMillisecond();
		baseAjaxJsonp(dev_test+"defectAttrCust/saveAddDefectAttr.asp?SID=" + SID + "&call=" + addCall, params, function(data) {
			if(data && data.result=="true"){
				alert(data.msg);
				closeCurrPageTab();
			}else{
				alert(data.msg);
			//	closeCurrPageTab();
			}
		},addCall,false);
		
	}

	//修改保存&提交
	function editSave(params){
		var editCall = getMillisecond();
		baseAjaxJsonp(dev_test+"defectAttrCust/saveEditDefectAttr.asp?SID=" + SID + "&call=" + editCall, params, function(data) {
			if(data && data.result=="true"){
				alert(data.msg);
				closeCurrPageTab();
			}else{
				alert(data.msg);
				//closeCurrPageTab();
			}
		},editCall,false);
	}


	//初始化信息
	function initDefectInfo(item){
		for(var k in item){
			var dicCode = $page.find("[name='I."+ k +"']").attr("diccode");
			if(dicCode != undefined){
				initSelect($page.find("[name='I."+ k +"']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:dicCode},item[k]);
				continue;
			}
			$page.find("[name='I."+ k +"']").val(item[k]);
		}
	}



}



function myFunction(){
	//var x=obj.options[obj.selectedIndex].value;
	//options[selectedIndex].value
	var x = getCurrentPageObj().find("#ATTR_TYPE").val();
	//var x=document.getElementById("ATTR_TYPE");
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



	

//ITEM_CODE 

