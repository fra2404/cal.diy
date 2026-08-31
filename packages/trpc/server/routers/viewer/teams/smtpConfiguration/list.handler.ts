import { getSmtpConfigurationService } from "@calcom/features/di/smtpConfiguration/containers/smtpConfiguration";

import { TRPCError } from "@trpc/server";

import type { TrpcSessionUser } from "../../../../types";
import { assertCanManageTeamSmtp } from "./authorization";
import type { TListSmtpConfigurationsInput } from "./schemas";

type ListSmtpConfigurationsOptions = {
  ctx: {
    user: NonNullable<TrpcSessionUser>;
  };
  input: TListSmtpConfigurationsInput;
};

export const listSmtpConfigurationsHandler = async ({ ctx, input }: ListSmtpConfigurationsOptions) => {
  await assertCanManageTeamSmtp(ctx.user, input.teamId);
  const service = getSmtpConfigurationService();

  return service.listByTeam(input.teamId);
};

export default listSmtpConfigurationsHandler;