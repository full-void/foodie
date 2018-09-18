geocoder = require('google-geocoder');
locus = require('locus');

geo = geocoder({
    key: process.env.GOOGLE_API_KEY,
});

geo.find('Tokyo Japan', (err, res) => {
    console.log(res[0].formatted_address, res[0].location.lat)
});