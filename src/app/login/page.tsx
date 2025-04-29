
'use client'

import React from "react";
import loginIcon from "@/images/login-cover.svg";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";

function LoginPage() {
  return (
    <>
      <div className="flex h-screen">
        <div className="w-1/2 bg-gray-100 flex items-center justify-center">
          <div className="w-3/4">
            <Image
              src={loginIcon}
              alt="Login icon "
              className="w-full h-auto"
            />
          </div>
        </div>
        <div className="w-1/2 flex flex-col justify-center items-center px-10">
          <h1 className="text-2xl font-bold mb-1">Storex</h1>
          <p className="text-gray-500 mb-4">Sign in to continue</p>
          <div className="w-full flex justify-center">
          <Button onClick={() => signIn("google")} className="sm:px-20 md:px-32 lg:px-40 border border-gray-300 text-black bg-white hover:bg-slate-50 hover:text-black hover:cursor-pointer">
          <Image src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" height={15} width={15} 
          />
            Sign in with Google
          </Button>
          </div>
        </div>
      </div>
    </>
  );
}

export default LoginPage;
