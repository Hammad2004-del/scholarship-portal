const bcrypt = require("bcrypt");
const pool = require("./db");

async function createAdmin() {
    try {
        const password = "Admin@123";
        const hashedPassword = await bcrypt.hash(password, 10);

        await pool.query(
            `INSERT INTO admins (full_name, email, password)
             VALUES (?, ?, ?)`,
            [
                "Portal Admin",
                "admin@scholarship.com",
                hashedPassword
            ]
        );

        console.log("Admin account created successfully.");
        console.log("Email: admin@scholarship.com");
        console.log("Password: Admin@123");

        process.exit();
    } catch (error) {
        console.error("Error creating admin:", error);
        process.exit(1);
    }
}

createAdmin();