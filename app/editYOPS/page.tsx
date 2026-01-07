'use client'

import { useGithubStore, useLeetCodeStore } from "../store";

export default function EditYOPS() {
   
    const leetCodeData = useLeetCodeStore.getState().leetCodeData;
    const githubData = useGithubStore.getState().githubData;
    

  return (
    <div>
      <h1>Edit YOPS</h1>
      <pre>{JSON.stringify(leetCodeData, null, 2)}</pre>
      <pre>{JSON.stringify(githubData, null, 2)}</pre>
    </div>
  )
}