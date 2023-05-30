<template>
  <el-form label-width="100px">
    <el-form-item label="SKU名称">
      <el-input
        placeholder="请输入SKU名称"
        v-model="SkuParams.skuName"
      ></el-input>
    </el-form-item>
    <el-form-item label="价格(元)">
      <el-input
        placeholder="请输入价格(元)"
        type="number"
        v-model="SkuParams.price"
      ></el-input>
    </el-form-item>
    <el-form-item label="重量(g)">
      <el-input
        placeholder="请输入重量(g)"
        type="number"
        v-model="SkuParams.weight"
      ></el-input>
    </el-form-item>
    <el-form-item label="SKU描述">
      <el-input
        placeholder="请输入描述内容"
        v-model="SkuParams.skuDesc"
      ></el-input>
    </el-form-item>
    <el-form-item label="平台属性">
      <el-form :inline="true" label-width="100px">
        <el-form-item
          v-for="item1 in AttrList"
          :key="item1.id"
          :label="item1.attrName"
          size="small"
          style="margin: 0 10px"
        >
          <el-select v-model="item1.attrIdAndValueId">
            <el-option
              v-for="item2 in item1.attrValueList"
              :key="item2.id"
              :label="item2.valueName"
              :value="`${item1.id}:${item2.id}`"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>

    <el-form-item label="销售属性">
      <el-form :inline="true" label-width="100px">
        <el-form-item
          v-for="item3 in SaleList"
          :key="item3.id"
          :label="item3.saleAttrName"
          size="small"
          style="margin: 0 10px"
        >
          <el-select v-model="item3.saleIdAndValueId">
            <el-option
              v-for="item4 in item3.spuSaleAttrValueList"
              :key="item4.id"
              :label="item4.saleAttrValueName"
              :value="`${item3.id}:${item4.id}`"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>

    <el-form-item label="图片详情">
      <el-table :border="true" :data="ImgList" ref="table">
        <el-table-column
          type="selection"
          width="50px"
          align="center"
        ></el-table-column>
        <el-table-column label="图片" align="center">
          <template #="{ row }">
            <img :src="row.imgUrl" alt="" style="width: 100px; height: 100px" />
          </template>
        </el-table-column>
        <el-table-column
          label="名称"
          width="250px"
          align="center"
          prop="imgName"
        ></el-table-column>
        <el-table-column label="操作" width="250px" align="center">
          <template #="{ row }">
            <el-button
              :type="
                row.imgUrl == SkuParams.skuDefaultImg ? 'success' : 'warning'
              "
              @click="setDefaultImg(row)"
              :disabled="row.imgUrl == SkuParams.skuDefaultImg ? true : false"
            >
              {{
                row.imgUrl == SkuParams.skuDefaultImg ? '已设置' : '设为默认'
              }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <div class="save">
      <el-form-item>
        <el-button type="primary" @click="saveData">保存</el-button>
        <el-button @click="exitSKU">取消</el-button>
      </el-form-item>
    </div>
  </el-form>
</template>

<script setup lang="ts">
import { reqAttr } from '@/api/product/attr/index'
import {
  reqGetSpuImageList,
  reqGetSpuSaleAttrList,
  reqAddSku,
} from '@/api/product/spu/index'
import { ElMessage } from 'element-plus'
import { ref, reactive } from 'vue'
let $emit = defineEmits(['showSKU'])
//平台属性
let AttrList = ref<any>([])
//销售属性
let SaleList = ref<any>([])
//照片墙
let ImgList = ref<any>([])
//定义table实例
let table = ref<any>()
//定义收集sku的变量
let SkuParams = reactive<any>({
  category3Id: '', //三级分类的id
  spuId: '', //已有的spu的id
  tmId: '', //已有的品牌id
  skuName: '', //sku名
  price: '', //sku价格
  weight: '', //sku重量
  skuDesc: '', //sku描述
  skuAttrValueList: [], //sku平台属性
  skuSaleAttrValueList: [], //sku销售属性
  skuDefaultImg: '', //sku默认展示图片
})
//点击取消按钮，离开spk页面，通知父组件切换场景
const exitSKU = () => {
  $emit('showSKU', 0)
}

const getSkuNewMessage = async (c1Id: any, c2Id: any, spuData: any) => {
  //清空上一次添加sku的数据
  SkuParams.skuName = ''
  SkuParams.price = ''
  SkuParams.weight = ''
  SkuParams.skuDesc = ''
  //收集数据：上传新增接口需要的数据
  SkuParams.category3Id = spuData.category3Id
  SkuParams.spuId = spuData.id
  SkuParams.tmId = spuData.tmId
  //获取平台属性
  let result1: any = await reqAttr(c1Id, c2Id, spuData.category3Id)
  //获取对应的销售属性
  let result2: any = await reqGetSpuSaleAttrList(spuData.id)
  //获取对应的照片墙数据
  let result3: any = await reqGetSpuImageList(spuData.id)

  //收集平台属性
  AttrList.value = result1.data
  //收集销售属性
  SaleList.value = result2.data
  //收集照片墙数据
  ImgList.value = result3.data
}

const setDefaultImg = (row: any) => {
  //收集数据
  SkuParams.skuDefaultImg = row.imgUrl
  ImgList.value.forEach((_item: any) => {
    table.value.clearSelection()
  })
  table.value.toggleRowSelection(row, true)
  console.log(row)
}

//保存按钮功能的方法回调
const saveData = async () => {
  //整理数据
  //平台属性
  SkuParams.skuAttrValueList = AttrList.value.reduce((pre: any, cur: any) => {
    if (cur.attrIdAndValueId) {
      let [attrId, valueId] = cur.attrIdAndValueId.split(':')
      pre.push({
        attrId,
        valueId,
      })
    }
    return pre
  }, [])

  //销售属性
  SkuParams.skuSaleAttrValueList = SaleList.value.reduce(
    (pre: any, cur: any) => {
      if (cur.saleIdAndValueId) {
        let [saleAttrId, saleAttrValueId] = cur.saleIdAndValueId.split(':')
        pre.push({
          saleAttrId,
          saleAttrValueId,
        })
      }
      return pre
    },
    [],
  )

  //发请求，添加新的sku的请求
  let result = await reqAddSku(SkuParams)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '添加成功',
    })
    $emit('showSKU', 0)
  } else {
    ElMessage({
      type: 'error',
      message: '添加失败',
    })
  }
}
defineExpose({ getSkuNewMessage })
</script>

<style lang="scss" scoped>
.save {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
}
</style>
