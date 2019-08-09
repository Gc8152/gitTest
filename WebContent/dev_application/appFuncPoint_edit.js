function initFunc(item) {
	var $funcPage = getCurrentPageObj();
	var system_id = item.SYSTEM_ID;
	initVlidate($funcPage);//必填项
	initFuncButtonEvent();//初始化按钮
	initTree();//初始化树
	
	//左侧树信息
	function initTree(){
		var setting = {
			async : {
				enable : true,
				url : dev_application + "applicationManager/queryFuncBySystem.asp?SYSTEM_ID="+system_id +"&SID=" + SID,
				contentType : "application/json",
				type : "get"
			},
			view : {
				dblClickExpand : false,
				showLine : true,
				selectedMulti : false
			},
			data : {		
				key:{name:"NAME"},
				simpleData : {
					enable : true,
					idKey : "ID",
					pIdKey : "PID",
					rootPId : "",
					formatterNodeName:function(node){
						if(node.FLAG&&node.FLAG=="01"){
							return "" + node["NAME"]+"(已删除)";
						}
						return "" + node["NAME"];
					}
				}
			},
			callback : {
				onAsyncSuccess : function() {
					var treeObj = $.fn.zTree.getZTreeObj("treeFuncManager");
					//expandNodeLevel1(treeObj, "treeFuncManager");
					var menus = treeObj.getNodes();
					if (menus != undefined) {
//						alert(treeObj.getFlag())
//						if(treeObj.getFlag()){
//							
//						}
						initTree["data"] = {};
						for (var i = 0; i < menus.length; i++) {
							setMenuNodeTId(menus[i]);
						}
					}
				},
				onClick : function(event, treeId, treeNode) {
					
					var treeObj = $.fn.zTree.getZTreeObj(treeId);
					var pnode = treeObj.getNodeByTId(treeNode.parentTId);
					$funcPage.find("[name='M.tid']").val(treeNode.tId);
					$funcPage.find("[name='M.func_type_name']").val(treeNode['FUNC_TYPE_NAME']);//类型赋值
					$funcPage.find("[name='M.func_type']").val(treeNode["FUNC_TYPE"]);//类型赋值
					$funcPage.find("[name='M.func_no']").val(treeNode['ID']);
					$funcPage.find("[name='M.oldfunc_no']").val(treeNode['ID']);
/*					$funcPage.find("[name='M.supfunc_name']").val(treeNode['PID']);*/
					$funcPage.find("[name='M.func_name']").val(treeNode['NAME']);
					$funcPage.find("[name='M.func_remark']").val(treeNode['FUNC_REMARK']);
					$funcPage.find("[name='M.func_seq']").val(treeNode['FUNC_SEQ']);
					if(pnode != null){
						$funcPage.find("[name='M.supfunc_name']").val(pnode['NAME']);
						$funcPage.find("[name='M.supfunc_no']").val(pnode['ID']);
					}
					if(treeNode.level == '0'){//根节点只读
						$funcPage.find("#tr1").hide();
						$funcPage.find("#tr2").hide();
						$funcPage.find("[name='M.func_type']").attr('disabled',true);
						$funcPage.find("[name='M.func_no']").attr('readonly',true);
						$funcPage.find("[name='M.func_name']").attr('readonly',true);
						
					}else{
						if(treeNode['FLAG']=='01'){//已删除的只读
							$funcPage.find("#tr1").hide();
							$funcPage.find("[name='M.func_no']").attr('readonly',true);
							$funcPage.find("[name='M.func_name']").attr('readonly',true);
						}else if(treeNode['FLAG']=='00'){
							$funcPage.find("#tr1").show();
							$funcPage.find("#tr2").show();
							$funcPage.find("[name='M.func_type']").attr('disabled',false);
							$funcPage.find("[name='M.func_no']").attr('readonly',false);
							$funcPage.find("[name='M.func_name']").attr('readonly',false);
						}
						
					}
	
				}
			}
		};
		$.fn.zTree.init($("#treeFuncManager"), setting);
		//initVlidate($funcPage);//渲染必填项
		//autoInitSelect($funcPage);//初始化下拉选择
	}
	
	
	//上级节点树信息
	function initTreeTwo(){
		var func_no=$funcPage.find("[name='M.func_no']").val();
		getCurrentPageObj()[0].setting={
			async : {
				enable : true,
				url : dev_application+"applicationManager/queryFuncBySystem.asp?SYSTEM_ID="+system_id +"&SID=" + SID+"&func_no="+func_no,
				contentType : "application/json",
				type : "get",
				autoParam: ["ID"]
			},
			view : {
				dblClickExpand : false,
				showLine : true,
				selectedMulti : false
			},
			data : {
				simpleData : {
					enable : true,
					idKey : "ID",
					pIdKey : "PID",
					rootPId : ""
				},
	            key: {
	            	name:"NAME"
	            }
			},
			callback : {
				onAsyncSuccess: function(){
					$("#FuncSelectTree").show();
				},
				onClick : function(event, treeId, treeNode) {
//					treeNode["ID"];
					$funcPage.find("#supfunc_name").val(treeNode["NAME"]);
				    $funcPage.find("[name='M.supfunc_no']").val(treeNode["ID"]);
				    $("#FuncSelectTree").hide();
				    if(treeNode.level == '0'){
				    $funcPage.find("[name='M.func_type']").val("01");
				    $funcPage.find("[name='M.func_type_name']").val("模块");
				    
					}else if(treeNode.level == '1'){
						$funcPage.find("[name='M.func_type']").val("02");
						 $funcPage.find("[name='M.func_type_name']").val("功能点");
						}else{
							if(treeNode['FLAG']=='01'){//已删除的只读
								alert("已删除的模块下不可增加或修改");
						}
					 }
					}
				}
			}
	};
	//按钮initFuncButtonEvent
	function initFuncButtonEvent(treeNode){
		//上级节点下拉
		$funcPage.find("#supfunc_name").unbind("click").click(function(){
			 initTreeTwo();
			openSelectTreeDivToBody($(this),"FuncSelectTree","",30,function(node){
				if($("[name='M.func_no']").val()==node.id){
					return false;
				}
				 $funcPage.find("[name='M.supfunc_name']").val(node.name);
		         $funcPage.find("[name='M.supfunc_no']").val(node.pid);
				return true;
			});

		});
		//新建
		$funcPage.find("[btn='addApp']").click(function() {//新增
			var treeObj = $.fn.zTree.getZTreeObj("treeFuncManager");
			var selectsed = null;
			if (treeObj != undefined) {
				selectsed = treeObj.getSelectedNodes();
			}
			if (selectsed != undefined && selectsed.length > 0) {
				var selected = selectsed[0];
				var lev = selected.level;
				if(lev=='2'){
					alert("功能点下无法增加新节点");
					return;
				}
				if(selected['FLAG']=='01'){
					alert("已删除的模块，不能再新增功能点");
					return;
				}
				
				$funcPage.find("#tr1").show();
				$funcPage.find("#tr2").show();
				$funcPage.find("[name='M.func_no']").attr('readonly',false);
				$funcPage.find("[name='M.func_name']").attr('readonly',false);
				$funcPage.find("table input").val("");
				$funcPage.find("table textarea").val("");
				if(lev=='1'){
					$funcPage.find("[name='M.func_type_name']").val("功能点");
					$funcPage.find("[name='M.func_type']").val("02");
				}
				if(lev=='0'){
					$funcPage.find("[name='M.func_type_name']").val("模块");
					$funcPage.find("[name='M.func_type']").val("01");
				}
				//var pnode = treeObj.getNodeByTId(selected.parentTId);
				$funcPage.find("input[name='M.supfunc_no']").val(selected.ID);
				$funcPage.find("input[name='M.supfunc_name']").val(selected.NAME);
				$funcPage.find("input[name='M.oldfunc_no']").val('');
				
			}else{
				alert("请选择父节点");
				return;
			}
			
	
		
		});
		
		//删除
		$funcPage.find("[btn='delFunInfo']").click(function() {
			var treeObj = $.fn.zTree.getZTreeObj("treeFuncManager");
			var selectsed = null;
			if (treeObj != undefined) {
				selectsed = treeObj.getSelectedNodes();
			}
			if (selectsed != undefined && selectsed.length > 0) {
				var selected = selectsed[0];
				if(selected.level == '0'){
					alert('根节点不能删除');
					return;
				}else{
					var select_id = selected.ID;
					var dCall = getMillisecond()+'5';
					shouwModalCallBack("确定删除该节点？",function  delFunc(){
						baseAjaxJsonp(dev_application+"applicationManager/delFunc.asp?SID=" + SID + "&call=" + dCall + "&func_no=" + select_id, null, function(data) {
							if(data && data.result=="true"){
								alert(data.msg);
								initTree();
								$funcPage.find("table input").val("");
								$funcPage.find("table textarea").val("");
								//$funcPage.find("select").val(" ").select2();
							}else{
								alert(data.msg);
								//closeCurrPageTab();
							}
						},dCall,false);
					});
				}
				
			}else{
				alert("请选择一个节点");
			}
	
		});
		
		//保存
		$funcPage.find("[btn='saveFuncInfo']").click(function() {
				if(!vlidate($funcPage,"",true)){
					alert("必填项未填");
					return ;
				}
				var treeObj = $.fn.zTree.getZTreeObj("treeFuncManager");
				var params = getPageParam("M");
				params['system_id'] = system_id;
				var oldfunc_no = params.oldfunc_no;
				var url = '';
				var eCall = '';
				if(oldfunc_no == ''){//新增节点
					 eCall = getMillisecond()+'1';
					 url = "applicationManager/addFunc.asp";
				}else{//修改
					var tid = params.tid;
					var node = treeObj.getNodeByTId(tid);
					if(node.level == '0'){
						alert('根节点不能修改');
						return;
					}
					eCall = getMillisecond()+'3';
					url = "applicationManager/editFunc.asp";
				}	
					
				var pno = params.supfunc_no;
				editFunc(params,url,eCall);
					
	
		});
        //导出
		$("#funcExport").click(function(){
			window.location.href=dev_application+"applicationManager/queryFuncReport.asp?SID="+SID+"&SYSTEM_ID="+system_id;
		});
		
		//初始化导入文件
		importExcel.initImportExcel($funcPage.find("#inputApp"),"功能点信息","sfile/downloadFTPFile.asp?id=m_050","applicationManager/queryFuncReport.asp?",function(msg){
			if(msg&&msg.result=="false"){
				var error_info=msg.error_info;
				if(error_info&&error_info.length<200){
					alert(msg.error_info||"导入失败！");
				}else{
					alert("导入失败！"+'<div style="display:none;">'+error_info+'</div>');
				}
			}else if(msg&&msg.result=="true"){
				alert("导入成功!");
				initTree();
				initTreeTwo();
			}else{
				alert("导入失败!未知错误");
			}
		});
		
	}

	//提交
	function  editFunc(params,url,eCall){
		baseAjaxJsonp(dev_application+url+"?SID=" + SID + "&call=" + eCall, params, function(data) {
			if(data && data.result=="true"){
				alert(data.msg);
				initTree();
				$funcPage.find("table input").val("");
				$funcPage.find("table textarea").val("");
				//$funcPage.find("select").val(" ").select2();
			}else{
				alert(data.msg);
				//closeCurrPageTab();
			}
		},eCall,false);
	}
	
	

	
	/**
	 * 设置菜单树的tid
	 * 
	 * @param node
	 */
	function setMenuNodeTId(node) {
		var nid = node.id;
		initTree["data"][nid] = node;
		if (node == undefined || node.children == undefined) {
			return;
		}
		for (var i = 0; i < node.children.length; i++) {
			setMenuNodeTId(node.children[i]);
		}
	}
	
	/**
	 * 有确认按钮和回调的模态框
	 * @param msg
	 * @param callback
	 */
	function shouwModalCallBack(msg,callback) {
		nconfirm(msg,callback);
	}
	
	
}
