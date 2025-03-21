# 搭建下载服务器



创建目录

```bash
# 创建配置和下载文件的目录
$ mkdir -p /opt/nginx/{conf,download,log}
```



编辑文件`vi /opt/nginx/conf/nginx.conf`

```nginx
user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log;
pid /run/nginx.pid;
include /usr/share/nginx/modules/*.conf;
events {
    worker_connections 1024;
}
http {
    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';
    access_log  /var/log/nginx/access.log  main;
    sendfile            on;
    tcp_nopush          on;
    tcp_nodelay         on;
    keepalive_timeout   65;
    types_hash_max_size 2048;
    default_type        application/octet-stream;
    # Load modular configuration files from the /etc/nginx/conf.d directory.
    # See http://nginx.org/en/docs/ngx_core_module.html#include
    # for more information.
    include /etc/nginx/conf.d/*.conf;
    server {
        listen       80 default_server;
        listen       [::]:80 default_server;
        server_name  _;
        charset utf-8;
        # Load configuration files for the default server block.
        include /etc/nginx/default.d/*.conf;
        location / {
            root    /usr/share/nginx/html/download;
            autoindex on;    #开启索引功能
            autoindex_exact_size off;  #关闭计算文件确切大小（单位bytes），只显示大概大小（单位kb、mb、gb）
            autoindex_localtime on;   #显示本机时间而非 GMT 时间
        }
        error_page 404 /404.html;
            location = /40x.html {
        }
        error_page 500 502 503 504 /50x.html;
            location = /50x.html {
        }
    }
}

```



运行命令

```bash
$ docker run \
-itd \
--name nginx \
--restart=always \
-v /etc/localtime:/etc/localtime:ro \
-v /opt/nginx/conf/nginx.conf:/etc/nginx/nginx.conf \
-v /opt/nginx/download/:/usr/share/nginx/html/download \
-v /opt/nginx/log:/var/log/nginx/ \
-p 8888:80 \
nginx

# 设置开机自启动
$ docker update --restart=always nginx
```

