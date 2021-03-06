(function() {
    'use strict';

    var sidebarComponent = {
        controller: SidebarComponent,
        bindings: {},
        templateUrl: '/partials/mail/components/sidebar/sidebar.view.html'
    };

    function SidebarComponent($interval, $location, $scope, inboxService, sentService, trashService) {
        var ctrl = this;

        ctrl.viewModel = {
            inboxCount: '',
            sentCount: '',
            trashCount: ''
        };

        ctrl.setActive = function(viewLocation) {
            var locationPath = $location.path();
            if (locationPath.indexOf(viewLocation) > -1) {
                return 'tm nav-active active';
            } else {
                return 'tm';
            }
        };

        $interval(function() {
            var inboxCount = inboxService.unreadMessages;
            if (inboxCount > 0) {
                ctrl.viewModel.inboxCount = inboxCount;
            } else {
                ctrl.viewModel.inboxCount = '';
            }
        }, 500);

        $interval(function() {
            var sentCount = sentService.unreadMessages;
            if (sentCount > 0) {
                ctrl.viewModel.sentCount = sentCount;
            } else {
                ctrl.viewModel.sentCount = '';
            }
        }, 500);

        $interval(function() {
            var trashCount = trashService.messagesCount;
            if (trashCount > 0) {
                ctrl.viewModel.trashCount = trashCount;
            } else {
                ctrl.viewModel.trashCount = '';
            }
        }, 500);
    }

    module.exports = sidebarComponent;
}());