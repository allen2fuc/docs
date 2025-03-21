# PVE-命令

## pvesh
```bash
pvesh help
用法: pvesh create <api_path> [OPTIONS] [FORMAT_OPTIONS]

  在 <api_path> 上调用 API POST。

  <api_path> <string>
	     API 路径。

  --noproxy  <boolean>
	     禁用自动代理。

用法: pvesh delete <api_path> [OPTIONS] [FORMAT_OPTIONS]

  在 <api_path> 上调用 API DELETE。

  <api_path> <string>
	     API 路径。

  --noproxy  <boolean>
	     禁用自动代理。

用法: pvesh get <api_path> [OPTIONS] [FORMAT_OPTIONS]

  在 <api_path> 上调用 API GET。

  <api_path> <string>
	     API 路径。

  --noproxy  <boolean>
	     禁用自动代理。

用法: pvesh help [<extra-args>] [OPTIONS]

  获取指定命令的帮助信息。

  <extra-args> <array>
	     显示特定命令的帮助信息。

  --verbose  <boolean>
	     详细输出格式。

用法: pvesh ls <api_path> [OPTIONS] [FORMAT_OPTIONS]

  列出 <api_path> 下的子对象。

  <api_path> <string>
	     API 路径。

  --noproxy  <boolean>
	     禁用自动代理。

用法: pvesh set <api_path> [OPTIONS] [FORMAT_OPTIONS]

  在 <api_path> 上调用 API PUT。

  <api_path> <string>
	     API 路径。

  --noproxy  <boolean>
	     禁用自动代理。

用法: pvesh usage <api_path> [OPTIONS]

  打印 <api_path> 的 API 使用信息。

  <api_path> <string>
	     API 路径。

  --command  <create | delete | get | set>
	     API 命令。

  --returns  <boolean>
	     包括返回数据的模式。

  --verbose  <boolean>
	     详细输出格式。
```

停止所有虚拟机

```bash
# https://pve.proxmox.com/pve-docs/api-viewer/index.html#/nodes/{node}/stopall

$ pvesh create /nodes/node2/stopall -vms 101,107
```

启动虚拟机

```bash
# https://pve.proxmox.com/pve-docs/api-viewer/index.html#/nodes/{node}/startall

$ pvesh create /nodes/node2/startall -vms 101,107 
```

获取任务日志

```bash
# https://pve.proxmox.com/pve-docs/api-viewer/index.html#/nodes/{node}/tasks/{upid}/log

$ pvesh get /nodes/node2/tasks/UPID:node2:000C59F6:01336817:67D2A18E:startall::root@pam:/log
┌───┬─────────┐
│ n │ t       │
╞═══╪═════════╡
│ 1 │ TASK OK │
└───┴─────────┘
```

获取任务状态

```bash
# https://pve.proxmox.com/pve-docs/api-viewer/index.html#/nodes/{node}/tasks/{upid}/status

$ pvesh get /nodes/node2/tasks/UPID:node2:000C604C:01340878:67D2A328:startall::root@pam:/status
┌────────────┬───────────────────────────────────────────────────────────┐
│ key        │ value                                                     │
╞════════════╪═══════════════════════════════════════════════════════════╡
│ exitstatus │ OK                                                        │
├────────────┼───────────────────────────────────────────────────────────┤
│ id         │                                                           │
├────────────┼───────────────────────────────────────────────────────────┤
│ node       │ node2                                                     │
├────────────┼───────────────────────────────────────────────────────────┤
│ pid        │ 809462                                                    │
├────────────┼───────────────────────────────────────────────────────────┤
│ pstart     │ 20146199                                                  │
├────────────┼───────────────────────────────────────────────────────────┤
│ starttime  │ 1741857166                                                │
├────────────┼───────────────────────────────────────────────────────────┤
│ status     │ stopped                                                   │
├────────────┼───────────────────────────────────────────────────────────┤
│ type       │ startall                                                  │
├────────────┼───────────────────────────────────────────────────────────┤
│ upid       │ UPID:node2:000C59F6:01336817:67D2A18E:startall::root@pam: │
├────────────┼───────────────────────────────────────────────────────────┤
│ user       │ root@pam                                                  │
└────────────┴───────────────────────────────────────────────────────────┘

```

