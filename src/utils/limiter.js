import { rateLimit } from "express-rate-limit";

/**
 * Express middleware that limits repeated requests to public APIs and endpoints.
 *
 * The limiter restricts each IP to a maximum of 10 requests every 5 minutes.
 *
 * @constant
 * @type {import("express-rate-limit").RateLimitRequestHandler}
 */
const limiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  ipv6Subnet: 56,
  handler: function (req, res) {
    res
      .status(429)
      .json({
        status: "fail",
        message: "Too many requests, try again in 5 minutes",
        data: null,
      });
  },
});

export default limiter;
