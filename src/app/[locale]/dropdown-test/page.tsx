"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Category {
  id: string;
  name: string;
}

interface Brand {
  id: string;
  name: string;
}

export default function DropdownTestPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingBrands, setLoadingBrands] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");

  useEffect(() => {
    fetchCategories();
    fetchBrands();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);
      // Mock categories data for testing
      const mockCategories = [
        { id: "cat_test_1", name: "Electronics" },
        { id: "cat_test_2", name: "Clothing" },
        { id: "cat_test_3", name: "Books" },
        { id: "cat_test_4", name: "Home & Garden" },
      ];
      setCategories(mockCategories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoadingCategories(false);
    }
  };

  const fetchBrands = async () => {
    try {
      setLoadingBrands(true);
      // Mock brands data for testing
      const mockBrands = [
        { id: "brand_test_1", name: "Apple" },
        { id: "brand_test_2", name: "Samsung" },
        { id: "brand_test_3", name: "Nike" },
        { id: "brand_test_4", name: "Adidas" },
      ];
      setBrands(mockBrands);
    } catch (error) {
      console.error("Error fetching brands:", error);
    } finally {
      setLoadingBrands(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pt-25">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Dropdown Test Page
          </h1>
          <p className="text-lg text-gray-600">
            Testing Categories and Brands dropdowns
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Categories Dropdown */}
          <Card>
            <CardHeader>
              <CardTitle>Categories Dropdown</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="category">Select Category</Label>
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {loadingCategories ? (
                      <SelectItem value="" disabled>
                        Loading...
                      </SelectItem>
                    ) : (
                      categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="text-sm text-gray-600">
                <p>
                  <strong>Selected Category ID:</strong>{" "}
                  {selectedCategory || "None"}
                </p>
                <p>
                  <strong>Selected Category Name:</strong>{" "}
                  {categories.find((c) => c.id === selectedCategory)?.name ||
                    "None"}
                </p>
              </div>

              <div className="text-sm text-gray-500">
                <p>
                  <strong>Total Categories:</strong> {categories.length}
                </p>
                <p>
                  <strong>Categories:</strong>{" "}
                  {categories.map((c) => c.name).join(", ")}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Brands Dropdown */}
          <Card>
            <CardHeader>
              <CardTitle>Brands Dropdown</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="brand">Select Brand</Label>
                <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a brand" />
                  </SelectTrigger>
                  <SelectContent>
                    {loadingBrands ? (
                      <SelectItem value="" disabled>
                        Loading...
                      </SelectItem>
                    ) : (
                      brands.map((brand) => (
                        <SelectItem key={brand.id} value={brand.id}>
                          {brand.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="text-sm text-gray-600">
                <p>
                  <strong>Selected Brand ID:</strong> {selectedBrand || "None"}
                </p>
                <p>
                  <strong>Selected Brand Name:</strong>{" "}
                  {brands.find((b) => b.id === selectedBrand)?.name || "None"}
                </p>
              </div>

              <div className="text-sm text-gray-500">
                <p>
                  <strong>Total Brands:</strong> {brands.length}
                </p>
                <p>
                  <strong>Brands:</strong>{" "}
                  {brands.map((b) => b.name).join(", ")}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Debug Info */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Debug Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Categories State:</h3>
                <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto">
                  {JSON.stringify(categories, null, 2)}
                </pre>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Brands State:</h3>
                <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto">
                  {JSON.stringify(brands, null, 2)}
                </pre>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Selected Values:</h3>
                <pre className="bg-gray-100 p-3 rounded text-sm">
                  {JSON.stringify(
                    {
                      selectedCategory,
                      selectedBrand,
                      selectedCategoryName: categories.find(
                        (c) => c.id === selectedCategory
                      )?.name,
                      selectedBrandName: brands.find(
                        (b) => b.id === selectedBrand
                      )?.name,
                    },
                    null,
                    2
                  )}
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
