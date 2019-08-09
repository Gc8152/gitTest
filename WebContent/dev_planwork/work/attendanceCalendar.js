$(function(){
		
        
        /*显示隐藏内容*/
        $(".taskTitle").click(function(e) {
       	 /*if(e){
       		    e.stopPropagation();
       		}else{
       		    window.event.cancelBubble=true;
       		}*/
       	
            $(this).next(".taskContent_wrap").eq(0).toggle();     
            if($(this).find("i").hasClass("fa-sort-asc")){
            	$(this).find("i").removeClass("fa-sort-asc").addClass("fa-sort-desc");
            }else{
            	$(this).find("i").removeClass("fa-sort-desc").addClass("fa-sort-asc");
            }
        });
        
       /*模态框*/
        /*添加计划外任务*/
    	$("#addTaskExt").click(function(){
    	    $("#myModal_planOutter").modal("show");	
    	});
    	/*添加新任务*/
    	$("#addTaskNew").click(function(){
    	    $("#myModal_Newplan").modal("show");	
    	});
    	/*报工模态框*/
    	$("#editTaskSubmit").click(function(){
    	    $("#myModal_planSubmit").modal("show");	
    	});
    	/*报工模态框_计划外任务*/
    	$("#editTaskSubmit_ext").click(function(){
    	    $("#myModal_planSubmit_ext").modal("show");	
    	});
    	/*任务详情*/
    	$("#readTaskDet").click(function(){
    	    $("#myModal_planDetails").modal("show");	
    	});
    	/*报工日志*/
    	$("#readTaskLog").click(function(){
    	    $("#myModal_planLog").modal("show");	
    	});
    	/*选择人员*/
    	/*$("#selectPeople").click(function(){
    	    $("#morePeoplepop").modal("show");	
    	});*/
 })