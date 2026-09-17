import type { Metadata } from "next";
import DataCenterWatch from "../../../../artifacts/data-center-watch/DataCenterWatch";

export const metadata: Metadata = {
  title: "Data Center Buildout Watch — Preview",
  description:
    "Standalone Claude artifact rendered for review. The canonical file lives at artifacts/data-center-watch/DataCenterWatch.tsx.",
  robots: { index: false, follow: false },
};

export default function PreviewPage() {
  return <DataCenterWatch />;
}
