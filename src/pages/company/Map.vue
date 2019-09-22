<template>
  <div class="map">
    <div id="map-core"></div>
    <div class="margin-top-10">定位地址：<strong>{{showAddress}}</strong></div>
    <div class="search" v-show="mapXY.edit">
      <div id="r-result">
        <p>搜索定位:</p>
        <input type="text" id="suggestId" class="el-input__inner" style="width: 200px; height: 36px; line-height: 36px;" />
      </div>
      <div class="lng-lat">
        <div class="item">
          <p>当前经度:</p>
          <el-input type="text" v-model="location.lng" style="width: 160px;" />
        </div>
        <div class="item">
          <p>当前纬度:</p>
          <el-input type="text" v-model="location.lat" style="width: 160px;" />
        </div>
      </div>
      <el-button size="small" class="margin-left-20" type="primary" @click="selectLocation">确定</el-button>
    </div>
  </div>
</template>

<script>
  import BMap from 'BMap'
  export default {
    props: {
      mapXY: {
        type: Object
      }
    },
    data() {
      return {
        location: {
          lng: '',
          lat: ''
        },
        map: {},
        ac: {},
        showAddress: ''
      }
    },
    watch: {
      'location': {
        handler() {
          this.drawLocation()
        },
        deep: true
      }, 
      'mapXY': {
        handler() {
          this.getData()
        },
        deep: true
      }
    },
    mounted() {
      this.setMap()
      this.setSearch()
    },
    created() {
      this.getData();
    },
    methods: {
      getData() {
        setTimeout(()=> {
          if (this.mapXY && this.mapXY.xData && this.mapXY.yData) {
            this.location.lng = parseFloat(this.mapXY.xData).toFixed(3) || 0;
            this.location.lat = parseFloat(this.mapXY.yData).toFixed(3) || 0;
          } else {
            this.location.lng = 0;
            this.location.lat = 0;
          }
          this.setMap();
        }, 500);
      },
      // 初始化地图
      setMap() {
        this.map = new BMap.Map('map-core')
        this.map.centerAndZoom(new BMap.Point(113.275, 23.117), 11);
        // 创建地理编码实例      
        var myGeo = new BMap.Geocoder();      
        // 根据坐标得到地址描述    
        let self = this;
        let lng = this.location.lng;
        let lat = this.location.lat;
        myGeo.getLocation(new BMap.Point(lng, lat), function(result){    
            if (result){     
              self.showAddress = result.address;
            }      
        });
        // 地图缩放控件
        const topLeftControl = new BMap.ScaleControl({
          anchor: BMAP_ANCHOR_BOTTOM_LEFT
        })
        // 城市选择控件
        const cityListControl = new BMap.CityListControl({
          anchor: BMAP_ANCHOR_TOP_RIGHT
        })
        // 比例尺控件
        const topLeftNavigation = new BMap.NavigationControl()
        this.map.addControl(topLeftControl)
        this.map.addControl(topLeftNavigation)
        this.map.addControl(cityListControl)
        const _this = this
        // 鼠标缩放
        setTimeout(function () {
          _this.map.setZoom(11)
        }, 2000) // 2秒后放大到11级
        this.map.enableScrollWheelZoom(true)
        var geoc = new BMap.Geocoder();    
        // 点击获取经纬度
        this.map.addEventListener('click', function (e) {
          var pt = e.point;
          _this.location.lng = parseFloat(e.point.lng).toFixed(3)
          _this.location.lat = parseFloat(e.point.lat).toFixed(3)

          geoc.getLocation(pt, function(rs){
            var addComp = rs.addressComponents;
            _this.showAddress = addComp.province + ", " + addComp.city + ", " + addComp.district + ", " + addComp.street + ", " + addComp.streetNumber
          });     
        })
      },
      // 根据经纬度绘制地图中的坐标点
      drawLocation() {
        if (this.location.lng !== "" && this.location.lat !== "") {
          this.map.clearOverlays()
          const new_point = new BMap.Point(this.location.lng, this.location.lat);
          const marker = new BMap.Marker(new_point);
          this.map.addOverlay(marker);
          this.map.panTo(new_point);
        }
      },
      setSearch() {
        const _this = this
        //建立一个自动完成的对象
        this.ac = new BMap.Autocomplete({
          "input": "suggestId",
          "location": _this.map
        })
        //鼠标放在下拉列表上的事件
        this.ac.addEventListener("onhighlight", function (e) {
          let str = ""
          let _value = e.fromitem.value
          let value = ""
          if (e.fromitem.index > -1) {
            value = _value.province + _value.city + _value.district + _value.street + _value.business
          }
          value = ""
          if (e.toitem.index > -1) {
            _value = e.toitem.value
            value = _value.province + _value.city + _value.district + _value.street + _value.business
          }
        })
        let myValue
        //鼠标点击下拉列表后的事件
        this.ac.addEventListener("onconfirm", function (e) {
          let _value = e.item.value
          myValue = _value.province + _value.city + _value.district + _value.street + _value.business
          _this.setPlace(myValue);
        });
      },
      setPlace(myValue) {
        const _this = this
        //清除地图上所有覆盖物
        this.map.clearOverlays()
        //智能搜索
        this.local = new BMap.LocalSearch(_this.map, {
          onSearchComplete: _this.onSearchComplete
        });
        this.local.search(myValue);
        this.showAddress = myValue;
      },
      onSearchComplete() {
        //获取第一个智能搜索的结果
        let pp = this.local.getResults().getPoi(0).point
        this.location.lng = parseFloat(pp.lng).toFixed(3)
        this.location.lat = parseFloat(pp.lat).toFixed(3)
        this.map.centerAndZoom(pp, 18)
        //添加标注
        this.map.addOverlay(new BMap.Marker(pp))
      },
      // 向父组件传递经纬度
      selectLocation() {
        this.$message({
          message: '定位成功',
          type: 'success'
        });
        this.$emit('selectLocation', this.location)
      },
    }
  }

</script>

<style lang="scss" scoped>
  .map {
    width: 960px;
    height: 480px;
    font-size: 14px;

    #map-core {
      width: 100%;
      height: 80%;
    }

    .search {
      display: flex;
      margin-top: 10px;
      height: 40px;

      #r-result {
        display: flex;
        height: 40px;
        line-height: 40px;

        p {
          height: 20px;
          padding-right: 10px;
        }

        input {
          width: 180px;
          height: 20px;
        }
      }

      .lng-lat {
        display: flex;

        .item {
          display: flex;
          padding-left: 10px;
          height: 40px;
          line-height: 40px;

          p {
            height: 40px;
            padding-right: 10px;
          }

          input {
            width: 100px;
            height: 20px;
          }

          button {
            color: #fff;
            height: 28px;
            width: 60px;
            background: #40B0FF;
            border: 1px solid #40B0FF;
            border-radius: 2px;

            &:hover {
              background: #10B0FF;
              border: 1px solid #10B0FF;
              cursor: pointer;
            }
          }
        }
      }
    }
  }

</style>
