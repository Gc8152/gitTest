$("#sSRole").click(function(){
	if(!vlidate($("#sRole_from"))){
		return ;
	}
	/*var role_no=$("#role_no").val();
	var role_name=$("#role_name").val();*/
	var role_no=$("input[name='S.role_no']").val();
	var role_name=$("input[name='S.role_name']").val();
	var flag=$("select[name='S.flag']").val();
	//var flag=$("#flag").val();
	var order_no=$("#order_no").val();
	var memo=$("#memo").val();
	var url="SRole/saveSRole.asp";
	var param={"role_no":role_no,"role_name":role_name,"flag":flag,"order_no":order_no,"memo":memo};
	
	baseAjax("SRole/saveSRole.asp",
			param,
			function(data){
				if(data != null && data.result == "true"){
					closeCurrPageTab();
					alert("保存成功");	
				}else{
					alert("系统异常，请稍后！");
				}
			});
}); 
//下拉列表数据
function initSRoleFlag(){
	//初始化数据
	initSelect($("#Aflag"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"S_DIC_OC"});
}

initSRoleFlag();	
  