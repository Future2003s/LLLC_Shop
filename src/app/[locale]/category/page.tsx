"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Carattere } from "next/font/google";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const CategoryRequest = z.object({
  categoryName: z.string(),
});

type CategoryRequestType = z.infer<typeof CategoryRequest>;

function Page() {
  const { register, handleSubmit } = useForm<CategoryRequestType>({
    resolver: zodResolver(CategoryRequest),
    defaultValues: {
      categoryName: "",
    },
  });

  const categoryMutation = useMutation({
    mutationFn: async (data: CategoryRequestType) => {
      const res = await fetch("http://localhost:8081/v1/api/create-category", {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        console.log("LỖI THÊM CATEGORY");
      }

      let result;
      try {
        const text = await res.text();
        result = text ? JSON.parse(text) : null;
      } catch (error) {
        console.error("JSON parse error:", error);
        result = null;
      }

      return result;
    },
  });

  const handllerData = async (data: any) => {
    const res = await categoryMutation.mutateAsync(data);

    console.log(res);
  };

  return (
    <div className="mt-25">
      <div>
        <form onSubmit={handleSubmit(handllerData)}>
          <div className=" bg-emerald-200 flex flex-col justify-center items-center">
            <label htmlFor="category">Category</label>
            <input placeholder="Nhập category" {...register("categoryName")} />
            <button
              type="submit"
              className="bg-red-600 hover:cursor-pointer mt-10 text-white"
            >
              Thêm Category
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Page;
