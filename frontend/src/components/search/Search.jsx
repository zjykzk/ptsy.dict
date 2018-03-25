import React from 'react'
import { observable, action } from "mobx";
import { observer } from 'mobx-react'
import { Input, Row, Col } from 'antd'

import WordList from './WordList'

@observer
class Search extends React.Component {
  render() {
  return (
    <div style={{padding:"10 0 0 0", background:"white"}}>
      <Row type="flex" justify="center">
        <Col span={16}>
          <Input.Search onSearch={v => this.handleSearch(v)} />
        </Col>
        <Col span={16}>
          <WordList words={this.words} keyword={this.keyword}/>
        </Col>
      </Row>
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
