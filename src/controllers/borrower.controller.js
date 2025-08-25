import Borrower from "../models/borrower.model.js";

export const getAllBorrowers = async (req, res, next) => {
  // pagination handles negative and non-numeric values
  const page = parseInt(req.query.page) > 0 ? parseInt(req.query.page) : 1;
  // max limit is 100 items
  const limit =
    parseInt(req.query.limit) > 0
      ? Math.min(parseInt(req.query.limit), 100)
      : 10;

  try {
    const borrowers = await Borrower.findAndCountAll({
      limit,
      offset: (page - 1) * limit,
    });
    res.status(200).send({ status: "success", data: borrowers });
  } catch (error) {
    next(error);
  }
};

export const getBorrowerById = async (req, res, next) => {
  try {
    const borrower = await Borrower.findByPk(req.params.id);
    if (!borrower) {
      return res
        .status(404)
        .send({ status: "fail", data: "Borrower not found" });
    }
    res.status(200).send({ status: "success", data: borrower });
  } catch (error) {
    next(error);
  }
};

export const createBorrower = async (req, res, next) => {
  try {
    const borrower = await Borrower.create({
      name: req.body.name,
      email: req.body.email,
    });
    res.status(201).send({ status: "success", data: borrower });
  } catch (error) {
    next(error);
  }
};

export const updateBorrower = async (req, res, next) => {
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
    next(error);
  }
};

export const deleteBorrower = async (req, res, next) => {
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
    next(error);
  }
};
