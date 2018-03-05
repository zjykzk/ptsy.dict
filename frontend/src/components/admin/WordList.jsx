import React from 'react'
import { observer } from 'mobx-react'
import { observable, action } from 'mobx'
import { Table,Popconfirm } from 'antd'

import WordDetail from './WordDetail'

@observer
class WordList extends React.Component {
  columns = [{
    title: '中文',
    dataIndex: 'ch',
    key: 'ch'
  }, {
    title: '英文',
    dataIndex: 'en',
    key: 'en'
  }, {
    title: '出处',
    dataIndex: 'source',
    key: 'source'
  }, {
    title: '操作',
    key: 'action',
    render: (text, record) => (
      <span>
        <a href='#' onClick={() => this.detail(record)}>详情</a>
        <span className='ant-divider' />
        <a href='#' onClick={() => this.edit(record)}>编辑</a>
        <span className='ant-divider' />
        <Popconfirm title="确定要删除吗？" onConfirm={() => this.delete(record)}>
          <a>删除</a>
        </Popconfirm>
      </span>
    )
  }]

  @observable model = 'edit'

  @observable visible = false

  @observable word = null

  render() {
    return (
    <div>
      <WordDetail
        model={this.model}
        dict={this.props.dict}
        word={this.word}
        visible={this.visible}
        cancel={() => this.cancel()}
        save={(w) => this.update(w)}/>
      <Table columns={this.columns} dataSource={this.words} rowKey={(r)=>r.id} onChange={(p) => this.onChange(p)} pagination={{total:this.total}}/>
    </div>
    )
  }

  @observable words = []
  @observable page = 0
  @observable pageSize = 10
  @observable total = 0
  onChange(p) {
    this.page = p.current
    this.pageSize = p.pageSize
    this.fetchWords()
  }

  fetchWords() {
    this.props.dict.words({offset:this.page,limit:this.pageSize}).then(
      action("fetchSuccess", data => {
        this.total = data.total
        this.words = data.words
      })
    )
  }

  detail(r) {
    this.model = 'detail'
    this.word = r
    this.visible = true
  }

  edit(r) {
    this.model = 'edit'
    this.word = r
    this.visible = true
  }

  delete(r) {
    this.props.dict.delete(r)
  }

  cancel() {
    this.visible = false
  }

  update(w) {
    this.props.dict.update(w)
    this.visible = false
  }

  constructor(props) {
    super(props)
    this.fetchWords()
  }
}

export default WordList
