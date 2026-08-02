const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("../models/userModel");

// One-time setup helper. This is not an API route and cannot be called over HTTP.
dotenv.config({ path: "./config.env" });

const databaseConnection =
  process.env.NODE_ENV === "development"
    ? process.env.DATABASE_LOCAL
    : process.env.DATABASE.replace(
        "<db_password>",
        encodeURIComponent(process.env.DATABASE_PASSWORD),
      );

const createAcademicHead = async () => {
  const { ADMIN_FULL_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

  if (!ADMIN_FULL_NAME || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
    throw new Error(
      "Set ADMIN_FULL_NAME, ADMIN_EMAIL, and ADMIN_PASSWORD in config.env before running this script.",
    );
  }

  await mongoose.connect(databaseConnection);

  const existingAdmin = await User.findOne({ email: ADMIN_EMAIL.toLowerCase() });
  if (existingAdmin) {
    throw new Error("An account already exists with ADMIN_EMAIL. No account was created.");
  }

  // User.create runs the password hashing hook in userModel.js.
  const admin = await User.create({
    fullName: ADMIN_FULL_NAME,
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
    role: "ADMIN",
    status: "ACTIVE",
  });

  console.log(`Academic Head account created: ${admin.email}`);
};

createAcademicHead()
  .catch((err) => {
    console.error("Academic Head account was not created:", err.message);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());
