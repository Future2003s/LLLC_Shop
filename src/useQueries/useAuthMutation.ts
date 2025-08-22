import { authApiRequest } from "@/apiRequests/auth";
import { useMutation } from "@tanstack/react-query";
import { LoginBodyType } from "@/shemaValidation/auth.schema";

export const useLoginMutation = () => {
  return useMutation({
    mutationFn: (data: LoginBodyType) => authApiRequest.login(data),
  });
};
