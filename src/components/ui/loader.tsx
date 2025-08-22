"use client";
import { envConfig } from "@/config";
import { env } from "process";
import React from "react";

// Loader component với animation đẹp
interface LoaderProps {
  isLoading?: boolean;
  size?: "sm" | "md" | "lg";
  message?: string;
  overlay?: boolean;
  className?: string;
}

/* Moved keyframes to globals.css (.animate-*) */
const customAnimationStyle = `
  @keyframes crack-effect { 
    0%, 100% { 
      transform: scale(0) rotate(0deg); 
      opacity: 0; 
    } 
    40% { 
      transform: scale(1.1) rotate(0deg); 
      opacity: 1; 
    } 
    60% { 
      transform: scale(1.2) rotate(15deg); 
      opacity: 0; 
    } 
  }
  @keyframes container-wobble { 
    0%, 100% { 
      transform: rotate(0deg); 
    } 
    25% { 
      transform: rotate(-8deg); 
    } 
    75% { 
      transform: rotate(8deg); 
    } 
  }
  @keyframes split-top-left { 
    0%, 100% { 
      transform: translate(0, 0) scale(1); 
    } 
    48% { 
      transform: translate(-14px, -16px) scale(0.9) rotate(-3deg); 
    } 
    50% { 
      transform: translate(-15px, -15px) scale(0.9) rotate(-4deg); 
      opacity: 0.85; 
    } 
    52% { 
      transform: translate(-16px, -14px) scale(0.9) rotate(-5deg); 
    } 
  }
  @keyframes split-top-right { 
    0%, 100% { 
      transform: translate(0, 0) scale(1); 
    } 
    48% { 
      transform: translate(14px, -16px) scale(0.9) rotate(3deg); 
    } 
    50% { 
      transform: translate(15px, -15px) scale(0.9) rotate(4deg); 
      opacity: 0.85; 
    } 
    52% { 
      transform: translate(16px, -14px) scale(0.9) rotate(5deg); 
    } 
  }
  @keyframes split-bottom-left { 
    0%, 100% { 
      transform: translate(0, 0) scale(1); 
    } 
    48% { 
      transform: translate(-16px, 14px) scale(0.9) rotate(5deg); 
    } 
    50% { 
      transform: translate(-15px, 15px) scale(0.9) rotate(4deg); 
      opacity: 0.85; 
    } 
    52% { 
      transform: translate(-14px, 16px) scale(0.9) rotate(3deg); 
    } 
  }
  @keyframes split-bottom-right { 
    0%, 100% { 
      transform: translate(0, 0) scale(1); 
    } 
    48% { 
      transform: translate(16px, 14px) scale(0.9) rotate(-5deg); 
    } 
    50% { 
      transform: translate(15px, 15px) scale(0.9) rotate(-4deg); 
      opacity: 0.85; 
    } 
    52% { 
      transform: translate(14px, 16px) scale(0.9) rotate(-3deg); 
    } 
  }
  @keyframes loading-dots-bounce { 
    0%, 100% { 
      transform: translateY(0); 
    } 
    50% { 
      transform: translateY(-10px); 
    } 
  }
  .animate-split-top-left { 
    animation: split-top-left 2.5s cubic-bezier(0.68, -0.55, 0.27, 1.55) infinite; 
  }
  .animate-split-top-right { 
    animation: split-top-right 2.5s cubic-bezier(0.68, -0.55, 0.27, 1.55) infinite; 
  }
  .animate-split-bottom-left { 
    animation: split-bottom-left 2.5s cubic-bezier(0.68, -0.55, 0.27, 1.55) infinite; 
  }
  .animate-split-bottom-right { 
    animation: split-bottom-right 2.5s cubic-bezier(0.68, -0.55, 0.27, 1.55) infinite; 
  }
  .crack-effect { 
    animation: crack-effect 2.5s cubic-bezier(0.68, -0.55, 0.27, 1.55) infinite; 
  }
  .animate-container-wobble { 
    animation: container-wobble 2.5s ease-in-out infinite; 
  }
  .animate-dot-1 { 
    animation: loading-dots-bounce 1.5s ease-in-out infinite; 
  }
  .animate-dot-2 { 
    animation: loading-dots-bounce 1.5s ease-in-out 0.2s infinite; 
  }
  .animate-dot-3 { 
    animation: loading-dots-bounce 1.5s ease-in-out 0.4s infinite; 
  }
`;

