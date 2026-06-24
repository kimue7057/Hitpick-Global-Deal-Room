import { SitePage } from "@/components/site-page";
import { pageContentByPath } from "@/lib/site-content";

export default function CreatorsPage() {
  return <SitePage content={pageContentByPath["/creators"]} />;
}
