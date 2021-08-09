import React,{Component} from 'react'
import {Card, Table, Button, Icon, message, Modal} from 'antd'

import LinkButton from '../../components/link-button'
import {reqCategorys, reqAddCategory, reqUpdateCategory} from '../../api/index'
import AddForm from './add-form'
import UpdateForm from './update-form'
export default class Category extends Component{
    state = {
        categorys: [],
        subCategorys: [],
        parentId: '0',
        parentName:'',
        loading:false,
        showStatus: 0
    }
    //初始化表格表头
    getColumns = () =>{
        this.columns = [
            {
              title: '分类的名称',
              dataIndex: 'name',
            },
            {
              title: '年龄',
              width:300,
              render: (category) =>(
                  <span>
                    <LinkButton onClick={() => {this.showUpdate(category)}}>修改分类</LinkButton>
                    {
                        this.state.parentId === '0' ? <LinkButton onClick={() => this.getSubCategorys(category)}>查看子分类</LinkButton> : null
                    }
                    
                  </span>
              )
            },
          ];
    }
    //获取一级二级分类列表
    //parentId:如果没有指定根据状态中的parentId请求，如果指定了根据指定的请求
    getCategorys = async (parentId) => {
        parentId = parentId || this.state.parentId
        this.setState({loading:true})
        const result =await reqCategorys(parentId)
        if(result.status === 0){
            const categorys = result.data
            if(parentId === '0') {
                this.setState({categorys})
            }else{
                this.setState({
                    subCategorys:categorys
                })
            }
            
            this.setState({loading:false})
        }else{
            message.error('获取分类列表失败')
        }
    }
    //修改状态获取二级分类列表
    getSubCategorys = (category) => {
        this.setState({
            parentId:category._id,
            parentName:category.name
        },() =>{
            this.getCategorys()
        }
       )
    }
    //回到一级分类
    showCategorys = () => {
        this.setState({
            parentId: '0',
            subCategorys: [],
            parentName: ''
        })
    }
    //添加分类
    addCategory = () => {
        this.form.validateFields(async (err, values)=> {
            if(!err){
                this.setState({
                    showStatus: 0
                })
                const {categoryName,parentId} = values
                const result = await reqAddCategory(categoryName, parentId)
                if(result.status === 0){
                    //添加的分类就是当前分类列表下的分类
                    if(parentId === this.state.parentId){
                        //重新获取当前分类列表显示
                        this.getCategorys()
                    }else if(parentId === '0'){//在二级分类列表下添加一级分类，重新获取一级分类列表，但不需要显示一级分类列表
                        this.getCategorys('0')
                    }
                }
            }
        })
   
    }
    //修改分类
    updateCategory = () =>{
        //进行表单验证，只有验证通过后才进行其他操作
        this.form.validateFields(async (err, values)=> {
            if(!err){
                this.setState({
                    showStatus: 0
                })
                //准备参数
                const categoryId = this.category._id
                const {categoryName} = values
                const result = await reqUpdateCategory({categoryId, categoryName})
                if(result.status === 0){
                    this.getCategorys()
                }
            }
        })
       
    }
    //出现添加弹窗
    showAdd = () => {
        this.setState({
            showStatus:1
        })
    }
    //出现修改弹框
    showUpdate = (category) => {
        this.category = category
        this.setState({
            showStatus:2
        })
    }

    //取消弹窗
    handleCancel = () => {
        this.setState({
            showStatus: 0
        })
    }

    UNSAFE_componentWillMount() {
        this.getColumns()
    }
    componentDidMount() {
        this.getCategorys()
    }
    render() {
        const category = this.category || {}
        const {categorys,loading,subCategorys,parentId,parentName,showStatus} = this.state
        const title = parentId === '0' ? '一级分类标题' : (
            <span>
                <LinkButton onClick={this.showCategorys}>一级分类标题</LinkButton>
                <Icon type='arrow-right'/>
                <span>{parentName}</span>
            </span>
        )
        const extra = (
            <Button type='primary' onClick={this.showAdd}>
                <Icon type="plus"/>
                添加
            </Button>
        )
        return(
            <Card title={title} extra={extra}>
                <Table
                    bordered
                    dataSource={parentId === '0' ? categorys : subCategorys}
                    columns={this.columns}
                    pagination={{defaultPageSize:5,showQuickJumper: true}}
                    loading={loading}
                    rowKey='_id'
                />
                <Modal
                    title="添加分类"
                    visible={showStatus === 1}
                    onOk={this.addCategory}
                    onCancel={this.handleCancel}
                    destroyOnClose={true}
                    >
                    <AddForm categorys={categorys} parentId={parentId} setForm={form => this.form = form}/>
                </Modal>
                <Modal
                    title="修改分类"
                    visible={showStatus === 2}
                    onOk={this.updateCategory}
                    onCancel={this.handleCancel}
                    destroyOnClose={true}
                    >
                    <UpdateForm categoryName={category.name} setForm={form => this.form = form}/>
                </Modal>
            </Card>
        )
    }
}