import {remove, render, RenderPosition} from '../framework/render.js';
import EditorView from '../view/editor-view.js';
import {nanoid} from 'nanoid';
import {UserActions, UpdateTypes} from '../const.js';
import { isEscKey } from '../utils.js';

export default class AddPointPresenter {
  #pointsContainer = null;
  #onDataChange = null;
  #onDestroy = null;

  #editorComponent = null;
  #offers;
  #destinations;

  constructor({pointsContainer, onDataChange, onDestroy, allOffers, allDestinations}) {
    this.#pointsContainer = pointsContainer;
    this.#onDataChange = onDataChange;
    this.#onDestroy = onDestroy;

    this.#offers = allOffers;
    this.#destinations = allDestinations;
  }

  init() {
    if (this.#editorComponent !== null) {
      return;
    }

    this.#editorComponent = new EditorView({
      allOffers: this.#offers,
      allDestinations: this.#destinations,
      onSubmit: this.#handleFormSubmit,
      deletePoint: this.#handleDeleteClick
    });

    render(this.#editorComponent, this.#pointsContainer, RenderPosition.BEFOREBEGIN);

    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  destroy() {
    if (this.#editorComponent === null) {
      return;
    }

    this.#onDestroy();

    remove(this.#editorComponent);
    this.#editorComponent = null;

    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  #handleFormSubmit = (point) => {
    if(point === undefined){
      return;
    }
    this.#onDataChange(
      UserActions.ADD_POINT,
      UpdateTypes.MINOR,
      {id: nanoid(), ...point},
    );
    this.destroy();
  };

  #handleDeleteClick = () => {
    this.destroy();
  };

  #escKeyDownHandler = (evt) => {
    if (isEscKey(evt.key)) {
      evt.preventDefault();
      this.destroy();
    }
  };
}
