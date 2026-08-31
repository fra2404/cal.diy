import { getSmtpConfigurationService } from "@calcom/features/di/smtpConfiguration/containers/smtpConfiguration";
import { resolveAndValidateSmtpHost } from "@calcom/lib/validateSmtpHost";

import { TRPCError } from "@trpc/server";

import type { TrpcSessionUser } from "../../../../types";
import { assertCanManageTeamSmtp } from "./authorization";
import type { TCreateSmtpConfigurationInput } from "./schemas";

type CreateSmtpConfigurationOptions = {
  ctx: {
    user: NonNullable<TrpcSessionUser>;
  };
  input: TCreateSmtpConfigurationInput;
};

export const createSmtpConfigurationHandler = async ({ ctx, input }: CreateSmtpConfigurationOptions) => {
  await assertCanManageTeamSmtp(ctx.user, input.teamId);

  const hostCheck = await resolveAndValidateSmtpHost(input.smtpHost);
  if (!hostCheck.valid) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: hostCheck.error || "SMTP host is not allowed",
    });
  }

  const service = getSmtpConfigurationService();

  return service.create({
    teamId: input.teamId,
    fromEmail: input.fromEmail,
    fromName: input.fromName,
    smtpHost: input.smtpHost,
    smtpPort: input.smtpPort,
    smtpUser: input.smtpUser,
    smtpPassword: input.smtpPassword,
    smtpSecure: input.smtpSecure,
  });
};

export default createSmtpConfigurationHandler;