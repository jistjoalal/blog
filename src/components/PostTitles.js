import React from "react"

import Posts from "../queries/posts"

import PostTitle from "./PostTitle"

import styles from "./PostTitles.module.css"

export default () => <ul className={styles.posts}>{Posts().map(PostTitle)}</ul>
