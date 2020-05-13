import AbstractComponent from './abstract-component.js';

export const SortType = {
  DOWN: `down`,
  UP: `up`,
  DEFAULT: `default`,
};

const createSortTemplate = () => {
  return (
    `<div class="board__filter-list">
    <a href="#" data-sort-type="${SortType.DEFAULT}" class="board__filter">SORT BY DEFAULT</a>
    <a href="#" data-sort-type="${SortType.UP}" class="board__filter">SORT BY DATE up</a>
    <a href="#" data-sort-type="${SortType.DOWN}" class="board__filter">SORT BY DATE down</a>
    </div>`
  );
};

export default class Sort extends AbstractComponent {
  constructor() {
    super();

    this._currenSortType = SortType.DEFAULT;
  }

  setSortType(handler, evt) {
    evt.preventDefault();

    if (evt.target.tagName !== `A`) {
      return;
    }

    const sortType = evt.target.dataset.sortType;

    if (this._currenSortType === sortType) {
      return;
    }

    this._currenSortType = sortType;

    handler(this._currenSortType);
  }

  getTemplate() {
    return createSortTemplate();
  }

  getSortType() {
    return this._currenSortType;
  }

  setSortTypeChangeHandler(handler) {
    this.getElement().addEventListener(`click`, this.setSortType.bind(this, handler));
  }
}
