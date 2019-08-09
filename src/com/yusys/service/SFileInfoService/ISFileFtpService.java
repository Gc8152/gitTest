package com.yusys.service.SFileInfoService;

import java.io.InputStream;
import java.io.OutputStream;

public interface ISFileFtpService {
	

	boolean uploadFile(String path, String filename, InputStream in)
			throws Exception;

	boolean uploadFile(String path, InputStream in) throws Exception;
	
	boolean isFileExitInFtp(String filepath) throws Exception;
	
	boolean isFileExitInFtp(String path, String filename) throws Exception;

	boolean downloadFile(String path, OutputStream out) throws Exception;

	boolean downloadFile(String dirPath, String filename, OutputStream out)
			throws Exception;

	boolean deleteFile(String filepath) throws Exception;

	boolean deleteFile(String path, String filename) throws Exception;

	InputStream getFileStream(String filepath) throws Exception;

	InputStream getFileStream(String dirPath, String filename)
			throws Exception;

	boolean mvFile(String fromPath, String toPath) throws Exception;
}
