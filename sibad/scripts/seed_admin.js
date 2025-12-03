#!/usr/bin/env node
// Simple admin seeder using Supabase Admin REST endpoints.
// Run from sibad/ directory with env vars exported (e.g. `set -o allexport; source .env.local; set +o allexport; node scripts/seed_admin.js`).

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in env');
  process.exit(1);
}

const DEFAULT_ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@sibad.local';
const DEFAULT_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Ajarisi*123';
const DEFAULT_ADMIN_NAME = process.env.ADMIN_NAME || 'Admin';

async function createUser() {
  const url = `${SUPABASE_URL.replace(/\/$/, '')}/auth/v1/admin/users`;
  const body = {
    email: DEFAULT_ADMIN_EMAIL,
    password: DEFAULT_ADMIN_PASSWORD,
    email_confirm: true
  };

  console.log('Creating auth user:', DEFAULT_ADMIN_EMAIL);
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${SERVICE_KEY}`,
      apikey: SERVICE_KEY
    },
    body: JSON.stringify(body)
  });

  const data = await res.json();
  if (!res.ok) {
    console.error('Failed to create user:', res.status, data);
    return null;
  }
  console.log('Created user id:', data.id || data.user?.id || '(unknown)');
  return data;
}

async function upsertProfile(user) {
  // Try to upsert into profiles table via Supabase REST
  const restUrl = `${SUPABASE_URL.replace(/\/$/, '')}/rest/v1/profiles`;
  const profile = {
    id: user.id || (user.user && user.user.id) || null,
    email: DEFAULT_ADMIN_EMAIL,
    nama_lengkap: DEFAULT_ADMIN_NAME,
    role: 'admin'
  };

  if (!profile.id) {
    console.warn('No user id available to upsert profile; skipping profile upsert');
    return;
  }

  console.log('Upserting profiles row for id:', profile.id);
  const res = await fetch(restUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${SERVICE_KEY}`,
      apikey: SERVICE_KEY,
      Prefer: 'resolution=merge-duplicates,return=representation'
    },
    body: JSON.stringify(profile)
  });

  const data = await res.json();
  if (!res.ok) {
    console.error('Failed to upsert profile:', res.status, data);
  } else {
    console.log('Profile upsert response:', data);
  }
}

(async () => {
  try {
    const user = await createUser();
    if (user) {
      await upsertProfile(user);
      console.log('Seeding finished.');
    } else {
      console.error('User creation failed.');
      process.exit(1);
    }
  } catch (err) {
    console.error('Unexpected error:', err);
    process.exit(1);
  }
})();
