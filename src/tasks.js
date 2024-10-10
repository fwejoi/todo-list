import projects from './projects';//导入项目管理模块
import dom from './dom';//导入dom操作模块

const tasks = (() => {
  class Task {//定义任务类
    constructor(title, description, date, priority, projectIndex, taskIndex) {
      this.title = title;//任务标题
      this.description = description;//任务描述
      this.date = date;//任务日期
      this.priority = priority;//任务优先级
      this.projectIndex = projectIndex;//所属项目索引
      this.taskIndex = taskIndex;//任务索引
      this.completed = false;//完成状态
    }
  }

  //添加任务
  function addTask(title, description, date, priority, projectIndex, taskIndex) {
    const task = new Task(title, description, date, priority, projectIndex, taskIndex);//创建急实例

    projects.projectsList[projectIndex].tasks.push(task);//添加到对应项目的任务列表
    dom.getTasks('project', projectIndex);//更新dom显示任务
  }

  //编辑任务
  function editTask(title, description, date, priority, projectIndex, taskIndex) {
    projects.projectsList[projectIndex].tasks[taskIndex].title = title;
    projects.projectsList[projectIndex].tasks[taskIndex].description = description;
    projects.projectsList[projectIndex].tasks[taskIndex].date = date;
    projects.projectsList[projectIndex].tasks[taskIndex].priority = priority;
    dom.getTasks('project', projectIndex);
  }

  //删除任务
  function deleteTask(projectIndex, taskIndex) {
    if (projectIndex > -1) {
      projects.projectsList[projectIndex].tasks.splice(taskIndex, 1);
      dom.getTasks('all');
    }
  }
  //切换任务完成状态
  function toggleTaskCompletion(projectIndex, taskIndex, selectedLink) {
    let clickedLink;

    if (projects.projectsList[projectIndex].tasks[taskIndex].completed === false) {
      projects.projectsList[projectIndex].tasks[taskIndex].completed = true;
    } else {
      projects.projectsList[projectIndex].tasks[taskIndex].completed = false;
    }

    //判断链接类型？？？
    if (selectedLink.classList.contains('project')) {
      clickedLink = 'project';
    } else {
      clickedLink = selectedLink.getAttribute('data-title');
    }
    dom.getTasks(clickedLink, projectIndex);
  }

  return {
    addTask,
    editTask,
    deleteTask,
    toggleTaskCompletion
  };
})();

export default tasks;
