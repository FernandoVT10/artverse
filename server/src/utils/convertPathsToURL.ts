import { Request } from "express";

import { PUBLIC_DIR } from "@config/constants";

function getWebsiteURL(req: Request): string {
  const protocol = req.protocol;
  const host = req.get("host");

  return `${protocol}://${host}/`;
}

function convertPathsToURL(
  pathsObject: Record<string, string>,
  req: Request
): Record<string, string> {
  const websiteURL = getWebsiteURL(req);

  const urlsObject: Record<string, string> = {};

  Object.keys(pathsObject).forEach((key) => {
    const path = pathsObject[key];
    const pathAfterPublicDir = path.split(PUBLIC_DIR)[1];
    const url = new URL(pathAfterPublicDir, websiteURL);

    urlsObject[key] = url.toString();
  });

  return urlsObject;
}

export default convertPathsToURL;
