import {Avatar, AvatarFallback, AvatarImage} from "@radix-ui/react-avatar";
import {Button} from "@/components/ui/button";
import {Loader2Icon} from "lucide-react";

export const ProfileHeader = ({
    userName,
    userProfilePicture,
    userRoles,
    isCurrentUser,
    isUploading,
    onProfilePictureChange,
}) => (
    <div className="flex flex-col md:flex-row md:space-x-6 border-b border-gray-200 pb-6 mb-6">
        <div className="flex flex-col items-center gap-4">
            <Avatar className="h-24 w-24 rounded-full border-2 border-gray-300">
                <AvatarImage
                    src={userProfilePicture}
                    alt={userName}
                    className="h-full w-full object-cover rounded-full"
                />
                <AvatarFallback className="bg-gray-200 text-gray-600 font-medium text-2xl">
                    {userName?.slice(0, 2).toUpperCase()}
                </AvatarFallback>
            </Avatar>

            {isCurrentUser && (
                <div className="flex flex-col items-center gap-2">
                    <input
                        type="file"
                        accept="image/*"
                        id="avatar-upload"
                        className="hidden"
                        onChange={onProfilePictureChange}
                        disabled={isUploading}
                    />
                    <Button variant="outline" className="w-full" asChild>
                        <label htmlFor="avatar-upload" className="cursor-pointer">
                            {isUploading ? (
                                <>
                                    Uploading...
                                    <Loader2Icon className="animate-spin h-4 w-4 ml-2" />
                                </>
                            ) : (
                                "Change Picture"
                            )}
                        </label>
                    </Button>
                </div>
            )}
        </div>

        <div className="mt-4 md:mt-0 text-center md:text-left">
            <h2 className="text-2xl font-semibold text-gray-900">{userName}</h2>
            <p className="text-sm text-gray-500 capitalize">{userRoles || "User"}</p>
        </div>
    </div>
);
