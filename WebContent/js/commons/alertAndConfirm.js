/**
 * 重新window的alert函数
 */
window.alert=function(msg,callback){
	setTimeout(function(){
		var diaLog_body=$(".ZebraDialog_Body");
		if(diaLog_body.length==1){
			diaLog_body.find("div").text(msg);
			return;
		}
		  $.Zebra_Dialog(msg, {
	          'type':     'close',
	          'title':    '提示',
	          'buttons':  ['确定'],
	          'onClose':  function(caption) {
	            	if(callback){
	            		callback();
	            	}
	          }
	      });
	},206);
};
/**
 * 
 */
var nconfirmIsShow=true;
(function(){
	/**
	 *是否显示nconfirm框 
	 */
	/**
	 * 重写window的confirm函数
	 */
	nconfirm=function(msg,callback,cancelback){
		if(!nconfirmIsShow){
			return;
		}
		nconfirmIsShow=false;
		setTimeout(function(){
		 $.Zebra_Dialog(msg, {
	         'type':     'close',
	         'title':    '提示',
	         'buttons':  ['确定','取消'],
	         'onClose':  function(caption) {
	        	 nconfirmIsShow=true;
	           if (caption=="确定"&&callback) {
	        	   callback();
	           }else if (cancelback) {
	        	   cancelback();
	    		}
	         }
	     });
		},200);
	};
})();

/**
 * 关闭页面的 confirm框
 */
(function(){
	/**
	 *是否显示nconfirm框 
	 */
	var nconfirmIsShow=true;
	/**
	 * 重写window的confirm函数
	 */
	closePageConfirm=function(msg,callback,cancelback){
		if(!nconfirmIsShow){
			return;
		}
		nconfirmIsShow=false;
		setTimeout(function(){
		 $.Zebra_Dialog(msg, {
	         'type':     'close',
	         'title':    '提示',
	         'buttons':  ['确定','取消'],
	         'onClose':  function(caption) {
	        	 nconfirmIsShow=true;
	           if (caption=="确定"&&callback) {
	        	   callback();
	           }else if (cancelback) {
	        	   cancelback();
	    		}
	         }
	     });
		 $(".ZebraDialog_Button0").attr("onclick","$('.ZebraDialogOverlay').click();return false;");
		},200);
	};
})();