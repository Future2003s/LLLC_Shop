import { NextRequest } from "next/server";
import { envConfig } from "@/config";

export async function GET() {
  return new Response(
    JSON.stringify({
      message: "Products CRUD Test API",
      endpoints: {
        list: "/api/products/admin",
        create: "/api/products/create",
        update: "/api/products/[id]",
        delete: "/api/products/[id]",
      },
      status: "Ready for testing",
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("Test creating product:", body);

    // Test data validation
    if (!body.name || !body.sku || !body.price || !body.stock) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Missing required fields: name, sku, price, stock",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Simulate product creation
    const mockProduct = {
      id: `test_${Date.now()}`,
      name: body.name,
      description: body.description || "",
      price: parseFloat(body.price),
      stock: parseInt(body.stock),
      status: body.status || "ACTIVE",
      sku: body.sku,
      categoryId: body.categoryId || undefined,
      brandId: body.brandId || undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return new Response(
      JSON.stringify({
        success: true,
        message: "Test product created successfully",
        data: mockProduct,
      }),
      {
        status: 201,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (e) {
    console.error("Test create product error:", e);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Internal Error",
        error: e instanceof Error ? e.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
