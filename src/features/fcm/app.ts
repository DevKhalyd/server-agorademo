import * as admin from 'firebase-admin';
import { messaging } from 'firebase-admin';


  //NOTE: Refer to:
  //https://firebase.flutter.dev/docs/messaging/usage/#topics

const serviceAccount = require("../../../files/keyStore.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://angorademo-62148.firebaseio.com",
});



async function sendNotification(token: string, data: any): Promise<Boolean> {

    let success = true;

    try {

        await messaging().send({
            token: token,
            data: data,
            // {
            //    data:data
            // }
            // Set Android priority to "high"
            android: {
                priority: "high",
            },
            // Add APNS (Apple) config
            apns: {
                payload: {
                    aps: {
                        contentAvailable: true,
                    },
                },
                //TODO: Remove this if we need to show in the foreground
                headers: {
                    "apns-push-type": "background",
                    "apns-priority": "5", // Must be `5` when `contentAvailable` is set to true.
                    "apns-topic": "io.flutter.plugins.firebase.messaging", // bundle identifier
                },
            },

        })
    } catch (error) {
        success = false
    }

    return success;
}



export default sendNotification