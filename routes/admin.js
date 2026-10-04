const express = require("express");
const pool = require("../db");
const verifyToken = require("../middleware/verifyToken");

const router = express.Router();


// =========================================================
// ADMIN AUTHENTICATION CHECK
// =========================================================

router.use(verifyToken);

router.use((req, res, next) => {
    if (!req.adminId) {
        return res.status(403).json({
            error: "Admin access required."
        });
    }

    next();
});


// =========================================================
// GET ADMIN DASHBOARD DATA
// =========================================================

// GET /api/admin/dashboard
router.get("/admin/dashboard", async (req, res) => {
    try {

        // Get all students
        const [students] = await pool.query(
            `SELECT
                id,
                full_name,
                email,
                phone,
                university,
                course
             FROM students
             ORDER BY id DESC`
        );


        // Get all fresh applications
        const [applications] = await pool.query(
            `SELECT
                a.*,
                s.full_name,
                s.email,
                s.phone
             FROM applications a
             JOIN students s ON a.student_id = s.id
             ORDER BY a.submitted_at DESC`
        );


        // Get all renewals
        const [renewals] = await pool.query(
            `SELECT
                r.*,
                s.full_name,
                s.email,
                s.phone
             FROM renewals r
             JOIN students s ON r.student_id = s.id
             ORDER BY r.submitted_at DESC`
        );


        res.json({
            students,
            applications,
            renewals
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            error: "Something went wrong while loading admin dashboard."
        });
    }
});


// =========================================================
// UPDATE FRESH APPLICATION STATUS
// =========================================================

// PUT /api/admin/applications/:id/status
router.put("/admin/applications/:id/status", async (req, res) => {

    try {

        const applicationId = req.params.id;
        const { status } = req.body;


        // Check valid status
        if (!["pending", "approved", "rejected"].includes(status)) {

            return res.status(400).json({
                error: "Invalid status."
            });

        }


        // Check application exists
        const [applications] = await pool.query(
            "SELECT id FROM applications WHERE id = ?",
            [applicationId]
        );


        if (applications.length === 0) {

            return res.status(404).json({
                error: "Application not found."
            });

        }


        // Update status
        await pool.query(
            "UPDATE applications SET status = ? WHERE id = ?",
            [status, applicationId]
        );


        res.json({
            message: "Application status updated successfully.",
            applicationId: applicationId,
            status: status
        });


    } catch (err) {

        console.error(err);

        res.status(500).json({
            error: "Something went wrong while updating application status."
        });

    }

});


// =========================================================
// UPDATE RENEWAL STATUS
// =========================================================

// PUT /api/admin/renewals/:id/status
router.put("/admin/renewals/:id/status", async (req, res) => {

    try {

        const renewalId = req.params.id;
        const { status } = req.body;


        // Check valid status
        if (!["pending", "approved", "rejected"].includes(status)) {

            return res.status(400).json({
                error: "Invalid status."
            });

        }


        // Check renewal exists
        const [renewals] = await pool.query(
            "SELECT id FROM renewals WHERE id = ?",
            [renewalId]
        );


        if (renewals.length === 0) {

            return res.status(404).json({
                error: "Renewal not found."
            });

        }


        // Update status
        await pool.query(
            "UPDATE renewals SET status = ? WHERE id = ?",
            [status, renewalId]
        );


        res.json({
            message: "Renewal status updated successfully.",
            renewalId: renewalId,
            status: status
        });


    } catch (err) {

        console.error(err);

        res.status(500).json({
            error: "Something went wrong while updating renewal status."
        });

    }

});
// GET /api/admin/documents/:filename
router.get("/admin/documents/:filename", (req, res) => {
    const path = require("path");

    const filename = path.basename(req.params.filename);

    const filePath = path.join(
        __dirname,
        "..",
        "uploads",
        filename
    );

    res.sendFile(filePath, (err) => {
        if (err) {
            console.error("Document error:", err);

            if (!res.headersSent) {
                res.status(404).json({
                    error: "Document not found."
                });
            }
        }
    });
});

module.exports = router;