/**
 * handlers模块负责处理用户交互事件，例如窗口大小调整、点击事件等。
 * 该模块通过监听用户的点击行为来响应相应的操作，如打开或关闭模态框、添加、编辑或删除项目和任务等。
 */

import dom from './dom';
import tasks from './tasks';

const handlers = (() => {
  // 根据窗口大小调整菜单
  function resizeWindow() {
    window.addEventListener('resize', dom.responsiveMenu); // 监听窗口大小变化事件
  }

  function listenClicks() {
    // 点击事件处理时不被覆盖的变量
    let projectIndex; // 存储当前项目的索引
    let taskIndex; // 存储当前任务的索引

    document.addEventListener('click', (event) => {
      const { target } = event; // 获取触发事件的目标元素
      const modalMainTitle = document.querySelector('.modal-main-title'); // 获取模态框标题元素
      const selectedLink = document.querySelector('.selected-link'); // 获取当前选中的链接
      const linkIndex = parseInt(target.getAttribute('data-link-index'), 10); // 获取链接的索引

      // 切换侧边菜单
      if (
        target.classList.contains('toggle-menu') ||
        target.classList.contains('burger-line')
      ) {
        dom.toggleMenu(); // 调用函数切换菜单显示
      }

      // 设置点击的链接样式
      if (target.classList.contains('select')) {
        dom.selectLink(target, linkIndex); // 选择链接
        dom.changeMainTitle(target, linkIndex); // 根据选中的链接标题更新主内容的标题
      }

      // 显示添加项目的模态框
      if (target.classList.contains('add-project')) {
        dom.manipulateModal('show', 'Add Project', 'Add'); // 打开添加项目的模态框

      // 处理项目的编辑和删除
      } else if (target.classList.contains('project-icon')) {
        projectIndex = parseInt(target.getAttribute('data-link-index'), 10); // 获取项目索引

        // 打开编辑项目的模态框
        if (target.classList.contains('edit-project')) {
          dom.manipulateModal('show', 'Edit Project', 'Edit', projectIndex);

        // 打开删除项目的模态框
        } else if (target.classList.contains('delete-project')) {
          dom.manipulateModal('show', 'Delete Project', 'Delete', projectIndex);
        }
      }

      // 处理任务的编辑、删除和查看信息
      if (target.classList.contains('task-icon')) {
        projectIndex = parseInt(target.getAttribute('data-project-index'), 10); // 获取项目索引
        taskIndex = parseInt(target.getAttribute('data-task-index'), 10); // 获取任务索引

        // 打开添加任务的模态框
        if (target.classList.contains('add-task')) {
          dom.manipulateModal('show', 'Add Task', 'Add');

        // 打开编辑任务的模态框
        } else if (target.classList.contains('edit-task')) {
          dom.manipulateModal('show', 'Edit Task', 'Edit', projectIndex, taskIndex);

        // 打开删除任务的模态框
        } else if (target.classList.contains('delete-task')) {
          dom.manipulateModal('show', 'Delete Task', 'Delete', projectIndex, taskIndex);

        // 打开任务信息的模态框
        } else if (target.classList.contains('fa-info-circle')) {
          dom.manipulateModal('show', 'Task Info', '', projectIndex, taskIndex);
        }
      }

      // 验证模态框的操作
      if (target.classList.contains('confirm-modal')) {

        // 验证添加操作
        if (target.textContent === 'Add') {
          projectIndex = parseInt(selectedLink.getAttribute('data-link-index'), 10);
          dom.validateModal('add', projectIndex, '', selectedLink);

        // 验证编辑操作
        } else if (target.textContent === 'Edit') {
          // 编辑项目
          if (modalMainTitle.textContent === 'Edit Project') {
            dom.validateModal('edit', projectIndex, '', selectedLink);

          // 编辑任务
          } else if (modalMainTitle.textContent === 'Edit Task') {
            dom.validateModal('edit', projectIndex, taskIndex, selectedLink);
          }

        // 验证删除操作
        } else if (target.textContent === 'Delete') {
          const projectDeletionText = document.querySelector('.project-deletion-text'); // 获取项目删除提示文本

          // 删除项目
          if (!projectDeletionText.classList.contains('hide')) {
            projectIndex = parseInt(selectedLink.getAttribute('data-link-index'), 10);
            dom.validateModal('delete', projectIndex, '', selectedLink);
            dom.changeMainTitle(target, 0); // 删除项目后将图标改为 'fa-calendar-alt'
            dom.showMainTitle(0); // 删除项目后主标题显示为 'All'
            dom.getTasks('all'); // 删除项目后显示所有剩余项目的任务

          // 删除任务
          } else if (projectDeletionText.classList.contains('hide')) {
            dom.validateModal('delete', projectIndex, taskIndex, selectedLink);
          }
        }
      }

      // 关闭模态框
      if (target.classList.contains('close')) {
        dom.manipulateModal('close'); // 调用函数关闭模态框
      }

      // 标记任务为已完成
      if (target.classList.contains('task-div') ||
        target.classList.contains('fa-circle') ||
        target.classList.contains('fa-check-circle') ||
        target.classList.contains('task-text')
      ) {
        projectIndex = parseInt(target.getAttribute('data-project-index'), 10); // 获取项目索引
        taskIndex = parseInt(target.getAttribute('data-task-index'), 10); // 获取任务索引
        tasks.toggleTaskCompletion(projectIndex, taskIndex, selectedLink); // 切换任务完成状态
      }
    });
  }

  return {
    resizeWindow, // 返回窗口调整函数
    listenClicks, // 返回点击事件监听函数
  };
})();

export default handlers; // 导出 handlers 模块
