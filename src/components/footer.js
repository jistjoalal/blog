import React from "react"
import { graphql, useStaticQuery } from "gatsby"

import styles from "./footer.module.css"

export default () => {
  const author = useStaticQuery(graphql`
    {
      site {
        siteMetadata {
          author
        }
      }
    }
  `).site.siteMetadata.author

  return (
    <footer className={styles.footer}>
      <p>Created by {author} - © 2019</p>
    </footer>
  )
}
