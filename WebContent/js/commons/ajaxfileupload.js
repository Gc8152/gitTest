
jQuery.extend({
	
	 createUploadIframe: function(id, uri)
	 {
	   //create frame
		 	
	            var frameId = 'jUploadFrame' + id;
	            
	            if(window.ActiveXObject) {
	            	var browser=navigator.appName;

	    			var b_version=navigator.appVersion;

	    			var version=b_version.split(";");

	    			var trim_Version=version[1].replace(/[ ]/g,"");
	            	if(browser=="Microsoft Internet Explorer" && trim_Version=="MSIE9.0") {
	            		var io = document.createElement('iframe');
	            		io.id = frameId;
	            		io.name = frameId;
	            		io.style.position = 'absolute';
	    	            io.style.top = '-1000px';
	    	            io.style.left = '-1000px';
	    	            document.body.appendChild(io);
	    	            return io;   
	            	} else if(browser=="Microsoft Internet Explorer" && (trim_Version=="MSIE8.0"||trim_Version=="MSIE7.0"||trim_Version=="MSIE6.0")) {
	            		var io = document.createElement('iframe');
	            		io.id = frameId;
	            		io.name = frameId;
	                    if(typeof uri== 'boolean'){
	                        io.src = 'javascript:false';
	                    }
	                    else if(typeof uri== 'string'){
	                        io.src = uri;
	                    }
	                    io.style.position = 'absolute';
	    	            io.style.top = '-1000px';
	    	            io.style.left = '-1000px';
	    	            document.body.appendChild(io);
		  	            return io;   
	            	}
	            	else {
		                var io = document.createElement('iframe');
		                io.id = frameId;
		                io.name = frameId;
		                io.style.position = 'absolute';
			            io.style.top = '-1000px';
			            io.style.left = '-1000px';
			            document.body.appendChild(io);
			            return io;   
		            }       
	            }
	            else {
	                var io = document.createElement('iframe');
	                io.id = frameId;
	                io.name = frameId;
	                io.style.position = 'absolute';
		            io.style.top = '-1000px';
		            io.style.left = '-1000px';
		            document.body.appendChild(io);
		            return io;   
	            }       
	    },
   /* createUploadIframe: function(id, uri)
	{
			//create frame
            var frameId = 'jUploadFrame' + id;
            var iframeHtml = '<iframe id="' + frameId + '" name="' + frameId + '" style="position:absolute; top:-9999px; left:-9999px"';
			if(window.ActiveXObject)
			{
                if(typeof uri== 'boolean'){
					iframeHtml += ' src="' + 'javascript:false' + '"';

                }
                else if(typeof uri== 'string'){
					iframeHtml += ' src="' + uri + '"';

                }	
			}
			iframeHtml += ' />';
			jQuery(iframeHtml).appendTo(document.body);

            return jQuery('#' + frameId).get(0);			
    },*/
    createUploadForm: function(id, fileElementId, data)
	{
		//create form	
		var formId = 'jUploadForm' + id;
		var fileId = 'jUploadFile' + id;
		var form = jQuery('<form  action="" method="POST" name="' + formId + '" id="' + formId + '" enctype="multipart/form-data"></form>');	
		if(data)
		{
			for(var i in data)
			{
				jQuery('<input type="hidden" name="' + i + '" value="' + data[i] + '" />').appendTo(form);
			}			
		}		
		var oldElement = jQuery('#' + fileElementId);
		var newElement = jQuery(oldElement).clone();
		jQuery(oldElement).attr('id', fileId);
		jQuery(oldElement).before(newElement);
		jQuery(oldElement).appendTo(form);


		
		//set attributes
		jQuery(form).css('position', 'absolute');
		jQuery(form).css('top', '-1200px');
		jQuery(form).css('left', '-1200px');
		jQuery(form).appendTo('body');		
		return form;
    },
    handleError: function( s, xhr, status, e ) 		{
    	// If a local callback was specified, fire it
    			if ( s.error ) {
    				s.error.call( s.context || s, xhr, status, e );
    			}

    			// Fire the global callback
    			if ( s.global ) {
    				(s.context ? jQuery(s.context) : jQuery.event).trigger( "ajaxError", [xhr, s, e] );
    			}
    },
    ajaxFileUpload: function(s) {
        // TODO introduce global settings, allowing the client to modify them for all requests, not only timeout		
        s = jQuery.extend({}, jQuery.ajaxSettings, s);
        var id = new Date().getTime();  
        var io = jQuery.createUploadIframe(id, s.secureuri);
		var form = jQuery.createUploadForm(id, s.fileElementId, (typeof(s.data)=='undefined'?false:s.data));
		var frameId = 'jUploadFrame' + id;
		var formId = 'jUploadForm' + id;		
        // Watch for a new set of requests
        if ( s.global && ! jQuery.active++ )
		{
			jQuery.event.trigger( "ajaxStart" );
		}            
        var requestDone = false;
        // Create the request object
        var xml = {};  
        if ( s.global )
            jQuery.event.trigger("ajaxSend", [xml, s]);
        // Wait for a response to come back
        var uploadCallback = function(isTimeout)
		{			
			var io = document.getElementById(frameId);
            try 
			{				
				if(io.contentWindow)
				{
					 xml.responseText = io.contentWindow.document.body?io.contentWindow.document.body.innerHTML:null;
                	 xml.responseXML = io.contentWindow.document.XMLDocument?io.contentWindow.document.XMLDocument:io.contentWindow.document;
					 
				}else if(io.contentDocument)
				{
					 xml.responseText = io.contentDocument.document.body?io.contentDocument.document.body.innerHTML:null;
                	xml.responseXML = io.contentDocument.document.XMLDocument?io.contentDocument.document.XMLDocument:io.contentDocument.document;
				}						
            }catch(e)
			{
				jQuery.handleError(s, xml, null, e);
			}
            if ( xml || isTimeout == "timeout") 
			{				
                requestDone = true;
                var status;
                try {
                    status = isTimeout != "timeout" ? "success" : "error";
                    // Make sure that the request was successful or notmodified
                    if ( status != "error" )
					{
                        // process the data (runs the xml through httpData regardless of callback)
                        var data = jQuery.uploadHttpData( xml, s.dataType );    
                        // If a local callback was specified, fire it and pass it the data
                        if ( s.success )
                            s.success( data, status );
    
                        // Fire the global callback
                        if( s.global )
                            jQuery.event.trigger( "ajaxSuccess", [xml, s] );
                    } else
                        jQuery.handleError(s, xml, status);
                } catch(e) 
				{
                    status = "error";
                    jQuery.handleError(s, xml, status, e);
                }

                // The request was completed
                if( s.global )
                    jQuery.event.trigger( "ajaxComplete", [xml, s] );

                // Handle the global AJAX counter
                if ( s.global && ! --jQuery.active )
                    jQuery.event.trigger( "ajaxStop" );

                // Process result
                if ( s.complete )
                    s.complete(xml, status);

                jQuery(io).unbind();

                setTimeout(function()
									{	try 
										{
											jQuery(io).remove();
											jQuery(form).remove();	
											
										} catch(e) 
										{
											jQuery.handleError(s, xml, null, e);
										}									

									}, 100);

                xml = null;

            }
        };
        // Timeout checker
        if ( s.timeout > 0 ) 
		{
            setTimeout(function(){
                // Check to see if the request is still happening
                if( !requestDone ) uploadCallback( "timeout" );
            }, s.timeout);
        }
        try 
		{

			var form = jQuery('#' + formId);
			jQuery(form).attr('action', s.url);
			jQuery(form).attr('method', 'POST');
			jQuery(form).attr('target', frameId);
            if(form.encoding)
			{
				jQuery(form).attr('encoding', 'multipart/form-data');      			
            }
            else
			{	
				jQuery(form).attr('enctype', 'multipart/form-data');			
            }			
            jQuery(form).submit();

        } catch(e) 
		{			
            jQuery.handleError(s, xml, null, e);
        }
		
        if(window.attachEvent){
            document.getElementById(frameId).attachEvent('onload', uploadCallback);
        }
        else{
            document.getElementById(frameId).addEventListener('load', uploadCallback, false);
        }   
        return {abort: function () {}};	

    },

    uploadHttpData: function( r, type ) {
        var data = !type;
        data = type == "xml" || data ? r.responseXML : r.responseText;
        data = data.replace("<pre>","");
        data = data.replace("</pre>","");
        /*console.log(data);*/
        // If the type is "script", eval it in global context
        if ( type == "script" )
            jQuery.globalEval( data );
        // Get the JavaScript object, if JSON is used.
        if ( type == "json" ){
        	data = r.responseText;  
            var start = data.indexOf(">");  
            if(start != -1) {  
              var end = data.indexOf("<", start + 1);  
              if(end != -1) {  
                data = data.substring(start + 1, end);  
               }  
            } 
            eval( "data = " + data );
        	/*data = jQuery.parseJSON(jQuery(data).text());*/
        }
        // evaluate scripts within html
        if ( type == "html" )
            jQuery("<div>").html(data).evalScripts();
        return data;
    }
});

