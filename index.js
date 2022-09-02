require("dotenv").config();

const express = require("express");
const session = require("express-session");
const multer = require("multer");
const MongoStore = require('connect-mongo')
const DB_URI = process.env.DB_URI;

require("./utils/DB_CON")(DB_URI);

const app = express();

app.set("view engine", "ejs")

const day = 1000 * 60 * 60 * 24;
app.use(session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: true,
    cookie: { maxAge: day * 7 },
    store: MongoStore.create({
        mongoUrl: DB_URI,
        ttl: 14 * 24 * 60 * 60,
    })
}))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use("/public", express.static("public"));
app.get("/", (req, res) => {
    res.render("Homepage")
})
app.use("/auth", require('./routes/auth'))

// Handling File Uploads
const diskStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/uploads");
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + "-" + file.originalname);
    },
});

const upload = multer({ storage: diskStorage });

app.post("/api/upload", upload.array("image", 3), (req, res) => {
    const filesArr = req.files.map((file) => file.filename);
    res.status(200).json(filesArr);
});


app.listen(process.env.PORT || 5000, () => {
    console.log(`LISTENING AT http://localhost:${process.env.PORT}`);
});
