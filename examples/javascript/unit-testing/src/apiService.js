'use strict';

const axios = require('axios');

async function getData() {

    let result;
    let path = 'https://run.mocky.io/v3/44ea80b4-c60e-437e-b99e-d5d145b30e3b';

    try {
        console.log('Step 5');
        result = await axios.get(path);

        console.log('Step 6');
        return result.data.prescriptionList || [];
    } catch (err) {
        console.error(err);
    }
}

module.exports = {
    getData,
};
