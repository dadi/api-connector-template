var ApiConnector = require('../lib')
var EventEmitter = require('events').EventEmitter
var fs = require('fs')
var path = require('path')
var querystring = require('querystring')
var should = require('should')
var url = require('url')
var uuid = require('uuid')

var config = require(__dirname + '/../config')

var usersSchema = {
  name: {
    type: 'String'
  }
}

describe('ApiConnector', function () {
  this.timeout(3000)

  beforeEach(function (done) {
    done()
  })

  afterEach(function (done) {
    setTimeout(function () {
      done()
    }, 1000)
  })

  after(function (done) {
    done()
  })

  describe('constructor', function () {
    it('should be exposed', function (done) {
      ApiConnector.should.be.Function
      done()
    })

    it('should inherit from EventEmitter', function (done) {
      var apiConnector = new ApiConnector()
      apiConnector.should.be.an.instanceOf(EventEmitter)
      apiConnector.emit.should.be.Function
      done()
    })

    it('should load config if no options supplied', function (done) {
      var apiConnector = new ApiConnector()
      should.exist(apiConnector.config)
      apiConnector.config.database.name.should.eql('my_database')
      done()
    })

    it('should load config from options supplied', function (done) {
      var apiConnector = new ApiConnector({ database: { name: 'my_big_database' } })
      should.exist(apiConnector.config)
      apiConnector.config.database.name.should.eql('my_big_database')
      done()
    })

    it('should have readyState == 0 when initialised', function (done) {
      var apiConnector = new ApiConnector()
      apiConnector.readyState.should.eql(0)
      done()
    })
  })

  describe('connect', function () {
    it('should create and return database when connecting', function (done) {
      var apiConnector = new ApiConnector()
      apiConnector.connect({ database: 'content' })
      should.exist(apiConnector.database)
      done()
    })

    it('should have readyState == 1 when connected', function (done) {
      var apiConnector = new ApiConnector()
      apiConnector.connect({ database: 'content', collection: 'posts' }).then(() => {
        apiConnector.readyState.should.eql(1)
        done()
      })
    })
  })

  describe('insert', function () {
    it('should insert a single document into the database', function (done) {
      var apiConnector = new ApiConnector()
      apiConnector.connect({ database: 'content', collection: 'users' }).then(() => {
        var user = { name: 'David' }

        apiConnector.insert({data: user, collection: 'users', options: {}, schema: usersSchema}).then((results) => {
          console.log(results)
          results.constructor.name.should.eql('Array')
          results[0].name.should.eql('David')
          done()
        })
      })
    })

    it.skip('should insert an array of documents into the database', function (done) {
      var apiConnector = new ApiConnector()
      apiConnector.connect({ database: 'content', collection: 'users' }).then(() => {
        var users = [{ name: 'Ernest' }, { name: 'Wallace' }]

        apiConnector.insert({data: users, collection: 'users', options: {}, schema: usersSchema}).then((results) => {
          results.constructor.name.should.eql('Array')
          results.length.should.eql(2)
          results[0].name.should.eql('Ernest')
          results[1].name.should.eql('Wallace')
          done()
        })
      })
    })

    it('should add _id property if one isn\'t specified', function (done) {
      var apiConnector = new ApiConnector()
      apiConnector.connect({ database: 'content', collection: 'users' }).then(() => {
        var users = [{ name: 'Ernest' }]

        apiConnector.insert({data: users, collection: 'users', options: {}, schema: usersSchema}).then((results) => {
          results.constructor.name.should.eql('Array')
          results.length.should.eql(1)
          results[0].name.should.eql('Ernest')
          should.exist(results[0]._id)
          done()
        })
      })
    })

    it('should use specified _id property if one is specified', function (done) {
      var apiConnector = new ApiConnector()
      apiConnector.connect({ database: 'content', collection: 'users' }).then(() => {
        var users = [{ _id: uuid.v4(), name: 'Ernest' }]

        apiConnector.insert({data: users, collection: 'users', options: {}, schema: usersSchema}).then((results) => {
          results.constructor.name.should.eql('Array')
          results.length.should.eql(1)
          results[0].name.should.eql('Ernest')
          results[0]._id.should.eql(users[0]._id)
          done()
        })
      })
    })
  })

  describe.skip('find', function () {
    it('should find a single document in the database', function (done) {
      var apiConnector = new ApiConnector()
      apiConnector.connect({ database: 'content', collection: 'users' }).then(() => {
        var users = [{ name: 'Ernest' }, { name: 'Wallace' }]

        apiConnector.insert({data: users, collection: 'users', options: {}, schema: usersSchema}).then((results) => {
          apiConnector.find({ name: 'Wallace' }, 'users', {}).then((results) => {
            results.constructor.name.should.eql('Array')
            results[0].name.should.eql('Wallace')
            done()
          })
        })
      })
    })

    it('should return the number of records requested when using `limit`', function (done) {
      var apiConnector = new ApiConnector()
      apiConnector.connect({ database: 'content', collection: 'users' }).then(() => {
        apiConnector.getCollection('users').then((collection) => {
          collection.clear()

          var users = [{ name: 'BigBird' }, { name: 'Ernie' }, { name: 'Oscar' }]

          apiConnector.insert({data: users, collection: 'users', options: {}, schema: usersSchema}).then((results) => {
            apiConnector.find({}, 'users', { limit: 2 }).then((results) => {
              results.constructor.name.should.eql('Array')
              results.length.should.eql(2)
              done()
            }).catch((err) => {
              done(err)
            })
          }).catch((err) => {
            done(err)
          })
        })
      })
    })

    it.skip('should sort records in ascending order by the `createdAt` property when no query or sort are provided', function (done) {
      var apiConnector = new ApiConnector()
      apiConnector.connect({ database: 'content', collection: 'users' }).then(() => {
        apiConnector.getCollection('users').then((collection) => {
          collection.clear()

          var users = [{ name: 'Ernie' }, { name: 'Oscar' }, { name: 'BigBird' }]

          apiConnector.insert({data: users, collection: 'users', options: {}, schema: usersSchema}).then((results) => {
            apiConnector.find({}, 'users').then((results) => {
              results.constructor.name.should.eql('Array')
              results.length.should.eql(3)

              results[0].name.should.eql('Ernie')
              results[1].name.should.eql('Oscar')
              results[2].name.should.eql('BigBird')
              done()
            }).catch((err) => {
              done(err)
            })
          }).catch((err) => {
            done(err)
          })
        })
      })
    })

    it('should sort records in ascending order by the query property when no sort is provided', function (done) {
      var apiConnector = new ApiConnector()
      apiConnector.connect({ database: 'content', collection: 'users' }).then(() => {
        apiConnector.getCollection('users').then((collection) => {
          collection.clear()

          var users = [{ name: 'BigBird 3' }, { name: 'BigBird 1' }, { name: 'BigBird 2' }]

          apiConnector.insert({data: users, collection: 'users', options: {}, schema: usersSchema}).then((results) => {
            apiConnector.find({ name: { '$regex': 'Big' } }, 'users').then((results) => {
              results.constructor.name.should.eql('Array')
              results.length.should.eql(3)
              results[0].name.should.eql('BigBird 1')
              results[1].name.should.eql('BigBird 2')
              results[2].name.should.eql('BigBird 3')
              done()
            }).catch((err) => {
              done(err)
            })
          }).catch((err) => {
            done(err)
          })
        })
      })
    })

    it('should sort records in ascending order by the specified property', function (done) {
      var apiConnector = new ApiConnector()
      apiConnector.connect({ database: 'content', collection: 'users' }).then(() => {
        apiConnector.getCollection('users').then((collection) => {
          collection.clear()

          var users = [{ name: 'Ernie' }, { name: 'Oscar' }, { name: 'BigBird' }]

          apiConnector.insert({data: users, collection: 'users', options: {}, schema: usersSchema}).then((results) => {
            apiConnector.find({}, 'users', { sort: { name: 1 } }).then((results) => {
              results.constructor.name.should.eql('Array')
              results.length.should.eql(3)
              results[0].name.should.eql('BigBird')
              results[1].name.should.eql('Ernie')
              results[2].name.should.eql('Oscar')
              done()
            }).catch((err) => {
              done(err)
            })
          }).catch((err) => {
            done(err)
          })
        })
      })
    })

    it('should sort records in descending order by the specified property', function (done) {
      var apiConnector = new ApiConnector()
      apiConnector.connect({ database: 'content', collection: 'users' }).then(() => {
        apiConnector.getCollection('users').then((collection) => {
          collection.clear()

          var users = [{ name: 'Ernie' }, { name: 'Oscar' }, { name: 'BigBird' }]

          apiConnector.insert({data: users, collection: 'users', options: {}, schema: usersSchema}).then((results) => {
            apiConnector.find({}, 'users', { sort: { name: -1 } }).then((results) => {
              results.constructor.name.should.eql('Array')
              results.length.should.eql(3)
              results[0].name.should.eql('Oscar')
              results[1].name.should.eql('Ernie')
              results[2].name.should.eql('BigBird')
              done()
            }).catch((err) => {
              done(err)
            })
          }).catch((err) => {
            done(err)
          })
        })
      })
    })

    it('should return only the fields specified by the `fields` property', function (done) {
      var apiConnector = new ApiConnector()
      apiConnector.connect({ database: 'content', collection: 'users' }).then(() => {
        apiConnector.getCollection('users').then((collection) => {
          collection.clear()

          var users = [{ name: 'Ernie', age: 7, colour: 'yellow' }, { name: 'Oscar', age: 9, colour: 'green' }, { name: 'BigBird', age: 13, colour: 'yellow' }]

          apiConnector.insert({data: users, collection: 'users', options: {}, schema: usersSchema}).then((results) => {
            apiConnector.find({ colour: 'yellow' }, 'users', { sort: { name: 1 }, fields: { name: 1, age: 1 } }).then((results) => {
              results.constructor.name.should.eql('Array')
              results.length.should.eql(2)

              var bigBird = results[0]
              should.exist(bigBird.name)
              should.exist(bigBird.age)
              should.exist(bigBird._id)
              should.not.exist(bigBird.colour)
              done()
            }).catch((err) => {
              done(err)
            })
          }).catch((err) => {
            done(err)
          })
        })
      })
    })
  })

  describe.skip('update', function () {
    describe('$set', function () {
      it('should update documents matching the query', function (done) {
        var apiConnector = new ApiConnector()
        apiConnector.connect({ database: 'content', collection: 'users' }).then(() => {
          apiConnector.getCollection('users').then((collection) => {
            collection.clear()

            var users = [{ name: 'Ernie', age: 7, colour: 'yellow' }, { name: 'Oscar', age: 9, colour: 'green' }, { name: 'BigBird', age: 13, colour: 'yellow' }]

            apiConnector.insert({data: users, collection: 'users', options: {}, schema: usersSchema}).then((results) => {
              apiConnector.update({ colour: 'green' }, 'users', { '$set': { colour: 'yellow' } }).then((results) => {
                apiConnector.find({ colour: 'yellow' }, 'users', {}).then((results) => {
                  results.constructor.name.should.eql('Array')
                  results.length.should.eql(3)
                  done()
                }).catch((err) => {
                  done(err)
                })
              }).catch((err) => {
                done(err)
              })
            }).catch((err) => {
              done(err)
            })
          })
        })
      })
    })

    describe('$inc', function () {
      it('should update documents matching the query', function (done) {
        var apiConnector = new ApiConnector()
        apiConnector.connect({ database: 'content', collection: 'users' }).then(() => {
          apiConnector.getCollection('users').then((collection) => {
            collection.clear()

            var users = [{ name: 'Ernie', age: 7, colour: 'yellow' }, { name: 'Oscar', age: 9, colour: 'green' }, { name: 'BigBird', age: 13, colour: 'yellow' }]

            apiConnector.insert({data: users, collection: 'users', options: {}, schema: usersSchema}).then((results) => {
              apiConnector.update({ colour: 'green' }, 'users', { '$inc': { age: 10 } }).then((results) => {
                apiConnector.find({ colour: 'green' }, 'users', {}).then((results) => {
                  results.constructor.name.should.eql('Array')
                  results.length.should.eql(1)
                  results[0].age.should.eql(19)
                  done()
                }).catch((err) => {
                  done(err)
                })
              }).catch((err) => {
                done(err)
              })
            }).catch((err) => {
              done(err)
            })
          })
        })
      })
    })
  })

  describe.skip('delete', function () {
    it('should delete documents matching the query', function (done) {
      var apiConnector = new ApiConnector()
      apiConnector.connect({ database: 'content', collection: 'users' }).then(() => {
        apiConnector.getCollection('users').then((collection) => {
          collection.clear()

          var users = [{ name: 'Ernie', age: 7, colour: 'yellow' }, { name: 'Oscar', age: 9, colour: 'green' }, { name: 'BigBird', age: 13, colour: 'yellow' }]

          apiConnector.insert({data: users, collection: 'users', options: {}, schema: usersSchema}).then((results) => {
            apiConnector.delete({ colour: 'green' }, 'users').then((results) => {
              apiConnector.find({}, 'users', {}).then((results) => {
                results.constructor.name.should.eql('Array')
                results.length.should.eql(2)
                done()
              }).catch((err) => {
                done(err)
              })
            }).catch((err) => {
              done(err)
            })
          }).catch((err) => {
            done(err)
          })
        })
      })
    })
  })

  describe.skip('database', function () {
    it('should contain all collections that have been inserted into', function (done) {
      var apiConnector = new ApiConnector()
      apiConnector.connect({ database: 'content', collection: 'users' }).then(() => {
        var user = { name: 'David' }

        apiConnector.insert({data: user, collection: 'users', options: {}, schema: usersSchema}).then((results) => {
          results.constructor.name.should.eql('Array')
          results[0].name.should.eql('David')

          apiConnector.connect({ database: 'content', collection: 'posts' }).then(() => {
            var post = { title: 'David on Holiday' }

            apiConnector.insert({data: post, collection: 'posts', options: {}, schema: usersSchema}).then((results) => {
              results.constructor.name.should.eql('Array')
              results[0].title.should.eql('David on Holiday')

              var u = apiConnector.database.getCollection('users')
              var p = apiConnector.database.getCollection('posts')
              should.exist(u)
              should.exist(p)
              done()
            }).catch((err) => {
              done(err)
            })
          }).catch((err) => {
            done(err)
          })
        })
      })
    })

    it('should handle connection to multiple databases', function (done) {
      var contentStore = new ApiConnector()
      var authStore = new ApiConnector()

      contentStore.connect({ database: 'content' }).then(() => {
        authStore.connect({ database: 'auth' }).then(() => {
          contentStore.insert({data: { name: 'Jim' }, collection: 'users', options: {}, schema: usersSchema}).then((results) => {
            authStore.insert({data: { token: '123456123456123456123456' }, collection: 'token-store', options: {}, schema: usersSchema}).then((results) => {
              contentStore.find({ name: 'Jim' }, 'users', {}).then((results) => {
                results.constructor.name.should.eql('Array')
                results[0].name.should.eql('Jim')

                authStore.find({ token: '123456123456123456123456' }, 'token-store', {}).then((results) => {
                  results.constructor.name.should.eql('Array')
                  results[0].token.should.eql('123456123456123456123456')
                  done()
                })
              })
            })
          })
        })
      })
    })
  })
})
