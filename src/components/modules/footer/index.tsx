"use client";

import Container from "@/components/custom/Container";

import { cn } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import { Loader2Icon, Mail, MapPin, MoveRight, PhoneCall } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { z } from "zod";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { usePages } from "@/store/pagesStore";
import useSWR from "swr";
import { CompanySettings } from "../../../../sanity.types";

const index = () => {
  const fetcher = (url: string) => fetch(url).then((res) => res.json());
  const { data: company } = useSWR<CompanySettings>("/api/company", fetcher);

  const { isSignedIn } = useUser();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const { pages } = usePages();

  const handleSave = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (loading) {
      setLoading(false);
      return false;
    }

    const Email = z.object({
      email: z.string().min(5).max(100),
    });

    const validatedField = Email.safeParse({
      email: email,
    });

    if (!validatedField.success) {
      toast.error("validation error. Please try again");
      setLoading(false);
      return;
    }
  };

  return (
    <motion.footer
      className="bg-primary-950 py-6 overflow-hidden "
      initial={{
        opacity: 0,
        y: 100,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.3,
      }}
    >
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-4 text-slate-400">
          <ul className="flex flex-col gap-4 ">
            <li className="mt-10 ">
              <h4 className="text-white h3-bold">{company?.businessName}</h4>
            </li>
            <li className="flex gap-4">
              <PhoneCall /> {`${company?.phone} / ${company?.alternativePhone}`}
            </li>
            <li className="flex gap-4">
              <Mail /> {company?.email}
            </li>
            <li className="flex gap-4">
              <MapPin />{" "}
              {`${company?.address?.street}, ${company?.address?.city} - ${company?.address?.state}`}
            </li>
          </ul>
          <ul className="flex flex-col gap-4 ">
            <li className="mt-10 ">
              <h6 className="text-white">Account</h6>
            </li>
            <Link
              href={isSignedIn ? "/account/dashboard" : "/sign-in"}
              className="flex gap-4 hover:text-primary-500 duration-300 hover:translate-x-1 capitalize"
            >
              {isSignedIn ? "Dashboard" : "Login"}
            </Link>
            <Link
              href="/cart"
              className="flex gap-4 hover:text-primary-500 duration-300 hover:translate-x-1 capitalize"
            >
              My Cart
            </Link>
            <Link
              href="/checkout"
              className="flex gap-4 hover:text-primary-500 duration-300 hover:translate-x-1 capitalize"
            >
              Checkout
            </Link>
          </ul>
          <ul className="flex flex-col gap-4 ">
            <li className="mt-10 ">
              <h6 className="text-white">Information</h6>
            </li>
            {pages.map((page) => (
              <Link
                key={page._id}
                href={`${page.slug?.current}`}
                className="flex gap-4 hover:text-primary-500 duration-300 hover:translate-x-1 capitalize"
              >
                {page.title}
              </Link>
            ))}
          </ul>
          <ul className="flex flex-col gap-4 ">
            <li className="mt-10 ">
              <h6 className="text-white">Newsletter Subscription</h6>
            </li>
            <Link href="/" className="flex gap-4">
              <h6>Enter your email to get updates on latest products.</h6>
            </Link>
            <li className="flex gap-4 mt-4">
              <form
                action=""
                className="flex w-full bg-transparent border border-white rounded-xl gap-2 items-center justify-between p-2"
              >
                <Mail size={40} />
                <input
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.currentTarget.value)}
                  max={40}
                  placeholder="Enter your email here!"
                  className="rounded-xl p-4 bg-transparent text-white w-3/4 text-base outline-none"
                />
                <Button
                  variant="outline"
                  onClick={handleSave}
                  disabled={loading}
                  type="submit"
                  size="icon"
                >
                  <MoveRight className={cn("block", loading && "hidden")} />
                  <Loader2Icon
                    className={cn("hidden", loading && "block animate-spin")}
                  />
                </Button>
              </form>
            </li>
          </ul>
        </div>
      </Container>
    </motion.footer>
  );
};

export default index;
