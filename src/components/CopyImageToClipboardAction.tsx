import fs from "node:fs/promises";
import fetch from "node-fetch";
import { environment, Clipboard, Action, showHUD, showToast, Toast } from "@raycast/api";
import { useCallback } from "react";
import { showFailureToast } from "@raycast/utils";

type Props = Omit<React.ComponentProps<typeof Action>, 'onAction'> & {
  url: string;
};

export function CopyImageToClipboardAction({ url, ...rest }: Props) {
  const copyImageToClipboard = useCallback(async () => {
    try {
      showToast({
        title: "Downloading image...",
        style: Toast.Style.Animated,
      });

      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`Failed to fetch image: ${res.statusText}`);
      }

      const downloadPath = `${environment.supportPath}/downloaded-image.png`;
      const arrayBuf = await res.arrayBuffer();
      await fs.writeFile(downloadPath, Buffer.from(arrayBuf));

      Clipboard.copy({ file: downloadPath });
      showHUD("Image copied to clipboard");
    } catch (error) {
      console.error(error);
      showFailureToast(error, { title: "Failed to copy image to clipboard" });
    }
  }, [url]);

  return <Action {...rest} onAction={copyImageToClipboard} />;
}
