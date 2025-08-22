declare global {
  var config: string;
  var startRequestId: string;
}

export const backendUrl = 'https://gta.dev.prove-auth.proveapis.com/mobile_auth/v1';

export async function startStep(input: any, flow: string) {
    const response = await fetch(backendUrl+'/start?deviceIp='+input.providedDeviceDescriptor.ip
    +'&configurationName='+globalThis.config
    +'&flow=' + flow);
    var json;
    
    try {
        json = await response.json();
    } catch (e) {
        console.log(e)
    }

    if (response.status !== 200) {
        throw new Error(json && json.error ? json.error : 'invalid response status code '+response.status);
    }
    
    globalThis.startRequestId = json.requestId;
    return json.redirectTargetUrl 
}


export async function finishStep(input: any) {
    const response = await fetch(backendUrl+'/finish?vfp='+input.vfp+'&configurationName='+globalThis.config);
    var json;
    
    try {
        json = await response.json();
        var jsonFinishRsp = JSON.stringify(json.phoneInfo);
        console.log('finish phone number ?' + jsonFinishRsp)
    } catch (e) {
        console.log(e)
    }

    if (response.status !== 200) {
        throw new Error(json && json.error ? json.error : 'invalid response status code '+response.status);
    }
    return json.phoneInfo
}

