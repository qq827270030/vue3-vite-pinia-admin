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

  <el-card>
    <el-button type="primary" @click="AddNewRole">添加角色</el-button>
    <el-table :border="true" style="margin-top: 12px" :data="AllRoleList">
      <el-table-column
        label="序号"
        width="80px"
        align="center"
        type="index"
      ></el-table-column>
      <el-table-column
        label="ID"
        width="80px"
        align="center"
        prop="id"
      ></el-table-column>
      <el-table-column
        label="角色名称"
        width="250px"
        align="center"
        prop="roleName"
      ></el-table-column>
      <el-table-column
        label="创建时间"
        width="250px"
        align="center"
        prop="createTime"
      ></el-table-column>
      <el-table-column
        label="更新时间"
        width="250px"
        align="center"
        prop="updateTime"
      ></el-table-column>
      <el-table-column label="操作" align="center">
        <template #="{ row }">
          <el-button
            size="small"
            icon="User"
            title="分配权限"
            type="primary"
            @click="setPermission(row)"
          ></el-button>
          <el-button
            size="small"
            icon="Edit"
            title="编辑"
            type="warning"
            @click="updateRole(row)"
          ></el-button>
          <el-popconfirm
            :title="`确定要删除${row.roleName}吗`"
            icon="Delete"
            icon-color="red"
            @confirm="removeRole(row)"
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
    :title="AddNewRoleList.id ? '更新角色信息' : '添加新角色'"
    v-model="dialogVisible"
    width="30%"
    show-close
  >
    <el-form ref="AddRules" :rules="rules" :model="AddNewRoleList">
      <el-form-item label="角色名称:" prop="rolename">
        <el-input
          placeholder="请输入角色名"
          :prefix-icon="User"
          v-model="AddNewRoleList.roleName"
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="comfirmRole">保 存</el-button>
      </span>
    </template>
  </el-dialog>

  <el-drawer v-model="drawer" title="分配权限" width="30%">
    <el-form-item label="角色名:">
      <el-input
        :disabled="true"
        v-model="AddNewRoleList.roleName"
        style="width: 50%"
      ></el-input>
    </el-form-item>
    <el-form-item label="权限列表"></el-form-item>
    <el-tree
      ref="tree"
      :data="MenuList"
      show-checkbox
      node-key="id"
      default-expand-all
      :default-checked-keys="isSelectedList"
      :props="defaultProps"
    ></el-tree>
    <div class="bottom">
      <el-button type="info" @click="drawer = false">取消</el-button>
      <el-button type="primary" @click="savaData">保存</el-button>
    </div>
  </el-drawer>
</template>

<script setup lang="ts">
import { User } from '@element-plus/icons-vue'
import { nextTick, onMounted, reactive, ref } from 'vue'
import {
  reqGetRole,
  reqAddorUpdateRole,
  reqRemoveRole,
  reqGetRoleMenu,
  reqSetRolePermission,
} from '@/api/acl/role/index'
import { ElMessage } from 'element-plus'
let keywords = ref<any>('')
let total = ref<number>(0)
let PageNo = ref<number>(1)
let PageCount = ref<number>(6)
let dialogVisible = ref<boolean>(false)
let AddRules = ref()
let drawer = ref<boolean>(false)
//请求回来存储的所有角色列表
let AllRoleList = ref<any>([])
//收集新增或更新的数据列表
let AddNewRoleList = reactive<any>({
  roleName: '',
})
let MenuList = ref<any>([])
//获取树形控件的组件实例
let tree = ref<any>()
//存储已勾选的4级菜单里的id
let isSelectedList = ref<any>()

//改变每页显示条数的功能回调
const changSize = () => {
  GetAllRoles()
}
//换页功能的回调
const changPage = () => {
  GetAllRoles(PageNo.value)
}

//获取所有角色信息
const GetAllRoles = async (page = 1) => {
  PageNo.value = page
  let result = await reqGetRole(PageNo.value, PageCount.value, keywords.value)
  //console.log(result)
  if (result.code == 200) {
    AllRoleList.value = result.data.records
    total.value = result.data.total
  }
}

//点击新增角色的功能回调
const AddNewRole = () => {
  nextTick(() => {
    AddRules.value.clearValidate('rolename')
  })
  AddNewRoleList.id = ''
  AddNewRoleList.roleName = ''
  dialogVisible.value = true
}

//保存新增角色的功能
const comfirmRole = async () => {
  let result = await reqAddorUpdateRole(AddNewRoleList)
  //console.log(result)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: AddNewRoleList.id ? '修改成功' : '添加成功',
    })
    GetAllRoles(AddNewRoleList.id ? PageNo.value : 1)
    dialogVisible.value = false
  } else {
    ElMessage({
      type: 'error',
      message: AddNewRoleList.id ? '修改失败' : '添加失败',
    })
  }
}

//更新角色功能
const updateRole = (row: any) => {
  AddNewRoleList.id = row.id
  AddNewRoleList.roleName = row.roleName
  nextTick(() => {
    AddRules.value.clearValidate('rolename')
  })

  dialogVisible.value = true
}

//搜索功能回调
const searchName = () => {
  GetAllRoles()
}

//删除角色信息功能回调
const removeRole = async (row: any) => {
  let result = await reqRemoveRole(row.id)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '已删除',
    })
    GetAllRoles(AllRoleList.value.length > 1 ? PageNo.value : PageNo.value - 1)
  } else {
    ElMessage({
      type: 'error',
      message: '删除失败',
    })
  }
}

//设置权限功能回调
const setPermission = async (row: any) => {
  //AddNewRoleList.roleName = row.roleName
  drawer.value = true
  Object.assign(AddNewRoleList, row)
  let result = await reqGetRoleMenu(row.id)
  if (result.code == 200) {
    MenuList.value = result.data
    isSelectedList.value = filterSelectedId(MenuList.value, [])
  }
  //console.log(result)
}

//过滤出4级菜单里已勾选的id(递归方法过滤)
const filterSelectedId = (AllData: any, initList: any) => {
  AllData.forEach((item: any) => {
    if (item.level == 4 && item.select) {
      initList.push(item.id)
    }
    if (item.children && item.children.length > 0) {
      filterSelectedId(item.children, initList)
    }
  })
  return initList
}

//分配权限页面保存按钮功能回调
const savaData = async () => {
  //角色id
  let roleId = AddNewRoleList.id
  //选中的菜单权限
  let selectedArr = tree.value.getCheckedKeys()
  //伴选的id
  let selectedArr2 = tree.value.getHalfCheckedKeys()
  //两数组合并
  let NewArr = [...selectedArr, ...selectedArr2]
  //console.log(NewArr)
  let result = await reqSetRolePermission(roleId, NewArr)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '数据添加成功!',
    })
    // GetAllRoles(PageNo.value)
    window.location.reload()
  } else {
    ElMessage({
      type: 'error',
      message: '数据添加失败!',
    })
  }
  drawer.value = false
}

onMounted(() => {
  GetAllRoles()
})

// const validatorroleName = (_rule: any, value: any, callback: any) => {
//     if (value.trim().length >= 2) {
//         callback()
//     } else {
//         callback(new Error('角色名至少要2个字'))
//     }
// }

const rules = {
  rolename: [
    { required: true, trigger: 'blur', message: '用户名不能为空' },
    { min: 2, max: 15, message: '长度在 2 到 15 个字符', trigger: 'blur' },
  ],
}

const defaultProps = {
  children: 'children',
  label: 'name',
}
</script>

<style lang="scss" scoped>
.top {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.bottom {
  display: flex;
  flex-direction: row;
  justify-content: end;
  align-items: center;
}
</style>
