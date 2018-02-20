import Dict from './Dict'

export default class DictModel {
  search(v) {
    return Dict.filter(w => w.ch.indexOf(v) !== -1 || w.en.indexOf(v) !== -1 ||
        w.examples.indexOf(v) !== -1 || w.source.indexOf(v) !== -1 ||
        w.origin.indexOf(v) !== -1 || w.position.indexOf(v) !== -1 ||
        w.comment.indexOf(v) !== -1)
  }

  searchAdmin(w0) {
    console.log('dict search admin')
    console.log(w0)
    return Dict.filter(w => (w0.ch && w.ch.indexOf(w0.ch) !== -1) ||
        (w0.en && w.en.indexOf(w0.en) !== -1) ||
        (w0.examples && w.examples.indexOf(w0.examples) !== -1) ||
        (w0.source && w.source.indexOf(w0.source) !== -1) ||
        (w0.origin && w.origin.indexOf(w0.origin) !== -1) ||
        (w0.position && w.position.indexOf(w0.position) !== -1) ||
        (w0.comment && w.comment.indexOf(w0.comment) !== -1))
  }

  add(w) {
    console.log('dict add')
    console.log(w)
  }

  update(w) {
    console.log('dict update')
    console.log(w)
  }

  delete(w) {
    console.log('dict delete')
    console.log(w)
  }

  words() {
    return Dict
  }
}
