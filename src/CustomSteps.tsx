declare global {
  var config: string;
  var startRequestId: string;
  var phoneNumber: string | undefined;
}

export async function startStep(input: any, flow: string, backendUrl: string) {
    var ip

    if (input.providedDeviceDescriptor) {
        ip = input.providedDeviceDescriptor.ip
    } else {
        ip = input.deviceDescriptor.ip
    }

    const phoneNumber =
        input.providedDeviceDescriptor?.phoneNumber
        || input.deviceDescriptor?.phoneNumber
        || globalThis.phoneNumber

    var startUrl = backendUrl+'/start?deviceIp=' + ip
        +'&configurationName='+globalThis.config
        +'&flow=' + flow;
    if (phoneNumber) {
        startUrl += '&phoneNumber=' + encodeURIComponent(phoneNumber);
    }

    var response = await fetch(startUrl);

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


export async function finishStep(input: any, backendUrl: string) {
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

