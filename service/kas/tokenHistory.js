const ApiCaller = require('./api_caller');

class TokenHistory extends ApiCaller {
    constructor() {
        super('https://th-api.klaytnapi.com');
    }

    async klayHistorty(address, cursor){
        const options = {
            method: 'GET',
            url: '/v2/transfer/account/' + address,
            qs: {
                size: '5',
                kind: 'klay',
                cursor: cursor,
            },
        };

        var history = {txs:[], cursor:''}
        var res = await this.call(options);
        history.cursor = res.cursor
        const temp = [...res.items]; // deep copy
        temp.forEach(function(item) {
            history.txs.push({'txHash':item.transactionHash, 'time': item.timestamp})
        })
        return history
    }
}

const tokenHistory = new TokenHistory();

module.exports = tokenHistory; 