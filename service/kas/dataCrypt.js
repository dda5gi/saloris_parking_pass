const crypto = require('crypto');
const dataKey = require('./kasDataKey.json')

module.exports = {
    dataEncrypt(data) {
        const cipher = crypto.createCipher('aes-256-cbc', dataKey.key);
        let result = cipher.update(data, 'utf8', 'base64');
        result += cipher.final('base64');
        return result
    },
    
    dataDecrypt(data) {
        try{
            const decipher = crypto.createDecipher('aes-256-cbc', dataKey.key);
            let result = decipher.update(data, 'base64', 'utf8');
            result += decipher.final('utf8');
            return result;
        }
        catch{
            return data
        }

    }
}
