const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const User = require('../schema/User');
const router = require('express').Router();


router.get('/logout', (req, res) => {
    if (req.session.user) {
        req.session.destroy((err) => {
            return res.redirect('/auth/login')
        });
    }
    return res.redirect('/auth/login')
})
router.use(function (req, res, next) {
    if (req.session.user) {
        console.log(req.session.user)
        return res.redirect("/")
    }
    next()
})
router.get("/register", (req, res) => {
    res.render("register")
})

router.post("/register",
    body('email').isEmail()
        .withMessage('Email is invalid'),
    body('password').isLength({ min: 5 })
        .withMessage('Password should always contains atleast 5 characters'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log({ errors: errors.array() });
            return res.send("invalid data")
        }
        const { email, password, firstname, lastname } = req.body;
        if (!email || !password || !firstname || !lastname) {
            return res.send("All fields are required")
        }
        try {
            const isUserExists = await User.findOne({ email });
            if (isUserExists) {
                return res.send("user already exists");
            }
            const hashPass = await bcrypt.hash(password, 10);
            const payload = { firstname, lastname, password: hashPass, email };

            const user = await User.create(payload);

            console.log(user);

            req.session.user = user;

            req.session.save();

            res.redirect("/")

        } catch (error) {
            console.log(error)
        }
    })

router.get('/login', async (req, res) => {
    res.render("login")
})

router.post("/login",
    body('email').isEmail()
        .withMessage('Email is invalid'),
    body('password').isLength({ min: 5 })
        .withMessage('Password should always contains atleast 5 characters'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log({ errors: errors.array() });
            return res.send("invalid data")
        }
        const { email, password } = req.body;
        try {
            const user = await User.findOne({ email });
            if (!user) {
                return res.send("No user found");
            }
            const isCorrectPass = await bcrypt.compare(password, user.password)
            if (!isCorrectPass) {
                return res.send("Unauthorized")
            }

            req.session.user = user;

            req.session.save();

            res.redirect("/")

        } catch (error) {
            console.log(error)
        }
    })

module.exports = router