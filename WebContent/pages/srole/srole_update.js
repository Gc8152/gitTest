$("#updatesRole").click(function(){
	if(!vlidate($("#update_from"))){
		return ;
	}
	var role_no=$("input[name='R.role_no']").val();
	var role_name=$("input[name='R.role_name']").val();
	var flag=$("select[name='R.flag']").val();
	//var flag=$("#flag").val();
	var order_no=$("#order_no").val();
	var memo=$("#memo").val();
	var params={"role_no":role_no,"role_name":role_name,"flag":flag,"memo":memo,"order_no":order_no};
	baseAjax("SRole/updateSRole.asp",
			params,
			function(data){
				if(data != null && data.result == "true"){
					closeCurrPageTab();
					alert("保存成功");	
				}else{
					alert("系统异常，请稍后！");
				}
			});
/*	$.ajax({
		type:"post",
		url:"SRole/updateSRole.asp",
		async:true,
		data:params,
		dataType:"json",
		success:function(success){
			if(success.result=="true"){
				alert("保存成功");				
        		openInnerPageTab("role_manager","角色查询","pages/srole/srole_queryList.html");
			}else{
				alert("系统异常请稍后");		
			}
		}
	});	*/	
});
function initSRoleFlag(flag){
	//初始化数据
	initSelect($("#Uflag"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"S_DIC_OC"},flag);
}
