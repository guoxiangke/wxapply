// http://api.yongbuzhixi.com/api/lylist/category
var category = [];
var lylist_data = [];
wx.request({
    url: 'http://api.yongbuzhixi.com/api/lylist/category',
    success: function(res) {
        category = res.data
        wx.setStorageSync('category', category)
    }
})
wx.request({
    url: 'http://api.yongbuzhixi.com/api/lylist',
    success: function(res) {
        lylist_data = res.data
        wx.setStorageSync('lylist_data', lylist_data)
				console.log(lylist_data);
    }
})
