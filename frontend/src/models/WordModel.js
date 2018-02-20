import { observable, computed, action } from "mobx";

export default class WordModel {
  @observable word = {}

  @action
  save() {
    console.log(this.word)
  }

  constructor(w) {
    this.word = w
  }
}
