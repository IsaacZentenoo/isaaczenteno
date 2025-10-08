const fs = require('fs');

fs.readFile('./data/input.txt', 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading the secret message', err);
    return;
  }
  console.log('your secret message is:', data);
});