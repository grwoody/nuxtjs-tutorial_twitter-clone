import { sendError } from "h3"
import { getRefreshTokenByToken } from "../../db/refreshTokens.js"
import { decodeRefreshToken, generateTokens } from "../../utils/jwt.js"
import { getUserById } from "../../db/users.js"

export default defineEventHandler(async (event) => {
  // const cookies = parseCookies(event) // use parseCookies() instead of useCookies()
  // const refreshToken = cookies.refresh_token
  const refreshToken = getCookie(event, "refresh_token")

  // check if refesh token is present
  if (!refreshToken) {
    return sendError(event, createError({
      statusCode: 401,
      statusMessage: 'Refresh token is invalid'
    }))
  }

  // check if refresh token is present in database
  const rToken = await getRefreshTokenByToken(refreshToken)

  if (!rToken) {
    return sendError(event, createError({
      statusCode: 401,
      statusMessage: 'Refresh token is invalid'
    }))
  } 

  // decode token with secret refresh token
  const token = decodeRefreshToken(refreshToken)

  try {
    const user = await getUserById(token.userId)

    const { accessToken } = generateTokens(user)
    
    return {
      access_token: accessToken
    }
  } catch (error) {
    return sendError(event, createError({
      statusCode: 500,
      statusMessage: 'Something went wrong'
    }))
  }
})