const initstate = {
  projects: [],
  project: {
    id: 0,
    title: '',
    image: '',
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
    script: '',
  },
  projectedittype: 0,
  projectinfoshow: false,
  currentparagraphid: 1,
  currentoptionid: 0,
  loadingshow: 0,
  user: {
    name: '筱申',
    profile: 'https://avatars0.githubusercontent.com/u/24862812?s=40&v=4',
    id: 0
  }
}

export default initstate;