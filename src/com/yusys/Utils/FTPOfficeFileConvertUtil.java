package com.yusys.Utils;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import org.apache.log4j.Logger;

import com.artofsolving.jodconverter.DocumentConverter;
import com.artofsolving.jodconverter.openoffice.connection.OpenOfficeConnection;
import com.artofsolving.jodconverter.openoffice.connection.SocketOpenOfficeConnection;
import com.artofsolving.jodconverter.openoffice.converter.OpenOfficeDocumentConverter;
import com.yusys.dao.SFileInfoDao;

/**
 * office 文件转换
 * 
 * @author tanbo 
 * create time 2016-05-22
 * 
 */
public class FTPOfficeFileConvertUtil{
	private static final Logger logger = Logger.getLogger(FTPOfficeFileConvertUtil.class);

	private static SFileInfoDao fileInfoDao;
	
	/**
	 * 线程池对象
	 */
	private static final ExecutorService executorService;
	/**
	 * 系统类型
	 */
	private static int environment=2;
	
	/**
	 *  可转换并预览的文件
	 */
	private static Map<String, String> ableFile=new HashMap<String, String>();
	static{
		ableFile.put(".doc", "doc");
		ableFile.put(".docx", "docx");
		ableFile.put(".xlsx", "xlsx");
		ableFile.put(".xls", "xls");
		ableFile.put(".ppt", "ppt");
		ableFile.put(".pptx", "pptx");
		ableFile.put(".txt", "txt");
		ableFile.put(".pdf", "pdf");
		executorService=Executors.newCachedThreadPool();
		if(System.getProperty("os.name").toUpperCase().indexOf("WINDOWS")!=-1){
			 environment=1;
		}
	}
	
	/**
	 * 给附件生成预览文件
	 * @param {path='路径',filename='无后缀的名称',fext='后缀'}
	 */
	public synchronized static void buildFilePreView(String path,String filename,String fext,SFileInfoDao fileInfo){
		if (fext!=null&&ableFile.containsKey(fext)&&path!=null&&filename!=null) {
			Map<String, String> map=new HashMap<String, String>();
			map.put("path", path);
			map.put("filename", filename);
			map.put("fext", fext.toLowerCase());
			fileConvertByMoreThread(map);
			fileInfoDao=fileInfo;
		}
	}

	/**
	 * 执行文件转换
	 * @throws Exception 
	 */
	private final static void runFileConvert(Map<String,String> map) throws Exception{
		File office= new File(map.get("path")+"/"+map.get("filename")+map.get("fext"));		
		File pdf=new File(map.get("path")+(map.get("fext").equals(".pdf")?"/":"/pdf/")+map.get("filename")+".pdf");
		File pdfDir=new File(map.get("path")+"/pdf");
		if (!pdfDir.isDirectory()) {
			pdfDir.mkdirs();
		}
		if(!map.get("fext").equals(".pdf")){//如果文件后缀不是pdf,则转成pdf
			try {
				logger.info("####################office转pdf");
				office2pdf(office, pdf);
			} catch (Exception e) {
				e.printStackTrace();
				throw e;
			}
		}
		
		File swfDir=new File(map.get("path")+"/swf");
		if (!swfDir.isDirectory()) {
			swfDir.mkdirs();
		}
		//pdf转swf文件
		File swf=new File(map.get("path")+"/swf/"+map.get("filename")+".swf");
		try {
			logger.info("####################pdf转swf");
			pdf2swf(pdf, swf);
			fileInfoDao.setFileIsView(map.get("filename"));
		} catch (Exception e) {
			e.printStackTrace();
			throw e;
		}
	}
	
	/**
	 * 多线程执行文件转换
	 */
	private static void fileConvertByMoreThread(final Map<String, String> map){
		executorService.execute(new Runnable() {
			@Override
			public void run() {
				try {
					runFileConvert(map);
				} catch (Exception e) {
				}
			}
		});
	}

	/**
	 * pdf转swf
	 * 
	 * @param pdfFile
	 * @throws Exception
	 */
	private static void pdf2swf(File pdfFile, File swfFile) throws Exception {
		Runtime r = Runtime.getRuntime();
		if (pdfFile.exists()) {
			if(environment==1){//windows环境
				try {//设置好环境变量 直接用pdf2swf.exe文件执行指令 否则  用E:/Program Files (x86)/SWFTools/pdf2swf.exe 
					Process p = r.exec("pdf2swf.exe "+ pdfFile.getPath() + " -o "+ swfFile.getPath() + " -T 9");
	
					//干掉指令执行之后返回的缓冲区
					loadStream(p.getInputStream());
					loadStream(p.getErrorStream());
					loadStream(p.getInputStream());
					logger.info("****swf转换成功，文件输出：" + swfFile.getPath() + "****");
					p.destroy();
				} catch (IOException e) {
					e.printStackTrace();
					throw e;
				}
			}else if(environment==2){// linux环境处理
				try {
					Process p = r.exec("pdf2swf " + pdfFile.getPath()
							+ " -o " + swfFile.getPath() + " -T 9");
					//干掉指令执行之后返回的缓冲区
					loadStream(p.getInputStream());
					loadStream(p.getErrorStream());
					logger.info("****swf转换成功，文件输出："+ swfFile.getPath() + "****");
				} catch (Exception e) {
					e.printStackTrace();
					throw e;
				}
			}
		}
	}
	
	/**
	 * office文件 转为PDF 目前支持 word、excel、ppt、txt等文件
	 * 
	 * @param file
	 * soffice -headless -accept="socket,host=127.0.0.1,port=8110;urp;" -nofirststartwizard
	 */
	private static void office2pdf(File officeFile, File pdfFile) throws Exception {
		if (officeFile.exists()) {
			if (!pdfFile.exists()) {
				OpenOfficeConnection connection = new SocketOpenOfficeConnection(8110);
				try {
					connection.connect();
					DocumentConverter converter = new OpenOfficeDocumentConverter(
							connection);
					converter.convert(officeFile, pdfFile);
					connection.disconnect();
					logger.info("-=-=-=-=:"+connection.isConnected());
					logger.info("****pdf转换成功，PDF输出：" + pdfFile.getPath()
							+ "****");
				} catch (java.net.ConnectException e) {
					e.printStackTrace();
					logger.info("****pdf转换器异常，openoffice服务未启动！****");
					throw e;
				}catch (Exception e) {
					e.printStackTrace();
					throw e;
				}
			} else {
				logger.info("****已经转换为pdf，不需要再进行转化****");
			}
		}
	}
	/**
	 * 读取缓冲区
	 * @param in
	 * @return
	 * @throws IOException
	 */
	private static String loadStream(InputStream in) throws IOException {
		int ptr = 0;
		in = new BufferedInputStream(in);
		StringBuffer buffer = new StringBuffer();

		while ((ptr = in.read()) != -1) {
			buffer.append((char) ptr);
		}

		return buffer.toString();
	}
	public static void main(String[] args) {
		try {
			File office= new File("D:/upload/office_doc_.doc");
			File pdfDir=new File("D:/upload/pdf");
			if (!pdfDir.isDirectory()) {
				pdfDir.mkdirs();
			}
			
			File swfDir=new File("D:/upload/swf");
			if (!swfDir.isDirectory()) {
				swfDir.mkdirs();
			}
			
			File pdf=new File("D:/upload/pdf/office_doc_.pdf");
			File swf=new File("D:/upload/swf/office_doc_.swf");
			office2pdf(office, pdf);
			pdf2swf(pdf, swf);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}