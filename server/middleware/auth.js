import UrlPattern from "url-pattern"
import { decodeAccessToken  } from "../utils/jwt.js"
import { sendError } from "h3"
import { getUserById } from "../db/users"

// grab info from access token, decode token, save token, attach token to request
// allows for access to token for any user
export default defineEventHandler(async (event) => {
  
  // define where to run this request
  const endpoints = [
    '/api/auth/user',
    '/api/user/tweets'
  ]

  const isHandledByThisMiddleware = endpoints.some(endpoint => {

    const pattern = new UrlPattern(endpoint)

    return pattern.match(event.node.req.url)

  })

  if (!isHandledByThisMiddleware) {
    return 
  }

  // const token = event.req.headers['authorization']?.split(' ')[1]
  const token = event.node.req.headers['authorization']?.split(' ')[1]

  const decoded = decodeAccessToken(token)

  if (!decoded) {
    return sendError(event, createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    }))
  }

  

  try {
    const userId = decoded.userId
    const user = await getUserById(userId)
    event.context.auth = { user }
  } catch (error) {
    return
  }

})