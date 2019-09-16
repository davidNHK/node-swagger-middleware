function safeParseJSON(data, encoding) {
  try {
    return JSON.parse(data.toString(encoding))
  } catch (e) {
    return undefined
  }
}

module.exports = safeParseJSON
