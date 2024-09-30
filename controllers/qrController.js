const path = require('path');
const totpService = require('../services/totpService');

exports.processScreenshotAndEmail = async (req, res) => {
  try {
    const email = req.body.email;
    const file = req.file;

    if (!email || !file) {
      return res.status(400).json({ message: 'Email and QR image are required.' });
    }

    const imagePath = path.join(__dirname, '../', 'uploads', file.filename);

    const success = await totpService.processQrImageAndStoreSecret(email, imagePath);

    if (success) {
      return res.status(200).json({ message: `Secret stored for ${email}` });
    } else {
      return res.status(500).json({ message: 'Failed to process QR code.' });
    }
  } catch (error) {
    console.error('Error in processScreenshotAndEmail:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};
