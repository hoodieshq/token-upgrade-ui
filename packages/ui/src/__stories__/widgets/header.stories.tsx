//import Header from "../../widgets/header"

import React, { FC, ButtonHTMLAttributes } from "react"
import PropTypes from "prop-types"

/**
 * Primary UI component for user interaction
 */
const Header = (props) => {
  //const Header: FC<ButtonHTMLAttributes<any>> = (props) => {
  return (
    <button type="button" className={["storybook-button"].join(" ")} {...props}>
      {props.children}
    </button>
  )
}

Header.propTypes = {
  /**
   * Is this the principal call to action on the page?
   */
  //primary: PropTypes.bool,
  /**
   * What background color to use
   */
  //backgroundColor: PropTypes.string,
  /**
   * How large should the button be?
   */
  //size: PropTypes.oneOf(["small", "medium", "large"]),
  /**
   * Header contents
   */
  //label: PropTypes.string.isRequired,
  /**
   * Optional click handler
   */
  onClick: PropTypes.func,
}

Header.defaultProps = {
  //backgroundColor: null,
  //primary: false,
  //size: "medium",
  onClick: undefined,
}

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
export default {
  title: "UI/Header",
  component: Header,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "fullscreen",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {},
}

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary = {
  args: {
    primary: true,
    label: "Header",
  },
}
