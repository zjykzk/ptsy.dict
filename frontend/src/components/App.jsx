import React from 'react'
import { observer } from 'mobx-react'
import { Layout, Menu, Breadcrumb } from 'antd'
import {
  Route,
  Link,
  NavLink, withRouter
} from 'react-router-dom'
const { Header, Content, Footer } = Layout

import Search from './Search'
import Admin from './Admin'

@observer
class App extends React.Component {
  render() {
    return (
      <Layout className="layout">
        <Header style={{ background: 'white' }}>
          <Menu mode="horizontal" defaultSelectedKeys={['1']} style={{ lineHeight: '64px' }}>
            <Menu.Item key="1"><NavLink to='/'>search</NavLink></Menu.Item>
            <Menu.Item key="2"><NavLink to='/admin'>admin</NavLink></Menu.Item>
          </Menu>
        </Header>
        <Content>
          <Route exact path='/' render={() => <Search dict={this.props.dict}/>} />
          <Route exact path='/admin' component={Admin} />
        </Content>
      </Layout>
      )
  }
}

export default withRouter(App)
