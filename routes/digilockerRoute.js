const express = require("express");
const { createDigiLockerSession } = require("../controllers/digilockerController");

const router = express.Router();

// Route to create a DigiLocker session
router.post("/digilocker/session", createDigiLockerSession);
// router.post("/digilocker/:initial_decentro_txn_id/file/download", downloadDigiLockerFile);

module.exports = router;
