import { NextRequest } from "next/server";

export async function GET() {
  return new Response(
    JSON.stringify({
      message: "Categories CRUD Test API",
      endpoints: {
        list: "/api/categories/admin",
        create: "/api/categories/admin",
        update: "/api/categories/[id]",
        delete: "/api/categories/[id]",
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
    console.log("Test creating category:", body);

    // Test data validation
    if (!body.name) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Missing required field: name",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Simulate category creation
    const mockCategory = {
      id: `cat_test_${Date.now()}`,
      name: body.name,
      description: body.description || "",
      slug: body.name.toLowerCase().replace(/\s+/g, "-"),
      isActive: body.isActive !== false,
      sortOrder: body.sortOrder || 1,
      parentId: body.parentId || null,
      metaTitle: body.metaTitle || body.name,
      metaDescription: body.metaDescription || body.description || "",
      metaKeywords: body.metaKeywords || "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return new Response(
      JSON.stringify({
        success: true,
        message: "Test category created successfully",
        data: mockCategory,
      }),
      {
        status: 201,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (e) {
    console.error("Test create category error:", e);
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
