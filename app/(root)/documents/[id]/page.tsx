import CollaborativeRoom from "@/components/collaborative-room";
import { getDocument } from "@/lib/actions/room.actions";
import { getClerkUsers } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
	const { id } = await params;
	const clerkUser = await currentUser();
	if (!clerkUser) redirect("/sign-in");

	const room = await getDocument({
		userId: clerkUser.emailAddresses[0].emailAddress,
		roomId: id,
	});

	if (!room) redirect("/");

	const userIds = Object.keys(room.usersAccesses);
	const users = await getClerkUsers({ userIds });
	const usersData = users.map((user: User) => ({
		...user,
		type: room.usersAccesses[user.email]?.includes("room:write")
			? "editor"
			: "viewer",
	}));

	const currentUserType = room.usersAccesses[
		clerkUser.emailAddresses[0].emailAddress
	]?.includes("room:write")
		? "editor"
		: "viewer";

	return (
		<main className="flex w-full flex-col items-center">
			<CollaborativeRoom
				roomId={room.id}
				roomMetadata={room.metadata}
				users={usersData}
				currentUserType={currentUserType}
			/>
		</main>
	);
};

export default page;
