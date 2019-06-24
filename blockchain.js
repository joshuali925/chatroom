const SHA256 = require('crypto-js/sha256')

class Block {
    constructor(timestamp, messages, previousHash = '') {
        this.timestamp = timestamp;
        this.messages = messages;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
    }
    
    calculateHash() {
        return SHA256(this.timestamp + this.previousHash + JSON.stringify(this.messages)).toString();
    }
}

class BlockChain {
    constructor() {
        this.chain = [new Block("01/01/2001", "Genesis block", "0")];
    }
    
    getLastBlock() {
        return this.chain[this.chain.length - 1];
    }
    
    addBlock(newBlock) {
        newBlock.previousHash = this.getLastBlock().calculateHash;
        newBlock.hash = newBlock.calculateHash();
        this.chain.push(newBlock);
    }
    
    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const curr = this.chain[i];
            const prev = this.chain[i - 1];
            if (curr.previousHash !== prev.hash || curr.hash !== curr.calculateHash())
                return false;
        }
        return true;
    }
}