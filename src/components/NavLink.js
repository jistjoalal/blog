import React from "react"
import { Link } from "gatsby"

import styles from "./NavLink.module.css"

export default ({ to, children }) => (
  <li>
    {!to.startsWith("https://") ? (
      <Link
        className={styles.navItem}
        activeClassName={styles.activeNavItem}
        to={to}
      >
        {children}
      </Link>
    ) : (
      <a
        className={styles.navItem}
        href={to}
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    )}
  </li>
)
