import React,{Component} from 'react'
import {Card, Button, Table, Modal, message} from 'antd'

import {PAGE_SIZE} from '../../utils/constants'
import {reqRoleList, reqRoleAdd, reqRoleUpdate} from '../../api/index'
import AddForm from './add-form'
import AuthForm from './auth-form'
import mermoryUtils  from '../../utils/mermoryUtils'
import storageUtils from '../../utils/storageUtils'
import {formateDate} from '../../utils/dateUtils'
export default class Role extends Component{
    state = {
        roles: [],
        role: {},
        isShowAdd:false,
        isShowAuth:false
    }
    constructor (props) {
        super(props)
        this.af = React.createRef()
    }

    initColumns = () => {
        this.columns = [
            {
                title: '角色名称',
                dataIndex: 'name',
            },
            {
                title: '创建时间',
                dataIndex: 'create_time',
                render: (create_time) => formateDate(create_time)
            },
            {
                title: '授权时间',
                dataIndex: 'auth_time',
                render: formateDate
            },
            {
                title: '授权人',
                dataIndex: 'auth_name',
            },
        ]
    }

    getRoles = async() => {
        const result = await reqRoleList()
        if(result.status === 0){
            const roles = result.data
            this.setState({
                roles
            })
        }
    }
    updateRole = async() => {
        this.setState({
            isShowAuth: false
        })
        const {role} = this.state
        console.log('role',role)
        const menus = this.af.current.getMenus()
        role.menus = menus
        role.auth_name = mermoryUtils.user.username
        role.auth_time = Date.now()
        const result = await reqRoleUpdate(role)
        if(result.status === 0){
            // this.getRoles()  
            //如果当前更新的是自己角色权限，强制退出
            if(role._id === mermoryUtils.user.role_id){
                mermoryUtils.user = {}
                storageUtils.removeUser()
                message.info('用户更改权限，请重新登录')
                this.props.history.replace('/login')    
            }else{
                message.success('设置权限成功')
                this.setState({
                    roles: [...this.state.roles]
                })
            }
        }else{
            message.error('设置权限失败')
        }
    }
    addRole = () => {
        this.form.validateFields(async (err,values)=> {
            if(!err){
                this.setState({isShowAdd: false})
                const { roleName } = values
                const result = await reqRoleAdd(roleName)
                if(result.status === 0) {
                    const role = result.data
                    this.setState(state => ({
                        roles: [...state.roles, role]
                    }))
                    message.success('角色添加成功')
                }else{
                    message.error('角色添加失败')
                }
            }
        })
    }
    onRow = (record) => {
        return {
            onClick: event => {
                this.setState({
                    role: record
                })
            }, // 点击行
        }
    }

    UNSAFE_componentWillMount() {
        this.initColumns()
    }

    componentDidMount() {
        this.getRoles()
    }
    render() {
        const {roles, role, isShowAdd, isShowAuth} = this.state
        const title = (
            <span>
                <Button type='primary' onClick={() => {this.setState({isShowAdd: true})}}>创建角色</Button>&nbsp;&nbsp;
                <Button type='primary' disabled={!role._id} onClick={() => {this.setState({isShowAuth: true})}}>设置角色权限</Button>
            </span>
        )
        return(
           <Card title={title}>
               <Table
                bordered
                dataSource={roles}
                columns={this.columns}
                pagination={{defaultPageSize:PAGE_SIZE,showQuickJumper: true}}
                rowKey='_id'
                rowSelection={
                    {
                        type:'radio', 
                        selectedRowKeys:[role._id],
                        onSelect:(role) => {
                            this.setState({
                                role
                            })
                        }
                    }}
                onRow={this.onRow}
               />
                <Modal
                    title="添加角色"
                    visible={isShowAdd}
                    onOk={this.addRole}
                    onCancel={() => {this.setState({isShowAdd: false})}}
                    destroyOnClose={true}
                    >
                    <AddForm setForm={form => this.form = form}/>
                </Modal>
                <Modal
                    title="设置角色权限"
                    visible={isShowAuth}
                    onOk={this.updateRole}
                    onCancel={() => {this.setState({isShowAuth: false})}}
                    destroyOnClose={true}
                    >
                    <AuthForm role={role} ref={this.af}/>
                </Modal>
           </Card>
        )
    }
}