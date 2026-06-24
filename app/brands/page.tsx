import { SitePage } from "@/components/site-page";
import { pageContentByPath } from "@/lib/site-content";

export default function BrandsPage() {
  return <SitePage content={pageContentByPath["/brands"]} />;
}
