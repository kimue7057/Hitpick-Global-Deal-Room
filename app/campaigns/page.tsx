import { SitePage } from "@/components/site-page";
import { pageContentByPath } from "@/lib/site-content";

export default function CampaignsPage() {
  return <SitePage content={pageContentByPath["/campaigns"]} />;
}
