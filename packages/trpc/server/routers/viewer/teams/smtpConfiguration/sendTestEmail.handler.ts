import { getSmtpConfigurationService } from "@calcom/features/di/smtpConfiguration/containers/smtpConfiguration";
import { getTranslation } from "@calcom/i18n/server";

import { TRPCError } from "@trpc/server";

import type { TrpcSessionUser } from "../../../../types";
import { assertCanManageTeamSmtp } from "./authorization";
import type { TSendSmtpTestEmailInput } from "./schemas";

type SendSmtpTestEmailOptions = {
  ctx: {
    user: NonNullable<TrpcSessionUser> & { locale?: string | null };
  };
  input: TSendSmtpTestEmailInput;
};

export const sendSmtpTestEmailHandler = async ({ ctx, input }: SendSmtpTestEmailOptions) => {
  await assertCanManageTeamSmtp(ctx.user, input.teamId);
  const service = getSmtpConfigurationService();
  const userEmail = ctx.user.email;

  if (!userEmail) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "User email is required to send test email",
    });
  }

  const language = await getTranslation(ctx.user.locale ?? "en", "common");

  return service.sendTestEmail(input.id, input.teamId, userEmail, language);
};

export default sendSmtpTestEmailHandler;