import React,{Component} from 'react'
import {Link, withRouter} from 'react-router-dom'
import { Menu, Icon, } from 'antd';

import logo from '../../assets/images/logo.png'
import './index.less'
import menuList from '../../config/menuConfig';
import mermoryUtils from '../../utils/mermoryUtils'
const { SubMenu } = Menu;
class LeftNav extends Component{
    //判断当前登录用户对item是否有权限
    /*
        1.如果当前用户是admin
        2.如果当前item是公开的
        3.当前用户有此item的权限
        4.如果当前用户有此item的某个子item的权限
    */
    hasAuth = (item) => {
        const {key, isPublic} = item
        const menus = mermoryUtils.user.role.menus || []
        console.log(menus,key)
        const username =  mermoryUtils.user.username
        if(username === 'admin' || isPublic || menus.indexOf(key) !== -1){
            return true
        }else if(item.children){//如果当前用户有此item的某个子item的权限
            return !!item.children.find(child => menus.indexOf(child.key)!== -1)
        }
        else{
           return false
        }
    }

    //动态生成菜单栏，map() + 递归
    getMenuNodes(menuList){
        const path = this.props.location.pathname
        return menuList.map((item) => {
            if(this.hasAuth(item)){
                if(!item.children){
                    return (
                        <Menu.Item key={item.key}>
                            <Link to={item.key}>
                                <Icon type={item.icon} />
                                <span>{item.title}</span>
                            </Link>
                        </Menu.Item>
                    )
                }else{
                    //查找一个与当前请求路径匹配的子Item
                    const citem = item.children.find(citem => path.indexOf(citem.key) === 0)
                    //如果存在,说明当前item的子列表需要打开
                    if(citem){
                        this.openKey = item.key
                    }
                    return (
                        <SubMenu
                            key={item.key}
                            title={
                            <span>
                                <Icon type={item.icon} />
                                <span>{item.title}</span>
                            </span>
                            }
                        >
                            { this.getMenuNodes(item.children)}
                        </SubMenu>
                    )
                }
            }else{
                return null
            }
           
        })
    }
    /*
        在render之前只执行一次
        为render准备数据（同步的）

    */
    UNSAFE_componentWillMount(){
        this.menuNodes =  this.getMenuNodes(menuList)
    }
    render() {
        let path = this.props.location.pathname
        if(path.indexOf('/product') === 0){//当前请求的是商品或其子路由界面
            path = '/product'
        }
        const openKey = this.openKey
        return(
            <div className='left-nav'>
                <Link to='/home' className='left-nav-header'>
                    <img src={logo} alt="logo" />
                    <h1>硅谷后台</h1>
                </Link>
                <Menu
                    mode="inline"
                    theme="dark"
                    selectedKeys={[path]}
                    defaultOpenKeys={[openKey]}
                    >
                    {
                       this.menuNodes
                    }
                </Menu>
            </div>
        )
    }
}
export default withRouter(LeftNav)