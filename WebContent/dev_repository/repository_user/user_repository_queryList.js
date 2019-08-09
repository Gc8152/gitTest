//repositoryOrVersion();

//function repositoryOrVersion(){//初始化
	
	//$("#institution").html('<div class="reposit" onclick=Repository("'+"??1"+'")>'+"????2"+'</div><div class="reposit" onclick=Repository("'+"??1"+'")>'+"???25552"+'</div><div class="reposit" onclick=Repository("'+"??1"+'")>'+"???23423"+'</div>');
	initCategoryCode();
	//初始化类别
	function initCategoryCode(){
		baseAjax("Repository/getCategoryCode.asp?SID=" + SID , {CATEGORY_CODE_TOP:1}, function(data){
			if(data && data.result == 'true'){
				var rows=data.rows;
				var addHtml = "";
				for(var i=0;i<rows.length;i++){
					addHtml = addHtml+'<li class="reposit"  onclick=Repository("'+rows[i].CATEGORY_CODE+'","'+rows[i].CATEGORY_NAME+'")>'
									+'<div class="reposit-div" style="font-size: 25px;">'
									+'<i style="width:128px;height:128px;display:block;margin:0 auto 5px auto;background-image:url('+rows[i].MENU_ICON+');background-repeat:no-repeat;"></i>'+rows[i].CATEGORY_NAME+'</div></li>';
					//$(".reposit-i").css({"background-image":"url(images/reposit_w.png)","width":"128px","height":"128px"});
					//$(".reposit-i").css({"background-image":"url('"+rows[i].MENU_ICON+"')","width":"128px","height":"128px"});
				}
				$("#initRepositoty").html(addHtml);
			}	
		});
	}
	
//}
function nextCategoryCode(category_code,caterory_name){
	$(".hotPic_title").html("知识库->"+caterory_name);
	$("#RRRR_display").show();
	$("[name='back_top']").click(function(){
		initCategoryCode();
		$("#RRRR_display").hide();
		$(".hotPic_title").html("知识库");
	});
	baseAjax("Repository/getCategoryCode.asp?SID=" + SID , {CATEGORY_CODE_TOP:category_code}, function(data){
		if(data && data.result == 'true'){
			var rows=data.rows;
			
			var addHtml = "";
			$("#initRepositoty").html(addHtml);
			for(var i=0;i<rows.length;i++){
				addHtml = addHtml+'<li class="reposit" onclick=Repository("'+rows[i].CATEGORY_CODE+'","'+rows[i].CATEGORY_NAME+'")>'
				+'<div class="reposit-div" style="font-size: 25px;">'
				+'<i style="width:128px;height:128px;display:block;margin:0 auto 5px auto;background-image:url('+rows[i].MENU_ICON+');background-repeat:no-repeat;"></i>'+rows[i].CATEGORY_NAME+'</div></li>';
			}
			$("#initRepositoty").html(addHtml);
		}	
	});
	
	
}
//
function Repository(INTELL_ID,NAME){ 
	//alert(INTELL_ID);
	closeAndOpenInnerPageTab("oneCategory_list",NAME,"dev_repository/repository_user/oneCategory_list.html",function(){
		initOneCategoryLayout(INTELL_ID);
	  });
}