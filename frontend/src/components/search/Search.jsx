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
        <Input.Search onSearch={v => this.handleSearch(v)} />
      </div>
      <div style={{padding: '0 240px'}}>
        <WordList words={this.words} keyword={this.keyword}/>
      </div>
    </div>
    )
  }

  handleSearch = v => {
    this.props.dict.search(v).then(
      action("searchSuccess", data => {
        console.log(data)
        this.words = data.words
      })
    )
    this.keyword = v
  };

  @observable words = []
  @observable keyword
}

export default Search
