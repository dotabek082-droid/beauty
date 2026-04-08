import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TestUser {
  email: string;
  password: string;
  name: string;
  role: 'user' | 'business_owner' | 'admin';
}

const testUsers: TestUser[] = [
  { email: "user@test.com", password: "user123", name: "Test Foydalanuvchi", role: "user" },
  { email: "business@test.com", password: "business123", name: "Biznes Egasi", role: "business_owner" },
  { email: "admin@test.com", password: "admin123", name: "Administrator", role: "admin" },
];

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Starting to seed test users...");

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    // Create admin client with service role key
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    const results: { email: string; status: string; error?: string }[] = [];

    for (const testUser of testUsers) {
      console.log(`Processing user: ${testUser.email}`);

      // Check if user already exists
      const { data: existingUsers, error: listError } = await supabaseAdmin.auth.admin.listUsers();
      
      if (listError) {
        console.error(`Error listing users: ${listError.message}`);
        results.push({ email: testUser.email, status: "error", error: listError.message });
        continue;
      }

      const existingUser = existingUsers?.users?.find(u => u.email === testUser.email);

      if (existingUser) {
        console.log(`User ${testUser.email} already exists, checking role...`);
        
        // Check if role exists
        const { data: roleData, error: roleCheckError } = await supabaseAdmin
          .from('user_roles')
          .select('*')
          .eq('user_id', existingUser.id)
          .maybeSingle();

        if (roleCheckError) {
          console.error(`Error checking role: ${roleCheckError.message}`);
        }

        if (!roleData) {
          // Assign role
          const { error: roleError } = await supabaseAdmin
            .from('user_roles')
            .insert({ user_id: existingUser.id, role: testUser.role });

          if (roleError) {
            console.error(`Error assigning role: ${roleError.message}`);
            results.push({ email: testUser.email, status: "exists_role_error", error: roleError.message });
          } else {
            console.log(`Role ${testUser.role} assigned to ${testUser.email}`);
            results.push({ email: testUser.email, status: "exists_role_assigned" });
          }
        } else {
          results.push({ email: testUser.email, status: "exists_with_role" });
        }
        continue;
      }

      // Create new user
      const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email: testUser.email,
        password: testUser.password,
        email_confirm: true,
        user_metadata: {
          full_name: testUser.name,
        },
      });

      if (createError) {
        console.error(`Error creating user ${testUser.email}: ${createError.message}`);
        results.push({ email: testUser.email, status: "create_error", error: createError.message });
        continue;
      }

      console.log(`Created user: ${testUser.email} with id: ${newUser.user.id}`);

      // Assign role
      const { error: roleError } = await supabaseAdmin
        .from('user_roles')
        .insert({ user_id: newUser.user.id, role: testUser.role });

      if (roleError) {
        console.error(`Error assigning role to ${testUser.email}: ${roleError.message}`);
        results.push({ email: testUser.email, status: "created_role_error", error: roleError.message });
      } else {
        console.log(`Role ${testUser.role} assigned to ${testUser.email}`);
        results.push({ email: testUser.email, status: "created_with_role" });
      }
    }

    console.log("Seed completed:", results);

    return new Response(JSON.stringify({ success: true, results }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error("Seed error:", errorMessage);
    return new Response(JSON.stringify({ success: false, error: errorMessage }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});