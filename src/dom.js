import { format, parseISO, differenceInDays } from 'date-fns';//轻量级的 JavaScript 日期处理库
import projects from './projects';//导入项目管理模块
import tasks from './tasks';//导入任务管理模块


const dom = (() => {
  //获取dom元素
  const toggleMenuIcon = document.querySelector('.toggle-menu');
  const sidebarMenu = document.querySelector('#sidebar-menu');
  const modal = document.querySelector('#modal');
  const form = modal.querySelector('#form');
  const modalTitle = modal.querySelector('#modal-title');
  const modalTitleError = modal.querySelector('.modal-title-error');
  const mainContent = document.querySelector('#main');
  const mainTitleIcon = document.querySelector('.main-title-icon');
  const mainTitleText = document.querySelector('.main-title-text');
  const projectsLinksDiv = document.querySelector('.projects-links-div');
  const addTaskButton = document.querySelector('.add-task');
  const tasksCount = document.querySelector('.tasks-count');
  const tasksList = document.querySelector('.tasks-list');
  const taskDescription = modal.querySelector('.task-description');
  const taskDueDate = modal.querySelector('#dueDate');
  const taskPrioritySelection = modal.querySelector('.task-priority');

  //响应式菜单
  function responsiveMenu() {
    if (window.innerWidth <= 1000) {
      toggleMenuIcon.classList.remove('active');

      // 将侧边栏的显示状态改为不可见
      sidebarMenu.classList.remove('show-sidebar');
      sidebarMenu.classList.add('hide-sidebar');
      sidebarMenu.classList.add('add-z-index');

      // 扩展主内容
      mainContent.classList.remove('contract-main');
      mainContent.classList.add('expand-main');

    } else {
      // 显示侧边栏使其稍微透明
      sidebarMenu.classList.remove('hide-sidebar');
      sidebarMenu.classList.add('show-sidebar');
      sidebarMenu.classList.remove('add-z-index');

      // 收缩主内容使其不透明
      mainContent.classList.remove('expand-main');
      mainContent.classList.add('contract-main');
      mainContent.classList.remove('inactive-main');
    }
  }

  //切换菜单
  function toggleMenu() {
    toggleMenuIcon.classList.toggle('active');

    // 显示侧边栏使其主内容稍微透明
    if (sidebarMenu.classList.contains('hide-sidebar')) {
      sidebarMenu.classList.remove('hide-sidebar');
      sidebarMenu.classList.add('show-sidebar');
      mainContent.classList.add('inactive-main');

      // 隐藏侧边栏使其主内容不透明
    } else if (sidebarMenu.classList.contains('show-sidebar')) {
      sidebarMenu.classList.remove('show-sidebar');
      sidebarMenu.classList.add('hide-sidebar');
      mainContent.classList.remove('inactive-main');
    }
  }

  // 据索引设置菜单图标和文本，并更新页面标题。
  function showMainTitle(index) {
    const allMenuIcons = document.querySelectorAll('.menu-link-icon');//选择所有菜单图标元素
    const menuIcon = allMenuIcons[index].getAttribute('data-icon');//获取指定索引的菜单图标的data-icon值
    const menuTexts = document.querySelectorAll('.menu-link-text');//选择所有菜单文本元素

    //设置主题图标和文本
    mainTitleIcon.classList.add(
      'fal',//添加font Awesom样式类
      'fa-fw',//添加固定宽度样式类
      'main-title-icon',//添加自定义样式类
      'padding-right',//添加右侧内边距样式类
      menuIcon//添加从菜单图标获取的类名
    );
    //设置主标题文本为对应菜单文本
    mainTitleText.textContent = menuTexts[index].textContent;
    document.title = `ToDo - ${mainTitleText.textContent}`;//更新页面标题
  }

  //根据目标元素的类型更改主标题，支持菜单和项目的不同情况。
  function changeMainTitle(target, index) {
    mainTitleIcon.className = '';//清空主题图标类名

    // 从菜单更改任务标题
    if (
      target.classList.contains('menu-link') ||//如果目标是菜单链接
      target.classList.contains('menu-link-icon') ||//或菜单图标
      target.classList.contains('menu-link-text')//或菜单文本
    ) {
      showMainTitle(index);
    }

    // TITLE OF TASKS FROM PROJECTS
    if (
      target.classList.contains('project-link') ||
      target.classList.contains('project-icon') ||
      target.classList.contains('project-text') ||
      target.classList.contains('delete-project') ||
      target.classList.contains('edit-project') ||
      target.classList.contains('project-icon-and-text-div') ||
      target.classList.contains('project-default-icons-div')
    ) {
      const projectIcon = projects.projectsList[index].icon;

      mainTitleIcon.classList.add(
        'fal',
        'fa-fw',
        'main-title-icon',
        'padding-right',
        projectIcon
      );
      mainTitleText.textContent = projects.projectsList[index].title;
      document.title = `ToDo - ${mainTitleText.textContent}`;
    }
  }

  //查看任务信息的函数
  function watchTaskInfo(projectIndex, taskIndex) {
    //获取任务信息的dom元素
    const infoTaskTitle = document.querySelector('.info-task-title');
    const infoTaskDescription = document.querySelector('.info-task-description');
    const infoTaskDueDate = document.querySelector('.info-task-due-date');
    const infoTaskPriority = document.querySelector('.info-task-priority');
    const infoTaskProject = document.querySelector('.info-task-project');

    // 设置任务标题
    infoTaskTitle.textContent =
      projects.projectsList[projectIndex].tasks[taskIndex].title;

    // 设置任务描述
    infoTaskDescription.textContent =
      projects.projectsList[projectIndex].tasks[taskIndex].description;

    // 设置任务截至日期
    infoTaskDueDate.textContent =
      projects.projectsList[projectIndex].tasks[taskIndex].date;

    // 设置任务优先级
    if (
      projects.projectsList[projectIndex].tasks[taskIndex].priority === 'low'
    ) {
      infoTaskPriority.textContent = 'I can do it later or never at all.. 😴';
    } else if (
      projects.projectsList[projectIndex].tasks[taskIndex].priority === 'medium'
    ) {
      infoTaskPriority.textContent = 'I stay somewhere between relaxation and focus 😅';
    } else if (
      projects.projectsList[projectIndex].tasks[taskIndex].priority === 'high'
    ) {
      infoTaskPriority.textContent = 'I must do it - sooner or later! 😲';
    } else {
      infoTaskPriority.textContent = '';
    }

    // 设置任务所属项目
    infoTaskProject.textContent = projects.projectsList[projectIndex].title;
  }

  //操作模态框的函数
  function manipulateModal(modalState, modalTask, modalAction, projectIndex, taskIndex) {
    //获取模态框内部元素
    const modalHeader = modal.querySelector('.modal-header');
    const modalMainTitle = modal.querySelector('.modal-main-title');
    const modalTaskButton = modal.querySelector('.modal-task-button');
    const projectDeletionText = modal.querySelector('.project-deletion-text');
    const taskDeletionText = modal.querySelector('.task-deletion-text');
    const taskInfoDiv = modal.querySelector('.info-div');
    const confirmButton = modal.querySelector('.confirm-modal');
    const cancelButton = modal.querySelector('.cancel-modal');

    //重置模态框样式
    modalHeader.classList.remove('deletion-modal-header');
    form.reset();
    form.classList.remove('hide');
    taskInfoDiv.classList.add('hide');
    modalTitleError.classList.add('hide');
    projectDeletionText.classList.add('hide');
    taskDeletionText.classList.add('hide');
    cancelButton.classList.remove('cancel-deletion');
    confirmButton.classList.remove('confirm-deletion', 'hide');

    //显示模态框
    if (modalState === 'show') {
      const modalIconsDiv = modal.querySelector('.radio-form');
      const modalTasksDiv = modal.querySelector('.modal-tasks-div');

      modal.classList.remove('hide');
      modalMainTitle.textContent = modalTask;
      modalTaskButton.textContent = modalAction;
      modalIconsDiv.classList.remove('hide');
      modalIconsDiv.classList.add('show');
      modalTasksDiv.classList.add('hide');

      // 如果是编辑项目
      if (modalTask === 'Edit Project') {
        const allProjectIcons = modal.querySelectorAll('.icon');
        const projectIcon = projects.projectsList[projectIndex].icon;

        // 显示可编辑的项目标题
        modalTitle.value = projects.projectsList[projectIndex].title;

        // 选择可编辑的项目图标
        for (let i = 0; i < allProjectIcons.length; i += 1) {
          if (allProjectIcons[i].value === projectIcon) {
            allProjectIcons[i].checked = true;
          }
        }

      // 如果是添加或编辑任务
      } else if (modalTask === 'Add Task'||
          modalTask === 'Edit Task'
      ) {
        modalIconsDiv.classList.remove('show');
        modalIconsDiv.classList.add('hide');
        modalTasksDiv.classList.remove('hide');

        //如果是编辑任务
        if (modalTask === 'Edit Task') {
          modalTitle.value = projects.projectsList[projectIndex].tasks[taskIndex].title;
          taskDescription.value = projects.projectsList[projectIndex].tasks[taskIndex].description;
          taskDueDate.value = projects.projectsList[projectIndex].tasks[taskIndex].date;
          taskPrioritySelection.value = projects.projectsList[projectIndex].tasks[taskIndex].priority;
        }

        // 如果是查看任务信息
      } else if (modalTask === 'Task Info') {
        form.classList.add('hide');
        confirmButton.classList.add('hide');
        taskInfoDiv.classList.remove('hide');
        watchTaskInfo(projectIndex, taskIndex);
      }
    }

    // 删除模态框的内容
    if (modalAction === 'Delete') {
      modalHeader.classList.add('deletion-modal-header');
      form.classList.add('hide');
      cancelButton.classList.add('cancel-deletion');
      confirmButton.classList.add('confirm-deletion');

      // 项目删除
      if (modalTask === 'Delete Project') {
        const projectDeletionTitle = document.querySelector('.project-deletion-title');

        projectDeletionText.classList.remove('hide');
        projectDeletionTitle.textContent = projects.projectsList[projectIndex].title;

        // 任务删除
      } else if (modalTask === 'Delete Task') {
        const taskDeletionTitle = document.querySelector('.task-deletion-title');

        taskDeletionText.classList.remove('hide');
        taskDeletionTitle.textContent =
          projects.projectsList[projectIndex].tasks[taskIndex].title;
      }
    }

    // 关闭模态框
    if (modalState === 'close') {
      modal.classList.add('hide');
    }
  }

  //显示任务的函数
  function showTasks(menuTitle, projectIndexStart, projectIndexEnd) {
    const todayDate = format(new Date(), 'yyyy-MM-dd');//获取今天日期
    let tasksNumber = 0;//任务数量初始化

    tasksCount.textContent = 0;//初始化任务计数
    tasksList.textContent = '';//任务列表清空

    // 生成任务列表
    for (let i = projectIndexStart; i < projectIndexEnd; i += 1) {
      for (let j = 0; j < projects.projectsList[i].tasks.length; j += 1) {
        const taskDiv = document.createElement('div');
        const taskIconAndTextDiv = document.createElement('div');
        const taskIcon = document.createElement('i');
        const taskText = document.createElement('p');
        const taskInfo = document.createElement('div');
        const taskDate = document.createElement('p');
        const taskEditIcon = document.createElement('i');
        const taskTrashIcon = document.createElement('i');
        const taskInfoIcon = document.createElement('i');

        // 如果点击了红药菜单链接，过略不重要的任务
        if (
          menuTitle === 'important' &&
          projects.projectsList[i].tasks[j].priority !== 'high'
        ) {
          continue; // 如果任务不是重要的，跳过

          // 如果点击了今天菜单链接
        } else if (menuTitle === 'today') {

          if (projects.projectsList[i].tasks[j].date !== todayDate
          ) {
            continue; // 跳过不是今天截止的任务
          }

          // 如果点击了本周菜单链接
        } else if (menuTitle === 'week') {
          const dateOfToday = parseISO(todayDate);
          const dateOfTask = parseISO(projects.projectsList[i].tasks[j].date)

          if (!(differenceInDays(dateOfTask, dateOfToday) <= 7 &&
             differenceInDays(dateOfTask, dateOfToday) >= 0
          )) {
           continue; // 任务不是本周到期的，跳过
          }

          // 如果点击了已完成链接
        } else if (menuTitle === 'completed' &&
          projects.projectsList[i].tasks[j].completed !== true
        ) {
          continue; // 跳过还没完成的任务
        }

        // 显示任务数量
        tasksNumber += 1;
        tasksCount.textContent = tasksNumber;

        // 设置任务的文本、优先级和其div
        taskDiv.classList.add('task-div', 'hover-element');
        taskIconAndTextDiv.classList.add('flex');
        taskDiv.setAttribute('data-project-index', i);
        taskDiv.setAttribute('data-task-index', j);

        //根据任务优先级设置图标样式
        if (projects.projectsList[i].tasks[j].priority === 'low') {
          taskIcon.classList.add('low-priority');
        } else if (projects.projectsList[i].tasks[j].priority === 'medium') {
          taskIcon.classList.add('mid-priority');
        } else if (projects.projectsList[i].tasks[j].priority === 'high') {
          taskIcon.classList.add('high-priority');
        } else {
          taskIcon.classList.add('fal', 'padding-right');
        }
        taskIcon.setAttribute('data-project-index', i);
        taskIcon.setAttribute('data-task-index', j);

        //设置任务文本
        taskText.classList.add('task-text');
        taskText.textContent = projects.projectsList[i].tasks[j].title;
        taskText.setAttribute('data-project-index', i);
        taskText.setAttribute('data-task-index', j);

        // 设置任务信息div
        taskInfo.classList.add('flex');

        // 设置任务到期日期
        taskDate.classList.add('due-date', 'padding-right');
        if (projects.projectsList[i].tasks[j].date !== undefined) {
          taskDate.textContent = projects.projectsList[i].tasks[j].date;
        } else {
          taskDate.textContent = '';
        }

        // 设置任务编辑图标
        taskEditIcon.classList.add(
          'fal',
          'fa-edit',
          'edit-task',
          'task-icon',
          'scale-element',
          'padding-right'
        );
        taskEditIcon.setAttribute('data-project-index', i);
        taskEditIcon.setAttribute('data-task-index', j);

        // 设置任务删除图标
        taskTrashIcon.classList.add(
          'fal',
          'fa-trash-alt',
          'delete-task',
          'task-icon',
          'scale-element',
          'padding-right'
        );
        taskTrashIcon.setAttribute('data-project-index', i);
        taskTrashIcon.setAttribute('data-task-index', j);

        // 设置任务信息图标
        taskInfoIcon.classList.add(
          'fal',
          'task-icon',
          'scale-element',
          'fa-info-circle'
        );
        taskInfoIcon.setAttribute('data-project-index', i);
        taskInfoIcon.setAttribute('data-task-index', j);

        // 将元素附加到任务div
        taskIconAndTextDiv.appendChild(taskIcon);
        taskIconAndTextDiv.appendChild(taskText);
        taskInfo.appendChild(taskDate);
        taskInfo.appendChild(taskEditIcon);
        taskInfo.appendChild(taskTrashIcon);
        taskInfo.appendChild(taskInfoIcon);
        taskDiv.appendChild(taskIconAndTextDiv);
        taskDiv.appendChild(taskInfo);
        tasksList.appendChild(taskDiv);

        // 设置任务完成状态
        if (projects.projectsList[i].tasks[j].completed === false) {
          taskText.classList.remove('task-done-text');
          taskIcon.classList.add(
            'fal',
            'fa-circle',
            'padding-right'
          );
        } else {
          taskText.classList.add('task-done-text');
          taskIcon.classList.add(
            'fal',
            'fa-check-circle',
            'padding-right'
          );
        }
      }
    }
    //关闭模态框
    manipulateModal('close');
  }

  //获取任务的函数
  function getTasks(menuTitle, projectIndex) {
    let projectIndexStart;//项目开始索引
    let projectIndexEnd;//项目结束索引

    // 将带有任务的项目保存到本地
    localStorage.setItem('projects', JSON.stringify(projects.projectsList));

    // 如果点击了项目链接
    if (menuTitle === 'project') {
      //确保在用户点击某个项目时，仅显示该项目下的任务，而不是显示所有项目的任务。
      projectIndexStart = projectIndex;
      projectIndexEnd = projectIndex + 1;

      // 如果项目没用任何任务
      if (projects.projectsList[projectIndex].tasks.length === 0) {
        tasksCount.textContent = 0;
      }

      // 如果点击了菜单链接
    } else {
      projectIndexStart = 0;//从第一个任务开始
      projectIndexEnd = projects.projectsList.length;//到项目列表的最后一个项目
    }
    showTasks(menuTitle, projectIndexStart, projectIndexEnd);//显示任务
  }

  function selectLink(target, index, action) {
    //获取所有链接元素
    const allLinks = document.querySelectorAll('.link');
    //获取所有项目链接
    const allProjectsLinks = document.querySelectorAll('.project-link');
    //获取点击目标的标题属性
    const menuTitle = target.getAttribute('data-title');

    //默认隐藏添加任务按钮
    addTaskButton.classList.add('hide'); // By default 'Add Task' button is hidden

    //移除所有链接的选中状态
    allLinks.forEach((link) => {
      link.classList.remove('selected-link');
    });

    // 如果点击的是链接（菜单或项目）
    if (target.classList.contains('link')) {
      //给当前链接添加选中状态
      target.classList.add('selected-link');

      // 如果点击的是编辑项目链接
      if (action === 'edit') {
        allProjectsLinks[index].classList.add('selected-link'); // 保持编辑后的项目链接被选中
      }

      // 如果点击的是菜单链接的图标或文本
    } else if (
      target.classList.contains('menu-link-icon') ||
      target.classList.contains('menu-link-text')
    ) {
      target.parentElement.classList.add('selected-link');//将父元素链接标记为选中
    }

    // 如果点击的是某个项目链接
    if (target.classList.contains('project')) {
      addTaskButton.classList.remove('hide'); // 显示添加任务按钮
      getTasks('project', index);//获取该项目任务

      // 如果点击的是项目的图标、文本或编辑/删除图标
      if (
        target.classList.contains('project-icon') ||
        target.classList.contains('project-text') ||
        target.classList.contains('edit-project') ||
        target.classList.contains('delete-project')
      ) {
        target.parentElement.parentElement.classList.add('selected-link');//将项目的父链接标记为选中

        // 如果点击的是项目元素的div
      } else if (
        target.classList.contains('project-icon-and-text-div') ||
        target.classList.contains('project-default-icons-div')
      ) {
        target.parentElement.classList.add('selected-link');//标记为选中
      }
    }

    // 如果点击的是菜单链接
    if (
      target.classList.contains('menu-link') ||
      target.classList.contains('menu-link-icon') ||
      target.classList.contains('menu-link-text')
    ) {
      getTasks(menuTitle);//根据菜单标题获取任务
    }
  }

  //确保用户在模态框中进行的操作会正确反映到数据模型和用户界面上
  function validateModal(modalAction, projectIndex, taskIndex, clickedLink) {
    const { projectFormIcon } = document.forms.form;//获取表单中的项目图标
    const projectDomIcon = projectFormIcon.value;//获取选中的项目图标值
    const projectIconsDiv = modal.querySelector('.radio-form');//获取图标选择区域
    const modalTitleText = modalTitle.value;//获取模态框标题文本
    const projectDeletionText = document.querySelector('.project-deletion-text');//获取项目删除提示文本
    const menuLinkAll = document.querySelector('.link:first-child');//获取菜单第一个链接
    let taskPriority;//用于存储任务优先级

    // 检查模态框标题是否为空
    if (!form.classList.contains('hide') &&
        modalTitleText === ''
    ) {
      modalTitleError.classList.remove('hide');//显示标题错误
      modalTitleError.classList.add('show');//错误信息可见

      // 添加项目到数组
    } else if (
      modalAction === 'add' &&
      projectIconsDiv.classList.contains('show')
    ) {
      projects.addProject(projectDomIcon, modalTitleText);//添加项目
      mainContent.classList.remove('inactive-main');//显示主内容

      // 使新添加项目保持选中状态
      const lastProject = projectsLinksDiv.lastChild;//获取最后添加的项目
      const lastProjectIndex = projectsLinksDiv.lastChild.getAttribute('data-link-index');//获取其索引

      selectLink(lastProject, lastProjectIndex);//选择该项目
      changeMainTitle(lastProject, lastProjectIndex);//更新主标题

    } // 编辑项目
      else if (modalAction === 'edit' &&
        projectIconsDiv.classList.contains('show')
    ) {
      const allProjectsLinks = document.querySelectorAll('.project-link');//获取所有项目链接
      const editedProject = allProjectsLinks[projectIndex];//获取被编辑的项目

      projects.editProject(projectDomIcon, modalTitleText, projectIndex, clickedLink);//编辑项目
      changeMainTitle(editedProject, projectIndex);//更新主标题

      // 删除项目
    } else if (
      modalAction === 'delete' &&
      !projectDeletionText.classList.contains('hide')
    ) {
      projects.deleteProject(projectIndex);//从项目数组中删除元素
      menuLinkAll.classList.add('selected-link');//选择第一个菜单元素
      addTaskButton.classList.add('hide');//隐藏添加任务按钮

      // 添加任务到数组
    } else if (
      modalAction === 'add' &&
      projectIconsDiv.classList.contains('hide')
    ) {

      // 检查任务优先级
      if (taskPrioritySelection.value === 'low') {
        taskPriority = 'low';
      } else if (taskPrioritySelection.value === 'medium') {
        taskPriority = 'medium';
      } else if (taskPrioritySelection.value === 'high') {
        taskPriority = 'high';
      } else {
        taskPriority = '';
      }

      //添加任务
      tasks.addTask(
        modalTitleText,
        taskDescription.value,
        taskDueDate.value,
        taskPriority,
        projectIndex
      );

      // 编辑或删除任务
    } else if (modalAction === 'edit' ||
      modalAction === 'delete') {
      let menuTitle;

      // 如果任务从菜链接中编辑或删除
      if (clickedLink.classList.contains('menu-link')) {
        menuTitle = clickedLink.getAttribute('data-title');//获取菜单标题

        // 如果任务从项目链接中编辑或删除
      } else if (clickedLink.classList.contains('project-link')) {
        menuTitle = 'project';//设置为项目
      }

      // 编辑任务
      if (modalAction === 'edit') {
        const taskNewTitle = modalTitle.value;//获取新的任务标题
        const taskNewDescription = taskDescription.value;//获取新的任务描述
        const taskNewDate = taskDueDate.value;//获取新的任务截止日期
        const taskNewPriority = taskPrioritySelection.value;//获取新的任务优先级

        //编辑任务
        tasks.editTask(
          taskNewTitle,
          taskNewDescription,
          taskNewDate,
          taskNewPriority,
          projectIndex,
          taskIndex
        );

        // 删除任务
      } else if (modalAction === 'delete') {
        tasks.deleteTask(projectIndex, taskIndex);//从任务数组中删除任务
      }
      getTasks(menuTitle, projectIndex);//根据菜单标题获取任务
    }
  }

  //在用户界面上显示项目列表，并更新项目数量。
  function showProjects() {
    const projectsCount = document.querySelector('.projects-count');//获取显示项目数量的元素

    // 将项目列表保存在本地储存中
    localStorage.setItem('projects', JSON.stringify(projects.projectsList));

    // 显示当前项目的数量
    projectsCount.textContent = projects.projectsList.length;//更新项目数量文本
    projectsLinksDiv.textContent = '';//清空当前项目链接容器

    //遍历项目列表，创建项目链接
    for (let i = 0; i < projects.projectsList.length; i += 1) {
            const projectLink = document.createElement('a'); // 创建项目链接
        const projectIconAndTextDiv = document.createElement('div'); // 创建包含图标和文本的 div
        const projectIcon = document.createElement('i'); // 创建项目图标元素
        const projectText = document.createElement('p'); // 创建项目标题文本元素
        const projectIconsDiv = document.createElement('div'); // 创建包含编辑和删除图标的 div
        const projectEditIcon = document.createElement('i'); // 创建编辑图标元素
        const projectTrashIcon = document.createElement('i'); // 创建删除图标元素

      // PROJECT ICON/TEXT AND DEFAULT ICONS DIVS
      projectIconAndTextDiv.classList.add(
        'project-icon-and-text-div',
        'project',
        'select'
      );
      projectIconAndTextDiv.setAttribute('data-link-index', i);
      projectIconsDiv.classList.add(
        'project-default-icons-div',
        'project',
        'select'
      );
      projectIconsDiv.setAttribute('data-link-index', i);

      // PROJECT LINK
      projectLink.classList.add('link', 'project-link', 'project', 'select');
      projectLink.setAttribute('href', '#');
      projectLink.setAttribute('data-link-index', i);

      // PROJECT ICON
      projectIcon.classList.add(
        'fal',
        'fa-fw',
        'project-icon',
        'project',
        'select',
        'padding-right',
        projects.projectsList[i].icon
      );
      projectIcon.setAttribute('data-link-index', i);

      // PROJECT TEXT
      projectText.classList.add('project-text', 'project', 'select');
      projectText.textContent = projects.projectsList[i].title;
      projectText.setAttribute('data-link-index', i);

      // PROJECT DEFAULT ICONS
      projectEditIcon.classList.add(
        'fal',
        'fa-edit',
        'project',
        'project-icon',
        'edit-project',
        'select',
        'scale-element',
        'padding-right'
      );
      projectEditIcon.setAttribute('data-link-index', i);

      projectTrashIcon.classList.add(
        'fal',
        'fa-trash-alt',
        'project',
        'project-icon',
        'delete-project',
        'select',
        'scale-element'
      );
      projectTrashIcon.setAttribute('data-link-index', i);

      // APPENDS
      projectIconsDiv.appendChild(projectEditIcon);
      projectIconsDiv.appendChild(projectTrashIcon);
      projectIconAndTextDiv.appendChild(projectIcon);
      projectIconAndTextDiv.appendChild(projectText);
      projectLink.appendChild(projectIconAndTextDiv);
      projectLink.appendChild(projectIconsDiv);
      projectsLinksDiv.appendChild(projectLink);
    }
    manipulateModal('close');
  }

  return {
    //调整侧边菜单的样式，以适应窗口大小变化。
responsiveMenu,

// 切换侧边菜单的显示和隐藏状态。
toggleMenu,

// 显示主标题，根据传入的索引更新标题内容。
showMainTitle,

// 更改主标题，更新显示的标题文本。
changeMainTitle,

// 控制模态框的显示或关闭，并根据需要更新标题和内容。
manipulateModal,

// 显示与特定项目相关的任务。
showTasks,

// 获取并展示指定项目或所有项目的任务。
getTasks,

// 高亮选中的链接，并更新相关信息。
selectLink,

// 验证模态框中的输入，并执行添加、编辑或删除项目/任务的操作。
validateModal,

// 显示项目列表，并更新项目计数。
showProjects

  };
})();

export default dom;
