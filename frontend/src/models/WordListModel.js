import { observable, computed, action } from "mobx";

import DictModel from "./DictModel";

export default class WordListModel {
  @observable words = [];

  @action
  search(keyword) {
    this.words = DictModel.filter(w => w.ch.indexOf(keyword) != -1)
  }
}
