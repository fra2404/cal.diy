import { getServerSession } from "@calcom/features/auth/lib/getServerSession";
import SettingsHeader from "@calcom/features/settings/appDir/SettingsHeader";
import { prisma } from "@calcom/prisma";
import { MembershipRole, UserPermissionRole } from "@calcom/prisma/enums";
import SmtpConfigurationsView from "@calcom/web/modules/settings/teams/smtp-configuration/SmtpConfigurationsView";
import { buildLegacyRequest } from "@lib/buildLegacyCtx";
import { _generateMetadata, getTranslate } from "app/_utils";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

export const generateMetadata = async ({ params }: { params: Promise<{ id: string }> }) =>
  await _generateMetadata(
    (t) => t("smtp_configuration"),
    (t) => t("smtp_configuration_description"),
    undefined,
    undefined,
    `/settings/teams/${(await params).id}/smtp-configuration`
  );

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const t = await getTranslate();
  const { id } = await params;
  const teamId = parseInt(id);

  const session = await getServerSession({ req: buildLegacyRequest(await headers(), await cookies()) });

  if (!session?.user.id) {
    return redirect("/auth/login");
  }

  const isAdmin = session.user.role === UserPermissionRole.ADMIN;

  const membership = isAdmin
    ? null
    : await prisma.membership.findFirst({
        where: {
          userId: session.user.id,
          teamId,
          accepted: true,
          role: { in: [MembershipRole.OWNER, MembershipRole.ADMIN] },
        },
        select: { role: true },
      });

  const canManage = isAdmin || !!membership;

  if (!canManage) {
    return redirect(`/settings/teams/${teamId}/members`);
  }

  return (
    <SettingsHeader
      title={t("smtp_configuration")}
      description={t("smtp_configuration_description")}>
      <SmtpConfigurationsView
        teamId={teamId}
        permissions={{ canRead: true, canEdit: true }}
      />
    </SettingsHeader>
  );
};

export default Page;