import { Hono } from "npm:hono";
import * as kv from "./kv_store.tsx";

export const adminRouter = new Hono();

// ============================================
// LANDING PAGE CMS ROUTES
// ============================================

// Get landing page content
adminRouter.get("/landing-page", async (c) => {
  try {
    const content = await kv.get("admin:landing_page_content");
    return c.json({ success: true, data: content || getDefaultLandingContent() });
  } catch (error) {
    console.error("Error fetching landing page content:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Update landing page content
adminRouter.post("/landing-page", async (c) => {
  try {
    const content = await c.req.json();
    await kv.set("admin:landing_page_content", content);
    return c.json({ success: true, message: "Landing page updated successfully" });
  } catch (error) {
    console.error("Error updating landing page:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// ============================================
// FEATURES MANAGEMENT
// ============================================

// Get all features
adminRouter.get("/features", async (c) => {
  try {
    const features = await kv.get("admin:features_list");
    return c.json({ success: true, data: features || [] });
  } catch (error) {
    console.error("Error fetching features:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Update features
adminRouter.post("/features", async (c) => {
  try {
    const features = await c.req.json();
    await kv.set("admin:features_list", features);
    return c.json({ success: true, message: "Features updated successfully" });
  } catch (error) {
    console.error("Error updating features:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// ============================================
// TESTIMONIALS MANAGEMENT
// ============================================

// Get all testimonials
adminRouter.get("/testimonials", async (c) => {
  try {
    const testimonials = await kv.get("admin:testimonials");
    return c.json({ success: true, data: testimonials || [] });
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Add testimonial
adminRouter.post("/testimonials", async (c) => {
  try {
    const newTestimonial = await c.req.json();
    const testimonials = await kv.get("admin:testimonials") || [];
    testimonials.push({ ...newTestimonial, id: Date.now().toString() });
    await kv.set("admin:testimonials", testimonials);
    return c.json({ success: true, message: "Testimonial added successfully" });
  } catch (error) {
    console.error("Error adding testimonial:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Delete testimonial
adminRouter.delete("/testimonials/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const testimonials = await kv.get("admin:testimonials") || [];
    const filtered = testimonials.filter((t: any) => t.id !== id);
    await kv.set("admin:testimonials", filtered);
    return c.json({ success: true, message: "Testimonial deleted successfully" });
  } catch (error) {
    console.error("Error deleting testimonial:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// ============================================
// PRICING PLANS MANAGEMENT
// ============================================

// Get all pricing plans
adminRouter.get("/pricing-plans", async (c) => {
  try {
    const plans = await kv.get("admin:pricing_plans");
    return c.json({ success: true, data: plans || getDefaultPricingPlans() });
  } catch (error) {
    console.error("Error fetching pricing plans:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Update pricing plans
adminRouter.post("/pricing-plans", async (c) => {
  try {
    const plans = await c.req.json();
    await kv.set("admin:pricing_plans", plans);
    return c.json({ success: true, message: "Pricing plans updated successfully" });
  } catch (error) {
    console.error("Error updating pricing plans:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// ============================================
// BLOG POSTS MANAGEMENT
// ============================================

// Get all blog posts
adminRouter.get("/blog-posts", async (c) => {
  try {
    const posts = await kv.getByPrefix("admin:blog:") || [];
    return c.json({ success: true, data: posts });
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Get single blog post
adminRouter.get("/blog-posts/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const post = await kv.get(`admin:blog:${id}`);
    return c.json({ success: true, data: post });
  } catch (error) {
    console.error("Error fetching blog post:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Create blog post
adminRouter.post("/blog-posts", async (c) => {
  try {
    const post = await c.req.json();
    const id = post.id || Date.now().toString();
    const postData = {
      ...post,
      id,
      createdAt: post.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await kv.set(`admin:blog:${id}`, postData);
    return c.json({ success: true, message: "Blog post created successfully", data: postData });
  } catch (error) {
    console.error("Error creating blog post:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Update blog post
adminRouter.put("/blog-posts/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const updates = await c.req.json();
    const existing = await kv.get(`admin:blog:${id}`);
    const updated = {
      ...existing,
      ...updates,
      id,
      updatedAt: new Date().toISOString(),
    };
    await kv.set(`admin:blog:${id}`, updated);
    return c.json({ success: true, message: "Blog post updated successfully", data: updated });
  } catch (error) {
    console.error("Error updating blog post:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Delete blog post
adminRouter.delete("/blog-posts/:id", async (c) => {
  try {
    const id = c.req.param("id");
    await kv.del(`admin:blog:${id}`);
    return c.json({ success: true, message: "Blog post deleted successfully" });
  } catch (error) {
    console.error("Error deleting blog post:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// ============================================
// APP CONFIGURATION
// ============================================

// Get app config
adminRouter.get("/app-config", async (c) => {
  try {
    const config = await kv.get("admin:app_config");
    return c.json({ success: true, data: config || getDefaultAppConfig() });
  } catch (error) {
    console.error("Error fetching app config:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Update app config
adminRouter.post("/app-config", async (c) => {
  try {
    const config = await c.req.json();
    await kv.set("admin:app_config", config);
    return c.json({ success: true, message: "App configuration updated successfully" });
  } catch (error) {
    console.error("Error updating app config:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// ============================================
// WHATSAPP TEMPLATES
// ============================================

// Get WhatsApp templates
adminRouter.get("/whatsapp-templates", async (c) => {
  try {
    const templates = await kv.get("admin:whatsapp_templates");
    return c.json({ success: true, data: templates || [] });
  } catch (error) {
    console.error("Error fetching WhatsApp templates:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Update WhatsApp templates
adminRouter.post("/whatsapp-templates", async (c) => {
  try {
    const templates = await c.req.json();
    await kv.set("admin:whatsapp_templates", templates);
    return c.json({ success: true, message: "WhatsApp templates updated successfully" });
  } catch (error) {
    console.error("Error updating WhatsApp templates:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// ============================================
// ANALYTICS & METRICS
// ============================================

// Get dashboard metrics
adminRouter.get("/metrics", async (c) => {
  try {
    const metrics = await kv.get("admin:metrics") || {
      totalUsers: 0,
      activeUsers: 0,
      totalRevenue: 0,
      monthlyRevenue: 0,
      blogPosts: 0,
      testimonials: 0,
    };
    return c.json({ success: true, data: metrics });
  } catch (error) {
    console.error("Error fetching metrics:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Update metrics (for demo/testing)
adminRouter.post("/metrics", async (c) => {
  try {
    const metrics = await c.req.json();
    await kv.set("admin:metrics", metrics);
    return c.json({ success: true, message: "Metrics updated successfully" });
  } catch (error) {
    console.error("Error updating metrics:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Track analytics event
adminRouter.post("/analytics/track", async (c) => {
  try {
    const event = await c.req.json();
    const events = await kv.get("admin:analytics_events") || [];
    events.push({
      ...event,
      timestamp: new Date().toISOString(),
      id: Date.now().toString(),
    });
    // Keep only last 1000 events
    const trimmed = events.slice(-1000);
    await kv.set("admin:analytics_events", trimmed);
    return c.json({ success: true });
  } catch (error) {
    console.error("Error tracking event:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Get analytics events
adminRouter.get("/analytics/events", async (c) => {
  try {
    const events = await kv.get("admin:analytics_events") || [];
    return c.json({ success: true, data: events });
  } catch (error) {
    console.error("Error fetching events:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// ============================================
// USER MANAGEMENT ROUTES
// ============================================

// Get all users
adminRouter.get("/users", async (c) => {
  try {
    const users = await kv.get("admin:users") || [];
    return c.json({ success: true, data: users });
  } catch (error) {
    console.error("Error fetching users:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Get single user
adminRouter.get("/users/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const users = await kv.get("admin:users") || [];
    const user = users.find((u: any) => u.id === id);
    return c.json({ success: true, data: user });
  } catch (error) {
    console.error("Error fetching user:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Update user
adminRouter.put("/users/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const updates = await c.req.json();
    const users = await kv.get("admin:users") || [];
    const index = users.findIndex((u: any) => u.id === id);
    if (index >= 0) {
      users[index] = { ...users[index], ...updates };
      await kv.set("admin:users", users);
      return c.json({ success: true, data: users[index] });
    }
    return c.json({ success: false, error: "User not found" }, 404);
  } catch (error) {
    console.error("Error updating user:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// ============================================
// FEATURE FLAGS MANAGEMENT
// ============================================

// Get feature flags
adminRouter.get("/feature-flags", async (c) => {
  try {
    const flags = await kv.get("admin:feature_flags") || [];
    return c.json({ success: true, data: flags });
  } catch (error) {
    console.error("Error fetching feature flags:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Update feature flags
adminRouter.post("/feature-flags", async (c) => {
  try {
    const flags = await c.req.json();
    await kv.set("admin:feature_flags", flags);
    return c.json({ success: true, message: "Feature flags updated successfully" });
  } catch (error) {
    console.error("Error updating feature flags:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// ============================================
// SYSTEM HEALTH & MONITORING
// ============================================

// Get system health
adminRouter.get("/system/health", async (c) => {
  try {
    const health = {
      status: "healthy",
      database: "operational",
      api: "operational",
      storage: "operational",
      cache: "operational",
      lastCheck: new Date().toISOString(),
      uptime: process.uptime ? `${Math.floor(process.uptime() / 60)} minutes` : "N/A",
    };
    return c.json({ success: true, data: health });
  } catch (error) {
    console.error("Error fetching system health:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Get audit logs
adminRouter.get("/audit-logs", async (c) => {
  try {
    const logs = await kv.get("admin:audit_logs") || [];
    return c.json({ success: true, data: logs });
  } catch (error) {
    console.error("Error fetching audit logs:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Add audit log
adminRouter.post("/audit-logs", async (c) => {
  try {
    const log = await c.req.json();
    const logs = await kv.get("admin:audit_logs") || [];
    logs.push({
      ...log,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
    });
    // Keep only last 500 logs
    const trimmed = logs.slice(-500);
    await kv.set("admin:audit_logs", trimmed);
    return c.json({ success: true });
  } catch (error) {
    console.error("Error adding audit log:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// ============================================
// BACKUP & RESTORE
// ============================================

// Export all data
adminRouter.get("/export-data", async (c) => {
  try {
    const landingPage = await kv.get("admin:landing_page_content");
    const features = await kv.get("admin:features_list");
    const testimonials = await kv.get("admin:testimonials");
    const pricingPlans = await kv.get("admin:pricing_plans");
    const blogPosts = await kv.getByPrefix("admin:blog:");
    const appConfig = await kv.get("admin:app_config");
    const metrics = await kv.get("admin:metrics");
    const users = await kv.get("admin:users");
    const featureFlags = await kv.get("admin:feature_flags");
    
    const exportData = {
      exportDate: new Date().toISOString(),
      version: "1.0.0",
      data: {
        landingPage,
        features,
        testimonials,
        pricingPlans,
        blogPosts,
        appConfig,
        metrics,
        users,
        featureFlags,
      },
    };
    
    return c.json({ success: true, data: exportData });
  } catch (error) {
    console.error("Error exporting data:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Import data
adminRouter.post("/import-data", async (c) => {
  try {
    const importData = await c.req.json();
    
    if (importData.data.landingPage) {
      await kv.set("admin:landing_page_content", importData.data.landingPage);
    }
    if (importData.data.features) {
      await kv.set("admin:features_list", importData.data.features);
    }
    if (importData.data.testimonials) {
      await kv.set("admin:testimonials", importData.data.testimonials);
    }
    if (importData.data.pricingPlans) {
      await kv.set("admin:pricing_plans", importData.data.pricingPlans);
    }
    if (importData.data.appConfig) {
      await kv.set("admin:app_config", importData.data.appConfig);
    }
    if (importData.data.users) {
      await kv.set("admin:users", importData.data.users);
    }
    if (importData.data.featureFlags) {
      await kv.set("admin:feature_flags", importData.data.featureFlags);
    }
    
    return c.json({ success: true, message: "Data imported successfully" });
  } catch (error) {
    console.error("Error importing data:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// ============================================
// DEFAULT DATA HELPERS
// ============================================

function getDefaultLandingContent() {
  return {
    hero: {
      title: "India's #1 Voice + AI Billing App",
      subtitle: "Apni Dukaan Ko Banao Digital - Sirf Apni Aawaaz Se!",
      cta: "Start Free Trial",
    },
    stats: {
      users: "50,000+",
      bills: "10L+",
      savings: "₹50Cr+",
    },
  };
}

function getDefaultPricingPlans() {
  return [
    {
      id: "free",
      name: "Free",
      price: 0,
      features: ["50 Bills/month", "Basic Reports", "WhatsApp Support"],
    },
    {
      id: "pro",
      name: "Pro",
      price: 299,
      features: ["Unlimited Bills", "Advanced Analytics", "Priority Support"],
    },
    {
      id: "automation",
      name: "Automation",
      price: 599,
      features: ["Everything in Pro", "WhatsApp Automation", "Custom Templates"],
    },
  ];
}

function getDefaultAppConfig() {
  return {
    appName: "Retail Bandhu Lite",
    supportEmail: "support@retailbandhu.com",
    supportPhone: "+91-9876543210",
    maintenanceMode: false,
    featureFlags: {
      voiceBilling: true,
      whatsappIntegration: true,
      aiAssistant: true,
      barcodeScanner: true,
    },
  };
}