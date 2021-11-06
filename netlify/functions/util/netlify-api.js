const fetch = require('node-fetch')

async function getUser(token) {
  if(!token) {
    throw new Error("Missing authorization token.");
  }

  const url = `https://api.netlify.com/api/v1/user/`
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  })

  console.log( "[netlify-api] RESPONSE STATUS", response.status );
  if (response.status !== 200) {
    throw new Error(`Error ${await response.text()}`)
  }

  const data = await response.json()
  return data
}

module.exports = {
  getUser: getUser
}
