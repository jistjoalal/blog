import React from "react"
import { Link } from "gatsby"

import styles from "./Pagination.module.css"

export default ({ pageInfo: { pageCount, currentPage } }) => (
  <div className={styles.list}>
    {Array.from({ length: pageCount }).map((_, i) => {
      return currentPage - 1 === i ? (
        <span key={i}>{i}</span>
      ) : (
        <Link key={i} to={`/blog/${i || ""}`}>
          {i}
        </Link>
      )
    })}
  </div>
)
