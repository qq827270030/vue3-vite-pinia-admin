<template>
  <el-form>
    <el-form-item label="SPU名称">
      <el-input
        type="text"
        placeholder="请输入名称"
        v-model="spuParams.spuName"
        required
      ></el-input>
    </el-form-item>
    <el-form-item label="SPU品牌">
      <el-select placeholder="请选择品牌" v-model="spuParams.tmId">
        <el-option
          v-for="item in AllTradeMrk"
          :key="item.id"
          :value="item.id"
          :label="item.tmName"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="SPU描述">
      <el-input
        type="textarea"
        v-model:model-value="spuParams.description"
      ></el-input>
    </el-form-item>
    <el-form-item label="SPU照片">
      <el-upload
        v-model:file-list="AllImageUrl"
        action="/api/admin/product/fileUpload"
        list-type="picture-card"
        :on-preview="handlePictureCard"
        :on-remove="handleRemove"
        :before-upload="beforeUpload"
      >
        <el-icon>
          <Plus />
        </el-icon>
      </el-upload>
      <el-dialog v-model="dialogVisible">
        <img w-full :src="dialogImageUrl" alt="Preview Image" />
      </el-dialog>
    </el-form-item>
    <el-form-item label="SPU销售属性">
      <el-select
        v-model="AllSpuSaleAttrIdAndValueName"
        :placeholder="
          unSelectSaleAttr.length
            ? `可选属性还有${unSelectSaleAttr.length}个`
            : `无属性可选`
        "
      >
        <el-option
          v-for="item in unSelectSaleAttr"
          :key="item.id"
          :label="item.name"
          :value="`${item.id}:${item.name}`"
        ></el-option>
      </el-select>
      <el-button
        :disabled="AllSpuSaleAttrIdAndValueName ? false : true"
        type="primary"
        icon="Plus"
        style="margin-left: 12px"
        @click="AddSpuSaleAttr"
      >
        添加销售属性
      </el-button>
    </el-form-item>

    <el-table :border="true" style="margin-bottom: 12px" :data="AllSpuSaleAttr">
      <el-table-column
        label="序号"
        width="80px"
        align="center"
        type="index"
      ></el-table-column>
      <el-table-column
        label="属性名"
        width="100px"
        align="center"
        prop="saleAttrName"
      ></el-table-column>
      <el-table-column label="属性值">
        <!-- row为已有的销售属性对象 -->
        <template #="{ row }">
          <el-tag
            style="margin: 0 5px"
            v-for="(item, index) in row.spuSaleAttrValueList"
            :key="row.id"
            effect="plain"
            closable
            @close="row.spuSaleAttrValueList.splice(index, 1)"
          >
            {{ item.saleAttrValueName }}
          </el-tag>
          <el-input
            @blur="toWatch(row)"
            v-if="row.TaginputVisible == true"
            v-model="row.saleAttrValueName"
            size="small"
            style="width: 80px"
          ></el-input>
          <el-button
            v-else
            icon="Plus"
            size="small"
            @click="showInput(row)"
          ></el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100px" align="center">
        <template #="{ $index }">
          <el-button
            type="danger"
            size="small"
            icon="Delete"
            @click="removeSaleAttr($index)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-button
      type="primary"
      @click="saveData"
      :disabled="AllSpuSaleAttr.length > 0 ? false : true"
    >
      保存
    </el-button>
    <el-button style="margin-left: 12px" @click="exitSPU">取消</el-button>
  </el-form>
</template>

<script setup lang="ts">
import {
  reqGetTradeMarkList,
  reqGetSpuImageList,
  reqGetSpuSaleAttrList,
  reqGetAllSaleAttr,
  reqAddorUpdateSpu,
} from '@/api/product/spu/index'
import { ElMessage, UploadProps } from 'element-plus'
import { ref, computed } from 'vue'
import useCategoryStore from '@/store/modules/category'
let useCategory = useCategoryStore()
let $emit = defineEmits(['showSPU'])
//定义存储所有品牌的数组
let AllTradeMrk = ref<any>([])
//定义存储所有图片url的数组
let AllImageUrl = ref<any>([])
//定义存储已有品牌的销售属性的数组
let AllSpuSaleAttr = ref<any>([])
//定义存储全部销售属性的数组
let AllSaleAttr = ref<any>([])
//定义一个变量用于是否展示对话框
let dialogVisible = ref<boolean>(false)
//定义对话框中图片的url
let dialogImageUrl = ref<any>()
//定义新增tag里输入的内容
// let TaginputValue = ref<any>()
//定义新增tag输入框的显示与隐藏

//定义新增的tag销售属性变量
// let inputTagArr = ref<any>([])
//定义收集还未选择的销售属性的id和name
let AllSpuSaleAttrIdAndValueName = ref<any>('')

//存储已有的spu对象，用于收集数据完成新增或更新spu
let spuParams: any = ref({
  category3Id: '', //3级分类的id
  spuName: '', //spu的名字
  description: '', //spu的描述
  tmId: '', //spu的id
  spuImageList: [], //照片墙
  spuSaleAttrList: [], //spu销售属性
})

const exitSPU = () => {
  $emit('showSPU', { show: 0, action: 'exit' })
}
//父组件新增spu按钮的回调方法，用来新增一个spu，此方法发送2个请求，一个获取所有品牌，一个获取所有销售属性
const getSpuNewMessage = async () => {
  //清空上一次添加遗留的数据
  spuParams.value.spuName = ''
  spuParams.value.description = ''
  spuParams.value.tmId = ''
  spuParams.value.spuImageList = []
  spuParams.value.spuSaleAttrList = []
  AllImageUrl.value = []
  AllSpuSaleAttr.value = []
  //AllSpuSaleAttrIdAndValueName=
  //获取全部品牌的请求
  let result1 = await reqGetTradeMarkList()
  //获取全部销售属性的请求
  let result2: any = await reqGetAllSaleAttr()

  AllTradeMrk.value = result1.data
  AllSaleAttr.value = result2.data
  spuParams.value.category3Id = useCategory.C3Id
}

