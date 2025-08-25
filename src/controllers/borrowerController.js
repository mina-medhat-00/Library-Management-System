import Borrower from "../models/borrowerModel.js";

export const createBorrower = async (req, res) => {
  try {
    const borrower = await Borrower.create({
      name: req.body.name,
      email: req.body.email,
    });
    res.status(201).send({ status: "success", data: borrower });
  } catch (error) {
    res.status(500).send({ status: "fail", data: error });
  }
};

export const getAllBorrowers = async (req, res) => {
  try {
    const borrowers = await Borrower.findAll();
    res.status(200).send({ status: "success", data: borrowers });
  } catch (error) {
    res.status(500).send({ status: "fail", data: error });
  }
};

export const getBorrowerById = async (req, res) => {
  try {
    const borrower = await Borrower.findByPk(req.params.id);
    if (!borrower) {
      return res
        .status(404)
        .send({ status: "fail", data: "Borrower not found" });
    }
    res.status(200).send({ status: "success", data: borrower });
  } catch (error) {
    res.status(500).send({ status: "fail", data: error });
  }
};

export const updateBorrower = async (req, res) => {
  try {
    const borrower = await Borrower.findByPk(req.params.id);
    if (!borrower) {
      return res
        .status(404)
        .send({ status: "fail", data: "Borrower not found" });
    }
    await borrower.update(req.body);
    res.status(200).send({ status: "success", data: borrower });
  } catch (error) {
    res.status(500).send({ status: "fail", data: error });
  }
};

export const deleteBorrower = async (req, res) => {
  try {
    const borrower = await Borrower.findByPk(req.params.id);
    if (!borrower) {
      return res
        .status(404)
        .send({ status: "fail", data: "Borrower not found" });
    }
    await borrower.destroy();
    res.status(200).send({ status: "success", data: "Borrower deleted" });
  } catch (error) {
    res.status(500).send({ status: "fail", data: error });
  }
};
