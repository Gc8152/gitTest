/**
 * svn方式打开文件上传
 */
function openFileSvnUploadInfo(id,path_id,file_id,callback) {
	openFileUploadInfo(id,path_id,file_id,callback,true);
}
/**
 * 打开文件上传
 */
function openFileUploadInfo(id,path_id,file_id,callback,isSvn) {
	if(openFileUploadInfo.isOpen==false){
		$("#fileUpload"+id+'_'+file_id).modal("show");
		return;
	}
	openFileUploadInfo.isOpen=false;
	$("#myModalFileUpload").remove();
	var fileUpload=
		'<div id="fileUpload'+id+'_'+file_id+'" class="modal hide fade" style="top:10%;" tabindex="-1" role="dialog">'+
		'	<div class="modal-header">'+
		'		<button type="button" class="close" data-dismiss="modal"'+
		'			aria-hidden="true">×</button>'+
		'		<h3 id="myModalLabel">附件上传</h3>'+
		'	</div>'+
		'	<iframe src="upload/uploadify/fileUpload.jsp?path_id='+path_id+'&file_id='+file_id+'&isSvn='+(isSvn||"")+'" style="height: 250px; width: 99.5%;" frameborder="no" scrolling="no">'+
		'	</iframe>'+
		'</div>';
		$("body").append(fileUpload);
		$("#fileUpload"+id+"_"+file_id).modal("show");
		if(callback!=undefined){
			$("#fileUpload"+id+"_"+file_id).on("hidden.bs.modal",function(){
				findFileInfo(file_id,callback,isSvn);
				//callback();
			});
		}
		openFileUploadInfo.isOpen=true;
}

/**
 * 查询附件
 * @param file_id
 */
function findFileInfo(file_id,callback,isSvn){
	var findUrl="sfile/findFileInfo.asp";
	if(isSvn){
		findUrl="sfileSvn/findFileInfo.asp";
	}
	baseAjax(findUrl,{file_id:file_id},function(data){
		if(callback!=undefined){
			callback(data);
		}
	});
}

var isImage={".png": "png",".jpg": "jpg",".jpeg": "jpeg",".bmp": "bmp",".gif": "gif"};
/**
 * 字符串转点点点
 * @param str
 * @param length
 */
function strToPoint(str,length){
	if(str==undefined){
		return "";
	}else if(str.length<=length) {
		return str;
	}else if(str.length>length) {
		return str.substring(0,length-3)+"...";
	}
}
/**
 * svn的显示附件的函数
 * @param obj
 * @param data
 * @param divId 必填  区分不同页面所要显示的多附件列表div
 */
function defaultShowFileSvnInfo(file_id,obj,data,isdel,divId){
	 defaultShowFileInfo(file_id,obj,data,isdel,divId,true);
}
/**
 * 默认的显示附件的函数
 * @param obj
 * @param data
 * @param divId 必填  区分不同页面所要显示的多附件列表div
 */
function defaultShowFileInfo(file_id,obj,data,isdel,divId,isSvn){
	if(isdel==undefined)isdel=false;
	if(typeof data =="object"&&typeof obj=="object"){
		obj.find("div[class^=fileInfo]").remove();
		obj.find("div.moreFileInfo").remove();
		obj.find("br").remove();
		obj.append("<div class='fileInfo130' style='width:690px;float:left;'></div>");
		var fileInfo=obj.find("div.fileInfo130");
		if(data.total<=0||!data.rows){
			return;
		}
		var maxNum=data.total;
		if(data.rows.length>=3){
			maxNum=3;
		}
		var hrefView="";
		for(var i=0;i<maxNum;i++){
			if(isImage[data.rows[i]["FILE_TYPE"]]){
				hrefView="sfile/filePreView.asp?id=";
			}else{
				hrefView="";
			}

			fileInfo.append(getFileInfoShowHtml(data.rows[i]["ID"],data.rows[i]["FILE_NAME"],isdel,hrefView,isSvn));
		}
		
		if(data.total>maxNum){
			obj.append("<div class='fileInfo' style='width:50px;float:left;'>&nbsp;<a>更多...</a></div><br>");
			$("#"+divId).remove();
			$("body:eq(0)").append("<div id='"+divId+"' class='moreFileInfo'></div");
			initMoreFileInfo(obj,divId);
			fileInfo=$("[id='"+divId+"'].moreFileInfo");
		}
		hrefView="";
		for(var i=maxNum;i<data.total;i++){
			if(isImage[data.rows[i]["FILE_TYPE"]]){
				hrefView="sfile/filePreView.asp?id=";
			}else{
				hrefView="";
			}
			fileInfo.append(getFileInfoShowHtml(data.rows[i]["ID"],data.rows[i]["FILE_NAME"],isdel,hrefView));
		}
		initDelFileInfo(file_id,obj,defaultShowFileInfo,isSvn);
	}
}

