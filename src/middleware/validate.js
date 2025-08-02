export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body)
  if (!result.success) {
    const details = result.error.issues.map(issue => ({
      path: issue.path.join('.'),
      message: issue.message
    }))
    return res.status(400).json({
      success: false,
      error: 'Validation error',
      details
    })
  }
  req.body = result.data
  next()
}

export default validate
