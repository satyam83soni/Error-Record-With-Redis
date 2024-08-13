interface ErrorDetails {
    name?: string;
    userName?: string;
    userEmail: string;
    message?: string;
    code?: string | number;
    errno?: number;
    path?: string;
    syscall?: string;
    stack?: string;
    resolved: boolean;
    platform?: string;
    toUser:string;
  }

  export {ErrorDetails};