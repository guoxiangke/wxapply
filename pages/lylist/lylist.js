//logs.js
var util = require('../../utils/util.js')
var lyutil = require('../../utils/lylist.js')
// app-service
// var app = getApp()
// console.log(app.globalData,'// I am global data')

Page({
  data: {
      lylist_data  :'',
      lylist_categorys: '',
      current_play_id : -1,
      current_downloaded_id : -1,
  },
  //事件处理函数
  bindViewTapMenu: function (e) {
    var id = parseInt(e.currentTarget.id)
    var menuItem = this.data.lylist_categorys[id]
    {
      var changeData = {}
      var opened = menuItem.opened

      changeData['lylist_categorys[' + id + '].opened'] = !opened
      this.setData(changeData)
    }
  },
  bindViewTapDownload: function(e) {
    console.log(e,'res.bindViewTapDownload')
    var id = parseInt(e.currentTarget.id) //0-50
    var that = this
    var download_url = 'empty!'
    if(this.data['lylist_data'][id].url){
        console.warn('already has url no need request,then download plz!')
        //TODO:copy download code here!
        return
    }
    wx.request({
          url: 'http://wx.yongbuzhixi.com/get_upyun_token/'+e.target.dataset.key,
          success: function(res) {
            var music_url = res.data[0]
            //set page var id.url
            var changeData = {}
            changeData['lylist_data[' + id + '].url'] = music_url
            changeData['lylist_data[' + id + '].downloaded'] = 1
            that.setData(changeData)
            that.setData({
                current_downloaded_id : id,
            })
            console.log('0000',music_url)
            console.log('lylist_data.update when download!',id)

            wx.downloadFile({
              url: music_url,
              type: 'audio',
              fail: function(res){
                console.log(res,'downloadFile.fail')
              },
              complete: function(res){
                console.log(res,'downloadFile.complete')
              },
              success: function(res) {

                var tempFilePath = res.tempFilePath
                console.log(tempFilePath,'res.tempFilePath')
                wx.saveFile({
                  tempFilePath: tempFilePath,
                  success: function(res) {
                    //set page var id.downloaded
                    // we also need save global data!
                    var savedFilePath = res.savedFilePath
                    console.log(res.savedFilePath,'res.savedFilePath')
                    var id = music_url.match(/[a-z]+\d{6}/)
                    var downloaded = {
                      id: id[0],//'se160901',
                      key: e.target.dataset.key,
                      url: music_url,
                      title: e.target.dataset.title,
                      localpath:savedFilePath,
                    }
                    var downloads=wx.getStorageSync('downloads')
                    if (1) {
                        console.log(downloads,'oldStorage')
                        if(!downloads) downloads=[]
                        downloads.push(downloaded)
                        console.log(downloads,'addStorage')
                        wx.setStorage({
                            key : 'downloads',
                            data : downloads
                        })
                    }

                  },
                  fail: function(res){
                    console.log(res,'saveFile.fail')
                  }
                })
              }
            })


          }
      })
  },
  bindViewTapPlay: function(e) {
    console.log('播放暂停键点击 bindViewTapPlay',e)
    var id = parseInt(e.currentTarget.id) //0-50
    var that = this
    //如果 已经播放，则停止播放，设置 playState: 0,
    var currentMusic = wx.getStorageSync('currentMusic')
    console.log(currentMusic,'e.currentMusic')
    if (currentMusic && currentMusic.playState && id==currentMusic.id) {
        // 暂停播放，如果currentMusic处于播放状态！
        wx.pauseBackgroundAudio()
        console.log('pauseBackgroundAudio',currentMusic.title);
        var changeData = {
          id: currentMusic.id,
          playState: 0,
          url: currentMusic.url,
          title: currentMusic.title,
        }
        wx.setStorage({
            key : 'currentMusic',
            data :changeData
        })
        //current_play_id
        that.setData({
            current_play_id: -1,
        })
        return
    }

    that.setData({
        current_play_id: id,
    })

    if(this.data['lylist_data'][id].url){
        console.warn('already has url no need request,then play the url plz!')
        //TODO:copy blow play code here!
            var music_url = this.data['lylist_data'][id].url
            var title = this.data['lylist_data'][id].title
            {//如果点击播放，然后暂停，然后再次播放时，从上次位置播放
                wx.getBackgroundAudioPlayerState({
                    success: function(res) {
                    console.log(res,'getBackgroundAudioPlayerState')
                        // var status = res.status
                        var dataUrl = res.dataUrl
                        var currentPosition = res.currentPosition
                        // var duration = res.duration
                        // var downloadPercent = res.downloadPercent
                        if(dataUrl == music_url){
                            console.warn('goon play')
                            wx.seekBackgroundAudio({
                                position: currentPosition
                            })
                            return
                        }
                    }
                })
            }//end
            wx.playBackgroundAudio({
              dataUrl: music_url,
              title: title,
              coverImgUrl: 'http://ly.yongbuzhixi.com/fm/img/ybzx320.jpg',
              complete: function (res) {
                console.log(music_url,'playBackgroundAudio.complete: '+id)
                var changeData = {
                  id: id,
                  playState: 1,
                  url: music_url,
                  title: title,
                }
                wx.setStorage({
                    key : 'currentMusic',
                    data :changeData
                })

              }
            })
        return
    }

    // 'http://lywxaudio.yongbuzhixi.com/2016/cw/cw161010.mp3?_upt=65b2303a1476180249',
    // http://wx.yongbuzhixi.com/get_upyun_token/ee
    wx.request({
        url: 'http://wx.yongbuzhixi.com/get_upyun_token/'+e.target.dataset.key,
        success: function(res) {
            var music_url = res.data[0]
            // var ly_data = lyutil.get_ly_data()
            // ly_data[id].url = music_url
              var changeData = {}
              changeData['lylist_data[' + id + '].url'] = music_url
              that.setData(changeData)
            //TODO delete! one page play!
            // wx.setStorage({
            //     key: 'current_play_src',
            //     data : music_url
            // })
            // wx.setStorage({
            //     key : 'current_play_name',
            //     data : e.target.dataset.name
            // })
            // wx.navigateTo({
            //     url: '../play/play'
            // })

            wx.playBackgroundAudio({
              dataUrl: music_url,
              title: e.target.dataset.title,
              coverImgUrl: 'http://ly.yongbuzhixi.com/fm/img/ybzx320.jpg',
              complete: function (res) {
                console.log(music_url,'playBackgroundAudio.complete: '+id)
                var changeData = {
                  id: id,
                  playState: 1,
                  url: music_url,
                  title: e.target.dataset.title,
                }
                wx.setStorage({
                    key : 'currentMusic',
                    data :changeData
                })

              }
            })
        }
    })

  },

  onLoad: function () {
    console.log('onLoad lylist')
    var that = this
    wx.getStorage({
      key: 'currentMusic',
      success: function(res) {
        console.log(res.data,'获取global play state')
        if(res.data.playState){
            that.setData({
                current_play_id: res.data.id,
                current_play_url: res.data.url,
            })
        }
      }
    })

    var ly_data = lyutil.get_ly_data();

    var res = []
    for (var k in ly_data){
        // if (!ly_data.hasOwnProperty(k)) continue;
        ly_data[k].key = k
        ly_data[k].url = false
        ly_data[k].downloaded = false
        res.push(ly_data[k])
    }
    this.setData({
        // lylist_data_ori : ly_data,
        lylist_data : res
    })

    var ly_data_categorys = lyutil.get_lylist_categorys()
    var res = []
    for (var i in ly_data_categorys) {
        res.push({name:ly_data_categorys[i],opened:false});
    }
    this.setData({
        lylist_categorys : res,
    })

  }

})
