import React from 'react'
import { Form, Input, Button, Row, Col } from 'antd'
const FormItem = Form.Item

const WordForm = Form.create()((props) => {
  const { getFieldDecorator } = props.form
  const {readonly, word} = props
  const handleSubmit = (e) => {
    e.preventDefault()
    props.form.validateFields((err, values) => {
      if (!err) {
        props.save(values)
      }
    })
  }
  return (
    <Form onSubmit={handleSubmit}>
      <FormItem style={{display: 'none'}} label='id'>
        {getFieldDecorator('id', {
          initialValue: word ? word.id : 0
        })(<Input />)}
      </FormItem>
      <FormItem label='中文'>
        {getFieldDecorator('ch', {
          initialValue: word ? word.ch : ''
        })(<Input disabled={readonly} />)}
      </FormItem>
      <FormItem label='英文'>
        {getFieldDecorator('en', {
          initialValue: word ? word.en : ''
        })(<Input disabled={readonly} />)}
      </FormItem>
      <FormItem label='例句'>
        {getFieldDecorator('examples', {
          initialValue: word ? word.examples : ''
        })(<Input type='textarea' autosize disabled={readonly} />)}
      </FormItem>
      <FormItem label='出处'>
        {getFieldDecorator('source', {
          initialValue: word ? word.source : ''
        })(<Input disabled={readonly} />)}
      </FormItem>
      <FormItem label='来源'>
        {getFieldDecorator('origin', {
          initialValue: word ? word.origin : ''
        })(<Input disabled={readonly} />)}
      </FormItem>
      <FormItem label='页码/日期/题目'>
        {getFieldDecorator('position', {
          initialValue: word ? word.position : ''
        })(<Input disabled={readonly} />)}
      </FormItem>
      <FormItem label='备注'>
        {getFieldDecorator('comment', {
          initialValue: word ? word.comment : ''
        })(<Input type='textarea' autosize disabled={readonly} />)}
      </FormItem>
      <Row>
        <Col span={24} style={{ textAlign: 'center' }}>
          <Button key='back' size='large' onClick={props.cancel}>{readonly ? '关闭' : '取消'}</Button>
          <Button
            htmlType='submit'
            style={{marginLeft: 8, display: readonly ? 'none' : 'inline-block'}}
            key='submit' type='primary' size='large'>保存</Button>
        </Col>
      </Row>
    </Form>
  )
})

export default WordForm
