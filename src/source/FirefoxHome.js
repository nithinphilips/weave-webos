enyo.kind(
    {
        name: "com.nithinphilips.FirefoxHome",
        kind: enyo.VFlexBox,
        components: [
            {
                kind: enyo.HFlexBox,
                name: "radioContainer",
                pack: "center",
                components: [
                    {
                        kind: "RadioGroup",
                        name: "viewGroup",
                        onclick: "viewGroupClick",
                        width: "50%",
                        components: [
                            {
                                caption: $L("Tabs"),
                                value: "tabsView"
                            },
                            {
                                caption: $L("Bookmarks"),
                                value: "bookmarksView"
                            },
                            {
                                caption: $L("History"),
                                value: "historyView"
                            }]
                    }]
            },
            {
                kind: "Pane",
                transitionKind: "enyo.transitions.Fade",
                flex: 1,
                components: [
                    {kind: "tabsView"},
                    {kind: "bookmarksView"},
                    {kind: "historyView"}
                ]
            },
            {
                kind: "Toolbar",
                name: "toolbarmain",
                pack: "center",
                name: "toolbar",
            }
        ],
        viewGroupClick: function(inSender, e) {
            this.$.pane.selectViewByName(inSender.getValue());
        }
    }
);
