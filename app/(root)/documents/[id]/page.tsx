import CollaborativeRoom from "@/components/collaborative-room";
import { getDocument } from "@/lib/actions/room.actions";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

const page = async ({ params: { id } }: SearchParamProps) => {
	const clerkUser = await currentUser();
	if (!clerkUser) redirect("/sign-in");

	const room = await getDocument({
		userId: clerkUser.emailAddresses[0].emailAddress,
		roomId: id,
	});

	if (!room) redirect("/");

	return (
		<main className="flex w-full flex-col items-center">
			<CollaborativeRoom roomId={room.id} roomMetadata={room.metadata} />
		</main>
	);
};

export default page;
