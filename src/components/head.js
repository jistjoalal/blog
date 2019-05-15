import React from "react"
import { Helmet } from "react-helmet"

import Title from "../queries/title"

export default ({ title }) => (
  <Helmet>
    <title>{`${Title()} | ${title}`}</title>
  </Helmet>
)
