<template>
  <ElCard class="box-card">
    <!-- 顶部添加品牌按钮 -->
    <ElButton type="primary" icon="plus" @click="addTradeMark">
      添加品牌
    </ElButton>
    <!-- 表格组件，用于展示品牌数据 -->
    <ElTable :border="true" highlight-current-row :data="TradeMark">
      <ElTableColumn
        label="序号"
        align="center"
        width="80px"
        type="index"
      ></ElTableColumn>
      <ElTableColumn
        label="品牌名称"
        align="center"
        prop="tmName"
      ></ElTableColumn>
      <ElTableColumn label="品牌Logo" align="center">
        <template #="{ row }">
          <img class="TradeMarkLogo" :src="row.logoUrl" alt="" />
        </template>
      </ElTableColumn>
      <ElTableColumn label="品牌操作" align="center">
        <!-- <template #header>
        <el-input v-model="search"  placeholder="输入关键字搜索" />
      </template> -->
        <template #="{ row }">
          <ElButton
            type="primary"
            icon="Edit"
            size="small"
            @click="editTradeMark(row)"
          >
            编辑
          </ElButton>
          <el-popconfirm
            :title="`你确定要删除${row.tmName}吗？`"
            width="240px"
            icon="delete"
            icon-color="red"
            @confirm="removeMark(row.id)"
          >
            <template #reference>
              <ElButton type="danger" icon="Delete" size="small">删除</ElButton>
            </template>
          </el-popconfirm>
        </template>
      </ElTableColumn>
    </ElTable>
    <!-- 分页器组件 -->
    <!-- v-model:current-page 默认展示第几页 -->
    <!-- v-model:page-size 默认每页展示几条数据 -->
    <ElPagination
      background
      :total="total"
      :page-sizes="[3, 4, 5, 6, 7, 8]"
      layout="sizes, <-, prev, pager, next, jumper, ->,total"
      v-model:current-page="PageNo"
      v-model:page-size="PageCount"
      @current-change="getProductInfo"
      @size-change="changSize"
    ></ElPagination>
  </ElCard>

  <!-- 点击添加品牌弹出的对话框 -->
  <!-- v-model控制对话框显示与隐藏的 -->
  <!-- title:控制对话框标题的 -->
  <!-- :model是表单数据来源的对象 -->
  <ElDialog
    :title="tradeMarkInfo.id == 0 ? '添加品牌' : '编辑品牌'"
    v-model="dialogFormVisible"
    width="36%"
  >
    <el-form ref="formRef" :model="tradeMarkInfo" status-icon :rules="rules">
      <el-form-item
        label="品牌名称"
        label-width="100px"
        style="margin-left: -7px"
        prop="tmName"
      >
        <el-input
          placeholder="请输入品牌名称"
          style="margin-left: 5px"
          v-model="tradeMarkInfo.tmName"
        ></el-input>
      </el-form-item>

      <el-form-item label="品牌Logo" label-width="100px" prop="logo">
        <ElUpload
          class="upload-demo"
          drag
          action="/api/admin/product/fileUpload"
          :auto-upload="true"
          :show-file-list="true"
          :before-upload="beforeAvatarUpload"
          :on-success="handleAvatarSuccess"
        >
          <div class="el-icon-upload">
            <img
              v-if="tradeMarkInfo.logoUrl"
              :src="tradeMarkInfo.logoUrl"
              class="avatar"
            />
          </div>
          <div class="el-upload__text" v-show="!tradeMarkInfo.logoUrl">
            将文件拖到此处,或
            <em>点击上传</em>
          </div>
          <template #tip>
            <div class="el-upload__tip">
              只能上传jpg/png/jpeg/gif文件,且不超过 2M
            </div>
          </template>
        </ElUpload>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <ElButton @click="cancel">取 消</ElButton>
        <ElButton type="primary" @click="comfirm">确 定</ElButton>
      </span>
    </template>
  </ElDialog>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, nextTick } from 'vue'
import {
  reqTradeMark,
  reqAddTradeMark,
  reqUpdateTradeMark,
  reqDeleteTradeMark,
} from '@/api/product/trademark'
import {
  Records,
  tmResponseData,
  TradeMark,
} from '@/api/product/trademark/type'
import { ElMessage, UploadProps } from 'element-plus'
let formRef = ref()
let PageNo = ref(1)
let PageCount = ref(4)
let total = ref(0)
let TradeMark = ref<Records>([])
//定义表单检验字段
//let loginRules = ref()
//控制对话框的显示与隐藏
let dialogFormVisible = ref<boolean>(false)
//收集添加/编辑品牌按钮中input框中输入的内容
let tradeMarkInfo = reactive<any>({
  id: 0,
  tmName: '',
  logoUrl: '',
})

const getProductInfo = async (pageNumber = 1) => {
  let result: tmResponseData = await reqTradeMark(PageNo.value, PageCount.value)
  if (result.code == 200) {
    total.value = result.data.total
    TradeMark.value = result.data.records
    PageNo.value = pageNumber
    ElMessage({
      type: 'success',
      message: '列表已更新',
    })
  }
}
const changSize = () => {
  PageNo.value = 1
  getProductInfo(PageNo.value)
}

