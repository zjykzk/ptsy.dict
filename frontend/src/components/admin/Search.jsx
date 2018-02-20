import React, { Component } from 'react'
import { observable } from 'mobx'
import { observer } from 'mobx-react'
import { Form, Row, Col, Input, Button, Icon } from 'antd';
const FormItem = Form.Item;

import WordDetail from './WordDetail'

@observer
class Search extends React.Component {
  @observable state = {
    expand: false,
    isAddWord: false,
  };

  handleSearch = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      this.props.dict.searchAdmin(values)
    });
  }

  handleReset = () => {
    this.props.form.resetFields();
  }

  toggle = () => {
    const { expand } = this.state;
    this.state.expand = !expand
  }

  showAdd = () => {
    this.state.isAddWord = true
  }

  // To generate mock Form.Item
  getFields() {
    const count = this.state.expand ? 10 : 6;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 19 },
    };
    const fieldDescs = [{
      name:'ch',
      label:'中文'
    }, {
      name:'en',
      label:'英文'
    }, {
      name:'examples',
      label:'例句'
    }, {
      name:'source',
      label:'出处'
    }, {
      name:'origin',
      label:'来源'
    }, {
      name:'position',
      label:'页码/日期/题目'
    }, {
      name:'comment',
      label:'备注'
    }]
    return fieldDescs.map((f, i) => (
        <Col span={8} key={i} style={{ display: i < count ? 'block' : 'none' }}>
          <FormItem {...formItemLayout} label={f.label}>
            {getFieldDecorator(f.name)(
              <Input placeholder='' />
            )}
          </FormItem>
        </Col>
    ))
  }

  cancel() {
    this.state.isAddWord = false
  }

  add(w) {
    this.props.dict.add(w)
    this.state.isAddWord = false
  }

  render() {
    return (
      <Form
        style={{
          'padding': '24px',
          'background': 'white',
          'border': '1px solid #d9d9d9',
          'borderRadius': '6px'
        }}
        onSubmit={this.handleSearch}
      >
        <Row gutter={40}>{this.getFields()}</Row>
        <Row>
          <Col span={12} style={{ textAlign: 'left' }}>
            <Button type="primary" onClick={this.showAdd}>添加</Button>
            <WordDetail
              model={this.state.isAddWord ? 'add' : ''}
              dict={this.props.dict}
              visible={this.state.isAddWord}
              cancel={() => this.cancel()} 
              save={(w) => this.add(w)}/>
          </Col>
          <Col span={12} style={{ textAlign: 'right' }}>
            <Button type="primary" htmlType="submit">搜索</Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>清除</Button>
            <a style={{ marginLeft: 8, fontSize: 12 }} onClick={this.toggle}>
              {this.state.expand ? '收起' : '展开'} <Icon type={this.state.expand ? 'up' : 'down'} />
            </a>
          </Col>
        </Row>
      </Form>
    );
  }
}

const AdvancedSearchForm = Form.create()(Search)

export default AdvancedSearchForm
