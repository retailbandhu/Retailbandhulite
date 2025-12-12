# 🚀 Retail Bandhu Lite - Deployment Guide

Complete guide for deploying Retail Bandhu Lite to production.

---

## 📋 **Pre-Deployment Checklist**

### **Code Review** ✅
- [x] All features tested
- [x] No console errors
- [x] TypeScript compilation successful
- [x] All imports resolved
- [x] No TODO comments in production code

### **Assets** ✅
- [x] App icons (8 sizes) in `/public/icons/`
- [x] Manifest.json configured
- [x] Service worker ready
- [x] Favicons added
- [x] OG image (optional)

### **Configuration** ✅
- [x] Environment variables set
- [x] API endpoints configured
- [x] Analytics IDs (if using)
- [x] Error tracking (if using)

---

## 🌐 **Deployment Options**

### **Option 1: Netlify** (Recommended - Easiest)

#### **Steps:**
1. **Create Account**
   ```
   https://www.netlify.com/
   ```

2. **Deploy via Drag & Drop**
   - Build the app locally
   - Drag the `dist` folder to Netlify
   - Done!

3. **Or Deploy via Git**
   ```bash
   # Install Netlify CLI
   npm install -g netlify-cli
   
   # Login
   netlify login
   
   # Deploy
   netlify deploy --prod
   ```

4. **Configure**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Set redirects for SPA:
   
   Create `public/_redirects`:
   ```
   /*    /index.html   200
   ```

#### **Custom Domain**
```bash
# In Netlify dashboard
Domain Settings → Add custom domain → Follow DNS instructions
```

#### **HTTPS**
- Automatically provided by Netlify
- Force HTTPS in settings

---

### **Option 2: Vercel** (Great for React)

#### **Steps:**
1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   # Login
   vercel login
   
   # Deploy
   vercel --prod
   ```

3. **Or Deploy via GitHub**
   - Push code to GitHub
   - Import repository in Vercel dashboard
   - Auto-deploys on every push

#### **Configuration**
```json
// vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

---

### **Option 3: GitHub Pages** (Free)

#### **Steps:**
1. **Install gh-pages**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Add to package.json**
   ```json
   {
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     },
     "homepage": "https://username.github.io/retail-bandhu-lite"
   }
   ```

3. **Deploy**
   ```bash
   npm run deploy
   ```

4. **Configure GitHub Pages**
   - Repository Settings → Pages
   - Source: gh-pages branch
   - Save

---

### **Option 4: Firebase Hosting** (Google)

#### **Steps:**
1. **Install Firebase CLI**
   ```bash
   npm install -g firebase-tools
   ```

2. **Login & Initialize**
   ```bash
   firebase login
   firebase init hosting
   ```

3. **Configure**
   ```json
   // firebase.json
   {
     "hosting": {
       "public": "dist",
       "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
       "rewrites": [
         {
           "source": "**",
           "destination": "/index.html"
         }
       ]
     }
   }
   ```

4. **Deploy**
   ```bash
   npm run build
   firebase deploy
   ```

---

### **Option 5: Self-Hosted** (VPS/Server)

#### **Nginx Configuration**
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /var/www/retail-bandhu-lite;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Service Worker - no cache
    location /service-worker.js {
        add_header Cache-Control "no-cache, no-store, must-revalidate";
        expires 0;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

#### **SSL with Let's Encrypt**
```bash
sudo certbot --nginx -d yourdomain.com
```

---

## 🔐 **Environment Variables**

### **Create `.env` file**
```env
# Analytics (Optional)
VITE_GA_ID=G-XXXXXXXXXX
VITE_SENTRY_DSN=https://xxx@sentry.io/xxx

# API Keys (Optional)
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=xxx

# App Config
VITE_APP_VERSION=1.0.0
VITE_APP_ENV=production
```

### **Access in Code**
```typescript
const apiUrl = import.meta.env.VITE_SUPABASE_URL;
const version = import.meta.env.VITE_APP_VERSION;
```

---

## 📊 **Post-Deployment Setup**

### **1. Analytics** (Optional)

#### **Google Analytics 4**
```html
<!-- Add to index.html <head> -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

#### **Plausible Analytics** (Privacy-friendly)
```html
<script defer data-domain="yourdomain.com" src="https://plausible.io/js/script.js"></script>
```

---

### **2. Error Tracking** (Optional)

#### **Sentry**
```bash
npm install @sentry/react
```

```typescript
// In App.tsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.VITE_APP_ENV,
  integrations: [new Sentry.BrowserTracing()],
  tracesSampleRate: 0.1,
});
```

---

### **3. Performance Monitoring**

#### **Web Vitals**
```bash
npm install web-vitals
```

```typescript
// In index.tsx
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

function sendToAnalytics(metric) {
  // Send to your analytics endpoint
  console.log(metric);
}

getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getFCP(sendToAnalytics);
getLCP(sendToAnalytics);
getTTFB(sendToAnalytics);
```

---

## 🔍 **SEO Optimization**

### **Meta Tags** (Already in index.html)
```html
<meta name="description" content="Voice + AI Billing App for Indian Kirana Stores">
<meta name="keywords" content="billing, kirana, POS, India, retail">
<meta name="author" content="Retail Bandhu">

