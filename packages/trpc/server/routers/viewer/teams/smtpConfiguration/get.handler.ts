import { getSmtpConfigurationService } from "@calcom/features/di/smtpConfiguration/containers/smtpConfiguration";

import { TRPCError } from "@trpc/server";

import type { TrpcSessionUser } from "../../../../types";
import { assertCanManageTeamSmtp } from "./authorization";
import type { TGetSmtpConfigurationInput } from "./schemas";

type GetSmtpConfigurationOptions = {
  ctx: {
    user: NonNullable<TrpcSessionUser>;
  };
  input: TGetSmtpConfigurationInput;
};

export const getSmtpConfigurationHandler = async ({ ctx, input }: GetSmtpConfigurationOptions) => {
  await assertCanManageTeamSmtp(ctx.user, input.teamId);
  const service = getSmtpConfigurationService();

  const config = await service.getById(input.id, input.teamId);
  if (!config) {
    throw new TRPCError({ code: "NOT_FOUND", message: "SMTP configuration not found" });
  }
  return config;
};

export default getSmtpConfigurationHandler;