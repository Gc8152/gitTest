function pageDispatch_sdic_update(obj,key){
	var id = $("#table_sdic").bootstrapTable('getSelections');
	if(id.length!=1){
		alert("请选择一条数据进行修改!");
		return ;
	}
	//打开修改页面
	closeAndOpenInnerPageTab("sdic_update","修改类别","pages/sdic/sdic_update.html",function(){
		//状态下拉框
		var ids = $.map(id, function (row) {
			return row.DIC_CODE;                    
		});
		//修改功能
		sdicUpdate(ids);
		//所属菜单
		menuSdicUpdate();
		//初始化角色下拉框
	});
}


function initSdicUpdate(){
	return ids;
}

function sdicUpdate(ids){
	//查询数据并回填
    $.ajax({
           url:"SDic/findById.asp?dic_code="+ids,
           type:"post",
           data:"",
           dataType:"json",
           success:function(msg){
        	   if(msg!=undefined&&msg.result!=false){
        		   $("#dic_update_code").val(msg.list[0].DIC_CODE);
        		   $("#dic_update_codename").val(msg.list[0].DIC_NAME);
        		   $("#dic_update_state").val(msg.list[0].STATE);
   				   initSelect($("#dic_update_state"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"S_DIC_OC"},msg.list[0].STATE);	
        		   $("#dic_update_menuname").val(msg.list[0].MENU_NAME);
        		   $("#dic_update_menucode").val(msg.list[0].MENU_NO);
        		   $("#dic_update_memo").val(msg.list[0].MEMO);
        		   initRoleSelect(msg.list[0].MANAGER_ROLE);
        	   }
           }
        });
  //修改保存功能
	$("#dic_update_save").on('click',function(){
	      var dic_update_code =  $("#dic_update_code").val();
	      var dic_update_codename = $("#dic_update_codename").val();
	      var dic_update_state =  $("#dic_update_state").val();
	      var dic_update_memo =  $("#dic_update_memo").val();
	      var dic_update_menucode = $("#dic_update_menucode").val();
	      var manager_role = getCurrentPageObj().find("#manager_role").val();
	      //判断是否为空
          if(!vlidate($("#sdic_form_update"))){
			  return ;
		  }
	        //发送Ajax请求save
	        $.ajax({
	           url:"SDic/update.asp",
	           type:"post",
	           data:{"dic_code":dic_update_code,"dic_name":dic_update_codename,"state":dic_update_state,"memo":dic_update_memo,"menu_no":dic_update_menucode,"manager_role":manager_role},
	           dataType:"json",
	           success:function(msg){
	       			alert("修改成功！");
	       			closeCurrPageTab();        		
	           }
	        });
	});
}


function menuSdicUpdate(){
	$("#dic_update_menuname").click(function(){
		openSelectTreeDivToBody($(this),"dicUpdate_menutree_id","SMenu/queryAllmenu.asp",30,function(node){
			$("#dic_update_menuname").val(node.name);
			$("#dic_update_menucode").val(node.id);
		});
	});
	$("#dic_update_menuname").focus(function(){
		$("#dic_update_menuname").click();
	});		
}
function initRoleSelect(selected){
	baseAjax('SRole/querySrole.asp',null,function(data){
		var obj=getCurrentPageObj().find("#manager_role");
		if(obj!=undefined&&data!=undefined){
			obj.empty();
			obj.append('<option value=" ">请选择</option>');
			for(var i=0;i<data.srole.length;i++){
				obj.append('<option value="'+data.srole[i].ROLE_NO+'">'+data.srole[i].ROLE_NAME+'</option>');
				if(selected==data.srole[i].ROLE_NO){
					obj.children("option:last-child").attr("selected",true);
				}
			}
			obj.select2();
		};
	});
}