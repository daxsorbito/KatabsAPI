describe('Seed', function() {
  "use strict";
  it('should seed test data', function *(done){
    var data = {
      "user_name": "dax.testAdmin.sorbito",
      "password": "$2a$10$6TPPFv65FRf2p9uFJjYyhOZpbHfNT3qKpyM9waJJ5RpvNzZCYlyBS"
    };
    var config = require('../config/index');
    var redisStore = require('../lib/db/redisStore')().connect();

    yield redisStore.set(config.REDIS.PREFIX_KEY + ":USER_TOKEN:" + data.user_name, {"token": data.password}, config.TOKEN_EXPIRY)

    done();
  });
});
