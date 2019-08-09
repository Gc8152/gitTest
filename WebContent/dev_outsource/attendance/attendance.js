var calls = getMillisecond();
var beginAdd ;  
var beginDate = new Date();  
function ShowTime() {  
    var now = new Date();  
    var diff = (now - beginDate);  
    beginAdd.setMilliseconds(beginAdd.getMilliseconds() + diff);  
    beginDate = now;  
    getCurrentPageObj().find("#txt").text(beginAdd.toLocaleString()+' 星期'+'日一二三四五六'.charAt(beginAdd.getDay()));
}  
setInterval("ShowTime();",1000);  
$(document).ready(function(){ 
	init();
		
});	
	//页面初始化函数
	function init(){
		baseAjaxJsonp(dev_outsource+"attendance/getCurrentDate.asp?SID="+SID+"&call="+calls,{},function(dt){
			$("#myworkcalendar1").WorkCalendar({
					date:new Date(dt.currentDateJ),
					onSwitch:function(ym){
						getMonthInfo(ym);
					},onClick:function(type,data){
						 //上下班打卡事件
						punch_card(type,data);
					},onSuccess:function(){
					}
				});
				var list=dt.allAttendanceList;
				var today = dt.currentDate;
				var holidays = dt.holidays;
				beginAdd = new Date(dt.time);
				initHtml(list,today,dt.bef,dt.aft,holidays);
				getCurrentPageObj().find("#info").text("【规定时间"+dt.am_late_time+"之前 60 分钟到之后 30 分钟这段时间可进行上班登记，规定时间"+dt.pm_late_time+"之前 10 分钟到之后 240 分钟这段时间可进行下班登记】");
			},calls,false);
	}
	
		//上下班打卡
		function punch_card(type,date){
			var params={"type":type,"date":date};
			baseAjaxJsonp(dev_outsource+"attendance/punch_card.asp?SID="+SID+"&call="+calls,params,function(data){
				if(data.result==true){
					if(type=="bef"){
						//打卡正常，迟到
						if(data.acc_status=="00"){
							getCurrentPageObj().find("#"+date).children(".alltitle_bef").removeClass("alltitle_bef_today").removeAttr("title").html("<span>上班打卡："+data.current_time+"</span>");
						}else{
							getCurrentPageObj().find("#"+date).children(".alltitle_bef").removeClass("alltitle_bef_today").removeAttr("title").html("<span style='color:red;'>迟到："+data.current_time+"</span>");
						}
					}else{
						getCurrentPageObj().find("#"+date).children(".alltitle_aft").html("<span>下班打卡："+data.current_time+"</span>");

					}					
				}else{
					init();
					alert("不在打卡时间内");
				}
			},calls);
		}
		//打卡信息页面渲染
		function initHtml(list,today,bef,aft,holidays){
			//渲染节假日配置
			for(var i=0;i<holidays.length;i++){
				var bean=holidays[i];
				if(bean.S_TYPE=="1"){
					getCurrentPageObj().find("#"+bean.S_DATE).removeClass("is67").find(".stateday").text("工作日");
				}else{
					getCurrentPageObj().find("#"+bean.S_DATE).addClass("is67").find(".stateday").text("休息日");
				}
			}
			//上班打卡状态
			if(bef=="0"){
				getCurrentPageObj().find("#"+today).children(".alltitle_bef").removeClass("alltitle_bef_today").removeAttr("title").html("<span>不在考勤时间段</span>");
			}else if(bef=="1"){
				getCurrentPageObj().find("#"+today).children(".alltitle_bef").html("<span>上班打卡</span>");
			}else{
				getCurrentPageObj().find("#"+today).children(".alltitle_bef").removeClass("alltitle_bef_today").removeAttr("title").html("<span>上班：未打卡</span>");
			}
			//下班打卡状态
			if(aft=="0"){
				getCurrentPageObj().find("#"+today).children(".alltitle_aft").removeClass("alltitle_aft_today").removeAttr("title").html("<span>不在考勤时间段</span>");
			}else if(aft=="1"){
				getCurrentPageObj().find("#"+today).children(".alltitle_aft").html("<span>下班打卡</span>");
			}else{
				getCurrentPageObj().find("#"+today).children(".alltitle_aft").removeClass("alltitle_aft_today").removeAttr("title").html("<span>下班：未打卡</span>");
			}				
			for(var i=0;i<list.length;i++){
				var bean=list[i];
				//如果是今天
				if(bean.WORK_DATE==today){
					if(bean.BERW_TIME!=null){ 
						//迟到
						if(bean.ACC_STATUS=="03"){
							getCurrentPageObj().find("#"+bean.WORK_DATE).children(".alltitle_bef").removeClass("alltitle_bef_today").removeAttr("title").html("<span style='color:red;'>迟到："+bean.BERW_TIME+"</span>");
						}else{
							getCurrentPageObj().find("#"+bean.WORK_DATE).children(".alltitle_bef").removeClass("alltitle_bef_today").removeAttr("title").html("<span>上班打卡："+bean.BERW_TIME+"</span>");
						}
					}
					if(bean.AFTW_TIME!=null){
						getCurrentPageObj().find("#"+bean.WORK_DATE).children(".alltitle_aft").html("<span>下班打卡："+bean.AFTW_TIME+"</span>");
					}
				}else{
					if(bean.BERW_TIME!=null){
						//迟到
						if(bean.ACC_STATUS=="03"){
							getCurrentPageObj().find("#"+bean.WORK_DATE).children(".alltitle_bef").html("<span style='color:red;'>迟到："+bean.BERW_TIME+"</span>");
						}else{
							getCurrentPageObj().find("#"+bean.WORK_DATE).children(".alltitle_bef").html("<span>上班打卡："+bean.BERW_TIME+"</span>");
						}					
					}else{
						getCurrentPageObj().find("#"+bean.WORK_DATE).children(".alltitle_bef").html("<span>上班：未打卡</span>");
					}
					if(bean.AFTW_TIME!=null){
						getCurrentPageObj().find("#"+bean.WORK_DATE).children(".alltitle_aft").html("<span>下班打卡："+bean.AFTW_TIME+"</span>");
					}else{
						getCurrentPageObj().find("#"+bean.WORK_DATE).children(".alltitle_aft").html("<span>下班：未打卡</span>");
					}
				}
			}
		}
		//切换月份获取当月打卡信息
		function getMonthInfo(ym){
			baseAjaxJsonp(dev_outsource+"attendance/getMonthInfo.asp?SID="+SID+"&call="+calls,{"ym":ym},function(data){
				var list = data.allAttendanceList;
				var today = data.currentDate;
				var holidays = data.holidays;
				initHtml(list,today,data.bef,data.aft,holidays)
			},calls);
		}
		
		function startTime(){
			var today=new Date();
			var h=today.getHours();
			var m=today.getMinutes();
			var s=today.getSeconds();// 在小于10的数字钱前加一个‘0’
			m=checkTime(m);
			s=checkTime(s);
			getCurrentPageObj().find("#txt").text(h+":"+m+":"+s);
			t=setTimeout(function(){startTime()},1000);
		}
		function checkTime(i){
			if (i<10){
				i="0" + i;
			}
			return i;
		}