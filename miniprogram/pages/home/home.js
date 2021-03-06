const {http} = require('../../lib/http.js')

Page({
  updateId: "",
  updateIndex: "",
  data: {
    lists: [],
    visibleAdd: false,
    visibleUpdate: false,
    changeText: "",
    selectTab: ""
  },

  onShow() {
    http.get('/todos?completed=false').then(response => {
      this.setData({
        lists: response.data.resources
      })
    })
    if (!this.data.lists.length) {
      this.setData({ selectTab: '' })
    }
  },

  completeTodo(event) {
    let index = event.currentTarget.dataset.index
    let id = event.currentTarget.dataset.id
    this.setData({ selectTab: index })
    setTimeout(() => {
    http.put(`/todos/${id}`, {
        completed: true
      })
      .then(response => {
        this.data.lists[index] = response.data.resource
        this.setData({
          lists: this.data.lists
        })
        this.setData({ selectTab: '' })
        wx.showToast({
          title: '确认完成',
          icon: 'success',
          duration: 1000
        })
      })
    },1000)
  },

  changeText(event) {
    let content = event.currentTarget.dataset.content
    this.updateId = event.currentTarget.dataset.id
    this.updateIndex = event.currentTarget.dataset.index
    this.setData({
      changeText: content,
      visibleUpdate: true,
    })
  },

  confirmAdd(event) {
    let content = event.detail
    if (content) {
      http.post('/todos', {
          completed: false,
          description: content
        })
        .then(response => {
          this.setData({
            lists: [response.data.resource, ...this.data.lists]
          })
        })
      this.hideConfirmBox()
    }
  },

  confirmUpdate(event) {
    console.log(this.updateId)
    let content = event.detail
    if (content) {
      http.put(`/todos/${this.updateId}`, {
          completed: false,
          description: content
        })
        .then(response => {
          this.data.lists[this.updateIndex] = response.data.resource
          this.setData({
            lists: this.data.lists
          })
        })
      this.hideConfirmBox()
    }
  },

  hideConfirmBox() {
    this.setData({
      visibleAdd: false,
      visibleUpdate: false,
    })
  },

  showAddBox() {
    this.setData({
      visibleAdd: true
    })
  },
})