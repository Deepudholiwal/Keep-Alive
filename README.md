# Next.js Keep-alive

Pings every URL you add, every 10 minutes (INTERVAL_MIN), from inside the Next.js server (instrumentation.js).

## Run locally
npm install
npm run build && npm start   -> http://localhost:3000

## Deploy on Render (Web Service, NOT static)
Build: npm install && npm run build
Start: npm start
Env vars (optional):
  SITES=https://app1.onrender.com,https://app2.onrender.com
  ADMIN_PASSWORD=yourpassword
  INTERVAL_MIN=10

## Must-do
Render free sleeps after 15 min without incoming traffic, and then this pinger stops too.
Add https://YOUR-PINGER.onrender.com/api/health to cron-job.org or UptimeRobot (every 5-10 min).
Does not work on Vercel (serverless, no long-running timer).
