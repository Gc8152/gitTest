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
	modalInitEvent();
	//获得当天的相关日期变量
	function dateNoneParam(){
		var day = new Date();
		var today = new Array();
		today['czyear'] = day.getFullYear();
		today['month'] = day.getMonth();
		today['date'] = day.getDate();
		today['week'] = day.getDay();
		today['firstDay'] = firstDay(new Date(today['czyear'],today['month'],1)); 
		return today;
	}

	//获得所选日期的相关变量
	function dateWithParam(year,month){
		var day = new Date(year,month);
		var date = new Array();
		date['czyear'] = day.getFullYear();
		date['month'] = day.getMonth();
		date['firstDay'] = firstDay(new Date(date['czyear'],date['month'],1));
		return date;
	}

    //设置考勤状态html
	var attend= new Array();
    attend[0]="<a class='data_orange'><div class='normal_ico'>休息日</div></a>"//休息日
    attend[3]="<a class='data_orange2'><div class='normal_ico2'>休息日</div></a>"//休息日已报工
    attend[1]="<a class='data_normal'><div class='data_txt'>工作日</div></a>"//工作日未报工
    attend[2]="<a class='data_normal'><div class='data_txt2'>工作日</div></a>"//工作日已报工
	/* attend[8]="<a class='data_today'>...</a>"//统计中  */
	//生成日历代码 的方法
	//参数依次为 年 月
	function selectCode(codeYear,codeMonth){
		select_html = "<div class='cDaySelect'><div class='cselect'><span style='margin-left:-3%;' id='czyear'><select name='czyear'>";
		//年 选择(从1980年开始）
		for(var i=1980;i<=codeYear+yearfloor;i++){
			if(i == codeYear){
				select_html += "<option value='"+i+"' selected='true'>"+(i+"年")+"</option>";
			}else{
				select_html += "<option value='"+i+"'>"+(i+"年")+"</option>";
			}
		}

		select_html += "</select></span></div>\n";

		//月 选择
//		for(var j=0;j<=11;j++){
//			if(j == codeMonth){
//				select_html += "<option value='"+j+"' selected='true'>"+month[j]+"</option>";
//			}else{
//				select_html += "<option value='"+j+"'>"+month[j]+"</option>";
//			}
//		}
//		select_html += "</select>&nbsp月</span>\n";
		if(codeMonth==0){
			select_html +='<div class="cselectm" style="margin-left:45px;"><div class="cstop cmc navdown" id="month" month="'+0+'">'+1+'月</div></div>';
		}else{
			select_html +='<div class="cselectm" style="margin-left:45px;"><div class="cstop cmc" id="month" month="'+0+'">'+1+'月</div></div>';
		}
		for(var i=1;i<=11;i++){
			if(i == codeMonth){
				select_html+='<div class="cselectm" ><div class="cstop cmc navdown" id="month" month="'+i+'">'+(i+1)+'月</div></div>';
			}else{
			    select_html+='<div class="cselectm"><div class="cstop cmc" id="month" month="'+i+'">'+(i+1)+'月</div></div>';
			}
		}
		return select_html+'</div>';
		}
    
	function dayInfo(is67,bookDay,b){
		var ht="";
		if(is67){
			if($.inArray(b,bookDay)>=0){
				ht=attend[3];
			}else{
				ht=attend[0];
			}
		}else{
			if($.inArray(b,bookDay)>=0){
				ht=attend[2];
			}else{
				ht=attend[1];
			}
			
		}
		return ht;
	}
	//参数依次为 年 月 日 当月第一天(是星期几)
	function kalendarCode(codeYear,codeMonth,codeDay,codeFirst){
        kalendar_html="<table id='kalendar' style='height:450px;' class='table' cellpadding='0' cellspacing='0'><thead><tr id='week'><th>周日</th><th>周一</th><th>周二</th><th>周三</th><th>周四</th><th>周五</th><th>周六</th></tr></thead><tbody id='day'>";
		//日 列表
		var dqxy=1;
		var params="";
		var flag=false;//节假日是否已经配置的标识符
		var flag2=false;//项目节假日是否配置
		var date=new Date;
		var year=date.getFullYear();
		var month=date.getMonth()+1;
		if(parseInt(codeMonth)+1<10){
			params=codeYear+"-0"+(parseInt(codeMonth)+1);
		}else{
			params=codeYear+"-"+(parseInt(codeMonth)+1);
		}
		var dayStr=[];//工作日数组
		var bookDay=[];//已报工日期数组
		var projectDate=[];//项目配置数组
		baseAjax("SHolidays/queryWork.asp",{params:params},function(msg){
			if(msg!=null&&msg!=undefined&&msg!=""){
			if(msg.list!=null&&msg.list!=undefined&&msg.list!=""){
				dayStr=msg.list.SDATA.split(",");
			}
			if(msg.bookedDate!=null&&msg.bookedDate!=undefined&&msg.bookedDate!=""){
				bookDay=msg.bookedDate.BOOKDAY.split(",");
			}
			if(msg.projectDate!=null&&msg.projectDate!=undefined&&msg.projectDate!=""){
				projectDate=msg.projectDate.SDATA.split(",");
			}
			if(msg.workConfig.TOTAL>0){ //节假日已经配置
				flag=true;
			}
			if(msg.ProjectWorkConfig>0){
				flag2=true;
			}
			}
			
		},"async");
		 if(flag){//如果节假日已经配置，日历框的工作日和休息日显示按照配置进行
			for(var m=0;m<6;m++){//日期共 4-6 行
				kalendar_html += "<tr id='rili_data' class='dayList dayListHide"+m+"'>\n";
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
						if(flag2){
							var a=7*m+n+1-codeFirst;
							//if((7*m+n+1-codeFirst)<codeDay){
							if(a<10){
								a="0"+ a;
							}else{
								a=""+a;
							}
							if($.inArray(a,projectDate)>=0){
	 							if($.inArray(a,bookDay)>=0){
									if(7*m+n+1-codeFirst==codeDay&&parseInt(codeMonth)+1==month&&codeYear==year){
										kalendar_html += "<td class='navdown'><p   class='cw att_day_true'>"+a+"</p>"+"<a style='display:none'>"+codeYear+"年"+(parseInt(codeMonth)+1)+"月"+(7*m+n+1-codeFirst)+"日"+"</a>"+attend[2]+"</td>";	
									}else{
										kalendar_html += "<td><p  class='att_day_true'>"+a+"</p>"+"<a style='display:none'>"+codeYear+"年"+(parseInt(codeMonth)+1)+"月"+(7*m+n+1-codeFirst)+"日"+"</a>"+attend[2]+"</td>";	
									}
									
								}else{
									if(7*m+n+1-codeFirst==codeDay&&parseInt(codeMonth)+1==month&&codeYear==year){
										kalendar_html += "<td class='navdown'><p class='cw att_day_true'>"+a+"</p>"+"<a style='display:none'>"+codeYear+"年"+(parseInt(codeMonth)+1)+"月"+(7*m+n+1-codeFirst)+"日"+"</a>"+attend[1]+"</td>";
									}else{
										kalendar_html += "<td><p  class='att_day_true'>"+a+"</p>"+"<a style='display:none'>"+codeYear+"年"+(parseInt(codeMonth)+1)+"月"+(7*m+n+1-codeFirst)+"日"+"</a>"+attend[1]+"</td>";
									}
								}

							}else {
								var b=7*m+n+1-codeFirst;
								var is67=((b +codeFirst )% 7 == 0||(b+codeFirst+6)%7==0)?"is67 ":"";//周六或者是周qi
								kalendar_html += (parseInt(codeMonth)+1==month&&codeYear==year&&codeDay==b? "<td class='navdown'><p  class='cw att_day_true'>"+a+"</p>"+"<a style='display:none'>"+codeYear+"年"+(parseInt(codeMonth)+1)+"月"+(7*m+n+1-codeFirst)+"日"+"</a>" : "<td><p  class='att_day_true'>"+a+"</p>"+"<a style='display:none'>"+codeYear+"年"+(parseInt(codeMonth)+1)+"月"+(7*m+n+1-codeFirst)+"日"+"</a>") + dayInfo(is67,bookDay,a) + "</td>";
							}
						}else{
							var a=7*m+n+1-codeFirst;
							//if((7*m+n+1-codeFirst)<codeDay){
							if(a<10){
								a="0"+ a;
							}else{
								a=""+a;
							}
							if($.inArray(a,dayStr)>=0){
	 							if($.inArray(a,bookDay)>=0){
									if(7*m+n+1-codeFirst==codeDay&&parseInt(codeMonth)+1==month&&codeYear==year){
										kalendar_html += "<td class='navdown'><p   class='cw att_day_true'>"+a+"</p>"+"<a style='display:none'>"+codeYear+"年"+(parseInt(codeMonth)+1)+"月"+(7*m+n+1-codeFirst)+"日"+"</a>"+attend[2]+"</td>";	
									}else{
										kalendar_html += "<td><p  class='att_day_true'>"+a+"</p>"+"<a style='display:none'>"+codeYear+"年"+(parseInt(codeMonth)+1)+"月"+(7*m+n+1-codeFirst)+"日"+"</a>"+attend[2]+"</td>";	
									}
									
								}else{
									if(7*m+n+1-codeFirst==codeDay&&parseInt(codeMonth)+1==month&&codeYear==year){
										kalendar_html += "<td class='navdown'><p class='cw att_day_true'>"+a+"</p>"+"<a style='display:none'>"+codeYear+"年"+(parseInt(codeMonth)+1)+"月"+(7*m+n+1-codeFirst)+"日"+"</a>"+attend[1]+"</td>";
									}else{
										kalendar_html += "<td><p  class='att_day_true'>"+a+"</p>"+"<a style='display:none'>"+codeYear+"年"+(parseInt(codeMonth)+1)+"月"+(7*m+n+1-codeFirst)+"日"+"</a>"+attend[1]+"</td>";
									}
								}

							}else {
								/*var b=7*m+n+1-codeFirst;
								var is67=((b +codeFirst )% 7 == 0||(b+codeFirst+6)%7==0)?"is67 ":"";//周六或者是周qi
								kalendar_html += (parseInt(codeMonth)+1==month&&codeYear==year&&codeDay==b? "<td class='navdown'><p  class='cw att_day_true'>"+a+"</p>"+"<a style='display:none'>"+codeYear+"年"+(parseInt(codeMonth)+1)+"月"+(7*m+n+1-codeFirst)+"日"+"</a>" : "<td><p  class='att_day_true'>"+a+"</p>"+"<a style='display:none'>"+codeYear+"年"+(parseInt(codeMonth)+1)+"月"+(7*m+n+1-codeFirst)+"日"+"</a>") + dayInfo(is67,bookDay,a) + "</td>";*/
								if(7*m+n+1-codeFirst==codeDay&&parseInt(codeMonth)+1==month&&codeYear==year){
									if($.inArray(a,bookDay)>=0){
										kalendar_html += "<td class='navdown'><p  class='cw att_day_true'>"+a+"</p>"+"<a style='display:none'>"+codeYear+"年"+(parseInt(codeMonth)+1)+"月"+(7*m+n+1-codeFirst)+"日"+"</a>"+attend[3]+"</td>";
									}else{
										kalendar_html += "<td class='navdown'><p  class='cw att_day_true'>"+a+"</p>"+"<a style='display:none'>"+codeYear+"年"+(parseInt(codeMonth)+1)+"月"+(7*m+n+1-codeFirst)+"日"+"</a>"+attend[0]+"</td>";
									}
								}else{
									if($.inArray(a,bookDay)>=0){
										kalendar_html += "<td><p  class='att_day_true'>"+a+"</p>"+"<a style='display:none'>"+codeYear+"年"+(parseInt(codeMonth)+1)+"月"+(7*m+n+1-codeFirst)+"日"+"</a>"+attend[3]+"</td>";
									}else{
										kalendar_html += "<td><p  class='att_day_true'>"+a+"</p>"+"<a style='display:none'>"+codeYear+"年"+(parseInt(codeMonth)+1)+"月"+(7*m+n+1-codeFirst)+"日"+"</a>"+attend[0]+"</td>";
									}
								}
							}
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
					kalendar_html += "<tr id='rili_data' class='dayList dayListHide"+m+"'>\n";
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
								if(7*m+n+1-codeFirst==codeDay&&parseInt(codeMonth)+1==month&&codeYear==year){
									kalendar_html += "<td class='navdown'><p  class='cw att_day_true'>"+a+"</p>"+"<a style='display:none'>"+codeYear+"年"+(parseInt(codeMonth)+1)+"月"+(7*m+n+1-codeFirst)+"日"+"</a>"+attend[0]+"</td>";
								}else{
									kalendar_html += "<td><p  class='att_day_true'>"+a+"</p>"+"<a style='display:none'>"+codeYear+"年"+(parseInt(codeMonth)+1)+"月"+(7*m+n+1-codeFirst)+"日"+"</a>"+attend[0]+"</td>";
								}

							}else{
                              if($.inArray(a,bookDay)>=0){
                            	  if(7*m+n+1-codeFirst==codeDay&&parseInt(codeMonth)+1==month&&codeYear==year){
                            		  kalendar_html += "<td class='navdown'><p class='cw att_day_true'>"+a+"</p>"+"<a style='display:none'>"+codeYear+"年"+(parseInt(codeMonth)+1)+"月"+(7*m+n+1-codeFirst)+"日"+"</a>"+attend[2]+"</td>";
                            	  }else{
                            		  kalendar_html += "<td><p  class='att_day_true'>"+a+"</p>"+"<a style='display:none'>"+codeYear+"年"+(parseInt(codeMonth)+1)+"月"+(7*m+n+1-codeFirst)+"日"+"</a>"+attend[2]+"</td>";
                            	  }
                            	  
								}else{
									if(7*m+n+1-codeFirst==codeDay&&parseInt(codeMonth)+1==month&&codeYear==year){
										kalendar_html += "<td class='navdown'><p class='cw att_day_true'>"+a+"</p>"+"<a style='display:none'>"+codeYear+"年"+(parseInt(codeMonth)+1)+"月"+(7*m+n+1-codeFirst)+"日"+"</a>"+attend[1]+"</td>";
									}else{
										kalendar_html += "<td><p  class='att_day_true'>"+a+"</p>"+"<a style='display:none'>"+codeYear+"年"+(parseInt(codeMonth)+1)+"月"+(7*m+n+1-codeFirst)+"日"+"</a>"+attend[1]+"</td>";
									}
									
								}
								
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
		var flag3=false;
        var params2="";
        var date=new Date;
		var year=date.getFullYear();
		var month=date.getMonth()+1;
		var selectyearVal=selectyear.val();
		var selectmonthVal=$('#czrili_se .navdown').attr("month");
		if(parseInt(selectmonthVal)+1<10){
			params2=selectyearVal+"-0"+(parseInt(selectmonthVal)+1);
		}else{
			params2=selectyearVal+"-"+(parseInt(selectmonthVal)+1);
		}
		var dayStr2=[];
		var bookDay2=[];
		var projectDate2=[];
		baseAjax("SHolidays/queryWork.asp",{params:params2},function(msg){
			if(msg!=null&&msg!=undefined&&msg!=""){
			if(msg.list!=null&&msg.list!=undefined&&msg.list!=""){
				dayStr2=msg.list.SDATA.split(",");
			}
			if(msg.bookedDate!=null&&msg.bookedDate!=undefined&&msg.bookedDate!=""){
				bookDay2=msg.bookedDate.BOOKDAY.split(",");
			}
			if(msg.projectDate!=null&&msg.projectDate!=undefined&&msg.projectDate!=""){
				projectDate2=msg.projectDate.SDATA.split(",");
			}
			if(msg.workConfig.TOTAL>0){ //节假日已经配置
				flag=true;
			}
			if(msg.ProjectWorkConfig>0){
				flag3=true;
			}
			}
		},"async");
		dateLine = 6;
		$("#rili_data td a").remove();
		$("#rili_data td").removeClass("navdown");
		$("#rili_data a[style]").remove();
		$("#rili_data td p").removeClass("cw");
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
				if(flag3){
					var b=i+1-dateFirstDay;
					if(b<10){
						b="0"+ b;
					}else{
						b=""+b;
					}
					if(i+1-dateFirstDay==dateCurrentDay&&parseInt(selectmonthVal)+1==month&&selectyearVal==year){
						dateObj.eq(i).text(b);
						dateObj.eq(i).attr('class','att_day_true');
						dateObj.eq(i).attr('class','cw');
						dateObj.eq(i).parent().attr('class','navdown');
					}else{
						dateObj.eq(i).text(b);
						dateObj.eq(i).attr('class','att_day_true');
					}
					if($.inArray(b,projectDate2)>=0){
						if($.inArray(b,bookDay2)>=0){
							dateObj.eq(i).after(attend[2]).after("<a style='display:none'>"+selectyear.val()+"年"+(parseInt($('#czrili_se .navdown').attr("month"))+1)+"月"+(i+1-dateFirstDay)+"日"+"</a>");
						}else{
							dateObj.eq(i).after(attend[1]).after("<a style='display:none'>"+selectyear.val()+"年"+(parseInt($('#czrili_se .navdown').attr("month"))+1)+"月"+(i+1-dateFirstDay)+"日"+"</a>");
						}
						
					}else{
						var c=i+1-dateFirstDay;
						var is67=((c +dateFirstDay )% 7 == 0||(c+dateFirstDay+6)%7==0)?"is67 ":"";//周六或者是周qi
						if(is67){
							if($.inArray(b,bookDay2)>=0){
								dateObj.eq(i).after(attend[3]).after("<a style='display:none'>"+selectyear.val()+"年"+(parseInt($('#czrili_se .navdown').attr("month"))+1)+"月"+(i+1-dateFirstDay)+"日"+"</a>");
							}else{
								dateObj.eq(i).after(attend[0]).after("<a style='display:none'>"+selectyear.val()+"年"+(parseInt($('#czrili_se .navdown').attr("month"))+1)+"月"+(i+1-dateFirstDay)+"日"+"</a>");
							}
						}else{
							if($.inArray(b,bookDay2)>=0){
								dateObj.eq(i).after(attend[2]).after("<a style='display:none'>"+selectyear.val()+"年"+(parseInt($('#czrili_se .navdown').attr("month"))+1)+"月"+(i+1-dateFirstDay)+"日"+"</a>");
							}else{
								dateObj.eq(i).after(attend[1]).after("<a style='display:none'>"+selectyear.val()+"年"+(parseInt($('#czrili_se .navdown').attr("month"))+1)+"月"+(i+1-dateFirstDay)+"日"+"</a>");
							}
						}
						//dateObj.eq(i).after(attend[0]).after("<a style='display:none'>"+selectyear.val()+"年"+(parseInt($('#czrili_se .navdown').attr("month"))+1)+"月"+(i+1-dateFirstDay)+"日"+"</a>");
					}
				}else{
					var b=i+1-dateFirstDay;
					if(b<10){
						b="0"+ b;
					}else{
						b=""+b;
					}
					if(i+1-dateFirstDay==dateCurrentDay&&parseInt(selectmonthVal)+1==month&&selectyearVal==year){
						dateObj.eq(i).text(b);
						dateObj.eq(i).attr('class','att_day_true');
						dateObj.eq(i).attr('class','cw');
						dateObj.eq(i).parent().attr('class','navdown');
					}else{
						dateObj.eq(i).text(b);
						dateObj.eq(i).attr('class','att_day_true');
					}
					if($.inArray(b,dayStr2)>=0){
						if($.inArray(b,bookDay2)>=0){
							dateObj.eq(i).after(attend[2]).after("<a style='display:none'>"+selectyear.val()+"年"+(parseInt($('#czrili_se .navdown').attr("month"))+1)+"月"+(i+1-dateFirstDay)+"日"+"</a>");
						}else{
							dateObj.eq(i).after(attend[1]).after("<a style='display:none'>"+selectyear.val()+"年"+(parseInt($('#czrili_se .navdown').attr("month"))+1)+"月"+(i+1-dateFirstDay)+"日"+"</a>");
						}
						
					}else{
						/*var c=i+1-dateFirstDay;
						var is67=((c +dateFirstDay )% 7 == 0||(c+dateFirstDay+6)%7==0)?"is67 ":"";//周六或者是周qi
						if(is67){
							dateObj.eq(i).after(attend[0]).after("<a style='display:none'>"+selectyear.val()+"年"+(parseInt($('#czrili_se .navdown').attr("month"))+1)+"月"+(i+1-dateFirstDay)+"日"+"</a>");
						}else{
							if($.inArray(b,bookDay2)>=0){
								dateObj.eq(i).after(attend[2]).after("<a style='display:none'>"+selectyear.val()+"年"+(parseInt($('#czrili_se .navdown').attr("month"))+1)+"月"+(i+1-dateFirstDay)+"日"+"</a>");
							}else{
								dateObj.eq(i).after(attend[1]).after("<a style='display:none'>"+selectyear.val()+"年"+(parseInt($('#czrili_se .navdown').attr("month"))+1)+"月"+(i+1-dateFirstDay)+"日"+"</a>");
							}
						}*/
						if($.inArray(b,bookDay2)>=0){
							dateObj.eq(i).after(attend[3]).after("<a style='display:none'>"+selectyear.val()+"年"+(parseInt($('#czrili_se .navdown').attr("month"))+1)+"月"+(i+1-dateFirstDay)+"日"+"</a>");
						}else{
							dateObj.eq(i).after(attend[0]).after("<a style='display:none'>"+selectyear.val()+"年"+(parseInt($('#czrili_se .navdown').attr("month"))+1)+"月"+(i+1-dateFirstDay)+"日"+"</a>");
						}
					}
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
						var b=i+1-dateFirstDay;
						if(b<10){
							b="0"+ b;
						}else{
							b=""+b;
						}
						if(i+1-dateFirstDay==dateCurrentDay&&parseInt(selectmonthVal)+1==month&&selectyearVal==year){
							dateObj.eq(i).text(b);
							dateObj.eq(i).attr('class','att_day_true');
							dateObj.eq(i).attr('class','cw');
							dateObj.eq(i).parent().attr('class','navdown');
							//$('#kalendar tr.dayList td').attr('class','navdown');
						}else{
							dateObj.eq(i).text(b);
							dateObj.eq(i).attr('class','att_day_true');
						}
						
						if(i%7==0||i%7==6){
//							if(i+1-dateFirstDay==dateCurrentDay&&parseInt(selectmonthVal)+1==month&&selectyearVal==year){
//								
//							}
							dateObj.eq(i).after(attend[0]).after("<a style='display:none'>"+selectyear.val()+"年"+(parseInt($('#czrili_se .navdown').attr("month"))+1)+"月"+(i+1-dateFirstDay)+"日"+"</a>");
						}else{
							if($.inArray(b,bookDay2)>=0){
								dateObj.eq(i).after(attend[2]).after("<a style='display:none'>"+selectyear.val()+"年"+(parseInt($('#czrili_se .navdown').attr("month"))+1)+"月"+(i+1-dateFirstDay)+"日"+"</a>");
							}else{
								dateObj.eq(i).after(attend[1]).after("<a style='display:none'>"+selectyear.val()+"年"+(parseInt($('#czrili_se .navdown').attr("month"))+1)+"月"+(i+1-dateFirstDay)+"日"+"</a>");
							}
							
						}
					}
				 }
			
		}
		/**
		 * 点击日历标签展示当日任务列表
		 */
        initData_normalClick();

	}

/*************    缓存节点和变量     **************/
	var rili_location = $('#czrili_wrap');//日历代码的位置
	var rili_select=$("#czrili_se");
	var select_html = ''; //年月选择
	var kalendar_html = '';//记录日历自身代码 的变量
	var yearfloor = 0;//选择年份从1980到当前时间的后0年

	var someDay = dateNoneParam();//修改后的某一天,默认是当天
	var yearChange = someDay['czyear'];//改变后的年份，默认当年
	var monthChange = someDay['month'];//改变后的年份，默认当月

/*************   将日历代码放入相应位置，初始时显示此处内容      **************/

	//获取时间，确定日历显示内容
	var today = dateNoneParam();//当天
	/*月-日 设置*/
	var month = new Array('01','02','03','04','05','06','07','08','09','10','11','12');
	var monthDays = leapYear(today['czyear']);//返回数组，记录每月有多少天
	var weekDay = new Array('日','一','二','三','四','五','六');
	kalendar_html = kalendarCode(today['czyear'],today['month'],today['date'],today['firstDay']);
	select_html = selectCode(today['czyear'],today['month']);
	rili_location.html(kalendar_html);
	rili_select.html(select_html);

/*************   js写的日历代码中出现的节点     **************/
	var selectYear = $('#czrili_se #czyear select');//选择年份列表
	var listYear = $('#czrili_se #czyear select option');//所有可选年份
	var selectMonth = $('#czrili_se #month');//选择月份列表
	var listMonth = $('#czrili_se #month select option');//所有可选月份
	var dateLine = Math.ceil((monthDays[today['month']]+today['firstDay'])/7); 
	//当前日历中有几行日期，默认是 当年当月
	var dateDay = $('#kalendar tr.dayList td p');//日历中的每一天


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
	var removeClassw= $('#czrili_se #month');
	selectMonth.bind('click',function(){
		//selectMonth.eq($(this).index()).addClass("navdown").siblings().removeClass("navdown");
		removeClassw.removeClass("navdown");
		$(this).addClass("navdown");
		removeClassw=$(this);
		//获得 月
		monthChange = $(this).attr("month");
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
	$("#kalendar td a.data_orange div").hover(
		function(){			
			$(".popD").css("left",$(this).offset().left+"px");
			$(".popD").css("top",($(this).offset().top-34)+"px");
	        $(".popD").show();
		},
		function(){
			$(".popD").hide();
		});
	
	
	
	//模态框按钮事件
	function modalInitEvent(){
		//新增计划外任务按钮事件
		$("#addTaskExt").click(function(){
//			$('#myModal_planOutter').remove();
//			getCurrentPageObj().find("#planOutterAdd").load("dev_planwork/work/planExtTask_add.html",{},function(){
			autoInitSelect($("#is_work_all_night"));
			$("#planOutter input,textarea").val("");
			$("#planOutter select").select2();
			$("#myModal_planOutter").modal("show");
			//});
			//$("#myModal_planOutter").modal("show");

		});
		
//		//编辑计划按钮事件
//		$("#taskEdit").click(function(){
//			var data=$("#attendanceCalendarTable").TaskMytable("getData");
//			for(var i=0;i<data.rows.length;i++){
//				$("#save").show();
//				$("#taskEdit").hide();
//				if(data.rows[i].STATUS!='审批通过'){
//					$("#attendanceCalendarTable").TaskMytable("beginEditor",i);
//				}
//			 }
//		});
		
		
		//保存报工详情
	    getCurrentPageObj().find("#save").click(function(){
			if(!vlidate($("#attendanceCalendarTable"))){
				return;
			}
			var data=$("#attendanceCalendarTable").TaskMytable("getData");
			for(var i=0;i<data.rows.length;i++){
				$("#attendanceCalendarTable").TaskMytable("endEditor",i);
			}
			saveData(data,"save");
		});
	    //提交
	    getCurrentPageObj().find("#submit").click(function(){
	        if(!vlidate($("#attendanceCalendarTable"))){
	            return;
	        }
	        var data=$("#attendanceCalendarTable").TaskMytable("getData");
	        for(var i=0;i<data.rows.length;i++){
	            $("#attendanceCalendarTable").TaskMytable("endEditor",i);
	        }
	        saveData(data,"submit");
	    });
		
		//说明模态框
		$("#attendanceCalendarTable input:first").click(function(){
			optInput=$(this);
			$("#myModal_desc").modal("show");
			$("#desc").val("");
		});
		
		//说明模态框确定按钮
		$("#saveComment").click(function(){
			$("#myModal_desc").modal("hide");
			var desc=$("#desc").val();//模态框中说明字段的值
			optInput.val(desc);
		});
	}
	/**
	 * 提交数据
	 * @param rows
	 */
	function saveData(data,saveType){
		monthChange = $('#czrili_se .navdown').attr("month");
		var call = getMillisecond();
		if(data){
			baseAjaxJsonp(dev_planwork+ 'workCon/saveTask.asp?call=' + call+ '&SID=' + SID,{total:data.rows.length,data:data.rows,w_date:$("#currentTimeHidden").text(),saveType:saveType},function(msg){
				if(msg.result=="true"){
	                if("submit"==saveType){
	                    alert("提交成功!");
	                    $("#myModal_TaskExt").modal("hide");
	                   // console.log( $('#czrili_se .navdown').attr("month"));
	                   //$('#czrili_se .navdown').click();
	            		y_mChange(selectMonth,monthChange);
	            		//新 年-月 下的对象信息
	            		someDay = dateWithParam(yearChange,monthChange);
	            		//修改 日期 列表
	            		dateChange(selectYear,selectMonth,dateDay,someDay['month'],someDay['firstDay'],monthDays[someDay['month']],today['date']);
	                }else{
	                    alert("保存成功!");
	                }
	                reloadAttendanceCalendarTable();
				}else{
					alert("操作失败!");
				}
			},call);
		}
	}

});
