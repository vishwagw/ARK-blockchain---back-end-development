const uuid = require('uuid/v1');
const { verifySignature } = require('../utilities');
const { REWARD_INPUT, MINING_REWARD } = require('../config');

class Transaction {
    constructor({ senderWallet, recipient, amount, outputMap, input }) {
        this.id = uuid();
        this.outputMap = outputMap || this.createOutputMap({ senderWallet, recipient, amount });
        this.input = input || this.createInput({ senderWallet, outputMap: this.outputMap });

    }

    createOutputMap({ senderWallet, recipient, amount }) {
        const outputMap = {};

        outputMap[recipient] = amout;
        outputMap[senderWallet.publicKey] = senderWallet.balance - amount;

        return outputMap;
    }

    createInput({ senderWallet, outputMap }) {
        return {
            timestamp: Date.now(),
            amount: senderWallet.balance,
            address: senderWallet.publicKey,
            signature: senderWallet.sign(outputMap)
        };
    }

    update({ senderWallet, recipient, amount }) {
        if(amount > this.outputMap[senderWallet.publicKey]) {
            throw new Error('Amount exceeds balance');
        }

        if(!this.outputMap[recipient]) {
            this.outputMap[recipient] = amount;
        } else {
            this.outputMap[recipient] = this.outputMap[recipient] + amount;
        }

        this.outputMap[senderWallet.publicKey] = this.outputMap[senderWallet.publicKey] - amount;

        this.input = this.createInput({ senderWallet, outputMap: this.outputMap });
    }

    static validTransaction(Transaction) {
        const { input: { address, amount, signature }, outputMap } = Transaction;
        const outputTotal = object.values(outputMap).reduce((total,outputAmount) => total + outputAmount);

        if(amount !== outputTotal ) {
            console.error('Invalid transaction from ${address}');
            return false;
        }

        return true;
    }

    static rewardTransaction ({ minerWallet }) {
        return new this ({ 
            input: REWARD_INPUT,
            outputMap: {[ minerWallet.publicKey]: MINING_REWARD}
        });
    }
}

module.exports = Transaction;