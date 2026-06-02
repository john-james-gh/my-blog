export function getBaseUrl() {
  return process.env.VERCEL === "1"
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000";
}
