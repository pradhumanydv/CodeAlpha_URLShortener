const express = require("express");
const shortid = require("shortid");

const db = require("../config/db");

const router = express.Router();

router.post("/shorten", (req, res) => {

    const { longUrl } = req.body;

    if (!longUrl) {
        return res.status(400).json({
            message: "URL Required"
        });
    }

    // URL Validation
    try {
        new URL(longUrl);
    } catch {
        return res.status(400).json({
            message: "Please Enter Valid URL"
        });
    }

    const shortCode = shortid.generate();

    db.run(
        "INSERT INTO urls (shortCode, longUrl) VALUES (?, ?)",
        [shortCode, longUrl],
        function (err) {

            if (err) {
                return res.status(500).json({
                    message: err.message
                });
            }

            res.json({
                shortUrl: `${process.env.BASE_URL}/${shortCode}`
            });

        }
    );

});

router.get("/:code", (req, res) => {

    const shortCode = req.params.code;

    db.get(
        "SELECT * FROM urls WHERE shortCode = ?",
        [shortCode],
        (err, row) => {

            if (err) {
                return res.status(500).send("Server Error");
            }

            if (!row) {
                return res.status(404).send("URL Not Found");
            }

            // Click Count Update
            db.run(
                "UPDATE urls SET clicks = clicks + 1 WHERE shortCode = ?",
                [shortCode]
            );

            res.redirect(row.longUrl);

        }
    );

});
router.get("/history/all", (req, res) => {

    db.all(
        "SELECT longUrl, shortCode, clicks FROM urls ORDER BY id DESC",
        [],
        (err, rows) => {

            if (err) {
                return res.status(500).json({
                    message: err.message
                });
            }

            res.json(rows);

        }
    );

});

module.exports = router;