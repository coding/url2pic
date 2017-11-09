## 概述
使用 chrome headless 在 linux 下进行截图

## 使用 docker build
[Dockerfile](./Dockerfile)

## 环境变量

```
"port=8295"
"concurrency=6"
"chromiumExec=google-chrome"
"timeout=4500"
"VirtualTimeBudget=3500"
```

- port 服务的端口
- concurency 并发数
- chromiumExec chrome 执行地址
- timeout 请求超时时间
- VirtualTimeBudget 渲染等待时间