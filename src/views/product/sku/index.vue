<template>
  <el-card>
    <el-table :border="true" :data="SkuRecords">
      <el-table-column
        label="序号"
        width="60px"
        align="center"
        type="index"
      ></el-table-column>
      <el-table-column
        label="名称"
        width="200px"
        align="center"
        prop="skuName"
      ></el-table-column>
      <el-table-column
        label="价格(元)"
        width="120px"
        align="center"
        prop="price"
      ></el-table-column>
      <el-table-column
        label="重量(g)"
        width="120px"
        align="center"
        prop="weight"
      ></el-table-column>
      <el-table-column label="图片" width="130px" align="center">
        <template #="{ row }">
          <img :src="row.skuDefaultImg" style="width: 100px; height: 100px" />
        </template>
      </el-table-column>
      <el-table-column
        label="描述"
        width="300px"
        align="center"
        prop="skuDesc"
      ></el-table-column>
      <el-table-column label="操作" align="center" fixed="right" width="210px">
        <template #="{ row }">
          <el-button
            :type="row.isSale == 1 ? 'success' : 'warning'"
            :icon="row.isSale == 1 ? 'SoldOut' : 'Sell'"
            size="small"
            @click="toSale(row)"
            title="上架商品"
          ></el-button>
          <el-button
            type="primary"
            icon="Edit"
            size="small"
            @click="edit"
            title="编辑"
          ></el-button>
          <el-button
            type="info"
            icon="Reading"
            size="small"
            @click="toLook(row)"
            title="查看详情"
          ></el-button>
          <el-popconfirm
            :title="`确定删除${FindSkuName}?`"
            icon="Delete"
            icon-color="red"
            width="200px"
            @confirm="deleteSku(row)"
          >
            <template #reference>
              <el-button
                type="danger"
                icon="Delete"
                size="small"
                @click="removeSku(row)"
                title="删除商品"
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
      :page-sizes="[3, 4, 5, 6, 7, 8]"
      layout="sizes, <-, prev, pager, next, jumper, ->,total"
      v-model:current-page="PageNo"
      v-model:page-size="PageCount"
      @size-change="changSize"
      @current-change="changPage"
    ></ElPagination>
    <!-- 抽屉页面 -->
    <el-drawer title="商品详情" v-model="drawer" :modal="true">
      <el-form :inline="true" style="margin-top: -30px">
        <el-form-item label="名称:">{{ FindSkuName }}</el-form-item>
        <br />
        <el-form-item label="描述:">{{ FindSkuDesc }}</el-form-item>
        <br />
        <el-form-item label="价格:">{{ FindSkuPrice }}元</el-form-item>
        <br />
        <el-form-item label="描述:">{{ FindSkuWeight }}g</el-form-item>
        <br />
        <el-form-item label="平台属性:">
          <template #="">
            <el-tag
              style="margin: 5px 5px"
              type="success"
              v-for="item in FindskuAttrValueList"
              :key="item.id"
            >
              {{ item.attrName }}
            </el-tag>
          </template>
        </el-form-item>
        <br />
        <el-form-item label="销售属性:">
          <template #=" ">
            <el-tag
              type="danger"
              style="margin: 5px 5px"
              v-for="item in FindskuSaleAttrValueList"
              :key="item.id"
            >
              {{ item.saleAttrValueName }}
            </el-tag>
          </template>
        </el-form-item>
      </el-form>
      <el-carousel style="margin-top: 12px" trigger="click" height="400px">
        <el-carousel-item v-for="item in FindskuImgList" :key="item.id">
          <img :src="item.imgUrl" alt="" style="width: 400px; height: 300px" />
        </el-carousel-item>
      </el-carousel>
    </el-drawer>
  </el-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  reqGetSkuInfo,
  reqOnSale,
  reqDownSale,
  reqGetSkuDetail,
  reqRemoveSku,
} from '@/api/product/sku/index'
import { ElMessage } from 'element-plus'
let PageNo = ref<number>(1)
let PageCount = ref<number>(4)
let total = ref<number>(0)
let SkuRecords = ref<any>([])
//收集sku名称
let FindSkuName = ref<any>()
//收集sku描述
let FindSkuDesc = ref<any>()
//收集sku商品价格
let FindSkuPrice = ref<any>()
//收集sku商品重量
let FindSkuWeight = ref<any>()
//收集sku平台属性
let FindskuAttrValueList = ref<any>([])
//收集sku销售属性
let FindskuSaleAttrValueList = ref<any>([])
//收集sku照片数据
let FindskuImgList = ref<any>([])
//定义一个显示与隐藏抽屉的变量
let drawer = ref<boolean>(false)
const GetSku = async (page = 1) => {
  PageNo.value = page
  let result: any = await reqGetSkuInfo(PageNo.value, PageCount.value)
  //console.log(result)
  if (result.code == 200) {
    SkuRecords.value = result.data.records
    total.value = result.data.total
    ElMessage({
      type: 'success',
      message: '列表已更新',
    })
  }
}
//点击换页的功能回调
const changPage = () => {
  GetSku(PageNo.value)
}

//改变分页器显示条数
const changSize = () => {
  GetSku()
}

//上架按钮的功能回调
const toSale = async (row: any) => {
  // console.log(row)
  FindSkuName.value = row.skuName
  //先判断商品是否正在上架
  if (row.isSale == 1) {
    let result1 = await reqDownSale(row.id)
    if (result1.code == 200) {
      ElMessage({
        type: 'success',
        message: `${FindSkuName.value}已下架`,
      })
    }
  } else {
    let result2 = await reqOnSale(row.id)
    if (result2.code == 200) {
      ElMessage({
        type: 'success',
        message: `${FindSkuName.value}已上架`,
      })
    }
  }
  GetSku(PageNo.value)
}

//查看sku商品详情，点击弹出抽屉功能回调
const toLook = async (row: any) => {
  FindSkuName.value = row.skuName
  FindSkuDesc.value = row.skuDesc
  FindSkuPrice.value = row.price
  FindSkuWeight.value = row.weight
  //发送请求获取数据
  let result = await reqGetSkuDetail(row.id)
  console.log(result)
  if (result.code == 200) {
    FindskuAttrValueList.value = result.data.skuAttrValueList
    FindskuSaleAttrValueList.value = result.data.skuSaleAttrValueList
    FindskuImgList.value = result.data.skuImageList
  }

  drawer.value = true
}

//删除按钮功能回调
const removeSku = (row: any) => {
  FindSkuName.value = row.skuName
}

//气泡确认框删除功能回调
const deleteSku = async (row: any) => {
  let result = await reqRemoveSku(row.id)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '已删除',
    })
    GetSku(SkuRecords.value.length > 1 ? PageNo.value : PageNo.value - 1)
  } else {
    ElMessage({
      type: 'error',
      message: '系统展示数据不能删除！',
    })
  }
}

//编辑按钮功能回调
const edit = () => {
  ElMessage({
    type: 'info',
    message: '该功能正在研发中....',
  })
}
onMounted(() => {
  GetSku()
})
</script>

<style lang="scss" scoped></style>
