const soap = require('soap');

// Create the SOAP client
const url = 'http://localhost:8000/weather?wsdl';
soap.createClient(url, function(err, client) {
  if (err) {
    console.error('Error creating SOAP client:', err);
    return;
  }

  // Make a SOAP request
  const args = { location: 'New York' };
  client.GetWeather(args, function(err, result) {
    if (err) {
      console.error('Error making SOAP request:', err);
      return;
    }

    // Handle the SOAP response
    console.log('Temperature:', result.temperature);
    console.log('Description:', result.description);
  });
});