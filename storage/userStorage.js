const fs = require('fs');
const path = require('path');

const dataFilePath = path.join(__dirname, 'userSecrets.json');

let userSecrets = {};

function loadUserSecrets() {
  try {
    if (fs.existsSync(dataFilePath)) {
      const data = fs.readFileSync(dataFilePath, 'utf8');
      userSecrets = JSON.parse(data);
      console.log('User secrets loaded from file.');
    }
  } catch (error) {
    console.error('Error loading user secrets:', error);
    userSecrets = {};
  }
}

function saveUserSecrets() {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(userSecrets, null, 2), 'utf8');
    console.log('User secrets saved to file.');
  } catch (error) {
    console.error('Error saving user secrets:', error);
  }
}

exports.storeUserSecret = (email, secret) => {
  userSecrets[email] = secret;
  saveUserSecrets();
};

exports.getUserSecret = (email) => {
  return userSecrets[email];
};

loadUserSecrets();
