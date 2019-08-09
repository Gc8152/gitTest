//背景图
$(function(){
	jQuery(".ecitic-bg").slide({
		 titCell:".ecitic-bg-circle ul", 
		 mainCell:".ecitic-bg-img ul", 
		 effect:"fold",  
		 autoPlay:true, 
		 autoPage:true,
		 trigger:"click",
		 interTime:2500
	});
	jQuery(".notice_box").slide({mainCell:"#notice_scroll",effect:"topLoop",autoPlay:true,interTime:3500});
});

