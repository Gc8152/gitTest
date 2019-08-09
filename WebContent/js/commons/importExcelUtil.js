(function(importExcel){
	var after="导入";
	//获取当前毫秒值
	var millisecond=function(){var myData = new Date();return "jq_"+myData.getTime();};
	/**
	 * 获取Excel导入的模态框
	 */
	var getModal=function(title,templateUrl,file_id,upload_func){
		var id="import_"+millisecond();
		var importButtonId="importButton_"+millisecond();
		var file_PathId="file_PathId_"+millisecond();
		var modal=	'<div name="importExcel_modal" id="'+id+'" class="modal hide fade" tabindex="-1">                  '+
		'	<div class="modal-header">                                                                                 '+
		'		<button type="button" class="close" data-dismiss="modal">×</button>                                    '+
		'		<h3>'+title+after+'</h3>                                                                               '+
		'	</div>                                                                                                     '+
		'	<div class="modal-body" style="overflow-x: hidden; max-height: 450px;padding-top:0px;">                    '+
		'		<table id="supplier_info_import" class="table table-bordered tablr-input-text">                        '+
		'			<tr>                                                                                               '+
		'				<td width="120" class="table-text">选择附件：</td>                                              '+
		'				<td width="430">                                                                               '+
		'					<div class="upload-checkfile-all1">                                                        '+
		'						<input type="text" name="'+file_PathId+'" id="'+file_PathId+'" class="input-txt" readonly/>'+
		"<span>浏览<input type='file' name='file' onchange=$('#"+file_PathId+"').val(this.value)  class='input-file' id='"+file_id+"'/>"+
		'						</span>                                                                                '+
		'					</div>                                                                                     '+
		'				</td>                                                                                          '+
		'				<td width="120" class="table-text">                                                            '+
		'					<a href="'+templateUrl+'" style="color:blue;'+(templateUrl?"":"display:none")+'">下载模板</a>'+
		'				</td>                                                                                          '+
		'			</tr>                                                                                              '+
		'		</table>                                                                                               '+
		'	</div>                                                                                                     '+
		'	<div class="modal-footer" style="text-align:center">                                                       '+
		'			<button class="btn" aria-hidden="true"  data-dismiss="modal">关闭</button>                         '+
		'			<button   class="btn btn-ecitic" id="'+importButtonId+'">'+after+title+'</button>                  '+
		'	</div>                                                                                                     '+
		'</div>'+
		'<script type="text/javascript" src="js/commons/ajaxfileupload.js"></script>';
		$("div[name='importExcel_modal']").html("");
		$("div[name='importExcel_modal']").remove();
		$("body").append(modal);
		$("#"+importButtonId).unbind("click").click(function(){
			var path=$("#"+file_PathId).val();
			if($.trim(path)==""){
				alert("请选择要导入的文件");
			}else{
				upload_func();
			}
		});
		return [id,file_PathId];
	};
	/**
	 * 上传的具体操作
	 */
	var ajaxUpload=function(uploadUrl,fileId,success_func,param){
		startLoading();
		 $.ajaxFileUpload({
			    url:uploadUrl,
			    type:"post",
				secureuri:false,
				fileElementId:fileId,
				data:(param||""),
				dataType:"json",
				success:function (msg){
					endLoading();
					if(success_func){
						success_func(msg);
					}
				},
				error: function (msg){
					endLoading();
					alert(after+"失败！");
					return;
				}
		   });
	};
	/**
	 * Excel导入调用的入口
	 * @param openElement打开导入框的元素对象
	 * @param title标题
	 * @param templateUrl模板下载地址
	 * @param uploadUrl文件上传对应的后台地址
	 * @param call_func回调函数
	 */
	importExcel.initImportExcel=function(openElement,title,templateUrl,uploadUrl,call_func){
		after="导入";
		openElement.unbind("click").click(function(){
			var file_id="importFile_"+millisecond();
			var id=getModal(title,templateUrl,file_id,function(){
				ajaxUpload(uploadUrl,file_id,call_func);
				$("#"+id[0]).modal("hide");
			});
			$("#"+id[0]).modal("show");
		});
	};
	/**
	 * @param openElement
	 * @param options={title,templateUrl,file_id,path_id}
	 */
	importExcel.initUploadFile=function(options){
		after="上传";
//		openElement.unbind("click").click(function(){
			var file_id=(options["file_id"]||"");
			var title=(options.title||"");
			var templateUrl=(options.templateUrl||"");
			var call_func=options.call_func;
			var path_id=options.path_id;
			var uploadUrl="sfile/uploadFile.asp";
			var id=getModal(title,templateUrl,file_id,function(){
				var file_name=$("#"+id[1]).val();
				file_name=file_name.split("\\");
				file_name=file_name[file_name.length-1];
				ajaxUpload(uploadUrl,file_id,call_func,
						{path_id:path_id,file_id:file_id,file_name:file_name});
				$("#"+id[0]).modal("hide");
			});
			$("#"+id[0]).modal("show");
//		});
	};
})(window.importExcel={});


