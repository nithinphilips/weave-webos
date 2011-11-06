enyo.kind({
        name: "tabsView",
        kind: "VFlexBox",
        className: "box-center",
        components: [
            {
                kind: "RowGroup",
                name: "profileList",
                caption: $L("Network Drive Profiles"),
                components: [
                    {
                        kind: "Item",
                        tapHighlight: false,
                        components: [{
                                kind: "HFlexBox",
                                components: [
                                    {
                                        content: $L("Loading drive profiles...")
                                    }]
                            }
                        ]
                    }]
            }]

    });
