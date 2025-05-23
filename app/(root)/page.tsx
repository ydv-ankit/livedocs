import AddDocumentBtn from "@/components/add-doc-btn";
import Header from "@/components/header";
import { Notifications } from "@/components/notifications";
import { getDocuments } from "@/lib/actions/room.actions";
import { dateConverter } from "@/lib/utils";
import { SignedIn, UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Home() {
	const clerkUser = await currentUser();

	if (!clerkUser) redirect("/sign-in");

	const roomDocuments = await getDocuments(
		clerkUser.emailAddresses[0].emailAddress
	);

	return (
		<main className="home-container">
			<Header className="sticky left-0 top-0">
				<div className="flex items-center gap-2 lg:gap-4">
					<Notifications />
					<SignedIn>
						<UserButton />
					</SignedIn>
				</div>
			</Header>
			{roomDocuments.data.length > 0 ? (
				<div className="document-list-container">
					<div className="document-list-title">
						<h3 className="text-28-semibold">All Documents</h3>
						<AddDocumentBtn
							userId={clerkUser.id}
							email={clerkUser.emailAddresses[0].emailAddress}
						/>
					</div>
					<ul className="document-ul">
						{roomDocuments.data.map((doc: RoomDocument) => (
							<li key={doc.id} className="document-list-item">
								<Link
									href={`/documents/${doc.id}`}
									className="flex items-center flex-1 gap-4">
									<div className="hidden rounded-md bg-[#2E3D5B] p-2 sm:block">
										<Image
											src={"/assets/icons/doc.svg"}
											width={40}
											height={40}
											alt="file"
										/>
									</div>
									<div className="space-y-1">
										<p className="line-clamp-1 text-lg">{doc.metadata.title}</p>
										<p className="text-sm font-light text-blue-100">
											Created about {dateConverter(doc.createdAt)}
										</p>
									</div>
								</Link>
							</li>
						))}
					</ul>
				</div>
			) : (
				<div className="document-list-empty">
					<Image
						src={"/assets/icons/doc.svg"}
						alt="documents"
						width={40}
						height={40}
						className="mx-auto"
					/>
					<AddDocumentBtn
						userId={clerkUser.id}
						email={clerkUser.emailAddresses[0].emailAddress}
					/>
				</div>
			)}
		</main>
	);
}
