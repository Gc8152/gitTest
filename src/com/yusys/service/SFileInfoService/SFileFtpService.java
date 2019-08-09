package com.yusys.service.SFileInfoService;

import java.io.InputStream;
import java.io.OutputStream;
import java.util.Map;

import javax.annotation.Resource;

import org.apache.commons.net.ftp.FTPClient;
import org.apache.commons.net.ftp.FTPClientConfig;
import org.apache.commons.net.ftp.FTPFile;
import org.springframework.stereotype.Service;

import com.yusys.dao.SFilePathDao;

@Service
public class SFileFtpService implements ISFileFtpService{
	
	@Resource
	private SFilePathDao sFilePathDao;
	
	private static FTPClient client = null;
	
	private static Map<String, String> serverInfo = null;
	
	public SFileFtpService() {
		// TODO Auto-generated constructor stub
	}
	
	public boolean uploadFile(String filepath, InputStream in) throws Exception{
		int index = filepath.lastIndexOf("/");
		return uploadFile(filepath.substring(0, index), filepath.substring(index+1), in);
	}
	
	public boolean uploadFile(String path, String filename, InputStream in) throws Exception{
		boolean suss = false;
		//初始化文件路径；
		if(path!=null&&!"".equals(path)){
			initDir(path);
			/*try {
			} catch (IOException e) {
				e.printStackTrace();
				initClient();
				initDir(path);
			}*/
		} else {
			path = "";
		}
		client = getClient();
		if(in!=null){
			suss = client.storeFile(path+"/"+filename, in);
			//下面的方法会在上传同名文件是在其后加上时间戳已区分同名文件
			//suss = client.storeUniqueFile(path+"/"+filename, in);
			if(!suss){
				suss = client.storeFile(path+"/"+filename, in);
			}
			in.close();
			returnClient(client);
		}
		return suss;
	}
	
	public boolean downloadFile(String filepath, OutputStream out) throws Exception{
		int index = filepath.lastIndexOf("/");
		return downloadFile(filepath.substring(0, index), filepath.substring(index+1), out);
	}
	
	public boolean downloadFile(String dirPath, String filename, OutputStream out) throws Exception{
		client = getClient();
		boolean isExit = false;
		isExit = isFileExit(dirPath, filename, client);
		/*try {
		} catch (IOException e) {
			initClient();
			isExit = isFileExit(dirPath, filename, client);
		}*/
		if(isExit&&out!=null){
			client.retrieveFile(dirPath+"/"+filename, out);
			returnClient(client);
			return true;
		} else {
			returnClient(client);
			return false;
		}
	}
	
	//获取ftp文件，并以输入流的形式返回
	public InputStream getFileStream(String filepath) throws Exception{
		int index = filepath.lastIndexOf("/");
		return getFileStream(filepath.substring(0, index), filepath.substring(index+1));
	}
	
	//获取ftp文件，并以输入流的形式返回
	public InputStream getFileStream(String dirPath, String filename) throws Exception{
		client = getClient();
		InputStream in = null;
		//initClient();
		boolean isExit = false;
		isExit = isFileExit(dirPath, filename, client);
		/*try {
		} catch (IOException e) {
			e.printStackTrace();
			initClient();
			isExit = isFileExit(dirPath, filename);
		}*/
		if(isExit){
			in = client.retrieveFileStream(dirPath+"/"+filename);
			returnClient(client);
			return in;
		} else {
			returnClient(client);
			throw new Exception("获取文件输出流失败");
		}
	}
	
	//获取是否存在文件
	public boolean isFileExitInFtp(String filepath) throws Exception{
		int index = filepath.lastIndexOf("/");
		return isFileExitInFtp(filepath.substring(0, index), filepath.substring(index+1));
	}
	
	//获取是否存在文件
	public boolean isFileExitInFtp(String path, String fileName) throws Exception{
		/*if(client==null||!client.isAvailable()||!client.isConnected()){
			initClient();
		}*/
		client = getClient();
		boolean succ = isFileExit(path, fileName, client);
		returnClient(client);
		return succ;
	}
	
	//删除文件（文件夹）
	public boolean deleteFile(String filepath) throws Exception{
		int index = filepath.lastIndexOf("/");
		return deleteFile(filepath.substring(0, index), filepath.substring(index+1));
	}
	
	//删除文件（文件夹）
	public boolean deleteFile(String path, String filename) throws Exception{
		/*if(client==null||!client.isAvailable()||!client.isConnected()){
			initClient();
		}*/
		client = getClient();
		boolean isExit = false;
		isExit = isFileExit(path, filename, client);
/*		try {
		} catch (IOException e) {
			e.printStackTrace();
			initClient();
			isExit = isFileExit(path, filename);
		}*/
		if(isExit){
			boolean succ = client.deleteFile(path+"/"+filename);
			returnClient(client);
			return succ;
		}
		return isExit;
	}
	
