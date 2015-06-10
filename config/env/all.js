'use strict'
const TO_BE_OVERRIDDEN = "to_be_overridden"

module.exports = {
  port            : TO_BE_OVERRIDDEN,
  token_expiry    : 7200000,
  db              : {
    host          :     TO_BE_OVERRIDDEN,
    port          :     TO_BE_OVERRIDDEN,
    username      :     TO_BE_OVERRIDDEN,
    password      :     TO_BE_OVERRIDDEN,
    database_name :     TO_BE_OVERRIDDEN
  },
  redis           : {
    host          :     TO_BE_OVERRIDDEN,
    port          :     TO_BE_OVERRIDDEN,
    prefix_key    :     "KATABSAPI_V1"
  }
}
