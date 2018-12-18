<template>
  <div class="dashboard-container">
    <div class="dashboard-text">姓名 : {{ userInfo.nickName }}</div>
    <div class="dashboard-text">文章 : {{ userInfo.posts }}</div>
    <div class="dashboard-text">关注 : {{ userInfo.followups }}</div>
    <div class="dashboard-text">粉丝 : {{ userInfo.followers }}</div>
    <div class="dashboard-text">获赞 : {{ userInfo.thumbs }}</div>
    <div class="dashboard-text">礼物 : {{ userInfo.giftAmount }}</div>
  </div>
</template>

<script>
import { getUserBasicInfo } from '@/api/login'
export default {
  data() {
    return {
      userInfo: null
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      getUserBasicInfo().then(response => {
        this.userInfo = response.datas
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
