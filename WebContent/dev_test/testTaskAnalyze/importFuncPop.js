/**
 * 导入功能点
 * @param importFunc
 */
(function(importFunc,$page){
	var setting = {
	        view: {
	        	dblClickExpand : false,
				showLine : true,
				selectedMulti : false
	        },check:{
	        	enable: true,
				chkStyle: "checkbox"
	        },
	        async:{dataType:"application/json"},
	        data: {  
	            simpleData: {
	                enable:true,  
	                idKey: "FUNC_NO",  
	                pIdKey: "SUPFUNC_NO",
	                rootPId: ""
	            },
	            key: {
	            	name:"FUNC_NAME"
	            }
	        },  
	        callback: {
	            onClick: function(event,treeId,treeNode) {}  
	        }
	    };
	/**
	 * 引用的入口
	 */
	importFunc.import_func_Pop=function(params,func_call){
		if($page.find("#importFuncPoint_Pop").length==0){
			loadPage("dev_test/testTaskAnalyze/importFuncPop.html",function(page){
				$page.append(page);
				initFuncTree(params);
				initSaveEvent(params["task_num"],func_call);
			});
		}else{
			initFuncTree(params);
			initSaveEvent(params["task_num"],func_call);
		}
	};
	/**
	 * 初始化树
	 */
	function initFuncTree(params){
		$page.find("#importFuncPoint_Pop").modal("show");
		baseAjaxJsonpNoCall(dev_test+'testTaskAnalyze/queryImportFunc.asp',params,function(data) {
			if (data != undefined && data != null && data.result=="true") {
				var treeObj = $.fn.zTree.init($page.find("#importFuncList"),setting, data.importfunc);
				treeObj.expandAll();
			}
		});
	}
	/**
	 * 保存功能
	 */
	function saveFuncInfo(task_num,nodes,func_call){
		var ids="?task_num="+task_num;
		for(var i=0;i<nodes.length;i++){
			if(nodes[i].level==1){
				ids+="&func_nos="+nodes[i]["FUNC_NO"];
			}
		}
		baseAjaxJsonpNoCall(dev_test+'testTaskAnalyze/saveImportFunc.asp'+ids,{},function(data){
			if(data.result=="true"){
				if(func_call){
					func_call();
				}
			}else{
				alert(data.msg||"操作失败");
			}
		});
	}
	/**
	 * 初始化保存
	 */
	function initSaveEvent(task_num,func_call){
		//保存提交
		$page.find("[btn='saveImportFunc']").unbind("click");
		$page.find("[btn='saveImportFunc']").click(function(){
			var treeObj = $.fn.zTree.getZTreeObj("importFuncList");		
		    var nodes = treeObj.getCheckedNodes(true);
		    if(nodes.length==0){
		    	alert("请勾选功能点!");
		    }else{
		    	saveFuncInfo(task_num,nodes,function(){
		    		if(func_call){
		    			func_call();
		    		}
		    		$page.find("#importFuncPoint_Pop").modal("hide");
		    	});
		    }
		});
	}

})(importFunc={},getCurrentPageObj());


