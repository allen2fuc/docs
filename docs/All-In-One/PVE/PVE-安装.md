# PVE-安装

## 准备
开机按快捷键进入BIOS

- intel主板开启VT，VT-D，来电自启动和选择U盘启动
- AMD主板开启IOMMU，SVM，来电自启动和选择U盘启动
- 开启硬盘热插拔
- 开启Above4G，SR-IOV（若有）
- 开启网络唤醒（若需要）
- 打开UEFI引导，关闭CSM兼容模式（DG1等纯UEFI类的显卡需要）



## 小工具

pvetools: https://github.com/ivanhao/pvetools




## 安装完成

### 删除`local-lvm`

根据需要删除，默认系统会把硬盘分区成两个盘，`local`和`local-lvm`。

```bash
# 删除 local-lvm分区
$ lvremove pve/data

# 把 local-lvm空间合并给 local分区
$ lvextend -rl +100%FREE pve/root

$ resize2fs /dev/mapper/pve-root
```
然后在网页中删除，网页[登录](https://xxx.xxx.xxx.xxx:8006)，数据中心---存储---移除local-lvm分区





### 配置网卡

> [!NOTE]
>
> 如果有多个网卡可以配置，原理配置两个桥接网卡，第一个为管理网口，第二个为虚拟机网口。

- 网卡1: eno1
- 网卡2：eno2



编辑文件：`vi /etc/network/interface`

```bash
auto lo
iface lo inet loopback

iface eno1 inet manual

auto vmbr0
iface vmbr0 inet static
        address xxx.xxx.xxx.240/24
        gateway xxx.xxx.xxx.1
        bridge-ports eno1
        bridge-stp off
        bridge-fd 0

iface eno2 inet manual

auto vmbr1
iface vmbr1 inet static
        address xxx.xxx.xxx.241/24
        gateway xxx.xxx.xxx.1
        bridge-ports eno2
        bridge-stp off
        bridge-fd 0

source /etc/network/interfaces.d/*
```



重启网卡：

```bash
$ systemctl restart networking
```



### 配置下载源



**安装必要的软件源**

修改文件：`/etc/apt/sources.list`，[参考](https://mirrors.tuna.tsinghua.edu.cn/help/debian/)

```bash
deb https://mirrors.ustc.edu.cn/debian/ bookworm main contrib non-free non-free-firmware
deb https://mirrors.ustc.edu.cn/debian/ bookworm-updates main contrib non-free non-free-firmware
deb https://mirrors.ustc.edu.cn/debian/ bookworm-backports main contrib non-free non-free-firmware
deb https://mirrors.ustc.edu.cn/debian-security bookworm-security main contrib non-free non-free-firmware
```



编辑PVE企业源，添加中科大源：`/etc/apt/sources.list.d/pve-enterprise.list`

```bash
deb https://mirrors.ustc.edu.cn/proxmox/debian bookworm pve-no-subscription
```



执行更新命令

```bash
$ apt update
```



### 配置NVDIA驱动

**加载内核模块**

编辑`/etc/modules`

```bash
vfio
vfio_iommu_type1
vfio_pci
vfio_virqfd
```





**屏蔽黑明单**

编辑`/etc/modprobe.d/pve-blacklist.conf`

```bash
# 直通NVIDIA显卡，请使用下面命令
blacklist nouveau
blacklist nvidia
blacklist nvidiafb

# 允许不安全的设备中断
options vfio_iommu_type1 allow_unsafe_interrupts=1
```



**调整相关内核参数**，[参考](https://pve-doc-cn.readthedocs.io/zh-cn/pve-nvidia-vgpu/env.html)

禁用`nouveau` 驱动,使Nvidia显卡不被其占用，从而能够顺利安装Nvidia vGPU驱动。

```bash
echo  "blacklist nouveau" >>/etc/modprobe.d/disable-nouveau.conf
echo  "options nouveau modeset=0" >>/etc/modprobe.d/disable-nouveau.conf
```

允许不安全中断

```bash
echo "options vfio_iommu_type1 allow_unsafe_interrupts=1" >/etc/modprobe.d/iommu_unsafe_interrupts.conf
echo "options kvm ignore_msrs=1" > /etc/modprobe.d/kvm.conf
```

配置好之后，需要更新内核以应用内核参数。 `update-initramfs -k all -u`



**开启iommu**

编辑`/etc/default/grub`，在cmdline中添加iommu参数 如下

```bash
#intel_cpu
GRUB_CMDLINE_LINUX_DEFAULT="quiet intel_iommu=on iommu=pt pcie_acs_override=downstream,multifunction"
```

最后使用`update-grub`更新系统引导。



检查iommu是否已经开启

```bash
dmesg | grep -e DMAR -e IOMMU
```

```bash
[    1.668360] DMAR: IOMMU enabled
```



**安装依赖**

安装`dkms`和`pve-headers`，用于安装驱动。`jq`和`uuid-runtime`用于配合`mdevctl`管理Nvidia vGPU设备。

```bash
$ apt update
$ apt upgrade
$ apt install dkms build-essential pve-headers pve-headers-`uname -r` dkms jq uuid-runtime unzip -y
```



**安装驱动**

> [!NOTE]
>
> 先使用自己公司的邮箱地址在NVIDIA[注册](https://enterpriseproductregistration.nvidia.com/?LicType=EVAL&ProductFamily=vGPU&ncid=em-news-525732)90天试用，*使用公共的邮箱地址很可能无法通过*，一定要在文档中查看自己的显卡支持的[版本](https://docs.nvidia.com/vgpu/gpus-supported-by-vgpu.html)，然后在[dashboard](https://ui.licensing.nvidia.com/)中下载自己对应的版本。仔细对比好版本。



#### Tesla P40

这里以`Tesla P40`为例，它最高只支持vgpu16.4版本，那么选择时一定要选择对应的版本。

![image-20250103160718563](http://1160230244.uttcare.com:5543/2025/01/image-20250103160718563.png)



下载后的文件及内容，[这里也可以在下载](https://alist.homelabproject.cc/foxipan/vGPU/16.4)：

```bash
# 1. 解压驱动包
$ unzip NVIDIA-GRID-Linux-KVM-535.161.05-535.161.07-538.33.zip -d NVIDIA-GRID-Linux-KVM-535.161.05-535.161.07-538.33
Archive:  NVIDIA-GRID-Linux-KVM-535.161.05-535.161.07-538.33.zip
  inflating: NVIDIA-GRID-Linux-KVM-535.161.05-535.161.07-538.33/535.161.05-535.161.07-538.33-grid-gpumodeswitch-user-guide.pdf  
  inflating: NVIDIA-GRID-Linux-KVM-535.161.05-535.161.07-538.33/535.161.05-535.161.07-538.33-grid-licensing-user-guide.pdf  
  inflating: NVIDIA-GRID-Linux-KVM-535.161.05-535.161.07-538.33/535.161.05-535.161.07-538.33-grid-software-quick-start-guide.pdf  
  inflating: NVIDIA-GRID-Linux-KVM-535.161.05-535.161.07-538.33/535.161.05-535.161.07-538.33-grid-vgpu-release-notes-generic-linux-kvm.pdf  
  inflating: NVIDIA-GRID-Linux-KVM-535.161.05-535.161.07-538.33/535.161.05-535.161.07-538.33-grid-vgpu-user-guide.pdf  
  inflating: NVIDIA-GRID-Linux-KVM-535.161.05-535.161.07-538.33/535.161.05-535.161.07-538.33-whats-new-vgpu.pdf  
   creating: NVIDIA-GRID-Linux-KVM-535.161.05-535.161.07-538.33/Guest_Drivers/
  inflating: NVIDIA-GRID-Linux-KVM-535.161.05-535.161.07-538.33/Guest_Drivers/nvidia-linux-grid-535_535.161.07_amd64.deb  
  inflating: NVIDIA-GRID-Linux-KVM-535.161.05-535.161.07-538.33/Guest_Drivers/nvidia-linux-grid-535-535.161.07-1.x86_64.rpm  
  inflating: NVIDIA-GRID-Linux-KVM-535.161.05-535.161.07-538.33/Guest_Drivers/538.33_grid_win10_win11_server2019_server2022_dch_64bit_international.exe  
  inflating: NVIDIA-GRID-Linux-KVM-535.161.05-535.161.07-538.33/Guest_Drivers/NVIDIA-Linux-x86_64-535.161.07-grid.run  
   creating: NVIDIA-GRID-Linux-KVM-535.161.05-535.161.07-538.33/Host_Drivers/
  inflating: NVIDIA-GRID-Linux-KVM-535.161.05-535.161.07-538.33/Host_Drivers/NVIDIA-Linux-x86_64-535.161.05-vgpu-kvm.run  
   creating: NVIDIA-GRID-Linux-KVM-535.161.05-535.161.07-538.33/Signing_Keys/
  inflating: NVIDIA-GRID-Linux-KVM-535.161.05-535.161.07-538.33/Signing_Keys/vgpu_debian_publickey.pub  
  inflating: NVIDIA-GRID-Linux-KVM-535.161.05-535.161.07-538.33/Signing_Keys/vgpu_rpm_publickey.pub  


# 2. 进入到安装位置
$ cd NVIDIA-GRID-Linux-KVM-535.161.05-535.161.07-538.33/Host_Drivers/

# 3. 授权并执行驱动包
$ chmod u+x NVIDIA-Linux-x86_64-535.161.05-vgpu-kvm.run
$ ./NVIDIA-Linux-x86_64-535.161.05-vgpu-kvm.run 
```

经过与网友沟通，建议将我最新的`PVE 8.3.1`内核版本为`6.8.12-5-pve`降级为`6.8.4-2-pve`



查看显卡信息

```bash
$ nvidia-smi
```

![image-20250103161105935](http://1160230244.uttcare.com:5543/2025/01/image-20250103161105935.png)

![image-20250103161145837](http://1160230244.uttcare.com:5543/2025/01/image-20250103161145837.png)



![image-20250103161207506](http://1160230244.uttcare.com:5543/2025/01/image-20250103161207506.png)

![](http://1160230244.uttcare.com:5543/2025/01/image-20250103161231960.png)

##### 版本降级

1. 下载原先的版本

```bash
$ apt-get install pve-kernel-6.5.3-1-pve
```

2. 回退版本

```bash
$ proxmox-boot-tool kernel pin 6.5.3-1-pve
$ proxmox-boot-tool refresh
```

3. 重启电脑

```bash
$ reboot
```



