/**
 * bootstrap-table 行内编辑
 * 一、在列中配置edit
 * {
		field : 'ORDER_ID',
		title : '序号',
		align : "center",
		width : "60",
		edit:{
			type:"text",//textarea、select
			click:function(data){}
		}		
   }
   //如果是select 则需要配置 edit:{value:"",text:"",url:"",type:"select"}
   二、开启编辑和结束编辑
   table.bootstrapTable("beginEditor",0);
   table.bootstrapTable("endEditor",0);
   table.bootstrapTable("endAllEditor");   
 * 
 * @param jq
 */
(function(jq){
	var BootstrapTable = jq.fn.bootstrapTable.Constructor;
	var index=$.fn.bootstrapTable.methods.length;
	$.fn.bootstrapTable.methods[index]="beginEditor";
	$.fn.bootstrapTable.methods[index+1]="endEditor";
	$.fn.bootstrapTable.methods[index+2]="endAllEditor";
	
	/**开始编辑**/
	BootstrapTable.prototype.beginEditor=function(o){
		var i=-1;
		if("object"== typeof o){//根据field来开启编辑
			var data=this.getData();
			jq.each(o,function(k,v){
				for(var j=0;j<data.length;j++){
					if(data[j][k]==v){
						i=j;
					}
				}
			});
		}else{
			i=o;
		}
		if(i!=-1){
			beginEditor(this.options.columns,this.getData()[i],this.$body.find("tr:eq("+i+") td"));
			this.$body.find("select").select2();
		}
	};
	/**结束编辑**/
	BootstrapTable.prototype.endEditor=function(o){
		var i=-1;
		if("object"== typeof o){//根据field来开启编辑
			var data=this.getData();
			jq.each(o,function(k,v){
				for(var j=0;j<data.length;j++){
					if(data[j][k]==v){
						i=j;
					}
				}
			});
		}else{
			i=o;
		}
		if(i!=-1){
			var isEditor=this.$body.find("tr:eq("+i+")").find("input[type='text'],select,textarea");
			if(isEditor.length>0){
				endEditor(this.options.columns,this.getData()[i],this.$body.find("tr:eq("+i+") td"));
			}
		}
	};
	/**结束全部编辑**/
	BootstrapTable.prototype.endAllEditor=function(){
		var data=this.getData();
		for(var i=0;i<data.length;i++){
			this.endEditor(i);
		}
		return data;
	};
	function endEditor(columns,data,tds){
		var j=0;
		jq.each(columns, function(i, column) {
			if(column.visible==true){
				if(column.edit&&column.edit.type=="text"){
					var val=tds.eq(j).find("input").val(); 
					data[column.field]=val;
					tds.eq(j).empty().text(val);
				}else if(column.edit&&column.edit.type=="textarea"){
					var val=tds.eq(j).find("textarea").val(); 
					data[column.field]=val;
					tds.eq(j).empty().text(val);
				}else if(column.edit&&column.edit.type=="select"){
					var select=tds.eq(j).find("select"); 
					data[column.field]=select.val();
					tds.eq(j).empty().text(select.find("option:selected").text());
				}
				j++;
			}
		});
	}
	
	function beginEditor(columns,data,tds){
		var is= tds.find("input[type='text'],textarea,select");
		if(is.length>0){return;}
		var j=0;
		jq.each(columns, function(i, column) {
			if(column.visible==true){
				var val=(data[column.field]||"");
				var html="";
				if(column.edit&&column.edit.type=="text"){
					html=$(textHtml(val,column.edit.attr));
				}else if(column.edit&&column.edit.type=="textarea"){
					html=$(textareaHtml(val,column.edit.attr));
				}else if(column.edit&&column.edit.type=="select"){
					html=$(selectHtml(column.edit,val,column.edit.attr));
				}
				if(column.edit&&column.edit.click){
					html.unbind("click").click(function(){
						column.edit.click(data,html);
					});
				}
				if(html){
					tds.eq(j).html(html);
				}
				j++;
			}
	  	});
	}
	
	function textHtml(val,attr){
		var text=jq("<input type='text' "+(attr||"")+"/>");
		if(val&&$.trim(val)!=""){
			text.val(val);
		}
		return text;
	}
	
	function textareaHtml(val,attr){
		var textarea=jq("<textarea "+(attr||"")+"></textarea>");
		if(val&&$.trim(val)!=""){
			textarea.val(val);
		}
		return textarea;
	}
	
	function selectHtml(edit,val,attr){
		var select= jq("<select "+(attr||"")+"></select>");
		baseAjax(edit.url,function(data){
			if(data.json){
				data=data.json;
			}
			$.each(data,function(i){
				select.append("<option value='"+data[i][edit.value]+"'>"+data[i][edit.text]+"</option>");
			});
			if(val&&$.trim(val)!=""){
				select.val(val);
			}
			select.select2();
		});
		return select;
	}
	
   function baseAjax(url,callback) {
		$.ajax({
			type : "get",
			url : url,
			dataType : "json",
			success : function(msg) {
				callback(msg);
			},
			error : function() {
				callback();
			}
		});
	}
})(jQuery);