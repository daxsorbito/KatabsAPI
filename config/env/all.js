'use strict'
const TO_BE_OVERRIDDEN = "to_be_overridden"

module.exports = {
  PORT            : TO_BE_OVERRIDDEN,
  TOKEN_EXPIRY    : 7200000,
  DB              : {
    HOST          :     TO_BE_OVERRIDDEN,
    PORT          :     TO_BE_OVERRIDDEN,
    USERNAME      :     TO_BE_OVERRIDDEN,
    PASSWORD      :     TO_BE_OVERRIDDEN,
    DATABASE_NAME :     TO_BE_OVERRIDDEN
  },
  REDIS           : {
    HOST          :     TO_BE_OVERRIDDEN,
    PORT          :     TO_BE_OVERRIDDEN,
    PREFIX_KEY    :     "KATABSAPI_V1"
  },
  HEADER          : {
    HEADER_TOKEN  :     "KTB-Token",
    USER_NAME     :     "KTB-Username"
  }
}
