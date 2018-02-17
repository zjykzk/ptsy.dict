import React, { Component } from 'react'
import { observer } from 'mobx-react'
import { Collapse } from 'antd'

const Word = observer(({ word }) => (
  <Collapse.Panel header={word.ch} key={word.id}>
    <h2>中文</h2>
    <p>{word.ch}</p>
    <h2>英文</h2>
    <p>{word.en}</p>
    <h2>例句</h2>
    <p>{word.example}</p>
    <h2>出处</h2>
    <p>{word.source}</p>
    <h2>来源</h2>
    <p>{word.origin}</p>
    <h2>页码/日期/题目</h2>
    <p>{word.position}</p>
    <h2>备注</h2>
    <p>{word.comment}</p>
  </Collapse.Panel>
))

export default Word
