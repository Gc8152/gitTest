package com.yusys.Utils;

import java.net.URL;
import java.util.List;
import java.util.Properties;
import java.util.concurrent.Callable;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

import javax.activation.DataHandler;
import javax.activation.FileDataSource;
import javax.mail.Address;
import javax.mail.BodyPart;
import javax.mail.Message;
import javax.mail.Multipart;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeBodyPart;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeMultipart;
import javax.mail.internet.MimeUtility;

import org.apache.log4j.Logger;
import org.codehaus.xfire.client.Client;


public class SendMail {
	
	private static final Logger logger = Logger.getLogger(SendMail.class);
	
	/**
	 * 线程池对象
	 */
	private final static  ExecutorService executorService;
	static{
		executorService=Executors.newCachedThreadPool();
	}
	
	private MimeMessage mimeMsg; // MIME邮件对象
	private Session session; // 邮件会话对象
	private Properties props; // 系统属性
	// smtp认证用户名和密码
	private String username;
	private String password;
	private Multipart mp; // Multipart对象,邮件内容,标题,附件等内容均添加到其中后再生成MimeMessage对象

	/**
	 * Constructor
	 * 
	 * @param smtp
	 *            邮件发送服务器
	 */
	public SendMail(String smtp) {
		setSmtpHost(smtp);
		createMimeMessage();
	}
	SendMail(){
		
	}
	/**
	 * 设置邮件发送服务器
	 * 
	 * @param hostName
	 *            String
	 */
	public void setSmtpHost(String hostName) {
		logger.info("设置系统属性：mail.smtp.host = " + hostName);
		if (props == null)
			props = System.getProperties(); // 获得系统属性对象
		
		if(hostName.equalsIgnoreCase("smtp.gmail.com")){//区分判断邮箱类型
			//Security.addProvider(new com.sun.net.ssl.internal.ssl.Provider());
    		final String SSL_FACTORY = "javax.net.ssl.SSLSocketFactory";
    		props.setProperty("mail.smtp.socketFactory.class", SSL_FACTORY);
    		props.setProperty("mail.smtp.socketFactory.fallback", "false");
    		props.setProperty("mail.smtp.port", "465");
    		props.setProperty("mail.smtp.socketFactory.port", "465");
    	}
		props.put("mail.smtp.host", hostName); // 设置SMTP主机
	}

	/**
	 * 创建MIME邮件对象
	 * 
	 * @return
	 */
	public boolean createMimeMessage() {
		try {
			logger.info("准备获取邮件会话对象！");
			session = Session.getDefaultInstance(props, null); // 获得邮件会话对象
		} catch (Exception e) {
			logger.info("获取邮件会话对象时发生错误！" + e);
			return false;
		}

		logger.info("准备创建MIME邮件对象！");
		try {
			mimeMsg = new MimeMessage(session); // 创建MIME邮件对象
			mp = new MimeMultipart();

			return true;
		} catch (Exception e) {
			logger.info("创建MIME邮件对象失败！" + e);
			return false;
		}
	}

	/**
	 * 设置SMTP是否需要验证
	 * 
	 * @param need
	 */
	public void setNeedAuth(boolean need) {
		logger.info("设置smtp身份认证：mail.smtp.auth = " + need);
		if (props == null)
			props = System.getProperties();
		if (need) {
			props.put("mail.smtp.auth", "true");
		} else {
			props.put("mail.smtp.auth", "false");
		}
	}

	/**
	 * 设置用户名和密码
	 * 
	 * @param name
	 * @param pass
	 */
	public void setNamePass(String name, String pass) {
		username = name;
		password = pass;
	}

	/**
	 * 设置邮件主题
	 * 
	 * @param mailSubject
	 * @return
	 */
	public boolean setSubject(String mailSubject) {
		logger.info("设置邮件主题！");
		try {
			mimeMsg.setSubject(mailSubject);
			return true;
		} catch (Exception e) {
			logger.info("设置邮件主题发生错误！");
			return false;
		}
	}

