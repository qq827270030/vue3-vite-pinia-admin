<template>
  <el-table
    style="width: 100%"
    :border="true"
    row-key="id"
    :data="MenuList"
    :stripe="true"
  >
    <el-table-column align="center" label="名称" prop="name"></el-table-column>
    <el-table-column
      align="center"
      label="权限名"
      prop="code"
    ></el-table-column>
    <el-table-column
      align="center"
      label="操作时间"
      prop="updateTime"
    ></el-table-column>
    <el-table-column align="center" label="操作">
      <template #="{ row }">
        <el-button
          size="small"
          type="primary"
          :title="row.level == 3 ? '添加功能' : '添加菜单'"
          icon="Menu"
          :disabled="row.level == 4 ? true : false"
          @click="addMenu(row)"
        >
          {{ row.level == 3 ? '添加功能' : '添加菜单' }}
        </el-button>
        <el-button
          size="small"
          type="warning"
          title="编辑"
          icon="Edit"
          :disabled="row.level == 1 ? true : false"
          @click="updateMenu(row)"
        ></el-button>
        <el-popconfirm
          :title="`确定要删除${row.name}吗`"
          icon="Delete"
          icon-color="red"
          @confirm="removeMenu(row)"
          width="250px"
        >
          <template #reference>
            <el-button
              size="small"
              type="danger"
              title="删除"
              icon="Delete"
              :disabled="row.level == 1 ? true : false"
            ></el-button>
          </template>
        </el-popconfirm>
      </template>
    </el-table-column>
  </el-table>
  <el-dialog
    :title="AddNewMenuList.id ? '更新菜单信息' : '添加新菜单'"
    v-model="dialogVisible"
    width="30%"
    show-close
  >
    <el-form ref="AddRules" :rules="rules" :model="AddNewMenuList">
      <el-form-item label="菜单名称:" prop="name">
        <el-input
          placeholder="请输入名称"
          :prefix-icon="User"
          v-model="AddNewMenuList.name"
        ></el-input>
      </el-form-item>
      <el-form-item label="权限名称:" prop="code">
        <el-input
          placeholder="请输入权限名称"
          :prefix-icon="User"
          v-model="AddNewMenuList.code"
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
</template>

<script setup lang="ts">
import { User } from '@element-plus/icons-vue'
import { ref, onMounted, reactive } from 'vue'
import {
  reqGetAllMenu,
  reqAddorUpdateMenu,
  reqRemoveMenu,
} from '@/api/acl/menu/index'
import { ElMessage } from 'element-plus'
let MenuList = ref<any>([])
let AddRules = ref()
//收集新菜单或功能的数组
let AddNewMenuList = reactive<any>({
  pid: '',
  name: '',
  code: '',
  level: 0,
})
//控制对话框是否显示的变量
let dialogVisible = ref<boolean>(false)
const GetAllMenu = async () => {
  let result = await reqGetAllMenu()
  if (result.code == 200) {
    MenuList.value = result.data
  }
}

//添加菜单功能
const addMenu = (row: any) => {
  dialogVisible.value = true
  AddNewMenuList.name = ''
  AddNewMenuList.code = ''
  AddNewMenuList.level = row.level + 1
  AddNewMenuList.pid = row.id
}

//编辑菜单功能
const updateMenu = (row: any) => {
  Object.assign(AddNewMenuList, row)
  dialogVisible.value = true
}

//添加功能或菜单的确认按钮
const comfirmRole = async () => {
  await AddRules.value.validate()
  let result = await reqAddorUpdateMenu(AddNewMenuList)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: AddNewMenuList.id ? '修改成功' : '添加成功',
    })
    dialogVisible.value = false
    GetAllMenu()
  } else {
    ElMessage({
      type: 'error',
      message: AddNewMenuList.id ? '修改失败' : '添加失败',
    })
  }
}

//删除菜单功能
const removeMenu = async (row: any) => {
  //console.log(row)
  let result = await reqRemoveMenu(row.id)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '已删除',
    })
    window.location.reload()
  } else {
    ElMessage({
      type: 'error',
      message: '删除失败',
    })
  }
}

onMounted(() => {
  GetAllMenu()
})

const rules = {
  name: [
    { min: 4, max: 15, message: '长度在 4 到 15 个字符', trigger: 'blur' },
    { required: true, message: '名称不能为空', trigger: 'blur' },
  ],
  code: [
    { min: 4, max: 15, message: '长度在 4 到 15 个字符', trigger: 'blur' },
    { required: true, message: '名称不能为空', trigger: 'blur' },
  ],
}
</script>

<style lang="scss" scoped></style>
