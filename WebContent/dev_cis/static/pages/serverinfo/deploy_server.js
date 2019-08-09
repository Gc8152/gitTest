
$(function(){
	getServerInfo();
	
	function getServerInfo(){
		baseAjaxJsonp(contextpath + "server_info/list/02", null, function(result){
			$("select").select2();
			if(result.total==1){
				var serverInfo = result.rows[0];
				for(var item in serverInfo){
					$("[name=" + item + "]").val(serverInfo[item]);
				}
				$("[name='serverinfoAdditional.rootPath']").val(serverInfo["serverinfoAdditional"]["rootPath"]);
			}
			$("select").trigger("change");
		});
	}
	
	function saveServerInfo(serverInfo){
		baseAjaxJsonp(contextpath + "server_info/save",serverInfo,function(data){
			if(data.success){
				alert("保存成功");
				var serverId = getParamString("id");
				if(serverId!=""&&serverId!=null&&serverId!=undefined){
					location.reload;
				} else {
					location.replace(location.href + "?id=" + data.message);
				}
			} else {
				alert("保存失败");
			}
		});
		
		/*$.ajax({
			type : "post",
			url : contextpath + "server_info/save",
			async : true,
			data : serverInfo,
			dataType : "json",
			success : function(data){
				if(data.success){
					alert("保存成功");
					var serverId = getParamString("id");
					if(serverId!=""&&serverId!=null&&serverId!=undefined){
						location.reload;
					} else {
						location.replace(location.href + "?id=" + data.message);
					}
				} else {
					alert("保存失败");
				}
			},
			error : function(xhr,status,error) {
				if("error"==status && xhr.status==400){
					alert("提交参数不合规");
				}
			}
		});*/
	}
	
	//初始化页面按钮事件
	$("#save").click(function(event){
		var $form = $("#serverInfoForm");
		var result = vlidate($form);
		if(result){
			var serverInfo = new Object();
			var $inputs = $form.find("input");
			var $selects = $form.find("select");
			var $textareas = $form.find("textarea");
			for(var i=0; i<$inputs.length; i++){
				serverInfo[$($inputs[i]).attr("name")] = $.trim($inputs[i].value);
			}
			for(var i=0; i<$selects.length; i++){
				serverInfo[$($selects[i]).attr("name")] = $.trim($selects[i].value);
			}
			for(var i=0; i<$textareas.length; i++){
				serverInfo[$($textareas[i]).attr("name")] = $.trim($($textareas[i]).val());
			}
			serverInfo["serverUseType"] = "02";
			saveServerInfo(serverInfo);
		} else {
			alert("所保存内容不全或不符合条件！");
		}
	});
	
	$("#close").click(function(event){
		nconfirm("放弃当前修改内容离开",function(){
			parent.closeCurrentTab();
		});
	});
});
