<template>
  <div>
  <el-row>
    <el-col :span="9">
      <span class="demonstration"> *</span>
      <span class="demonstration"> 选择时间：</span>
      <el-select v-model="type_time_value" placeholder="请选择" style="width: 180px">
        <el-option
          v-for="item in type_time"
          :key="item.value"
          :label="item.value"
          :value="item.value">
        </el-option>
      </el-select>
    </el-col>
<!--            <el-form-item label="日期">-->
    <el-col :span="8">
              <mark
                style="position:fixed;top:0;bottom:0;left:0;right:0;background:rgba(0,0,0,0);z-index:999;"
                v-show="showSeason"
                @click.stop="showSeason=false"
              ></mark>

        <el-input placeholder="请选择季度" v-model="showValue" style="width:138px;" @focus="showSeason=true" v-show="seasonShow">
          <i slot="prefix" class="el-input__icon el-icon-date"></i>
        </el-input>
        <el-card
          class="box-card"
          style="width:322px;padding: 0 3px 20px;margin-top:10px;position:fixed;z-index:9999"
          v-show="showSeason"
        >
          <div slot="header" class="clearfix" style="text-align:center;padding:0">
            <button
              type="button"
              aria-label="前一年"
              class="el-picker-panel__icon-btn el-date-picker__prev-btn el-icon-d-arrow-left"
              @click="prev"
            ></button>
            <span role="button" class="el-date-picker__header-label">{{year}}年</span>
            <button
              type="button"
              aria-label="后一年"
              @click="next"
              class="el-picker-panel__icon-btn el-date-picker__next-btn el-icon-d-arrow-right"
            ></button>
          </div>
          <div class="text item" style="text-align:center;">
            <el-button
              type="text"
              size="medium"
              style="width:40%;color: #606266;float:left;"
              @click="selectSeason(0)"
            >第一季度</el-button>
            <el-button
              type="text"
              size="medium"
              style="float:right;width:40%;color: #606266;"
              @click="selectSeason(1)"
            >第二季度</el-button>
          </div>
          <div class="text item" style="text-align:center;">
            <el-button
              type="text"
              size="medium"
              style="width:40%;color: #606266;float:left;"
              @click="selectSeason(2)"
            >第三季度</el-button>
            <el-button
              type="text"
              size="medium"
              style="float:right;width:40%;color: #606266;"
              @click="selectSeason(3)"
            >第四季度</el-button>
          </div>
        </el-card>
    </el-col>
<!--            </el-form-item>-->
    <el-col :span="8">
    <el-date-picker
        v-model="value1"
        type="month"
        placeholder="选择月" v-show="monthShow">
      </el-date-picker>
    </el-col>
</el-row>

<div>
  <div style="height: 30px;"></div>
    <span class="demonstration"> *</span>
    <span class="demonstration"> 统计方式：</span>
<!--    <el-input ref="input" v-model="input_value" placeholder="请输入内容" style="width: 219px"></el-input>-->
    <el-select v-model="type_options_value" placeholder="统计方式" style="width: 180px">
      <el-option
        v-for="item in type_options"
        :key="item.value"
        :label="item.value"
        :value="item.value">
      </el-option>
    </el-select>
  <el-button type="primary" @click="getSearchData()">查询</el-button>

</div>
    <el-table :data="datas" style="margin-top: 30px" v-show="showResult">
      <el-table-column align="center"
                       v-for="{ prop, label } in colConfigs"
                       :key="prop"
                       :prop="prop"
                       :label="label">
                       >

      </el-table-column>
<!--      <el-table-column align="center"-->
<!--                       prop="id"-->
<!--                       label="用户数"-->
<!--                       >-->

<!--      </el-table-column>-->
    </el-table>

  </div>
</template>

<script>
    export default {
      name: 'level2Statistics',
      data: function () {
        return {
          type_options_value: '',
          type_options: [{
            value: '中心分公司'
          }, {
            value: '营业部'
          }, {
            value: '支付方式'
          }, {
            value: '商品名称'
          }],
          input_value: '',
          value1: '',
          showSeason: false,
          season: '',
          year: new Date().getFullYear(),
          showValue: '',
          type_time_value: '',
          type_time: [{
            value: '按月统计'
          }, {
            value: '按季度统计'
          }],
          seasonShow: false,
          monthShow: false,
          showResult: true,
          datas: '',
          colConfigs: [{
            prop:prop,
            label:type_options_value
          },{
            prop:prop,
            label:type_options_value
          }]
        }
      },
      props: {
        valueArr: {
          default: () => {
            return ['01-03', '04-06', '07-09', '10-12']
          },
          type: Array
        },
        getValue: {
          default: () => {},
          type: Function
        },
        defaultValue: {
          default: '',
          type: String
        }
      },
      created () {
        if (this.defaultValue) {
          let value = this.defaultValue
          let arr = value.split('-')
          this.year = arr[0].slice(0, 4)
          let str = arr[0].slice(4, 6) + '-' + arr[1].slice(4, 6)
          let arrAll = this.valueArr
          this.showValue = `${this.year}年${arrAll.indexOf(str) + 1}季度`
        }
      },
      watch: {
        defaultValue (value, oldValue) {
          let arr = value.split('-')
          this.year = arr[0].slice(0, 4)
          let str = arr[0].slice(4, 6) + '-' + arr[1].slice(4, 6)
          let arrAll = this.valueArr
          this.showValue = `${this.year}年${arrAll.indexOf(str) + 1}季度`
        },
        type_time_value (curValue, oldValue) {
          if (curValue === '按月统计') {
            this.seasonShow = false
            this.monthShow = true
          } else if (curValue === '按季度统计') {
            this.seasonShow = true
            this.monthShow = false
          }
        },
        type_options_value (curValue, oldValue){

        }
      },
      methods: {
        one () {
          this.showSeason = false
        },
        prev () {
          this.year = this.year * 1 - 1
        },
        next () {
          this.year = this.year * 1 + 1
        },
        selectSeason (i) {
          let that = this
          that.season = i + 1
          let arr = that.valueArr[i].split('-')
          that.getValue(that.year + arr[0] + '-' + that.year + arr[1])
          that.showSeason = false
          this.showValue = `${this.year}年${this.season}季度`
        }
      }
    }
</script>

<style scoped>

</style>
