import React from "react"
import { Link, graphql, useStaticQuery } from "gatsby"

import styles from "./header.module.css"

const NavLink = ({ children, to }) => (
  <Link
    className={styles.navItem}
    activeClassName={styles.activeNavItem}
    to={to}
  >
    {children}
  </Link>
)

export default () => {
  const title = useStaticQuery(graphql`
    {
      site {
        siteMetadata {
          title
        }
      }
    }
  `).site.siteMetadata.title

  return (
    <header className={styles.header}>
      <h1>
        <Link className={styles.title} to="/">
          {title}
        </Link>
      </h1>
      <nav>
        <ul className={styles.navList}>
          <li>
            <NavLink to="/">Home</NavLink>
          </li>
          <li>
            <NavLink to="/blog">Blog</NavLink>
          </li>
        </ul>
      </nav>
    </header>
  )
}
