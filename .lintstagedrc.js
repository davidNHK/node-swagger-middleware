module.exports = {
  "*.{js,ts}": ["prettier --write", "eslint", "git add"],
  "*.{json,md,yaml,yml}": ["prettier --write", "git add"]
}
