/**
 * Authentication API Routes
 * Handles user signup, login, and session management
 * Uses Supabase Auth
 */

import { Hono } from "npm:hono";
import { createClient } from "npm:@supabase/supabase-js@2";

export const authRouter = new Hono();

// Initialize Supabase client with service role key for admin operations
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') || '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '',
);

// ============================================
// USER SIGNUP
// ============================================

authRouter.post("/signup", async (c) => {
  try {
    const { email, password, name, storeName, phone } = await c.req.json();

    // Validate input
    if (!email || !password) {
      return c.json({ 
        success: false, 
        error: "Email and password are required" 
      }, 400);
    }

    if (password.length < 6) {
      return c.json({ 
        success: false, 
        error: "Password must be at least 6 characters" 
      }, 400);
    }

    // Create user with Supabase Auth
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: {
        name: name || email.split('@')[0],
        phone: phone || '',
        storeName: storeName || 'My Store',
        createdAt: new Date().toISOString(),
      },
      // Automatically confirm the user's email since email server isn't configured
      // In production, remove this and set up email confirmations
      email_confirm: true,
    });

    if (error) {
      console.error("Signup error:", error);
      
      // Handle duplicate email error specifically
      if (error.message?.includes('already been registered') || error.code === 'email_exists') {
        return c.json({ 
          success: false, 
          error: "This email is already registered. Please login instead." 
        }, 400);
      }
      
      return c.json({ 
        success: false, 
        error: error.message 
      }, 400);
    }

    if (!data.user) {
      return c.json({ 
        success: false, 
        error: "Failed to create user" 
      }, 500);
    }

    // Generate unique store ID for the user
    const storeId = `store_${data.user.id}`;

    // Initialize empty store data
    const kv = await import("./kv_store.tsx");
    await kv.set(`store:${storeId}:info`, {
      id: storeId,
      name: storeName || 'My Store',
      userId: data.user.id,
      ownerEmail: email,
      ownerName: name || email.split('@')[0],
      phone: phone || '',
      createdAt: new Date().toISOString(),
    });

    // Initialize empty arrays for products, customers, bills
    await kv.set(`store:${storeId}:products`, []);
    await kv.set(`store:${storeId}:customers`, []);
    await kv.set(`store:${storeId}:bills`, []);

    console.log(`✅ User created: ${email}, Store: ${storeId}`);

    return c.json({
      success: true,
      message: "User created successfully",
      data: {
        user: {
          id: data.user.id,
          email: data.user.email,
          name: name || email.split('@')[0],
        },
        storeId,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    return c.json({ 
      success: false, 
      error: String(error) 
    }, 500);
  }
});

// ============================================
// USER LOGIN (CLIENT-SIDE)
// ============================================

// Note: Login is handled client-side using Supabase client SDK
// This endpoint is just for reference and can return user info

authRouter.post("/login-info", async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    if (!authHeader) {
      return c.json({ success: false, error: "No authorization header" }, 401);
    }

    const token = authHeader.replace('Bearer ', '');

    // Get user from token
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return c.json({ success: false, error: "Invalid token" }, 401);
    }

    // Get store ID for user
    const storeId = `store_${user.id}`;

    return c.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.user_metadata?.name,
          phone: user.user_metadata?.phone,
        },
        storeId,
      },
    });
  } catch (error) {
    console.error("Login info error:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// ============================================
// PASSWORD RESET
// ============================================

authRouter.post("/reset-password", async (c) => {
  try {
    const { email } = await c.req.json();

    if (!email) {
      return c.json({ 
        success: false, 
        error: "Email is required" 
      }, 400);
    }

    // In production, this would send a password reset email
    // For now, we'll just return success
    console.log(`Password reset requested for: ${email}`);

    return c.json({
      success: true,
      message: "Password reset email sent (if account exists)",
    });
  } catch (error) {
    console.error("Password reset error:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// ============================================
// UPDATE PROFILE
// ============================================

authRouter.put("/profile", async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    if (!authHeader) {
      return c.json({ success: false, error: "Unauthorized" }, 401);
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return c.json({ success: false, error: "Invalid token" }, 401);
    }

    const { name, phone } = await c.req.json();

    // Update user metadata
    const { error: updateError } = await supabase.auth.admin.updateUserById(
      user.id,
      {
        user_metadata: {
          ...user.user_metadata,
          name: name || user.user_metadata?.name,
          phone: phone || user.user_metadata?.phone,
          updatedAt: new Date().toISOString(),
        },
      }
    );

    if (updateError) {
      return c.json({ success: false, error: updateError.message }, 400);
    }

    return c.json({
      success: true,
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error("Profile update error:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// ============================================
// GET USER STORES (For Multi-Store Support)
// ============================================

authRouter.get("/stores", async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    if (!authHeader) {
      return c.json({ success: false, error: "Unauthorized" }, 401);
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return c.json({ success: false, error: "Invalid token" }, 401);
    }

    // Get user's primary store
    const storeId = `store_${user.id}`;
    const kv = await import("./kv_store.tsx");
    const storeInfo = await kv.get(`store:${storeId}:info`) || {};

    return c.json({
      success: true,
      data: {
        stores: [
          {
            id: storeId,
            name: storeInfo.name || 'My Store',
            role: 'owner',
            createdAt: storeInfo.createdAt,
          },
        ],
      },
    });
  } catch (error) {
    console.error("Get stores error:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// ============================================
// VERIFY TOKEN (Middleware helper)
// ============================================

export async function verifyToken(token: string): Promise<{
  valid: boolean;
  userId?: string;
  storeId?: string;
  error?: string;
}> {
  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return {
        valid: false,
        error: "Invalid or expired token",
      };
    }

    return {
      valid: true,
      userId: user.id,
      storeId: `store_${user.id}`,
    };
  } catch (error) {
    return {
      valid: false,
      error: String(error),
    };
  }
}