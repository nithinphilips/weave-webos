enyo.kind({
        name: "bookmarksView",
        kind: "VFlexBox",
        onready: "ready",
        components: [
            {name: "getFeed", kind: "WebService",  onSuccess: "gotFeed", onFailure: "gotFeedFailure"},
            {name: "list", kind: "VirtualList", flex: 1, onSetupRow: "setupRow", components: [
                    {kind: "Item", name: "listItem", layoutKind: "HFlexLayout", onclick: "itemClick", components: [
                            {name: "caption", flex: 1}
                        ]}
                ]}
        ],
        ready: function() {
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
                var isRowSelected = (inIndex == this.selectedRow);
                this.$.caption.setContent(row.DisplayName);
                this.$.listItem.applyStyle("background", isRowSelected ? "blue" : null);
                return true;
            }
        },
        gotFeed: function(inSender, inResponse, inRequest){
            this.results = inResponse.Playlists;
            enyo.scrim.hide();
            this.$.list.render();
        },
        gotFeedFailure: function(inSender, inResponse){
            enyo.scrim.hide();
        }
    });

