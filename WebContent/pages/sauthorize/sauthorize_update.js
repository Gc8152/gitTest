/**
 * 字典项页面管理
 */	
	function pageDispatch_authorize_update(obj){
		var id = $("#table_authorize").bootstrapTable('getSelections');
		if(id.length!=1){
			alert("请选择一条数据进行配置!");
			return ;
		}
		//字典项页面加载
		$("#contentHtml").empty();
//		$("#contentHtml").load("pages/sauthorize/sauthorize_update.html",{},function(){
			openInnerPageTab("update_sauthorize","修改授权信息","pages/sauthorize/sauthorize_update.html");		
			$("#userDiv").load("pages/sauthorize/userPop.html");
			//返回
			$("#toback_authoriza_update").on('click',function(){
				$("#contentHtml").empty();
				$("#contentHtml").load("pages/sauthorize/sauthorize_queryInfo.html");				
			});
			//清空必填项
			$("input").focus(function(){
				$(this).siblings("div").remove();
			});
			$("select").change(function(){
				$(this).siblings("div[class^='tag-position']").remove();
			});
			//初始化查询
			var ids = $.map(id, function (row) {
				return row.ID;                    
				});
	        $.ajax({
		           url:"SAuthorize/findById.asp?id="+ids,
		           type:"post",
		           data:"",
		           dataType:"json",
		           success:function(result){
					$("#authorize_id").val(result.rows[0].ID);						
		     	     $("#auth_name_update").val(result.rows[0].AUTH_NAME);
		        	 $("#auth_no_update").val(result.rows[0].AUTH_NO);
		        	 $("#bauth_name_update").val(result.rows[0].BAUTH_NAME);	        	 
		     	     $("#bauth_no_update").val(result.rows[0].BAUTH_NO);
			     	  //授权类型
				        $.ajax({
					           url:"SDic/findItemByDic.asp",
					           type:"post",
					           async: false,
					           data:{dic_code:"1"},
					           dataType:"json",
					           success:function(msg){
					        	   $("#auth_type_update").text("");
					        	   $("#auth_type_update").append("<option value=''  >-- 请选择 --</option>");
					        	   for(var i=0;i<msg.length;i++){
					        		   if(result.rows[0].AUTH_TYPE==msg[i].ITEM_CODE){
						        		   var option = "<option value="+msg[i].ITEM_CODE+" selected>"+msg[i].ITEM_NAME+"</option>";
						        		   $("#auth_type_update").append(option);			
						        		   $("#auth_type_update").select2({ });
					        		   }else{
						        		   var option = "<option value="+msg[i].ITEM_CODE+">"+msg[i].ITEM_NAME+"</option>";
						        		   $("#auth_type_update").append(option);				        			   
					        		   }
					        	   }
					           }
					      });
				        //系统类型
				        $.ajax({
					           url:"SDic/findItemByDic.asp",
					           type:"post",
					           async: false,
					           data:{dic_code:"4"},
					           dataType:"json",
					           success:function(msg){
					        	   $("#system_id_update").text("");
					        	   $("#system_id_update").append("<option value=''  >-- 请选择 --</option>");
					        	   for(var i=0;i<msg.length;i++){
					        		   if(result.rows[0].SYSTEM_ID==msg[i].ITEM_CODE){
						        		   var option = "<option value="+msg[i].ITEM_CODE+" selected>"+msg[i].ITEM_NAME+"</option>";
						        		   $("#system_id_update").append(option);			
						        		   $("#system_id_update").select2({ });
					        		   }else{
						        		   var option = "<option value="+msg[i].ITEM_CODE+">"+msg[i].ITEM_NAME+"</option>";
						        		   $("#system_id_update").append(option);				        			   
					        		   }
					        	   }
					           }
					      });
		 			//授权角色
			        $.ajax({
				           url:"SRole/findAllRoleById.asp",
				           type:"post",
				           async: false,
				           data:{"user_no":result.rows[0].AUTH_NO},
				           dataType:"json",
				           success:function(msg){
			        		   $("#role_no_update").text("");
			        		   $("#role_no_update").append("<option value=''  >-- 请选择 --</option>");
				        	   for(var i=0;i<msg.total;i++){
				        		   if(result.rows[0].ROLE_NO==msg.rows[i].ROLE_NO){
					        		   var option = "<option value="+msg.rows[i].ROLE_NO+" selected>"+msg.rows[i].ROLE_NAME+"</option>";
					        		   $("#role_no_update").append(option);			
					        		   $("#role_no_update").select2({ });
				        		   }else{
					        		   if(msg.rows[i].ROLE_NAME==undefined){break;};
					        		   var option = "<option value="+msg.rows[i].ROLE_NO+">"+msg.rows[i].ROLE_NAME+"</option>";
					        		   $("#role_no_update").append(option);				        			   
				        		   }
				        	   }
				           }
				      });
		     	     //授权机构
			        $.ajax({
				           url:"SOrg/findAllOrgById.asp",
				           type:"post",
				           async: false,
				           data:{"user_no":result.rows[0].AUTH_NO},
				           dataType:"json",
				           success:function(msg){
			        		   $("#org_no_update").text("");
			        		   $("#org_no_update").append("<option value=''  >-- 请选择 --</option>");
				        	   for(var i=0;i<msg.total;i++){
				        		   if(result.rows[0].ORG_CODE==msg.rows[i].ORG_CODE){
					        		   var option = "<option value="+msg.rows[i].ORG_CODE+" selected>"+msg.rows[i].ORG_NAME+"</option>";
					        		   $("#org_no_update").append(option);				
					        		   $("#org_no_update").select2({ });
				        		   }else{
					        		   if(msg.rows[i].ORG_NAME==undefined){break;};
					        		   var option = "<option value="+msg.rows[i].ORG_CODE+">"+msg.rows[i].ORG_NAME+"</option>";
					        		   $("#org_no_update").append(option);				        			   
				        		   }
				        	   }
				           }
				      });		     	     
		    	     if(result.rows[0].QUERY_OP=='0'){
		    	    	 $("#query_op_update").prop("checked",true);
		    	     }
		    	     if(result.rows[0].OPTION_OP=='0'){
		    	    	 $("#option_op_update").prop("checked",true);
		    	     }
		    	     if(result.rows[0].APPROVE_OP=='0'){
		    	    	 $("#approve_op_update").prop("checked",true);
		    	     }
		    		  $("#start_time_update").val(result.rows[0].START_TIME);
		    		  $("#end_time_update").val(result.rows[0].END_TIME);
		           }
		        });
	      //修改保存功能
	    	$("#authorization_update_save").on('click',function(){
	    	      var auth_no_update =  $("#auth_no_update").val().trim();
	    	      var bauth_no_update = $("#bauth_no_update").val().trim();
	    	      var role_no_update =  $("#role_no_update").val().trim();
	    	      var org_no_update =  $("#org_no_update").val().trim();
	    	      var auth_type_update =  $("#auth_type_update").val().trim();
	    	      var system_id_update = $("#system_id_update").val().trim();
	    	      var query_op_update  = '1';
	    	      if($("#query_op_update").is(':checked')){
	    	    	  query_op_update = '0';
	    	      }
	    	      var option_op_update  = '1';
	    	      if($("#option_op_update").is(':checked')){
	    	    	  option_op_update = '0';
	    	      }
	    	      var approve_op_update  = '1';
	    	      if($("#approve_op_update").is(':checked')){
	    	    	  approve_op_update = '0';
	    	      }
	    		  var start_time_update=  $("#start_time_update").val().trim();
	    		  var end_time_update =  $("#end_time_update").val().trim();
					//表单是否为空
				    var ok = true;			
					if(!vlidate($("#authorize_form_update"))){
						return ;
					}
					$("#authorize_form_update").find("[validate^='v.']").each(function(){
						$(this).parent().find("span[class='formtips onError']").remove();
						var form=$(this);
						if(form.attr("validate")=="v.required"&&$.trim(form.val())==""){
							$(this).parent().append('<span class="formtips onError" style="color:Red;">'+$(this).attr("valititle")+'</span>');
							ok =  false;
						}					
					});
	    	      if(query_op_update=="1"&&option_op_update=="1"&&approve_op_update=="1"){
			    	  x1.style.display='inline';
			          ok = false;
	    	      }
			      if($("#auth_no_update").val()==$("#bauth_no_update").val()){
			    	  $("#auth_no_update").val("");
			    	  $("#bauth_no_update").val("");
			    	  $("#auth_name_update").val("");
			    	  $("#bauth_name_update").val("");
					 $("#role_no_update").text("");
					 $("#role_no_update").val("");
					 $("#role_no_update").append("<option value=''  selected>-- 请选择 --</option>");
					 $("#role_no_update").select2();
					 $("#org_no_update").text("");	
					 $("#org_no_update").val("");	
					 $("#org_no_update").append("<option value=''  selected>-- 请选择 --</option>");
					 $("#org_no_update").select2();
	 				 alert("授权人与被授权人不可相同！");						
				          ok = false;	    	  
			      }
	    	      if(ok){
	    	        //发送Ajax请求save
	    	        $.ajax({
	    	           url:"SAuthorize/update.asp",
	    	           type:"post",
	    		       data:{"id":ids[0],"auth_no":auth_no_update,"org_no":org_no_update,"role_no":role_no_update,"bauth_no":bauth_no_update,"system_id":system_id_update,
	    	        	      "query_op":query_op_update,"option_op":option_op_update,"approve_op":approve_op_update,"auth_type":auth_type_update,
	    		 	    	  "auth_state":'0',"start_time":start_time_update,"end_time":end_time_update},
	    	           dataType:"json",
	    	           success:function(msg){
	    	       			alert("修改成功！");
//							$("#contentHtml").empty();
//							$("#contentHtml").load("pages/sauthorize/sauthorize_queryInfo.html");
	 						closePageTab("update_sauthorize",function(){
//	 							$('#table_sdic').bootstrapTable('refresh',{url:'SDic/findAllSDic.asp'});
	 						});		
	    	           }
	    	        });
	    	     }		
	    	});
			//授权人模态框
			$("#auth_name_update").click(function(){
				$('#myModal_user').modal('show');
				var userParam = { "name":$("#auth_name_update"), "no":$("#auth_no_update"),"role":"auth",
						"cascade":{"role_no":$("#role_no_update"),"org_no": $("#org_no_update")}  };
				userPop("#pop_userTable",'SUser/popFindAllUser.asp',userParam);
			});
			
			//授权人模态框
			$("#bauth_name_update").click(function(){
				$('#myModal_user').modal('show');
				var userParam = { "name":$("#bauth_name_update"),  "no":$("#bauth_no_update"),"role":"normal"};
				userPop("#pop_userTable",'SUser/popFindAllUser.asp',userParam);

				
			});	    	
	    	

	    	
//		});
	}