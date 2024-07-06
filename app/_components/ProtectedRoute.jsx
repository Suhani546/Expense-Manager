"use client";
import { useUser } from "@clerk/nextjs";
import { useRouter } from 'next/navigation';
import { useEffect } from "react";

export function ProtectedRoute({ children }) {
  const { isLoaded, isSignedIn } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/sign-in'); // Redirect to sign-in if not signed in
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded || !isSignedIn) {
    return <div>Loading...</div>; // Optionally show a loading indicator
  }

  return children;
}
