const username = window. localStorage.getItem('username')
const avatar_url = window. localStorage.getItem('avatar_url')
let initState = {
  loading: false,
  loginStatus: (username, avatar_url) ? true : false,
  userInfo: {
    username: username,
    avatar_url: avatar_url
  }
}

export default (state = initState, action) => {
  const { type, data } = action
  switch (type) {
    case 'loading' :
      return {
        ...state,
        loading: data
      }
    case 'userInfo': 
      return {
        ...state,
        userInfo: {...data}
      }
    case 'loginStatus':
      return {
        ...state,
        loginStatus: data
      }
    case 'logout':
      return {
        ...state,
        loginStatus: data
      }   
    default:
      return state
  }
}
