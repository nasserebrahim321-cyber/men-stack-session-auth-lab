const express = require("express");
const router = express.Router();
const User = require("../models/User.js");
const bcrypt = require("bcrypt");
const isSignedIn = require("../middleware/is-signed-in.js")
const Entry = require('../models/Entry.js')

// routes

router.get('/new', isSignedIn, (request, response) => {
    response.render('entry/create-new-entry.ejs')
})

router.post('/new', isSignedIn, async (request, response) => {
    const collectedIsPublic = request.body.isPublic === 'on'

    const newEntry = await Entry.create({
        title: request.body.title,
        entryBody: request.body.entryBody,
        isPublic: collectedIsPublic,
        owner: request.session.user._id
    })
    //console.log(request.session.user._id)
    response.redirect('/entries')
})

router.get('/', async (request, response) => {
    const allEntries = await Entry.find({ isPublic: true })
    response.render('entry/all-entries.ejs', { entries: allEntries })
})

router.get('/my-entries', async (request, response) => {
    const allEntries = await Entry.find({ owner: request.session.user._id })
    response.render('entry/all-entries.ejs', { entries: allEntries })
})

router.delete('/:id', async (request, response) => {
    const deletedEntry = await Entry.findByIdAndDelete(request.params.id)
    response.redirect('/')
})

// router.put('/:id', async (request, response) => {
//     const deletedEntry = await Entry.findByIdAndDelete(request.params.id)
//     response.redirect('/')
// })

module.exports = router;