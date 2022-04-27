import { NextFunction } from "express";

type Parameters = {
  bodyData?: { [key: string]: any };
};

type ExpressMocked = {
  req: any;
  res: any;
  next: NextFunction;
};

export default function (params?: Parameters): ExpressMocked {
  const req = {
    body: params?.bodyData || {},
  };

  const res: any = {};

  res.json = jest.fn();
  res.cookie = jest.fn(() => res);
  res.status = jest.fn(() => res);

  const next = jest.fn();

  return {
    req,
    res,
    next,
  };
}
