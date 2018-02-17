import React from 'react'
import { observer } from 'mobx-react'
import { Table,Popconfirm } from 'antd'

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
        <a href='#' onClick={this.detail(record)}>详情</a>
        <span className='ant-divider' />
        <a href='#' onClick={this.edit(record)}>编辑</a>
        <span className='ant-divider' />
        <Popconfirm title="确定要删除吗？" onConfirm={() => this.delete(record)}>
          <a>删除</a>
        </Popconfirm>
      </span>
    )
  }]

  render() {
    return (<Table columns={this.columns} dataSource={this.props.words} />)
  }

  detail(r) {

  }

  edit(r) {

  }

  delete(r) {

  }
}

export default WordList
