import React, { useState, useEffect } from 'react'

const Api = () => {

  const [data, setData] = useState([{}]);

  useEffect(() => {
    fetch("/api", { method: 'GET' }).then(
      res => res.json()
    ).then(
      data => { setData(data) }
    )
  }, [])

  return (
  <div>
    <h1>Welcome to the HomePage!</h1>
  </div>)
}

export default Api;