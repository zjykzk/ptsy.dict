import React, { Component } from 'react'
import { observer } from 'mobx-react'

import WordList from './WordList'
import Search from './Search'


@observer
class Admin extends React.Component {
  render() {
    return (
      <WordList dict={this.props.dict} />
    )
  }
}

export default Admin
