#  安装speedtest

```bash
$ docker run -itd --name speedtest -e MODE=standalone -p 8080:8080  --restart=always ghcr.io/librespeed/speedtest
```