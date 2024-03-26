import dynamic from "next/dynamic"

const NoSSRIndexEntrie = dynamic(() => import("../entries/index"), {
  ssr: false,
})

export default function Home() {
  return <NoSSRIndexEntrie />
}
