/**
 * 一般需求投产公共js 后续修改请在此处编写
 */


//检查投产附件上传情况
	function checkFileUpload(){
		//校验是否上传了文件
		var fileData  = getCurrentPageObj().find("#table_file").bootstrapTable('getData');
		if(fileData!=null&& fileData.length>0){
				var oneLevel="";//"《一级投产评审记录表》";//sj_10
				var twoLevel="";//"《二级投产评审记录表》";//sj_11
				var changeApp="";//"《投产变更操作审批表》";//sj_12
				var changeOpt="《投产变更操作手册》";//sj_13		
				for(var i=0; i<fileData.length; i++){
					var fileType = fileData[i]["FILE_TYPE"];
					if(fileType==undefined){
						continue;
					}
					if(fileType.indexOf("sj_10") >= 0){
						oneLevel="";
					}else if(fileType.indexOf("sj_11") >= 0){
						twoLevel="";
					}else if(fileType.indexOf("sj_12") >= 0){
						changeApp="";
					}else if(fileType.indexOf("sj_13") >= 0){
						changeOpt="";
					}
				}
				var msg=oneLevel+twoLevel+changeApp+changeOpt;
				if(""==msg){
					return true;
				}else{
					alert("请上传"+msg);
					return false;
				}
		} else {
				alert("请上传投产相关附件");
				return false ;
		}
	}