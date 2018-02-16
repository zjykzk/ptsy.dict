import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'

import { render } from 'react-dom'
import DevTools from 'mobx-react-devtools'

import App from './components/App'

import DictModel from './models/DictModel'

render(
  (<div>
    <DevTools />
    <Router>
      <App dict={new DictModel()} />
    </Router>
  </div>), document.getElementById('root')
)
