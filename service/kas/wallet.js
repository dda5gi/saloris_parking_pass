const ApiCaller = require('./api_caller');

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
}

const wallet = new Wallet();

module.exports = wallet; 