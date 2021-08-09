import React,{Component} from 'react'
import {Card, Button, Table, Modal, message} from 'antd'

import {PAGE_SIZE} from '../../utils/constants'
import LinkButton from '../../components/link-button'
import {reqUserList, reqUserDel, reqAddOrUpdateUser} from '../../api/index'
import {formateDate} from '../../utils/dateUtils'
import UserForm from './user-form'
export default class User extends Component{
    
    state = {
        users:[],
        roles:[],
        isShow:false
    }
    
    initColumns() {
        this.columns = [
            {
                title:'用户名',
                dataIndex:'username'
            },
            {
                title:'邮箱',
                dataIndex:'email'
            },
            {
                title:'电话',
                dataIndex:'phone'
            },
            {
                title:'注册时间',
                dataIndex:'create_time',
                render:formateDate
            },
            {
                title:'所属角色',
                dataIndex:'role_id',
                render:(role_id) => this.RoleNames[role_id]
            },
            {
                title:'操作',
                render: (user) =>(
                    <span>
                        <LinkButton onClick={() => this.showUpdate(user)}>修改</LinkButton>
                        <LinkButton onClick={() => this.delUser(user)}>删除</LinkButton>
                    </span>  
                )
            },
        ]
    }
    /*
    根据role的数组，生成包含所有角色名的对象（属性名用角色id值）
    */
    initRoleName = (roles) =>{
        this.RoleNames = roles.reduce((pre, role) => {
            pre[role._id] = role.name
            return pre
        },{})
    }
    getUsers = async() => {
        const result = await reqUserList()
        if(result.status === 0){
            const {users, roles} = result.data
            this.initRoleName(roles)
            this.setState({
                users,
                roles,
            })
        }
    }

    showUpdate = (user) => {
        this.user = user
        this.setState({
            isShow: true
        })
    }
    showAdd = () => {
        this.user = null
        this.setState({
            isShow: true
        })
    }
    delUser = (user) => {
        Modal.confirm({
            title:'你确定要删除此用户吗？',
            onOk: async() => {
                const result = await reqUserDel(user._id)
                if(result.status === 0){
                    message.success('删除用户成功')
                    this.getUsers()
                }
            }
        })
    }

    addOrUpdateUser = async () => {
        this.setState({
            isShow:false
        })
        const user = this.form.getFieldsValue()
        if(this.user){
            user._id = this.user._id
        }
        const result = await reqAddOrUpdateUser(user)
        if(result.status === 0){
            message.success(`${this.user ? '修改' : '添加'}用户成功`)
            this.getUsers()
        }
    }

    UNSAFE_componentWillMount() {
        this.initColumns()
    }

    componentDidMount () {
        this.getUsers()
    }
    render() {
        const {users, isShow, roles} = this.state
        const user = this.user || {}
        const title = (
            <Button type='primary' onClick={this.showAdd}>创建用户</Button>
        )
        return(
            <Card title={title}>
                <Table
                    bordered
                    dataSource={users}
                    columns={this.columns}
                    pagination={{defaultPageSize:PAGE_SIZE,showQuickJumper: true}}
                    rowKey='_id'
                />
                <Modal
                    title={user._id ? "修改用户" : "添加用户"}
                    visible={isShow}
                    onOk={this.addOrUpdateUser}
                    onCancel={() => this.setState({isShow: false})}
                    destroyOnClose={true}
                    >
                    <UserForm setForm={(form) =>this.form = form} roles={roles} user={user}/>
                </Modal>
            </Card>
        )
    }
}