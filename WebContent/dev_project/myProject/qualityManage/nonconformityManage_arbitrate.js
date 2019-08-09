$(function(){
	//提交
	$(function(){
		$('#commit_nonconformityManage_arbitrate').bind('click', function(e) {
			window.location.assign("nonconformityManage_queryList.html");		
			e.preventDefault();
		});
	});
	//返回
	$('#nonconformityManage_arbitrate_back').bind('click', function(e) {
		window.location.assign("nonconformityManage_queryList.html");		
		e.preventDefault();
	});
});