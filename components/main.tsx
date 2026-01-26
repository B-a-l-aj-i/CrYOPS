import { CoreSources } from "@/components/core-sources";
import { SocialPresence } from "@/components/social-presence";
import { SelectInspiration } from "@/components/inspirations";
import { CustomInstructions } from "@/components/custom-instructions";

export function Main() {
  return (
    <>
      <CoreSources />
      <SocialPresence />
      <SelectInspiration />
      <CustomInstructions />
    </>
  );
}
