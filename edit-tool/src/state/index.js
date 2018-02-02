const initstate = {
  projects: [],
  project: {
    id: '0',
    title: '',
    text: '',
    character_count: 0,
    tags: '&',
    author_id: 1,
    update_time: '2018-01-31',
    status: 0,
    content: {
      roles: [],
      galleries: [],
      paragraphtree: [
        {
          id: 1,
          type: "text",
          title: "未命名段落",
          chat_id: 0,
          paragraphtxt: "",
          nextid: 0
        }
      ],
    },
    script:'',
  },
  projectedittype: 0,
  projectinfoshow: false,
  currentparagraphid: 1,
  currentoptionid: 0,
  user: {
    username: '筱申',
    userphoto: 'https://avatars0.githubusercontent.com/u/24862812?s=40&v=4',
    userid: ''
  }
}

export default initstate;