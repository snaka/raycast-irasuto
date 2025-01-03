import fs from "node:fs/promises";
import { environment, Clipboard, Action } from "@raycast/api";
import { useCallback } from "react";

type Props = Omit<React.ComponentProps<typeof Action>, 'onAction'> & {
  url: string;
};

export function CopyImageToClipboardAction({ url, ...rest }: Props) {
  const copyImageToClipboard = useCallback(async () => {
    const res = await fetch(url);
    const arrayBuf = await res.arrayBuffer();
    const downloadPath = `${environment.supportPath}/downloaded-image.png`;
    await fs.writeFile(downloadPath, Buffer.from(arrayBuf));

    Clipboard.copy({ file: downloadPath });
  }, [url]);

  return <Action {...rest} onAction={copyImageToClipboard} />;
}
