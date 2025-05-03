import fs from "node:fs";

const projectName = process.env.VITE_PROJECT_NAME.toLowerCase();
const customDomain = process.env.VITE_CUSTOM_DOMAIN;

const wranglerConfig = {
  name: `${projectName}-javadoc`,
  compatibility_date: "2025-04-01",
  workers_dev: false,
  assets: {
    directory: "./dist",
  },
  routes: [
    {
      pattern: `${projectName}.${customDomain}`,
      custom_domain: true
    }
  ]
}

fs.writeFileSync("wrangler.json", JSON.stringify(wranglerConfig, null, 2));
