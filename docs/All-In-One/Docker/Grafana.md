# 安装 Grafana

```bash
$ docker pull grafana/grafana
```


:✍️创建配置目录

```bash
$ mkdir -p /opt/grafana/{data,plugins,config}

$ chmod 777 /opt/grafana/data
$ chmod 777 /opt/grafana/plugins
$ chmod 777 /opt/grafana/config
```


:ideograph_advantage:获取grafana的原始配置

```bash
$ docker run --name grafana-tmp -d -p 3000:3000 grafana/grafana

$ docker cp grafana-tmp:/etc/grafana/grafana.ini /opt/grafana/config

$ docker rm -f grafana-tmp
```



:new:启动`grafana`

```bash
$ docker run -d \
-p 3000:3000 \
--name=grafana \
-v /etc/localtime:/etc/localtime:ro \
-v /opt/grafana/data:/var/lib/grafana \
-v /opt/grafana/plugins:/var/lib/grafana/plugins \
-v /opt/grafana/config/grafana.ini:/etc/grafana/grafana.ini \
-e "GF_SECURITY_ADMIN_PASSWORD=passwOrd!0#" \
grafana/grafana
```

:mag: 访问地址：http://xxx.xxx.xxx.xxx:3000/

:bust_in_silhouette: 用户名：admin

:secret: 密码：passwOrd!0#

