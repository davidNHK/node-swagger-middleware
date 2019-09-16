function hookResponseContent(res, callback) {
  const { write: oldWrite, end: oldEnd } = res

  const chunks = []

  res.write = function(chunk) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk, "utf8") : chunk)
  }

  res.end = function(chunk, encoding) {
    if (chunk) {
      chunks.push(
        typeof chunk === "string" ? Buffer.from(chunk, "utf8") : chunk
      )
    }
    res.write = oldWrite
    res.end = oldEnd
    try {
      const data = Buffer.concat(chunks)
      callback(null, data, encoding)
    } catch (e) {
      callback(e)
    }
  }
}

module.exports = hookResponseContent
