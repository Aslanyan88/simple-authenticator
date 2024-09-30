const { createCanvas, loadImage } = require('canvas');
const jsQR = require('jsqr');
const otplib = require('otplib');
const userStorage = require('../storage/userStorage');
const fs = require('fs');

exports.processQrImageAndStoreSecret = async (email, imagePath) => {
  try {
    const image = await loadImage(imagePath);
    const canvas = createCanvas(image.width, image.height);
    const ctx = canvas.getContext('2d');

    ctx.drawImage(image, 0, 0);

    const imageData = ctx.getImageData(0, 0, image.width, image.height);

    const code = jsQR(imageData.data, image.width, image.height);

    if (!code) {
      console.error('No QR code found in the image.');
      return false;
    }

    const qrCodeData = code.data;
    console.log('QR Code data:', qrCodeData);

    const url = new URL(qrCodeData);
    const secret = url.searchParams.get('secret');

    if (!secret) {
      console.error('No secret found in QR code data.');
      return false;
    }

    userStorage.storeUserSecret(email, secret);

    fs.unlinkSync(imagePath);

    return true;
  } catch (error) {
    console.error('Error in processQrImageAndStoreSecret:', error);
    return false;
  }
};

exports.getTotpForEmail = (req, res) => {
  try {
    const email = req.query.email;

    if (!email) {
      return res.status(400).json({ message: 'Email is required.' });
    }

    const secret = userStorage.getUserSecret(email);

    if (!secret) {
      return res.status(404).json({ message: `No secret found for email ${email}` });
    }

    const token = otplib.authenticator.generate(secret);

    return res.status(200).json({ email, token });
  } catch (error) {
    console.error('Error in getTotpForEmail:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};
