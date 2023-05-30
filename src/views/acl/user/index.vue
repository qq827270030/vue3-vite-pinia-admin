<template>
  <el-card>
    <el-form :inline="true" class="top">
      <el-form-item label="用户名:">
        <el-input placeholder="请输入用户名称" v-model="keywords"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          icon="Search"
          type="primary"
          :disabled="keywords ? false : true"
          @click="searchName"
        >
          搜索
        </el-button>
      </el-form-item>
    </el-form>
  </el-card>

  <el-card style="margin-top: 12px">
    <el-button type="primary" @click="addUser">添加用户</el-button>

    <el-popconfirm
      :title="`确定要删除这${isSelectedUser.length}位用户吗`"
      icon="Delete"
      icon-color="red"
      @confirm="removeUserList"
      width="250px"
    >
      <template #reference>
        <el-button
          type="danger"
          :disabled="isSelectedUser.length > 0 ? false : true"
        >
          批量删除
        </el-button>
      </template>
    </el-popconfirm>

    <el-table
      @selection-change="selectChange"
      :border="true"
      :stripe="true"
      style="margin-top: 12px"
      :highlight-current-row="true"
      :data="UserList"
    >
      <el-table-column
        type="selection"
        width="50px"
        align="center"
      ></el-table-column>
      <el-table-column
        label="序号"
        width="60px"
        align="center"
        type="index"
      ></el-table-column>
      <el-table-column
        label="ID"
        width="70px"
        align="center"
        prop="id"
      ></el-table-column>
      <el-table-column
        label="用户账号"
        align="center"
        prop="username"
      ></el-table-column>
      <el-table-column
        label="用户名称"
        align="center"
        prop="name"
      ></el-table-column>
      <el-table-column
        label="用户角色"
        align="center"
        prop="roleName"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
      ></el-table-column>
      <el-table-column
        label="更新时间"
        align="center"
        prop="updateTime"
      ></el-table-column>
      <el-table-column label="操作" align="center">
        <template #="{ row }">
          <el-button
            size="small"
            icon="User"
            title="分配角色"
            type="primary"
            @click="setRoleName(row)"
          ></el-button>
          <el-button
            size="small"
            icon="Edit"
            title="编辑"
            type="warning"
            @click="updateUser(row)"
          ></el-button>
          <el-popconfirm
            title="确定要删除此用户吗"
            icon="Delete"
            icon-color="red"
            @confirm="removeUser(row)"
            width="250px"
          >
            <template #reference>
              <el-button
                size="small"
                icon="Delete"
                title="删除"
                type="danger"
              ></el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <ElPagination
      style="margin-top: 12px"
      background
      :total="total"
      :page-sizes="[6, 7, 8, 9, 10, 11, 12]"
      layout="sizes, <-, prev, pager, next, jumper, ->,total"
      v-model:current-page="PageNo"
      v-model:page-size="PageCount"
      @size-change="changSize"
      @current-change="changPage"
    ></ElPagination>
  </el-card>
  <el-dialog
    :title="AddNewUserList.id ? '更新用户信息' : '添加新用户'"
    v-model="dialogVisible"
    width="30%"
    show-close
  >
    <el-form ref="AddRules" :rules="rules" :model="AddNewUserList">
      <el-form-item label="账号:" prop="username">
        <el-input
          placeholder="请输入用户名"
          :prefix-icon="User"
          v-model="AddNewUserList.username"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="密码:"
        prop="password"
        v-if="AddNewUserList.id == ''"
      >
        <el-input
          placeholder="请输入密码"
          type="password"
          :prefix-icon="Lock"
          v-model="AddNewUserList.password"
          show-password
        ></el-input>
      </el-form-item>
      <el-form-item label="名称:" prop="name">
        <el-input
          placeholder="请输入用户名"
          :prefix-icon="UserFilled"
          v-model="AddNewUserList.name"
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="comfirmUser">保 存</el-button>
      </span>
    </template>
  </el-dialog>
  <el-drawer v-model="drawer" title="分配角色" width="30%">
    <el-form>
      <el-form-item label="用户名:">
        <el-input
          :disabled="true"
          v-model:model-value="AddNewUserList.name"
          style="width: 50%"
        ></el-input>
      </el-form-item>
      <el-form-item label="角色列表">
        <el-checkbox v-model="checkAll" @change="handleCheckAllChange">
          全选
        </el-checkbox>
        <br />
        <el-checkbox-group
          v-model="UserRoles"
          @change="handleCheckedCitiesChange"
        >
          <el-checkbox v-for="item in AllRoles" :label="item" :key="item.id">
            {{ item.roleName }}
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <div class="btn">
        <el-button type="info" @click="drawer = false">取消</el-button>
        <el-button type="primary" @click="saveSetUserRoles">保存</el-button>
      </div>
    </el-form>
  </el-drawer>
</template>

<script setup lang="ts">
import { User, Lock, UserFilled } from '@element-plus/icons-vue'
import { ref, onMounted, reactive, nextTick } from 'vue'
import {
  reqGetAlluser,
  reqAddOrUpdateUser,
  reqGetAllUserRole,
  reqSetUserRoles,
  reqRemoveUser,
  reqRemoveUserList,
} from '@/api/acl/index'
import { ElMessage } from 'element-plus'
//定义抽屉显示与隐藏的变量
let drawer = ref<boolean>(false)
let total = ref<number>(0)
let PageNo = ref<number>(1)
let PageCount = ref<number>(6)
let isSelectedUser = ref<any>([])
//要分配的角色的id
let setUserRoleId = ref()
//请求回来的用户数据存储变量
let UserList = ref<any>([])
//表单验证的数据
// let userForm = reactive<any>({
//     username: '',
//     password: '',
//     name: ''
// })
//收集数据
let AddNewUserList = reactive<any>({
  username: '',
  password: '',
  name: '',
  id: '',
  createTime: '',
  updateTime: '',
  phone: '',
  roleName: '',
})
let AddRules = ref()
//控制对话框是否显示的变量
let dialogVisible = ref<boolean>(false)
//控制全选框全选功能
let checkAll = ref(false)
//设置复选框不确定状态，只负责样式
//let isIndeterminate = ref(true)
//子复选框是否选中的变量
//定义用户已拥有的角色列表
let UserRoles = ref<any>([])
//定义所有角色列表
let AllRoles = ref<any>([])
//定义搜索关键词的变量
let keywords = ref<any>('')

