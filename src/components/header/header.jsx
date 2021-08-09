import React,{Component} from 'react'
import {withRouter} from 'react-router-dom'
import {Modal} from 'antd'

import {formateDate} from '../../utils/dateUtils'
import mermoryUtils from '../../utils/mermoryUtils'
import storageUntils from '../../utils/storageUtils'
import menuList from '../../config/menuConfig'
import LinkButton from '../link-button'
import './index.less'
class Header extends Component{ 
    state = {
        currentTime:formateDate(Date.now())
    }
    getTime = () => {
        this.intervalId = setInterval(() =>{
            const currentTime = formateDate(Date.now())
            this.setState({currentTime})
        },1000)
    }
    getTitle = () => {
        const path = this.props.location.pathname
        let title
        menuList.forEach(item => {
            if(item.key === path){
                title = item.title
            }else if(item.children){
                const citem = item.children.find(citem => path.indexOf(citem.key) === 0)
                if(citem){
                    title = citem.title
                }
            }
        })
        return title
    }
    logout = ()=> {
        Modal.confirm({
            content: '确定退出吗?',
            onOk: () => {
            console.log('OK')
            // 移除保存的 user
            storageUntils.removeUser()
            mermoryUtils.user = {}
            // 跳转到 login
            this.props.history.replace('/login')
            },
            onCancel() {
            console.log('Cancel')
        },
        })
    }

    componentDidMount() {
        this.getTime()
    }
    componentWillUnmount() {
        clearInterval(this.intervalId)
    }
    render() {
        const {currentTime} = this.state
        const {username} = mermoryUtils.user
        const title = this.getTitle()
        return(
            <div className='header'>
                <div className='header-top'>
                    <span>欢迎，{username}</span>
                    <LinkButton onClick={this.logout}>退出</LinkButton>
                </div>
                <div className='header-bottom'>
                    <div className='header-bottom-left'>{title}</div>
                    <div className='header-bottom-right'>
                        <span>{currentTime}</span>
                        <img src="http://api.map.baidu.com/images/weather/day/qing.png" alt="" />
                        <span>晴天</span>
                    </div>
                </div>
            </div>
        )
    }
}
export default withRouter(Header)