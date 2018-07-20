const username = window. localStorage.getItem('username')
let initState = {
  loading: false,
  loginStatus: (username) ? true : false,
  userInfo: {
    username: username,
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
