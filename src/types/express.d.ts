declare namespace Express {
  interface UserPayload {
    id: number;
    role: string;
  }

  interface Request {
    user?: UserPayload;
  }
}
