import React from 'react'
import { observer } from 'mobx-react'
import { Layout, Menu, Breadcrumb } from 'antd'
import {
  Route,
  Link,
  NavLink, withRouter
} from 'react-router-dom'
const { Header, Content, Footer } = Layout

import Search from './search/Search'
import Admin from './admin/Admin'

@observer
class App extends React.Component {
  render() {
    let {dict} = this.props
    return (
      <Layout className="layout">
        <Header style={{ background: 'white' }}>
          <Menu mode="horizontal" defaultSelectedKeys={['1']} style={{ lineHeight: '64px' }}>
            <Menu.Item key="1"><NavLink to='/'>search</NavLink></Menu.Item>
            <Menu.Item key="2"><NavLink to='/admin'>admin</NavLink></Menu.Item>
          </Menu>
        </Header>
        <Content>
          <Route exact path='/' render={() => <Search dict={dict} />} />
          <Route exact path='/admin' render={() => <Admin dict={dict} />} />
        </Content>
      </Layout>
      )
  }
}

export default withRouter(App)
