import { getSmtpConfigurationService } from "@calcom/features/di/smtpConfiguration/containers/smtpConfiguration";

import type { TrpcSessionUser } from "../../../../types";
import { assertCanManageTeamSmtp } from "./authorization";
import type { TDeleteSmtpConfigurationInput } from "./schemas";

type DeleteSmtpConfigurationOptions = {
  ctx: {
    user: NonNullable<TrpcSessionUser>;
  };
  input: TDeleteSmtpConfigurationInput;
};

export const deleteSmtpConfigurationHandler = async ({ ctx, input }: DeleteSmtpConfigurationOptions) => {
  await assertCanManageTeamSmtp(ctx.user, input.teamId);
  const service = getSmtpConfigurationService();

  await service.delete(input.id, input.teamId);
  return { success: true };
};

export default deleteSmtpConfigurationHandler;