	public boolean mvFile(String fromFilepath, String toFilepath) throws Exception{
		int fromIndex = fromFilepath.lastIndexOf("/");
		int endIndex = toFilepath.lastIndexOf("/");
		String fromPath = fromFilepath.substring(0, fromIndex);
		String fromFilename = fromFilepath.substring(fromIndex+1);
		String toPath = toFilepath.substring(0, endIndex);
		boolean result = false;
		client = getClient();
		//1检验来源文件是否存在	true?next：return false；
		if(isFileExit(fromPath, fromFilename, client)){
			//2检查目标文件夹是否存在	true？next：创建目标文件夹
			if(!isFileExit(toPath, "", client)){
				initDir(toPath, client);
			}
			//3移动文件
			returnClient(client);
			client = getClient();
			if(client.rename(fromFilepath, toFilepath)){
				FTPFile[] files = client.listFiles(fromPath);
				if(files!=null&&files.length>0){
					result = true;
				} else {
					//4删除源文件夹
					result = client.removeDirectory(fromPath);
				}
				
			}
		}
		returnClient(client);
		return result;
	}

	private void initDir(String path) throws Exception {
		client = getClient();
		String[] paths = path.split("/");
		if(paths.length>=2){
			for(int i=0; i<paths.length-1; i++){
				doInitDir(paths[0], paths[i+1], client);
			}
		}
		//返回根目录
		client.changeWorkingDirectory("/");
		returnClient(client);
	}
	
	private void initDir(String path, FTPClient client) throws Exception{
		String[] paths = path.split("/");
		if(paths.length>=2){
			for(int i=0; i<paths.length-1; i++){
				doInitDir(paths[0], paths[i+1], client);
			}
		}
		//返回根目录
		client.changeWorkingDirectory("/");
	}
	
	private void doInitDir(String parentDir, String dirname, FTPClient client) throws Exception{
		FTPFile[] dirList = client.listDirectories(parentDir);//查找指定目录下有多少个文件夹
		boolean isExit = false;
		for(FTPFile file : dirList){
			if(dirname.equals(file.getName())){//如果文件目录已存在则退出
				isExit = true;
				break;
			}
		}
		if(!isExit){//如果不存在文件路径
			client.makeDirectory(dirname);//创建文件夹
		}
		client.changeWorkingDirectory("".equals(dirname)?"/":dirname);
	}
	
	private boolean isFileExit(String dirPath, String filename, FTPClient client) throws Exception{
		boolean isExit = false;
		client.changeWorkingDirectory("/");
		FTPFile[] fileList = client.listFiles(dirPath);
		if(fileList.length!=0){
			for(FTPFile file : fileList){
				isExit = filename.equals(file.getName());
				if(isExit){
					break;
				}
			}
		}
		return isExit;
	}

	/*private void initClient() throws Exception{
		if(client==null){
			serverInfo = sFilePathDao.getServerInfo(null).get(0);
			client = new FTPClient();
			//设置编码
			client.setControlEncoding(System.getProperty("file.encoding"));
			client.connect(serverInfo.get("SERVERNAME"), Integer.parseInt(serverInfo.get("PORT")));
			client.login(serverInfo.get("USERNAME"), serverInfo.get("PASSWORD"));
			//设置文件传输方式
			client.setFileType(FTPClient.BINARY_FILE_TYPE);
		} else if(!client.isConnected()){
			client.connect(serverInfo.get("SERVERNAME"), Integer.parseInt(serverInfo.get("PORT")));
			client.setFileType(FTPClient.BINARY_FILE_TYPE);
		} else{
			client.disconnect();
			client = new FTPClient();
			client.setControlEncoding(System.getProperty("file.encoding"));
			client.connect(serverInfo.get("SERVERNAME"), Integer.parseInt(serverInfo.get("PORT")));
			client.login(serverInfo.get("USERNAME"), serverInfo.get("PASSWORD"));
			client.setFileType(FTPClient.BINARY_FILE_TYPE);
		}
	}*/
	
	private FTPClient getClient() throws Exception{
		if(serverInfo==null||serverInfo.isEmpty()){
			serverInfo = sFilePathDao.getServerInfo(null).get(0);
		}
		client = new FTPClient();
		//设置编码
		//client.setControlEncoding(System.getProperty("file.encoding"));
		client.setControlEncoding("UTF-8");
	/*	FTPClientConfig conf=new FTPClientConfig(FTPClientConfig.SYST_UNIX);
		conf.setServerLanguageCode("en");
		client.configure(conf);*/
		client.connect(serverInfo.get("SERVERNAME"), Integer.parseInt(serverInfo.get("PORT")));
		//client.connect("127.0.0.1", Integer.parseInt(serverInfo.get("PORT")));
		client.login(serverInfo.get("USERNAME"), serverInfo.get("PASSWORD"));
		//设置文件传输方式
		client.setFileType(FTPClient.BINARY_FILE_TYPE);
		return client;
	}
	
	private boolean returnClient(FTPClient client) throws Exception{
		client.logout();
		client.disconnect();
		return true;
	}
	
}
