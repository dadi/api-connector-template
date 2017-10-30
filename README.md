### API Connector Methods

The following methods must be implemented in an API Connector to allow API to interact with the database.

`connect(options)`

* **options**
  * database - {string} the name of the database file to use
  * collection - {Object} the name of the collection to use

`find(query, collection, options, schema)`
* **query** - {Object} the query to perform
* **collection** - {string} the name of the collection to query
* **options** - {QueryOptions} a set of query options, such as offset, limit, sort, fields
* **schema** - {Object} the JSON schema for the collection

`insert(data, collection, schema)`
* **data** - {Object} a single document or an Array of documents to insert
* **collection** - {string} the name of the collection to query
* **schema** - {Object} the JSON schema for the collection

`update(query, collection, update, options, schema)`

* **query** - {Object} the query that selects documents for update
* **collection** - {string} the name of the collection to update
* **update** - {Object} the update for the documents matching the query
* **options** - {QueryOptions} a set of query options, such as offset, limit, sort, fields
* **schema** - {Object} the JSON schema for the collection

`delete(query, collection, schema)`

* **query** - {Object} the query that selects documents for deletion
* **collection** - {string} the name of the collection to delete from
* **schema** - {Object} the JSON schema for the collection

`stats(collection, options)`

* **collection** - {string} the name of the collection to get stats for
* **options** - {QueryOptions} a set of query options, such as offset, limit, sort, fields

`index(collection, indexes)`

* **collection** - {string} the name of the collection to add indexes to
* **indexes** - {Object} an array of indexes to create for the collection

`getIndexes(collection)`

* **collection** - {string} the name of the collection to get indexes for

`dropDatabase(collection)`

* **collection** - {string} the name of the collection to drop from the database. Use `null` to drop the database.


### Configuration

DADI API uses one primary configuration file to modify the behaviour of certain functions. In addition to the primary configuration file it also needs a configuration file for the data connector that is being used.

#### Configuration Files

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