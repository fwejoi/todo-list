import dom from './dom';//导入dom操作模块

const projects = (() => {
  let projectsList = [];//存储项目列表

  // 从本地存储获取默认任务和项目
  if (localStorage.getItem('projects') === null) {
    //如果没用存储的项目则创建默认项目
    projectsList = [
      {
        icon: 'fa-tools',
        title: 'Craft New Project',
        tasks: [
          {
            title: 'Enjoy my tea as much as my coding! 🍵',
            description: 'Longer description of my demo task, just to show you this surprisingly nice scrollbar and amazingly cute kitty ฅ(^◉ᴥ◉^)ฅ',
            date: '2011-11-11',
            priority: 'low',
            projectIndex: 0,
            taskIndex: 0,
            completed: false
          }
        ]
      },
      {
        icon: 'fa-tools',
        title: 'Craft Another Project',
        tasks: [
          {
            title: 'Create magic through my mind, my heart and my keyboard.. 👩🏻‍💻',
            description: 'Another longer description of my demo task, just to show you this surprisingly nice scrollbar and cute little birdie ϵ( ‘Θ’ )϶♪♫',
            date: '2012-12-12',
            priority: 'high',
            projectIndex: 1,
            taskIndex: 0,
            completed: false
          }
        ]
      },
    ];
  } else {
    //如果有存储的项目则从本地加载项目
    const projectsFromStorage = JSON.parse(localStorage.getItem('projects'));
    projectsList = projectsFromStorage;
  }

  //定义项目类
  class Project {
    constructor(icon, title) {
      this.icon = icon;//图标
      this.title = title;//标题
      this.tasks = [];//任务列表
    }
  }
  //添加项目
  function addProject(icon, title) {
    const project = new Project(icon, title);//创建新项目实例
    projectsList.push(project);//加入项目列表
    dom.showProjects();//更新dom显示项目
  }
  //编辑项目
  function editProject(icon, title, index, link) {
    projectsList[index].icon = icon;//更新图标
    projectsList[index].title = title;//更新标题
    dom.showProjects();//更新dom显示项目
    dom.selectLink(link, index, 'edit');//选择对应链接进行编辑？？？
  }

  //删除项目
  function deleteProject(index) {
    if (index > -1) {
      projectsList.splice(index, 1);//从项目中移除项目
    }
    dom.showProjects();//更新显示dom项目
  }

  
  return {
    projectsList,
    addProject,
    editProject,
    deleteProject,
  };
})();

export default projects;
