import LoadMoreButtonComponent from '../components/load-more-button.js';
import NoTasksComponent from '../components/no-tasks.js';
import SortComponent, {SortType} from '../components/sort.js';
import TaskComponent from '../components/task.js';
import TaskEditComponent from '../components/task-edit.js';
import TasksComponent from '../components/tasks.js';
import {render, remove, replace, RenderPosition} from '../utils/render.js';

const SHOWING_TASKS_COUNT_ON_START = 8;
const SHOWING_TASKS_COUNT_BY_BUTTON = 8;

const renderTask = (taskListElement, task) => {
  const replaceTaskToEdit = () => replace(taskEditComponent, taskComponent);

  const replaceEditToTask = () => replace(taskComponent, taskEditComponent);

  const isEscKey = (evt) => {
    return evt.key === `Escape` || `Esc`;
  };

  const onEscKeyDown = (evt) => {
    isEscKey(evt);

    if (isEscKey) {
      replaceEditToTask();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  const taskComponent = new TaskComponent(task);
  const taskEditComponent = new TaskEditComponent(task);

  taskComponent.setEditButtonClickHandler(() => {
    replaceTaskToEdit();
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  taskEditComponent.setSubmitHandler((evt) => {
    evt.preventDefault();
    replaceEditToTask();
    document.removeEventListener(`keydown`, onEscKeyDown);
  });

  render(taskListElement, taskComponent, RenderPosition.BEFOREEND);
};

const renderTasks = (taskListElement, tasks) => tasks.forEach((task) => renderTask(taskListElement, task));

const getSortedTasks = (tasks, sortType) => {
  let sortedTasks = [];
  const showingTasks = tasks.slice();

  const SortTypeCase = {
    up: () => {
      sortedTasks = showingTasks.sort((a, b) => a.dueDate - b.dueDate);
    },
    down: () => {
      sortedTasks = showingTasks.sort((a, b) => b.dueDate - a.dueDate);
    },
    default: () => {
      sortedTasks = showingTasks;
    },
  };

  switch (sortType) {
    case SortType.UP:
      SortTypeCase.up();
      break;
    case SortType.DOWN:
      SortTypeCase.down();
      break;
    case SortType.DEFAULT:
      SortTypeCase.default();
      break;
  }

  return sortedTasks;
};

export default class BoardController {
  constructor(container) {
    this._container = container;

    this._noTasksComponent = new NoTasksComponent();
    this._sortComponent = new SortComponent();
    this._tasksComponent = new TasksComponent();
    this._loadMoreButtonComponent = new LoadMoreButtonComponent();
  }

  onSortTypeRender(taskListElement, tasks, sortType) {
    let showingTasksCount = SHOWING_TASKS_COUNT_BY_BUTTON;

    const sortedTasks = getSortedTasks(tasks, sortType, 0, showingTasksCount);

    taskListElement.innerHTML = ``;

    renderTasks(taskListElement, sortedTasks.slice(0, showingTasksCount));

    this.renderLoadMoreButton(tasks, taskListElement);
  }

  onLoadMoreButton(taskListElement, tasks) {
    let showingTasksCount = SHOWING_TASKS_COUNT_ON_START;

    const prevTasksCount = showingTasksCount;
    showingTasksCount = showingTasksCount + SHOWING_TASKS_COUNT_BY_BUTTON;

    const sortedTasks = getSortedTasks(tasks, this._sortComponent.getSortType(), prevTasksCount, showingTasksCount);

    renderTasks(taskListElement, sortedTasks);

    if (showingTasksCount >= tasks.length) {
      remove(this._loadMoreButtonComponent);
    }
  }

  renderLoadMoreButton(tasks, taskListElement) {
    let showingTasksCount = SHOWING_TASKS_COUNT_ON_START;

    const container = this._container.getElement();

    if (showingTasksCount >= tasks.length) {
      return;
    }

    render(container, this._loadMoreButtonComponent, RenderPosition.BEFOREEND);

    this._loadMoreButtonComponent.setClickHandler(this.onLoadMoreButton.bind(this, taskListElement, tasks));
  }

  render(tasks) {
    const container = this._container.getElement();
    const isAllTasksArchived = tasks.every((task) => task.isArchive);

    if (isAllTasksArchived) {
      render(container, this._noTasksComponent, RenderPosition.BEFOREEND);
      return;
    }

    render(container, this._sortComponent, RenderPosition.BEFOREEND);
    render(container, this._tasksComponent, RenderPosition.BEFOREEND);

    const taskListElement = this._tasksComponent.getElement();

    let showingTasksCount = SHOWING_TASKS_COUNT_ON_START;

    renderTasks(taskListElement, tasks.slice(0, showingTasksCount));

    this.renderLoadMoreButton(tasks, taskListElement);

    this._loadMoreButtonComponent.setClickHandler(this.onLoadMoreButton.bind(this, taskListElement, tasks));
    this._sortComponent.setSortTypeChangeHandler(this.onSortTypeRender.bind(this, taskListElement, tasks));
  }
}