export const Loader: React.FC<LoaderProps> = ({
  isLoading,
  size = "md",
  message = "Đang tải...",
  overlay = true,
}) => {
  if (!isLoading) return null;

  const sizeClasses = {
    sm: "w-[100px] h-[100px]",
    md: "w-[150px] h-[150px]",
    lg: "w-[200px] h-[200px]",
  };

  const logoSize = {
    sm: "w-[70px] h-[70px]",
    md: "w-[110px] h-[110px]",
    lg: "w-[150px] h-[150px]",
  };

  const dotsSize = {
    sm: "w-2 h-2",
    md: "w-3 h-3",
    lg: "w-4 h-4",
  };

  const content = (
    <div className="flex flex-col items-center">
      <div className={`relative ${sizeClasses[size]} animate-container-wobble`}>
        <div className="absolute inset-0 flex items-center justify-center crack-effect z-10">
          <div className="absolute w-[110%] h-[2px] bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.7)]"></div>
          <div className="absolute w-[2px] h-[110%] bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.7)]"></div>
        </div>
        <div
          className="absolute top-0 left-0 w-full h-full animate-split-top-left"
          style={{ clipPath: "polygon(0 0, 50% 0, 50% 50%, 0 50%)" }}
        >
          <img
            src={envConfig.NEXT_PUBLIC_URL_LOGO as string}
            className={`w-full h-full object-contain rounded-full shadow-lg ${logoSize[size]}`}
          />
        </div>
        <div
          className="absolute top-0 left-0 w-full h-full animate-split-top-right"
          style={{ clipPath: "polygon(50% 0, 100% 0, 100% 50%, 50% 50%)" }}
        >
          <img
            src={envConfig.NEXT_PUBLIC_URL_LOGO as string}
            alt="Top-right corner of logo"
            className={`w-full h-full object-contain rounded-full shadow-lg ${logoSize[size]}`}
          />
        </div>
        <div
          className="absolute top-0 left-0 w-full h-full animate-split-bottom-left"
          style={{ clipPath: "polygon(0 50%, 50% 50%, 50% 100%, 0 100%)" }}
        >
          <img
            src={envConfig.NEXT_PUBLIC_URL_LOGO as string}
            alt="Bottom-left corner of logo"
            className={`w-full h-full object-contain rounded-full shadow-lg ${logoSize[size]}`}
          />
        </div>
        <div
          className="absolute top-0 left-0 w-full h-full animate-split-bottom-right"
          style={{
            clipPath: "polygon(50% 50%, 100% 50%, 100% 100%, 50% 100%)",
          }}
        >
          <img
            src={envConfig.NEXT_PUBLIC_URL_LOGO as string}
            className={`w-full h-full object-contain rounded-full shadow-lg ${logoSize[size]}`}
          />
        </div>
      </div>
      <div className="flex space-x-2 mt-8">
        <div
          className={`${dotsSize[size]} bg-gray-400 rounded-full animate-dot-1`}
        ></div>
        <div
          className={`${dotsSize[size]} bg-gray-400 rounded-full animate-dot-2`}
        ></div>
        <div
          className={`${dotsSize[size]} bg-gray-400 rounded-full animate-dot-3`}
        ></div>
      </div>
      {message && (
        <p className="text-gray-600 dark:text-gray-300 mt-4 text-center font-medium">
          {message}
        </p>
      )}
    </div>
  );

  if (overlay) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-[#f0f2f5]/90 backdrop-blur-sm transition-opacity duration-700 ease-in-out"
        aria-hidden={!isLoading}
        role="status"
      >
        {content}
      </div>
    );
  }

  return <div className="flex items-center justify-center p-8">{content}</div>;
};

// Simple spinner loader cho các trường hợp đơn giản
export const Spinner: React.FC<{ size?: "sm" | "md" | "lg" }> = ({
  size = "md",
}) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  };

  return (
    <div
      className={`animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 ${sizeClasses[size]}`}
    />
  );
};

// Button loader cho các button khi submit
export const ButtonLoader: React.FC<{ size?: "sm" | "md" | "lg" }> = ({
  size = "sm",
}) => {
  const sizeClasses = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };

  return (
    <div
      className={`animate-spin rounded-full border-2 border-white border-t-transparent ${sizeClasses[size]}`}
    />
  );
};
