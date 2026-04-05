import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { corsHeaders } from "./cors.ts"

console.log("Post-registration function started!")

serve(async (req) => {
  // 1. Xử lý CORS cho các yêu cầu OPTIONS từ trình duyệt
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // 2. Khởi tạo Supabase Client với Service Role để có quyền Admin ghi đè dữ liệu
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // 3. Lấy dữ liệu từ Request Body
    const { user_id, email } = await req.json()

    if (!user_id || !email) {
      throw new Error("Dữ liệu không đầy đủ: Cần user_id và email.")
    }

    // 4. Kiểm tra danh sách Admin từ biến môi trường
    // (Lưu giá trị dưới dạng: "admin@example.com,test@example.com")
    const adminEmailsRaw = Deno.env.get('ADMIN_EMAILS') || ""
    const adminEmails = adminEmailsRaw.split(',').map(e => e.trim().toLowerCase())

    let finalRole = 'learner'
    if (adminEmails.includes(email.toLowerCase())) {
      console.log(`Email ${email} nằm trong danh sách Admin. Đang gán quyền...`)
      finalRole = 'admin'
    }

    // 5. Cập nhật Role cho người dùng trong bảng Profiles
    const { data: profile, error: updateError } = await supabaseClient
      .from('profiles')
      .update({ role: finalRole })
      .eq('id', user_id)
      .select('id, full_name, email, avatar_url, role, username')
      .single()

    if (updateError) {
      // Nếu không update được (có thể do profile chưa được tạo kịp bởi trigger SQL)
      // Thử lấy dữ liệu hiện tại để trả về (fallback)
      const { data: existingProfile } = await supabaseClient
        .from('profiles')
        .select('*')
        .eq('id', user_id)
        .single()
      
      throw new Error(`Lỗi khi cập nhật Profile: ${updateError.message}`)
    }

    // 6. Trả về dữ liệu chuẩn cho Frontend
    return new Response(
      JSON.stringify({
        success: true,
        user: profile,
        message: finalRole === 'admin' ? "Chào mừng Quản trị viên!" : "Tài khoản đã được khởi tạo."
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    )

  } catch (error) {
    console.error("Lỗi thực thi function:", error.message)
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    )
  }
})
