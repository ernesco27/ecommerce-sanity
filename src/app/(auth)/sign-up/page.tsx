"use client";

import AuthForm from "@/components/forms/AuthForm";
import { SignUpSchema } from "@/lib/validations";

//import { SignUp } from "@clerk/nextjs";

// import useSWR from "swr";
// import { Banner } from "../../../../sanity.types";

// type BannerResponse = Banner & {
//   imageUrl: string;
// };

// export default function SignUp() {
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
//           backgroundImage: `url("${banners?.[0].imageUrl}")`,
//           backgroundSize: "cover",
//           backgroundPosition: "center",
//         }}
//       ></div>
//       <div className="flex justify-center items-center">
//         {/* <SignUp
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

const SignUp = () => {
  return (
    <AuthForm
      formType="SIGN_UP"
      schema={SignUpSchema}
      defaultValues={{
        name: "",
        email: "",
        password: "",
        username: "",
      }}
      onSubmit={(data) => Promise.resolve({ success: true, data })}
    />
  );
};

export default SignUp;
