import { PaintRollerIcon } from "lucide-react";
import { Button } from "./ui/button";
import { useGithubStore, useLeetCodeStore } from "@/app/store";
import { useRouter } from "next/navigation";

export function Build() {

  const router = useRouter();

  const handleBuild = async () => {
    router.push(`/editYOPS`);
    
    const leetCodeUrl = useLeetCodeStore.getState().leetCodeUrl;
    const githubUrl = useGithubStore.getState().githubUrl;

    const[leetCodeResponse, githubResponse] = await Promise.all([
      fetch(`/api/leetcode/get-details`, {
        method: "POST",
        body: JSON.stringify({
          url: leetCodeUrl,
        }),
      }),
      fetch(`/api/github/get-details`, {
        method: "POST",
        body: JSON.stringify({
          url: githubUrl,
        }),
      }),
    ]);
    const leetCodeData = await leetCodeResponse.json();
    const githubData = await githubResponse.json();

    if(leetCodeResponse.ok && githubResponse.ok) {
        console.log(leetCodeData);
        console.log(githubData);
        
      
      useLeetCodeStore.setState({ leetCodeData: leetCodeData.data });

      useGithubStore.setState({ githubData: githubData.data });

      
    } else {
      console.log("Error");
    }

  }
  


  return (
    <div className="flex justify-end gap-4 pt-6">
          <Button variant="outline">Save Draft</Button>
          <Button className="cursor-pointer" onClick={handleBuild}>Build
            <PaintRollerIcon className="h-4 w-4" />
          </Button>
        </div>
  )
}