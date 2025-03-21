# 搭建Windows激活服务器

```bash
#$ docker run -itd \
#--name py-kms \
#--restart always \
#-p 1688:1688 \
#-v /etc/localtime:/etc/localtime:ro \
#ghcr.io/py-kms-organization/py-kms

$ docker run -itd \
--name py-kms \
--restart always \
-p 1688:1688 \
-v /etc/localtime:/etc/localtime:ro \
pykmsorg/py-kms:latest
```

在客户端激活Windows使用，管理员下执行

```bash
# slmgr：指的是“Software License Management”，是 Windows 内置的一个工具，用于管理软件许可证。

# /upk：这是 slmgr 命令的一个参数，代表“Uninstall Product Key”。使用该命令后，会将当前系统中激活Windows的密钥移除，但不会改变Windows的激活状态直到下一次重启或者重新输入密钥。
$ slmgr /upk

# /ipk：这是 slmgr 命令的一个参数，代表“Install Product Key”。这个参数后面需要跟随一个有效的 Windows 产品密钥。
$ slmgr /ipk W269N-WFGWX-YVC9B-4J6C9-T83GX

# KMS 的全称是 Key Management Service（密钥管理服务）。这是微软提供的一种用于企业环境中批量激活 Windows 和 Office 等产品的服务机制。
$ slmgr /skms 192.168.88.x:1688

# /ato：这是 slmgr 的一个参数，代表“Activate”操作，即激活系统。它会根据当前配置的产品密钥或 KMS 服务器信息来尝试激活 Windows。
$ slmgr /ato
```

在客户端激活Office使用，[参考](https://blog9go.com/learning/article/590)，[官方的许可证](https://py-kms.readthedocs.io/en/latest/Keys.html#office)，管理员下执行

```bash
# 进入到安装目录下
$ cd "C:\Program Files (x86)\Microsoft Office\Office16"

#先查询下激活状态，如果激活了就不用折腾了,重点看LICENSE STATUS栏，如果是 ---OOB_GRACE--- 就是没有激活；如果是 ---LICENSED--- 就意味着已经激活了。
$ CSCRIPT OSPP.VBS /DSTATUS

# 使用以下命令修改KMS服务器，不要漏了cscript：
$ CSCRIPT OSPP.VBS /sethst:192.168.88.x
$ CSCRIPT OSPP.VBS /setprt:1688

# 执行Office 2019 零售到批量许可证转换器
$ 执行Office 2019 零售到批量许可证转换器.bat

$ cscript OSPP.VBS /inpkey:NMMKJ-6RK4F-KMJVX-8D9MJ-6MWKP

# 激活
$ cscript ospp.vbs /act
```

