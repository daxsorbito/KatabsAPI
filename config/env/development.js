'use strict'

module.exports = {
  port            : process.env.PORT || 3000,
  token_expiry     : 7200000,
  db              : {
    host          :     "192.168.50.4",
    port          :     "27017",
    username      :     "",
    password      :     "",
    database_name :     "serbisyo"
  },
  redis           : {
    host          :     "192.168.50.4",
    port          :     "6379",
    prefix_key    :     "KATABSAPI_V1"
  }
}
