import { Pattern } from "../shared/pattern"

export default function Home(props) {
  console.log({props})
  return (
    <>
      <Pattern />
      <main className="flex-auto"></main>
    </>
  )
}
