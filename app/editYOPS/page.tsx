'use client'

import { useGithubStore, useLeetCodeStore } from "../store";
import { useRouter } from "next/navigation";
import About from "@/components/about";
import { LeetCodeData, GitHubData } from "../store";
import { Card, CardContent } from "@/components/ui/card";


export default function EditYOPS() {
  const leetCodeData = useLeetCodeStore.getState().leetCodeData as LeetCodeData;
  const githubData = useGithubStore.getState().githubData as GitHubData;
  const router = useRouter();

  // if (!leetCodeData || !githubData) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center p-8">
  //       <div
  //         className="cursor-pointer transition-all duration-300 hover:scale-105 hover:-translate-y-1"
  //         onClick={() => {
  //           router.push("/");
  //         }}
  //       >
  //         <Card className="max-w-md shadow-lg hover:shadow-xl transition-shadow duration-300">
  //           <CardContent className="p-6">
  //             <p className="text-center text-muted-foreground">
  //               No data available. Try again with valid URLs.
  //             </p>
  //           </CardContent>
  //         </Card>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div>
      <About githubData={githubData} leetCodeData={leetCodeData} />
    </div>
  );
}
