/**
 * 打开打印窗口
 */
function openPrintWindow(url) {
	$("#printIFrame").attr("src",url);
	$("#printModal").modal("show");
}
//网页打印时清空页眉页脚
function pagesetup_null() {
	var hkey_root,hkey_path,hkey_key;
	hkey_root="HKEY_CURRENT_USER";
	hkey_path="\\Software\\Microsoft\\Internet Explorer\\PageSetup\\";
    try {
        var RegWsh = new ActiveXObject("WScript.Shell");
        hkey_key = "header";
        RegWsh.RegWrite(hkey_root + hkey_path + hkey_key, "");
        hkey_key = "footer";
        RegWsh.RegWrite(hkey_root + hkey_path + hkey_key, "");
    } catch (e) {
    }
}
/**
 * 打印
 */
function printDocument(){
	pagesetup_null();
	 if(!!window.ActiveXObject || "ActiveXObject" in window) { 
		var pwin=window.open($("#printIFrame").attr("src"),"print");
		pwin.print();
	}else{
		document.getElementById("printIFrame").contentWindow.print();
	}
}
/**
 * 初始化打印模态框
 */
(function(){
	if($("#printModal").length>0){
		return;
	}
	var printModal=
		'<div id="printModal" class="modal hide fade" style="top: 20px;width: 70%; height: 90%;margin-left:-672px;left: 50%;" tabindex="-1" role="dialog">'+
		'	<div class="modal-header">'+
		'		<button type="button" class="close" data-dismiss="modal"'+
		'			aria-hidden="true">×</button>'+
		'	</div>'+
		'	<iframe id="printIFrame" style="height:80%; width: 99.5%;" frameborder="no" scrolling="no">'+
		'	</iframe>'+
		'<div class="modal-footer">'+
		'<button class="btn btn-ecitic" onclick="printDocument()">打印</button>'+
		'<button class="btn btn-ecitic"  data-dismiss="modal" aria-hidden="true">关闭</button>'+
		'</div>'+
		'</div>';
	$("body:eq(0)").append(printModal);
})();