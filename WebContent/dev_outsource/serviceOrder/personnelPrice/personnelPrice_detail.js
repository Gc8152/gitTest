function initDetail(p_id){
		//初始化类别 详情
		var call = getMillisecond();
		baseAjaxJsonp(dev_outsource+'pPrice/findPPTypeById.asp?&p_id='+p_id+'&call='+call+'&SID='+SID,null,function(msg){
			if(msg){
				for(var k in msg){
					getCurrentPageObj().find("#"+k).text(msg[k]);
				}
			}
			//初始化单价信息详情
			var call_price = getMillisecond();
			baseAjaxJsonp(dev_outsource+'pPrice/findPPriceById.asp?&p_id='+p_id+'&call='+call_price+'&SID='+SID,null,function(msg){
				for(var i=0;i<msg.total;i++){
					var p_memo=msg.rows[i].P_MEMO;
					if(p_memo==undefined||p_memo==null||p_memo==""){
						p_memo="";
					}
					var p_price=msg.rows[i].P_PRICE;
					if(p_price==undefined||p_price==null||p_price==""){
						p_price="";
					}
					var tr=
						"<tr>" +
						"<td><div id='P_POST'>"+msg.rows[i].P_POSTS+"</div></select></td>" +
						"<td><div id='P_LEVEL'>"+msg.rows[i].P_POST_LEVEL+"</div></select></td>" +
						"<td><div id='P_PRICE_TAX'>"+msg.rows[i].P_PRICE_TAX+"</div></td>" +
						"<td><div id='P_MEMO'>"+p_memo+"</div></td>" +
						"</tr>";
					getCurrentPageObj().find("#pprice_detail_table").append(tr);
				}
			},call_price);
		},call);
}