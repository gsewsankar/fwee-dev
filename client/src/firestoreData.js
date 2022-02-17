import { serverTimestamp } from "@firebase/firestore";

class FirestoreData {
    static get Converter() {
        return {
            toFirestore: (customClass) => {
                let firestoreData = {};
                for (const prop in customClass) {
                    if (customClass.hasOwnProperty(prop)) {
                        firestoreData[prop] = customClass[prop];
                    }
                }
                return firestoreData;
            },
            fromFirestore: (snapshot, options) => {
                const data = snapshot.data(options);
                return new Message({
                    timestamp: data.timestamp,
                    from: data.from,
                    text: data.text,
                    transactionId: data.transactionId,
                });
            },
        };
    }
}

export class Message extends FirestoreData {
    timestamp = Date.now();
    from = undefined;
    text = undefined;
    transactionId = undefined;
}