//父组件更新按钮回调的方法，用来更新页面，所以此方法里面请求已有的spu数据
const getSpuHasMessage = async (row: any) => {
  //存储已有的spu数据
  spuParams.value = row
  //获取全部品牌的请求
  let result1: any = await reqGetTradeMarkList()
  //获取已有品牌的图片的请求
  let result2: any = await reqGetSpuImageList(row.id)
  //获取已有品牌的销售属性的请求
  let result3: any = await reqGetSpuSaleAttrList(row.id)
  //获取品牌全部的销售属性的请求
  let result4: any = await reqGetAllSaleAttr()
  //存储所有品牌
  AllTradeMrk.value = result1.data
  //存储品牌对应的图片url
  AllImageUrl.value = result2.data.map((item: any) => {
    return {
      name: item.imgName,
      url: item.imgUrl,
    }
  })
  //存储已有品牌的销售属性
  AllSpuSaleAttr.value = result3.data
  //存储所有的销售属性
  AllSaleAttr.value = result4.data
}
defineExpose({ getSpuHasMessage, getSpuNewMessage })

//照片墙查看图片详情的钩子
const handlePictureCard = (file: any) => {
  //对话框弹出
  dialogImageUrl = file.url
  dialogVisible.value = true
}
//照片墙删除图片的钩子
const handleRemove = () => {}

//照片墙上传成功前调用的钩子
const beforeUpload: UploadProps['beforeUpload'] = (rawFile) => {
  if (
    rawFile.type == 'image/png' ||
    rawFile.type == 'image/jpg' ||
    rawFile.type == 'image/jpeg'
  ) {
    if (rawFile.size / 1024 / 1024 < 2) {
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
      message: '上传文件必须是jpg|jpeg|png',
    })
    return false
  }
}
//照片墙上传成功后调用的钩子
// const handleAvatarSuccess: UploadProps['onSuccess'] = (res) => {

//     //AllImageUrl.value.push({ url: res.data })

//     console.log(123456,AllImageUrl.value)
// }

//定义新增销售属性tag的功能回调
const showInput = (row: any) => {
  //alert(666)
  row.TaginputVisible = true
  //console.log(123456,row.TaginputVisible)
  row.saleAttrValueName = ''
}
//属性值input框失去焦点时的功能回调
const toWatch = (row: any) => {
  //定义一个新的对象，将row里面的基础销售属性id和收集到的销售属性值名称push到接口规范的格式ValueList中去
  let newSaleAttrIdandValue = {
    baseSaleAttrId: row.baseSaleAttrId,
    saleAttrValueName: row.saleAttrValueName,
  }
  //判断输入框里输入的属性值是否为空
  if (newSaleAttrIdandValue.saleAttrValueName.trim() == '') {
    ElMessage({
      type: 'error',
      message: '属性值不能为空',
    })
    return
  }
  //判断输入框里输入的属性值是否有重复
  let repeat = row.spuSaleAttrValueList.find((item: any) => {
    return item.saleAttrValueName == newSaleAttrIdandValue.saleAttrValueName
  })
  console.log(123456, repeat)
  if (repeat) {
    ElMessage({
      type: 'error',
      message: '已存在该属性值',
    })
    return
  }
  //收集完并检测完后 添加到销售属性的数组中去
  row.spuSaleAttrValueList.push(newSaleAttrIdandValue)
  //失去焦点后 让按钮显示
  row.TaginputVisible = false
}

//计算未被选择的销售属性
let unSelectSaleAttr = computed(() => {
  let unSelectArr = AllSaleAttr.value.filter((item: any) => {
    return AllSpuSaleAttr.value.every((item1: any) => {
      return item.id != item1.baseSaleAttrId
    })
  })
  return unSelectArr
})

//按钮添加商品销售属性的功能回调
const AddSpuSaleAttr = () => {
  const [baseSaleAttrId, saleAttrName] =
    AllSpuSaleAttrIdAndValueName.value.split(':')

  //定义新的销售属性对象，保存并上传服务器
  let newSpuSaleAttr: any = {
    baseSaleAttrId,
    saleAttrName,
    spuSaleAttrValueList: [],
    TaginputVisible: false,
  }
  AllSpuSaleAttr.value.push(newSpuSaleAttr)
  //点击添加完之后要清空数组
  AllSpuSaleAttrIdAndValueName.value = ''
}

//点击表格内删除小按钮的功能回调
const removeSaleAttr = ($index: any) => {
  AllSpuSaleAttr.value.splice($index, 1)
}

//保存按钮功能的回调
const saveData = async () => {
  //整理收集过来的spu数据
  spuParams.value.spuImageList = AllImageUrl.value.map((item: any) => {
    return {
      imgName: item.name,
      imgUrl: (item.response && item.response.data) || item.url,
    }
  })
  spuParams.value.spuSaleAttrList = AllSpuSaleAttr.value
  // console.log(spuParams.value.spuSaleAttrList)
  //发送请求
  let result = await reqAddorUpdateSpu(spuParams.value)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: spuParams.value.id ? '更新成功' : '添加成功',
    })
  } else {
    ElMessage({
      type: 'error',
      message: spuParams.value.id ? '更新失败' : '添加失败',
    })
  }
  //关闭新增或修改的页面，返回spu主页
  $emit('showSPU', { show: 0, action: spuParams.value.id ? 'update' : 'add' })
}
</script>

<style lang="scss" scoped></style>
