// Express docs: http://expressjs.com/en/api.html
const express = require('express')
// Passport docs: http://www.passportjs.org/docs/
const passport = require('passport')

// pull in Mongoose model for examples
const Request = require('../models/request')
const User = require('../models/user')

// this is a collection of methods that help us detect situations when we need
// to throw a custom error
const customErrors = require('../../lib/custom_errors')

// we'll use this function to send 404 when non-existant document is requested
const handle404 = customErrors.handle404
// we'll use this function to send 401 when a user tries to modify a resource
// that's owned by someone else
const requireOwnership = customErrors.requireOwnership

// this is middleware that will remove blank fields from `req.body`, e.g.
// { example: { title: '', text: 'foo' } } -> { example: { text: 'foo' } }
const removeBlanks = require('../../lib/remove_blank_fields')
// passing this as a second argument to `router.<verb>` will make it
// so that a token MUST be passed for that route to be available
// it will also set `req.user`
const requireToken = passport.authenticate('bearer', { session: false })

// instantiate a router (mini app that only handles routes)
const router = express.Router()

router.post('/friends', requireToken, (req, res, next) => {
  // set owner of new example to be current user
  //   req.body.request.owner = req.user.id
  console.log(req)
  req.body.friend.owner = req.user.id
  User.findById(req.body.friend.potentialFriend)
    .then((newFriend) => {
      // add a new comment subdocument to our places comments array
      newFriend.friends.push({
        potentialFriend: req.user.id
      })
      console.log(newFriend)
      // save the comments parent document (place) so that it will be saved to the database.
      return newFriend.save()
    })
  User.findById(req.user.id)
    .then((self) => {
      // add a new comment subdocument to our places comments array
      self.friends.push({
        potentialFriend: req.body.friend.potentialFriend
      })
      console.log(self)
      // save the comments parent document (place) so that it will be saved to the database.
      return self.save()
    })

    // .then((self) => {
    // //   self.requests.id(req.body.friend.requestId).remove()
    //   const query = self.requests.findOne({ sender: req.body.friend.potentialFriend })
    //   query.getFilter().remove()
    // })
    .then((user) => {
      // return status 201, the email, and the new token
      res.status(201).json({ user: user.toObject() })
    })
    .catch(next)
})
module.exports = router
