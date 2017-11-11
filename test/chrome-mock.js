window['chrome'] = {
    runtime: {
        getManifest: function () {},
        connect: function () {},
        sendMessage: function () {},
        onMessage: {
            addListener: function () {}
        },
        onConnect: {
            addListener: function () {}
        }
    },
    tabs: {
        create: function () {}
    },
    notifications: {
        create: function () {},
        clear: function () {},
        onClicked: {
            addListener: function () {}
        },
        onClosed: {
            addListener: function () {}
        }
    },
    browserAction: {
        setBadgeText: function () {}
    }
};
