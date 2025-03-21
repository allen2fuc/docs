# 创建备份

**备份虚拟机**

```bash
# 备份操作，预计开销 00:17:51，压缩大小: 58.24GB
$ vzdump 108 \
--storage local \
--mode snapshot \
--compress zstd \
--notes-template hardencshu \
--prune-backups keep-last=1
```

**备份CT**

```bash
$ vzdump 108 --storage local --mode snapshot --compress zstd --notes-template DockerServer --prune-backups keep-last=1
```



###### 同步备份

**同步虚拟机**

```bash
$ time rsync -rvl \
--progress /var/lib/vz/dump/vzdump-qemu-111* \
root@192.168.88.29:/var/lib/vz/dump/
#real	8m21.816s
#user	4m6.939s
#sys	1m7.906s
```

**同步CT**

```bash
$ time rsync -rvl --progress /var/lib/vz/dump/vzdump-lxc-108* root@192.168.88.29:/var/lib/vz/dump/
```



###### 删除备份

```bash
# 删除备份,只保留最后一个
$ pvesm prune-backups --keep-last 1 --vmid 108 local
```



###### 恢复备份

```bash
$ time qmrestore /var/lib/vz/dump/vzdump-qemu-112-2025_02_28-17_54_02.vma.zst \
108 \
--storage vhost-system-drive1
#real	1m26.848s
#user	1m2.386s
#sys	1m2.111s
```



###### 移动磁盘

```bash
# 查看磁盘信息
$ qm config 108

# 移动磁盘
$ time qm disk move 108 scsi1 vhost-data-drive1 --delete 1
#real	6m47.630s
#user	0m15.000s
#sys	1m56.385s

# 设置缓存模式为 Write back,启用 discard
$ qm set 108 -scsi0 vhost-system-drive1:vm-108-disk-0,cache=writeback,discard=on,iothread=1
$ qm set 108 -scsi1 vhost-data-drive1:vm-108-disk-0,cache=writeback,discard=on,iothread=1

# 设置显卡
$ qm set 108 -hostpci0 0000:31:00.0,mdev=nvidia-47,pcie=1
$ qm set 115 -hostpci0 0000:98:00.0,mdev=nvidia-47,pcie=1
```



###### 删除磁盘

删除lvm-thin下的磁盘

```bash
$ lvdisplay /dev/vhost-system-drive1/vm-105-disk-1

$ lvremove /dev/vhost-system-drive1/vm-105-disk-1
```



删除zfs下的磁盘

```bash
$ zfs destroy user_data/vm-100-disk-1
```

