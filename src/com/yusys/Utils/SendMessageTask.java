package com.yusys.Utils;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.io.StringReader;
import java.net.Socket;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.Callable;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.FutureTask;

import javax.xml.parsers.ParserConfigurationException;
import javax.xml.transform.TransformerException;

import org.apache.log4j.Logger;
import org.jdom.input.SAXBuilder;
import org.xml.sax.InputSource;


public class SendMessageTask {
	
	private static final Logger logger = Logger.getLogger(SendMessageTask.class);
	
	/**
	 * 线程池对象
	 */
	private final static  ExecutorService executorService;
	static{
		executorService=Executors.newCachedThreadPool();
	}
	
	public void testSendMessage() {
		logger.info("=========开始发送短信========="); 
	
		String phone="13651284874";
		String content="13651284874";
		
		HashMap map=new HashMap();
			
		//取出手机号并发送短信
		String flag= "";
		map=this.sendMessage("",phone, content, 0);
		//获取发送状态
		flag=map.get("RET_STATUS")+"";		
			
		if("S".equals(flag)){//发送成功
			
		}
		logger.info("=========结束发送短信========="); 
	}
	public static synchronized boolean sendMobileMsg(final String addres,final String phone,final String context){
		FutureTask<String> futureTask =
		       new FutureTask<String>(new Callable<String>() {
		         public String call() {
			        	 Map<String,String> map=sendMessage(addres,phone,context,0);
			        	 if (map==null||map.size()==0) {
							return "1";
			        	 }else if("S".equals(map.get("RET_STATUS").trim())){
			        		 return "0";
			        	 }
			        	 return "1";
			         	}
		         });
		executorService.submit(futureTask);
		try {
			if("0".equals(futureTask.get())){
				return true;
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return false;
	}

	  /**
	   * 发送短信方法
	   * @param phone 电话号码
	   * @param msgtext 短信内容
	   */
	  public static HashMap<String,String> sendMessage(String addres,String phone,String msgtext,int count){
		  	logger.info("开始发送短线,服务地址:"+addres);
		  	String ip="10.1.14.25";int port=30078;//默认的ip和端口
		  	if (null==addres||addres.trim().length()==0||addres.indexOf(":")==-1) {
				return null;
			}
		  	String []addresArr=addres.split(":");
		  	ip=addresArr[0];
		  	port=Integer.valueOf(addresArr[1]);
		  	
		  	HashMap<String,String> map = new HashMap<String,String>();
		  	Socket socket = null;
		    BufferedReader br = null;
		    PrintWriter pw = null;
		    try {
		    	//开发环境10.1.14.25
		    	//测试环境10.1.14.234
		    	//生产环境10.2.99.11
		    	socket = new Socket(ip,port);
		    	String upXML = createSmsXml(phone,msgtext,count);
		    	pw = new PrintWriter(socket.getOutputStream());
		    	pw.println(upXML);
		    	pw.flush();
		    	br = new BufferedReader(new InputStreamReader(socket.getInputStream()));
		    	String downXML = "";    	
		    	StringBuffer sb = new StringBuffer();
		    	char [] arr = new char[2048];
		    	int read;
				read = br.read(arr,0,arr.length);
				sb.append(new String(arr,0,read));
				downXML = sb.toString();
				downXML = new String(downXML.getBytes(),"UTF-8");
				downXML = downXML.substring(8,downXML.length());
				logger.info("从服务端返回报文："+downXML);
				map = xmlStringReader(downXML);
		    }catch (ParserConfigurationException e){
		      e.printStackTrace();
		    }catch (Exception e){
		      e.printStackTrace();
		    }finally{
		    	try{
		    		br.close();
		    		pw.close();
		    		socket.close();
		    	}catch(IOException e){
		    		e.printStackTrace();
		    	}
		    }
		    return map;
	  }	
	
	
	
	
	  /**
	   * 上传短信XML报文
	   * @param phone 电话号码
	   * @param msgtext 短信内容
	   */
	  private static String createSmsXml(String phone,String msgtext,int count)
	    throws ParserConfigurationException, TransformerException{
		  SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMdd");
		  SimpleDateFormat sdf1 = new SimpleDateFormat("HHmmss");
		  Date date = new Date();
		  String TRAN_DATE = sdf.format(date);
		  String TRAN_TIMESTAMP = sdf1.format(date);
		  String numbleng = String.valueOf(count);
		  for(int i = 0; i < 10; i++){
			  if(numbleng.length() < 10){
				  numbleng = "0" + numbleng;
			  }else{
				  break;
			  }
		  }
		  String CONSUMER_SEQ_NO = "040801"+TRAN_DATE+numbleng;
		  //logger.info("流水号："+CONSUMER_SEQ_NO);
		  CONSUMER_SEQ_NO="";
		  
		  String upXML = "<?xml version=\"1.0\" encoding=\"UTF-8\"?><service><sys-header><data name=\"SYS_HEAD\"><struct><data name=\"TRAN_TIMESTAMP\">"
	  			+ "<field length=\"6\" scale=\"0\" type=\"string\">"+TRAN_TIMESTAMP+"</field></data>"
	  			+ "<data name=\"TRAN_DATE\"><field length=\"8\" scale=\"0\" type=\"string\">"+TRAN_DATE+"</field></data>"
	  			+ "<data name=\"SERVICE_SCENE\"><field length=\"2\" scale=\"0\" type=\"string\">01</field></data>"
	  			+ "<data name=\"CONSUMER_ID\"><field length=\"6\" scale=\"0\" type=\"string\">040801</field></data>"
	  			+ "<data name=\"SERVICE_CODE\"><field length=\"11\" scale=\"0\" type=\"string\">11002000006</field></data>"
	  			+ "<data name=\"CONSUMER_SEQ_NO\"><field length=\"25\" scale=\"0\" type=\"string\">"+CONSUMER_SEQ_NO+"</field></data>"
	  			+ "</struct></data></sys-header><app-header><data name=\"APP_HEAD\"><struct></struct></data></app-header><local-header>"
	  			+ "<data name=\"LOCAL_HEAD\"><struct></struct></data></local-header><body><data name=\"BODY\"><struct>"
	  			+ "<data name=\"MOBILE\"><field length=\"30\" scale=\"0\" type=\"string\">"+phone+"</field></data>"
	  			+ "<data name=\"BUSS_TYPE\"><field length=\"10\" scale=\"0\" type=\"string\">ESB_MONI</field></data>"
	  			+ "<data name=\"MSG_CONTENT\"><field length=\"1024\" scale=\"0\" type=\"string\">"+msgtext+"</field></data></struct></data></body></service>";
		  byte []buff = upXML.getBytes();
		  String bleng = String.valueOf(buff.length);
		  for(int i = 0; i < 8; i++){
			  if(bleng.length() < 8){
				  bleng = "0" + bleng;
			  }else{
				  break;
			  }
		  }
		  upXML = bleng + upXML;
		  logger.info("上传报文：" + upXML);
		  return upXML;
	  }
	  
	  
	  
	  /**
	   * 解析返回XML报文
	   * @param xmlDoc
	   * @return
	   */
	  public static HashMap<String,String> xmlStringReader(String xmlDoc){
		  HashMap<String,String> map = new HashMap<String,String>();  
		  StringReader read = new StringReader(xmlDoc);
		  InputSource source = new InputSource(read);
		  SAXBuilder saxBuilder = new SAXBuilder();
		  try{
			  org.jdom.Document doc = saxBuilder.build(source);
			  org.jdom.Element root = doc.getRootElement();
			  List<?> nodes = root.getChild("sys-header").getChild("data").getChild("struct").getChildren();
			  for(int i = 0; i < nodes.size(); i++){
				  org.jdom.Element element = (org.jdom.Element)nodes.get(i);
				  String name = element.getAttributeValue("name");
				  String value = element.getChildText("field"); 
				  if(name.equals("RET")){
					  List<?> node1s = element.getChild("array").getChild("struct").getChildren();
					  for(int j = 0; j < node1s.size(); j++){
						  org.jdom.Element element1 = (org.jdom.Element)node1s.get(j);
						  map.put(element1.getAttributeValue("name"), element1.getChildText("field"));					  
					  }
				  }else{
					  map.put(name, value);
				  }
			  }
		  }catch(Exception e){
			  e.printStackTrace();
		  }
		  return map;
	  }
 public static void main(String[] args) {
	 for (int i = 0; i < 3; i++) {
		 System.out.println(SendMessageTask.sendMobileMsg("1:2", "2", "3"));
	}
}
}
