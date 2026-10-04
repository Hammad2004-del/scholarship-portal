const express = require("express");
const multer = require("multer");
const path = require("path");
const pool = require("../db");
const verifyToken = require("../middleware/verifyToken");

const router = express.Router();

// Store uploaded files in /uploads with a unique, collision-safe name
const storage = multer.diskStorage({
    destination: (req, file, cb) =>
        cb(null, path.join(__dirname, "..", "uploads")),

    filename: (req, file, cb) => {
        const unique =
            Date.now() + "-" + Math.round(Math.random() * 1e9);

        cb(null, `${unique}${path.extname(file.originalname)}`);
    },
});

const upload = multer({
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024
    }
});


// =========================================================
// FRESH APPLICATION
// =========================================================

router.post(
    "/applications",
    verifyToken,

    // Check if student already has a Fresh Application
    async (req, res, next) => {
        try {
            const [existing] = await pool.query(
                "SELECT id FROM applications WHERE student_id = ? LIMIT 1",
                [req.studentId]
            );

            if (existing.length > 0) {
                return res.status(409).json({
                    error: "You have already submitted a Fresh Application."
                });
            }

            next();

        } catch (err) {
            console.error(err);

            res.status(500).json({
                error: "Could not check your existing application."
            });
        }
    },

    upload.fields([
        { name: "academic_records" },
        { name: "reference_letter" }
    ]),

    async (req, res) => {
        try {
            const {
                address,
                course,
                university,
                personal_statement
            } = req.body;

            const academicPath =
                req.files?.academic_records?.[0]?.filename || null;

            const referencePath =
                req.files?.reference_letter?.[0]?.filename || null;

            const [result] = await pool.query(
                `INSERT INTO applications
                 (student_id, address, course, university, academic_records_path, personal_statement, reference_letter_path)
                 VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [
                    req.studentId,
                    address,
                    course,
                    university,
                    academicPath,
                    personal_statement,
                    referencePath
                ]
            );

            res.status(201).json({
                message: "Application submitted.",
                applicationId: result.insertId
            });

        } catch (err) {
            console.error(err);

            res.status(500).json({
                error: "Something went wrong while submitting your application."
            });
        }
    }
);


// =========================================================
// RENEWAL
// =========================================================

router.post(
    "/renewals",
    verifyToken,

    upload.fields([
        { name: "academic_records" }
    ]),

    async (req, res) => {
        try {
            const { year_of_study } = req.body;

            const academicPath =
                req.files?.academic_records?.[0]?.filename || null;

            const [result] = await pool.query(
                `INSERT INTO renewals
                 (student_id, year_of_study, academic_records_path)
                 VALUES (?, ?, ?)`,
                [
                    req.studentId,
                    year_of_study,
                    academicPath
                ]
            );

            res.status(201).json({
                message: "Renewal submitted.",
                renewalId: result.insertId
            });

        } catch (err) {
            console.error(err);

            res.status(500).json({
                error: "Something went wrong while submitting your renewal."
            });
        }
    }
);


// =========================================================
// GET APPLICATIONS FOR LOGGED-IN STUDENT
// =========================================================

router.get(
    "/applications/me",
    verifyToken,

    async (req, res) => {
        try {
            const [applications] = await pool.query(
                "SELECT * FROM applications WHERE student_id = ? ORDER BY submitted_at DESC",
                [req.studentId]
            );

            const [renewals] = await pool.query(
                "SELECT * FROM renewals WHERE student_id = ? ORDER BY submitted_at DESC",
                [req.studentId]
            );

            res.json({
                applications,
                renewals
            });

        } catch (err) {
            console.error(err);

            res.status(500).json({
                error: "Something went wrong while fetching your applications."
            });
        }
    }
);


module.exports = router;