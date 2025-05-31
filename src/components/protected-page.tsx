import { AuthOptions } from "@/auth-options";
import { useQuery } from "@tanstack/react-query";
import { getServerSession } from "next-auth";
import { getSession } from "next-auth/react";
import { redirect } from "next/navigation";
import LoadingPage from "./loading-page";

export default (props: { redirectURL: string; children: React.ReactNode }) => {
  const { data: session, isLoading } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      return await getSession();
    },
  });

  if (isLoading) {
    return <LoadingPage />;
  }

  if (session == null || session == undefined) {
    // ! todo fix redirection
    redirect(AuthOptions.pages!.signIn + "?callbackUrl=" + props.redirectURL);
  }

  return props.children;
};
