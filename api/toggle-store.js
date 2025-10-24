// /api/toggle-store.js
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { passcode, is_open } = req.body;

  // 🔐 Ganti kode admin sesuai keinginan
  if (passcode !== process.env.ADMIN_PASSCODE) {
    return res.status(403).json({ error: "Kode admin salah" });
  }

  const { error } = await supabase
    .from("store_status")
    .update({
      is_open,
      updated_at: new Date().toISOString(),
    })
    .eq("id", 1);

  if (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }

  res.status(200).json({ success: true });
}
