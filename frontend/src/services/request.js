import 'whatwg-fetch'
import qs from 'qs'

function parseJSON(response) {
  return response.json()
}

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    console.debug('status is ' + response.status)
  }
  return response
}

function logicError (data) {
  const {code, message} = data
  if (!!code) {
    console.error('return code is:' + code)
    return {data: null, err: message}
    //throw new Error(code)
  }
  return data
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, options) {
  return fetch(url, {...options, credentials: 'include'})
    .then(checkStatus)
    .then(parseJSON)
    .then(logicError)
    .then((data) => ({ ...data }))
    // .catch((err) => ({err}))
}

export function get(url, params) {
  return request(url + '?' + qs.stringify(params))
}

export function post(url, params) {
  return request(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(params)
  })
}

export function delete0(url, id) {
  return request(url + '/' + id, {
    method: 'delete'
  })
}

export function put(url, params) {
  return request(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(params)
  })
}

export function patch(url, params) {
  return request(url, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(params)
  })
}
