const axios = require("axios");

const generateReferenceId = () => {
  return Math.random().toString(36).substring(2, 12).toUpperCase();
};

const createDigiLockerSession = async (req, res) => {
  const { client_id, client_secret} = req.body;

  const reference_id = req.body.reference_id || generateReferenceId(); // Generate if not provided

  const apiUrl = "https://in.staging.decentro.tech/v2/kyc/sso/digilocker/session";

  const requestBody = {
    consent: true,
    purpose: "for bank account verification",
    reference_id,
    redirect_url: "https://decentro.tech",
    pinless_signup: true,
    pinless_signin: true,
    usernameless_signup: true,
    documents_for_consent: ["ADHAR"],
  };

  const headers = {
    "Content-Type": "application/json",
    client_id,
    client_secret,
  };

  try {
    const response = await axios.post(apiUrl, requestBody, { headers });
    res.status(200).json({ ...response.data, reference_id });
  } catch (error) {
    console.error("Error creating DigiLocker session:", error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: error.response?.data || "Internal Server Error",
    });
  }
};

const downloadDigiLockerFile = async (req, res) => {
    const { client_id, client_secret } = req.body;
    const { initial_decentro_txn_id } = req.params; // Transaction ID from the URL
  
    const apiUrl = `https://in.staging.decentro.tech/v2/kyc/sso/digilocker/${initial_decentro_txn_id}/file/download`;
  
    const requestBody = {
      file_urn: req.body.file_urn,
      consent: true,
      purpose: "To download file from DigiLocker",
      reference_id: Math.random().toString(36).substring(2, 12).toUpperCase(), // Generate random reference ID
    };
  
    const headers = {
      "Content-Type": "application/json",
      client_id,
      client_secret,
    };
  
    try {
      const response = await axios.post(apiUrl, requestBody, { headers });
      res.status(200).json(response.data);
    } catch (error) {
      console.error("Error downloading DigiLocker file:", error.response?.data || error.message);
      res.status(error.response?.status || 500).json({
        error: error.response?.data || "Internal Server Error",
      });
    }
  };
  
module.exports = { createDigiLockerSession,createDigiLockerSession,
    downloadDigiLockerFile };
