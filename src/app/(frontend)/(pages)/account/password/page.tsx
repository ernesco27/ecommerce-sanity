"use client";

import PasswordForm from "@/components/forms/PasswordForm";
import { editPassword } from "@/lib/actions/profile.action";
import { PasswordSchema } from "@/lib/validations";
import React from "react";

const PasswordPage = () => {
  return (
    <div>
      <PasswordForm
        schema={PasswordSchema}
        defaultValues={{
          password: "",
          newPassword: "",
          confirmPassword: "",
        }}
        onSubmit={editPassword}
      />
    </div>
  );
};

export default PasswordPage;
