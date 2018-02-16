import React, { Component } from 'react'
import { observable, action } from 'mobx'
import { observer } from 'mobx-react'
import renderHTML from 'react-render-html'

import { Collapse } from 'antd'
const Panel = Collapse.Panel

import Word from "./Word"

@observer
class WordList extends React.Component {
  render() {
    return (
    <div>
      <Collapse bordered={false}>
        { this.props.words && this.props.words.map((word, i) => (
          //<Word word={word} key={word.id} /> 
  <Panel header={word.ch} key={i}>
    <h2>中文</h2>
    <p>{rep(word.ch, this.props.keyword)}</p>
    <h2>英文</h2>
    <p>{rep(word.en, this.props.keyword)}</p>
    <h2>例句</h2>
    <p>{rep(word.examples, this.props.keyword)}</p>
    <h2>出处</h2>
    <p>{rep(word.source, this.props.keyword)}</p>
    <h2>来源</h2>
    <p>{rep(word.origin, this.props.keyword)}</p>
    <h2>页码/日期/题目</h2>
    <p>{rep(word.position, this.props.keyword)}</p>
    <h2>备注</h2>
    <p>{rep(word.comment, this.props.keyword)}</p>
  </Panel>
        )) }
      </Collapse>
    </div>
    )
  }
}

function rep(v, k) {
  if (v.indexOf(k) === -1) {
    return v
  }
  return renderHTML(v.replace(new RegExp(k, 'gm'), '<b style="color:red">' + k + '</b>'))
}

export default WordList
