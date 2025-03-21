# 搭建代理cash

```bash
# 创建文件夹
$ mkdir -p /opt/clash/
$ scp zhoushuren.yaml root@xxx.xxx.xxx.xxx:/opt/clash/

# 修改配置，vim /opt/clash/zhoushuren.yaml
rules:
	- 'DOMAIN-SUFFIX,gov.hk,DIRECT'
    - 'DOMAIN-SUFFIX,youtube.com,REJECT'
    - 'DOMAIN-SUFFIX,x.com,REJECT'
    - 'DOMAIN-SUFFIX,facebook.com,REJECT'

# docker rm -f clash
$ docker run -itd \
--name clash \
-p 7890:7890 \
-p 7891:7891 \
-p 9190:9090 \
-v /opt/clash/zhoushuren.yaml:/root/.config/clash/config.yaml \
dreamacro/clash

$ docker run -itd \
--name clash \
-p 7890:7890 \
-p 7891:7891 \
-p 9190:9090 \
-v /opt/clash/WgetCloud.yaml:/root/.config/clash/config.yaml \
dreamacro/clash

$ docker update --restart=always clash

$ docker run -itd --restart=always -p 9080:80 haishanh/yacd
```

