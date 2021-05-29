import {
  lambdaBaseURL,
  stlToGeometry,
  createHealthyResponse,
  createUnhealthyResponse,
} from './common'

export const render = async ({ code }) => {
  const body = JSON.stringify({
    settings: {},
    file: code,
  })
  try {
    const response = await fetch(lambdaBaseURL + '/cadquery/stl', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body,
    })
    if (response.status === 400) {
      const { error } = await response.json()
      return {
        status: 'error',
        message: {
          type: 'error',
          message: error,
          time: new Date(),
        },
      }
    }
    const data = await response.json()
    const geometry = await stlToGeometry(data.url)
    return createHealthyResponse({
      type: 'geometry',
      data: geometry,
      consoleMessage: data.consoleMessage,
      date: new Date(),
    })
  } catch (e) {
    return createUnhealthyResponse(new Date())
  }
}

const openScad = {
  render,
  // more functions to come
}

export default openScad
