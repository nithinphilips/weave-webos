/**
 * @fileOverview Crypto Object for weave basic object
 * @author <a href="http://decafbad.com">l.m.orchard@pobox.com</a>
 * @version 0.1
 */
/*jslint laxbreak: true */
/*global Mojo, Weave, Chain, Class, Ajax */

/**
 * Object for service objects with built-in decryption
 *
 * @class
 * @augments Weave.Service.BasicObject
 */
Weave.Service.CryptoObject = Class.create(Weave.Service.BasicObject, /** @lends Weave.Service.CryptoObject */{

    /**
     * TODO:
    encrypt: function (on_success, on_failure) {
    },
     */

    /**
     * Decrypt the contents of this record.
     *
     * @param {Weave.Service.SymKey} symkey     Symkey used to decrypt object
     * @param {function}           on_success Success callback (record)
     * @param {function}           on_failure Failure callback
     */
    decrypt: function (symkey, on_success, on_failure) {
        var chain = new Decafbad.Chain([
            function (chain) {
                // Use the supplied symkey, or fetch the one specified in the
                // payload if none supplied.
                if (symkey) {
                    chain.next(symkey);
                } else {
                    this.manager.service.symkeys.get(
                        this.get('payload').encryption,
                        chain.nextCb(), chain.errorCb()
                    );
                }
            },
            function (chain, symkey) {
                // Decrypt the cyphertext using the symkey.
                var json = Weave.Util.clearify(Weave.Crypto.AES.decrypt(
                    symkey.get('symkey'), 
                    Weave.Util.Base64.decode(symkey.get('payload').bulkIV), 
                    Weave.Util.Base64.decode(this.get('payload').ciphertext)
                ));
                this.get('payload').cleartext = json.evalJSON();
                //delete this.get('payload').ciphertext;
                on_success(this);
            }
        ], this, on_failure).start();
    },

    EOF:null

});

/**
 * @class 
 */
Weave.Service.CryptoObjectCollection = Class.create(Weave.Service.RecordManager, /** @lends Weave.Service.CryptoObjectCollection */ {

    _collection_name: 'history',
    _record_type: Weave.Service.CryptoObject,

    /**
     * Get an object by ID
     *
     * @param {string}   object_id  Object ID to get
     * @param {function} on_success Success callback (record)
     * @param {function} on_failure Failure callback
     */
    getByID: function (object_id, on_success, on_failure) {
        var url = this.service.cluster_url + this.service.options.service_version + 
            '/' + encodeURIComponent(this.service.options.username) + 
            '/storage/' + encodeURIComponent(this._collection_name) + 
            '/' + encodeURIComponent(object_id);
        return this.get(url, on_success, on_failure);
    },

    /**
     * List objects in the collection using the supplied options
     *
     * @param {object}   params     Params for the list query
     * @param {function} on_success Success callback (record)
     * @param {function} on_failure Failure callback
     */
    list: function (params, on_success, on_failure) {

        var collection_name = ('collection' in params) ?
            params.collection : this._collection_name;
        delete params.collection;

        var record_type = ('record_type' in params) ?
            params.record_type : this._record_type;
        delete params.record_type;

        var url = this.service.cluster_url + this.service.options.service_version + 
            '/' + encodeURIComponent(this.service.options.username) + 
            '/storage/' + encodeURIComponent(collection_name);

        if (params) {
            url = url + '?' + $H(params).toQueryString();
        }

        var chain = new Decafbad.Chain([
            function (chain) {
                this.service.fetch(url, chain.nextCb(), chain.errorCb());
            },
            function (chain, data) {
                if ('full' in params) {
                    // TODO: Instantiate object Objects
                } else {
                    chain.next(data);
                }
            },
            function (chain, results) {
                return on_success(results);
            }
        ], this, on_failure).start();

    },

    /**
     * Override to superclass _import that automatically decrypts all new objects.
     *
     * @param {string}   url        URL to fetch and import
     * @param {function} on_success Success callback (record)
     * @param {function} on_failure Failure callback
     */
    _import: function ($super, url, on_success, on_failure) {
        $super(
            url,
            function (record) {
                var chain = new Decafbad.Chain([
                    function (chain) {
                        record.decrypt(null, chain.nextCb(), on_failure);
                    },
                    function (chain, record) {
                        on_success(record);
                    }
                ], this, on_failure).start();
            }.bind(this),
            on_failure
        );
    },

    EOF:null
});