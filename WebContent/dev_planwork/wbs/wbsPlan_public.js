//任务类别字典项
var P_DIC_PLAN_TYPE = [ {
	"value" : "01",
	"text" : "阶段"
}, {
	"value" : "02",
	"text" : "里程碑"
}, {
	"value" : "03",
	"text" : "工作任务"
}, {
	"value" : "04",
	"text" : "外部任务"
}, {
	"value" : "05",
	"text" : "计划外任务"
} ];
//“是否”字典项配置
var T_DIC_YN = [{
	"value" : "00",
	"text" : "是"
},{
	"value" : "01",
	"text" : "否"
}];
//任务类型字典项
var P_DIC_OUTTER_TASK_TYPE = [{
	"value" : "00",
	"text" : "需求分析"
},{
	"value" : "01",
	"text" : "概要设计"
},{
	"value" : "02",
	"text" : "详细设计"
},{
	"value" : "03",
	"text" : "编码开发"
},{
	"value" : "04",
	"text" : "SIT测试"
},{
	"value" : "05",
	"text" : "UAT测试"
},{
	"value" : "06",
	"text" : "投产"
},{
	"value" : "07",
	"text" : "项目管理"
},{
	"value" : "08",
	"text" : "质量保证"
},{
	"value" : "09",
	"text" : "配置管理"
},{
	"value" : "10",
	"text" : "评审"
},{
	"value" : "11",
	"text" : "会议"
},{
	"value" : "12",
	"text" : "其他"
},{
	"value" : "13",
	"text" : "计划外任务"
},{
	"value" : "14",
	"text" : "联调测试"
}];
//滚动页面 表格标题固定
function scrollHeadFixed(tabNO){
      if($(tabNO+" .datagrid-view-header").length==0){
            var datagridHeader1=$(tabNO+" .datagrid-view1 .datagrid-header").prop("outerHTML");
            var datagridHeader2=$(tabNO+" .datagrid-view2 .datagrid-header").prop("outerHTML");
            var divH="<div class='datagrid-view-header' style='position:absolute;display:block;width:2000px;height:35px;z-index: 300;border-top: 1px solid #dddddd;'>"+datagridHeader1+datagridHeader2+"</div>";
            $(tabNO+" .datagrid-wrap").append(divH);
            $(tabNO+" .datagrid-view-header .datagrid-header").eq(0).css({"position":"absolute","left":"0","z-index":"400"});
            $(tabNO+" .datagrid-view-header .datagrid-header").eq(1).css({"position":"absolute","left":"210px"});
      }
      $(tabNO+" .datagrid-view").scroll(function(){
            var scrollL=$(this).scrollLeft();
            var scrollT=$(this).scrollTop();
            $(tabNO+ " .datagrid-view1").css("left",scrollL);
            $(tabNO+" .datagrid-view-header .datagrid-header").eq(1).css("left",210-scrollL);
      });
}
