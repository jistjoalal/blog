import React from "react"
import { Link, graphql, useStaticQuery } from "gatsby"

import Layout from "../components/layout"

import styles from "./blog.module.css"

export default () => (
  <Layout>
    <h1>blog page</h1>
    <ol className={styles.posts}>{allMarkdownPosts().map(PostTitle)}</ol>
  </Layout>
)

const PostTitle = ({ node }) => (
  <li key={node.id} className={styles.post}>
    <Link className={styles.link} to={`/blog/${node.fields.slug}`}>
      <h2 className={styles.title}>{node.frontmatter.title}</h2>
      <p className={styles.date}>{node.frontmatter.date}</p>
    </Link>
  </li>
)

const allMarkdownPosts = () =>
  useStaticQuery(graphql`
    {
      allMarkdownRemark {
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
