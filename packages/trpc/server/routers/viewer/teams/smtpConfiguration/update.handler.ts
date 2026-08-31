import { getSmtpConfigurationService } from "@calcom/features/di/smtpConfiguration/containers/smtpConfiguration";
import { resolveAndValidateSmtpHost } from "@calcom/lib/validateSmtpHost";

import { TRPCError } from "@trpc/server";

import type { TrpcSessionUser } from "../../../../types";
import { assertCanManageTeamSmtp } from "./authorization";
import type { TUpdateSmtpConfigurationInput } from "./schemas";

type UpdateSmtpConfigurationOptions = {
  ctx: {
    user: NonNullable<TrpcSessionUser>;
  };
  input: TUpdateSmtpConfigurationInput;
};

export const updateSmtpConfigurationHandler = async ({ ctx, input }: UpdateSmtpConfigurationOptions) => {
  await assertCanManageTeamSmtp(ctx.user, input.teamId);

  if (input.smtpHost) {
    const hostCheck = await resolveAndValidateSmtpHost(input.smtpHost);
    if (!hostCheck.valid) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: hostCheck.error || "SMTP host is not allowed",
      });
    }
  }

  const service = getSmtpConfigurationService();

  return service.update(input.id, input.teamId, {
    fromEmail: input.fromEmail,
    fromName: input.fromName,
    smtpHost: input.smtpHost,
    smtpPort: input.smtpPort,
    smtpUser: input.smtpUser,
    smtpPassword: input.smtpPassword,
    smtpSecure: input.smtpSecure,
  });
};

export default updateSmtpConfigurationHandler;