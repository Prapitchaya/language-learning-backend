const Certificate = require("../models/certificate.model");

const createCertificate = (req, res) => {
  const { user_id, course_id, certificate_link } = req.body;

  const newCertificate = {
    user_id,
    course_id,
    certificate_link,
  };

  Certificate.createCertificate(newCertificate, (err, certificateId) => {
    if (err) {
      res.status(500).send({ message: "Failed to create the certificate" });
    } else {
      res.send({
        message: "Certificate created successfully",
        certificateId,
      });
    }
  });
};

const getCertificatesForUser = (req, res) => {
  const user_id = req.params.user_id;

  Certificate.getCertificatesForUser(user_id, (err, certificates) => {
    if (err) {
      res.status(500).send({ message: "Failed to retrieve certificates" });
    } else {
      res.send(certificates);
    }
  });
};

const deleteCertificate = (req, res) => {
  const certificate_id = req.params.certificate_id;

  Certificate.deleteCertificate(certificate_id, (err, result) => {
    if (err) {
      res.status(500).send({ message: "Failed to delete the certificate" });
    } else {
      res.send({
        message: "Certificate deleted successfully",
        deletedRows: result,
      });
    }
  });
};

const updateCertificate = (req, res) => {
  const certificate_id = req.params.certificate_id;
  const newCertificateData = req.body;

  Certificate.updateCertificate(
    certificate_id,
    newCertificateData,
    (err, result) => {
      if (err) {
        res.status(500).send({ message: "Failed to update the certificate" });
      } else {
        res.send({
          message: "Certificate updated successfully",
          updatedRows: result,
        });
      }
    }
  );
};

module.exports = {
  createCertificate,
  getCertificatesForUser,
  deleteCertificate,
  updateCertificate,
};
