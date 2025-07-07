const Subscribe = require('../models/Query');
const mailSender = require('../utils/email');

// POST - Handle user query submission
exports.Query = async (req, res) => {
  const { email, name, message } = req.body;

  try {
    // Validate all fields
    if (!email || !name || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields (name, email, message) are required",
      });
    }

    // Save query to database
    const saveEmail = await Subscribe.create({ name, email, message });

    // Send confirmation email
    await mailSender(
      email,
      "Query Confirmation - Ranknest",
      {
        name,
        message,
      }
    );

    // Success response
    return res.status(200).json({
      success: true,
      message: "Query submitted and email sent successfully",
      data: saveEmail,
    });

  } catch (error) {
    console.error("Error during query submission:", error.message);
    return res.status(500).json({
      success: false,
      message: "An error occurred while processing your query.",
      error: error.message,
    });
  }
};

// GET - Fetch all submitted queries
exports.getAllQueries = async (req, res) => {
  try {
    const getAllSubscribe = await Subscribe.find().sort({ createdAt: -1 });

    // If no queries found
    if (!getAllSubscribe || getAllSubscribe.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No queries found",
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Queries retrieved successfully',
      data: getAllSubscribe,
    });

  } catch (error) {
    console.error("Error fetching queries:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
