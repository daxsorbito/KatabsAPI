'use strict'

module.exports = {
  PORT            : process.env.PORT || 3000,
  DB              : {
    HOST          :     "192.168.50.4",
    PORT          :     "27017",
    USERNAME      :     "",
    PASSWORD      :     "",
    DATABASE_NAME :     "serbisyo"
  },
  REDIS           : {
    HOST          :     "192.168.50.4",
    PORT          :     "6379"
  }
}
