import React from "react"
import { useStaticQuery, graphql } from "gatsby"

import styles from "./PostTitles.module.css"

import PostTitle from "./PostTitle"

export default () => {
  const posts = useStaticQuery(graphql`
    {
      allMarkdownRemark(limit: 3) {
        edges {
          node {
            id
            frontmatter {
              title
              date
            }
            fields {
              slug
            }
          }
        }
      }
    }
  `).allMarkdownRemark.edges

  return <ul className={styles.posts}>{posts.map(PostTitle)}</ul>
}
