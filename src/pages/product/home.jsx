import React,{Component} from 'react'
import {Card,Input,Select,Icon,Button,Table, message} from 'antd'

import LinkButton from '../../components/link-button'
import {PAGE_SIZE} from '../../utils/constants'
import {reqProducts,reqSearchProducts, reqUpdateStatus} from '../../api/index'
const Option = Select.Option
export default class ProductHome extends Component{
    state = {
        products: [],
        total:0,
        loading:false,
        searchName:'', //搜索的关键字
        searchType:'productName'//搜索的方式
    }
    //初始化表头
    initColumns = () => {
        this.columns = [
            {
                title: '商品名称',
                dataIndex: 'name',
            },
            {
                title: '商品描述',
                dataIndex: 'desc',
            },
            {
                title: '价格',
                dataIndex: 'price',
                render:(price) => '￥' + price
            },
            {
                width:100,
                title: '状态',
                render: (product) => {
                    const {status, _id} = product
                    const newStatus = status === 1 ? 2 : 1
                    return(
                        <span>
                            <Button type='primary' onClick={() => {this.updateStatus(_id, newStatus)}}>{status === 1 ? '下架' : '上架'}</Button>
                            <span>{status === 1 ? '在售' : '已下架'}</span>
                        </span>
                    )
                }
            },
            {
                width:100,
                title: '操作',
                render: (product) => {
                    return(
                        <span>
                            <LinkButton onClick={() => this.props.history.push('/product/detail', {product})}>详情</LinkButton>
                            <LinkButton onClick={() => this.props.history.push('/product/addUpdate', product)}>修改</LinkButton>
                        </span>
                    )
                }
            },
        ]
    }
    //根据页码获取当前列表
    getProducts = async(pageNum) => {
        this.pageNum = pageNum //保存pageNum,让其他方法可以看到
        this.setState({loading:true})
        const {searchName,searchType} = this.state
        //如果搜索框有值进行搜索获取列表，否则获取一般列表7
        let result
        if(searchName){
             result = await reqSearchProducts({pageNum,pageSize:PAGE_SIZE,searchName,searchType})
        }else{
            result = await reqProducts(pageNum,PAGE_SIZE)
        }
        this.setState({loading:false})
        if(result.status === 0){
            const {total, list} = result.data
            this.setState({
                total,
                products:list
            })
        }
    }
    //更新商品上架下架
    updateStatus = async (productId, status) => {
        const result = await reqUpdateStatus(productId, status)
        if(result.status === 0){
            message.success('更新商品成功')
            this.getProducts(this.pageNum)
        }
    }

    UNSAFE_componentWillMount() {
        this.initColumns()
    }
    componentDidMount() {
        this.getProducts(1)
    }
    render() {
        const {products,total,loading, searchName, searchType} = this.state
        const title = (
            <span>
                <Select value={searchType} style={{width:150}} onChange={value => this.setState({searchType:value})}>
                    <Option value='productName'>按名称收搜</Option>
                    <Option value='productDesc'>按描述收搜</Option>
                </Select>
                <Input placeholder='关键字' value={searchName} style={{width:150,margin: '0 15px'}} onChange={event => this.setState({searchName:event.target.value})}/>
                <Button type='primary' onClick={() => {this.getProducts(1)}}>搜索</Button>
            </span>
        )
        const extra = (
            <Button  type='primary' onClick={() => {this.props.history.push('/product/addUpdate')}}><Icon type='plus'/>添加商品</Button>
        )
        return(
            <Card title={title} extra={extra}>
                <Table
                 bordered
                 rowKey='_id'
                 current={this.pageNum}
                 loading={loading}
                 columns={this.columns}
                 dataSource={products}
                 pagination={{defaultPageSize:PAGE_SIZE,total:total,showQuickJumper:true,onChange:this.getProducts}}
                />
            </Card>
        )
    }
}