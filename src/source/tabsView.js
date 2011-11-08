enyo.kind({
        name: "tabsView",
        kind: "VFlexBox",
        onready: "ready",
        components: [
            {name: "testData", kind: "AuthData" },
            {name: "getTabs", kind: "WebService",  onSuccess: "gotFeed", onFailure: "gotFeedFailure"},
            {name: "list", kind: "VirtualRepeater", flex: 1, onSetupRow: "setupRow", components: [
                    { kind: "Item", name: "listItem", layoutKind: "HFlexLayout", onclick: "itemClick", components: [
                            {
                                kind: "RowGroup",
                                name: "tabsList",
                                caption: "Tabs from A Client",
                                flex: 1,
                                components: [
                                    {
                                        kind: "Item",
                                        tapHighlight: false,
                                        components: [{
                                                kind: "HFlexBox",
                                                components: [
                                                    {
                                                        content: $L("Loading tabs...")
                                                    }]
                                            }
                                        ]
                                    }]
                            }
                        ]}
                ]}
            ],
            ready: function() {
                this.$.getTabs.setUrl(this.$.testData.url);
                this.$.getTabs.setUsername(this.$.testData.username);
                this.$.getTabs.setPassword(this.$.testData.password);
                this.$.getTabs.call();
                enyo.scrim.show();
            },
            create: function() {
                this.inherited(arguments);
                this.results = [];
                this.selectedRow = -1;
            },
            itemClick: function(inSender, inEvent) {
                this.selectedRow = inEvent.rowIndex;
            },
            setupRow: function(inSender, inIndex) {
                var row = this.results[inIndex];
                if (row) {
                    this.$.tabsList.setCaption("Tabs from " + row);
                    return true;
                }
            },
            gotFeed: function(inSender, inResponse, inRequest){
                this.results = inResponse;
                this.$.list.render();
            },
            gotFeedFailure: function(inSender, inResponse){

            }
    });
