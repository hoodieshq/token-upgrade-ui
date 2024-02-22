import React, { FC, ReactHTML } from "react"

const Header: FC<Parameters<ReactHTML["header"]>[0]> = (props) => {
  return <header {...props}>Header</header>
}

export default Header
