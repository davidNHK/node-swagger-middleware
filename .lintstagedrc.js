module.exports = {
  "*.(js|ts)": ["prettier --write", "eslint", "git add"],
  "*.json": ["prettier --write", "git add"]
}
