/**
 * 打开POP框
 */
var callbacks;
function openfileUploadPop(id,callback){
	callbacks=callback;
	//先清除
	$('#myPop_fileUpload').remove();
	getCurrentPageObj().find('#'+id).empty();
	getCurrentPageObj().find("#"+id).load("dev_workbench/notice/file_upload.html",{},function(){
		getCurrentPageObj().find("#myPop_fileUpload").modal("show");
		initButton();
		initSelects();
	});
}
/**
 * 初始化页面下拉菜单
 */
function initSelects(){
	initVlidate(getCurrentPageObj().find("#file_form"));
	initSelect($("#file_type"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_FILE_TYPE"});
	$("#file_type").select2();
}
/**
 * 初始化页面按钮
 */
function initButton(){
	//确定按钮
	getCurrentPageObj().find('#ok').click(function(){
		if(vlidate(getCurrentPageObj().find("#file_form"),"",false)){
			var old_val=$("#notice_file").val();
			var int=setInterval(function(){
				if(old_val!=getCurrentPageObj().find("#notice_file").val()){
					clearInterval(int);
					$.ajaxFileUpload({
					    url:"sfile/uploadFile.asp?path_id=NOTICE_FILE",
					    type:"post",
						secureuri:false,
						fileElementId:'notice_file',
						data:'',
						dataType: 'json',
						success:function (msg){
							callbacks(getFileData());
						},
						error: function (msg){
							alert("上传失败");
						}
				   });
				}
			},300);
			closefileUploadPop();
		}
	});
	getCurrentPageObj().find('#cancel').click(function(){
		closefileUploadPop();
	});
	getCurrentPageObj().find('#notice_file').change(function(){
		var file = getCurrentPageObj().find('#notice_file').val();
		getCurrentPageObj().find('#file_namel').val(file.substr(file.lastIndexOf("\\")+1));
		getCurrentPageObj().find('#file_name').val(file.substring(file.lastIndexOf("\\")+1,file.lastIndexOf(".")));
	});
}
function closefileUploadPop(){
	getCurrentPageObj().find('#myPop_fileUpload').modal('hide');
}
function getFileData(){
	var temp={};
	temp["file_type"]=getCurrentPageObj().find('#file_type').val();
	temp["file_version"]=getCurrentPageObj().find('#file_version').val();
	temp["file_name"]=getCurrentPageObj().find('#file_name').val();
	temp["file_memo"]=getCurrentPageObj().find('#file_memo').val();
	var nowDate= new Date();
	temp["upload_time"]=nowDate.getFullYear()+"-"+(nowDate.getMonth()+1)+"-"+nowDate.getDate()
	        +"&nbsp;"+nowDate.getHours()+":"+nowDate.getMinutes();
	return temp;
}