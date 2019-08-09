$(function(){
	/*悬浮框*/
	$('.toggleBtn').click(function(){
		var SWidth = $(".suspensionFrame").width();
	    if(SWidth>0){
	    	$(".suspensionFrame").css({"right":"-27px","width":"0","transition":"all .8s ease-in"});
			$(".toggleBtn").removeClass("fa-caret-left").addClass("fa-caret-right");
	   }else{
		   $(".suspensionFrame").css({"width":"350px","right":"27px","transition":"all .8s ease-in"});
			$(".toggleBtn").removeClass("fa-caret-right").addClass("fa-caret-left");
	    }
	});
	});