

//修改常用功能
function function_update(param){
	var menu_code=param;
	baseAjax("SFunction/selFunctionByMenuCode.asp?menu_code="+menu_code, null, function(msg){
		getCurrentPageObj().find("#updateFunctionForm").setform(msg.fun);		
	});
}
//修改失主信息
$(function(){
	 var obj=getCurrentPageObj().find("#functionInfoUpdate");
	 obj.unbind("click");
	 obj.click(function(){
		 if(vlidate(getCurrentPageObj(),"",false)){
			var articleJSON=new Array;
			var vals=getCurrentPageObj().find("[name^='MENU']");
			var param={};
			for(var i=0;i<vals.length;i++){
				var val=$(vals[i]);
				param[val.attr("name").toLowerCase()]=val.val();
			}
			articleJSON.push(param);
			var ArticleJSON=JSON.stringify(articleJSON);
			baseAjax("SFunction/updatefunction.asp",{'f':ArticleJSON}, function(data){
				if(data.result=="true"){
					alert("修改成功!",function(){
						$("#SFunctionTableInfo").bootstrapTable('refresh');
						closeCurrPageTab();
					});
				}else{
						alert("修改失败");				
				}
			});
		 }
	 });
});