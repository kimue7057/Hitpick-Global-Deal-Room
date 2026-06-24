import { SitePage } from "@/components/site-page";
import { pageContentByPath } from "@/lib/site-content";

export default function ContactPage() {
  return <SitePage content={pageContentByPath["/contact"]} />;
}
