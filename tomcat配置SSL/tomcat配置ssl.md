### tomcat配置ssl

#### 问题

1. 证书有几种格式？

   从这里看应该有DER、P7B、PFX、JKS、PEM这几种证书格式

   ![image-20201221180942053](/Users/dylan/Desktop/Develop/note/笔记/tomcat配置SSL/tomcat配置ssl.assets/image-20201221180942053.png)

   ![image-20201221154924009](/Users/dylan/Desktop/Develop/note/笔记/tomcat配置SSL/tomcat配置ssl.assets/image-20201221154924009-8591523.png)

2. tomcat支持哪种ssl证书格式？

​       tomcat支持JKS、PKCS11、和PKCS12格式的秘钥库。

![image-20201221121651597](/Users/dylan/Desktop/Develop/note/笔记/tomcat配置SSL/tomcat配置ssl.assets/image-20201221121651597.png)

3. 使用Nginx等反向代理工具进行反向代理后，ssl通讯发生在client->nginx还是nginx->tomcat,还是两段都有？

​       发生在client-nginx这一部分

![image-20201221121341887](/Users/dylan/Desktop/Develop/note/笔记/tomcat配置SSL/tomcat配置ssl.assets/image-20201221121341887.png)

4. acme.sh生成的ssl证书是哪种格式的？

   看上面的结构应该是属于PEM格式的

   ![image-20201221181154271](/Users/dylan/Desktop/Develop/note/笔记/tomcat配置SSL/tomcat配置ssl.assets/image-20201221181154271.png)

   cer后缀格式为证书

   ​	chain.cer证书链

   ​    ca.cer签发机构证书？

   ​    com.cer域名证书

   csr为申请证书请求

   key为秘钥

5. tomcat中能配置哪几种，能配置cer后缀的pem后缀的证书吗？

   tomcat文档中写的是支持 JKS、PKCS12 但是配置参数中又有pem相关说明。。

   ![image-20201221181657399](/Users/dylan/Desktop/Develop/note/笔记/tomcat配置SSL/tomcat配置ssl.assets/image-20201221181657399.png)

   而且也有网站有相关的配置（https://gakumon.tech/tomcat/server_xml/ssl.html）

   ![image-20201221181825978](/Users/dylan/Desktop/Develop/note/笔记/tomcat配置SSL/tomcat配置ssl.assets/image-20201221181825978.png)

6. 使用acme.sh转换证书格式到pfx

   ```shell
   acme.sh  --toPkcs  -d <domain>  [--password pfx-password]
   ```

7. 使用acme.sh刷新证书

   acme.sh安装后会自动安装一个定时任务进行刷新证书

   ```shell
   acme.sh --renew -d example.com --force
   ```

8. 设置示例：

   ```shell
   #更新证书
   acme.sh --renew -d fulull.com --force
   #将证书转为pfx格式
   acme.sh  --toPkcs  -d fulull.com --password tomcat
   ```

   

