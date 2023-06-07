const express = require('express');

const app = express();
app.use(express.urlencoded({ extended: false }));

let jsonString = '';

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
    
    res.send('Data received successfully!');
  });

app.get('/user-data', (req, res) => {
    res.send(jsonString);
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
