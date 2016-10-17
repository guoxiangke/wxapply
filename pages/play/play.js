// app-service
Page({
  onReady: function () {
    var that = this
    console.log('onLoad play')
    wx.getStorage({
      key: 'current_play_name',
      success: function(res) {
        console.log(res.data)
        that.setData({
          name: res.data
        })
      } 
    })
    wx.getStorage({
      key: 'current_play_src',
      success: function(res) {
        console.log(res.data)
        that.setData({
          src: res.data,
        })
      } 
    })
    // console.log(app.globalData,'global data in play!') //
  },
  data: {
    poster: 'http://ly.yongbuzhixi.com/fm/img/ybzx320.jpg',
    name: 'title',
    author: '永不止息',
    src: 'http://lywxaudio.yongbuzhixi.com/2016/cw/cw161010.mp3?_upt=65b2303a1476180249',
  },
  audioPlay: function () {
    this.setData({
      action: {
        method: 'play'
      }
    })
  },
  audioPause: function () {
    this.setData({
      action: {
        method: 'pause'
      }
    })
  },
  audioPlaybackRateSpeedUp: function () {
    this.setData({
      action: {
        method: 'setPlaybackRate',
        data: 2
      }
    })
  },
  audioPlaybackRateNormal: function () {
    this.setData({
      action: {
        method: 'setPlaybackRate',
        data: 1
      }
    })
  },
  audioPlaybackRateSlowDown: function () {
    this.setData({
      action: {
        method: 'setPlaybackRate',
        data: 0.5
      }
    })
  },
  audio14: function () {
    this.setData({
      action: {
        method: 'setCurrentTime',
        data: 14
      }
    })
  },
  audioStart: function () {
    this.setData({
      action: {
        method: 'setCurrentTime',
        data: 0
      }
    })
  }
})
