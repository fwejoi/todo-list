import dom from './dom';
import handlers from './handlers';

// 页面加载时 - 显示菜单链接“所有”的标题
dom.showMainTitle(0);

// 页面加载时 - 显示所有默认项目
dom.showProjects();

// 页面加载时 - 显示所有默认项目下的任务
dom.getTasks('all');

// 设置菜单的响应式行为
dom.responsiveMenu();

// 设置窗口调整时的事件监听
handlers.resizeWindow();

// 监听用户的点击事件
handlers.listenClicks();
