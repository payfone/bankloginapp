const ENV_TO_URL: Record<string, string> = {
    cloud: 'https://us-central1-prove-testapp.cloudfunctions.net/api/mobile_auth/v1',
    gta: 'https://gta.dev.prove-auth.proveapis.com/mobile_auth/v1',
}

export function getBackendUrl(env: string | null): string {
    if (!env) return ENV_TO_URL['gta']
    const normalized = String(env).toLowerCase().trim()
    return ENV_TO_URL[normalized] ?? ''
}
  
export function getFlowPath(env: string | null): string {
    if (!env) return 'pixel-gta'
    const normalized = String(env).toLowerCase().trim()
    return normalized === 'cloud' ? 'pixel' : 'pixel-gta'
}
