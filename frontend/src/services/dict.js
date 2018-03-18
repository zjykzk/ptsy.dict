import 'whatwg-fetch'
import * as request from './request'

export function add(w) {
  return request.post('/v1/dict', w)
}

export function remove(id) {
  return request.delete0('/v1/dict', id)
}

export function update(w) {
  return request.put('/v1/dict', w)
}

export function list(p) {
  return request.get('/v1/dict', p)
}

export function search(keyword) {
  return request.get('/v1/dict/search', {'s': keyword})
}
