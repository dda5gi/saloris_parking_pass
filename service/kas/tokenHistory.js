const ApiCaller = require('./api_caller');
const scraper = require('./scraper');
const dataCrypt = require('./dataCrypt');

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

        var history = {txs:[], cursor:''};
        var res = await this.call(options); // API 호출 
        history.cursor = res.cursor;
        
        var txHashs = [];
        for(let i = 0; i < res.items.length; i++) {
            txHashs.push(res.items[i].transactionHash)
        }
        const klayMemo = await scraper.getKlayMemo(txHashs) //TxHash에 해당하는 Memo 긁어오기 (배열로 한번에 던짐)
        for(let i = 0; i < res.items.length; i++){
            history.txs.push({'carNumber':dataCrypt.dataDecrypt(klayMemo[i]), 'time': res.items[i].timestamp})
        }
        console.log(history)
        return history
        // for (let i = 0; i < temp.length; i++) {
        //     var txHash = await Scraper.getKlayMemo(temp[i].transactionHash)
        //     history.txs.push({'txHash':txHash, 'time': temp[i].timestamp})
        // }
        // console.log(history)
        // return history
    }
}

const tokenHistory = new TokenHistory();

module.exports = tokenHistory; 