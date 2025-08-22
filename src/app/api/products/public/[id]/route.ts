import { NextRequest } from "next/server";
import { envConfig } from "@/config";

export async function GET(_request: NextRequest, ctx: any) {
  const id = ctx?.params?.id as string;

  console.log("Product detail API called for ID:", id);

  try {
    const backendUrl = `${envConfig.NEXT_PUBLIC_API_END_POINT}/products/${id}`;
    console.log("Backend URL:", backendUrl);

    const res = await fetch(backendUrl, { cache: "no-store" });
    console.log("Product detail API response status:", res.status);

    if (!res.ok) {
      console.error("Product detail API error - status:", res.status);
      return new Response(
        JSON.stringify({ data: null, message: "Product not found" }),
        {
          status: res.status,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    let raw;
    try {
      const text = await res.text();
      raw = text ? JSON.parse(text) : null;
    } catch (error) {
      console.error("JSON parse error:", error);
      raw = null;
    }
    console.log("Product detail API raw response:", raw);

    // Backend returns ResponseData<ProductDetailResponse>
    // So raw.data should be the product detail object
    const productData = raw?.data || null;
    console.log("Product detail normalized data:", productData);

    return new Response(JSON.stringify({ data: productData }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Product detail API error:", e);
    return new Response(
      JSON.stringify({ data: null, message: "Internal Error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
