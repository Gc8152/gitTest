themeInit();

function themeGrade(obj){
	var temp = 0;
	var spCodesTemp = "";
	getCurrentPageObj().find('input:checkbox[name=juryGradeName]:checked').each(function(i){
		temp = temp+1;
       if(0==i){
    	   spCodesTemp = getCurrentPageObj().find(this).val();
       }else{
    	   spCodesTemp += (","+getCurrentPageObj().find(this).val());
       }
       
     });
	
	if (getCurrentPageObj().find('input:checkbox[name=juryGradeName]').is(':checked')) {
	    getCurrentPageObj().find("#theme_class").addClass("tab_modal-body");
	    getCurrentPageObj().find("#tabWrap").show();
	}else{
		getCurrentPageObj().find("#theme_class").removeClass("tab_modal-body");
		getCurrentPageObj().find("#tabWrap").hide();
	}
	getCurrentPageObj().find("#jury_grade").val(spCodesTemp);
	if(obj.checked){
		if(obj.value=="01"){
			$("#themeGrade1From input[name^='G.']").val("");
			$("#themeGrade1From textarea[name^='G.']").val("");
			
			getCurrentPageObj().find("#first_jury").show();
			getCurrentPageObj().find("#first_jury").addClass("tabBtn_Bg");
			getCurrentPageObj().find("#second_jury").removeClass("tabBtn_Bg");
			getCurrentPageObj().find("#third_jury").removeClass("tabBtn_Bg");
			getCurrentPageObj().find("#first_jury2").show();
			getCurrentPageObj().find("#second_jury2").hide();
			getCurrentPageObj().find("#third_jury2").hide();
		}else if(obj.value=="02"){
			$("#themeGrade2From input[name^='G.']").val("");
			$("#themeGrade2From textarea").val("");
			getCurrentPageObj().find("#second_jury").show();
			getCurrentPageObj().find("#second_jury").addClass("tabBtn_Bg");
			getCurrentPageObj().find("#first_jury").removeClass("tabBtn_Bg");
			getCurrentPageObj().find("#third_jury").removeClass("tabBtn_Bg");
			getCurrentPageObj().find("#second_jury2").show();
			getCurrentPageObj().find("#third_jury2").hide();
			getCurrentPageObj().find("#first_jury2").hide();
		}else{
			$("#themeGrade3From input[name^='G.']").val("");
			$("#themeGrade3From textarea").val("");
			getCurrentPageObj().find("#third_jury").show();
			getCurrentPageObj().find("#third_jury").addClass("tabBtn_Bg");
			getCurrentPageObj().find("#second_jury").removeClass("tabBtn_Bg");
			getCurrentPageObj().find("#first_jury").removeClass("tabBtn_Bg");
			getCurrentPageObj().find("#third_jury2").show();
			getCurrentPageObj().find("#second_jury2").hide();
			getCurrentPageObj().find("#first_jury2").hide();
		}
	}else{
		if(obj.value=="01"){
			getCurrentPageObj().find("#first_jury").hide();
			getCurrentPageObj().find("#first_jury2").hide();
			getCurrentPageObj().find('input:checkbox[name=juryGradeName]:checked').each(function(i){
				if(0==i){
					if(getCurrentPageObj().find(this).val() == "02") {
						getCurrentPageObj().find("#second_jury2").show();
						getCurrentPageObj().find("#third_jury2").hide();
					}else if(getCurrentPageObj().find(this).val() == "03"){
					
						getCurrentPageObj().find("#third_jury2").show();
						getCurrentPageObj().find("#second_jury2").hide();
					}
				}
			})
		}else if(obj.value=="02"){
			getCurrentPageObj().find("#second_jury").hide();
			getCurrentPageObj().find("#second_jury2").hide();
			getCurrentPageObj().find('input:checkbox[name=juryGradeName]:checked').each(function(i){
				if(0==i){
					if(getCurrentPageObj().find(this).val() == "01") {
						getCurrentPageObj().find("#first_jury2").show();
						getCurrentPageObj().find("#third_jury2").hide();
					}else if(getCurrentPageObj().find(this).val() == "03"){
						getCurrentPageObj().find("#third_jury2").show();
						getCurrentPageObj().find("#first_jury2").hide();
					}
				}
			})
		}else{
			getCurrentPageObj().find("#third_jury").hide();
			getCurrentPageObj().find("#third_jury2").hide();
			getCurrentPageObj().find('input:checkbox[name=juryGradeName]:checked').each(function(i){
				if(0==i){
					if(getCurrentPageObj().find(this).val() == "02") {
						getCurrentPageObj().find("#second_jury2").show();
						getCurrentPageObj().find("#first_jury2").hide();
					}else if(getCurrentPageObj().find(this).val() == "01"){
						getCurrentPageObj().find("#first_jury2").show();
						getCurrentPageObj().find("#second_jury2").hide();
					}
				}
			})
		}
	}
	
	
}

