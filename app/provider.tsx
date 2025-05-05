"use client";

import { ReactNode } from "react";
import {
	LiveblocksProvider,
	ClientSideSuspense,
} from "@liveblocks/react/suspense";
import Loader from "@/components/loader";
import { getClerkUsers } from "@/lib/actions/user.actions";

const Provider = ({ children }: { children: ReactNode }) => {
	return (
		<LiveblocksProvider
			resolveUsers={async ({ userIds }) => {
				const users = await getClerkUsers({ userIds });
				return users;
			}}
			authEndpoint={"/api/liveblocks-auth"}>
			<ClientSideSuspense fallback={<Loader />}>{children}</ClientSideSuspense>
		</LiveblocksProvider>
	);
};

export default Provider;
