import jwt_decode from "jwt-decode"

export default () => {
  const useAuthToken = () => useState('auth_token') // nuxt provided state management, like light version of pinia
  const useAuthUser = () => useState('auth_user')
  const useAuthLoading = () => useState('auth_loading', () => true)

  const setToken = (newToken) => {
    const authToken = useAuthToken()
    authToken.value = newToken
  }

  const setUser = (newUser) => {
    const authUser = useAuthUser()
    authUser.value = newUser
  }

  const setIsAuthLoading = (value) => {
    const authLoading = useAuthLoading()
    authLoading.value = value
  }

  const login = ({ username, password }) => {
    return new Promise(async (resolve, reject) => {
      try {
        const data = await $fetch('/api/auth/login', { // `$fetch` is nuxt version of `fetch`  //  const {data} useFetch() has issues at time of recording
          method: 'POST',
          body: {
            username,
            password
          }
        })
        // access token is in memory only, it is gone on page refresh
        // we can maintain a session using a refresh token
        // when access token is refreshed, refresh token must also be refreshed
        setToken(data.access_token) 
        setUser(data.user)
        
        resolve(true)
      } catch(error) {
        reject(error)

      }
    })
  }

  const refreshToken = () => {
    return new Promise(async (resolve, reject) => {
      try {
        const data = await $fetch('/api/auth/refresh')
        setToken(data.access_token)
        resolve(true)
      } catch(error) {
        reject(error)
      }
    })
  }

  const getUser = () => {
    return new Promise(async (resolve, reject) => {
      try {
        // const data = $fetch('/api/auth/user')     // need to specify access token
        // setToken(data.access_token)
        const data = await useFetchApi("/api/auth/user")     // attaches auth bearer token without need to specify every time
        setUser(data.user)
        resolve(true)
      } catch(error) {
        reject(error)
      }
    })
  }

  const reRefreshAccessToken = () => {
    // decode auth token that is saved in memory
    const authToken = useAuthToken() // get access to auth token
    
    // check if auth token exists 
    if (!authToken.value) {
      return 
    } 

    const jwt = jwt_decode(authToken.value) // decode auth token

    const newRefreshTime = jwt.exp - 600000

    setTimeout(async () => {
      await refreshToken()
      reRefreshAccessToken()
    }, newRefreshTime)

  }


  // called on page refresh
  const initAuth = () => {
    return new Promise(async (resolve, reject) => {
      setIsAuthLoading(true)
      try {
        await refreshToken()    // get new access token
        await getUser()         // get access to user
        reRefreshAccessToken()  // refresh access token
        resolve(true)
      } catch(error) {
        reject(error)
      } finally {
        setIsAuthLoading(false)
      }
    })
  }

  return {
    login,
    useAuthUser,
    useAuthToken,
    initAuth,
    useAuthLoading
  }
}