# 安装 alertmanager

```bash
$ docker pull prom/alertmanager
```



✍️创建存储和目录配置

```bash
$ mkdir -p /opt/alertmanager/{config,template}
```



✍️配置文件，`vim /opt/alertmanager/config/alertmanager.yml`

```yaml
# 全局配置
global:
  resolve_timeout: 5m
  # 发件人
  smtp_from: 'cheng.fu@91vst.com'
  # 邮箱服务器的 POP3/SMTP 主机配置 smtp.qq.com 端口为 465 或 587
  smtp_smarthost: 'smtp.exmail.qq.com:465'
  # 用户名
  smtp_auth_username: 'cheng.fu@91vst.com'
  # 授权码 或 密码
  smtp_auth_password: 'vafCxJCCbQTwRCps'
  smtp_require_tls: false
  smtp_hello: 'qq.com'
templates:
  # 指定预警内容模板
  - '/etc/alertmanager/template/alert-email.tmpl'
route:
  # 指定通过什么字段进行告警分组(如：alertname=A和alertname=B的将会被分导两个组里面)
  group_by: ['alertname']
  # 在组内等待所配置的时间，如果同组内，5 秒内出现相同报警，在一个组内出现
  group_wait: 30s
  # 如果组内内容不变化，合并为一条警报信息，5 分钟后发送
  group_interval: 5m
  # 发送告警间隔时间 s/m/h，如果指定时间内没有修复，则重新发送告警
  repeat_interval: 3h
  # 发送警报的接收者的名称，以下receivers name的名称
  receiver: 'toemail'
     
receivers:
- name: 'toemail'
  email_configs:
  - to: 'allen2fuc@gmail.com'
    send_resolved: true
    # 接收邮件的标题
    headers: {Subject: "alertmanager报警邮件"}
```



✍️准备报警模版，`vim /opt/alertmanager/template/alert-email.tmpl`

```html
{{ define "email.subject" }}【{{ .Status | toUpper }}】告警通知：{{ .CommonLabels.alertname }} 在 {{ .CommonLabels.instance }}{{ end }}

{{ define "email.html" }}
<html>
  <head>
    <meta charset="UTF-8">
    <style>
      body { font-family: Arial, 'Microsoft YaHei', sans-serif; }
      h1 { color: #2E8B57; }
      .alert-status-warning { color: orange; }
      .alert-status-critical { color: red; }
      .alert-status-resolved { color: green; }
      table { width: 100%; border-collapse: collapse; }
      th, td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }
      th { background-color: #f2f2f2; }
    </style>
  </head>
  <body>
    <h1>{{ .Status | toUpper }}: {{ .CommonLabels.alertname }}</h1>
    <p><strong>实例:</strong> {{ .CommonLabels.instance }}</p>
    <table>
      <thead>
        <tr>
          <th>告警名称</th>
          <th>状态</th>
          <th>描述</th>
          <th>严重性</th>
          <th>开始时间</th>
          <th>结束时间</th>
        </tr>
      </thead>
      <tbody>
        {{ range .Alerts }}
        <tr>
          <td>{{ .Labels.alertname }}</td>
          <td class="alert-status-{{ .Status }}">{{ .Status }}</td>
          <td>{{ .Annotations.description }}</td>
          <td>{{ .Labels.severity }}</td>
          <td>{{ .StartsAt.Format "2006年01月02日 15:04:05" }}</td>
          <td>{{ if eq .Status "resolved" }}{{ .EndsAt.Format "2006年01月02日 15:04:05" }}{{ else }}N/A{{ end }}</td>
        </tr>
        {{ end }}
      </tbody>
    </table>
    <p>如需更多信息，请检查Prometheus或Grafana仪表盘。</p>
  </body>
</html>
{{ end }}
```



✍️配置告警邮件通知，`vim /opt/prometheus/rules/alert.rules`

```yaml
groups:
- name: instanceDown
  rules:
  - alert: 实例离线
    expr: up == 0
    for: 5m # 等待5分钟以避免短暂的网络抖动触发误报
    labels:
      severity: "严重"
    annotations:
      description: "实例 {{ $labels.instance }} 在过去5分钟内未能提供数据，可能已关机或不在线。"
      summary: "实例 {{ $labels.instance }} 已离线"
- name: windows_exporter_alerts
  rules:
  - alert: WindowsMemoryUsageHigh
    expr: (node_memory_MemTotal_bytes - node_memory_MemAvailable_bytes) / node_memory_MemTotal_bytes * 100 > 85
    for: 1m
    labels:
      severity: 警告
    annotations:
      summary: "高内存使用率在 {{ $labels.instance }}"
      description: "内存使用率超过85%。当前值：{{ $value }}%"
  - alert: WindowsDiskUsageHighC
    expr: (node_filesystem_size_bytes{device="C:"} - node_filesystem_free_bytes{device="C:"}) / node_filesystem_size_bytes{device="C:"} * 100 > 85
    for: 1m
    labels:
      severity: 警告
    annotations:
      summary: "高磁盘 C: 使用率在 {{ $labels.instance }}"
      description: "磁盘 C: 使用率超过85%。当前值：{{ $value }}%"
  - alert: WindowsDiskUsageHighD
    expr: (node_filesystem_size_bytes{device="D:"} - node_filesystem_free_bytes{device="D:"}) / node_filesystem_size_bytes{device="D:"} * 100 > 85
    for: 1m
    labels:
      severity: 警告
    annotations:
      summary: "高磁盘 D: 使用率在 {{ $labels.instance }}"
      description: "磁盘 D: 使用率超过85%。当前值：{{ $value }}%"
  - alert: WindowsCPUUsageHigh
    expr: 100 - (avg by(instance) (irate(node_cpu_seconds_total{mode="idle"}[5m])) * 100) > 85
    for: 1m
    labels:
      severity: 警告
    annotations:
      summary: "高CPU使用率在 {{ $labels.instance }}"
      description: "CPU使用率超过85%。当前值：{{ $value }}%"
```





✍️如果需要在`prometheus`加入配置，编辑配置`vim /opt/prometheus/config/prometheus.yml`

```bash
rule_files:
  - "/prometheus/rules/*.rules"

# 启用alertmanager,编辑告警配置，如果没有告警可以省略
alerting:
  alertmanagers:
    - static_configs:
       - targets:
         # alertmanager的地址
         - 192.168.88.172:9093
```



:new:启动`alertmanager`

```bash
# 启动alertmanager (启动后docker ps检查一下，确保alertmanager起来了即可)
$ docker run -d \
--name=alertmanager \
-p 9093:9093 \
-v /etc/localtime:/etc/localtime:ro \
-v /opt/alertmanager/config/alertmanager.yml:/etc/alertmanager/alertmanager.yml \
-v /opt/alertmanager/template:/etc/alertmanager/template \
prom/alertmanager



$ docker logs -f alertmanager
```



:mag:访问地址：​http://192.168.88.172:9093



###### 