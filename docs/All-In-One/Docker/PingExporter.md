
###### 安装ping_exporter

参考[github](https://github.com/czerwonk/ping_exporter)

参考[grafana-dashboards](https://grafana.com/grafana/dashboards/19761-pingexporter/)

配置文件`vim /opt/ping_exporter/config/config.yml`

```bash
targets:
  - 10.1.1.254
  - 192.168.16.1

dns:
  refresh: 2m15s
  nameserver: 1.1.1.1

ping:
  interval: 2s
  timeout: 3s
  history-size: 42
  payload-size: 120

options:
  disableIPv6: false
```

运行docker

```bash
$ docker run -itd -p 9427:9427 \
-v /opt/ping_exporter/config/:/config:ro \
--restart=always \
--name ping_exporter \
czerwonk/ping_exporter
```


✍️配置采集，在`promecheus`中加入如下配置，`vi /opt/prometheus/config/prometheus.yml`

```yaml
- job_name: "ping_exporter"
    static_configs:
    - targets: ["xxx.xxx.xxx.xxx:9427"]
```

:warning:刷新配置：curl -X POST http://xxx.xxx.xxx.xxx:9090/-/reload



:id: 配置报表，在`grafana`中`http://xxx.xxx.xxx.xxx:3000`开启Dashboard ID`19761`



✍️配置告警邮件通知，`vim /opt/prometheus/rules/ping_exporter_alerts.rules`

```yaml
groups:
- name: ping_exporter_alerts
  rules:
  # 高最佳RTT告警
  - alert: 高最佳RTT
    expr: ping_rtt_best_seconds > 0.05 # 如果最佳RTT超过50ms则触发告警
    for: 5m
    labels:
      severity: "警告"
    annotations:
      summary: "检测到高最佳往返时间"
      description: "最佳往返时间超过了50毫秒并持续了5分钟以上。"

  # 高最差RTT告警
  - alert: 高最差RTT
    expr: ping_rtt_worst_seconds > 0.3 # 如果最差RTT超过300ms则触发告警
    for: 5m
    labels:
      severity: "严重"
    annotations:
      summary: "检测到高最差往返时间"
      description: "最差往返时间超过了300毫秒并持续了5分钟以上。"

  # 高平均RTT告警
  - alert: 高平均RTT
    expr: ping_rtt_mean_seconds > 0.1 # 如果平均RTT超过100ms则触发告警
    for: 5m
    labels:
      severity: "警告"
    annotations:
      summary: "检测到高平均往返时间"
      description: "平均往返时间超过了100毫秒并持续了5分钟以上。"

  # 高标准偏差RTT告警
  - alert: 高标准偏差RTT
    expr: ping_rtt_std_deviation_seconds > 0.05 # 如果RTT标准偏差超过50ms则触发告警
    for: 5m
    labels:
      severity: "警告"
    annotations:
      summary: "检测到高标准偏差往返时间"
      description: "往返时间的标准偏差超过了50毫秒并持续了5分钟以上。"

  # 高丢包率告警
  - alert: 高丢包率
    expr: ping_loss_ratio > 0.1 # 如果丢包率超过10%则触发告警
    for: 5m
    labels:
      severity: "严重"
    annotations:
      summary: "检测到高丢包率"
      description: "丢包率超过了10%并持续了5分钟以上。"
```

刷新配置：curl -X POST http://xxx.xxx.xxx.xxx:9093/-/reload

刷新配置：curl -X POST http://xxx.xxx.xxx.xxx:9090/-/reload