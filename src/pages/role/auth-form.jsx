import React,{Component} from 'react'
import {Form, Input, Tree} from 'antd'
import PropTypes from 'prop-types'

import menuList from '../../config/menuConfig'
const Item = Form.Item
const TreeNode = Tree.TreeNode
export default class AuthForm extends Component{
    static propTypes = {
        role:PropTypes.object.isRequired
    }

    constructor (props){
        super(props)
        const {menus} = this.props.role
        this.state = {
            checkedKeys:menus
        }
    }

    getTreeNodes = (menuList) =>{
       return menuList.reduce(((pre,item) => {
            pre.push(
                <TreeNode title={item.title} key={item.key}>
                    {item.children ? this.getTreeNodes(item.children) : null}
                </TreeNode>
            )
            return pre
        }),[])
    }
    getMenus = () => {
        return this.state.checkedKeys
    }
    onCheck = checkedKeys => {
        this.setState({ checkedKeys })
    };

    UNSAFE_componentWillMount () {
        this.treeNodes = this.getTreeNodes(menuList)
    }
    render() {
        const {role} = this.props
        const {checkedKeys} = this.state
        return(
            <div>
                <Item label='角色名称'labelCol={{span: 4}} wrapperCol={{span: 16}}>
                    <Input disabled value={role.name}></Input>
                </Item>
                <Tree
                    checkable
                    defaultExpandAll    
                    checkedKeys={checkedKeys}
                    onCheck={this.onCheck}
                >
                    <TreeNode title="平台权限" key="all">
                        {this.treeNodes}
                    </TreeNode>
                </Tree>
            </div>
        )
    }
}
 