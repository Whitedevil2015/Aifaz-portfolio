---
description: Fix Vercel deployment and settings issues
---

If your Vercel deployment is not updating or showing errors, follow these steps to reset the configuration and force a fresh deployment.

## 1. Verify `vercel.json` Configuration
Ensure your `vercel.json` file controls caching correctly to prevent old versions from sticking.

1. Open `vercel.json` in your project root.
2. Ensure it contains the following to disable caching for immediate updates:
   ```json
   {
     "version": 2,
     "public": true,
     "cleanUrls": true,
     "headers": [
       {
         "source": "/(.*)",
         "headers": [
           {
             "key": "Cache-Control",
             "value": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0"
           }
         ]
       }
     ]
   }
   ```

## 2. Check Vercel Project Settings (Dashboard)
1. Go to your [Vercel Dashboard](https://vercel.com/dashboard).
2. Click on your **aifaz-portfolio** project.
3. Go to **Settings** > **General**.
4. Check **Build & Development Settings**:
   - **Framework Preset**: Should be `Other` (since this is a simple HTML/JS site).
   - **Build Command**: Leave blank (do NOT type "Empty" literally; simply disable the override or delete the text).
   - **Output Directory**: Leave empty or set to `.` if strictly needed.
   - **Root Directory**: Ensure this is `.` or left empty.

## 3. Force a Fresh Redeploy
If the settings look correct but the site is still old, force a specific redeploy without cache.

1. Go to the **Deployments** tab in the Vercel Dashboard.
2. Click the three dots (`...`) next to the latest generic deployment.
3. Select **Redeploy**.
4. **Important**: Uncheck "Use existing Build Cache" if the option is available to ensure a clean build.

## 4. Trigger via Command Line (Alternative)
If you want to trigger it from here:
1. Create an empty commit to wake up the build system:
   ```bash
   git commit --allow-empty -m "chore: manual trigger for Vercel deployment wake-up"
   git push origin main
   ```
