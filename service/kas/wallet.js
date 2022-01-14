const ApiCaller = require('./api_caller');
const crypto = require('crypto');
const dataKey = require('./kasDataKey.json')

class Wallet extends ApiCaller {
    constructor() {
        super('https://wallet-api.klaytnapi.com');
    }

    async createAccount() {
        const options = {
            method: 'POST',
            url: '/v2/account',
            json: true,
        };

        return await this.call(options);
    }

    //KAS는 Wallet의 key 삭제 후 account를 삭제해야 키 사용량이 감소한다.
    //매우 중요!!
    async deleteKey(kasKeyId) {
        const options = {
            method: 'DELETE',
            url: '/v2/key/' + kasKeyId,
            json: true,
        };
        const res = await this.call(options);
        return res.status;
    }
    
    async deleteAccount(kasAddress) {
        const options = {
            method: 'DELETE',
            url: '/v2/account/' + kasAddress,
            json: true,
        };
        const res = await this.call(options);
        return res.status;
    }

    async sendTransfer(from, to, memo) {
        const options = {
            method: 'POST',
            url: '/v2/tx/fd/value',
            body: {
                from: from,
                to: to,
                value: "0x0",
                memo: memo,
                submit: true,
            },
            json: true,
        };
        const res = await this.call(options);
        console.log('[sendTransfer Called] :', res.status);
        return res.transactionHash;
    }

    dataEncrypt(data) {
        const cipher = crypto.createCipher('aes-256-cbc', dataKey.key);
        let result = cipher.update(data, 'utf8', 'base64');
        result += cipher.final('base64');
        return result
    }

    dataDecrypt(data) {
        const decipher = crypto.createDecipher('aes-256-cbc', dataKey.key);
        let result = decipher.update(data, 'base64', 'utf8');
        result += decipher.final('utf8');
        return result;
    }
}

const wallet = new Wallet();

module.exports = wallet; 