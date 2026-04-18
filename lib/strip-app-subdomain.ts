export function stripAppSubdomain(host: string): string {
  const [hostname, port] = host.split(":")

  const stripped = hostname.startsWith("app.") ? hostname.slice(4) : hostname

  return port ? `${stripped}:${port}` : stripped
}
