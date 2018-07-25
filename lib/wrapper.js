const level = require('level');
const streams = require('./streams');

/**
 * Options that can be passed into XPDB.get
 * 
 * @typedef {Object} XPDBGetOptions
 * @property {any} default The default value to return when a value is not found at the given key
 */

/**
 * A wrapper around LevelDB (using the 'level' module)
 * 
 * http://npmjs.com/package/level
 * 
 * @class XPDB
 */
class XPDB {

    /**
     * Creates a new XPDB instance
     * @param {string} path 
     * 
     * @memberof XPDB
     */
    constructor(path) {
        if (!path || path.length < 1) {
            throw new TypeError('You must provide a valid path for the database!');
        }

        this._db = level(path, { valueEncoding: 'json' });
    }

    /**
     * The internal LevelDB instance
     * 
     * @type {object}
     * 
     * @readonly
     * 
     * @memberof XPDB
     */
    get db() {
        return this._db;
    }

    /**
     * @deprecated This has been replaced with a getter (XPDB.db)
     * 
     * @returns {object} The internal LevelDB instance
     * 
     * @memberof XPDB
     */
    unwrap() {
        return this.db;
    }

    /**
     * Closes the internal DB
     * 
     * @memberof XPDB
     */
    close() {
        this.db.close();
    }

    /**
     * Returns the a Promise with the value stored at the key, the default value (if provided), or undefined
     * 
     * @param {string} key The key of the property to get
     * @param {XPDBGetOptions} options The options
     * @returns {Promise<any>}
     * 
     * @memberof XPDB
     */
    get(key, options = {}) {
        if (!key || key.length < 1) {
            throw new TypeError('You must provide a valid key!');
        }

        return new Promise((resolve, reject) => {
            this.db.get(key.toString(), (err, result) => {
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
     * Sets a value in the database. If the `value === undefined`, it will instead call `XPDB.delete`. You cannot insert `null` values.
     * 
     * @param {string} key The key of the property to set
     * @param {any} value The value to set
     * @returns {Promise<any>}
     * 
     * @memberof XPDB
     */
    put(key, value) {
        if (value === undefined)
            return this.delete(key);
        if (!key)
            throw new TypeError('You must provide a valid key!');
        if (value === null)
            throw new TypeError('value must not be null!');

        return new Promise((resolve, reject) => {
            this.db.put(key, value, err => err ? reject(err) : resolve());
        });
    }

    /**
     * Deletes a value from the database
     * 
     * @param {string} key The key of the value to delete
     * @returns {Promise<any>}
     * 
     * @memberof XPDB
     */
    delete(key) {
        if (!key || key.length < 1) {
            throw new Error('You must provide a valid key!');
        }

        return new Promise((resolve, reject) => {
            this.db.del(key, err => {
                if (!err || err.type === 'NotFoundError') {
                    resolve();
                } else {
                    reject(err);
                }
            });
        });
    }

    /**
     * Returns an array containing all keys in the database.
     * 
     * @returns {Promise<Array<string>>}
     * 
     * @memberof XPDB
     */
    keys() {
        console.log(this.db.createKeyStream());
        // return streams.streamToPromise(this.db.createKeyStream());
    }

    /**
     * Returns an array containing all values in the database.
     * 
     * @returns {Promise<Array<any>>}
     * 
     * @memberof XPDB
     */
    values() {
        return streams.streamToPromise(this.db.createValueStream());
    }

    /**
     * Returns an array containing all entries in the database.
     * 
     * @returns {Promise<Array<{key: string, value}>>}
     * 
     * @memberof XPDB
     */
    entries() {
        return streams.streamToPromise(this.db.createReadStream());
    }
}

module.exports = XPDB;