import authedProcedure from "../../../../procedures/authedProcedure";
import { router } from "../../../../trpc";
import {
  ZCreateSmtpConfigurationInputSchema,
  ZDeleteSmtpConfigurationInputSchema,
  ZGetSmtpConfigurationInputSchema,
  ZListSmtpConfigurationsInputSchema,
  ZSendSmtpTestEmailInputSchema,
  ZTestSmtpConnectionInputSchema,
  ZUpdateSmtpConfigurationInputSchema,
} from "./schemas";

export const viewerTeamsSmtpRouter = router({
  list: authedProcedure.input(ZListSmtpConfigurationsInputSchema).query(async (opts) => {
    const { default: handler } = await import("./list.handler");
    return handler(opts);
  }),
  get: authedProcedure.input(ZGetSmtpConfigurationInputSchema).query(async (opts) => {
    const { default: handler } = await import("./get.handler");
    return handler(opts);
  }),
  create: authedProcedure.input(ZCreateSmtpConfigurationInputSchema).mutation(async (opts) => {
    const { default: handler } = await import("./create.handler");
    return handler(opts);
  }),
  update: authedProcedure.input(ZUpdateSmtpConfigurationInputSchema).mutation(async (opts) => {
    const { default: handler } = await import("./update.handler");
    return handler(opts);
  }),
  delete: authedProcedure.input(ZDeleteSmtpConfigurationInputSchema).mutation(async (opts) => {
    const { default: handler } = await import("./delete.handler");
    return handler(opts);
  }),
  testConnection: authedProcedure.input(ZTestSmtpConnectionInputSchema).mutation(async (opts) => {
    const { default: handler } = await import("./testConnection.handler");
    return handler(opts);
  }),
  sendTestEmail: authedProcedure.input(ZSendSmtpTestEmailInputSchema).mutation(async (opts) => {
    const { default: handler } = await import("./sendTestEmail.handler");
    return handler(opts);
  }),
});

export default viewerTeamsSmtpRouter;