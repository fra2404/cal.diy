import { prisma } from "@calcom/prisma";
import { MembershipRole, UserPermissionRole } from "@calcom/prisma/enums";

import { TRPCError } from "@trpc/server";

import type { TrpcSessionUser } from "../../../../types";

/**
 * Allows:
 * - Global admins (UserPermissionRole.ADMIN)
 * - Team OWNER / ADMIN members
 */
export async function assertCanManageTeamSmtp(user: NonNullable<TrpcSessionUser>, teamId: number): Promise<void> {
  if (user.role === UserPermissionRole.ADMIN) return;

  const membership = await prisma.membership.findFirst({
    where: {
      userId: user.id,
      teamId,
      accepted: true,
      role: { in: [MembershipRole.OWNER, MembershipRole.ADMIN] },
    },
    select: { id: true },
  });

  if (!membership) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You must be an admin or owner of the team to manage SMTP configurations",
    });
  }
}

export function getTeamIdFromInput(input: { teamId: number }): number {
  return input.teamId;
}