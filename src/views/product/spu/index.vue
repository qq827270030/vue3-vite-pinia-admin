<template>
  <div>
    <Category :show="show"></Category>
    <el-card style="margin: 10px 0">
      <div v-show="show == 0">
        <el-button
          type="primary"
          icon="Plus"
          :disabled="useCategory.C3Id ? false : true"
          @click="addSPU"
        >
          添加SPU
        </el-button>
        <el-table :border="true" style="margin: 10px 0" :data="SPUrecords">
          <el-table-column
            label="序号"
            align="center"
            width="80px"
            type="index"
          ></el-table-column>
          <el-table-column
            label="SPU名称"
            align="center"
            width="150px"
            prop="spuName"
          ></el-table-column>
          <el-table-column
            label="SPU描述"
            align="center"
            prop="description"
          ></el-table-column>
          <el-table-column label="操作" align="center" width="300px">
            <template #="{ row }">
              <el-button
                size="small"
                type="primary"
                icon="Plus"
                title="添加商品属性"
                @click="addSKU(row)"
              ></el-button>
              <el-button
                size="small"
                type="warning"
                icon="Edit"
                title="编辑"
                @click="updateSpu(row)"
              ></el-button>
              <el-button
                size="small"
                type="info"
                icon="Postcard"
                title="查看详情"
                @click="selectSku(row)"
              ></el-button>
              <el-popconfirm
                :title="`确定删除${toDeleteSpuName}?`"
                icon="Delete"
                icon-color="red"
                width="200px"
                @confirm="DeleteSpu(row)"
              >
                <template #reference>
                  <el-button
                    size="small"
                    type="danger"
                    icon="Delete"
                    title="删除"
                    @click="removeSpu(row)"
                  ></el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
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
          @size-change="changSize"
          @current-change="getSPU"
        ></ElPagination>
      </div>
      <SPUForm
        ref="spu"
        v-show="show == 1"
        @showSPU="showSPU"
        slot-scope="scope"
      ></SPUForm>
      <SKUForm ref="sku" v-show="show == 2" @showSKU="showSKU"></SKUForm>
      <el-dialog :title="`${toSelectSkuName}旗下所有SKU列表`" v-model="visable">
        <el-table :border="true" :data="skuDataList">
          <el-table-column
            label="名称"
            align="center"
            prop="skuName"
          ></el-table-column>
          <el-table-column
            label="价格(元)"
            align="center"
            prop="price"
          ></el-table-column>
          <el-table-column
            label="重量(g)"
            align="center"
            prop="weight"
          ></el-table-column>
          <!-- <el-table-column label="描述" align="center" prop="skuDesc"></el-table-column> -->
          <el-table-column label="照片" align="center">
            <template #="{ row }">
              <img
                :src="row.skuDefaultImg"
                alt="row.createTime"
                style="width: 100px; height: 100px"
              />
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import {
  reqGetSPU,
  reqSelectSkuInfo,
  reqRemoveSpu,
} from '@/api/product/spu/index'
import useCategoryStore from '@/store/modules/category'
//获取spu子组件VC实例的一个变量
let spu = ref<any>()
//给sku子组件VC实例一个变量
let sku = ref<any>()
//控制是否显示对话框
let visable = ref(false)
import SPUForm from './spuForm.vue'
import SKUForm from './skuForm.vue'
import { ElMessage } from 'element-plus'
// import { ElMessage } from 'element-plus';
let SPUrecords = ref([])
let show = ref<number>(0) // 0:显示已有的SPU数据  1:添加或编辑SPU表单  2:新增或修改SKU表单
let PageCount = ref(4)
let total = ref(0)
let PageNo = ref(1)
let useCategory = useCategoryStore()
let toSelectSkuName = ref<any>()
let toDeleteSpuName = ref<any>()

let skuDataList = ref<any>([])
//发送请求，获取已有的spu数据
const getSPU = async (page = 1) => {
  PageNo.value = page
  let result: any = await reqGetSPU(
    PageNo.value,
    PageCount.value,
    useCategory.C3Id,
  )
  if (result.code == 200) {
    SPUrecords.value = result.data.records
    total.value = result.data.total
    // ElMessage({
    //     type: 'success',
    //     message: '列表已更新'
    // })
  }
}

watch(
  () => useCategory.C3Id,
  () => {
    if (useCategory.C3Id) {
      getSPU()
    }
  },
)

const changSize = () => {
  PageNo.value = 1
  getSPU()
}

//新增SPU按钮功能回调
const addSPU = () => {
  //隐藏已有列表，让新增或修改表单显示
  show.value = 1
  spu.value.getSpuNewMessage()
}
//新增SKU按钮功能回调
const addSKU = (row: any) => {
  //隐藏已有列表，让sku表单显示
  show.value = 2
  //子组件暴露出来的方法，父组件调用，并传递三个参数:c1Id,c2Id,spu对象
  sku.value.getSkuNewMessage(useCategory.C1Id, useCategory.C2Id, row)
}
//点击切换spu表单显示功能的回调
const showSPU = (actions: any) => {
  //子组件spuform点击取消 传过来参数0  转换场景
  show.value = actions.show
  let AddOrUpdate = actions.action
  if (AddOrUpdate == 'update') {
    getSPU(PageNo.value)
  } else if (AddOrUpdate == 'add') {
    getSPU()
  } else {
    getSPU(PageNo.value)
  }
}

//点击切换sku表单显示功能的回调
const showSKU = (num: number) => {
  show.value = num
}

//点击更新按钮的功能回调
const updateSpu = (row: any) => {
  show.value = 1
  spu.value.getSpuHasMessage(row)
}

//点击查看sku信息的功能回调
const selectSku = async (row: any) => {
  toSelectSkuName.value = row.spuName
  visable.value = true
  //发送请求
  let result = await reqSelectSkuInfo(row.id)
  console.log(result)

  if (result.code == 200) {
    skuDataList.value = result.data
  }
}

//删除sku按钮的功能回调
const removeSpu = async (row: any) => {
  //console.log(row)
  toDeleteSpuName.value = row.spuName
}

const DeleteSpu = async (row: any) => {
  let result = await reqRemoveSpu(row.id)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '已删除',
    })
    getSPU(PageNo.value)
  }
}

onMounted(() => {
  //组件一挂在调用仓库的$reset方法清空仓库，清空顶部下拉菜单的数据
  useCategory.$reset()
})
</script>

<style lang="scss" scoped></style>
