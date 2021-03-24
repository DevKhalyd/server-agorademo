import { RtcTokenBuilder, RtcRole } from 'agora-access-token';
import { APP_CERTIFICATE, APP_ID } from '../../core/config/config';
import sendNotification from '../fcm/app';


const nocache = (req: any, resp: any, next: any,) => {
    resp.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    resp.header('Expires', '-1');
    resp.header('Pragma', 'no-cache');
    next();
};


const generateAccessToken = async (req: any, resp: any) => {

    resp.header('Access-Control-Allow-Origin', '*');

    const body = req.body

    const tokenDevice = body.tokenDevice
    const channel = body.channel


    if (!tokenDevice || !channel) return resp.status(401).json(
        {
            err: 'Please add tokenDevice and channel'
        }
    )

    //1. Generate token Agora

    const role = RtcRole.PUBLISHER;
    const uid = 0;
    const expireTime = 3600;

    const currentTime = Math.floor(Date.now() / 1000);
    const privilegeExpireTime = currentTime + expireTime;


    const token = RtcTokenBuilder.buildTokenWithUid(
        APP_ID,
        APP_CERTIFICATE,
        channel,
        uid,
        role,
        privilegeExpireTime);

    if (!token || token === '')
        return resp.status(401).json({
            err: 'Something went wrong'
        })

    //2. Send notification to the new Device

    const data = {
        token,
        channel
    }
    
    const hasSentSuccess = await sendNotification(tokenDevice, data)

    if (!hasSentSuccess)
        return resp.status(401).json({
            err: 'Device not available'
        })

    //2.1 If this one receive the notification return the Agora token with the channel name

    // Return the token and the channel Agora
    return resp.send({ token, channel });
};

export {
    nocache, generateAccessToken
}

