import Cal, { getCalApi } from "@calcom/embed-react";
import { useEffect } from "react";

export default function CalendarBooker() {
  useEffect(() => {
    (async function () {
      const cal = await getCalApi({ namespace: "discovery" });
      cal("ui", { hideEventTypeDetails: false, layout: "month_view" });
    })();
  }, []);

  return (
    <Cal
      namespace="discovery"
      calLink="panashe/discovery"
      style={{ width: "100%", height: "50%", overflow: "scroll" }}
      config={{ layout: "month_view" }}
    />
  );
}
