"use client";
import AuthForm from "@/components/forms/AuthForm";
import { SignInSchema } from "@/lib/validations";
import React from "react";
//import { SignIn } from "@clerk/nextjs";

// export default function SignIn() {
//   const fetcher = (url: string) => fetch(url).then((res) => res.json());
//   const { data: banners } = useSWR<BannerResponse[]>(
//     "/api/banners?type=category",
//     fetcher,
//   );

//   return (
//     <div className="h-full grid grid-cols-1 lg:grid-cols-2">
//       <div
//         className="hidden  lg:flex"
//         style={{
//           backgroundImage: `url("${banners?.[2].imageUrl}")`,
//           backgroundSize: "cover",
//           backgroundPosition: "center",
//         }}
//       ></div>
//       <div className="flex justify-center items-center  ">
//         {/* <SignIn
//           appearance={{
//             variables: {
//               fontSize: "18px",
//             },
//           }}
//         /> */}
//       </div>
//     </div>
//   );
// }

const SignIn = () => {
  // const fetcher = (url: string) => fetch(url).then((res) => res.json());
  // const { data: banners } = useSWR<BannerResponse[]>(
  //   "/api/banners?type=category",
  //   fetcher,
  // );
  return (
    <AuthForm
      formType="SIGN_IN"
      schema={SignInSchema}
      defaultValues={{
        email: "",
        password: "",
      }}
      onSubmit={(data) => Promise.resolve({ success: true, data })}
    />
  );
};

export default SignIn;
