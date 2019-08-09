//加载饼图
function loadProjectPie(id, project_id,load_html,parm) {
	getCurrentPageObj().find("#" + id).load(load_html, {},
			function() {

			initProjectPie(project_id,parm);

			});
}
//初始化饼图
function initProjectPie(project_id,parm){
	
	ProjectRiskPie(project_id,parm);
	ProjectVerChange(project_id,parm);
	ProjectQualityPie(project_id,parm);
	ProjectConfiglistPie(project_id,parm);	
	
	//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<风险问题<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	function  ProjectRiskPie(project_id,parm){
    	var ProjectRiskCall = getMillisecond();

      	var Risk_Pie = echarts.init(document.getElementById(parm.id1));
      	
      	baseAjaxJsonp(dev_project+"programQuery/queryProjectRiskPie.asp?SID="+SID+"&PROJECT_ID="+project_id+"&call="+ProjectRiskCall,null, function(data) {
      		if (data != undefined&&data!=null&&data.result==true) {
       			
      			var t= data.queryProjectRiskPie;      			
    			
				var s1=0;
				var s2=0;
				var s3=0;
				var s4=0;
				
      			if(t != null && t.length > 0){
      				
    				for(var i=0;i<t.length;i++){
    					
    					var value1=t[i].PONDERANCE_CODE;
    					var value2=t[i].NUM;
    					
    					if(value1=="01"){
      	      				s1=s1+parseInt(value2);
      	      			}
      	      			if(value1=="02"){
      	      				s2=s2+parseInt(value2);
      	      			}
      	      			if(value1=="03"){
      	      				s3=s3+parseInt(value2);
      	      			}
      	      			if(value1=="04"){
      	      				s4=s4+parseInt(value2);
      	      			}
    	
    				}

    				    				
    				var projectoption={
    						title: {
                		        text: '未关闭的风险问题'
                		    },
    						tooltip : {
        				        trigger: 'item',
        				        formatter: "{a} <br/>{b} : {c} ({d}%)"
        				    },
        				    series : [
        				        {
        				            name: '未关闭的风险问题',
        				            type: 'pie',
        				            radius : '75%',
        				            center: ['50%', '60%'],
        				            data:[
        				                {value:s1, name:'严重'},
        				                {value:s2, name:'高'},
        				                {value:s3, name:'中'},
        				                {value:s4, name:'低'}
        				            ],
        				            itemStyle: {
        				                emphasis: {
        				                    shadowBlur: 10,
        				                    shadowOffsetX: 0,
        				                    shadowColor: 'rgba(0, 0, 0, 0.5)'
        				                }
        				            }
        				        }
        				    ]
        				};
        		
    				Risk_Pie.setOption(projectoption);   				
      			}else{
          			$("#"+parm.id1).html("<span class='spanM'>风险问题暂无数据</span>");      			
          		}    			      			     			
      		}    		        		
      	},ProjectRiskCall);
      }
	
 
	//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> 项目变更 >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
	function  ProjectVerChange(project_id,parm){
	  	  
   	 var ProjectVerChangeCall = getMillisecond();
   	 
     	var VerChange_Pie = echarts.init(document.getElementById(parm.id2));
     	
     	baseAjaxJsonp(dev_project+"programQuery/queryProjectVerChangePie.asp?SID="+SID+"&PROJECT_ID="+project_id+"&call="+ProjectVerChangeCall,null, function(data) {
     		if (data != undefined&&data!=null&&data.result==true) {
      			
     			var t= data.queryProjectVerChangePie;
     			
     			if(t != null && t.length > 0){

   					var value1=t[0].REQ;
   					if(value1==null){
   						value1=0;
   					}
   					var value2=t[0].PLAN;
   					if(value2==null){
   						value2=0;
   					}
   					var value3=t[0].VER;       				
   					if(value3==null){
   						value3=0;
   					}
   					
   					if(!(value1==0&&value2==0&&value3==0)){
   						var projectoption={
   		   						title: {
   		               		        text: '项目变更统计'
   		               		    },
   		   						tooltip : {
   		       				        trigger: 'item',
   		       				        formatter: "{a} <br/>{b} : {c} ({d}%)"
   		       				    },
   		       				    series : [
   		       				        {
   		       				            name: '项目变更统计',
   		       				            type: 'pie',
   		       				            radius : '75%',
   		       				            center: ['50%', '60%'],
   		       				            data:[
   		       				                {value:value1, name:'需求变更'},
   		       				                {value:value2, name:'计划变更'},
   		       				                {value:value3, name:'版本变更'}
   		       				            ],
   		       				            itemStyle: {
   		       				                emphasis: {
   		       				                    shadowBlur: 10,
   		       				                    shadowOffsetX: 0,
   		       				                    shadowColor: 'rgba(0,0,0.5)'
   		       				                }
   		       				            }
   		       				        }
   		       				    ]
   		       				};
   		       		
   		   				VerChange_Pie.setOption(projectoption);
   					}else{
   		      			$("#"+parm.id2).html("<span class='spanM'>项目变更暂无数据</span>");
   		      		}
   				   				
     			}else{
          			$("#"+parm.id2).html("<span class='spanM'>项目变更暂无数据</span>");
          		}    			      			     			
     		}    		        		
     	},ProjectVerChangeCall);
     } 
     
	//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<质量不符合项<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	function  ProjectQualityPie(project_id,parm){
  	  
    	 var ProjectQualityCall = getMillisecond();

      	var Quality_Pie = echarts.init(document.getElementById(parm.id3));
      	
      	baseAjaxJsonp(dev_project+"programQuery/queryProjectQualityPie.asp?SID="+SID+"&PROJECT_ID="+project_id+"&call="+ProjectQualityCall,null, function(data) {
      		if (data != undefined&&data!=null&&data.result==true) {
       			
      			var t= data.queryProjectQualityPie;      			
    			
				var s1=0;
				var s2=0;
				var s3=0;
				var s4=0;
      			
      			if(t != null && t.length > 0){
      				
    				for(var i=0;i<t.length;i++){
    					
    					var value1=t[i].GRADE;
    					var value2=t[i].NUM;
    					
    					if(value1=="01"){
      	      				s1=s1+parseInt(value2);
      	      			}
      	      			if(value1=="02"){
      	      				s2=s2+parseInt(value2);
      	      			}
      	      			if(value1=="03"){
      	      				s3=s3+parseInt(value2);
      	      			}
      	      			if(value1=="04"){
      	      				s4=s4+parseInt(value2);
      	      			}
    	
    				}      				
    				    				
    				var projectoption={
    						title: {
                		        text: '未关闭的质量不符合项'
                		    },
    						tooltip : {
        				        trigger: 'item',
        				        formatter: "{a} <br/>{b} : {c} ({d}%)"
        				    },
        				    series : [
        				        {
        				            name: '未关闭的质量不符合项',
        				            type: 'pie',
        				            radius : '75%',
        				            center: ['50%', '60%'],
        				            data:[
        				                {value:s1, name:'致命'},
        				                {value:s2, name:'严重'},
        				                {value:s3, name:'中等'},
        				                {value:s4, name:'轻微'}
        				            ],
        				            itemStyle: {
        				                emphasis: {
        				                    shadowBlur: 10,
        				                    shadowOffsetX: 0,
        				                    shadowColor: 'rgba(0, 0, 0, 0.5)'
        				                }
        				            }
        				        }
        				    ]
        				};
        		
    				Quality_Pie.setOption(projectoption);   				
      			}else{
          			$("#"+parm.id3).html("<span class='spanM'>质量不符合项暂无数据</span>");
          		}    			      			     			
      		}    		        		
      	},ProjectQualityCall);
      }
	
	//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<配置不符合项<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	function  ProjectConfiglistPie(project_id,parm){
	  	  
   	 var ProjectConfiglistCall = getMillisecond();

     	var Configlist_Pie = echarts.init(document.getElementById(parm.id4));
     	
     	baseAjaxJsonp(dev_project+"programQuery/queryProjectConfiglistPie.asp?SID="+SID+"&PROJECT_ID="+project_id+"&call="+ProjectConfiglistCall,null, function(data) {
     		if (data != undefined&&data!=null&&data.result==true) {
      			
     			var t= data.queryProjectConfiglistPie;      			
   			
				var s1=0;
				var s2=0;
				var s3=0;
				var s4=0;
     			
     			if(t != null && t.length > 0){
     				
   				for(var i=0;i<t.length;i++){
   					
   					var value1=t[i].GRADE;
   					var value2=t[i].NUM;
   					
   					if(value1=="01"){
     	      				s1=s1+parseInt(value2);
     	      			}
     	      			if(value1=="02"){
     	      				s2=s2+parseInt(value2);
     	      			}
     	      			if(value1=="03"){
     	      				s3=s3+parseInt(value2);
     	      			}
     	      			if(value1=="04"){
     	      				s4=s4+parseInt(value2);
     	      			}
   	
   				}      				
   				    				
   				var projectoption={
   						title: {
               		        text: '未关闭的配置不符合项'
               		    },
   						tooltip : {
       				        trigger: 'item',
       				        formatter: "{a} <br/>{b} : {c} ({d}%)"
       				    },
       				    series : [
       				        {
       				            name: '未关闭的配置不符合项',
       				            type: 'pie',
       				            radius : '75%',
       				            center: ['50%', '60%'],
       				            data:[
       				                {value:s1, name:'致命'},
       				                {value:s2, name:'严重'},
       				                {value:s3, name:'中等'},
       				                {value:s4, name:'轻微'}
       				            ],
       				            itemStyle: {
       				                emphasis: {
       				                    shadowBlur: 10,
       				                    shadowOffsetX: 0,
       				                    shadowColor: 'rgba(0, 0, 0, 0.5)'
       				                }
       				            }
       				        }
       				    ]
       				};
       		
   				Configlist_Pie.setOption(projectoption);   				
     			}else{
          			$("#"+parm.id4).html("<span class='spanM'>配置不符合项暂无数据</span>");
          		}    			      			     			
     		}    		        		
     	},ProjectConfiglistCall);
     }
}