import { useEffect } from "react"
import axios from "axios"
import { useLocalStorage } from "./useLocalStorage"

export default function useAuth(code) {
  const [accessToken, setAccessToken] = useLocalStorage('accessToken', '')
  const [refreshToken, setRefreshToken] = useLocalStorage('refreshToken', '')
  const [expiresIn, setExpiresIn] = useLocalStorage('expiresIn', '')

  useEffect(() => {
    axios
      .post("http://localhost:3000/api/login", {
        code,
      })
      .then(res => {
        setAccessToken(res.data.accessToken)
        setRefreshToken(res.data.refreshToken)
        setExpiresIn(res.data.expiresIn)
        window.history.pushState({}, null, "/")
      })
      .catch(() => {
        window.location = "/"
      })
  }, [code])

  useEffect(() => {
    if (!refreshToken || !expiresIn) return
    const interval = setInterval(() => {
      axios
        .post("http://localhost:3000/api/refresh", {
          refreshToken,
        })
        .then(res => {
          setAccessToken(res.data.accessToken)
          setExpiresIn(res.data.expiresIn)
        })
        .catch(() => {
          window.location = "/"
        })
    }, (expiresIn - 60) * 1000)

    return () => clearInterval(interval)
  }, [refreshToken, expiresIn])

  return accessToken
}