## rsync
```bash
rsync 版本 3.2.7 协议版本 32
版权所有 (C) 1996-2022 Andrew Tridgell, Wayne Davison 等。
网站: https://rsync.samba.org/
功能：
    64位文件，64位inums，64位时间戳，64位长整数，
    socketpairs, 符号链接, symtimes, 硬链接, 硬链接特殊,
    硬链接符号链接, IPv6, 访问时间, 批处理文件, 就地更新, 追加, ACLs,
    xattrs, 可选隔离参数, iconv, 预分配, 停止, 不支持创建时间
优化：
    SIMD-roll, 不使用asm-roll, openssl-crypto, 不使用asm-MD5
校验和列表：
    xxh128 xxh3 xxh64 (xxhash) md5 md4 sha1 none
压缩列表：
    zstd lz4 zlibx zlib none
守护进程认证列表：
    sha512 sha256 sha1 md5 md4

rsync 在任何情况下都不提供任何担保。这是自由软件，并且您可以在特定条件下重新分发它。详见GNU通用公共许可证。

rsync 是一个能够通过快速差异算法进行高效远程更新的文件传输程序。

用法：rsync [选项]... SRC [SRC]... DEST
   或者 rsync [选项]... SRC [SRC]... [USER@]HOST:DEST
   或者 rsync [选项]... SRC [SRC]... [USER@]HOST::DEST
   或者 rsync [选项]... SRC [SRC]... rsync://[USER@]HOST[:PORT]/DEST
   或者 rsync [选项]... [USER@]HOST:SRC [DEST]
   或者 rsync [选项]... [USER@]HOST::SRC [DEST]
   或者 rsync [选项]... rsync://[USER@]HOST[:PORT]/SRC [DEST]
':' 使用连接通过远程shell，而 '::' 和 'rsync://' 使用连接到rsync守护进程，并要求SRC或DEST以模块名开头。

选项
--verbose, -v            提高详细程度
--info=FLAGS             细粒度信息详细程度
--debug=FLAGS            细粒度调试详细程度
--stderr=e|a|c           改变标准错误输出模式（默认：错误）
--quiet, -q              抑制非错误消息
--no-motd                抑制守护模式下的MOTD
--checksum, -c           根据校验和跳过，而不是修改时间和大小
--archive, -a            归档模式是 -rlptgoD （不包括 -A,-X,-U,-N,-H）
--no-OPTION              关闭隐含的OPTION（例如 --no-D）
--recursive, -r          递归进入目录
--relative, -R           使用相对路径名称
--no-implied-dirs        使用 --relative 时不发送隐含目录
--backup, -b             创建备份（参见 --suffix & --backup-dir）
--backup-dir=DIR         将备份放入基于DIR的层次结构中
--suffix=SUFFIX          备份后缀（默认 ~ 没有 --backup-dir）
--update, -u             跳过接收方上较新的文件
--inplace                就地更新目标文件
--append                 向较短文件追加数据
--append-verify          --append 与旧数据在文件校验和中
--dirs, -d               传输目录而不递归
--old-dirs, --old-d      当与旧版rsync通信时像 --dirs 一样工作
--mkpath                 创建目的地缺少的路径组件
--links, -l              将符号链接复制为符号链接
--copy-links, -L         将符号链接转换为其引用的文件/目录
--copy-unsafe-links      仅将“不安全”的符号链接转换
--safe-links             忽略指向树外的符号链接
--munge-links            修改符号链接使其安全且不可用
--copy-dirlinks, -k      将符号链接到目录转换为其引用的目录
--keep-dirlinks, -K      将接收方上的符号链接目录视为目录
--hard-links, -H         保留硬链接
--perms, -p              保留权限
--executability, -E      保留可执行性
--chmod=CHMOD            影响文件和/或目录权限
--acls, -A               保留ACL（隐含 --perms）
--xattrs, -X             保留扩展属性
--owner, -o              保留所有者（仅限超级用户）
--group, -g              保留组
--devices                保留设备文件（仅限超级用户）
--copy-devices           将设备内容作为普通文件复制
--write-devices          将写入设备作为文件（隐含 --inplace）
--specials               保留特殊文件
-D                       相同于 --devices --specials
--times, -t              保留修改时间
--atimes, -U             保留访问（使用）时间
--open-noatime           避免更改打开文件的atime
--crtimes, -N            保留创建时间（新度）
--omit-dir-times, -O     从 --times 中省略目录
--omit-link-times, -J    从 --times 中省略符号链接
--super                  接收方尝试超级用户活动
--fake-super             使用xattrs存储/恢复特权属性
--sparse, -S             将null序列转换为稀疏块
--preallocate            分配目标文件之前写入它们
--dry-run, -n            执行试运行但不做任何更改
--whole-file, -W         整个复制文件（不使用delta-xfer算法）
--checksum-choice=STR    选择校验和算法（别名 --cc）
--one-file-system, -x    不跨越文件系统边界
--block-size=SIZE, -B    强制固定校验和块大小
--rsh=COMMAND, -e        指定使用的远程shell
--rsync-path=PROGRAM     指定远程机器上运行的rsync
--existing               跳过在接收方上创建新文件
--ignore-existing        跳过更新接收方已存在的文件
--remove-source-files    发送方删除同步的文件（非目录）
--del                    --delete-during 的别名
--delete                 删除目标目录中的多余文件
--delete-before          接收方在传输前删除，而不是期间
--delete-during          接收方在传输期间删除
--delete-delay           查找删除期间，在之后删除
--delete-after           接收方在传输后删除，而不是期间
--delete-excluded        也从目标目录中删除排除的文件
--ignore-missing-args    忽略丢失的源参数而不报错
--delete-missing-args    从目标中删除丢失的源参数
--ignore-errors          即使存在I/O错误也删除
--force                  强制删除即使目录非空
--max-delete=NUM         不要删除超过NUM个文件
--max-size=SIZE          不传输大于SIZE的文件
--min-size=SIZE          不传输小于SIZE的文件
--max-alloc=SIZE         更改与内存分配相关的限制
--partial                保持部分传输的文件
--partial-dir=DIR        将部分传输的文件放入DIR
--delay-updates          最后将所有更新文件置于正确位置
--prune-empty-dirs, -m   从文件列表中修剪空目录链
--numeric-ids            不通过用户名/组名映射uid/gid值
--usermap=STRING         自定义用户名映射
--groupmap=STRING        自定义组名映射
--chown=USER:GROUP       简单的用户名/组名映射
--timeout=SECONDS        设置I/O超时秒数
--contimeout=SECONDS     设置守护进程连接超时秒数
--ignore-times, -I       不跳过匹配大小和时间的文件
--size-only              跳过大小匹配的文件
--modify-window=NUM, -@  设置mod-time比较的精度
--temp-dir=DIR, -T       在目录DIR中创建临时文件
--fuzzy, -y              如果没有目标文件，则查找类似的基准文件
--compare-dest=DIR       也将目标文件与相对于DIR的文件进行比较
--copy-dest=DIR          ... 并包含未更改文件的副本
--link-dest=DIR          如果未更改则硬链接到DIR中的文件
--compress, -z           在传输过程中压缩文件数据
--compress-choice=STR    选择压缩算法（别名 --zc）
--compress-level=NUM     显式设置压缩级别（别名 --zl）
--skip-compress=LIST     跳过压缩具有LIST中后缀的文件
--cvs-exclude, -C        以与CVS相同的方式自动忽略文件
--filter=RULE, -f        添加文件过滤RULE
-F                       相同于 --filter='dir-merge /.rsync-filter'
                         重复: --filter='- .rsync-filter'
--exclude=PATTERN        排除匹配PATTERN的文件
--exclude-from=FILE      从FILE读取排除模式
--include=PATTERN        不排除匹配PATTERN的文件
--include-from=FILE      从FILE读取包含模式
--files-from=FILE        从FILE读取源文件名列表
--from0, -0              所有*-from/filter文件由0分隔
--old-args               禁用现代参数保护成语
--secluded-args, -s      使用协议安全发送参数
--trust-sender           信任远程发送方的文件列表
--copy-as=USER[:GROUP]   指定复制的用户和可选组
--address=ADDRESS        绑定到传出套接字到守护进程的地址
--port=PORT              指定双冒号备用端口号
--sockopts=OPTIONS       指定自定义TCP选项
--blocking-io            对远程shell使用阻塞I/O
--outbuf=N|L|B           设置出缓冲为None, Line, 或 Block
--stats                  给出一些文件传输统计
--8-bit-output, -8       输出中不转义高位字符
--human-readable, -h     以人类可读格式输出数字
--progress               显示传输进度
-P                       相同于 --partial --progress
--itemize-changes, -i    输出所有更新的变更摘要
--remote-option=OPT, -M  仅发送OPTION给远程端
--out-format=FORMAT      使用指定的FORMAT输出更新
--log-file=FILE          将我们正在做的事情记录到指定的FILE
--log-file-format=FMT    使用指定的FMT日志更新
--password-file=FILE     从FILE读取守护进程访问密码
--early-input=FILE       使用FILE作为守护进程早期执行输入
--list-only              列出文件而不是复制它们
--bwlimit=RATE           限制套接字I/O带宽
--stop-after=MINS        rsync在经过MINS分钟后停止
--stop-at=y-m-dTh:m      rsync在指定的时间点停止
--fsync                  fsync每个写入的文件
--write-batch=FILE       写入批量更新到FILE
--only-write-batch=FILE  类似于 --write-batch 但不进行更新
--read-batch=FILE        从FILE读取批量更新
--protocol=NUM           强制使用较旧的协议版本
--iconv=CONVERT_SPEC     请求文件名字符集转换
--checksum-seed=NUM      设置块/文件校验和种子（高级）
--ipv4, -4               优先使用IPv4
--ipv6, -6               优先使用IPv6
--version, -V            打印版本和其他信息并退出
--help, -h (*)           显示此帮助信息（* -h仅在单独使用时显示帮助）

使用 "rsync --daemon --help" 查看守护进程模式下的命令行选项。
请参阅 rsync(1) 和 rsyncd.conf(5) 的手册页以获取完整文档。
访问 https://rsync.samba.org/ 获取更新、错误报告和答案。
rsync 错误：语法或使用错误（代码 1）在 main.c(1780) [客户端=3.2.7]
```

例子1:

```bash
# 例子1：递归、详情、链接
$ rsync -rvl $pdir/$fname $user@$slave$host:$pdir
```


## qmrestore
```bash
用法: qmrestore help
用法: qmrestore <archive> <vmid> [选项]
  <archive>  <字符串>
             备份文件。你可以传递 '-' 来从标准输入读取。

  <vmid>     <整数> (100 - 999999999)
             虚拟机的（唯一）ID。

  --bwlimit  <数字> (0 - N)
             覆盖I/O带宽限制（单位：KiB/s）。

  --force    <布尔值>
             允许覆盖现有的虚拟机。

  --live-restore <布尔值>
             立即从备份启动虚拟机并在后台恢复。仅适用于PBS。

  --pool     <字符串>
             将虚拟机添加到指定的池中。

  --storage  <存储ID>
             默认存储。

  --unique   <布尔值>
             分配唯一的随机以太网地址。
```

例子1:

```bash
$ qmrestore /var/lib/vz/dump/vzdump-qemu-104-2025_02_28-14_59_31.vma.zst 105 --storage vhost-system-drive1
```

