import { NextResponse } from "next/server";
import { getCategories } from "@/lib/db/categories";

export async function GET() {
  try {
    const categories = await getCategories();
    return NextResponse.json({ success: true, data: categories });
  } catch (error) {
    console.error("GET /api/categories:", error);
    return NextResponse.json({ success: false, error: "获取分类失败" }, { status: 500 });
  }
}
