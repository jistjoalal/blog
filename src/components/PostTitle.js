import React from "react"
import { Link } from "gatsby"

import styles from "./PostTitle.module.css"

export default ({ node }) => {
  const {
    id,
    frontmatter: { title, date },
    fields: { slug },
  } = node
  return (
    <li key={id} className={styles.post}>
      <Link className={styles.link} to={`/blog/${slug}`}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.text}>{date}</p>
      </Link>
    </li>
  )
}
