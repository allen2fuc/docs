# 编译OpenWrt

下载ubuntu22.04，[参考文档](https://lhy.life/20200531-openwrt+openclash/)

```bash
wget https://releases.ubuntu.com/jammy/ubuntu-22.04.5-live-server-amd64.iso
```

执行命令

```bash
$ sudo apt update

$ sudo apt install net-tools iputils-ping
```

使用代理

```bash
$ export http_proxy=http://192.168.88.172:7890
$ export https_proxy=http://192.168.88.172:7890
```

下载依赖

```bash
$ sudo apt -o Acquire::http::proxy="http://192.168.88.172:7890/" install \
build-essential clang flex bison g++ gawk \
gcc-multilib g++-multilib gettext git libncurses5-dev libssl-dev \
python3-setuptools rsync swig unzip zlib1g-dev file wget mkisofs -y
```

下载openwrt，三选一

```bash
# 官方版本
$ git clone https://github.com/openwrt/openwrt

# lede版本
$ git clone https://github.com/coolsnowwolf/lede

# lienol版本，这个实验能通过
$ git clone -b 22.03 --single-branch https://github.com/Lienol/openwrt
```

指定版本，如果选择lienol版本，则跳过

```bash
$ cd openwrt

$ git tag

$ git checkout v22.03.3
```

添加插件和主题

```bash
$ vi feeds.conf.default

src-git amlogic https://github.com/ophub/luci-app-amlogic   # 必须添加
src-git alist https://github.com/sbwml/luci-app-alist       # alist插件
src-git passwall packages https://github.com/xiaorouji/openwrt-passwall.git;packages
src-git passwall luci https://github.com/xiaorouji/openwrt-passwall.git;luci
src-git kenzo https://github.com/kenzok8/openwrt-packages
src-git argonnew https://github.com/jerrykuku/luci-theme-argon.git;main   #主题
```

非root下执行

```bash
## 切换到用户根目录
$ cd ~

## 拉取OpenWrt
$ git clone https://github.com/openwrt/openwrt

## 下载OpenClash
$ wget https://github.com/vernesong/OpenClash/archive/master.zip

## 解压
$ unzip master.zip

## 复制OpenClash软件包到OpenWrt
$ cp -r OpenClash-master/luci-app-openclash openwrt/package

$ cd openwrt
```



编译，每次更改这步操作需要重新执行，如果需要编译带[openclash](https://lhy.life/20200531-openwrt+openclash/)，请参考。

```bash
# 如果是重复执行，需要清理
$ rm -rf ~/openwrt/.config && rm -rf ~/openwrt/tmp

# 更新源码
$ ./scripts/feeds update -a

# 拷贝源码
$ ./scripts/feeds install -a
```

定制openwrt系统

```bash
# 打开面板
$ make menuconfig
```

设置项

```bash
Target System (x86)  --->   目标系统（x86）
Subtarget (x86_64)  --->   子目标（x86_64）
Target Profile (Generic)  --->目标配置文件（通用）
Target Images  ---> 保存目标镜像的格式
Global build settings  --->      全局构建设置
Advanced configuration options (for developers)  ---- 高级配置选项（适用于开发人员）
Build the OpenWrt Image Builder 构建OpenWrt图像生成器
Build the OpenWrt SDK  构建OpenWrt SDK
Package the OpenWrt-based Toolchain 打包基于OpenWrt的工具链
Image configuration  --->图像配置
Base system  --->     基本系统
Administration  --->     管理
Boot Loaders  ---> 引导加载程序
Development  --->   开发
Extra packages  --->  额外包
Firmware  --->固件
Fonts  --->字体
Kernel modules  --->  内核模块
Languages  --->语言
Libraries  --->  图书馆
LuCI  --->      LuCI
Mail  ---> 邮件
Multimedia  --->多媒体
Network  --->网络
Sound  ---> 声音
Utilities  --->实用程序
Xorg  --->Xorg
```

```bash
## 选择系统(以 x86_64 为例)
Target System -> x86
Subtarget -> x86_64

## 选择固件的文件系统
## https://openwrt.org/docs/techref/filesystems
Target Images -> squashfs

## 选择构建X86_X64的GRUB固件
Target Images -> Build GRUB images (Linux x86 or x86_64 host only) 

## 选择更小的压缩格式固件，方便复制
Target Images -> GZip images

## 修改软件包可用空间，默认安装会占用100M左右，建议修改扩大，为后续安装其他软件打基础
Target Images -> Root filesystem partition size

## 添加web界面(y键选择n键排除)
LuCI > Collections -> Luci

## 添加兼容性依赖
LuCI > Modules -> luci-compat

## 添加中文
LuCI > Modules -> Translations -> Chinese Simplified

## 添加openclash
LuCI > Applications -> luci-app-openclash  

## 添加主题
LuCI -> Themes

## 添加wget
Nerwork -> File Transfer -> wget-ssl

## 添加kmod-tun，TUN模式必须
Kernel modules -> Network Support -> kmod-tun

## 排除dnsmasq，由于默认会安装dnsmasq-full，这里需要排除dnsmasq，否则会冲突报错。
Base system -> dnsmasq 
```



编译

```bash
$ make -j8 download V=s

# 清理
# make clean V=s -j4

$ make V=s -j4
```

编译成功的文件

```bash
$ ls bin/targets/x86/64/openwrt-x86-64-generic-squashfs-combined.img

$ ls bin/targets/x86/64/openwrt-x86-64-generic-ext4-combined.img.gz
```

将img转换成vmdk

```bash
# 解压
$ gzip -d openwrt-x86-64-generic-ext4-combined.img.gz

# 如果是mac需要装qemc，下载可能需要梯子
$ brew install qemu

$ qemu-img convert -f raw -O vmdk Downloads/openwrt-x86-64-generic-squashfs-combined.img Downloads/openwrt-x86-64-generic-squashfs-combined.vmdk
```

将IP网段更改

```bash
# 更改静态IP
$ vi /etc/config/network
config interface 'lan'
  option ipaddr 172.16.189.150
  option netmask 255.255.255.0
  option gateway 172.16.189.2

# 重启网卡
$ /etc/init.d/network restart
```

下载内核

```bash
设置静态IP地址，网关指向主路由，DNS指向192.168.88.240、223.5.5.5、8.8.8.8、8.8.4.4、114.114.114.114

在 服务 -> OpenClash -> 插件设置 -> 版本更新

点击第一个 下载到本地 解压后clash上传并重命名 /etc/openclash/core/clash_meta 文件。


特别要主要，在主路由器中，网关和DNS都设置为旁路由器地址。
```

