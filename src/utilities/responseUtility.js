/* eslint-disable linebreak-style */

export default {
  success: (res, data) => {
    res.status(200).json({
      status: 'success',
      data,
    });
  },
  error: (res, code, msg) => res.status(code).json({
    status: 'error',
    error: msg,
  }),
};
