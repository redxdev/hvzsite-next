var Promise = require('bluebird');
var unirest = require('unirest');

var config = sails.config.onesignal;

function sendToUsers(users, title, message, options) {
    return new Promise(function (resolve, reject) {
        if (config.enabled !== true) {
            resolve();
            return;
        }

        if (users.length == 0) {
            reject("No users specified");
            return;
        }

        var keys = [];
        users.forEach(function (user) {
            keys = keys.concat(user.notificationKeys);
        });

        if (keys.length == 0) {
            reject({message: "No notification keys for any users."});
            return;
        }

        unirest.post('https://onesignal.com/api/v1/notifications')
            .headers({'Accept': 'application/json', 'Content-Type': 'application/json'})
            .send({
                app_id: config.appId,
                include_player_ids: keys,
                headings: {'en': title},
                contents: {'en': message}
            })
            .end(function (response) {
                if (response.status != 200) {
                    console.log("Unable to send notification to users: ", response.body);
                    reject(response.body);
                }
                else {
                    resolve(response.body);
                }
            });
    });
}

module.exports = {
    sendToUser: function (user, title, message) {
        return sendToUsers([user], title, message);
    },

    sendToUsers: sendToUsers,

    updateTags: function (user, tags) {
        return new Promise(function (resolve, reject) {
            if (config.enabled !== true) {
                resolve();
                return;
            }

            var promises = [];
            user.notificationKeys.forEach(function (key) {
                promises.push(new Promise(function (resolve, reject) {
                    unirest.put('https://onesignal.com/api/v1/players/' + key)
                        .headers({'Accept': 'application/json', 'Content-Type': 'application/json'})
                        .send({
                            app_id: config.appId,
                            tags: tags
                        })
                        .end(function (response) {
                            if (response.status != 200) {
                                console.log("Unable to change tags for notification key " + key, response.body);
                                reject(response.body);
                            }
                            else {
                                resolve(response.body);
                            }
                        });
                }));
            });

            Promise.all(promises).then(function () {
                resolve();
            }).catch(function () {
                reject();
            });
        });
    }
};