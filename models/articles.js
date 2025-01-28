const db = require("../db/connection");

exports.selectArticleById = (params) => {
  let { article_id } = params;
  let SQL = `SELECT * FROM articles`;
  let values = [];

  if (article_id) {
    SQL += ` WHERE article_id = $1`;
    values.push(article_id);
  }

  return db
    .query(SQL, values)
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({
          status: 404,
          error: "Not found",
          msg: "Article ID does not exist",
        });
      } else return result.rows[0];
    })
    .catch((err) => {
      return Promise.reject(err);
    });
};

exports.selectAllArticles = () => {
  SQL = `SELECT articles.author,
  articles.title,
  articles.article_id,
  articles.topic,
  articles.created_at,
  articles.votes,
  articles.article_img_url,
  COUNT(comments.comment_id) AS comment_count
  FROM articles LEFT JOIN comments
  ON articles.article_id = comments.article_id
  GROUP BY articles.article_id
  ORDER BY articles.created_at DESC`;

  return db.query(SQL).then((result) => {
    return result.rows;
  });
};
