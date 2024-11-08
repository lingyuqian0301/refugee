// src/pages/api/health/appointment.js

import { createClient } from "../../../utils/supabase/client"; // Adjusted import path as needed

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const supabaseClient = createClient();
      
      // Fetch all appointments from Supabase
      const { data, error } = await supabaseClient
        .from('appointments') // Replace with your actual table name in Supabase
        .select('*');

      if (error) throw error;

      res.status(200).json(data); // Return fetched data
    } catch (error) {
      console.error('Error fetching appointments from Supabase:', error);
      res.status(500).json({ error: 'Failed to fetch appointments' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
