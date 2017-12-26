const config = require('../config')
const debug = require('debug')('api:sample-connector')
const EventEmitter = require('events').EventEmitter
const path = require('path')
const util = require('util')
const uuid = require('uuid')

const STATE_DISCONNECTED = 0
const STATE_CONNECTED = 1
const STATE_CONNECTING = 2

/**
 * @typedef ConnectionOptions
 * @type {Object}
 * @property {string} database - the name of the database file to use
 * @property {Object} collection - the name of the collection to use
 */

/**
 * @typedef QueryOptions
 * @type {Object}
 * @property {number} limit - the number of records to return
 * @property {number} skip - an offset, the number of records to skip
 * @property {Object} sort - an object specifying properties to sort by. `{"title": 1}` will sort the results by the `title` property in ascending order. To reverse the sort, use `-1`: `{"title": -1}`
 * @property {Object} fields - an object specifying which properties to return. `{"title": 1}` will return results with all properties removed except for `_id` and `title`
 */

/**
 * Handles the interaction with <Database>
 * @constructor DataStore
 * @classdesc DataStore adapter for using <Database> with DADI API
 * @implements EventEmitter
 */
const DataStore = function DataStore (options) {
  this.config = options || config.get()
  this.readyState = STATE_DISCONNECTED
}

util.inherits(DataStore, EventEmitter)

/**
 * Connect to the database
 *
 * @param {ConnectionOptions} options
 */
DataStore.prototype.connect = function (options) {
  debug('connect %o', options)

  return new Promise((resolve, reject) => {

    // problem connecting, emit 'DB_ERROR' event
    // this.emit('DB_ERROR', err)

    this.database = {} // <the connected database>

    // everything is ok, emit 'DB_CONNECTED' event
    this.readyState = STATE_CONNECTED
    this.emit('DB_CONNECTED', this.database)

    return resolve()
  })
}

/**
 * Query the database
 *
 * @param {Object} query - the query to perform
 * @param {string} collection - the name of the collection to query
 * @param {QueryOptions} options - a set of query options, such as offset, limit, sort, fields
 * @param {Object} schema - the JSON schema for the collection
 * @returns {Promise.<Array, Error>} A promise that returns an Array of results,
 *     or an Error if the operation fails
 */
DataStore.prototype.find = function ({ query, collection, options = {}, schema, settings }) {
  if (this.readyState !== STATE_CONNECTED) {
    return Promise.reject(new Error('DB_DISCONNECTED'))
  }

  options = options || {}

  debug('find in %s where %o %o', collection, query, options)

  return new Promise((resolve, reject) => {
    let results = []
    return resolve(results)
  })
}

/**
 * Insert documents into the database
 *
 * @param {Object|Array} data - a single document or an Array of documents to insert
 * @param {string} collection - the name of the collection to insert into
 * @param {object} options - options to modify the query
 * @param {Object} schema - the JSON schema for the collection
 * @returns {Promise.<Array, Error>} A promise that returns an Array of inserted documents,
 *     or an Error if the operation fails
 */
DataStore.prototype.insert = function ({data, collection, options = {}, schema, settings = {}}) {
  if (this.readyState !== STATE_CONNECTED) {
    return Promise.reject(new Error('DB_DISCONNECTED'))
  }

  debug('insert into %s %o', collection, data)

  // make an Array of documents if an Object has been provided
  if (!Array.isArray(data)) {
    data = [data]
  }

  // add an _id if the document doesn't come with one
  data.forEach((document) => {
    document._id = document._id || uuid.v4()
  })

  return new Promise((resolve, reject) => {
    let results = []
    return resolve(results)
  })
}

/**
 * Update documents in the database
 *
 * @param {object} query - the query that selects documents for update
 * @param {string} collection - the name of the collection to update documents in
 * @param {object} update - the update for the documents matching the query
 * @param {object} options - options to modify the query
 * @param {object} schema - the JSON schema for the collection
 * @returns {Promise.<Array, Error>} A promise that returns an Array of updated documents,
 *     or an Error if the operation fails
 */
DataStore.prototype.update = function ({query, collection, update, options = {}, schema}) {
  if (this.readyState !== STATE_CONNECTED) {
    return Promise.reject(new Error('DB_DISCONNECTED'))
  }

  debug('update %s where %o with %o', collection, query, update)

  return new Promise((resolve, reject) => {
    let results = []
    return resolve(results)
  })
}

/**
 * Remove documents from the database
 *
 * @param {Object} query - the query that selects documents for deletion
 * @param {string} collection - the name of the collection to delete from
 * @param {Object} schema - the JSON schema for the collection
 * @returns {Promise.<Array, Error>} A promise that returns an Object with one property `deletedCount`,
 *     or an Error if the operation fails
 */
DataStore.prototype.delete = function ({query, collection, schema}) {
  if (this.readyState !== STATE_CONNECTED) {
    return Promise.reject(new Error('DB_DISCONNECTED'))
  }

  debug('delete from %s where %o', collection, query)

  return new Promise((resolve, reject) => {
    return resolve({ deletedCount: 1 })
  })
}

/**
 * Get metadata about the specfied collection, including number of records
 *
 * @param {Object} options - the query options passed from API, such as page, limit, skip
 * @returns {Object} an object containing the metadata about the collection
 */
DataStore.prototype.stats = function (collection, options) {
  if (this.readyState !== STATE_CONNECTED) {
    return Promise.reject(new Error('DB_DISCONNECTED'))
  }

  return new Promise((resolve, reject) => {
    let result = {
      count: 100
    }

    return resolve(result)
  })
}

/**
 *
 */
DataStore.prototype.index = function (collection, indexes) {
  return new Promise((resolve, reject) => {
    // Create an index on the specified field(s)
    let results = []

    indexes.forEach((index, idx) => {
      results.push({
        collection: 'collection',
        index: 'indexName'
      })

      if (idx === indexes.length - 1) {
        return resolve(results)
      }
    })
  })
}

/**
 * Get an array of indexes
 *
 * @param {string} collectionName - the name of the collection to get indexes for
 * @returns {Array} - an array of index objects, each with a name property
 */
DataStore.prototype.getIndexes = function (collectionName) {
  if (this.readyState !== STATE_CONNECTED) {
    return Promise.reject(new Error('DB_DISCONNECTED'))
  }

  return new Promise((resolve, reject) => {
    let indexes = [{
      name: 'index_1'
    }]

    return resolve(indexes)
  })
}

DataStore.prototype.dropDatabase = function (collectionName) {
  if (this.readyState !== STATE_CONNECTED) {
    return Promise.reject(new Error('DB_DISCONNECTED'))
  }

  debug('dropDatabase %s', collectionName || '')

  return new Promise((resolve, reject) => {
    return resolve()
  })
}

module.exports = DataStore
