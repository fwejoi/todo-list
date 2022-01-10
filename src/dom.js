import projects from './projects';
import tasks from './tasks';

const dom = (() => {
  const toggleMenuIcon = document.querySelector('.toggle-menu');
  const sidebarMenu = document.querySelector('#sidebar-menu');
  const mainContent = document.querySelector('#main');
  const modal = document.querySelector('#modal');
  const form = document.querySelector('#form');
  const modalTitle = document.querySelector('#modal-title');
  const modalTitleError = document.querySelector('.modal-title-error');
  const mainTitleIcon = document.querySelector('.main-title-icon');
  const mainTitleText = document.querySelector('.main-title-text');
  const tasksCount = document.querySelector('.tasks-count');

  function responsiveMenu() {
    if (window.innerWidth <= 1000) {
      toggleMenuIcon.classList.remove('active');

      // HIDE SIDEBAR AND MAKE IT OPAQUE
      sidebarMenu.classList.remove('show-sidebar');
      sidebarMenu.classList.add('hide-sidebar');
      sidebarMenu.classList.add('add-z-index');

      // EXPAND MAIN CONTENT
      mainContent.classList.remove('contract-main');
      mainContent.classList.add('expand-main');
    } else {
      // SHOW SIDEBAR AND MAKE IT A BIT TRANSPARENT
      sidebarMenu.classList.remove('hide-sidebar');
      sidebarMenu.classList.add('show-sidebar');
      sidebarMenu.classList.remove('add-z-index');

      // CONTRACT MAIN CONTENT AND MAKE IT OPAQUE
      mainContent.classList.remove('expand-main');
      mainContent.classList.add('contract-main');
      mainContent.classList.remove('inactive-main');
    }
  }

  function toggleMenu() {
    toggleMenuIcon.classList.toggle('active');

    // SHOW SIDEBAR AND MAKE MAIN CONTENT A BIT TRANSPARENT
    if (sidebarMenu.classList.contains('hide-sidebar')) {
      sidebarMenu.classList.remove('hide-sidebar');
      sidebarMenu.classList.add('show-sidebar');
      mainContent.classList.add('inactive-main');

      // HIDE SIDEBAR AND MAKE MAIN CONTENT OPAQUE
    } else if (sidebarMenu.classList.contains('show-sidebar')) {
      sidebarMenu.classList.remove('show-sidebar');
      sidebarMenu.classList.add('hide-sidebar');
      mainContent.classList.remove('inactive-main');
    }
  }

  function watchTaskInfo(projectIndex, taskIndex) {
    const infoTaskTitle = document.querySelector('.info-task-title');
    const infoTaskDescription = document.querySelector(
      '.info-task-description'
    );
    const infoTaskDueDate = document.querySelector('.info-task-due-date');
    const infoTaskPriority = document.querySelector('.info-task-priority');
    const infoTaskProject = document.querySelector('.info-task-project');

    // TASK TITLE
    infoTaskTitle.textContent = `${projects.projectsList[projectIndex].tasks[taskIndex].title}`;

    // TASK DESCRIPTION
    infoTaskDescription.textContent = `${projects.projectsList[projectIndex].tasks[taskIndex].description}`;

    // TASK DUE DATE
    infoTaskDueDate.textContent = `${projects.projectsList[projectIndex].tasks[taskIndex].date}`;

    // TASK PRIORITY
    if (
      projects.projectsList[projectIndex].tasks[taskIndex].priority === 'low'
    ) {
      infoTaskPriority.textContent =
        'LOW - It can wait for a month or two.. 😴';
    } else if (
      projects.projectsList[projectIndex].tasks[taskIndex].priority === 'medium'
    ) {
      infoTaskPriority.textContent =
        'MEDIUM - Somewhere between Relax & Focus 😅';
    } else if (
      projects.projectsList[projectIndex].tasks[taskIndex].priority === 'high'
    ) {
      infoTaskPriority.textContent = 'HIGH - Now or never! 😲';
    } else {
      infoTaskPriority.textContent = '';
    }

    // TASK PROJECT
    infoTaskProject.textContent = projects.projectsList[projectIndex].title;
  }

  function manipulateModal(state, title, task, projectIndex, taskIndex) {
    const modalHeader = modal.querySelector('.modal-header');
    const modalMainTitle = modal.querySelector('.modal-main-title');
    const modalTaskButton = modal.querySelector('.modal-task-button');
    const projectDeletionText = modal.querySelector('.project-deletion-text');
    const taskDeletionText = modal.querySelector('.task-deletion-text');
    const taskInfoDiv = modal.querySelector('.info-div');
    const confirmButton = modal.querySelector('.confirm-modal');
    const cancelButton = modal.querySelector('.cancel-modal');

    modalHeader.classList.remove('deletion-modal-header');
    form.reset();
    form.classList.remove('hide');
    taskInfoDiv.classList.add('hide');
    modalTitleError.classList.add('hide');
    projectDeletionText.classList.add('hide');
    taskDeletionText.classList.add('hide');
    cancelButton.classList.remove('cancel-deletion');
    confirmButton.classList.remove('confirm-deletion', 'hide');

    if (state === 'show') {
      const modalIconsDiv = modal.querySelector('.radio-form');
      const modalTasksDiv = modal.querySelector('.modal-tasks-div');

      modal.classList.remove('hide');
      modalMainTitle.textContent = title;
      modalTaskButton.textContent = task;
      modalIconsDiv.classList.remove('hide');
      modalIconsDiv.classList.add('show');
      modalTasksDiv.classList.add('hide');

      // IF MODAL IS FOR ADDING A TASK
      if (title === 'Add Task') {
        modalIconsDiv.classList.remove('show');
        modalIconsDiv.classList.add('hide');
        modalTasksDiv.classList.remove('hide');

        // IF MODAL IS FOR WATCHING TASK INFO
      } else if (title === 'Task Info') {
        form.classList.add('hide');
        confirmButton.classList.add('hide');
        taskInfoDiv.classList.remove('hide');

        watchTaskInfo(projectIndex, taskIndex);
      }

      // TO CLOSE THE MODAL
    } else if (state === 'close') {
      modal.classList.add('hide');
    }

    // DELETION MODAL CONTENT
    if (task === 'Delete') {
      modalHeader.classList.add('deletion-modal-header');
      form.classList.add('hide');
      cancelButton.classList.add('cancel-deletion');
      confirmButton.classList.add('confirm-deletion');

      // PROJECT DELETION
      if (title === 'Delete Project') {
        const projectDeletionTitle = document.querySelector(
          '.project-deletion-title'
        );

        projectDeletionText.classList.remove('hide');
        projectDeletionTitle.textContent =
          projects.projectsList[projectIndex].title;

        // TASK DELETION
      } else if (title === 'Delete Task') {
        const taskDeletionTitle = document.querySelector(
          '.task-deletion-title'
        );

        taskDeletionText.classList.remove('hide');
        taskDeletionTitle.textContent =
          projects.projectsList[projectIndex].tasks[taskIndex].title;
      }
    }
  }

  function validateModal(task, index) {
    const { projectFormIcon } = document.forms.form;
    const projectDomIcon = projectFormIcon.value;
    const projectIconsDiv = modal.querySelector('.radio-form');
    const modalTitleText = modalTitle.value;

    if (task === 'add' || task === 'edit') {
      if (modalTitleText === '') {
        modalTitleError.classList.remove('hide');
        modalTitleError.classList.add('show');

        // ADD A PROJECT TO ARRAY
      } else if (task === 'add' && projectIconsDiv.classList.contains('show')) {
        projects.addProject(projectDomIcon, modalTitleText);

        // EDIT A PROJECT FROM ARRAY
      } else if (task === 'edit') {
        projects.editProject(projectDomIcon, modalTitleText, index);

        // ADD A TASK TO ARRAY
      } else if (task === 'add' && projectIconsDiv.classList.contains('hide')) {
        const selectedLink = document.querySelector('.selected-link');
        const selectedProject = selectedLink.getAttribute('data-index');
        const taskDescription = document.querySelector('.task-description').value;
        const taskDueDate = document.querySelector('#dueDate').value;
        const taskPrioritySelection = document.querySelector('.task-priority');
        let taskPriority = '';

        // CHECK TASK PRIORITY
        if (taskPrioritySelection.value === 'low') {
          taskPriority = 'low';
        } else if (taskPrioritySelection.value === 'medium') {
          taskPriority = 'medium';
        } else if (taskPrioritySelection.value === 'high') {
          taskPriority = 'high';
        } else {
          taskPriority = '';
        }

        tasks.addTask(
          selectedProject,
          modalTitleText,
          taskDescription,
          taskDueDate,
          taskPriority
        );
      }

      // DELETE A PROJECT FROM ARRAY
    } else if (task === 'delete') {
      projects.deleteProject(index);
    }
  }

  // MAIN CONTENT
  function showMainTitle(index) {
    const allMenuIcons = document.querySelectorAll('.menu-link-icon');
    const menuIcon = allMenuIcons[index].getAttribute('data-icon');
    const menuTexts = document.querySelectorAll('.menu-link-text');

    mainTitleIcon.classList.add(
      'fal',
      'fa-fw',
      'main-title-icon',
      'padding-right',
      menuIcon
    );
    mainTitleText.textContent = menuTexts[index].textContent;
  }

  function changeMainTitle(target, index) {
    mainTitleIcon.className = '';

    // TITLE OF TASKS FROM THE MENU
    if (
      target.classList.contains('menu-link') ||
      target.classList.contains('menu-link-icon') ||
      target.classList.contains('menu-link-text')
    ) {
      showMainTitle(index);
    }

    // TITLE OF TASKS FROM PROJECTS
    if (
      target.classList.contains('project-link') ||
      target.classList.contains('project-icon') ||
      target.classList.contains('project-text') ||
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
    }
  }

  // PROJECTS
  function editProject(index) {
    const allProjectIcons = modal.querySelectorAll('.icon');
    const projectIcon = projects.projectsList[index].icon;

    // SHOW EDITABLE PROJECT TITLE
    modalTitle.value = projects.projectsList[index].title;

    // SELECT EDITABLE PROJECT ICON
    for (let i = 0; i < allProjectIcons.length; i += 1) {
      if (allProjectIcons[i].value === projectIcon) {
        allProjectIcons[i].checked = true;
      }
    }
  }

  function showProjects() {
    const projectsCount = document.querySelector('.projects-count');
    const projectsLinks = document.querySelector('.projects-links-div');

    // SHOW NUMBER OF PROJECTS
    projectsCount.textContent = projects.projectsList.length;
    projectsLinks.textContent = '';

    for (let i = 0; i < projects.projectsList.length; i += 1) {
      const projectLink = document.createElement('a');
      const projectIconAndTextDiv = document.createElement('div');
      const projectIcon = document.createElement('i');
      const projectText = document.createElement('p');
      const projectIconsDiv = document.createElement('div');
      const projectEditIcon = document.createElement('i');
      const projectTrashIcon = document.createElement('i');

      // PROJECT ICON/TEXT AND DEFAULT ICONS DIVS
      projectIconAndTextDiv.classList.add(
        'project-icon-and-text-div',
        'project',
        'select'
      );
      projectIconAndTextDiv.setAttribute('data-index', i);
      projectIconsDiv.classList.add(
        'project-default-icons-div',
        'project',
        'select'
      );
      projectIconsDiv.setAttribute('data-index', i);

      // PROJECT LINK
      projectLink.classList.add('link', 'project-link', 'project', 'select');
      projectLink.setAttribute('href', '#');
      projectLink.setAttribute('data-index', i);

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
      projectIcon.setAttribute('data-index', i);

      // PROJECT TEXT
      projectText.classList.add('project-text', 'project', 'select');
      projectText.textContent = projects.projectsList[i].title;
      projectText.setAttribute('data-index', i);

      // PROJECT DEFAULT ICONS
      projectEditIcon.classList.add(
        'fal',
        'fa-edit',
        'project',
        'edit-project',
        'select',
        'scale-element',
        'padding-right'
      );
      projectEditIcon.setAttribute('data-index', i);
      projectTrashIcon.classList.add(
        'fal',
        'fa-trash-alt',
        'project',
        'delete-project',
        'select',
        'scale-element'
      );
      projectTrashIcon.setAttribute('data-index', i);

      // APPENDS
      projectIconsDiv.appendChild(projectEditIcon);
      projectIconsDiv.appendChild(projectTrashIcon);
      projectIconAndTextDiv.appendChild(projectIcon);
      projectIconAndTextDiv.appendChild(projectText);
      projectLink.appendChild(projectIconAndTextDiv);
      projectLink.appendChild(projectIconsDiv);
      projectsLinks.appendChild(projectLink);
    }

    manipulateModal('close');
  }

  // TASKS
  function showTasks(menuLinkText) {
    const tasksList = document.querySelector('.tasks-list');
    let tasksNumber = 0;

    tasksList.textContent = '';

    if (menuLinkText === 'All') {
      for (let i = 0; i < projects.projectsList.length; i += 1) {
        for (let j = 0; j < projects.projectsList[i].tasks.length; j += 1) {
          const taskDiv = document.createElement('div');
          const taskIconAndTextDiv = document.createElement('div');
          const taskIcon = document.createElement('i');
          const taskText = document.createElement('p');
          const taskInfo = document.createElement('div');
          const taskDueDate = document.createElement('p');
          const taskEditIcon = document.createElement('i');
          const taskTrashIcon = document.createElement('i');
          const taskInfoIcon = document.createElement('i');

          // SHOW NUMBER OF ALL TASKS FROM ALL PROJECTS
          tasksNumber += 1;
          tasksCount.textContent = tasksNumber;

          taskDiv.classList.add('task-div', 'hover-element');
          taskDiv.setAttribute('data-index', i);

          // TASK PRIORITY, TEXT AND ITS DIV
          taskIconAndTextDiv.classList.add('flex');

          if (projects.projectsList[i].tasks[j].priority === 'low') {
            taskIcon.classList.add(
              'fal',
              'fa-circle',
              'low-priority',
              'padding-right'
            );
          } else if (projects.projectsList[i].tasks[j].priority === 'medium') {
            taskIcon.classList.add(
              'fal',
              'fa-circle',
              'mid-priority',
              'padding-right'
            );
          } else if (projects.projectsList[i].tasks[j].priority === 'high') {
            taskIcon.classList.add(
              'fal',
              'fa-circle',
              'high-priority',
              'padding-right'
            );
          } else {
            taskIcon.classList.add('fal', 'fa-circle', 'padding-right');
          }

          taskText.classList.add('task-text');
          taskText.textContent = projects.projectsList[i].tasks[j].title;

          // TASK INFO DIV
          taskInfo.classList.add('flex');

          // TASKS DUE DATE
          taskDueDate.classList.add('due-date', 'padding-right');
          if (projects.projectsList[i].tasks[j].date !== undefined) {
            taskDueDate.textContent = projects.projectsList[i].tasks[j].date;
          } else {
            taskDueDate.textContent = '';
          }

          // TASK DEFAULT ICONS
          taskEditIcon.classList.add(
            'fal',
            'fa-edit',
            'edit-task',
            'scale-element',
            'padding-right'
          );
          taskEditIcon.setAttribute('data-index', i);
          taskTrashIcon.classList.add(
            'fal',
            'fa-trash-alt',
            'delete-task',
            'scale-element',
            'padding-right'
          );
          taskTrashIcon.setAttribute('data-index', i);
          taskInfoIcon.classList.add('fal', 'scale-element', 'fa-info-circle');
          taskInfoIcon.setAttribute('data-index', i);

          // APPENDS
          taskIconAndTextDiv.appendChild(taskIcon);
          taskIconAndTextDiv.appendChild(taskText);
          taskInfo.appendChild(taskDueDate);
          taskInfo.appendChild(taskEditIcon);
          taskInfo.appendChild(taskTrashIcon);
          taskInfo.appendChild(taskInfoIcon);
          taskDiv.appendChild(taskIconAndTextDiv);
          taskDiv.appendChild(taskInfo);
          tasksList.appendChild(taskDiv);
        }
      }
    }
  }

  function selectLink(target) {
    const allLinks = document.querySelectorAll('.link');
    const addTaskButton = document.querySelector('.add-task');

    addTaskButton.classList.add('hide'); // By default 'Add Task' button is hidden

    allLinks.forEach((link) => {
      link.classList.remove('selected-link');
    });

    // IF CLICKED DIRECTLY ON A LINK (BOTH - MENU OR PROJECT)
    if (target.classList.contains('link')) {
      target.classList.add('selected-link');

      // IF CLICKED ON MENU LINK ICON OR TEXT
    } else if (
      target.classList.contains('menu-link-icon') ||
      target.classList.contains('menu-link-text')
    ) {
      target.parentElement.classList.add('selected-link');
    }

    // IF CLICKED SOMEWHERE ON PROJECT LINK
    if (target.classList.contains('project')) {
      // SHOW BUTTON TO ADD A TASK FOR SELECTED PROJECT
      addTaskButton.classList.remove('hide');

      // IF CLICKED ON PROJECT ICON OR TEXT OR EDIT/DELETE ICONS
      if (
        target.classList.contains('project-icon') ||
        target.classList.contains('project-text') ||
        target.classList.contains('edit-project') ||
        target.classList.contains('delete-project')
      ) {
        target.parentElement.parentElement.classList.add('selected-link');

        // IF CLICKED ON PROJECT ELEMENTS DIVS
      } else if (
        target.classList.contains('project-icon-and-text-div') ||
        target.classList.contains('project-default-icons-div')
      ) {
        target.parentElement.classList.add('selected-link');
      }
    }
  }

  return {
    responsiveMenu,
    toggleMenu,
    selectLink,
    editProject,
    manipulateModal,
    validateModal,
    showProjects,
    showMainTitle,
    changeMainTitle,
    showTasks,
  };
})();

export default dom;
