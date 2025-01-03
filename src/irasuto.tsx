import { useState } from "react";
import { ActionPanel, Grid, LaunchProps } from "@raycast/api";
import { useFetch } from "@raycast/utils";
import { parse } from "node-html-parser";
import { CopyImageToClipboardAction } from "./components/CopyImageToClipboardAction";


const THUMB_URL_DEFAULT = "https://3.bp.blogspot.com/-tB0SRYOut2g/Tx-XXdv4FtI/AAAAAAAABJU/rejihf5hfyk/s000/default.png";
const ORIGINAL_IMAGE_SIZE = 800;

function convertToOriginalUrl(url: string) {
  return url.replace("s72-c", `s${ORIGINAL_IMAGE_SIZE}`);
}

type Item = {
  original: string;
  thumbnail: string;
};

interface Arguments {
  keyword: string;
}

export default function Command(props: LaunchProps<{ arguments: Arguments }>) {
  const { keyword } = props.arguments;

  const [items, setItems] = useState<Item[]>([]);

  const { isLoading } = useFetch<string>(
    `https://www.irasutoya.com/search?q=${keyword}`,
    {
      onData: (data) => {
        const root = parse(data);
        const scriptsElements = root.querySelectorAll(".boxim a script");

        const imageUrls = [...scriptsElements].map(e => {
          const url = e.textContent.replace(/^.+"(https:\/\/[^"]+?)".+$/gis, "$1") ?? THUMB_URL_DEFAULT;
          return {
            original: convertToOriginalUrl(url),
            thumbnail: url
          }
        });

        const newItems = imageUrls.map(({ original, thumbnail }) => {
          return {
            original,
            thumbnail
          };
        });
        setItems(newItems);
      }
    }
  );

  return (
    <Grid isLoading={isLoading}>
      {items.map(item => (
        <Grid.Item
          key={item.thumbnail}
          content={item.thumbnail}
          actions={
            <ActionPanel>
              <CopyImageToClipboardAction title="Copy Image" url={item.original} />
            </ActionPanel>
          }
        />
      ))}
    </Grid>
  );
}
