import { useState } from "react";
import { Detail, Grid, LaunchProps } from "@raycast/api";
import { useFetch } from "@raycast/utils";
import { parse } from "node-html-parser";

type Item = {
  id: number
  url: string
};

interface Arguments {
  keyword: string
}

function SearchResult(props: { keyword: string }) {
  const { keyword } = props;

  const [items, setItems] = useState<Item[]>([]);

  const { isLoading } = useFetch<string>(
    `https://www.irasutoya.com/search?q=${keyword}`,
    {
      onData: (data) => {
        const root = parse(data);
        console.log('root:', root)
        const images = root.querySelectorAll(".boxthumb");
        console.log('images:', images)
        const slicedImages = images.slice(0, 10);

        const newItems = slicedImages.map((image, index) => ({
          id: index,
          url: image.getAttribute('src') || ''
        }));
        setItems(newItems);
      }
    }
  )

  return (
    <Grid isLoading={isLoading}>
      {items.map(item => (
        <Grid.Item
          key={item.id}
          content={item.url}
        />
      ))}
    </Grid>
  )
}

export default function Command(props: LaunchProps<{ arguments: Arguments }>) {
  const { keyword } = props.arguments

  return (
    keyword ? <SearchResult keyword={keyword} /> : <Detail markdown="Need arguments." />
  )
}
