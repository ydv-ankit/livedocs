"use server";

import { revalidatePath } from "next/cache";
import { liveblocks } from "../liveblocks";
import { nanoid } from "nanoid";
import { parseStringify } from "../utils";

export const createDocument = async ({
	userId,
	email,
}: CreateDocumentParams) => {
	const roomId = nanoid();
	try {
		const metadata = {
			creatorId: userId,
			email,
			title: "Untitled",
		};

		const usersAccesses: RoomAccesses = {
			[email]: ["room:write"],
		};

		const room = await liveblocks.createRoom(roomId, {
			usersAccesses,
			metadata,
			defaultAccesses: ["room:write"],
		});

		revalidatePath("/");

		return parseStringify(room);
	} catch (error) {
		console.log("error while creating room", error);
	}
};

export const getDocument = async ({
	userId,
	roomId,
}: {
	roomId: string;
	userId: string;
}) => {
	try {
		const room = await liveblocks.getRoom(roomId);
		// const hasAccess = Object.keys(room.usersAccesses).includes(userId);
		// if (!hasAccess) throw new Error("no access to this document");
		return parseStringify(room);
	} catch (error) {
		console.log("error while getting room", error);
	}
};

export const updateDocument = async (roomId: string, title: string) => {
	try {
		const updatedRoom = await liveblocks.updateRoom(roomId, {
			metadata: {
				title,
			},
		});
		revalidatePath(`/documents/${roomId}`);
		return parseStringify(updatedRoom);
	} catch (error) {
		console.log("error while updating room", error);
	}
};
