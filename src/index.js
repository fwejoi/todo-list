import dom from './dom';
import handlers from './handlers';
import projects from './projects';
import tasks from './tasks';

// ADD DEFAULT PROJECT (EXAMPLE)
projects.addProject('fa-tools', 'Craft Example');

// ADD DEFAULT TASK (EXAMPLE)
tasks.addTask(
  0,
  'Enjoy my tea as much as my coding! 🍵',
  'Longer description of my demo task, just to show you this surprisingly nice scrollbar and amazingly cute kitty ฅ(^◉ᴥ◉^)ฅ',
  '2011-11-11',
  'low'
);

// WHEN PAGE IS LOADED - SHOW TITLE FROM MENU LINK 'ALL'
dom.showMainTitle(0);

// WHEN PAGE IS LOADED - SHOW ALL TASKS FROM ALL PROJECTS
dom.showTasks('all');

dom.responsiveMenu();
handlers.resizeWindow();
handlers.listenClicks();
