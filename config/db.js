dbURIs = {
  test: "mongodb://localhost/homeworkapi-test",
  development: "mongodb://localhost/homeworkapi",
  production: process.env.MONGODB_URI || "mongodb://localhost/homeworkapi"
}

module.exports = function(env) {
  return dbURIs[env];
}