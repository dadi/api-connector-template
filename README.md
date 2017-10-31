# DADI API Data Connector

This repository specifies the interface required to build a database connector for DADI API.

## Exports

Data connectors must export a constructor function at the root level. The constructor receives an optional object with config parameter overrides, and it should have the following methods in its prototype chain.

```js
const MyDataConnector = function (options) {
  this.config = Object.assign({}, config, options)
}

MyDataConnector.prototype.connect = function ({database, collection}) {
  // ...
}

module.exports = MyDataConnector
```

## Methods

- [`connect()`](#connectdatabase-collection)
- [`find()`](#find-query-collection-options---schema-settings-)
- [`insert()`](#insertdata-collection-options---schema-settings--)
- [`update()`](#updatequery-collection-update-options---schema)
- [`delete()`](#deletequery-collection-schema)
- [`stats()`](#statscollection-options)
- [`index()`](#indexcollection-indexes)
- [`getIndexes()`](#getindexescollection)
- [`dropDatabases()`](#dropdatabasecollection)

---

### `connect({database, collection})`

Establishes a connection to the database. API calls it both when establishing a connection for the first time and also when attempting a reconnection.

**Parameters:**
  - `database` {String}: the name of the database file to use
  - `collection` {Object}: the name of the collection to use
  
**Return value:**
- `Promise` resolved with `undefined` if the connection is successful
- `Promise` rejected with an `Error` object, with a message of `DB_DISCONNECTED`, if the connection could not be established

**Events emitted:**
- `DB_CONNECTED`: when the database connection is established
- `DB_ERROR`: when the database connection is closed or times out; an optional error object can be sent as a parameter
- `DB_RECONNECTED`: when the database connection is re-established

---

### `find({ query, collection, options = {}, schema, settings })`

Finds documents in a collection.

**Parameters:**
- `query` {Object}: the query to perform
- `collection` {String}: the name of the collection to query
- `options` {QueryOptions}: a set of query options, such as offset, limit, sort, fields
- `schema` {Object}: the JSON schema for the collection
- `settings` {Object}: the settings block of the collection schema

**Return value:**
- `Promise` resolved with an object containing:
  - `results`: An array with the matching documents
  - `metadata`: A metadata object, with the format used by [@dadi/metadata](https://github.com/dadi/metadata)
- `Promise` rejected with an `Error` object, with a message of `DB_DISCONNECTED`, if the connection to the database is unavailable

---

### `insert({data, collection, options = {}, schema, settings = {}})`

Creates documents in a collection.

**Parameters:**
- `data` {Object}: a single document or an Array of documents to insert
- `collection` {String}: the name of the collection to query
- `schema` {Object}: the JSON schema for the collection
- `settings` {Object}: the settings block of the collection schema

**Return value:**
- `Promise` resolved with an object containing an array with the inserted documents
- `Promise` rejected with an `Error` object, with a message of `DB_DISCONNECTED`, if the connection to the database is unavailable

---

### `update({query, collection, update, options = {}, schema})`

Updates documents in a collection.

**Parameters:**
- `query` {Object}: the query that selects documents for update
- `collection` {String}: the name of the collection to update
- `update` {Object}: the update for the documents matching the query
- `options` {QueryOptions}: a set of query options, such as offset, limit, sort, fields
- `schema` {Object}: the JSON schema for the collection

**Return value:**
- `Promise` resolved with an object containing a `matchedCount` property, with a count of the number of documents affected by the update operation
- `Promise` rejected with an `Error` object, with a message of `DB_DISCONNECTED`, if the connection to the database is unavailable

---

### `delete({query, collection, schema})`

Deletes documents from a collection.

**Parameters:**
- `query` {Object}: the query that selects documents for deletion
- `collection` {String}: the name of the collection to delete from
- `schema` {Object}: the JSON schema for the collection

**Return value:**
- `Promise` resolved with an object containing a `deletedCount` property, with a count of the number of documents affected by the delete operation
- `Promise` rejected with an `Error` object, with a message of `DB_DISCONNECTED`, if the connection to the database is unavailable

---

### `stats(collection, options)`

Gets statistics about the collection.

**Parameters:**
- `collection` {String}: the name of the collection to get stats for
- `options` {QueryOptions}: a set of query options, such as offset, limit, sort, fields

**Return value:**
- `Promise` resolved with an object containing the following properties:
  - `count`
  - `size`
  - `averageObjectSize`
  - `storageSize`
  - `indexes`
  - `totalIndexSize`
  - `indexSizes`
- `Promise` rejected with an `Error` object, with a message of `DB_DISCONNECTED`, if the connection to the database is unavailable

---

### `index(collection, indexes)`

Creates indexes in the collection.

**Parameters:**
- `collection` {String}: the name of the collection to add indexes to
- `indexes` {Object}: an array of indexes to create for the collection

**Return value:**
- `Promise` resolved with an an array of objects representing the indexes, with the name of the collection and the name of the index in the `collection` and `index` properties respectively
- `Promise` rejected with an `Error` object, with a message of `DB_DISCONNECTED`, if the connection to the database is unavailable

---

### `getIndexes(collection)`

Retrieves indexes from a collection.

**Parameters:**
- `collection` {String}: the name of the collection to get indexes for

**Return value:**
- `Promise` resolved with an an array of objects representing the indexes, each with the name of the index in an `name` property
- `Promise` rejected with an `Error` object, with a message of `DB_DISCONNECTED`, if the connection to the database is unavailable

---

### `dropDatabase(collection)`

Removes a collection from a database or drops the database completely.

**Parameters:**
- `collection` {String}: the name of the collection to drop from the database. Use `null` to drop the database.

**Return value:**
- `Promise` resolved with `undefined`
- `Promise` rejected with an `Error` object, with a message of `DB_DISCONNECTED`, if the connection to the database is unavailable

---

## Configuration

DADI API uses one primary configuration file to modify the behaviour of certain functions. In addition to the primary configuration file it also needs a configuration file for the data connector that is being used.

### Configuration Files

The configuration files for your API Connector must be placed in the same directory as the primary API configuration file, which is commonly `config/`.

The naming convention for API Connector configuration files follows the format `nameOfConnector.<environment>.json`

For example:

* nameOfConnector.development.json
* nameOfConnector.test.json
* nameOfConnector.production.json

The configuration file should contain an configurable properties that a user needs to connect to and configure the underlying data store.

For example:

```json
{
  "database": {
    "host": "127.0.0.1",
    "port": 2101,
    "autosaveInterval": 1000
  }
}
```

## Licence

DADI is a data centric development and delivery stack, built specifically in support of the principles of API first and COPE.

Copyright notice<br />
(C) 2017 DADI+ Limited <support@dadi.tech><br />
All rights reserved

This product is part of DADI.<br />
DADI is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version ("the GPL").

**If you wish to use DADI outside the scope of the GPL, please
contact us at info@dadi.co for details of alternative licence
arrangements.**

**This product may be distributed alongside other components
available under different licences (which may not be GPL). See
those components themselves, or the documentation accompanying
them, to determine what licences are applicable.**

DADI is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

The GNU General Public License (GPL) is available at
http://www.gnu.org/licenses/gpl-3.0.en.html.<br />
A copy can be found in the file GPL.md distributed with
these files.

This copyright notice MUST APPEAR in all copies of the product!

