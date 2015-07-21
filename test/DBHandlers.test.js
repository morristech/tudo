var test = require("tape");
var redisConfig = require("../lib/redis_config");
var DBHandlers = require("../api/DBHandlers.js");

var connection = {
    port: 6379,
    host: '127.0.0.1'
};


test("Adding an issue to DB", function (t) {
    var redisClient = redisConfig(connection);
    var testIssue = {
        id: 12345678,
        created_at: "2015-06-22T09:22:51Z",
    };
    DBHandlers.addIssue(redisClient, testIssue, function (errors, replies) {
        t.equal(errors, null, "add errors null");
        t.deepEqual(replies, ["OK",1], "should get an OK from setting hash, and 1 for addition to set of issues");
        DBHandlers.deleteIssueById(redisClient, testIssue.id, function (errors, replies) {
            redisClient.end()
            t.end();
        });
    });
});

test("Deleting an issue by id", function (t) {
    var redisClient = redisConfig(connection);
    var testIssue = {
        id: 23456789,
        created_at: "2015-06-22T09:22:51Z",
    };

    DBHandlers.addIssue(redisClient, testIssue, function (errors, replies) {
        DBHandlers.deleteIssueById(redisClient, testIssue.id, function (errors, replies) {
            t.equal(errors, null, "delete errors null");
            t.deepEqual(replies, [1,1], "1 deleteed from list and database respectively");
            redisClient.end()
            t.end();
        });
    });
});