<!-- Open Graph -->
<meta property="og:title" content="Retail Bandhu Lite">
<meta property="og:description" content="Complete billing solution for retailers">
<meta property="og:image" content="/og-image.png">
<meta property="og:url" content="https://yourdomain.com">
<meta property="og:type" content="website">

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Retail Bandhu Lite">
<meta name="twitter:description" content="Voice AI Billing for Indian Retailers">
<meta name="twitter:image" content="/og-image.png">
```

### **Sitemap** (Optional)
```xml
<!-- public/sitemap.xml -->
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://yourdomain.com/</loc>
    <lastmod>2025-12-03</lastmod>
    <priority>1.0</priority>
  </url>
</urlset>
```

### **Robots.txt**
```
# public/robots.txt
User-agent: *
Allow: /
Sitemap: https://yourdomain.com/sitemap.xml
```

---

## 📱 **PWA Deployment Checklist**

- [x] `manifest.json` configured
- [x] App icons in all sizes
- [x] Service Worker registered
- [x] Offline fallback page
- [x] HTTPS enabled
- [x] Start URL set
- [x] Theme color defined
- [x] Install prompt implemented

### **Test PWA**
1. Open Chrome DevTools
2. Application tab → Manifest
3. Check all fields are valid
4. Application tab → Service Workers
5. Check if registered
6. Lighthouse → PWA audit

---

## 🧪 **Testing in Production**

### **Manual Testing Checklist**
- [ ] Test on real Android device
- [ ] Test on real iOS device
- [ ] Test install flow
- [ ] Test offline mode
- [ ] Test all major features
- [ ] Test data persistence
- [ ] Test WhatsApp sharing
- [ ] Test print functionality

### **Automated Testing**
```bash
# Lighthouse CI
npm install -g @lhci/cli
lhci autorun --upload.target=temporary-public-storage
```

---

## 📈 **Monitoring & Maintenance**

### **Health Checks**
```javascript
// Setup a simple health check endpoint
// Or use UptimeRobot, Pingdom, etc.
```

### **Backup Strategy**
- Users' data in LocalStorage (client-side)
- No server-side backup needed
- Users can export their own data
- When Supabase added: Automatic cloud backups

### **Update Strategy**
```javascript
// Service Worker update
self.addEventListener('activate', (event) => {
  // Delete old caches
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => cacheName !== CURRENT_CACHE)
          .map((cacheName) => caches.delete(cacheName))
      );
    })
  );
});
```

---

## 🚨 **Rollback Plan**

### **Quick Rollback**
1. **Netlify/Vercel**: Use dashboard to rollback to previous deployment
2. **GitHub Pages**: Revert commit and re-deploy
3. **Self-hosted**: Keep previous build in `dist-backup/`

### **Gradual Rollout**
```bash
# Use Netlify Deploy Previews
netlify deploy # Creates preview URL
# Test thoroughly
netlify deploy --prod # Deploy to production
```

---

## 📞 **Support Setup**

### **User Support**
- Add support email: support@yourdomain.com
- Setup WhatsApp Business number
- Create FAQ page
- Add in-app feedback form

### **Developer Support**
- Document common issues
- Create troubleshooting guide
- Setup error monitoring
- Maintain changelog

---

## 🎉 **Launch Checklist**

### **Pre-Launch**
- [ ] All features working
- [ ] No console errors
- [ ] Performance tested
- [ ] Security audited
- [ ] Legal pages (Privacy, Terms)
- [ ] Support channels ready
- [ ] Monitoring setup
- [ ] Backup plan ready

### **Launch Day**
- [ ] Deploy to production
- [ ] Test all critical paths
- [ ] Monitor error rates
- [ ] Monitor performance
- [ ] Announce to users
- [ ] Social media posts
- [ ] Press release (if applicable)

### **Post-Launch**
- [ ] Monitor analytics
- [ ] Collect user feedback
- [ ] Fix critical bugs ASAP
- [ ] Plan next iteration
- [ ] Update documentation
- [ ] Celebrate! 🎉

---

## 📚 **Additional Resources**

- [Netlify Docs](https://docs.netlify.com/)
- [Vercel Docs](https://vercel.com/docs)
- [Firebase Docs](https://firebase.google.com/docs/hosting)
- [PWA Checklist](https://web.dev/pwa-checklist/)
- [Lighthouse Guide](https://developer.chrome.com/docs/lighthouse/)

---

## 🆘 **Common Issues**

### **Issue: Service Worker not updating**
**Solution:**
```javascript
// Clear cache and unregister
navigator.serviceWorker.getRegistrations().then(registrations => {
  registrations.forEach(reg => reg.unregister());
});
```

### **Issue: App not installing**
**Solution:**
- Check HTTPS is enabled
- Verify manifest.json has no errors
- Check Service Worker is registered
- Test on different devices

### **Issue: LocalStorage full**
**Solution:**
- Implement data cleanup
- Prompt user to export old data
- Use IndexedDB for larger datasets

---

## 🎯 **Success Metrics**

Track these after deployment:
- Install rate (PWA installs)
- Daily active users
- Session duration
- Feature usage
- Error rate
- Performance scores
- User satisfaction (NPS)

---

**Deployment Version**: 1.0.0  
**Last Updated**: December 3, 2025  
**Status**: Ready for Production 🚀

---

**Need help?** Contact: tech@retailbandhu.com
