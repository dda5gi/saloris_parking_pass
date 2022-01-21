const ApiCaller = require('./api_caller');

class TokenHistory extends ApiCaller {
    constructor() {
        super('https://th-api.klaytnapi.com');
    }

    async klayHistorty(address){
        const options = {
            method: 'GET',
            url: '/v2/transfer/account/' + address,
            qs: {
                size: '',
                kind: 'klay',
            },
        };

        var res = await this.call(options);
        const history = [...res.items]; // deep copy
        history.forEach(function(item) {
            console.log(item.transactionHash)
        })
    }
}

const tokenHistory = new TokenHistory();

module.exports = tokenHistory; 