//一级会议回调
function juryTypeF(obj){
	var juryType = "";
	var juryName = "";
	
	getCurrentPageObj().find('input:checkbox[name=juryType]:checked').each(function(i){
       if(0==i){
    	   juryType = getCurrentPageObj().find(this).val();
    	   juryName = getCurrentPageObj().find(this).next().text();
       }else{
    	   juryType += (","+getCurrentPageObj().find(this).val());
    	   juryName += (","+getCurrentPageObj().find(this).next().text());
       }
       
     });
	getCurrentPageObj().find("#jury_type").val(juryType);
	getCurrentPageObj().find("#jury_name").val(juryName);
}
//二级会议回调
function juryTypeF2(){
	
}//
function juryTypeF3(){
	
}

//初始化数据
function themeInit(){
	initCheck(getCurrentPageObj().find("#juryGrade"),{dic_code:"G_DIC_JURY_GRADE"},"juryGradeName","themeGrade");
	initCheck(getCurrentPageObj().find("#juryType"),{dic_code:"G_DIC_JURY_TYPE"},"juryType","juryTypeF");
	initCheck(getCurrentPageObj().find("#juryType2"),{dic_code:"G_DIC_JURY_TYPE"},"juryType2","juryTypeF2");
	initCheck(getCurrentPageObj().find("#juryType3"),{dic_code:"G_DIC_JURY_TYPE"},"juryType3","juryTypeF3");

	/*getCurrentPageObj().find("#judge_name").click(function(){ 
		openRolePop("addDivRole",{name:getCurrentPageObj().find("#judge_name"),no:getCurrentPageObj().find("#judge_role")},false);
	});	*/
	getCurrentPageObj().find("#judge_name2").click(function(){ 
		openRolePop("addDivRole",{name:getCurrentPageObj().find("#judge_name2"),no:getCurrentPageObj().find("#judge_role2")},false);
	});
	getCurrentPageObj().find("#judge_name3").click(function(){ 
		openRolePop("addDivRole",{name:getCurrentPageObj().find("#judge_name3"),no:getCurrentPageObj().find("#judge_role3")},false);
	});
	
	
	/*getCurrentPageObj().find("#jury_principal_name").click(function(){ 
		openRolePop("addDivRole",{name:getCurrentPageObj().find("#jury_principal_name"),no:getCurrentPageObj().find("#jury_principal_role")},false);
	});*/	
	getCurrentPageObj().find("#jury_principal_name2").click(function(){ 
		openRolePop("addDivRole",{name:getCurrentPageObj().find("#jury_principal_name2"),no:getCurrentPageObj().find("#jury_principal_role2")},false);
	});	
	getCurrentPageObj().find("#jury_principal_name3").click(function(){ 
		openRolePop("addDivRole",{name:getCurrentPageObj().find("#jury_principal_name3"),no:getCurrentPageObj().find("#jury_principal_role3")},false);
	});	
	
	
	
	/*getCurrentPageObj().find("#jury_compere_name").click(function(){ 
		openRolePop("addDivRole",{name:getCurrentPageObj().find("#jury_compere_name"),no:getCurrentPageObj().find("#jury_compere_role")},false);
	});*/
	getCurrentPageObj().find("#jury_compere_name2").click(function(){ 
		openRolePop("addDivRole",{name:getCurrentPageObj().find("#jury_compere_name2"),no:getCurrentPageObj().find("#jury_compere_role2")},false);
	});
	getCurrentPageObj().find("#jury_compere_name3").click(function(){ 
		openRolePop("addDivRole",{name:getCurrentPageObj().find("#jury_compere_name3"),no:getCurrentPageObj().find("#jury_compere_role3")},false);
	});
	
	getCurrentPageObj().find("#attend_name").click(function(){ 
		openRolePop("addDivRole",{name:getCurrentPageObj().find("#attend_name"),no:getCurrentPageObj().find("#attend_role")},false);
	});
	getCurrentPageObj().find("#attend_name2").click(function(){ 
		openRolePop("addDivRole",{name:getCurrentPageObj().find("#attend_name2"),no:getCurrentPageObj().find("#attend_role2")},false);
	});
	getCurrentPageObj().find("#attend_name3").click(function(){ 
		openRolePop("addDivRole",{name:getCurrentPageObj().find("#attend_name3"),no:getCurrentPageObj().find("#attend_role3")},false);
	});
	
	//保存评审主题  --添加，修改同一个方法
	getCurrentPageObj().find("#themeSave").click(function(){
		if(!vlidate(getCurrentPageObj().find("#themeFrom"))){
			alert("您还有必填项没有填");
			return ;
		}
		var formFlag = true;
		getCurrentPageObj().find('input:checkbox[name=juryGradeName]:checked').each(function(i){
			var spCodesTemp = getCurrentPageObj().find(this).val();
	    	if(spCodesTemp == '01'){
	    		$("#first_jury").show();
				$("#first_jury").addClass("tabBtn_Bg");
				$("#second_jury").removeClass("tabBtn_Bg");
				$("#third_jury").removeClass("tabBtn_Bg");
				$("#first_jury2").show();
				$("#second_jury2").hide();
				$("#third_jury2").hide();
		    	if(!vlidate($("#themeGrade1From"))){
		    		alert("您还有必填项未填");
		    		formFlag=false;
		    		return false;
		   		}
	    	}
	    	if(spCodesTemp == '02'){
	    		$("#second_jury").show();
				$("#second_jury").addClass("tabBtn_Bg");
				$("#first_jury").removeClass("tabBtn_Bg");
				$("#third_jury").removeClass("tabBtn_Bg");
				$("#second_jury2").show();
				$("#third_jury2").hide();
				$("#first_jury2").hide();
		    	if(!vlidate($("#themeGrade2From"))){
		    		alert("您还有必填项未填");
		    		formFlag=false;
		    		return false;
		   		}
	    	}
	    	if(spCodesTemp == '03'){
	    		$("#third_jury").show();
				$("#third_jury").addClass("tabBtn_Bg");
				$("#second_jury").removeClass("tabBtn_Bg");
				$("#first_jury").removeClass("tabBtn_Bg");
				$("#third_jury2").show();
				$("#second_jury2").hide();
				$("#first_jury2").hide();
		    	if(!vlidate($("#themeGrade3From"))){
		    		alert("您还有必填项未填");
		    		formFlag=false;
		    		return false;
		   		}
	    	}
	     });

		if(!formFlag){
			return;
		}
		
		var process_id = getCurrentPageObj().find("#process_id").val();
		var params = getPageParam("G");
		var jury_compere_role=params.jury_compere_role;
		if(jury_compere_role!=null&&jury_compere_role!=""){
		   params["jury_compere_role"]=jury_compere_role.join(",");
		}
		var judge_role=params.judge_role;
		if(judge_role!=null&&judge_role!=""){
		   params["judge_role"]=judge_role.join(",");
		}
		var jury_principal_role=params.jury_principal_role;
		if(jury_principal_role!=null&&jury_principal_role!=""){
		   params["jury_principal_role"]=jury_principal_role.join(",");
		}
		var attend_role=params.attend_role;
		if(attend_role!=null&&attend_role!=""){
			params["attend_role"]=attend_role.join(",");
		}
	    var jury_compere_role2=params.jury_compere_role2;
	    if(jury_compere_role2!=""&&jury_compere_role2!=null){
		  params["jury_compere_role2"]=jury_compere_role2.join(",");
	    }
	    var judge_role2=params.judge_role2;
	    if(judge_role2!=null&&judge_role2!=""){
		  params["judge_role2"]=judge_role2.join(",");
	    }
	    var jury_principal_role2=params.jury_principal_role2;
	    if(jury_principal_role2!=""&&jury_principal_role2!=null){
		  params["jury_principal_role2"]=jury_principal_role2.join(",");
	    }
	    var attend_role2=params.attend_role2;
		if(attend_role2!=null&&attend_role2!=""){
			params["attend_role2"]=attend_role2.join(",");
		}
		var expertsCall = getMillisecond();
		getCurrentPageObj().find("#tab_subject_add").modal("hide");
		var saveType = getCurrentPageObj().find("#save_type").val();
		params['save_type'] = saveType;			//根据不同的状态来区分是添加还是修改
		baseAjaxJsonp(dev_construction+'GTheme/insertTheme.asp?call='+expertsCall+'&SID='+SID,params, function(data) {
			if (data != undefined&&data!=null&&data.result=="true") {
				getCurrentPageObj().find("#hideTheme").show();
				getCurrentPageObj().find("#tab_subject_add").hide();
				
				hideAll();
				reloadTheme(process_id);
				closePageTab("update_check");
				alert("添加成功");
			}else{
				alert("添加失败");
			}
		},expertsCall);
		
	});
	//返回主题列表页面
	getCurrentPageObj().find("#themeBlack").click(function(){
		//getCurrentPageObj().find("#tab_subject_add").modal("show");
		hideAll();
		getCurrentPageObj().find("#hideTheme").show();
		getCurrentPageObj().find("#tab_subject_add").hide();
		
		
	});
	
	//添加主题跳转页面
	getCurrentPageObj().find("#theme_add").click(function(){
		//getCurrentPageObj().find("#tab_subject_add").modal("show");
		getCurrentPageObj().find("#save_type").val("add");
		getCurrentPageObj().find("#hideTheme").hide();
		getCurrentPageObj().find("#tab_subject_add").show();
		getCurrentPageObj().find("#tab_check").hide();			//不可添加检查项
		getCurrentPageObj().find("#tab_theme").addClass("active");
		getCurrentPageObj().find("#org_info").addClass("active");
		getCurrentPageObj().find("#tab_check").removeClass("active");
		getCurrentPageObj().find("#org_position_div").removeClass("active");
		
		$("#themeFrom input[name^='G.']").val("");
		$("#themeFrom textarea[name^='G.']").val("");
		//初始化岗位
		baseAjax('SRole/querySrole.asp',null,function(data){
			var jury_principal=getCurrentPageObj().find("#jury_principal_role");
			var jury_compere=getCurrentPageObj().find("#jury_compere_role");
			var judge_role=getCurrentPageObj().find("#judge_role");
			var attend_role=getCurrentPageObj().find("#attend_role");
			var jury_principal2=getCurrentPageObj().find("#jury_principal_role2");
			var jury_compere2=getCurrentPageObj().find("#jury_compere_role2");
			var judge_role2=getCurrentPageObj().find("#judge_role2");
			var attend_role2=getCurrentPageObj().find("#attend_role2");
			if(data!=undefined){
				jury_principal.empty();
				jury_compere.empty();
				judge_role.empty();
				attend_role.empty();
				jury_principal2.empty();
				jury_compere2.empty();
				judge_role2.empty();
				attend_role2.empty();
				for(var i=0;i<data.srole.length;i++){
					jury_principal.append('<option value="'+data.srole[i].ROLE_NO+'">'+data.srole[i].ROLE_NAME+'</option>');
					jury_compere.append('<option value="'+data.srole[i].ROLE_NO+'">'+data.srole[i].ROLE_NAME+'</option>');
					judge_role.append('<option value="'+data.srole[i].ROLE_NO+'">'+data.srole[i].ROLE_NAME+'</option>');
					attend_role.append('<option value="'+data.srole[i].ROLE_NO+'">'+data.srole[i].ROLE_NAME+'</option>');
					jury_principal2.append('<option value="'+data.srole[i].ROLE_NO+'">'+data.srole[i].ROLE_NAME+'</option>');
					jury_compere2.append('<option value="'+data.srole[i].ROLE_NO+'">'+data.srole[i].ROLE_NAME+'</option>');
					judge_role2.append('<option value="'+data.srole[i].ROLE_NO+'">'+data.srole[i].ROLE_NAME+'</option>');
					attend_role2.append('<option value="'+data.srole[i].ROLE_NO+'">'+data.srole[i].ROLE_NAME+'</option>');
				}
				jury_principal.select2();
				jury_compere.select2();
				judge_role.select2();
				attend_role.select2();
				jury_principal2.select2();
				jury_compere2.select2();
				judge_role2.select2();
				attend_role2.select2();
			};
		});	
		initCheck(getCurrentPageObj().find("#juryGrade"),{dic_code:"G_DIC_JURY_GRADE"},"juryGradeName","themeGrade");
	});
	
	
		
	//查找要 修改的评审主题，
	getCurrentPageObj().find("#theme_edit").click(function(){
		
		getCurrentPageObj().find("#tab_check").removeClass("active");
		getCurrentPageObj().find("#org_position_div").removeClass("active");
		getCurrentPageObj().find("#tab_theme").addClass("active");
		getCurrentPageObj().find("#org_info").addClass("active");
		
		getCurrentPageObj().find("#save_type").val("edit");		//设置修改标识
		getCurrentPageObj().find("#tab_check").show();			//可添加检查项
		var expertsCall = getMillisecond();
		var id = getCurrentPageObj().find("#ThemeTable").bootstrapTable('getSelections');
		var ids = $.map(id, function (row) {return row.THEME_ID;});	
		if(ids==null||ids==undefined||ids==""){
			alert("请选择一条数据！");
			return;
		}
		var params = {};
		params["theme_id"] = ids[0];
		baseAjaxJsonp(dev_construction+'GTheme/queryThemeById.asp?call='+expertsCall+'&SID='+SID,params, function(data) {
			if (data != undefined&&data!=null&&data.result=="true") {
				//getCurrentPageObj().find("#tab_subject_add").modal("show");
				var gradeCheck = '';	//初始化要选择的级别
				initGCheckList(ids[0]);
				getCurrentPageObj().find("#hideTheme").hide();
				getCurrentPageObj().find("#tab_subject_add").show();

				for ( var k in data) {
					var str = data[k];
					k = k.toLowerCase();
					getCurrentPageObj().find("#"+k).val(str);
				}
				var tLength = data.tGrade.length;
				var flag = false;
				for(var i=0;i<tLength;i++){
					getCurrentPageObj().find("#theme_class").addClass("tab_modal-body");
					getCurrentPageObj().find("#tabWrap").show();
					var tGradeMap = data.tGrade[i];
					var gradeKey = tGradeMap.JURY_GRADE_KEY;
					//if(obj!=undefined&&data!=undefined){
					if(gradeKey =='01'){
						if(!flag) {
							getCurrentPageObj().find("#first_jury").addClass("tabBtn_Bg");
							getCurrentPageObj().find("#first_jury2").show();
							flag = true;
						}
						
						getCurrentPageObj().find("#first_jury").show();
						for ( var k in tGradeMap) {
							var str = tGradeMap[k];
							k = k.toLowerCase();
							getCurrentPageObj().find("#"+k).val(str);
						}
						//初始化岗位
						baseAjax('SRole/querySrole.asp',null,function(data){
							var jury_principal=getCurrentPageObj().find("#jury_principal_role");
							var jury_compere=getCurrentPageObj().find("#jury_compere_role");
							var judge_role=getCurrentPageObj().find("#judge_role");
							var attend_role=getCurrentPageObj().find("#attend_role");
							var jury_principal2=getCurrentPageObj().find("#jury_principal_role2");
							var jury_compere2=getCurrentPageObj().find("#jury_compere_role2");
							var judge_role2=getCurrentPageObj().find("#judge_role2");
							var attend_role2=getCurrentPageObj().find("#attend_role2");
							if(data!=undefined){
								jury_principal.empty();
								jury_compere.empty();
								judge_role.empty();
								attend_role.empty();
								jury_principal2.empty();
								jury_compere2.empty();
								judge_role2.empty();
								attend_role2.empty();
								var jury_principal_roles=tGradeMap["JURY_PRINCIPAL_ROLE"].split(",");
								var jury_compere_roles=tGradeMap["JURY_COMPERE_ROLE"].split(",");
								var judge_roles=tGradeMap["JUDGE_ROLE"].split(",");
								var attend_roles=tGradeMap["ATTEND_ROLE"].split(",");
								for(var i=0;i<data.srole.length;i++){
									jury_principal.append('<option value="'+data.srole[i].ROLE_NO+'">'+data.srole[i].ROLE_NAME+'</option>');
									jury_compere.append('<option value="'+data.srole[i].ROLE_NO+'">'+data.srole[i].ROLE_NAME+'</option>');
									judge_role.append('<option value="'+data.srole[i].ROLE_NO+'">'+data.srole[i].ROLE_NAME+'</option>');
									attend_role.append('<option value="'+data.srole[i].ROLE_NO+'">'+data.srole[i].ROLE_NAME+'</option>');
									jury_principal2.append('<option value="'+data.srole[i].ROLE_NO+'">'+data.srole[i].ROLE_NAME+'</option>');
									jury_compere2.append('<option value="'+data.srole[i].ROLE_NO+'">'+data.srole[i].ROLE_NAME+'</option>');
									judge_role2.append('<option value="'+data.srole[i].ROLE_NO+'">'+data.srole[i].ROLE_NAME+'</option>');
									attend_role2.append('<option value="'+data.srole[i].ROLE_NO+'">'+data.srole[i].ROLE_NAME+'</option>');
									for(var j=0;j<jury_principal_roles.length;j++){
										if(jury_principal_roles[j]==data.srole[i].ROLE_NO){
											jury_principal.children("option:last-child").attr("selected",true);
											break;
										}
									}
									for(var j=0;j<jury_compere_roles.length;j++){
										if(jury_compere_roles[j]==data.srole[i].ROLE_NO){
											jury_compere.children("option:last-child").attr("selected",true);
											break;
										}
									}
									for(var j=0;j<judge_roles.length;j++){
										if(judge_roles[j]==data.srole[i].ROLE_NO){
											judge_role.children("option:last-child").attr("selected",true);
											break;
										}
									}
									for(var j=0;j<attend_roles.length;j++){
										if(attend_roles[j]==data.srole[i].ROLE_NO){
											attend_role.children("option:last-child").attr("selected",true);
											break;
										}
									}
								}
								jury_principal.select2();
								jury_compere.select2();
								judge_role.select2();
								attend_role.select2();
							};
						},false);
					}else if(gradeKey =='02'){
						if(!flag) {
							getCurrentPageObj().find("#second_jury").addClass("tabBtn_Bg");
							getCurrentPageObj().find("#second_jury2").show();
							flag = true;
						}
						getCurrentPageObj().find("#second_jury").show();
						for ( var k in tGradeMap) {
							var str = tGradeMap[k];
							k = k.toLowerCase();
							$("#"+k+"2").val(str);
						}
						//初始化岗位
						baseAjax('SRole/querySrole.asp',null,function(data){
							var jury_principal2=getCurrentPageObj().find("#jury_principal_role2");
							var jury_compere2=getCurrentPageObj().find("#jury_compere_role2");
							var judge_role2=getCurrentPageObj().find("#judge_role2");
							var attend_role2=getCurrentPageObj().find("#attend_role2");
							var jury_principal=getCurrentPageObj().find("#jury_principal_role");
							var jury_compere=getCurrentPageObj().find("#jury_compere_role");
							var judge_role=getCurrentPageObj().find("#judge_role");
							var attend_role=getCurrentPageObj().find("#attend_role");
							if(data!=undefined){
								jury_principal2.empty();
								jury_compere2.empty();
								judge_role2.empty();
								attend_role2.empty();
								var jury_principal_roles2=tGradeMap["JURY_PRINCIPAL_ROLE"].split(",");
								var jury_compere_roles2=tGradeMap["JURY_COMPERE_ROLE"].split(",");
								var judge_roles2=tGradeMap["JUDGE_ROLE"].split(",");
								var attend_roles2=tGradeMap["ATTEND_ROLE"].split(",");
								for(var i=0;i<data.srole.length;i++){
									jury_principal2.append('<option value="'+data.srole[i].ROLE_NO+'">'+data.srole[i].ROLE_NAME+'</option>');
									jury_compere2.append('<option value="'+data.srole[i].ROLE_NO+'">'+data.srole[i].ROLE_NAME+'</option>');
									judge_role2.append('<option value="'+data.srole[i].ROLE_NO+'">'+data.srole[i].ROLE_NAME+'</option>');
									attend_role2.append('<option value="'+data.srole[i].ROLE_NO+'">'+data.srole[i].ROLE_NAME+'</option>');
									jury_principal.append('<option value="'+data.srole[i].ROLE_NO+'">'+data.srole[i].ROLE_NAME+'</option>');
									jury_compere.append('<option value="'+data.srole[i].ROLE_NO+'">'+data.srole[i].ROLE_NAME+'</option>');
									judge_role.append('<option value="'+data.srole[i].ROLE_NO+'">'+data.srole[i].ROLE_NAME+'</option>');
									attend_role.append('<option value="'+data.srole[i].ROLE_NO+'">'+data.srole[i].ROLE_NAME+'</option>');
									for(var j=0;j<jury_principal_roles2.length;j++){
										if(jury_principal_roles2[j]==data.srole[i].ROLE_NO){
											jury_principal2.children("option:last-child").attr("selected",true);
											break;
										}
									}
									for(var j=0;j<jury_compere_roles2.length;j++){
										if(jury_compere_roles2[j]==data.srole[i].ROLE_NO){
											jury_compere2.children("option:last-child").attr("selected",true);
											break;
										}
									}
									for(var j=0;j<judge_roles2.length;j++){
										if(judge_roles2[j]==data.srole[i].ROLE_NO){
											judge_role2.children("option:last-child").attr("selected",true);
											break;
										}
									}
									for(var j=0;j<attend_roles2.length;j++){
										if(attend_roles2[j]==data.srole[i].ROLE_NO){
											attend_role2.children("option:last-child").attr("selected",true);
											break;
										}
									}
								}
								jury_principal2.select2();
								jury_compere2.select2();
								judge_role2.select2();
								attend_role2.select2();
							};
						},false);
					}else if(gradeKey =='03'){
						if(!flag) {
							getCurrentPageObj().find("#third_jury").addClass("tabBtn_Bg");
							getCurrentPageObj().find("#third_jury2").show();
							flag = true;
						}
						getCurrentPageObj().find("#third_jury").show();
						for ( var k in tGradeMap) {
							var str = tGradeMap[k];
							k = k.toLowerCase();
							$("#"+k+"3").val(str);
						}
					}
					
					if(gradeCheck == ''){
						gradeCheck = gradeKey;
					}else{
						gradeCheck = gradeCheck+","+gradeKey;
					}
				}
				getCurrentPageObj().find("#jury_grade").val(gradeCheck);
				initCheck(getCurrentPageObj().find("#juryGrade"),{dic_code:"G_DIC_JURY_GRADE"},"juryGradeName","themeGrade",gradeCheck);
				
			}else{
				alert("添加失败");
			}
		},expertsCall);
	});
	//查找要 删除的评审主题，
	getCurrentPageObj().find("#theme_del").click(function(){
		var process_id = getCurrentPageObj().find("#process_id").val();
		var expertsCall = getMillisecond();
		var id = getCurrentPageObj().find("#ThemeTable").bootstrapTable('getSelections');
		var ids = $.map(id, function (row) {return row.THEME_ID;});	
		if(ids==null||ids==undefined||ids==""){
			alert("请选择一条数据！");
			return;
		}
		var params = {};
		params["theme_id"] = ids[0];
		nconfirm("是否确定删除？",function(){
		baseAjaxJsonp(dev_construction+'GTheme/deleteTheme.asp?call='+expertsCall+'&SID='+SID,params, function(data) {
			if (data != undefined&&data!=null&&data.result=="true") {
				reloadTheme(process_id);
				alert("删除成功");
			}else{
				alert("删除失败");
			}
		},expertsCall);
		});
	});
	
}

