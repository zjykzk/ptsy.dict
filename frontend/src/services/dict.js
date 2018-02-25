import 'whatwg-fetch'
import * as request from './request'

export function add(w) {
  request.post('/v1/dict', w)
}

export function remove(id) {
  request.delete0('/v1/delete/' + id)
}

export function update(w) {
  request.put('/v1/dict', w)
}

export function list(p) {
  request.get('/v1/dict', p)
}

export function search(keyword) {
  request.get('/v1/dict/search', {'s': keyword})
}
