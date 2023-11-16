import HttpStatusCodes from "@src/constants/HttpStatusCodes";
import { Response } from "express";
import { Errors, SOMETHING_WENT_WRONG_ERR } from "../AuthRouts/auth.api.handlers";
import { userRepository } from "@src/index";
import { Roles } from "@src/repos/entities/User";
import { PaginationRequest, getTotalPages } from "@src/middleware/PaginationMiddleware";
import { DEFAULT_PAGE_SIZE } from "@src/constants/constants";
import logger from 'jet-logger'

export const getUserSubAccounts = async (
  req: PaginationRequest,
  res: Response
) => {
  const userId = req.user?.id
  try {

    if (!req.user || req.user?.role !== Roles.Customer) {
      res
        .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: SOMETHING_WENT_WRONG_ERR })
      return
    }
    if (!userId) {
      res.status(HttpStatusCodes.UNAUTHORIZED).json({ error: Errors.Unauth })
      return
    }

    const take = Number(req?.query?.limit) || DEFAULT_PAGE_SIZE;
    const [users, count] = await userRepository.findAndCount({
      where: { ownerId: userId },
      skip: req.skip,
      take,
    })
    const totalPages = getTotalPages(count, take)
    res.status(HttpStatusCodes.OK).json({ users, totalPages })
  } catch (error) {
    logger.err(error)
    res
      .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: SOMETHING_WENT_WRONG_ERR })
  }
}
