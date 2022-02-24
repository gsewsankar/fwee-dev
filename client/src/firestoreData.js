import { Timestamp } from "@firebase/firestore"

export function newMessage() {
    return {
        timestamp: Timestamp.now(),
        from: undefined,
        text: undefined,
        transactionId: undefined,
    }
}

export function asMessage(data) {
    return {
        timestamp: data.timestamp,
        from: data.from,
        text: data.text,
        transactionId: data.transactionId,
    }
}

export function newConversation() {
    return {
        created: Timestamp.now(),
        members: [],
        name: undefined,
    }
}
