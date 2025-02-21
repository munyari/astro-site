import Cal, { getCalApi } from "@calcom/embed-react";
import { useEffect } from "react";

const layout = "month_view";
const namespace = "discovery";

export default function CalendarBooker() {
  useEffect(() => {
    (async function () {
      const cal = await getCalApi({ namespace });
      cal("ui", { hideEventTypeDetails: false, layout });
    })();
  }, []);

  return (
    <Cal
      namespace={namespace}
      calLink="panashe/discovery"
      style={{ width: "100%", height: "50%", overflow: "scroll" }}
      config={{ layout }}
    />
  );
}