//添加品牌按钮功能
const addTradeMark = () => {
  nextTick(() => {
    formRef.value.clearValidate('tmName')
    formRef.value.clearValidate('logo')
  })

  dialogFormVisible.value = true
  tradeMarkInfo.tmName = ''
  tradeMarkInfo.logoUrl = ''
  tradeMarkInfo.id = 0
  //nexttick获取响应式数据发生变化，页面更新后的dom
}

//编辑品牌按钮功能
const editTradeMark = async (row: TradeMark) => {
  //清空校验结果错误的信息
  nextTick(() => {
    formRef.value.clearValidate('tmName')
    formRef.value.clearValidate('logo')
  })
  tradeMarkInfo.id = row.id
  tradeMarkInfo.tmName = row.tmName
  tradeMarkInfo.logoUrl = row.logoUrl
  dialogFormVisible.value = true
}
//对话框提交按钮
const comfirm = async () => {
  // 表单校验通过后才可以点击确认，只有全部通过才可以提交表单  validate返回一个promise函数
  await formRef.value.validate()
  //添加品牌，向服务器发送请求
  if (tradeMarkInfo.id == 0) {
    let result = await reqAddTradeMark(tradeMarkInfo)
    if (result.code == 200) {
      getProductInfo(1)
      ElMessage({
        type: 'success',
        message: '添加品牌成功!',
      })
      formRef.value.clearValidate('tmName')
      formRef.value.clearValidate('logo')
    } else {
      ElMessage({
        type: 'error',
        message: '添加品牌失败!',
      })
      formRef.value.clearValidate('tmName')
      formRef.value.clearValidate('logo')
    }
    dialogFormVisible.value = false
  } else {
    //发送更新品牌请求
    let result = await reqUpdateTradeMark(tradeMarkInfo)
    if (result.code == 200) {
      getProductInfo(PageNo.value)
      ElMessage({
        type: 'success',
        message: '修改品牌成功!',
      })
      dialogFormVisible.value = false
      formRef.value.clearValidate('tmName')
      formRef.value.clearValidate('logo')
    } else {
      ElMessage({
        type: 'error',
        message: '修改品牌失败!',
      })
      formRef.value.clearValidate('tmName')
      formRef.value.clearValidate('logo')
      dialogFormVisible.value = false
    }
  }
}
//对话框取消按钮
const cancel = () => {
  dialogFormVisible.value = false
}
//上传之前调用的钩子  ->  限制用户上传图片的格式和大小
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  //钩子是再图片上传成功之前触发，上传文件之前可以约束文件类型和大小
  //要求：上传文件格式png|jpg|jpeg|gif 4M
  if (
    rawFile.type == 'image/png' ||
    rawFile.type == 'image/jpg' ||
    rawFile.type == 'image/jpeg' ||
    rawFile.type == 'image/gif'
  ) {
    if (rawFile.size / 1024 / 1024 < 4) {
      return true
    } else {
      ElMessage({
        type: 'error',
        message: '上传文件大小必须小于2M',
      })
    }
  } else {
    ElMessage({
      type: 'error',
      message: '上传文件必须是jpg|jpeg|png|gif',
    })
    return false
  }
}
//上传成功时的钩子
const handleAvatarSuccess: UploadProps['onSuccess'] = (res) => {
  //收集服务器返回回来的数据  res是服务器返回的对象，data是图片在服务器的url地址,并用来展示
  tradeMarkInfo.logoUrl = res.data
  formRef.value?.clearValidate('logo')
  //console.log(tradeMarkInfo)
}

onMounted(() => {
  //组件一挂载，就像服务器请求商品信息，并展示，展示页码为第1页
  getProductInfo(1)
})
//品牌校验自定义规则
const validatortmName = (_rule: any, value: any, callback: any) => {
  if (value.trim().length >= 2) {
    callback()
  } else {
    callback(new Error('品牌名至少要2个字'))
  }
}
//图片校验规则
const validatorlogoUrl = (_rule: any, value: any, callback: any) => {
  console.log(66666, value)
  if (tradeMarkInfo.logoUrl) {
    callback()
  } else {
    callback(new Error('品牌logo必须要上传'))
  }
}

//定义表单校验规则
const rules = {
  tmName: [{ required: true, trigger: 'blur', validator: validatortmName }],
  logo: [{ required: true, validator: validatorlogoUrl }],
}

//气泡确认框确认按钮
const removeMark = async (id: number) => {
  //点击确定，向服务器发送删除请求
  let result = await reqDeleteTradeMark(id)
  if (result.code == 200) {
    //删除请求成功后获取品牌列表，当前页商品数量大于1的话 留在当前页，否则页码展示上一页
    getProductInfo(TradeMark.value.length < 1 ? PageNo.value - 1 : PageNo.value)

    ElMessage({
      type: 'success',
      message: '已删除',
    })
  } else {
    ElMessage({
      type: 'error',
      message: '删除失败!',
    })
  }
}
</script>

<style lang="scss" scoped>
.el-table {
  margin: 10px 0;
}

.TradeMarkLogo {
  width: $base_trademark_logo_width;
  height: $base_trademark_logo_height;
}

.el-icon-upload {
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    width: 100px;
    height: 100px;
  }
}

.el-upload__text {
  font-size: 10px;
}
</style>
