//初始化
function initRepositoryAddOrUpdateLayOut(item,type){	
	
	var $page = getCurrentPageObj();//当前页
	var tableCall=getMillisecond();//table回调方法名
	initVlidate($page.find("#repositorySaveDiv"));
	saveEvent();
	//initFileTable();
	var type=type;
	if(type != 'add'){//修改
		if(item.STATUS=='01'){
			$page.find('#updateTR').show();
		}
		initItem();
	}else{//新增隐藏版本列表
		$page.find("#upFileLi").hide();
	}
	//赋值
	function initItem(){
		for(var k in item){
			$page.find("[name='REP."+ k +"']").val(item[k]);
		}
	}
	//打开树
	$page.find("#category_name").click(function(){
		openSelectTreeDivToBody($(this),"categorySelectTree","Repository/queryCategoryTreeList.asp",30,function(node){
			$page.find("#category_name").val(node.name);
			$page.find("#category_code").val(node.id);
			$page.find("#all_category_name").val(node.all_category_name);
			
			/*var treeObj = $.fn.zTree.getZTreeObj("categorySelectTree");
			var sNodes = treeObj.getSelectedNodes();
			if(sNodes.length>0){
				 var aaa =sNodes[0].getParentNode().pid;
			}
			
			if (aaa!=null&&aaa=='1') {
				$page.find("#category_name").val(node.name);
				$page.find("#category_code").val(node.id);
				$page.find("#all_category_name").val(node.all_category_name);
			}else{
				$page.find("#category_name").val("");
				$page.find("#category_code").val("");
				$page.find("#all_category_name").val("");
				alert("请选择第三级类别");
			}
			return true;*/
		});
	});
	//保存方法
	function saveEvent(){
		$page.find("[btn='saveRepositoryInfo']").click(function(){
			
			if(vlidate($page.find("#repositorySaveDiv"))){
				var params = getPageParam("REP");
				params["FILE_ID"] = getCurrentPageObj().find("input[name=FILE_ID]").val();
				if(type != 'add'){
					params.STATUS=item.STATUS;
				}
				baseAjax("Repository/saveIntell.asp?SID=" + SID , params, function(data){
					if(data && data.result == 'true'){
						//getCurrentPageObj().find("#sit_id").val(data.sit_id);
		       			getCurrentPageObj().find("#upFileLi").show();
		       			//getCurrentPageObj().find("#submit_sit").show();
		       			getCurrentPageObj().find("#repositorySaveDiv").removeClass("active");
		       			getCurrentPageObj().find("#upFileDiv").addClass("active");
		       			getCurrentPageObj().find("#sitSubmitLi").removeClass("active");
		       			getCurrentPageObj().find("#upFileLi").addClass("active");
		       			getCurrentPageObj().find("#repository_edit").hide();
		       			//隐藏保存按钮
		       			getCurrentPageObj().find("[btn='saveRepositoryInfo']").hide();
						//closeCurrPageTab();
					}else{
						closeCurrPageTab();
					}
				});
			}
		});
	};
	
	//点击文件上传模态框
	var tablefile = $page.find("#table_file");
	var business_code = "";
	business_code = getCurrentPageObj().find("input[name=FILE_ID]").val();
	if(!business_code){
		business_code = Math.uuid();
		getCurrentPageObj().find("input[name=FILE_ID]").val(business_code);
	}
	//构建文件上传路径拼接所需参数
	var addfile = $page.find("#add_file");
	addfile.click(function(){
		var paramObj = new Object();
		var all_category_name = getCurrentPageObj().find("#all_category_name").val();
		var title = getCurrentPageObj().find("#title").val();
		if(category_name ==""||title ==""){
			alert("类别和标题");
			return ;
		} else {
			paramObj.K_CODE_NAME = all_category_name;//类型
			paramObj.K_TITLE = title;//标题
		}
		openFileFtpUpload($page.find("#file_modal"), tablefile, 'K110120',business_code, '1', 'S_DIC_REPOSITORY_FILE_TYPE', false, true, paramObj,false);
	});
	 //附件删除
	 var delete_file = getCurrentPageObj().find("#delete_file");
	 delete_file.click(function(){
		 nconfirm("确定要删除该附件吗？", function(){
			 delFtpFile(tablefile, business_code, "1");
		 });
	 });
	 
	 getFtpFileList(tablefile, getCurrentPageObj().find("#fileview_modal"), business_code, "1");
	
	
}
