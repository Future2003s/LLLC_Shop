"use client";
import { useEffect, useMemo, useState } from "react";
import { productApiRequest, type Product } from "@/apiRequests/products";
import { useParams, useRouter } from "next/navigation";
import BuyNowModal from "@/components/ui/buy-now-modal";
import { useAppContextProvider } from "@/context/app-context";
import { useCart } from "@/context/cart-context";
import { useCartSidebar } from "@/context/cart-sidebar-context";
import { Loader } from "@/components/ui/loader";
import {
  ArrowLeft,
  ShoppingCart,
  Heart,
  Share2,
  Truck,
  Shield,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    amount
  );

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params?.id as string;
  const { sessionToken } = useAppContextProvider();
  const { addItem } = useCart();
  const { openSidebar } = useCartSidebar();

  const [item, setItem] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [buyOpen, setBuyOpen] = useState(false);
  const [loginPromptOpen, setLoginPromptOpen] = useState(false);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        // Route via Next public API to avoid CORS and handle env mapping/normalization
        const res = await fetch(`/api/products/public/${id}`, {
          cache: "no-store",
        });
        if (!res.ok) {
          const t = await res.text();
          throw new Error(t || `HTTP ${res.status}`);
        }
        const data = await res.json();
        if (data?.data) {
          setItem(data.data as Product);
        } else {
          setError("Không thể tải thông tin sản phẩm");
        }
      } catch (err: any) {
        console.error("Error loading product:", err);
        setError(err?.message || "Có lỗi xảy ra khi tải sản phẩm");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  // Helper function to get image URL
  const getImageUrl = (index: number) => {
    if (!item?.images || item.images.length === 0) {
      return "https://placehold.co/800x600";
    }

    const image = item.images[index];
    if (typeof image === "string") {
      return image; // Fallback for old format
    }

    return (image as any)?.url || "https://placehold.co/800x600";
  };

  // Helper function to get all image URLs
  const getAllImageUrls = () => {
    if (!item?.images || item.images.length === 0) {
      return [];
    }

    return item.images
      .map((img) => {
        if (typeof img === "string") {
          return img; // Fallback for old format
        }
        return (img as any)?.url || "";
      })
      .filter((url) => url);
  };

  const price = useMemo(() => {
    if (!item) return 0;
    return Number(item.price);
  }, [item]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pt-25 flex items-center justify-center">
        <Loader
          isLoading={true}
          message="Đang tải thông tin sản phẩm..."
          size="lg"
          overlay={false}
        />
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pt-25 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="text-xl font-semibold">Không tải được sản phẩm</div>
          <div className="text-sm text-gray-600">
            Vui lòng thử lại sau hoặc quay lại danh sách sản phẩm.
          </div>
          <Button onClick={() => router.back()} variant="outline">
            Quay lại
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pt-25">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb Navigation - Amazon Style */}
        <div className="mb-6">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <button
              onClick={() => router.push("/")}
              className="hover:text-blue-600 hover:underline"
            >
              Home
            </button>
            <span className="text-gray-400">›</span>
            <button
              onClick={() => router.push("/products")}
              className="hover:text-blue-600 hover:underline"
            >
              Products
            </button>
            <span className="text-gray-400">›</span>
            <span className="text-gray-900 font-medium truncate max-w-xs">
              {typeof item.category === "object"
                ? item.category.name
                : "Category"}
            </span>
            <span className="text-gray-400">›</span>
            <span className="text-gray-900 font-medium truncate max-w-xs">
              {item.name}
            </span>
          </nav>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images - Left aligned with vertical thumbnails on desktop */}
          <div className="space-y-4 lg:sticky lg:top-24">
            {/* Desktop layout: vertical thumbnails on the left, main image on the right */}
            <div className="hidden lg:flex gap-4">
              {/* Vertical Thumbnails */}
              {getAllImageUrls().length > 0 && (
                <div className="w-20 flex flex-col gap-2 overflow-y-auto max-h-[560px] pr-1">
                  {getAllImageUrls().map((url, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImageIndex(i)}
                      className={`relative rounded-md overflow-hidden border transition-all ${
                        i === selectedImageIndex
                          ? "border-blue-500 ring-2 ring-blue-100"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      aria-label={`Xem ảnh ${i + 1}`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={url}
                        alt={`Product image ${i + 1}`}
                        className="w-20 h-20 object-contain bg-white"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Main Image */}
              <div className="relative flex-1">
                <div className="aspect-[4/3] bg-white border border-gray-200 rounded-lg overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={getImageUrl(selectedImageIndex)}
                    alt={item.name}
                    className="w-full h-full object-contain p-4"
                  />
                </div>

                {/* Share Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 h-8 w-8 p-0 bg-white/90 hover:bg-white shadow-sm"
                >
                  <Share2 className="h-4 w-4" />
                </Button>

                {/* Image Counter */}
                {getAllImageUrls().length > 0 && (
                  <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs font-medium">
                    {selectedImageIndex + 1} of {getAllImageUrls().length}
                  </div>
                )}
              </div>
            </div>

            {/* Mobile layout: main image with horizontal thumbnails below */}
            <div className="lg:hidden space-y-4">
              <div className="relative">
                <div className="aspect-[4/3] bg-white border border-gray-200 rounded-lg overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={getImageUrl(selectedImageIndex)}
                    alt={item.name}
                    className="w-full h-full object-contain p-4"
                  />
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 h-8 w-8 p-0 bg-white/90 hover:bg-white shadow-sm"
                >
                  <Share2 className="h-4 w-4" />
                </Button>
                {getAllImageUrls().length > 0 && (
                  <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs font-medium">
                    {selectedImageIndex + 1} of {getAllImageUrls().length}
                  </div>
                )}
              </div>

              <div className="text-center">
                <button className="text-sm text-blue-600 hover:text-blue-800 underline">
                  Click to see full view
                </button>
              </div>

              {getAllImageUrls().length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-700">
                      Product Images
                    </h3>
                    <span className="text-xs text-gray-500">
                      {getAllImageUrls().length} images
                    </span>
                  </div>
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {getAllImageUrls().map((url, i) => (
                      <div
                        key={i}
                        onClick={() => setSelectedImageIndex(i)}
                        className={`flex-shrink-0 cursor-pointer border-2 rounded-lg overflow-hidden transition-all duration-200 ${
                          i === selectedImageIndex
                            ? "border-blue-500 shadow-md"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="w-20 h-20 bg-white flex items-center justify-center">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={url}
                            alt={`Product image ${i + 1}`}
                            className="w-full h-full object-contain p-1"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-center gap-1">
                    {getAllImageUrls().map((_, i) => (
                      <div
                        key={i}
                        className={`w-2 h-2 rounded-full transition-colors cursor-pointer ${
                          i === selectedImageIndex
                            ? "bg-blue-500"
                            : "bg-gray-300"
                        }`}
                        onClick={() => setSelectedImageIndex(i)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          {/* Product Info */}
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6 space-y-6">
              {/* Header */}
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 pr-4">
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 leading-tight mb-2">
                      {item.name}
                    </h1>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      {item.brand && (
                        <span className="flex items-center gap-1">
                          <span className="font-medium">Thương hiệu:</span>
                          {typeof item.brand === "object"
                            ? item.brand.name
                            : item.brand}
                        </span>
                      )}
                      {item.category && (
                        <span className="flex items-center gap-1">
                          <span className="font-medium">Danh mục:</span>
                          {typeof item.category === "object"
                            ? item.category.name
                            : item.category}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-10 w-10 p-0 hover:bg-gray-100"
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-10 w-10 p-0 hover:bg-gray-100"
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {item.brand && (
                    <Badge variant="outline" className="text-xs">
                      {typeof item.brand === "object"
                        ? item.brand.name
                        : item.brand}
                    </Badge>
                  )}
                  {item.category && (
                    <Badge variant="secondary" className="text-xs">
                      {typeof item.category === "object"
                        ? item.category.name
                        : item.category}
                    </Badge>
                  )}
                  {typeof item.quantity === "number" && (
                    <Badge
                      variant={item.quantity > 0 ? "default" : "destructive"}
                      className="text-xs"
                    >
                      {item.quantity > 0
                        ? `Còn ${item.quantity} sản phẩm`
                        : "Hết hàng"}
                    </Badge>
                  )}
                </div>
              </div>

              <Separator />

              {/* Price Section */}
              <div className="space-y-3">
                <div className="flex items-baseline gap-2">
                  <div className="text-2xl lg:text-3xl font-bold text-blue-600">
                    {formatCurrency(price)}
                  </div>
                  {typeof item.quantity === "number" && item.quantity > 0 && (
                    <div className="text-sm text-green-600 font-medium">
                      ✓ Còn hàng
                    </div>
                  )}
                </div>

                {item.variants?.find(
                  (v) => v._id === selectedVariant || v.id === selectedVariant
                ) && (
                  <div className="text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                    <span className="font-medium">Biến thể đã chọn:</span>{" "}
                    {
                      item.variants.find(
                        (v) =>
                          v._id === selectedVariant || v.id === selectedVariant
                      )?.name
                    }
                  </div>
                )}
              </div>

              {/* Variants */}
              {(item.variants?.length ?? 0) > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium text-gray-700">
                      Chọn biến thể
                    </div>
                    <span className="text-xs text-gray-500">
                      {item.variants?.length ?? 0} lựa chọn
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {(item.variants ?? []).map((variant: any) => (
                      <Button
                        key={variant._id || variant.id}
                        variant={
                          selectedVariant === (variant._id || variant.id)
                            ? "default"
                            : "outline"
                        }
                        onClick={() =>
                          setSelectedVariant(variant._id || variant.id)
                        }
                        className="h-12 justify-start px-3"
                      >
                        <div className="text-left">
                          <div className="font-medium">{variant.name}</div>
                          <div className="text-xs text-gray-500">
                            {variant.options?.join(", ") || ""}
                          </div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags */}
              {item.tags?.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium text-gray-700">
                      Thông tin sản phẩm
                    </div>
                    <span className="text-xs text-gray-500">
                      {item.tags.length} tags
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((tag, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-xs px-3 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <Separator />

              {/* Quantity Selector */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium text-gray-700">
                    Số lượng
                  </div>
                  <div className="text-xs text-gray-500">
                    Còn {item.quantity ?? 999} sản phẩm
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="h-10 w-10 p-0 hover:bg-gray-50"
                    disabled={qty <= 1}
                  >
                    -
                  </Button>
                  <div className="w-16 text-center text-lg font-medium bg-gray-50 py-2 rounded-lg">
                    {qty}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQty((q) => q + 1)}
                    className="h-10 w-10 p-0 hover:bg-gray-50"
                  >
                    +
                  </Button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-6">
                <div className="flex gap-3">
                  <Button
                    size="lg"
                    variant="outline"
                    className="flex-1 h-14 text-base font-medium"
                    onClick={() => {
                      const variant =
                        item.variants?.find(
                          (x) =>
                            x._id === selectedVariant ||
                            x.id === selectedVariant
                        ) || null;
                      addItem({
                        id: (item as any)._id || (item as any).id,
                        productId: (item as any)._id || (item as any).id,
                        variantId: variant?._id || variant?.id || null,
                        variantName: variant?.name || null,
                        name: variant
                          ? `${item.name} - ${variant.name}`
                          : item.name,
                        price: Number(item.price) || 0,
                        quantity: qty,
                        imageUrl: getImageUrl(0),
                      });
                      openSidebar();
                      toast.success("Đã thêm vào giỏ hàng!");
                    }}
                  >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Thêm vào giỏ
                  </Button>
                  <Button
                    size="lg"
                    className="flex-1 h-14 text-base font-medium bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300"
                    onClick={() => {
                      if (!sessionToken) {
                        setLoginPromptOpen(true);
                        return;
                      }
                      setBuyOpen(true);
                    }}
                  >
                    Mua ngay
                  </Button>
                </div>

                {/* Features */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center space-y-2">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                        <Truck className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="text-xs text-gray-700 font-medium">
                        Miễn phí vận chuyển
                      </div>
                    </div>
                    <div className="text-center space-y-2">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                        <Shield className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="text-xs text-gray-700 font-medium">
                        Bảo hành chính hãng
                      </div>
                    </div>
                    <div className="text-center space-y-2">
                      <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
                        <RotateCcw className="h-5 w-5 text-orange-600" />
                      </div>
                      <div className="text-xs text-gray-700 font-medium">
                        Đổi trả 30 ngày
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <BuyNowModal
        open={buyOpen}
        onClose={() => setBuyOpen(false)}
        items={[{ name: item.name, price, quantity: qty }]}
      />

      {loginPromptOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setLoginPromptOpen(false)}
          />
          <Card className="relative w-full max-w-md border-0 shadow-2xl">
            <CardContent className="p-0">
              <div className="px-6 py-4 border-b flex items-center justify-between">
                <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Yêu cầu đăng nhập
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setLoginPromptOpen(false)}
                  className="h-8 w-8 p-0"
                >
                  ✕
                </Button>
              </div>
              <div className="p-6 space-y-4">
                <p className="text-gray-700">
                  Để tiếp tục mua hàng, vui lòng đăng nhập tài khoản của bạn.
                </p>
              </div>
              <div className="px-6 py-4 border-t flex gap-3 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setLoginPromptOpen(false)}
                >
                  Để sau
                </Button>
                <Button
                  onClick={() => router.push("/login")}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  Đăng nhập
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
