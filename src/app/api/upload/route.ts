import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ success: false, error: "请先登录" }, { status: 401 });
    }
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    if (authError || !user) {
      return NextResponse.json({ success: false, error: "登录已过期" }, { status: 401 });
    }

    const formData = await request.formData();
    const files = formData.getAll("files") as File[];
    if (!files.length || files.length > 5) {
      return NextResponse.json({ success: false, error: "请上传1-5张图片" }, { status: 400 });
    }

    const urls: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith("image/")) {
        return NextResponse.json({ success: false, error: "仅支持图片格式" }, { status: 400 });
      }
      if (file.size > 5 * 1024 * 1024) {
        return NextResponse.json({ success: false, error: "单张图片不超过5MB" }, { status: 400 });
      }

      const ext = file.name.split(".").pop() || "png";
      const filename = `${user.id}/${Date.now()}-${i}.${ext}`;
      const buffer = await file.arrayBuffer();

      const { error: uploadError } = await supabaseAdmin.storage
        .from("screenshots")
        .upload(filename, buffer, { contentType: file.type, upsert: true });

      if (uploadError) {
        console.error("Upload error:", uploadError);
        return NextResponse.json({ success: false, error: "上传失败" }, { status: 500 });
      }

      const { data: publicUrl } = supabaseAdmin.storage
        .from("screenshots")
        .getPublicUrl(filename);

      urls.push(publicUrl.publicUrl);
    }

    return NextResponse.json({ success: true, data: { urls } });
  } catch (error) {
    console.error("POST /api/upload:", error);
    return NextResponse.json({ success: false, error: "上传失败" }, { status: 500 });
  }
}
