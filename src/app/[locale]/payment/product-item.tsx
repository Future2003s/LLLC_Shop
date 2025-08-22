// components/ProductItem.tsx (hoặc file ProductItem của bạn)
import Image from "next/image";

function ProductItem({
  imageSrc,
  altText,
  quantity,
  onQuantityChange,
  name,
  nameJp, // Thêm nameJp vào props
  price,
  weight,
  priceOrigin,
}: {
  imageSrc: any;
  altText: any;
  quantity: any;
  onQuantityChange: any;
  name: any;
  nameJp?: string; // Khai báo kiểu cho nameJp (có thể là optional)
  price: any;
  weight: any;
  priceOrigin?: number;
}) {
  const handleIncreaseQuantity = () => {
    onQuantityChange(quantity + 1);
  };

  const handleDecreaseQuantity = () => {
    onQuantityChange(quantity > 0 ? quantity - 1 : 0);
  };

  const handleInputChange = (e: any) => {
    const value = parseInt(e.target.value, 10);
    onQuantityChange(isNaN(value) || value < 0 ? 0 : value);
  };

  const handleInputFocus = (e: any) => {
    if (parseInt(e.target.value, 10) === 0) {
      e.target.value = "";
    }
  };

  const handleInputBlur = (e: any) => {
    if (e.target.value === "") {
      onQuantityChange(0);
    }
  };

  const hasDiscount = priceOrigin && priceOrigin > price;
  const discountPercentage = hasDiscount
    ? Math.round(((priceOrigin - price) / priceOrigin) * 100)
    : 0;

  return (
    <div className="flex flex-col items-center bg-white p-6 rounded-lg shadow-lg border border-gray-200 w-full max-w-xs transition-transform duration-300 hover:scale-105">
      <h3 className="text-xl font-semibold text-gray-800 text-center mb-1">
        {name}
      </h3>
      {nameJp && ( // Chỉ hiển thị nếu nameJp tồn tại
        <p className="text-sm text-gray-600 text-center mb-3">({nameJp})</p>
      )}
      <div className="w-48 h-48 mb-4 rounded-lg overflow-hidden shadow-inner">
        <Image
          src={imageSrc}
          alt={altText}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="text-center mb-4">
        {hasDiscount && (
          <p className="text-base text-gray-500 line-through">
            {priceOrigin.toLocaleString("vi-VN", {
              style: "currency",
              currency: "VND",
            })}
          </p>
        )}
        <div className="flex items-center justify-center gap-2">
          <p className="text-2xl font-bold text-indigo-600">
            {price.toLocaleString("vi-VN", {
              style: "currency",
              currency: "VND",
            })}
          </p>
          {hasDiscount && (
            <span className="bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
              -{discountPercentage}%
            </span>
          )}
        </div>
        <p className="text-sm text-gray-500 mt-1">{weight}g</p>
      </div>
      <div className="flex items-center gap-2 sm:gap-3">
        <label
          htmlFor={`quantity-${altText}`}
          className="text-sm font-medium text-gray-700"
        >
          Số lượng:
        </label>
        <div className="flex items-center border border-gray-300 rounded-md">
          <button
            type="button"
            onClick={handleDecreaseQuantity}
            className="p-2 rounded-l-md bg-gray-200 text-gray-700 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
            aria-label="Decrease quantity"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <input
            type="number"
            id={`quantity-${altText}`}
            value={quantity}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            className="w-12 sm:w-16 text-center appearance-none [-moz-appearance:textfield] [&::-webkit-outer-spin-button]:hidden [&::-webkit-inner-spin-button]:hidden border-l border-r border-gray-300 focus:outline-none focus:border-indigo-500 focus:ring-indigo-500"
            min="0"
          />
          <button
            type="button"
            onClick={handleIncreaseQuantity}
            className="p-2 rounded-r-md bg-gray-200 text-gray-700 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
            aria-label="Increase quantity"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductItem;
