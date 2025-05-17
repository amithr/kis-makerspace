import { createClient } from '@supabase/supabase-js'
import { v4 as uuidv4 } from "uuid"; // to make file names unique

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(
  supabaseUrl, supabaseAnonKey)

export async function getAllRequests({ exclude_statuses = [], user_id } = {}) {
  let query = supabase.from("requests").select("*");

  // ✅ Exclude one or more statuses
  if (exclude_statuses.length === 1) {
    query = query.not("status", "eq", exclude_statuses[0]);
  } else if (exclude_statuses.length > 1) {
    query = query.not("status", "in", `(${exclude_statuses.join(",")})`);
  }

  // ✅ Optionally filter by user_id
  if (user_id) {
    query = query.eq("user_id", user_id);
  }

  const { data, error } = await query;

  if (error || !data) {
    console.error("Failed to fetch requests:", error);
    return [];
  }

  // Enrich results
  const requests = await Promise.all(
    data.map(async (request) => {
      const name = await getUserNameFromProfile(request.user_id);
      const email_address = await getUserEmail(request.user_id);
      const signed_link = await generateRequestDownloadLink(request.file_url);

      return {
        ...request,
        name,
        email_address,
        signed_link,
      };
    })
  );

  return requests;
}

export async function getUserName(userId) {
    const { data, error } = await supabase
        .from('users')
        .select('name')
        .eq('id', userId)
        .single(); // because you expect only one user

    console.log(error);
    return data.name;
}

export async function getUserNameFromProfile(userId) {
  const { data: profile, error: profileError } = await supabase
  .from('profiles')
  .select('name')
  .eq('id', userId)
  .single()

if (profileError) {
  console.error('Error fetching profile:', profileError.message)
  return null
}

return profile.name
}

export async function getUserEmail(userId) {
    const { data, error } = await supabase
        .from('profiles')
        .select('email_address')
        .eq('id', userId)
        .single(); // because you expect only one user

    return data.email_address;
}

export async function uploadFile(file) {
    const { data, error } = await supabase
    .storage
    .from('kis-makerspace-files')
    .upload(`public/${uuidv4()}-${file.name}`, file, {
        cacheControl: '3600',
        upsert: false
    })
    console.log(error);
    return data;
}

export async function createRequest({ user_id, type, file_url, notes, status }) {
  const { data, error } = await supabase
    .from('requests')
    .insert([
      {
        user_id: user_id,
        type: type,
        file_url: file_url,
        notes: notes,
        status: status,
      }
    ])
    .select(); // optional: returns the inserted row(s)

  if (error) {
    console.error('Error inserting request:', error);
    return null;
  }

  return data;
}

export async function updateRecordById({ table, id, updates }) {
  const { data, error } = await supabase
    .from(table)
    .update(updates)
    .eq('id', id)    // always match the 'id' field
    .select();       // optional: return the updated row

  if (error) {
    console.error(`Error updating ${table} record with id ${id}:`, error);
    return null;
  }

  return data;
}

export async function updateRequest(id, field, newValue) {
  const data = updateRecordById(
      {
          table: 'requests',
          id: id,
          updates: {[field]: newValue}
      }
  )
  
  return data;
}

export async function deleteRequest(id, fileUrl) {
  console.log('ID: ' + id);
  const { data, error } = await supabase
    .from('requests')
    .delete()
    .eq('id', id);

  if (error) {
    console.error(`Error deleting record with id ${id}:`, error);
    return null;
  } else {
    await deleteFile(fileUrl); 
  }

  return data;
}

async function deleteFile(file_url) {
  const { data, error } = await supabase
  .storage
  .from('kis-makerspace-files') // replace with your actual bucket name
  .remove([file_url]); // replace with your extracted path

  if (error) {
    console.error('Error deleting file:', error.message);
  }
}

export async function generateRequestDownloadLink(file_url) {
    const { data, error } = await supabase
        .storage
        .from('kis-makerspace-files')          // your bucket name
        .createSignedUrl(file_url, 60); // file path and expiry time in seconds

    if (error) {
    console.error('Error creating signed URL:', error);
    } else {
    return data.signedUrl;
    }
}

export async function handleSignUp({email, password, name, age}) {
  const { error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
      console.error('Sign Up error:', error.message);
  }
}

export async function getCurrentUser() {
  const {
    data: { user },
    error
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return user;
}

export async function handleLogout() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error('Logout error:', error.message);
  } else {
    console.log('User signed out successfully.');
  }
}

export async function createUserProfile({id, name, email_address, age}) {
  const { error } = await supabase.from("profiles").insert([
    {
      id: id, // Use this as the primary or foreign key
      name: name,
      email_address: email_address,
      age: age,
      // Add any other fields from formData you want
    },
  ]);

  return error;
}

export async function sendEmail({
  to,
  subject,
  html,
}) {
  // Step 1: Get the current user's access token
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error || !session) {
    console.error("No session found or failed to retrieve it.");
    return { success: false, message: "User not authenticated" };
  }

  const accessToken = session.access_token;

  // Step 2: Make request to Supabase Edge Function
  const response = await fetch("https://ikzwpgecawpusbzznpob.supabase.co/functions/v1/resend-email", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ to, subject, html }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Failed to send email:", errorText);
    return { success: false, message: errorText };
  }

  const result = await response.json();
  return { success: true, data: result };
}