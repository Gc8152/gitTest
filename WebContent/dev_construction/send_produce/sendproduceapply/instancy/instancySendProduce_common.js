
/**
 * 紧急需求投产公共js 后续修改请在此处编写
 */
//检查紧急投产附件上传情况
	function checkInstancyFileUpload(id){
		if(!id){
			id="#table_file1";
		}
		//校验是否上传了文件
		var fileData  = getCurrentPageObj().find(id).bootstrapTable('getData');
		if(fileData!=null&& fileData.length>0){
				var oneFile="";//"《影响分析报告》";//10
				var twoFile="《紧急投产变更操作手册》";//11
				for(var i=0; i<fileData.length; i++){
					var fileType = fileData[i]["FILE_TYPE"];
					if(fileType==undefined){
						continue;
					}
				/*	if(fileType.indexOf("10") >= 0){
						oneFile="";
					}else */if(fileType.indexOf("11") >= 0){
						twoFile="";
					}
				}
				var msg=oneFile+twoFile;
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