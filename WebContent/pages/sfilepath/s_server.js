function serverButtonEvent(){
	
	//重置
	$("#sserver_reset").on('click', function() {
		$("#servername").val("");
		$("#s_username").val("");
		$("#s_password").val("");
		$("#port").val("");
	});
	
	serverUpdate();
}
function serverUpdate(){
	//查询数据并回填
    $.ajax({
           url:"SFilePath/getServerInfo.asp",
           type:"post",
           data:"",
           dataType:"json",
           success:function(msg){
        	   if(msg!=undefined&&msg.result!=false){
        		   $("#serverid").val(msg.list[0].ID);
        		   $("#servername").val(msg.list[0].SERVERNAME);
        		   $("#s_username").val(msg.list[0].USERNAME);
        		   $("#s_password").val(msg.list[0].PASSWORD);
        		   $("#port").val(msg.list[0].PORT);
        	   }
           }
        });
    //保存
	$("#sserver_save").on('click', function() {
		var serverid = $("#serverid").val();
		var servername = $("#servername").val();
		var username = $("#s_username").val();
		var password = $("#s_password").val();
		var port = $("#port").val();
		//判断是否为空
        if(!vlidate($("#sserver_form"))){
			  return ;
		  }
	        //发送Ajax请求save
	        $.ajax({
	           url:"SFilePath/saveServerInfo.asp",
	           type:"post",
	           data:{"id":serverid,"servername":servername,"username":username,"password":password,"port":port},
	           dataType:"json",
	           success:function(data){
	       			alert(data.msg);
	        		//openInnerPageTab("sdic_manager","字典类查询","pages/sdic/sdic_queryInfo.html");
	           }
	        });
	});
}
serverButtonEvent();