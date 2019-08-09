package com.yusys.Utils;

import java.io.IOException;
import java.nio.charset.Charset;
import java.security.SecureRandom;

import javax.crypto.Cipher;
import javax.crypto.SecretKey;
import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.DESKeySpec;

import sun.misc.BASE64Decoder;
import sun.misc.BASE64Encoder;

/**
 * DES加解密算法
 * @author Administrator
 *
 */
public class DES {
	
	private final static String DES = "DES";
	
	public final static String LOGIN_ENKEY="yu@Xin&007";//YX_SID加密key
	
	public final static String LOGIN_DEKEY="YX@login";//登陆解密key
	
	/**
	 * 
	 * Description 根据键值进行加密
	 * 
	 * @param data
	 * 
	 * @param key
	 * 
	 * @return
	 * 
	 * @throws Exception
	 */
	public static String encrypt(String data, String key) throws Exception {
//		byte[] bt = encrypt(data.getBytes(), key.getBytes());
//		String strs = new BASE64Encoder().encode(bt);
//		return strs;

        byte[] bt = encrypt(data.getBytes(Charset.forName("utf-8")), key.getBytes());
        String strs = new BASE64Encoder().encode(bt);
		return strs;
	}

	/**
	 * 
	 * Description 根据键值进行解密
	 * 
	 * @param data
	 * 
	 * @param key
	 * 
	 * @return
	 * 
	 * @throws IOException
	 * 
	 * @throws Exception
	 */
	public static String decrypt(String data, String key) throws IOException,Exception {
		if (data == null){
			return null;
		}
		BASE64Decoder decoder = new BASE64Decoder();
		byte[] buf = decoder.decodeBuffer(data);
		byte[] bt = decrypt(buf, key.getBytes());
		return new String(bt, Charset.forName("utf-8"));
	}

	/**
	 * 
	 * Description 加密
	 * 
	 * @param data
	 * 
	 * @param key
	 * 
	 * @return
	 * 
	 * @throws Exception
	 */
	private static byte[] encrypt(byte[] data, byte[] key) throws Exception {

		// 生成一个可信任的随机数源
		SecureRandom sr = new SecureRandom();
		// 从原始密钥数据创建DESKeySpec对象
		DESKeySpec dks = new DESKeySpec(key);
		// 创建一个密钥工厂，然后用它把DESKeySpec转换成SecretKey对象
		SecretKeyFactory keyFactory = SecretKeyFactory.getInstance(DES);
		SecretKey securekey = keyFactory.generateSecret(dks);
		// Cipher对象实际完成加密操作
		Cipher cipher = Cipher.getInstance(DES);
		// 用密钥初始化Cipher对象
		cipher.init(Cipher.ENCRYPT_MODE, securekey, sr);
		return cipher.doFinal(data);
	}

	/**
	 * 
	 * Description 解密
	 * 
	 * @param data
	 * 
	 * @param key
	 * 加密键byte数组
	 * 
	 * @return
	 * 
	 * @throws Exception
	 */

	private static byte[] decrypt(byte[] data, byte[] key) throws Exception {

		// 生成一个可信任的随机数源
		SecureRandom sr = new SecureRandom();
		// 从原始密钥数据创建DESKeySpec对象
		DESKeySpec dks = new DESKeySpec(key);
		// 创建一个密钥工厂，然后用它把DESKeySpec转换成SecretKey对象
		SecretKeyFactory keyFactory = SecretKeyFactory.getInstance(DES);
		SecretKey securekey = keyFactory.generateSecret(dks);
		// Cipher对象实际完成解密操作
		Cipher cipher = Cipher.getInstance(DES);
		// 用密钥初始化Cipher对象
		cipher.init(Cipher.DECRYPT_MODE, securekey, sr);
		return cipher.doFinal(data);
	}
}
