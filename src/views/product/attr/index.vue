<template>
  <div>
    <Category :show="show"></Category>

    <el-card style="margin-top: 12px">
      <div v-show="show == 0">
        <el-button
          type="primary"
          icon="Tickets"
          :disabled="useCatgory.C3Id ? false : true"
          @click="addAttr"
          :v-has="btn.Trademark.add"
        >
          添加属性
        </el-button>
        <el-table border style="margin-top: 12px" :data="attrArr">
          <el-table-column
            label="序号"
            width="80px"
            align="center"
            type="index"
          ></el-table-column>
          <el-table-column
            label="属性名"
            width="180px"
            align="center"
            prop="attrName"
          ></el-table-column>
          <el-table-column label="属性值" align="center">
            <template #="{ row }">
              <el-tag
                style="margin: 5px"
                v-for="item in row.attrValueList"
                :key="item.id"
              >
                {{ item.valueName }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200px" align="center">
            <template #="{ row }">
              <el-button
                type="primary"
                icon="Edit"
                size="small"
                @click="undateAttr(row)"
              ></el-button>

              <el-popconfirm
                :title="`你确定要删除属性${row.attrName}吗？`"
                width="240px"
                icon="delete"
                icon-color="red"
                @confirm="removeAttr(row)"
              >
                <template #reference>
                  <el-button
                    type="danger"
                    icon="Delete"
                    size="small"
                  ></el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 添加属性的页面 -->
      <div class="add" v-show="show == 1">
        <el-form :inline="true">
          <el-form-item label="属性名称:">
            <el-input
              placeholder="请输入属性名"
              v-model="attrParams.attrName"
            ></el-input>
          </el-form-item>
        </el-form>
        <el-button
          icon="Plus"
          type="primary"
          @click="addAttrName"
          :disabled="attrParams.attrName ? false : true"
        >
          添加属性
        </el-button>
        <!-- <el-button @click="cancel">取消</el-button> -->
        <el-table
          style="margin: 12px 0px"
          :border="true"
          :data="attrParams.attrValueList"
        >
          <el-table-column
            label="序号"
            width="80px"
            align="center"
            type="index"
          ></el-table-column>
          <el-table-column label="属性">
            <!-- row即为push进来的数组的对象 -->
            <template #="{ row, $index }">
              <el-input
                v-if="row.flag"
                @blur="toWatch(row)"
                placeholder="请输入属性值"
                v-model="row.valueName"
                :ref="(vc: any) => inputArr[$index] = vc"
              ></el-input>
              <div v-else @click="toEdit(row, $index)">{{ row.valueName }}</div>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200px" align="center">
            <template #="{ $index }">
              <el-button
                size="small"
                type="danger"
                icon="Delete"
                @click="attrParams.attrValueList.splice($index, 1)"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button
          id="jiance"
          type="primary"
          @click="save"
          :disabled="attrParams.attrValueList.length > 0 ? false : true"
        >
          保存
        </el-button>
        <el-button type="primary" @click="cancel">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import useCategoryStore from '@/store/modules/category'
import {
  reqAttr,
  reqAddorUpdateAttr,
  reqDeleteAttr,
} from '@/api/product/attr/index'
let useCatgory = useCategoryStore()
import { watch, ref, reactive, nextTick, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
let btn: any = document.getElementById('jiance')
let attrArr = ref<any>([])
let PanDuan = ref<any>()
//此变量用于控制显示列表还是添加属性页面
let show = ref<number>(0)
let inputArr = ref<any>([])
//新增一个收集属性和属性值的变量
let attrParams = reactive<any>({
  attrName: '', //新增属性的名称
  attrValueList: [], //新增属性的属性值(里面包括属性值id，属性值名称....)
  categoryLevel: 3, //分类的等级  为固定值3
  categoryId: '', //三级分类下的id
})
const getAttr = async () => {
  //发送请求获取属性值
  let result = await reqAttr(useCatgory.C1Id, useCatgory.C2Id, useCatgory.C3Id)
  //console.log(666, result)
  if (result.code == 200) {
    attrArr.value = result.data
  }
}

watch(
  () => useCatgory.C3Id,
  () => {
    //确保三级菜单有id才能发送请求
    if (useCatgory.C3Id) {
      getAttr()
    }
    attrArr.value = ''
  },
)

//点击添加属性按钮
const addAttr = () => {
  show.value = 1
  attrParams.attrName = ''
  attrParams.attrValueList = []
  attrParams.categoryId = useCatgory.C3Id
}

const cancel = () => {
  show.value = 0
}

//添加属性名回调
const addAttrName = () => {
  attrParams.attrValueList.push({
    valueName: '',
    flag: 'true', //控制编辑模式和查看模式的切换
  })

  nextTick(() => {
    inputArr.value[attrParams.attrValueList.length - 1].focus()
  })
}

//保存属性名的回调
const save = async () => {
  //console.log(123456, attrParams)
  let result = await reqAddorUpdateAttr(attrParams)
  if (result.code == 200) {
    show.value = 0
    ElMessage({
      type: 'success',
      message: attrParams.id ? '修改成功' : '添加成功',
    })
    //添加成功后获取所有的属性
    getAttr()
  } else {
    ElMessage({
      type: 'error',
      message: attrParams.id ? '修改失败' : '添加失败',
    })
  }
}
//切换显示模式，变为查看模式
const toWatch = (row: any) => {
  //如果属性值输入框为空，不能切换模式并且提示错误信息
  if (row.valueName.trim() == '') {
    ElMessage({
      type: 'error',
      message: '属性值不能为空',
    })
    PanDuan = attrParams.attrValueList.find((item: any) => {
      if (item.valueName === '') {
        return 1
      }
    })
    console.log(12345, PanDuan)
    btn.disabled = true
    return
  }
  //判断是否有重复的属性值
  let repate = attrParams.attrValueList.find((item: any) => {
    if (item != row) {
      return item.valueName === row.valueName
    }
  })
  if (repate) {
    ElMessage({
      type: 'error',
      message: '属性值不能重复添加!',
    })
    btn.disabled = true
    return
  }

  //console.log(123456,PanDuan)
  row.flag = false
}
//切换模式，变为编辑模式
const toEdit = (row: any, $index: any) => {
  row.flag = true

  nextTick(() => {
    inputArr.value[$index].focus()
  })
}

//更新已有属性功能的回调
const undateAttr = (row: any) => {
  show.value = 1
  //深拷贝,自身修改的值不会影响到被拷贝对象里面的值
  Object.assign(attrParams, JSON.parse(JSON.stringify(row)))
}

//删除已有属性功能的回调
const removeAttr = async (row: any) => {
  //console.log(row.id)
  let result = await reqDeleteAttr(row.id)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '已删除',
    })
    getAttr()
  } else {
    ElMessage({
      type: 'error',
      message: '删除失败了',
    })
  }
}

onMounted(() => {
  //组件一挂载完毕，调用仓库中$reset方法重置仓库数据，使顶部三个下拉菜单的数据清空
  useCatgory.$reset()
})
</script>

<style lang="scss" scoped></style>
