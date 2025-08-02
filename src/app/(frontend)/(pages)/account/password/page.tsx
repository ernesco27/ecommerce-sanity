"use client";

import PasswordForm from "@/components/forms/PasswordForm";
import { PasswordSchema } from "@/lib/validations";
import React from "react";

const PasswordPage = () => {
  const handleSubmit = async (data: any): Promise<ActionResponse<null>> => {
    // TODO: Implement actual profile update logic
    console.log("Profile data:", data);

    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: null,
          error: undefined,
        });
      }, 1000);
    });
  };

  return (
    <div>
      <PasswordForm
        schema={PasswordSchema}
        defaultValues={{
          password: "",
          newPassword: "",
          confirmPassword: "",
        }}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default PasswordPage;
