import * as srv from '../services/dict'

export default class DictModel {
  search(v) {
    return srv.search(v)
  }

  searchAdmin(w0) {
    return srv.list(w0)
  }

  add(w) {
    return srv.add(w)
  }

  update(w) {
    return srv.update(w)
  }

  delete(id) {
    return srv.remove(id)
  }

  words(params) {
    return srv.list(params)
  }
}
