/**
 * 初始化按钮事件
 */
function initCategoryButtonEvent() {
	$page =  getCurrentPageObj();//当前页
	$page.find("#category_name_top").click(function(){
		openSelectTreeDivToBody($(this),"categorySelectTree","Repository/queryCategoryTreeList.asp",30,function(node){
			if($page.find("#category_code").val()==node.id){
				return false;
			}
			$page.find("#category_name_top").val(node.name);
			$page.find("#category_code_top").val(node.id);
			return true;
		});
	});
	/*[name!='C.OLD_CATEGORY_CODE']"
*/	$page.find("#addCategory").click(function(){
	$page.find("#category_code").attr("readOnly",false);
		$page.find("input[name^='C.']").val("");
		$page.find("textarea[name^='C.']").val("");
		var treeObj = $.fn.zTree.getZTreeObj("treeCategoryManager");
		var selectsed = treeObj.getSelectedNodes();
		if(selectsed!=undefined&&selectsed.length>0){
			var selected=selectsed[0];
			$page.find("input[name='C.CATEGORY_CODE_TOP']").val(selected.id);
			$page.find("input[name='C.CATEGORY_NAME_TOP']").val(selected.name);
		}
		//$page.find("#old_category_code").val("");
	});
	//
	$("#saveCategory").click(function() {
		var old_category_code =$page.find("#old_category_code").val();
		if(""==$.trim(old_category_code)){//如果没有旧的菜单编号则为创建
			
			saveCategory("Repository/createCategory.asp", "add");
			
		}else{
			saveCategory("Repository/createCategory.asp", "edit");
		}
	});
	
	$page.find("#delCategory").click(function() {
		var inputs = $("input[name^='C.']");
		var params = {};
		for (var i = 0; i < inputs.length; i++) {
			var obj = $(inputs[i]);
			params[obj.attr("name").substr(2)] = obj.val();
		}
		shouwModalCallBack("确定删该类别？",function(){
			baseAjax("Repository/deleteCategory.asp", params, function(data) {
				if (data != undefined&&data!=null&&data.result=="true") {
					alert("删除成功");
					initCategoryTree();
					$page.find("#treeCategoryManager").click();
					$page.find("#category_code").attr("readOnly",false);
					$page.find("input[name^='C.']").val("");
					$page.find("textarea[name^='C.']").val("");
				}else{
					alert("删除失败");
				}
			});
		});
	});
}
//保存方法	
function saveCategory(url, type) {
	if(vlidate($page.find("#category_form"))){
		var params = getPageParam("C");
		params.TYPE=type;
		baseAjax(url,params,function(data){
			if(data != undefined && data != null && data.result == "true"){
				//$("input[name='O.old_org_code']").val($("input[name='O.org_code']").val());
				$page.find("#category_code").attr("readOnly","true");
				alert(data.msg);
				initCategoryTree();
				$page.find("#category_code").attr("readOnly",false);
				$page.find("input[name^='C.']").val("");
				$page.find("textarea[name^='C.']").val("");
			}else{
				alert(data.msg);
			}
		});
	}
}
function initCategoryTree() {
	var setting = {
		async : {
			enable : true,
			url : "Repository/queryCategoryTreeList.asp",
			contentType : "application/json",
			type : "get"
		},
		view : {
			dblClickExpand : false,
			showLine : true,
			selectedMulti : false
		},
		data : {
			simpleData : {
				enable : true,
				idKey : "id",
				pIdKey : "pid",
				rootPId : ""
			}
		},
		callback : {
			onClick : function(event, treeId, treeNode) {
				$page.find("input[name^='C.' ]").val("");
				$page.find("textarea[name^='C.' ]").val("");
				baseAjax(
						"Repository/findOneCategoryByNo.asp",
						{
							CATEGORY_CODE : treeNode.id
						},
						function(data) {
							clearVlidateTag();
							
							for ( var k in data) {
								$page.find("input[name='C." + k + "']").val(data[k]);
							}
							$page.find("#category_code").attr("readOnly","true");
							//$("#old_category_code").val(data['CATEGORY_CODE']);
							data['CATEGORY_CODE'] != undefined ? $page.find("input[name='C.OLD_CATEGORY_CODE']").val(data['CATEGORY_CODE']) : "";
							
							data['CATEGORY_EXPLAIN'] != undefined ? $page.find("textarea[name='C.CATEGORY_EXPLAIN']").val(data['CATEGORY_EXPLAIN']) : "";
						});
			}
		}
	};
	$.fn.zTree.init($("#treeCategoryManager"), setting);
}

/**
 * 有确认按钮和回调的模态框
 * @param msg
 * @param callback
 */
function shouwModalCallBack(msg,callback) {
	nconfirm(msg,callback);
}

function initCategoryType(){
	//初始化数据
	autoInitSelect($("#category_form"));
}
$(function(){
	initCategoryTree();
	initCategoryButtonEvent();
	initCategoryType();
	initVlidate($("#category_form"));
})



	
	

	
	