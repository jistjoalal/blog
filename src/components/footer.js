import React from "react"
import { graphql, useStaticQuery } from "gatsby"

import footerStyles from "./footer.module.css"

export default () => {
  const data = useStaticQuery(graphql`
    {
      site {
        siteMetadata {
          author
        }
      }
    }
  `)

  return (
    <footer className={footerStyles.footer}>
      <p>Created by {data.site.siteMetadata.author} - © 2019</p>
    </footer>
  )
}
