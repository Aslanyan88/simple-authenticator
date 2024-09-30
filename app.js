const express = require('express');
const multer = require('multer');
const path = require('path');
const qrController = require('./controllers/qrController');
const totpService = require('./services/totpService');

const app = express();
const port = 3000;

app.use(express.json());

const fs = require('fs');
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage: storage });

app.post('/setup', upload.single('qrImage'), qrController.processScreenshotAndEmail);

app.get('/totp', totpService.getTotpForEmail);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
