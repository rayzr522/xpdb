const level = require('level');

/**
 * Options that can be passed into XPDB.get
 * @typedef {Object} XPDBGetOptions
 * @property {any} [default] The default value to return when a value is not found at the given key
 */

/**
 * The wrapper around `level`
 * 
 * @class XPDB
 */
class XPDB {

    /**
     * 
     * Creates an instance of XPDB.
     * 
     * @param {string} path
     * 
     * @memberOf XPDB
    
     */
    constructor(path) {
        if (!path)
            throw new Error('You must provide a valid path for the database!');

        this._db = level(path, { valueEncoding: 'json' });
    }

    /**
     * Returns the LevelUP instance that is being wrapped around
     */
    unwrap() {
        return this._db;
    }

    /**
     * Returns the value stored at the key, or a default value if provided, or an error if there was no default value provided to the options and no data was stored at the given key
     * 
     * @param {string} key
     * @param {XPDBGetOptions} [options]
     * @returns {Promise<any>}
     * 
     * @memberOf XPDB
     */
    get(key, options = {}) {
        if (!key)
            throw new Error('You must provide a valid key!');

        return new Promise((resolve, reject) => {
            this._db.get(key.toString(), /*{ type: this._type },*/(err, result) => {
                if (err) {
                    if (err.type === 'NotFoundError') {
                        resolve(options.default);
                    } else {
                        reject(err);
                    }
                } else {
                    resolve(result);
                }
            });
        });
    }

    /**
     * Sets a value in the database. If the `value === undefined`, it will instead call `XPDB.delete`.
     * 
     * @param {string} key The key to put the value at
     * @param {any} value The value to set
     * @returns {Promise<any>}
     * 
     * @memberOf XPDB
     */
    put(key, value) {
        if (value === undefined) {
            return this.delete(key);
        }
        if (!key)
            throw new Error('You must provide a valid key!');

        return new Promise((resolve, reject) => {
            this._db.put(key, value, /*{ type: this._type }, */err => err ? reject(err) : resolve());
        });
    }

    /**
     * Deletes a value from the database
     * 
     * @param {string} key The key of the value to delete
     * @returns {Promise<any>}
     * 
     * @memberOf XPDB
    
     */
    delete(key) {
        if (!key)
            throw new Error('You must provide a valid key!');
        return new Promise((resolve, reject) => {
            this._db.del(key, err => {
                if (!err || err.type === 'NotFoundError') {
                    resolve();
                } else {
                    reject(err);
                }
            });
        });
    }
}

module.exports = XPDB;