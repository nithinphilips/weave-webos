enyo.kind({
        name: "historyView",
        kind: "VFlexBox",
        className: "box-center",
        components: [
            {
                kind: "RowGroup",
                name: "profileList",
                caption: $L("History"),
                components: [
                    {
                        kind: "Item",
                        tapHighlight: false,
                        components: [{
                                kind: "HFlexBox",
                                components: [
                                    {
                                        content: $L("Loading history...")
                                    }]
                            }
                        ]
                    }]
            }]

    });

