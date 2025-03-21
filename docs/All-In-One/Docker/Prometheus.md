
# 安装 Prometheus

```bash
$ docker pull prom/prometheus
```



✍️在服务端创建存储目录

```bash
$ mkdir -p /opt/prometheus/{data,config,rules}
```



✍️编辑配置文件，`vi /opt/prometheus/config/prometheus.yml`

```yaml
# 全局配置
global:
	# 数据采集间隔
	scrape_interval: 45s
	# 告警检测间隔
	evaluation_interval: 45s

# 告警规则
rule_files:
 # 这里匹配指定目录下所有的.rules文件
 - /prometheus/rules/*.rules
 
# 采集配置
scrape_configs:
	# 采集项（prometheus）
  - job_name: 'prometheus'
    static_configs:
     - targets: ['xxx.xxx.xxx.xxx:9090']
```

> [!NOTE]
>
> `targets`如果写localhost，在UI界面则不能跳装



:new:启动`prometheus`

```bash
$ docker rm -f prometheus

$ docker run -d \
--name prometheus \
-p 9090:9090 \
-v /etc/localtime:/etc/localtime:ro \
-v /opt/prometheus/data:/prometheus/data \
-v /opt/prometheus/config:/prometheus/config \
-v /opt/prometheus/rules:/prometheus/rules \
prom/prometheus --web.enable-lifecycle --config.file=/prometheus/config/prometheus.yml

$ docker logs -f prometheus
```

:mag: 访问地址：http://xxx.xxx.xxx.xxx:9090



> [!CAUTION]
>
> 检查规则是否合法，进入的容器内部执行：`promtool check rules /prometheus/rules/os.rules`
>
> 刷新配置：`curl -X POST http://xxx.xxx.xxx.xxx:9090/-/reload`
