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
        this.chain = [new Block(0, "Genesis block", 0)];
    }
    
    getLastBlock() {
        return this.chain[this.chain.length - 1];
    }
    
    addBlock(timestamp, messages) {
        let newBlock = new Block(timestamp, messages);
        newBlock.previousHash = this.getLastBlock().hash;
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

module.exports.BlockChain = BlockChain;

let inst = new BlockChain();

inst.addBlock('', 'first');
console.log(inst.chain);
console.log(JSON.stringify(inst.chain));
console.log(inst.isChainValid());

