# PTUFDC 状态页：UptimeFlare 迁移预备分支

上游：https://github.com/lyc8503/UptimeFlare
基线：2026-10-21 commit 803552126（包含 2026-03-04 CVE-2026-29779 修复）
许可证：Apache-2.0。

**本分支尚未部署；不得直接切换 status.ptufdc.com。**
旧版 Worker、Cron、DNS、KV 和告警全部保留。

## 已做配置
- 复制上游完整 72 个文件（包括静态资源与锁文件）；
- 配置了 PTUFDC CF / ESA / EO 三入口、学校官网/新闻/邮件/一站式服务共 7 个监控；
- 保留原学校服务的 monitor ID，方便未来对应历史存档；
- 删去 Pay：旧配置与 OSS 指向同一个 URL，不能冒充独立监控；
- 将原 OSS 的 HTTP 301 入口改为 HTTPS 待验证；
- 不配置通知 webhook，避免未验证前误报；
- Cron 由 1 分钟降低为每 5 分钟一次，控制免费额度和写入频率；
- 生产部署工作流改为仅手动触发，并跳过上游自动 KV 迁移逻辑；
- 增加纯构建验证 CI，避免未授权发布。

## Cloudflare 资源及操作
新项目使用上游默认的独立测试资源：
- Pages: uptimeflare，临时地址 uptimeflare.pages.dev
- Worker: uptimeflare_worker
- D1: uptimeflare_d1
- Durable Objects: RemoteChecker

预备检查中，账户尚无相同名称的 D1 数据库和 Pages 项目。
当前已经通过 Cloudflare 连接创建了独立的测试 Pages 项目 `uptimeflare-preview` 和 D1 `uptimeflare_preview_d1`，且初始化了 `uptimeflare` 表。正式 `uptimeflare` / `uptimeflare_d1` / `uptimeflare_worker` 尚未创建。仅成功创建资源，不表示 Pages 已成功构建部署或监控 Worker 已运行。

### 发布前条件
1. 完成 GitHub Actions 构建验证，特别是 Next.js 14 + next-on-pages 兼容性；
2. 通过浏览器及真实 Worker 出站请求验证每个服务，检查重定向、证书、挑战和页面正文；单纯 HTTP 200 不代表业务可用；
3. 建立专用最小权限 Cloudflare API Token，存入 GitHub Actions secret `CLOUDFLARE_API_TOKEN`；不放入源码；
4. 手动运行 Deploy to Cloudflare 工作流，先验收临时 pages.dev 域名，不绑定正式域名；
5. 验证中英文、移动端、暗黑模式、WCAG 自动扫描、数据时效和 API；
6. 配置通知前先验证阈值和去抖逻辑；正式切换前并行检测 48 小时以上；
7. 保存旧 KV 历史，确认 DNS/路由切换和回滚方案后再处理正式地址。

## 旧历史不兼容
旧 Worker KV namespace 的 key 为 `monitors_data_v1_1`；
数据包括自 2023-03 起的逐日失败事件数和成功请求延迟聚合，没有准确逐次失败计数。
上游 `deploy/migrate_kv.py` 只针对旧版 **UptimeFlare 自身** `uptimeflare_kv` 结构，
而且可能删除相应 KV namespace，不适用于本项目。故部署步骤已禁用该脚本。
保留原 KV 为只读；如需展示历史，另导出为静态 legacy-history archive。
不可据该旧结构反推精确 SLA。

## 其他待验证
- 开源项目状态页不能直接规避 Bot Fight Mode 挑战。
- ESA 和 EO 中国大陆体验需要地域探针确认，Workers 海外节点不代表国内用户体验。
- 下一阶段应把通知凭据仅存 Cloudflare/GitHub secrets，禁止提交到公开配置。
- 上游 sync workflow 直接打印配置内容且执行清理替换，迁移预备分支未保留该工作流。
