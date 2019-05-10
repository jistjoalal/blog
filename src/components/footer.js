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
      <p>
        Created by {author} - © {new Date().getFullYear()}
      </p>
    </footer>
  )
}
