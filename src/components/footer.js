import React from "react"
import { Link } from "gatsby"

import Author from "../queries/author"

import styles from "./footer.module.css"

export default () => (
  <footer className={styles.footer}>
    <Link to="/">Home</Link>
    <Link to="/blog">Blog</Link>
    <p>
      Created by {Author()} - © {new Date().getFullYear()}
    </p>
  </footer>
)
