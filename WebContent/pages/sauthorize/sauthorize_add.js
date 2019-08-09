
	function pageDispatch_authorize_add(obj){
		$("#contentHtml").empty();
		//字典项页面加载
//		$("#contentHtml").load("pages/sauthorize/sauthorize_add.html",{},function(){
			openInnerPageTab("add_sauthorize","创建授权信息","pages/sauthorize/sauthorize_add.html");			

			appendSelect($("#auth_type_save"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"1"});
			appendSelect($("#system_id_save"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"4"});
			$(document).ready(function() {
				$("#role_no_save").select2({});
				$("#org_no_save").select2({});
			});
			//清空必填项
			$("input").focus(function(){
				$(this).siblings("div").remove();
			});
			$("select").change(function(){
				$(this).siblings("div[class^='tag-position']").remove();
			});
			//返回主页面
			$("#toback_authorize_add").on('click',function(){
				$("#contentHtml").empty();
				$("#contentHtml").load("pages/sauthorize/sauthorize_queryInfo.html");
			});
			//新增保存数据
			$("#authorization_save").on('click',function(){
				var ok = true;			
				//验证表单是否为空
				if(!vlidate($("#authorize_form_add"))){
					return ;
				}
				$("#authorize_form_add").find("[validate^='v.']").each(function(){
					$(this).parent().find("span[class='formtips onError']").remove();
					var form=$(this);
					if(form.attr("validate")=="v.required"&&$.trim(form.val())==""){
						$(this).parent().append('<span class="formtips onError" style="color:Red;">'+$(this).attr("valititle")+'</span>');
						ok =  false;
					}					
				});
			      var auth_no_save = $("#auth_no_save").val().trim();
			      var bauth_no_save = $("#bauth_no_save").val().trim();
			      var role_no_save =  $("#role_no_save").val().trim();
			      var org_no_save =  $("#org_no_save").val().trim();
			      var auth_type_save =  $("#auth_type_save").val().trim();
			      var system_id_save = $("#system_id_save").val().trim();
			      var query_op_save  = '1';
			      if($("#query_op_save").is(':checked')){
			    	  query_op_save = '0';
			      }
			      var option_op_save  = '1';
			      if($("#option_op_save").is(':checked')){
			    	  option_op_save = '0';
			      }
			      var approve_op_save  = '1';
			      if($("#approve_op_save").is(':checked')){
			    	  approve_op_save = '0';
			      }
				  var start_time_save =  $("#start_time_save").val().trim();
				  var end_time_save =  $("#end_time_save").val().trim();	
			      if(query_op_save=="1"&&option_op_save=="1"&&approve_op_save=="1"){
			    	  x1.style.display='inline';
			          ok = false;
			      }
			      if($("#auth_no_save").val()==$("#bauth_no_save").val()&&$("#auth_no_save").val()!=""){
			    	  $("#auth_no_save").val("");
			    	  $("#bauth_no_save").val("");
			    	  $("#auth_name_save").val("");
			    	  $("#bauth_name_save").val("");
			    	  
					 $("#role_no_save").text("");
					 $("#role_no_save").val("");
					 $("#role_no_save").append("<option value=''  selected>-- 请选择 --</option>");
					 $("#role_no_save").select2();
					 
					 $("#org_no_save").text("");	
					 $("#org_no_save").val("");	
					 $("#org_no_save").append("<option value=''  selected>-- 请选择 --</option>");
					 $("#org_no_save").select2();
	 				 alert("授权人与被授权人不可相同！");						
				     ok = false;	    	  
			      }
			      //新增
			      if(ok){
			        $.ajax({
			           url:"SAuthorize/save.asp",
			           type:"post",
			           async: false,
			           data:{"auth_no":auth_no_save,"bauth_no":bauth_no_save,"org_no":org_no_save,"role_no":role_no_save,"system_id":system_id_save,
			 	    	  "query_op":query_op_save,"option_op":option_op_save,"approve_op":approve_op_save,"auth_type":auth_type_save,
			 	    	  "auth_state":'0',"start_time":start_time_save,"end_time":end_time_save},
			           dataType:"json",
			           success:function(msg){
							alert("保存成功!");
//							$("#contentHtml").empty();
//							$("#contentHtml").load("pages/sauthorize/sauthorize_queryInfo.html");
	 						closePageTab("add_sauthorize",function(){
//	 							$('#table_sdic').bootstrapTable('refresh',{url:'SDic/findAllSDic.asp'});
	 						});		
			           }
			        });
			     }
			});
			//加载userPop.html
			$(window.top.document.body).append("<div id='userDivAuthorizeAdd'></div>"); 
			$("#userDivAuthorizeAdd").load("pages/suser/suserPop.html");
			//授权人模态框
			$("#auth_name_save").click(function(){
				openUserPop("userDivAuthorizeAdd",{ "name":$("#auth_name_save"), "no":$("#auth_no_save"),"role":"auth",
					"cascade":{"role_no":$("#role_no_save"),"org_no": $("#org_no_save")}  });
			});
			//授权人模态框
			$("#bauth_name_save").click(function(){
				openUserPop("userDivAuthorizeAdd",{ "name":$("#bauth_name_save"),  "no":$("#bauth_no_save"),"role":"normal",
					"cascade":{"role_no":$("#role_no_save"),"org_no": $("#org_no_save")}  });			
			});
//		});//新增页面加载结束
	}