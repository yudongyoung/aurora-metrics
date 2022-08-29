import express from 'express';
import fetch from 'node-fetch';

const app = express();
const port = 3000;

async function getData(method) {

    const p = {
        method: 'POST',
        body: JSON.stringify({
            "jsonrpc": "2.0",
            "method": method,
            "params": [],
            "id": 1
        }),
        headers: { 'Content-Type': 'application/json' }
    };

    const response = await fetch('https://aurora-mainnet-rpc.allthatnode.com', p);
    const data = await response.json();
    return data.result;

}

app.get('/', function(req, res) {
    res.send(`
    This is aurora metrics service.<br>
    Link: <a href="/metrics">/metrics</a>
    `);
});

app.get('/metrics',async (req, res) => {
    res.contentType("text");
    const web3_clientVersion = `web3_clientVersion ${await getData('web3_clientVersion')}`;
    const net_listening = `net_listening ${await getData('net_listening')}`;
    const net_peerCount = `net_peerCount ${parseInt(await getData('net_peerCount'), 16)}`;
    const net_version = `net_version ${await getData('net_version')}`;
    const eth_blockNumber = `eth_blockNumber ${parseInt(await getData('eth_blockNumber'), 16)}`;

const sendToDate = `# TYPE aurora_method summary
${web3_clientVersion}
${net_listening}
${net_peerCount}
${net_version}
${eth_blockNumber}`;
    
    res.send(sendToDate);

});

app.listen(port, () => {
    console.log(`start to : http://localhost:${port}/`)
})

