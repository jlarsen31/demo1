const express = require('express');
const axios = require('axios');
const app = express();
let jsonString = '';
let urlStr = '';
const qrcode = require('qrcode');

function intake() {
    app.use(express.urlencoded({ extended: false }));

    app.get('/', (req, res) => {
        res.sendFile(__dirname + '/form.html');
    });

    app.post('/send-data', (req, res) => {
        const { name, email, phone } = req.body;
        
        console.log('Received strings:', name, email, phone);
    
        const jsonObject = {
            name: name,
            email: email,
            phone: phone
        };
        
        jsonString = JSON.stringify(jsonObject);
        
        fetch()
            .then(urlStr => {
                sendImage(urlStr);
        })
            .catch(error => {
                console.error(error);
        });
        res.send('Data received successfully!');
    });

    app.get('/user-data', (req, res) => {
        res.send(jsonString);
    });
}

function fetch() {
    return new Promise((resolve, reject) => {
        const url = 'http://localhost:3000/user-data';

        axios.get(url)
            .then(response => {
                // other stuff with JSON data here
                // Parse JSON
                const contact = JSON.parse(jsonString);

                // Format as vCard
                const vcard = `BEGIN:VCARD
                VERSION:3.0
                N:${contact.name}
                TEL:${contact.phone}
                EMAIL:${contact.email}
                END:VCARD`;

                // Generate QR code as data URL
                qrcode.toDataURL(vcard, {
                    errorCorrectionLevel: 'H',
                    type: 'png',
                }, function (err, url) {
                    if (err) {
                        console.error(err);
                        reject(err);
                    } else {
                        resolve(url);
                    }
                });
            })
            .catch(error => {
                console.error('Error retrieving data:', error);
                reject(error);
            });
    });
}

function sendImage(url) {
    console.log(url);
}

//start function chain
intake();

const port = 3000;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
