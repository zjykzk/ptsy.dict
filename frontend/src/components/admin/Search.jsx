import React, { Component } from 'react'
import { observer } from 'mobx-react'
import { Form, Row, Col, Input, Button, Icon } from 'antd';
const FormItem = Form.Item;

@observer
class Search extends React.Component {
  state = {
    expand: false,
  };

  handleSearch = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      console.log('Received values of form: ', values);
    });
  }

  handleReset = () => {
    this.props.form.resetFields();
  }

  toggle = () => {
    const { expand } = this.state;
    this.setState({ expand: !expand });
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

  render() {
    return (
      <Form
        style={{
          'padding': '24px',
          'background': 'white',
          'border': '1px solid #d9d9d9',
          'border-radius': '6px'
        }}
        onSubmit={this.handleSearch}
      >
        <Row gutter={40}>{this.getFields()}</Row>
        <Row>
          <Col span={12} style={{ textAlign: 'left' }}>
            <Button type="primary" htmlType="submit">添加</Button>
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
