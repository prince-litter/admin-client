/*
包含应用中所有接口请求函数模块
*/

import ajax from './ajax'
const BASE = ''
//登陆
export const reqLogin = (username, password) => ajax(BASE + '/login', {username, password}, 'POST')


//获取一级/二级分类的列表
export const reqCategorys = (parentId) => ajax(BASE + '/manage/category/list', {parentId})

//添加分类

export const reqAddCategory = (categoryName, parentId) => ajax(BASE + '/manage/category/add', {categoryName, parentId}, 'POST')

//更新分类
export const reqUpdateCategory = ({categoryId,categoryName}) => ajax(BASE + '/manage/category/update', {categoryId, categoryName}, 'POST')

//获取一个分类
export const reqCategory = (categoryId) => ajax(BASE + '/manage/category/info', {categoryId} )

//获取商品分页列表
export const reqProducts = (pageNum, pageSize) => ajax(BASE + '/manage/product/list', {pageNum, pageSize})

//搜索查询分页列表(根据商品名称/商品描述)
//searchType: 搜索的类型，productName/productDesc
export const reqSearchProducts = ({pageNum, pageSize,searchName,searchType}) => ajax(BASE + '/manage/product/search',
 {pageNum,
  pageSize,
  [searchType]:searchName
})

//对商品进行上架/下架处理
export const reqUpdateStatus = (productId, status) => ajax(BASE + '/manage/product/updateStatus', {productId, status}, 'POST')

//删除图片
export const reqImgDelete = (name) => ajax(BASE + '/manage/img/delete', {name}, 'POST')

//添加或者修改商品信息
export const reqAddOrUpdateProduct = (product) => ajax(BASE + '/manage/product' + (product._id ? '/update' : '/add'), product , 'POST')

//获取角色列表
export const reqRoleList = () => ajax(BASE + '/manage/role/list')

//添加角色
export const reqRoleAdd = (roleName) => ajax(BASE + 'manage/role/add', {roleName}, 'POST')

//更新角色
export const reqRoleUpdate = (role) => ajax(BASE + '/manage/role/update', role, 'POST')

//获取用户列表
export const reqUserList = () => ajax(BASE + '/manage/user/list')

//删除用户
export const reqUserDel = (userId) => ajax(BASE + '/manage/user/delete', {userId}, 'POST')

//添加或修改用户
export const reqAddOrUpdateUser = (user) => ajax(BASE + '/manage/user/' + (user._id ? 'update' : 'add'), user, 'POST')