/**
 * 获取附件展示的html元素
 * @param id
 * @param file_name
 * @param isDel
 * @param isView
 * @returns {String}
 */
function getFileInfoShowHtml(id,file_name,isDel,isView,isSvn){
	var del="";
	var view="";
	if(isDel){
		del="<img src='images/ltee_close_h.png' class='btn-ecitic' fileId='"+id+"' title='删除附件'>";
	}
	if(isView){
		view="<a target='_blank' title='点击预览'  href='upload/view.html?p_id="+id+"&isSvn="+(isSvn||"")+"'><img src='images/prefile.png' style='margin-top:10px;'></a>";
	}
	return '<div class="fileInfo">'
			+'<div class="file_name" title="'+file_name+'" onclick=dowloadFile("'+id+'",'+isSvn+')>'+file_name+'</div>'
			+'<div class="del">'+del+'</div><div style="float:right;line-height:20px;">'+view+'</div>'
			+'</div>';
}
/**
 * 下载附件
 * @param id
 */
function dowloadFile(id,isSvn){
	if(isSvn){
		window.location="sfileSvn/fileDownLoad.asp?id="+id;
	}else{
		window.location="sfile/fileDownLoad.asp?id="+id;
	}
}
/**
 * 更多附件
 * @param obj
 */
function initMoreFileInfo(obj,divId){//contains('John')
	obj.find("div.fileInfo a:contains('更多...')").unbind("click");
	obj.find("div.fileInfo a:contains('更多...')").click(function(){
		var offset=$(this).offset();
		var more_f=$("[id='"+divId+"'].moreFileInfo");
		more_f.css({top:offset.top+33,left:offset.left-250});
		more_f.toggle("normal");
	});
}
/**
 * 附件显示及隐藏控制
 */
(function(){
	var ishow=true;
	$(document).on("click","div.fileInfo a:contains('更多...')",function(){
		ishow=false;
	});
	$(document).on("click",".moreFileInfo",function(){
		ishow=false;
	});
	$(document).on("click","body:eq(0)",function(){
		if(ishow){
			$(".moreFileInfo").hide();
		}
		ishow=true;
	});
})();
/**
 * 删除附件
 * @param file_id
 * @param obj
 * @param callback
 */
function initDelFileInfo(file_id,obj,callback,isSvn){
	$("img[fileId]").unbind("click");
	$("img[fileId]").click(function(){
			var img=$(this);
			delFileInfo($(this).attr("fileId"),function(data){
				if(data["result"]=="false"){
					alert(data["message"]);
				}
				img.parent().remove();
				findFileInfo(file_id,function(data){
					obj.data("newFile",data);
					callback(file_id,obj,data,true);
					obj.find("div.fileInfo a:contains('更多...')").click();
				},isSvn);
			},isSvn);
	});
}
/**
 * 删除附件
 * @param id
 */
function delFileInfo(id,callback,isSvn){
	nconfirm("确定需要删除该附件吗？",function(){
		var delUrl="sfile/delFileInfo.asp";
		if(isSvn){
			delUrl="sfileSvn/delFileInfo.asp";
		}
		baseAjax(delUrl,{id:id},function(data){
			if(callback!=undefined){
				callback(data);
			}
		});
	});
}

/**
 * 展示附件信息
 * @param fid 文件id
 * @param #objId 展示对象id
 */
function viewFileInfo(fid,objId,divId){
	if(fid==undefined||fid==""){
		return;
	}
	findFileInfo(fid,function(data){
		if(data.rows.length>0){
			defaultShowFileInfo(fid,$(objId),data,false,divId);
		}else{
		}
	});
}
/**
 * 展示附件信息
 * @param fid 文件id
 * @param #objId 展示对象id
 */
function viewFileInfoObj(fid,obj,divId){
	if(fid==undefined||fid==""){
		return;
	}
	findFileInfo(fid,function(data){
		if(data.rows.length>0){
			defaultShowFileInfo(fid,obj,data,false,divId);
		}else{
		}
	});
}
/**
 * 展示带关闭按钮的附件信息
 * @param fid 文件id
 * @param #objId 展示对象id
 */
function viewFileInfoClose(fid,objId,divId){
	findFileInfo(fid,function(data){
		defaultShowFileInfo(fid,$(objId),data,true,divId);
	});
}
/**
 * 展示带关闭按钮的附件信息
 * @param fid 文件id
 * @param #objId 展示对象id
 */
function viewFileInfoCloseByObj(fid,obj,divId){
	findFileInfo(fid,function(data){
		obj.data("oldFile",data);obj.data("newFile",data);
		defaultShowFileInfo(fid,obj,data,true,divId);
	});
}