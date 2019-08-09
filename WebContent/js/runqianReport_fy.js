function endLoading(){
	try{
		window.parent.endLoading();
	}catch(e){
	}
}
function startLoading(){
	try{
		window.parent.startLoading();
	}catch(e){
		endLoading();
	}
}
function runqianReport( width, height ) {
	this.init = rr_init;
	this.setServerURL = rr_setServerURL;
	this.setFile = rr_setFile;
	this.setParamFile = rr_setParamFile;
	this.setNeedQueryButton = rr_setNeedQueryButton;
	this.putParam = rr_putParam;
	this.setDisplayScale = rr_setDisplayScale;
	this.getDisplayScale = rr_getDisplayScale;
	this.setSaveAsName = rr_setSaveAsName;
	this.setNeedFunctionBar = rr_setNeedFunctionBar;
	this.setBorder = rr_setBorder;
	this.display = rr_display;
	var name = "runqian" + ( new Date() ).getTime();
	var s = "<iframe onload='javascript:endLoading()' name=\"" + name + "\" width=" + width +" frameborder=0 style=\"";
	s += "height:350px;\"></iframe>";
	document.write( s );
	this.control = window.frames[ name ];
}

function rr_init() {
	this.paramNames = new Array();
	this.paramValues = new Array();
	this.form = "";
	this.needQueryButton = true;
	this.scale = 100;
	this.saveAsName = "";
	this.needFunctionBar = true;
}

function rr_setServerURL( url ) {
	this.serverURL = url;
}

function rr_setFile( fileName ) {
	this.file = fileName;
}

function rr_setParamFile( paramFile ) {
	this.form = paramFile;
}

function rr_setNeedQueryButton( needQueryButton ) {
	this.needQueryButton = needQueryButton;
}

function rr_putParam( paramName, paramValue ) {
	for( var i = 0; i < this.paramNames.length; i++ ) {
		if( this.paramNames[i] == paramName ) {
			this.paramValues[i] = paramValue;
			return;
		}
	}
	this.paramNames[ this.paramNames.length ] = paramName;
	this.paramValues[ this.paramValues.length ] = paramValue;
}

function rr_setDisplayScale( scale ) {
	this.scale = scale;
}

function rr_getDisplayScale() {
	return this.scale;
}

function rr_setSaveAsName( name ) {
	this.saveAsName = name;
}

function rr_setNeedFunctionBar( needFunctionBar ) {
	this.needFunctionBar = needFunctionBar;
}

function rr_setBorder( border ) {
	this.border = border;
}

function rr_display() {
	startLoading();
	var url = this.serverURL + "reportJsp/showReport4web_fy.jsp?file=" + urlEncode( this.file ) + "&scale=" + this.scale;
	if( this.form.length > 0 ) {
		url += "&form=" + urlEncode( this.form ) + "&needQuery=" + ( this.needQueryButton ? "1" : "0" );
	}
	var params = "";
	for( var i = 0; i < this.paramNames.length; i++ ) {
		if( params.length > 0 ) params += ";";
		params += this.paramNames[i] + "=" + this.paramValues[i];
	}
	if( params.length > 0 ) url += "&params=" + urlEncode( params );
	if( this.saveAsName.length > 0 ) url += "&saveAsName=" + encodeURI(encodeURI(this.saveAsName));
	if( this.needFunctionBar ) url += "&needFunctionBar=1";
	else url += "&needFunctionBar=0";
	if( this.border != null && this.border.length > 0 ) url += "&border=" + urlEncode( this.border );
	//console.info(url);
	this.control.location = url;
}

function urlEncode( str )
{
	var dst = "";
	for ( var i = 0; i < str.length; i++ )
	{
		switch ( str.charAt( i ) )
		{
			case ' ':
				dst += "+";
				break;
			case '!':
				dst += "%21";
				break;
			case '\"':
				dst += "%22";
				break;
			case '#':
				dst += "%23";
				break;
			case '$':
				dst += "%24";
				break;
			case '%':
				dst += "%25";
				break;
			case '&':
				dst += "%26";
				break;
			case '\'':
				dst += "%27";
				break;
			case '(':
				dst += "%28";
				break;
			case ')':
				dst += "%29";
				break;
			case '+':
				dst += "%2B";
				break;
			case ',':
				dst += "%2C";
				break;
			case '/':
				dst += "%2F";
				break;
			case ':':
				dst += "%3A";
				break;
			case ';':
				dst += "%3B";
				break;
			case '<':
				dst += "%3C";
				break;
			case '=':
				dst += "%3D";
				break;
			case '>':
				dst += "%3E";
				break;
			case '?':
				dst += "%3F";
				break;
			case '@':
				dst += "%40";
				break;
			case '[':
				dst += "%5B";
				break;
			case '\\':
				dst += "%5C";
				break;
			case ']':
				dst += "%5D";
				break;
			case '^':
				dst += "%5E";
				break;
			case '`':
				dst += "%60";
				break;
			case '{':
				dst += "%7B";
				break;
			case '|':
				dst += "%7C";
				break;
			case '}':
				dst += "%7D";
				break;
			case '~':
				dst += "%7E";
				break;
			default:
				dst += str.charAt( i );
				break;
		}
	}
	return dst;
}

