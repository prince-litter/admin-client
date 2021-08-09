/*
    进行local数据存储管理的工具
*/
const USER_KEY = 'user_key'
const storageUntils = {
    saveUser(user) {
        localStorage.setItem(USER_KEY,JSON.stringify(user))
    },
    getUser() {
        return JSON.parse(localStorage.getItem(USER_KEY) || '{}')
    },
    removeUser() {
        localStorage.removeItem(USER_KEY)
    }

}
export default storageUntils