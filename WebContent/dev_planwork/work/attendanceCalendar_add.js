$(function(){
        inittask();
		window.ss=-1;
        $('.drag').draggable({
            proxy:'clone',
            revert:true,
            cursor:'auto',
            onStartDrag:function(){
                $(this).draggable('options').cursor='not-allowed';
                $(this).draggable('proxy').addClass('dp');
                $(this).draggable('proxy').css('zIndex','-1');
            },
            onStopDrag:function(){
            	var proxy= $(this).draggable('proxy')
                if(proxy){
                    $(this).draggable('proxy').css('display','none');
                }//这是新加的
                $(this).draggable('options').cursor='auto';
            }
        });
        $('#targetQueue').droppable({
            accept:'#sourceQueue .drag',
            onDragEnter:function(e,sourceQueue){
                $(sourceQueue).draggable('options').cursor='auto';
                $(sourceQueue).draggable('proxy').css('border','1px solid red');
                $(sourceQueue).draggable('proxy').css('zIndex','0');//这是新加的
                $(this).addClass('overBg');
            },
            onDragLeave:function(e,sourceQueue){
                $(sourceQueue).draggable('options').cursor='not-allowed';
                $(sourceQueue).draggable('proxy').css('border','1px solid #ccc');
                $(this).removeClass('overBg');
            },
            onDrop:function(e,sourceQueue){
                $(this).append(sourceQueue);
                
                $(this).removeClass('overBg');
                setTimeout(function(){
                    /*alert("这里是拖进#target时弹出模态框");//这里调用放在#target时要出现的模态框*/
                	 $("#myModal_planSubmit").modal("show");
                	
                	},100);
            }
        });
        $('#targetOne').droppable({
            accept:'#sourceQueue .drag,#targetQueue .drag',
            onDragEnter:function(e,sourceQueue){
                $(sourceQueue).draggable('options').cursor='auto';
                $(sourceQueue).draggable('proxy').css('border','1px solid red');
                $(sourceQueue).draggable('proxy').css('zIndex','1');//这是新加的
                $(this).addClass('overBg');
            },
            onDragLeave:function(e,sourceQueue){
                $(sourceQueue).draggable('options').cursor='not-allowed';
                $(sourceQueue).draggable('proxy').css('border','1px solid #ccc');
                
                $(this).removeClass('overBg');
            },
            onDrop:function(e,sourceQueue){
                $(this).append(sourceQueue)
                $(this).removeClass('overBg');
                setTimeout(function(){
                    /*alert("这里是拖进#targetOne时弹出模态框");//这里调用放在#targetOne 时模态框
*/                
                	 $("#myModal_planSubmit").modal("show");	
                },100);
            }
        });   
        
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
       $("#workreport_save").click(function(){
         var param=  $("#workreport_form_add").serialize();
           if(!vlidate($("#workreport_form_add"))){
               return;
           }
           var params=$("#workreport_form_add").serialize();
           var call = getMillisecond();
           baseAjaxJsonp(dev_planwork + 'workReport/saveAttendance.asp?call=' + call+ '&SID=' + SID , params,
               function(msg) {
                   if(null!=msg&&""!=msg&&msg!=undefined){
                       if(msg.result=='true'){
                           alert("新增成功！");
                           $("#myModal_planSubmit").modal("hide");
                       }
                   }
               }, call);

       });

    	/*选择人员*/
    	/*$("#selectPeople").click(function(){
    	    $("#morePeoplepop").modal("show");	
    	});*/

 });
function inittask(){
    inittask_db();
//     $("#sourceQueue").append("<div class='drag dragger_abnormalbg'> "+
//         " <div class='taskTitle'>  "+
//    "  <span>江南银行任务1</span>       "+
//    " <i class='fa fa-sort-asc'></i></div>   "+
//    " <div class='taskContent_wrap'>    "+
//    "   <ul class='taskContent'> "+
//    "        <li><b>任务进度：</b>0%   "+
//    "            <div class='progress'>  "+
//    "                <div class='progress-bar' role='progressbar' aria-valuenow='60' aria-valuemin='0' aria-valuemax='100' style='width: 0;'> "+
//    "                    <span class='sr-only'>40% 完成</span>  "+
//    "                </div>       "+
//    "            </div>     "+
//    "        </li>        "+
//    "        <li><b>计划时间：</b>2017/09/19-2017/09/19</li>     "+
//    "    </ul>        "+
//    "    <div class='taskIcon'>      "+
//    "    <i id='editTaskSubmit' title='任务报工' class='fa fa-pencil'></i>       "+
//    "    <i id='readTaskDet' title='任务详情' class='fa fa-list-ul'></i>     "+
//    "    <i id='readTaskLog' title='任务日志' class='fa fa-file-text'></i>    "+
//    "</div>         "+
//    "    </div>    "+
//    "</div>");


}
/**
 * 待办贴条
 */
function inittask_db(){
    var call = getMillisecond();
    var url = dev_planwork
        + 'workReport/queryTaskList.asp?SID=' + SID + "&call=" + call;
       baseAjaxJsonp(url,
        {

        },function(data){
            var list = data.listdb;
            $("#sourceQueue").empty();
            var daibanDiv="";
            if(list != undefined){
                for ( var i = 0; i < list.length; i++) {
                    var map = list[i];
                    daibanDiv +=
                    "<div class='drag dragger_abnormalbg'> "+
                        " <div class='taskTitle'>  "+
                        "  <span>"+map.PLAN_NAME+"</span>       "+
                        " <i class='fa fa-sort-asc'></i></div>   "+
                        " <div class='taskContent_wrap'>    "+
                        "   <ul class='taskContent'> "+
                        "        <li><b>任务进度：</b>"+map.TASK_PERCENTAGE+"%   "+
                        "            <div class='progress'>  "+
                        "                <div class='progress-bar' role='progressbar' aria-valuenow='60' aria-valuemin='0' aria-valuemax='100' style='width: "+map.TASK_PERCENTAGE+"%;'> "+
                        "                    <span class='sr-only'>40% 完成</span>  "+
                        "                </div>       "+
                        "            </div>     "+
                        "        </li>        "+
                        "        <li><b>计划时间：</b> "+map.RELEASE_START_TIME+"-"+map.RELEASE_END_TIME+"</li> "+
                        "    </ul>        "+
                        "    <div class='taskIcon'>      "+
                        "    <i onclick='editTaskSubmitClick()' title='任务报工' class='fa fa-pencil'></i>       "+
                        "    <i id='readTaskDet' title='任务详情' class='fa fa-list-ul'></i>     "+
                        "    <i onclick='readTaskLogClick()' title='任务日志' class='fa fa-file-text'></i>    "+
                        "</div>         "+
                        "    </div>    "+
                    "</div>" ;
                }
                $("#sourceQueue").append(daibanDiv);
            }
        },call);
}
function editTaskSubmitClick(){
    // 重置表单
    $('#workreport_form_add')[0].reset();
    $("#w_id").val("2047");
    $("#myModal_planSubmit").modal("show");
}
function readTaskLogClick(){
    $("#myModal_planLog").modal("show");
}
