import Dict from './Dict'

export default class DictModel {
  search (v) {
    return Dict.filter(w => w.ch.indexOf(v) !== -1 || w.en.indexOf(v) !== -1 ||
        w.examples.indexOf(v) !== -1 || w.source.indexOf(v) !== -1 ||
        w.origin.indexOf(v) !== -1 || w.position.indexOf(v) !== -1 ||
        w.comment.indexOf(v) !== -1)
  }
}
