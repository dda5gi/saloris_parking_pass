const axios = require('axios');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer')

module.exports = {
    getKlayMemo: async function(txHashs) {
        let klayMemo = []
        const browser = await puppeteer.launch({headless: true});
        let page = await browser.newPage(); 
        for(let i = 0; i < txHashs.length; i++) {
            let url = 'https://baobab.scope.klaytn.com/tx/'+ txHashs[i] + '?tabId=inputData'
            await page.goto(url, {waitUntil: 'networkidle0'}); // waituntil 태그: 동적 페이지가 다 로딩 될 때 까지 기다림 (클레이튼 사이트가 동적이라서 안기다리면 data를 못 뽑음)
            let content = await page.content();
            let $ = cheerio.load(content);
            let data = $("#root > div > div.SidebarTemplate > div.SidebarTemplate__main > div > div > div > div.DetailPageTableTemplate > div > div.Tab__content > section > article:nth-child(3) > div > div").text()
            console.log(url)
            console.log(data)
            klayMemo.push(data)
        }
        browser.close();
        return klayMemo
    }
}
