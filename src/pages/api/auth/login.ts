// pages/api/auth/login.ts
import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";
import { createClient } from "../../../utils/supabase/client"; // Adjusted import path

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  // Initialize the Supabase client
  const supabase = createClient();

  // Step 1: Fetch user details from the `users` table
  const { data: user, error: fetchError } = await supabase
    .from("users")
    .select("id, email, password, role")
    .eq("email", email)
    .single();

  if (fetchError || !user) {
    return res.status(400).json({ error: "Invalid email or password" });
  }

  // Step 2: Compare the provided password with the stored hashed password
  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    return res.status(400).json({ error: "Invalid email or password" });
  }

  // Step 3: Return success response (or a token in production)
  return res.status(200).json({ message: "Login successful", user: { id: user.id, role: user.role } });
}
