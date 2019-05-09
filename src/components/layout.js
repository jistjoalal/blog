import React from "react"

import Footer from "../components/footer"
import Header from "../components/header"

import "../styles/index.css"
import styles from "./layout.module.css"

export default ({ children }) => (
  <div className={styles.container}>
    <div className={styles.content}>
      <Header />
      {children}
    </div>
    <Footer />
  </div>
)
