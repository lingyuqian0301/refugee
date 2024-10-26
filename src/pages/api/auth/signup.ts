// pages/api/auth/signup.ts
import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";
import { createClient } from "../../../utils/supabase/client"; // Updated path to Supabase client

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ error: "Name, email, and password are required" });
  }

  // Initialize the Supabase client
  const supabase = createClient();

  // Hash the password before storing it
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  // Step 1: Sign up user with Supabase Auth (only if you need Supabase Auth, otherwise skip)
  const { data: authUser, error: signUpError } = await supabase.auth.signUp({
    email,
    password, // For auth purposes only
  });

  if (signUpError) {
    return res.status(400).json({ error: signUpError.message });
  }

  // Step 2: Insert user details with hashed password into `users` table
  const { error: dbError } = await supabase
    .from("users")
    .insert([
      { id: authUser.user?.id, name, email, password: hashedPassword, role: 0 } // Default role is 0
    ]);

  if (dbError) {
    return res.status(500).json({ error: "Error saving user information." });
  }

  return res.status(200).json({ message: "User registered successfully" });
}
