"use client";

import Header from "@/components/header";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { ClientSideSuspense, RoomProvider } from "@liveblocks/react";
import Loader from "./loader";
import { Editor } from "./editor/Editor";
import ActiveCollaborators from "./active-collaborators";
import { useEffect, useRef, useState } from "react";
import { Input } from "./ui/input";
import Image from "next/image";
import { updateDocument } from "@/lib/actions/room.actions";

const CollaborativeRoom = ({
	roomId,
	roomMetadata,
}: CollaborativeRoomProps) => {
	const currentUserType = "editor";
	const [editing, setEditing] = useState(false);
	const [loading, setLoading] = useState(false);
	const [documentTitle, setDocumentTitle] = useState(roomMetadata.title);

	const containerRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	const updateTitleHandler = async (
		e: React.KeyboardEvent<HTMLInputElement>
	) => {
		if (e.key === "Enter") {
			setLoading(true);
			try {
				if (documentTitle !== roomMetadata.title) {
					const updatedDocument = await updateDocument(roomId, documentTitle);
					console.log(updatedDocument);
				}
			} catch (error) {
				console.log(error);
			} finally {
				setLoading(false);
			}
		}
	};

	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			if (
				containerRef.current &&
				!containerRef.current.contains(e.target as Node)
			) {
				setEditing(() => false);
				updateDocument(roomId, documentTitle);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);

		// cleanup
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [documentTitle, roomId]);

	useEffect(() => {
		if (editing && inputRef.current) {
			inputRef.current?.focus();
		}
	}, [editing]);

	return (
		<RoomProvider id={roomId}>
			<ClientSideSuspense fallback={<Loader />}>
				<div className="collaborative-room">
					<Header className="text-white">
						<div
							ref={containerRef}
							className="flex w-fit items-center justify-center gap-2">
							{editing && !loading ? (
								<Input
									type="text"
									ref={inputRef}
									value={documentTitle}
									placeholder="Enter title"
									onChange={(e) => setDocumentTitle(e.target.value)}
									onKeyDown={updateTitleHandler}
									disabled={!editing}
									className="document-title-input"
								/>
							) : (
								<p className="document-title">{documentTitle}</p>
							)}
							{currentUserType === "editor" && !editing && (
								<Image
									src={"/assets/icons/edit.svg"}
									alt="edit"
									width={24}
									height={24}
									onClick={() => setEditing(() => true)}
									className="pointer"
								/>
							)}
							{currentUserType !== "editor" && !editing && (
								<p className="view-only-tag">View only</p>
							)}
							{loading && <p className="text-sm text-gray-400">saving...</p>}
						</div>
						<div className="flex w-full flex-1 justify-end gap-2 sm:gap-3">
							<ActiveCollaborators />
							<SignedOut>
								<SignInButton />
							</SignedOut>
							<SignedIn>
								<UserButton />
							</SignedIn>
						</div>
					</Header>
					<Editor />
				</div>
			</ClientSideSuspense>
		</RoomProvider>
	);
};

export default CollaborativeRoom;
