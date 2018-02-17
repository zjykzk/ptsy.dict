import React, { Component } from 'react'
import { observer } from 'mobx-react'

import WordList from './WordList'
import Search from './Search'


@observer
class Admin extends React.Component {
  render() {
    return (
    <div style={{ padding: '20px 240px', backgroud: 'white' }}>
      <Search />
      <div>
        <WordList words={this.props.dict}/>
      </div>
    </div>
    )
  }
}

export default Admin
