"use client";

import { ReactNode } from "react";
import {
	LiveblocksProvider,
	ClientSideSuspense,
} from "@liveblocks/react/suspense";
import Loader from "@/components/loader";
import { getClerkUsers, getDocumentUsers } from "@/lib/actions/user.actions";
import { useUser } from "@clerk/nextjs";

const Provider = ({ children }: { children: ReactNode }) => {
	const { user: clerkUser } = useUser();

	return (
		<LiveblocksProvider
			resolveUsers={async ({ userIds }) => {
				const users = await getClerkUsers({ userIds });
				return users;
			}}
			resolveMentionSuggestions={async ({ text, roomId }) => {
				const roomUsers = await getDocumentUsers({
					roomId,
					currentUser: String(clerkUser?.emailAddresses[0].emailAddress),
					text,
				});
				return roomUsers;
			}}
			authEndpoint={"/api/liveblocks-auth"}>
			<ClientSideSuspense fallback={<Loader />}>{children}</ClientSideSuspense>
		</LiveblocksProvider>
	);
};

export default Provider;
