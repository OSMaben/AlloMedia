const  express = require('express');

const Dashboard  = async (req, res) => {
    try
    {
        return res.status(200).json({msg: 'success'});

    }catch (err)
    {
        console.log('there was an error', err);
    }
}

module.exports = {Dashboard};