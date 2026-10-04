const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../db");

const router = express.Router();

// =========================================================
// STUDENT REGISTRATION
// =========================================================

// POST /api/register
router.post("/register", async (req, res) => {
    try {
        const {
            full_name,
            email,
            password,
            phone,
            university,
            course
        } = req.body;

        if (!full_name || !email || !password) {
            return res.status(400).json({
                error: "full_name, email and password are required."
            });
        }

        const [existing] = await pool.query(
            "SELECT id FROM students WHERE email = ?",
            [email]
        );

        if (existing.length > 0) {
            return res.status(409).json({
                error: "An account with this email already exists."
            });
        }

        const password_hash = await bcrypt.hash(password, 10);

        const [result] = await pool.query(
            `INSERT INTO students
             (full_name, email, password_hash, phone, university, course)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [
                full_name,
                email,
                password_hash,
                phone || null,
                university || null,
                course || null
            ]
        );

        res.status(201).json({
            message: "Account created.",
            studentId: result.insertId
        });

    } catch (err) {
        console.error(err);

        res.status(500).json({
            error: "Something went wrong while registering."
        });
    }
});


// =========================================================
// STUDENT LOGIN
// =========================================================

// POST /api/login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                error: "Email and password are required."
            });
        }

        const [rows] = await pool.query(
            "SELECT * FROM students WHERE email = ?",
            [email]
        );

        const student = rows[0];

        if (!student) {
            return res.status(401).json({
                error: "Invalid email or password."
            });
        }

        const match = await bcrypt.compare(
            password,
            student.password_hash
        );

        if (!match) {
            return res.status(401).json({
                error: "Invalid email or password."
            });
        }

        const token = jwt.sign(
            {
                studentId: student.id,
                email: student.email
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "2h"
            }
        );

        res.json({
            message: "Login successful.",
            token,
            student: {
                id: student.id,
                full_name: student.full_name,
                email: student.email
            }
        });

    } catch (err) {
        console.error(err);

        res.status(500).json({
            error: "Something went wrong while logging in."
        });
    }
});


// =========================================================
// ADMIN LOGIN
// =========================================================

// POST /api/admin-login
router.post("/admin-login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                error: "Email and password are required."
            });
        }

        const [rows] = await pool.query(
            "SELECT * FROM admins WHERE email = ?",
            [email]
        );

        const admin = rows[0];

        if (!admin) {
            return res.status(401).json({
                error: "Invalid admin email or password."
            });
        }

        const match = await bcrypt.compare(
            password,
            admin.password
        );

        if (!match) {
            return res.status(401).json({
                error: "Invalid admin email or password."
            });
        }

        const token = jwt.sign(
            {
                adminId: admin.id,
                email: admin.email,
                role: "admin"
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "2h"
            }
        );

        res.json({
            message: "Admin login successful.",
            token,
            admin: {
                id: admin.id,
                full_name: admin.full_name,
                email: admin.email
            }
        });

    } catch (err) {
        console.error(err);

        res.status(500).json({
            error: "Something went wrong while logging in as admin."
        });
    }
});


module.exports = router;