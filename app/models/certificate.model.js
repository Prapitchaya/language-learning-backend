const sql = require("./db");

const Certificate = function (certificate) {
  this.user_id = certificate.user_id;
  this.course_id = certificate.course_id;
  this.certificate_link = certificate.certificate_link;
};

Certificate.createCertificate = (certificate, result) => {
  sql.query(
    "INSERT INTO certificate (user_id, course_id, certificate_link) VALUES (?, ?, ?)",
    [certificate.user_id, certificate.course_id, certificate.certificate_link],
    (err, res) => {
      if (err) {
        console.log("Certificate creation error: ", err);
        result(err, null);
        return;
      }
      console.log("Certificate created: ", {
        user_id: certificate.user_id,
        course_id: certificate.course_id,
        certificate_link: certificate.certificate_link,
        id: res.insertId,
      });
      result(null, res.insertId);
    }
  );
};

Certificate.getCertificatesForUser = (user_id, result) => {
  sql.query(
    "SELECT * FROM certificate WHERE user_id = ?",
    [user_id],
    (err, res) => {
      if (err) {
        console.log("Certificate retrieval error: ", err);
        result(err, null);
        return;
      }
      console.log("Certificates retrieved for user_id: ", user_id);
      result(null, res);
    }
  );
};

Certificate.deleteCertificate = (certificate_id, result) => {
  sql.query(
    "DELETE FROM certificate WHERE certificate_id = ?",
    [certificate_id],
    (err, res) => {
      if (err) {
        console.log("Certificate deletion error: ", err);
        result(err, null);
        return;
      }
      console.log("Certificate deleted with id: ", certificate_id);
      result(null, res.affectedRows);
    }
  );
};

Certificate.updateCertificate = (
  certificate_id,
  newCertificateData,
  result
) => {
  sql.query(
    "UPDATE certificate SET ? WHERE certificate_id = ?",
    [newCertificateData, certificate_id],
    (err, res) => {
      if (err) {
        console.log("Certificate update error: ", err);
        result(err, null);
        return;
      }
      console.log("Certificate updated with id: ", certificate_id);
      result(null, res.affectedRows);
    }
  );
};

module.exports = Certificate;
