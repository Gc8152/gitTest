/**
 * 日历控件
 */

$(function(){
/*************    方法     **************/
	//判断是否是闰年,计算每个月的天数
	function leapYear(year){
		var isLeap = year%100==0 ? (year%400==0 ? 1 : 0) : (year%4==0 ? 1 : 0);
		return new Array(31,28+isLeap,31,30,31,30,31,31,30,31,30,31);
	}
	//获得某月第一天是周几
	function firstDay(day){
		return day.getDay();
	}

	//获得当天的相关日期变量
	function dateNoneParam(){
		var day = new Date();
		var today = new Array();
		today['year'] = day.getFullYear();
		today['month'] = day.getMonth();
		today['date'] = day.getDate();
		today['week'] = day.getDay();
		today['firstDay'] = firstDay(new Date(today['year'],today['month'],1)); 
		return today;
	}

	//获得所选日期的相关变量
	function dateWithParam(year,month){
		var day = new Date(year,month);
		var date = new Array();
		date['year'] = day.getFullYear();
		date['month'] = day.getMonth();
		date['firstDay'] = firstDay(new Date(date['year'],date['month'],1));
		return date;
	}

    //设置考勤状态html
	var attend= new Array();
    attend[0]="<a class='data_orange'><div class='normal_ico'>休息日</div></a>"//考勤正常
    attend[1]="<a class='data_normal'><div class='data_txt'>上班</div></a>"//迟到
	/* attend[8]="<a class='data_today'>...</a>"//统计中  */
	//生成日历代码 的方法
	//参数依次为 年 月
	function selectCode(codeYear,codeMonth){
		select_html = "<span id='year'><select name='year'>";
		//年 选择(从1980年开始）
		for(var i=1980;i<=codeYear+yearfloor;i++){
			if(i == codeYear){
				select_html += "<option value='"+i+"' selected='true'>"+i+"</option>";
			}else{
				select_html += "<option value='"+i+"'>"+i+"</option>";
			}
		}

		select_html += "</select>&nbsp年</span>\n<span id='month'><select name='year'>";

		//月 选择
		for(var j=0;j<=11;j++){
			if(j == codeMonth){
				select_html += "<option value='"+j+"' selected='true'>"+month[j]+"</option>";
			}else{
				select_html += "<option value='"+j+"'>"+month[j]+"</option>";
			}
		}
		select_html += "</select>&nbsp月</span>\n";
		return select_html;
		}
	//参数依次为 年 月 日 当月第一天(是星期几)
	function kalendarCode(codeYear,codeMonth,codeDay,codeFirst){
		
        kalendar_html="<table id='kalendar_lookup' class='table' cellpadding='0' cellspacing='0'><thead><tr id='week_lookup'><th>周日</th><th>周一</th><th>周二</th><th>周三</th><th>周四</th><th>周五</th><th>周六</th></tr></thead><tbody id='day_lookup'>";
		//日 列表
		var dqxy=1;
		var params="";
		var flag=false;//节假日是否已经配置的标识符
		
		if(parseInt(codeMonth)+1<10){
			params=codeYear+"-0"+(parseInt(codeMonth)+1);
		}else{
			params=codeYear+"-"+(parseInt(codeMonth)+1);
		}
		var dayStr=[];
		baseAjax("SHolidays/queryWork.asp",{params:params},function(msg){
			if(msg.list!=null&&msg.list!=undefined&&msg.list!=""){
				dayStr=msg.list.SDATA.split(",");
			}
			if(msg.workConfig.TOTAL>0){ //节假日已经配置
				flag=true;
			}
			
		},"async");
		 if(flag){//如果节假日已经配置，日历框的工作日和休息日显示按照配置进行
			for(var m=0;m<6;m++){//日期共 4-6 行
				kalendar_html += "<tr id='rili_data_lookup' class='dayList dayListHide"+m+"'>\n";
				for(var n=0;n<7;n++){//列
					if((7*m+n) < codeFirst && codeMonth>=1){//非一月前月日期
						kalendar_html += "<td><p class='att_day_false'>"+((7*m+n-codeFirst)+monthDays[codeMonth-1]+1)+"</p></td>";
					}
					else if((7*m+n) < codeFirst && codeMonth==0){//一月前月日期
						kalendar_html += "<td><p  class='att_day_false'>"+((7*m+n-codeFirst)+monthDays[11]+1)+"</p></td>";
					}
					else if((7*m+n) >= (codeFirst+monthDays[codeMonth])){//下月日期
						kalendar_html += "<td><p  class='att_day_false'>"+(dqxy++)+"</p></td>";
					}
					else{//本月日期
						
						var a=7*m+n+1-codeFirst;
						//if((7*m+n+1-codeFirst)<codeDay){
						if(a<10){
							a="0"+ a;
						}else{
							a=""+a;
						}
						
						if($.inArray(a,dayStr)>=0){
							kalendar_html += "<td><p  class='att_day_true'>"+a+"</p>"+"<a style='display:none'>"+codeYear+"年"+(parseInt(codeMonth)+1)+"月"+(7*m+n+1-codeFirst)+"日"+"</a>"+attend[1]+"</td>";

						}else{
							kalendar_html += "<td><p  class='att_day_true'>"+a+"</p>"+"<a style='display:none'>"+codeYear+"年"+(parseInt(codeMonth)+1)+"月"+(7*m+n+1-codeFirst)+"日"+"</a>"+attend[0]+"</td>";
						}
						//}
						//else if((7*m+n+1-codeFirst)==codeDay){
						//kalendar_html += "<td><p  class='att_day_true'>"+(7*m+n+1-codeFirst)+"</p>"+attend[9]+"</td>";	
						//}
						//else{
						//	kalendar_html += "<td><p  class='att_day_true'>"+(7*m+n+1-codeFirst)+"</p></td>";
						//	} 
					}
				}
				kalendar_html += "</tr>\n";
			}
		 }else{//如果节假日没有配置，工作日和休息日按照默认方式进行，周六日显示休息日，周一至周五为工作日
			 for(var m=0;m<6;m++){//日期共 4-6 行
					kalendar_html += "<tr id='rili_data_lookup' class='dayList dayListHide"+m+"'>\n";
					for(var n=0;n<7;n++){//列
						if((7*m+n) < codeFirst && codeMonth>=1){//非一月前月日期
							kalendar_html += "<td><p class='att_day_false'>"+((7*m+n-codeFirst)+monthDays[codeMonth-1]+1)+"</p></td>";
						}
						else if((7*m+n) < codeFirst && codeMonth==0){//一月前月日期
							kalendar_html += "<td><p  class='att_day_false'>"+((7*m+n-codeFirst)+monthDays[11]+1)+"</p></td>";
						}
						else if((7*m+n) >= (codeFirst+monthDays[codeMonth])){//下月日期
							kalendar_html += "<td><p  class='att_day_false'>"+(dqxy++)+"</p></td>";
						}
						else{//本月日期
							var a=7*m+n+1-codeFirst;
							//if((7*m+n+1-codeFirst)<codeDay){
							if(a<10){
								a="0"+ a;
							}else{
								a=""+a;
							}
							if(n==0||n==6){//周末或者周六
								kalendar_html += "<td><p  class='att_day_true'>"+a+"</p>"+"<a style='display:none'>"+codeYear+"年"+(parseInt(codeMonth)+1)+"月"+(7*m+n+1-codeFirst)+"日"+"</a>"+attend[0]+"</td>";

							}else{
								kalendar_html += "<td><p  class='att_day_true'>"+a+"</p>"+"<a style='display:none'>"+codeYear+"年"+(parseInt(codeMonth)+1)+"月"+(7*m+n+1-codeFirst)+"日"+"</a>"+attend[1]+"</td>";
							}
							//}
							//else if((7*m+n+1-codeFirst)==codeDay){
							//kalendar_html += "<td><p  class='att_day_true'>"+(7*m+n+1-codeFirst)+"</p>"+attend[9]+"</td>";	
							//}
							//else{
							//	kalendar_html += "<td><p  class='att_day_true'>"+(7*m+n+1-codeFirst)+"</p></td>";
							//	} 
						}
					}
					kalendar_html += "</tr>\n";
				}
			 
		 }
			
		kalendar_html += "</tbody></table>";
		return kalendar_html;
	}

	//年-月select框改变数值 的方法
	//参数依次为 1、操作对象(年下拉菜单 或 月下拉菜单) 2、被选中的下拉菜单值
	function y_mChange(obj,stopId){
		obj.val(stopId);
	}

	//修改日历列表 的方法
	//参数依次为 操作对象(每一天) 月份 修改后的第一天是星期几 修改后的总天数 当天的具体日期
	function dateChange(selectyear,selectmonth,dateObj,dateMonth,dateFirstDay,dateTotalDays,dateCurrentDay){
		var flag=false;//节假日是否已经配置标识符
        var params2="";
		var selectyearVal=selectyear.val();
		var selectmonthVal=selectmonth.val();
		if(parseInt(selectmonthVal)+1<10){
			params2=selectyearVal+"-0"+(parseInt(selectmonthVal)+1);
		}else{
			params2=selectyearVal+"-"+(parseInt(selectmonthVal)+1);
		}
		var dayStr2=[];
		baseAjax("SHolidays/queryWork.asp",{params:params2},function(msg){
			if(msg.list!=null&&msg.list!=undefined&&msg.list!=""){
				dayStr2=msg.list.SDATA.split(",");
			}
			if(msg.workConfig.TOTAL>0){ //节假日已经配置
				flag=true;
			}
		},"async");
		dateLine = 6;
		$("#rili_data_lookup td a").remove();
		$("#rili_data_lookup a[style]").remove();
		if(dateTotalDays < dateCurrentDay){
			dateCurrentDay = dateTotalDays;
		}
		var xysj=1;
		if(flag){//已配置节假日
		 for(var i=0;i<7*dateLine;i++){
			if(i < dateFirstDay && dateMonth>=1){//非一月上月日期
				dateObj.eq(i).text((i+1-dateFirstDay)+monthDays[dateMonth-1]);
				dateObj.eq(i).attr('class','att_day_false');
			}
			else if(i < dateFirstDay && dateMonth==0){//一月上月日期
				dateObj.eq(i).text((i+1-dateFirstDay)+monthDays[11]);
				dateObj.eq(i).attr('class','att_day_false');
			}
			else if(i>(dateTotalDays+dateFirstDay-1)){//下月日期
				dateObj.eq(i).text(xysj);
				dateObj.eq(i).attr('class','att_day_false');
				xysj++;
				}
			else{
				dateObj.eq(i).text(i+1-dateFirstDay);
				dateObj.eq(i).attr('class','att_day_true');
				
				var b=i+1-dateFirstDay;
				if(b<10){
					b="0"+ b;
				}else{
					b=""+b;
				}
				if($.inArray(b,dayStr2)>=0){
					dateObj.eq(i).after(attend[1]).after("<a style='display:none'>"+selectyear.val()+"年"+(parseInt(selectmonth.val())+1)+"月"+(i+1-dateFirstDay)+"日"+"</a>");
				}else{
					dateObj.eq(i).after(attend[0]).after("<a style='display:none'>"+selectyear.val()+"年"+(parseInt(selectmonth.val())+1)+"月"+(i+1-dateFirstDay)+"日"+"</a>");
				}
			}
		 }
		}else{
			 for(var i=0;i<7*dateLine;i++){
					if(i < dateFirstDay && dateMonth>=1){//非一月上月日期
						dateObj.eq(i).text((i+1-dateFirstDay)+monthDays[dateMonth-1]);
						dateObj.eq(i).attr('class','att_day_false');
					}
					else if(i < dateFirstDay && dateMonth==0){//一月上月日期
						dateObj.eq(i).text((i+1-dateFirstDay)+monthDays[11]);
						dateObj.eq(i).attr('class','att_day_false');
					}
					else if(i>(dateTotalDays+dateFirstDay-1)){//下月日期
						dateObj.eq(i).text(xysj);
						dateObj.eq(i).attr('class','att_day_false');
						xysj++;
						}
					else{
						dateObj.eq(i).text(i+1-dateFirstDay);
						dateObj.eq(i).attr('class','att_day_true');
						
						var b=i+1-dateFirstDay;
						if(b<10){
							b="0"+ b;
						}else{
							b=""+b;
						}
						if(i%7==0||i%7==6){
							dateObj.eq(i).after(attend[0]).after("<a style='display:none'>"+selectyear.val()+"年"+(parseInt(selectmonth.val())+1)+"月"+(i+1-dateFirstDay)+"日"+"</a>");
						}else{
							dateObj.eq(i).after(attend[1]).after("<a style='display:none'>"+selectyear.val()+"年"+(parseInt(selectmonth.val())+1)+"月"+(i+1-dateFirstDay)+"日"+"</a>");
						}
					}
				 }
			
		}
		/**
		 * 点击日历标签展示当日任务列表
		 */
		$(".data_normal").bind('click',function() {
			var currY=$('#rili_se_lookup #year select').val();//当前年
			var currM=(parseInt($('#rili_se_lookup #month  select').val())+1).toString();//当前月
			if(currM.length<2){
				currM="0"+currM;//月份为两位数
			}
			var currD=$(this).prev().prev().text();
			if(currD.length<2){
				currD="0"+currD;//日期为两位数
			}
			var currDate=currY+'年'+currM+'月'+currD+"日";//显示的日期格式为2017年3月15日
			var currTime=currY+'-'+currM+'-'+currD;//查询的日期格式为yyyy-mm-dd
			$("#currentTime2").text(currDate);
			
			$("#currentTimeHidden2").text(currTime);
			$("#attendanceCalendarTable_lookup").bootstrapTable("refresh",{url:dev_planwork + 'workCon/queryTaskDetailsLookup.asp?call=' + call+ '&SID=' + SID+ '&cutt_time=' + currTime});
		});
	}

/*************    缓存节点和变量     **************/
	var rili_location = $('#rili_wrap_lookup');//日历代码的位置
	var rili_select=$("#rili_se_lookup");
	var select_html = ''; //年月选择
	var kalendar_html = '';//记录日历自身代码 的变量
	var yearfloor = 0;//选择年份从1980到当前时间的后0年

	var someDay = dateNoneParam();//修改后的某一天,默认是当天
	var yearChange = someDay['year'];//改变后的年份，默认当年
	var monthChange = someDay['month'];//改变后的年份，默认当月

/*************   将日历代码放入相应位置，初始时显示此处内容      **************/

	//获取时间，确定日历显示内容
	var today = dateNoneParam();//当天
	/*月-日 设置*/
	var month = new Array('01','02','03','04','05','06','07','08','09','10','11','12');
	var monthDays = leapYear(today['year']);//返回数组，记录每月有多少天
	var weekDay = new Array('日','一','二','三','四','五','六');
	kalendar_html = kalendarCode(today['year'],today['month'],today['date'],today['firstDay']);
	select_html = selectCode(today['year'],today['month']);
	rili_location.html(kalendar_html);
	rili_select.html(select_html);

/*************   js写的日历代码中出现的节点     **************/
	var selectYear = $('#rili_se_lookup #year select');//选择年份列表
	var listYear = $('#rili_se_lookup #year select option');//所有可选年份
	var selectMonth = $('#rili_se_lookup #month  select');//选择月份列表
	var listMonth = $('#rili_se_lookup #month select option');//所有可选月份
	var dateLine = Math.ceil((monthDays[today['month']]+today['firstDay'])/7); 
	//当前日历中有几行日期，默认是 当年当月
	var dateDay = $('#kalendar_lookup tr.dayList td p');//日历中的每一天


/***************************/
	// 年 选择事件
	selectYear.bind('change',function(){
		//获得年份
		yearChange = $(this).val();
		//修改年份
		y_mChange(selectYear,yearChange);
		//重新获得 每月天数
		monthDays = leapYear(yearChange);
		//新 年-月 下的对象信息
		someDay = dateWithParam(yearChange,monthChange);
		//修改 日期 列表
		dateChange(selectYear,selectMonth,dateDay,someDay['month'],someDay['firstDay'],monthDays[someDay['month']],today['date']);
	});

	// 月 选择事件
	selectMonth.bind('change',function(){
		//获得 月
		monthChange = $(this).val();
		//修改月份
		y_mChange(selectMonth,monthChange);
		//新 年-月 下的对象信息
		someDay = dateWithParam(yearChange,monthChange);
		//修改 日期 列表
		dateChange(selectYear,selectMonth,dateDay,someDay['month'],someDay['firstDay'],monthDays[someDay['month']],today['date']);
	});
	/* 显示详情 */
	$(".todoT tr").click(function(){
		$(".Bgdetalis table").toggle();
	});
	/* 鼠标悬停，展示异常详情 */
	$("#kalendar_lookup td a.data_orange div").hover(
		function(){			
			$(".popD").css("left",$(this).offset().left+"px")
			$(".popD").css("top",($(this).offset().top-34)+"px")
	        $(".popD").show();
		},
		function(){
			$(".popD").hide();
		});
});