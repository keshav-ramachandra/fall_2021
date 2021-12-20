const Sub = require('../models/subs-model')

createSub = (req, res) => {
    const body = req.body

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide Sub',
        })
    }

    const sub = new Sub(body)

    if (!sub) {
        return res.status(400).json({ success: false, error: err })
    }

    sub
        .save()
        .then(() => {
            return res.status(201).json({
                success: true,
                id: sub._id,
                message: 'Sub created!',
            })
        })
        .catch(error => {
            return res.status(400).json({
                error,
                message: 'Sub not created!',
            })
        })
}


getSubs = async (req, res) => {
    await Sub.find({}, (err, subs) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        if (!subs.length) {
            return res
                .status(404)
                .json({ success: false, error: `Subs not found` })
        }
        return res.status(200).json({ success: true, data: subs })
    }).catch(err => console.log(err))
}

module.exports = {
    createSub,
    getSubs
}