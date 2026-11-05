// PTUFDC staging configuration. No credentials or tokens in source.
import { MaintenanceConfig, PageConfig, WorkerConfig } from './types/config'

const pageConfig: PageConfig = {
  title: 'PTUFDC · 服务运行状态',
  links: [
    { link: 'https://www.ptufdc.com/', label: 'PTUFDC 官网', highlight: true },
    { link: 'https://github.com/StarsbySea/cf-workers-status-page', label: '源码仓库' },
  ],
  group: {
    'PTUFDC 多云入口（验证中）': ['ptufdc-cf', 'ptufdc-esa', 'ptufdc-eo'],
    '莆田学院公共服务（独立监测）': [
      'www-ptu-edu-cn', 'news-ptu-edu-cn', 'mail-ptu-edu-cn', 'oss-ptu-edu-cn',
    ],
  },
  customFooter: '独立第三方可用性检测，结果仅反映检测节点的访问情况，不代表被监测服务的官方状态。',
}

const workerConfig: WorkerConfig = {
  monitors: [
    { id: 'ptufdc-cf', name: '主站（Cloudflare）',
      method: 'GET', target: 'https://www.ptufdc.com/',
      statusPageLink: 'https://www.ptufdc.com/', timeout: 12000,
      tooltip: '公开主页；可能遇到 Cloudflare 挑战，应在测试中确认判定规则' },
    { id: 'ptufdc-esa', name: '阿里云 ESA',
      method: 'GET', target: 'https://esa.ptufdc.com/',
      statusPageLink: 'https://esa.ptufdc.com/', timeout: 12000,
      tooltip: '中国大陆加速入口；验证跳转、TLS 和挑战兼容性' },
    { id: 'ptufdc-eo', name: '腾讯云 EdgeOne',
      method: 'GET', target: 'https://eo.ptufdc.com/',
      statusPageLink: 'https://eo.ptufdc.com/', timeout: 12000,
      tooltip: '腾讯云 EdgeOne 入口；验证跳转与 TLS 配置' },
    { id: 'www-ptu-edu-cn', name: '莆田学院官网',
      method: 'GET', target: 'https://www.ptu.edu.cn/index.htm',
      statusPageLink: 'https://www.ptu.edu.cn/index.htm', timeout: 12000,
      tooltip: '第三方监测，不代表莆田学院官方服务承诺' },
    { id: 'news-ptu-edu-cn', name: '莆田学院新闻网',
      method: 'GET', target: 'https://news.ptu.edu.cn/',
      statusPageLink: 'https://news.ptu.edu.cn/', timeout: 12000 },
    { id: 'mail-ptu-edu-cn', name: '校园邮箱',
      method: 'GET', target: 'https://mail.ptu.edu.cn/',
      statusPageLink: 'https://mail.ptu.edu.cn/', timeout: 12000 },
    { id: 'oss-ptu-edu-cn', name: '一站式服务（待验证）',
      method: 'GET', target: 'https://oss.ptu.edu.cn/',
      statusPageLink: 'https://oss.ptu.edu.cn/', timeout: 12000,
      tooltip: '原 http 入口返回 301。新 HTTPS 入口必须实测成功后才能启用告警。' },
  ],
  notification: { timeZone: 'Asia/Shanghai', gracePeriod: 5,
    skipErrorChangeNotification: true },
}

const maintenances: MaintenanceConfig[] = []
export { maintenances, pageConfig, workerConfig }
