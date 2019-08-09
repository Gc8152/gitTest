window.alert=parent.alert;
var nconfirm=parent.nconfirm;
///**
// * 重新window的alert函数
// */
//window.alert=function(msg,callback){
//	setTimeout(function(){
//		  $.Zebra_Dialog(msg, {
//	          'type':     'close',
//	          'title':    '提示',
//	          'buttons':  ['确定'],
//	          'onClose':  function(caption) {
//	            //if (caption=="确定") {
//	            	if(callback){
//	            		callback();
//	            	}
//	      		//}
//	          }
//	      });
//	},206);
//};
//
///**
// *是否显示nconfirm框 
// */
//var nconfirmIsShow=true;
///**
// * 重写window的confirm函数
// */
//nconfirm=function(msg,callback,cancelback){
//	if(!nconfirmIsShow){
//		return;
//	}
//	nconfirmIsShow=false;
//	setTimeout(function(){
//		$.Zebra_Dialog(msg, {
//	        'type':     'close',
//	        'title':    '提示',
//	        'buttons':  ['确定','取消'],
//	        'onClose':  function(caption) {
//	        	 nconfirmIsShow=true;
//	        	 if (caption=="确定"&&callback) {
//	        		 callback();
//	        	 }else if (cancelback) {
//	        		 cancelback();
//	        	 }
//	         }
//	    });
//	},200);
//};