function hideAll(){
	//将一二三级评审东东全设置为隐藏
	getCurrentPageObj().find("#first_jury").hide();
	getCurrentPageObj().find("#second_jury").hide();
	getCurrentPageObj().find("#third_jury").hide();
	getCurrentPageObj().find("#first_jury").removeClass("tabBtn_Bg");
	getCurrentPageObj().find("#second_jury").removeClass("tabBtn_Bg");
	getCurrentPageObj().find("#third_jury").removeClass("tabBtn_Bg");
	getCurrentPageObj().find("#first_jury2").hide();
	getCurrentPageObj().find("#second_jury2").hide();
	getCurrentPageObj().find("#third_jury2").hide();
	getCurrentPageObj().find("#theme_class").removeClass("tab_modal-body");
	getCurrentPageObj().find("#tabWrap").hide();
}

$(document).ready(function() {
	getCurrentPageObj().find(".tabBtn").click(function() {
		
		getCurrentPageObj().find(".tabBtn").removeClass('tabBtn_Bg')
		$(this).addClass("tabBtn_Bg");
	});
	getCurrentPageObj().find(".tabD li").click(function() {
		getCurrentPageObj().find(".tabContListD").hide().eq($(this).index()).show();
		$(this).addClass("tabBtn_Bg");
		/* $this.addClass('current');*/
	});
	
});