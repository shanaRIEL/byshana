"use client";

import { SignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Footer from "@/components/footer/Footer";
import { homeFooterColumns } from "@/data";

export default function SignInPage() {
  const router = useRouter();

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  return (
    <>
      <div className="min-h-[80vh] flex flex-col items-center px-6 py-12">
        <div className="w-full max-w-[440px]">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-b4 text-[0.82rem] font-montserrat font-light mb-8 cursor-pointer bg-transparent border-none p-0 hover:text-b1 transition-colors duration-200"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Back
          </button>

          <div className="text-center mb-8">
            <h1 className="font-playfair text-[1.8rem] text-b1 mb-2">
              Welcome back
            </h1>
            <p className="text-[0.88rem] text-b4 font-light">
              Log in to your Shana account
            </p>
          </div>

          <SignIn
            routing="path"
            path="/sign-in"
            signUpUrl="/sign-up"
            appearance={{
              elements: {
                rootBox: "mx-auto",
                card: "shadow-none border border-b6 rounded-2xl bg-b8",
                headerTitle: "text-b1 font-playfair text-[1.2rem]",
                headerSubtitle: "text-b4 text-[0.82rem]",
                formFieldLabel: "text-b3 text-[0.66rem] font-semibold tracking-[0.1em] uppercase",
                formFieldInput:
                  "border-b6 rounded-xl bg-b7 text-b1 font-montserrat text-[0.84rem] focus:border-b4",
                formButtonPrimary:
                  "bg-b1 hover:bg-b2 text-b8 font-montserrat font-semibold rounded-xl py-2.5 text-[0.86rem]",
                footerActionLink: "text-accent font-medium",
                dividerLine: "bg-b6",
                dividerText: "text-b4",
                socialButtonsBlockButton: "border-b6 text-b3 rounded-xl",
                socialButtonsBlockButtonText: "text-b3 font-montserrat text-[0.82rem]",
                identityPreviewEditButton: "text-accent",
              },
            }}
          />
        </div>
      </div>

      <Footer columns={homeFooterColumns} />
    </>
  );
}
