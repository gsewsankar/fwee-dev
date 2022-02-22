export function newMessage() {
    return {
        timestamp: Date.now(),
        from: undefined,
        text: undefined,
        transactionId: undefined,
    }
}