	/**
	 * 设置邮件正文
	 * 
	 * @param mailBody
	 *            String
	 */
	public boolean setBody(String mailBody) {
		try {
			BodyPart bp = new MimeBodyPart();
			bp.setContent("" + mailBody, "text/html;charset=UTF-8");
			mp.addBodyPart(bp);

			return true;
		} catch (Exception e) {
			logger.info("设置邮件正文时发生错误！" + e);
			return false;
		}
	}

	/**
	 * 添加附件
	 * 
	 * @param filename
	 *            String
	 */
	public boolean addFileAffix(List<String> filenames) {
		logger.info("增加邮件附件：" + filenames);
		try {
			if(null != filenames && filenames.size() > 0){
				for (int i = 0; i < filenames.size(); i++) {
					BodyPart bp = new MimeBodyPart();
					FileDataSource fileds = new FileDataSource(filenames.get(i));
					bp.setDataHandler(new DataHandler(fileds));
					bp.setFileName(MimeUtility.encodeText(fileds.getName()));
					mp.addBodyPart(bp);
					
				}
			}
			return true;
		} catch (Exception e) {
			logger.info("增加邮件附件：" + filenames + "发生错误！" + e);
			return false;
		}
	}

	/**
	 * 设置发信人
	 * 
	 * @param from
	 *            String
	 */
	public boolean setFrom(String from) {
		logger.info("设置发信人！");
		try {
			mimeMsg.setFrom(new InternetAddress(from)); // 设置发信人
			return true;
		} catch (Exception e) {
			return false;
		}
	}

	/**
	 * 设置收信人 多个收信人 用逗号隔开
	 * 
	 * @param to
	 *            String
	 */
	public boolean setTo(String to) {
		if (to == null)
			return false;
		try {
			mimeMsg.setRecipients(Message.RecipientType.TO,
					InternetAddress.parse(to));
			return true;
		} catch (Exception e) {
			return false;
		}
	}

	/**
	 * 设置抄送人 多个抄送人 用逗号隔开
	 * 
	 * @param copyto
	 *            String
	 */
	public boolean setCopyTo(String copyto) {
		if (copyto == null)
			return false;
		try {
			mimeMsg.setRecipients(Message.RecipientType.CC,
					(Address[]) InternetAddress.parse(copyto));
			return true;
		} catch (Exception e) {
			return false;
		}
	}

	/**
	 * 发送邮件
	 */
	public boolean sendOut() {
		try {
			mimeMsg.setContent(mp);
			mimeMsg.saveChanges();
			logger.info("正在发送邮件....");

			Session mailSession = Session.getInstance(props, null);
			Transport transport = mailSession.getTransport("smtp");
			transport.connect((String) props.get("mail.smtp.host"), username,
					password);

			transport.sendMessage(mimeMsg,
					mimeMsg.getRecipients(Message.RecipientType.TO));

			// 抄送对象不为空
			if (null != mimeMsg.getRecipients(Message.RecipientType.CC)) {
				transport.sendMessage(mimeMsg,
						mimeMsg.getRecipients(Message.RecipientType.CC));
			}

			logger.info("发送邮件成功！");
			transport.close();

			return true;
		} catch (Exception e) {
			e.printStackTrace();
			logger.info("邮件发送失败！" + e);
			return false;
		}
	}

