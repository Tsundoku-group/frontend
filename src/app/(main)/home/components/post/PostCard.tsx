import {Heart, Send, User, EllipsisVertical, Pencil, Trash} from "lucide-react";
import PostDate from "@/app/(main)/home/components/post/PostDate";
import CommentSection from "@/app/(main)/home/components/comment/CommentSection";
import {useState} from "react";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {useProfileContext} from "@/context/profileContext";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {deletePost, updatePost} from "@/app/(main)/home/actions";
import {useGroupContext} from "@/context/groupContext";
import {ShowToast} from "@/components/ShowToast";
import {
    AlertDialog, AlertDialogAction,
    AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import ReactionButton from "@/app/(main)/home/components/comment/ReactButton";

interface Post {
    id: string;
    author: {
        id: string;
        lastname: string;
        firstname: string;
        username: string;
    };
    content: string;
    images: string[];
    likes: number;
    commentsCount: number;
    createdAt: string;
    visibility: string;
    hasLiked: boolean;
}

export default function PostCard({ post, onDelete }: { post: Post, onDelete: (id: string) => void }) {
    const [showComments, setShowComments] = useState(false);
    const {activeProfileInStorage} = useProfileContext();
    const profileId = activeProfileInStorage?.id;
    const [isEditing, setIsEditing] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [editedContent, setEditedContent] = useState(post.content);

    const {groupId} = useGroupContext();

    const handleEditPost = async () => {
        if (!profileId) return;

        setIsEditing(true);
        try {
            await updatePost({
                id: post.id,
                groupId: groupId,
                title: "",
                content: editedContent,
                visibility: post.visibility as "public" | "private",
                authorId: profileId
            });
            setIsEditing(false);
            setEditedContent(editedContent);
        } catch (error) {
            setIsEditing(false);
            ShowToast('destructive', 'Une erreur est survenue. Veuillez réessayer.', 'Erreur')
        }
    }

    const handleDeletePost = async () => {
        if (!profileId) return;

        setIsDeleting(true);
        try {
            await deletePost({
                id: post.id,
                editorId: profileId
            });
            onDelete(post.id);
            setIsDeleting(false);
            ShowToast('default', 'Le post a bien été supprimé.')
        } catch (error) {
            ShowToast('destructive', 'Une erreur est survenue. Veuillez réessayer.', 'Erreur')
        }
    }

    return (
        <>
            <div className="bg-tertiary-black p-4 rounded-lg shadow-md w-full mb-6">
                <div className="flex items-center justify-between w-full px-4">
                    <div className="flex items-center gap-4">
                        <Avatar className="w-16 h-16">
                            <AvatarImage src=""/>
                            <AvatarFallback><User/></AvatarFallback>
                        </Avatar>
                        <div>
                            <div className="text-white text-sm">
                                {post.author.firstname} {post.author.lastname}
                            </div>
                            <div className="text-gray-400 text-xs">@{post.author.username}</div>
                            <PostDate date={post.createdAt}/>
                        </div>
                    </div>
                    <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
                        <DropdownMenuTrigger className="text-gray-400 hover:text-white">
                        <span className="text-xs cursor-pointer">
                            <EllipsisVertical className="w-4 h-4"/>
                        </span>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-primary-black border-none">
                            {post.author.id === profileId ? (
                                <>
                                    <DropdownMenuItem className="text-white"
                                                      onClick={() => {
                                                          setIsEditing(true);
                                                          setIsDropdownOpen(false);
                                                      }}>

                                        Modifier <Pencil className="h-4 w-4 ml-7"/>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="text-red-highlight"
                                                      onClick={() => {
                                                          setIsDialogOpen(true);
                                                          setIsDropdownOpen(false);
                                                      }}>
                                        Supprimer <Trash className="h-4 w-4 ml-4"/>
                                    </DropdownMenuItem>

                                </>
                            ) : null}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <div className="mt-3 px-12 pb-6 text-sm">
                    {isEditing ? (
                        <textarea
                            className="w-full bg-gray-800 text-white p-2 rounded-lg focus:outline-none focus:ring focus:border-blue-500"
                            value={editedContent}
                            onChange={(e) => setEditedContent(e.target.value)}/>
                    ) : (
                        <div className="text-white">{editedContent}</div>
                    )}
                </div>

                {isEditing && (
                    <div className="flex justify-end px-12">
                        <Button
                            className="bg-purple-highlight text-white px-2 py-1 rounded-md mr-2 text-xs h-8 min-w-[60px]"
                            onClick={handleEditPost}
                        >
                            Sauvegarder
                        </Button>
                        <Button
                            className="bg-gray-500 text-white px-2 py-1 rounded-md text-xs h-8 min-w-[60px]"
                            onClick={() => {
                                setIsEditing(false);
                                setEditedContent(post.content);
                            }}
                        >
                            Annuler
                        </Button>
                    </div>
                )}

                {Array.isArray(post.images) && post.images.length > 0 && (
                    <div className="grid gap-2 mt-3 rounded-lg overflow-hidden"
                         style={{gridTemplateColumns: `repeat(${Math.min(post.images.length, 2)}, 1fr)`}}>
                        {post.images.map((image, index) => (
                            <img
                                key={index}
                                src={image}
                                alt={`Post image ${index}`}
                                className={`w-full object-cover rounded-lg ${post.images.length === 1 ? "h-60" : "h-32"}`}/>
                        ))}
                    </div>
                )}

                <div className="flex justify-between items-center mt-3 px-12 text-xs">
                    <div className="flex items-center gap-1 text-gray-400">
                        <Heart className="w-4 h-4 text-red-400"/>
                        <span className="font-semibold">4</span>
                    </div>
                    <div className="text-gray-400">
                        {post.commentsCount} commentaires
                    </div>
                </div>

                <div className="flex justify-center items-center border-t border-gray-800 mt-3 pt-3 space-x-16 text-sm">
                    <ReactionButton
                        postId={post.id}
                        profileId={profileId}
                        actorFirstName={activeProfileInStorage?.firstName}
                        receiverId={post.author.id}
                        resourceType="POST"
                        initialHasLiked={post.hasLiked}
                    />
                    <button
                        className="flex items-center gap-1 text-gray-400 hover:text-white"
                        onClick={() => setShowComments(!showComments)}
                    >
                        Commenter
                    </button>

                    <button className="flex items-center gap-1 text-gray-400 hover:text-white">
                        <Send className="w-5 h-5"/> Partager
                    </button>
                </div>

                {showComments && <CommentSection postId={post.id}/>}
            </div>

            <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <AlertDialogContent className="bg-tertiary-black border-none">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                        <AlertDialogDescription>
                            Êtes-vous sûr de vouloir supprimer ce post ? Cette action est irréversible.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <Button className="bg-gray-500" onClick={() => setIsDialogOpen(false)}>Annuler</Button>
                        <AlertDialogAction className="bg-red-highlight"
                                           disabled={isDeleting}
                                           onClick={() => {
                                               handleDeletePost();
                                               setIsDialogOpen(false);
                                           }}>
                            {isDeleting ? "Suppression..." : "Supprimer"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
