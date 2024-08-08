class ApiError extends Error {
  statusCode: number;
  data: any;
  errors: any[];
  success: boolean;

  constructor(
    statusCode: number,
    message: string = "Something went wrong ApiError",
    errors: any[] = [],
    stack: string = ""
  ) {
    super(message);
    this.statusCode = statusCode;
    this.data = null;
    this.errors = errors;
    this.success = false;
    if (stack) {
      this.stack = stack;
    } else {
      console.log(
        "Error from ApiError Below  is stack of error ---------->\n------------>",
        stack
      );
      Error.captureStackTrace(this, this.constructor); // Otherwise, capture the stack trace
    }
  }
}

export { ApiError };
