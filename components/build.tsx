import { PaintRollerIcon } from "lucide-react";
import { Button } from "./ui/button";
import { useGithubStore, useLeetCodeStore } from "@/app/store";
import { useRouter } from "next/navigation";

export function Build() {

  const router = useRouter();

  const handleBuild = async () => {

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
        
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/0f7b81be-7fec-4d33-bc89-e66050fc4abe',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'components/build.tsx:32',message:'Before setState - leetCodeData structure',data:{hasData:!!leetCodeData,hasDataData:!!leetCodeData?.data,leetCodeDataKeys:leetCodeData?Object.keys(leetCodeData):[],leetCodeDataType:typeof leetCodeData},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
      // #endregion
      
      useLeetCodeStore.setState({ leetCodeData: leetCodeData.data });
      
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/0f7b81be-7fec-4d33-bc89-e66050fc4abe',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'components/build.tsx:36',message:'After setState - verify store state',data:{storeState:useLeetCodeStore.getState().leetCodeData!==null,storeDataType:typeof useLeetCodeStore.getState().leetCodeData},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
      // #endregion
      
      useGithubStore.setState({ githubData: githubData.data });
      
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/0f7b81be-7fec-4d33-bc89-e66050fc4abe',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'components/build.tsx:40',message:'After both setState calls - before navigation',data:{leetCodeInStore:useLeetCodeStore.getState().leetCodeData!==null,githubInStore:useGithubStore.getState().githubData!==null},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
      // #endregion
      
      router.push(`/editYOPS`);
    } else {
      console.log("Error");
    }

  }
  


  return (
    <div className="flex justify-end gap-4 pt-6">
          <Button variant="outline">Save Draft</Button>
          <Button onClick={handleBuild}>Build
            <PaintRollerIcon className="h-4 w-4" />
          </Button>
        </div>
  )
}