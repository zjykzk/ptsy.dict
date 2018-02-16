import React from 'react'
import { observable, action } from "mobx";
import { observer } from 'mobx-react'
import { Input } from 'antd'

import WordList from './WordList'

@observer
class Search extends React.Component {
  render() {
  return (
    <div style={{ background: 'white' }}>
      <div style={{ padding: '20px 240px', backgroud: 'white' }}>
        <Input.Search onSearch={this.handleSearch} />
      </div>
      <div style={{padding: '0 240px'}}>
        <WordList words={this.words} keyword={this.keyword}/>
      </div>
    </div>
    )
  }

  @action
  handleSearch = v => {
    this.words = this.props.dict.search(v)
    this.keyword = v
  };

  @observable words
  @observable keyword
}

export default Search
