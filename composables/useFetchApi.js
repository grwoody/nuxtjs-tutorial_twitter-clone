export default (url, options = {}) => {
  const { useAuthToken } = useAuth()
 
  return $fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      // ...options,
      Authorization: `Bearer ${useAuthToken().value}` // this is a reference so we must use .value
    }
  })
}