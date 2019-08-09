
/*
 * 插入常用功能信息
*/
$(function(){
	var obj=getCurrentPageObj().find("#functionInfoSave");
	obj.unbind("click");
	obj.click(function(){
    //验证
	if(vlidate(getCurrentPageObj(),"",false)){
		var articleJSON=new Array;
		var vals=getCurrentPageObj().find("[name^='S.']");
		var param={};
		for(var i=0;i<vals.length;i++){
			var val=$(vals[i]);
			param[val.attr("name").substr(2)]=val.val();
		}		
		articleJSON.push(param);
		var ArticleJSON=JSON.stringify(articleJSON);
		baseAjax("SFunction/addfunction.asp", {'f':ArticleJSON}, function(data){
			if(!data||!data.result||data.result=="false"){
				alert("保存失败!");
			}else if(!data||!data.result||data.result=="repeat"){
			   alert("常用功能编号已存在！");
			}else{
				alert("保存成功!",function(){
					$("#SFunctionTableInfo").bootstrapTable('refresh');
					closeCurrPageTab();
				});
			}
		});
	 }
  });
});