	/**
	 * 调用sendOut方法完成邮件发送,带附件和抄送
	 * 
	 * @param smtp 		目标服务器地址 可以是域名 也可以是ip 如:220.181.12.11 smtp.163.com
	 * @param from 		发送人的邮箱地址  如: test@163.com
	 * @param to   		收件人的邮箱地址  如： test2@163.com 多个收件人用英文逗号隔开
	 * @param copyto	抄送人的邮箱地址  如: test2@163.com 多个抄送人用英文逗号隔开
	 * @param subject	邮件主题
	 * @param content	邮件内容
	 * @param username 	发送人的邮箱前缀  如:test
	 * @param password	发送人的邮箱密码 
	 * @param filenames	附件集合
	 * @return
	 */
	public static boolean sendAndCc(final String smtp, final String from,  final String to,
			 final String copyto, final  String subject,  final String content, final  String username,
			 final String password,  final List<String> filenames) {
		Future<String> future=executorService.submit(new Callable<String>() {//将要发送的邮件 放入线程池 异步发送
			@Override
			public String call() throws Exception {
				SendMail theMail = new SendMail(smtp);
				theMail.setNeedAuth(true);
				theMail.setBody(content);
				theMail.setCopyTo(copyto);
				theMail.setSubject(subject);
				theMail.setFrom(from);
				theMail.setNamePass(username, password);
				theMail.setSmtpHost(smtp);
				theMail.setTo(to);
				theMail.addFileAffix(filenames);
				boolean issuccess=theMail.sendOut();
				if (!issuccess) {
					logger.info("邮件发送失败接收人:"+to+",邮件标题:"+subject);
					return issuccess+"";
				}
				return null;
			}
		});
		try {
			if (future.get()==null) {//get()等于空代表操作成功
				return true;
			}
		} catch (InterruptedException e) {
			e.printStackTrace();
		} catch (ExecutionException e) {
			e.printStackTrace();
		}
		
		return false;
	}
	
	/**
	 * 无附件的邮件发送
	 * 
	 * @return
	 */
	public static boolean sendNofile(String smtp, String from, String to,String copyto,
			String subject, String content, String username,
			String password) {
		return sendAndCc(smtp, from, to, copyto, subject, content, username,
				password, null);
	}
	
	/**
	 * 无抄送人的邮件发送
	 * 
	 * @return
	 */
	public static boolean sendNoCopy(String smtp, String from, String to,
			String subject, String content, String username,
			String password, List<String> filenames) {
		return sendAndCc(smtp, from, to, null, subject, content, username,
				password, filenames);
	}
	
	/**
	 * 无抄送人和附件的邮件发送
	 * 
	 * @return
	 */
	public static boolean sendNoCopyAndFile(String smtp, String from, String to,
			String subject, String content, String username,
			String password) {
		return sendAndCc(smtp, from, to, null, subject, content, username,
				password,null);
	}
	/**
	 * 发送OA内部邮件
	 * @param wsdl_address webservices地址
	 * @param send_account
	 *            发送账号
	 * @param receiver_accounts
	 *            接收账号
	 * @param mailsubject
	 *            标题
	 * @param mailcontent
	 *            内容
	 */
	//sendMail("http://10.1.14.220:7001/defaultroot/xfservices/GeneralWeb?wsdl","任务管理系统","sys,lilin1 ","标题","内容xxx");
	public static boolean sendMail(String wsdl_address,String send_account, String receiver_accounts,
			String mailsubject, String mailcontent) {
		StringBuilder sb = new StringBuilder();
		sb.append("<input>");
		sb.append("<key>DFFD512F3C274EC11AF53753FC82B483</key>");
		sb.append("<cmd>sendSysMail</cmd>");
		sb.append("<domain>0</domain>");
		sb.append("<receiverAccounts>");sb.append(receiver_accounts);sb.append("</receiverAccounts>");
		sb.append("<posterName>");sb.append(send_account);sb.append("</posterName>");
		sb.append("<mailsubject>");sb.append(mailsubject);sb.append("</mailsubject>");
		sb.append("<mailcontent><![CDATA[");sb.append(mailcontent);sb.append("]]></mailcontent>");
		sb.append("</input>");
		try {
			Client client = new Client(new URL(wsdl_address));
			
			Object[] results = client.invoke("OAManager",
					new Object[] { sb.toString() });
			if (results!=null&&results[0]!=null) {
				String result=String.valueOf(results[0]);
				if (result.indexOf("<result>1</result>")!=-1) {
					return true;
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return false;
	}
	public static void main(String[] args) {
		SendMail sendMail = new SendMail("smtp.163.com");
		System.out.println(sendMail.sendAndCc("smtp.163.com", "xxxx@163.com", "sssss@163.com", null, "subject", "content", "xxxx", "password",null));
	}
}
