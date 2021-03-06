(function() {
    "use strict";

    var inboxService = function($http, $log, angularConfig, localStorageService) {
        var baseUrl = angularConfig.baseUrl;
        var unreadMessages = 0;

        var urls = {
            deleteMessage: baseUrl + '/api/v1/inbox',
            inboxData: baseUrl + '/api/v1/inbox',
            readMessage: baseUrl + '/api/v1/inbox'
        };

        var service = {
            deleteMessage: deleteMessage,
            inboxData: inboxData,
            readMessage: readMessage,
            unreadMessages: unreadMessages
        };

        return service;

        function deleteMessage(id) {
            var oauthData = localStorageService.get('oauthData');
            if (oauthData === null) {
                return null;
            }

            return $http({
                    header: {
                        'Authorization': 'Bearer ' + oauthData.accessToken
                    },
                    method: 'DELETE',
                    url: urls.deleteMessage + '/' + id
                })
                .then(deleteMessageSuccess)
                .catch(deleteMessageFailed);

            function deleteMessageSuccess(respond) {
                return respond;
            }

            function deleteMessageFailed(error) {
                return error;
            }
        }

        function inboxData() {
            var oauthData = localStorageService.get('oauthData');
            if (oauthData === null) {
                return null;
            }

            return $http({
                    header: {
                        'Authorization': 'Bearer ' + oauthData.accessToken
                    },
                    method: 'GET',
                    url: urls.inboxData
                })
                .then(inboxDataSuccess)
                .catch(inboxDataFailed);

            function inboxDataSuccess(respond) {
                var unreadMessagesCount = 0;

                angular.forEach(respond.data.messages, function(message, index) {
                    var email = message.from;
                    var nickname = email.substring(0, email.lastIndexOf("@"));
                    message.nickname = nickname;

                    if (message.isRead === false) {
                        unreadMessagesCount = unreadMessagesCount + 1;
                    }
                });

                unreadMessages = unreadMessagesCount;
                service.unreadMessages = unreadMessages;

                return respond;
            }

            function inboxDataFailed(error) {
                return error;
            }
        }

        function readMessage(id, isRead) {
            var oauthData = localStorageService.get('oauthData');
            if (oauthData === null) {
                return null;
            }

            return $http({
                    data: {
                        id: id,
                        is_read: isRead
                    },
                    header: {
                        'Authorization': 'Bearer ' + oauthData.accessToken
                    },
                    method: 'POST',
                    url: urls.readMessage
                })
                .then(readMessageSuccess)
                .catch(readMessageFailed);

            function readMessageSuccess(respond) {
                if (unreadMessages !== 0) {
                    unreadMessages = unreadMessages - 1;
                }

                service.unreadMessages = unreadMessages;

                return respond;
            }

            function readMessageFailed(error) {
                return error;
            }
        }
    };

    module.exports = inboxService;
}());