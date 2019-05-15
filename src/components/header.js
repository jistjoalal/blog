import React from "react"
import { Link } from "gatsby"

import Title from "../queries/title"

import NavLink from "./NavLink"

import styles from "./header.module.css"

export default () => (
  <header className={styles.header}>
    <h1>
      <Link className={styles.title} to="/">
        {Title()}
      </Link>
    </h1>
    <nav>
      <ul className={styles.navList}>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/blog">Blog</NavLink>
        <NavLink to="https://github.com/jistjoalal/blog">Github</NavLink>
      </ul>
    </nav>
  </header>
)
