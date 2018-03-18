import * as srv from '../services/dict'

export default class DictModel {
  search(v) {
    return srv.search(v)
  }

  searchAdmin(w0) {
    return srv.list(w0)
  }

  add(w) {
    console.log('dict add')
    console.log(w)
    return srv.add(w)
  }

  update(w) {
    console.log('dict update')
    console.log(w)
    return srv.update(w)
  }

  delete(id) {
    console.log('dict delete')
    console.log(""+id)
    return srv.remove(id)
  }

  words(params) {
    return srv.list(params)
  }
}
