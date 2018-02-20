import React, { Component } from 'react'
import { observer } from 'mobx-react'
import { Modal, Form, Row, Col, Input, Button, Icon } from 'antd';
const FormItem = Form.Item;

import WordForm from './WordForm'

const titles = {
  'add':'添加词条',
  'detail':'详情',
  'edit':'编辑'
}

@observer
class WordDetail extends React.Component {
  state = {
    loading: false,
    visible: false,
  }

  handleOk = (w) => {
    this.state.loading = true
    this.props.save && this.props.save(w)
    setTimeout(() => {
      this.setState({ loading: false, visible: false })
    }, 3000)
  }

  handleCancel = () => {
    this.state.visible = false
    this.props.cancel()
  }

  render() {
    const { visible, loading } = this.state;
    return (
      <div>
        <Modal
          visible={visible || this.props.visible}
          title={titles[this.props.model]}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={null}>
          <WordForm
            word={this.props.word}
            readonly={this.props.model == 'detail'} 
            cancel={this.handleCancel}
            save={this.handleOk}/>
        </Modal>
      </div>
    );
  }
}

export default WordDetail
