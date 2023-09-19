# ssl证书

## 1. 证书基本信息

1. 证书有几种格式？

   从这里看应该有DER、P7B、PFX、JKS、PEM这几种证书格式

   ![image-20201221180942053](https://s2.loli.net/2023/07/10/C5KQy63oINtfJlk.png)

   ![image-20201221154924009-8591523](https://s2.loli.net/2023/07/10/AaF5Rz6lHQGni2r.png)

2. tomcat支持哪种ssl证书格式？

​       tomcat支持JKS、PKCS11、和PKCS12格式的秘钥库。

![image-20201221121651597](https://s2.loli.net/2023/07/10/7AfsxTtG8I4yc9N.png)

3. 使用Nginx等反向代理工具进行反向代理后，ssl通讯发生在client->nginx还是nginx->tomcat,还是两段都有？

​       发生在client-nginx这一部分

<img src="https://s2.loli.net/2023/07/10/QEfV9puPOAHjgJr.png" alt="image-20201221121341887" style="zoom:150%;" />

4. acme.sh生成的ssl证书是哪种格式的？

   看上面的结构应该是属于PEM格式的

   ![image-20201221181154271](https://s2.loli.net/2023/07/10/dR9fscVbw8xKjGo.png)

   cer后缀格式为证书

   ​	chain.cer证书链

   ​    ca.cer签发机构证书？

   ​    com.cer域名证书

   csr为申请证书请求

   key为秘钥

5. tomcat中能配置哪几种，能配置cer后缀的pem后缀的证书吗？

   tomcat文档中写的是支持 JKS、PKCS12 但是配置参数中又有pem相关说明。。

   ![image-20201221181657399](https://s2.loli.net/2023/07/10/E57CePFxA8ONmyK.png)

   而且也有网站有相关的配置（https://gakumon.tech/tomcat/server_xml/ssl.html）

   ![image-20201221181825978](https://s2.loli.net/2023/07/10/TgPvS2j3srdkEKR.png)

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


## 2. acme.sh工具使用

1. 安装acme.sh

   * 下载安装包 https://github.com/acmesh-official/acme.sh/releases
   * 解压文件 ``` /opt/acme.sh-3.0.6```
   * 执行安装命令（替换邮箱地址）```./acme.sh --install -m my@example.com```

2. 设置域名访问key和secret （以阿里云dns 为例 阿里云获取key secret [地址](https://ak-console.aliyun.com/#/accesskey) （其他域名提供商 看 dnsapi [文档](https://github.com/acmesh-official/acme.sh/wiki/dnsapi)））

   ```bash
   #替换阿里云密钥
   export Ali_Key="key"
   export Ali_Secret="secret"
   ```

3. 生成证书

   ```bash
   #将example.com换成自己的域名
   acme.sh --issue --dns dns_ali -d example.com -d *.example.com
   
   #上面命令遇到问题时使用
   #Checking tiptip.cc for _acme-challenge.tiptip.cc
   #Not valid yet, let's wait 10 seconds and check next one.
   acme.sh --issue --dns dns_ali -d tiptip.cc -d *.tiptip.cc --dnssleep 300
   ```

4. 生成的证书文件放在： ~/acme.sh/domain/ 下

   ![image-20230710112536623](C:/Users/Administrator/AppData/Roaming/Typora/typora-user-images/image-20230710112536623.png)

## 3. 服务器使用SSL证书

1. nginx使用ssl证书

   ```
   acme.sh --install-cert -d example.com \
   --key-file       /opt/cert/sxzxrs/keyfile/in/nginx/key.pem  \
   --fullchain-file /opt/cert/sxzxrs/fullchain/nginx/cert.pem \
   --reloadcmd     "service nginx force-reload"
   ```

2. 
