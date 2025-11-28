export const catchAsync = (controller) => {
  return async (req, res, next) => {
    try {
      await controller(req, res, next);
    } catch (error) {
      console.log(`Error in ${controller.name || 'anonymous'}: `, error)
      return next(error);
    }
  }
}