const GetAllUser = async (page = 1) => {
  PageNo.value = page
  let result = await reqGetAlluser(
    PageNo.value,
    PageCount.value,
    keywords.value,
  )
  if (result.code == 200) {
    total.value = result.data.total
    UserList.value = result.data.records
    ElMessage({
      type: 'success',
      message: '列表已更新',
    })
  }
}

//改变一页显示几条数据的功能回调
const changSize = () => {
  GetAllUser()
}
//翻页功能回调
const changPage = () => {
  GetAllUser(PageNo.value)
}
//添加用户按钮功能回调
const addUser = () => {
  nextTick(() => {
    AddRules.value.clearValidate('username')
    AddRules.value.clearValidate('password')
    AddRules.value.clearValidate('name')
  })
  ;(AddNewUserList.username = ''),
    (AddNewUserList.id = ''),
    (AddNewUserList.createTime = ''),
    (AddNewUserList.updateTime = ''),
    (AddNewUserList.roleName = ''),
    (AddNewUserList.phone = ''),
    (AddNewUserList.password = ''),
    (AddNewUserList.name = '')

  dialogVisible.value = true
}
//对话框确认按钮功能回调
const comfirmUser = async () => {
  await AddRules.value.validate()
  console.log(AddNewUserList)
  let result = await reqAddOrUpdateUser(AddNewUserList)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: AddNewUserList.id ? '修改成功' : '添加成功',
    })
    GetAllUser(AddNewUserList.id ? PageNo.value : 1)
  } else {
    ElMessage({
      type: 'error',
      message: AddNewUserList.id ? '修改失败' : '添加失败',
    })
  }
  //console.log(result)
  dialogVisible.value = false
}

//更新用户信息
const updateUser = (row: any) => {
  AddNewUserList.username = row.username
  AddNewUserList.name = row.name
  AddNewUserList.id = row.id
  nextTick(() => {
    AddRules.value.clearValidate('username')
    AddRules.value.clearValidate('password')
    AddRules.value.clearValidate('name')
  })

  dialogVisible.value = true
}

//分配角色功能回调
const setRoleName = async (row: any) => {
  setUserRoleId.value = row.id

  // drawerUsername.value = row.name
  Object.assign(AddNewUserList, row)
  let result = await reqGetAllUserRole(row.id)
  console.log(result)
  if (result.code == 200) {
    AllRoles.value = result.data.allRolesList
    UserRoles.value = result.data.assignRoles
  }
  drawer.value = true
}

//全选框是否全选的功能函数
const handleCheckAllChange = (val: any) => {
  UserRoles.value = val ? AllRoles.value : []
  //  isIndeterminate.value = false
}
//子复选框的功能函数
const handleCheckedCitiesChange = (val: any) => {
  let roleCount = val.length
  checkAll.value = roleCount === AllRoles.value.length
  // isIndeterminate.value = (roleCount > 0 && roleCount < AllRoles.value.length)
}

//分配角色保存按钮功能回调
const saveSetUserRoles = async () => {
  let IdList: any = []
  UserRoles.value.forEach((item: any) => {
    return IdList.push(item.id)
  })
  let RolesPramas = {
    roleIdList: IdList,
    userId: setUserRoleId.value,
  }
  let result = await reqSetUserRoles(RolesPramas)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '用户角色更新成功',
    })
    drawer.value = false
    GetAllUser(PageNo.value)
  } else {
    ElMessage({
      type: 'error',
      message: '更新失败',
    })
  }
}
//删除按钮，删除单个管理用户的共呢个
const removeUser = async (row: any) => {
  let result = await reqRemoveUser(row.id)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '已删除',
    })
    GetAllUser(UserList.length > 1 ? PageNo.value : PageNo.value - 1)
  } else {
    ElMessage({
      type: 'error',
      message: '失败',
    })
  }
}

//表格复选框选项发生变化时会触发的事件
const selectChange = (value: any) => {
  //将表格中选中的框收集到数组中
  isSelectedUser.value = value
  //console.log(isSelectedUser.value)
}

//批量删除用户的功能回调
const removeUserList = async () => {
  let idList2: any = isSelectedUser.value.map((item: any) => {
    return item.id
  })
  let result = await reqRemoveUserList(idList2)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '已删除',
    })
    GetAllUser(UserList.length > 1 ? PageNo.value : PageNo.value - 1)
  } else {
    ElMessage({
      type: 'error',
      message: '删除失败',
    })
  }
}

//搜索功能回调
const searchName = () => {
  //根据用户关键词获取用户
  GetAllUser()
  keywords.value = ''
}

onMounted(() => {
  GetAllUser()
})

//定义表单检测规则
const rules = {
  username: [
    { min: 5, max: 15, message: '长度在 5 到 15 个字符', trigger: 'blur' },
    { required: true, message: '账号不能为空', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '密码不能为空', trigger: 'blur' },
    { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' },
  ],
  name: [{ required: true, message: '名字不能为空', trigger: 'blur' }],
}
</script>

<style lang="scss" scoped>
.top {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.btn {
  display: flex;
  flex-direction: row;
  justify-content: center;
}
</style>
